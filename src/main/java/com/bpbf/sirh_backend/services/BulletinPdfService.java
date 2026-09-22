package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.BulletinDto;
import com.bpbf.sirh_backend.dtos.BulletinLineDto;
import com.bpbf.sirh_backend.entities.Bulletin;
import com.bpbf.sirh_backend.entities.BulletinLine;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.repositories.BulletinRepository;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import com.bpbf.sirh_backend.repositories.FamilleEmployeRepository;
import com.bpbf.sirh_backend.repositories.IndemniteEmployeRepository;
import com.bpbf.sirh_backend.entities.IndemniteEmploye;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class BulletinPdfService {

    private final BulletinRepository bulletinRepository;
    private final EmployeeRepository employeeRepository;
    private final FamilleEmployeRepository familleRepository;
    private final IndemniteEmployeRepository indemniteRepository;

    private static final Color BPBF_BLUE = new Color(0, 96, 179);
    private static final Color HEADER_BG = new Color(241, 245, 249);
    private static final Color BORDER_COLOR = new Color(203, 213, 225);
    private static final Color TEXT_DARK = new Color(15, 23, 42);
    private static final Color TEXT_MUTED = new Color(100, 116, 139);

    private static final Font FONT_TITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BPBF_BLUE);
    private static final Font FONT_SUBTITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, TEXT_DARK);
    private static final Font FONT_HEADER_TH = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, TEXT_DARK);
    private static final Font FONT_CELL = FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_DARK);
    private static final Font FONT_CELL_BOLD = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, TEXT_DARK);
    private static final Font FONT_NET_LABEL = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, BPBF_BLUE);
    private static final Font FONT_NET_VAL = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BPBF_BLUE);
    private static final Font FONT_SMALL = FontFactory.getFont(FontFactory.HELVETICA, 7, TEXT_MUTED);
    private static final Font FONT_SMALL_BOLD = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7, TEXT_DARK);

    @Transactional(readOnly = true)
    public byte[] generateBulletinPdf(Long bulletinId) {
        Bulletin b = bulletinRepository.findByIdWithLines(bulletinId)
                .orElseGet(() -> bulletinRepository.findById(bulletinId)
                        .orElseThrow(() -> new ResourceNotFoundException("Bulletin introuvable avec l'ID : " + bulletinId)));

        return buildBulletinPdfDocument(b);
    }

    public byte[] generateBulletinPreviewPdf(BulletinDto dto) {
        return buildBulletinFromDto(dto);
    }

    @Transactional(readOnly = true)
    public byte[] generateRegistrePaiePdf(Long sessionPaieId) {
        List<Bulletin> bulletins = bulletinRepository.findBySessionPaieId(sessionPaieId);
        return buildRegistrePaieDocument(bulletins);
    }

    private byte[] buildBulletinPdfDocument(Bulletin b) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 25, 25, 25, 25);

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            Employee emp = b.getEmployee();
            String empName = emp != null ? ((emp.getPrenom() != null ? emp.getPrenom() : "") + " " + (emp.getNom() != null ? emp.getNom() : "")).trim().toUpperCase() : "AGENT";
            String matricule = emp != null && emp.getMatricule() != null ? emp.getMatricule() : "—";
            String fonction = emp != null && emp.getFonction() != null ? (emp.getFonction().getName() != null ? emp.getFonction().getName() : emp.getFonction().getCode()) : "Agent";
            String grade = computeGradeCode(emp);
            String modePmt = emp != null && emp.getModePaiement() != null ? emp.getModePaiement() : "Virement bancaire";
            String iban = emp != null && emp.getIban() != null ? emp.getIban() : (emp != null && emp.getBanque() != null ? emp.getBanque() : "—");
            int charges = 0;
            if (emp != null) {
                try {
                    charges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(emp.getId()));
                } catch (Exception ignored) {}
            }

            String codeBulletin = b.getCode() != null ? b.getCode() : ("BLT-" + b.getId());
            String periode = formatPeriode(b.getDateFrom(), b.getDateTo());
            String sessionType = b.getSessionPaie() != null && b.getSessionPaie().getTypeSession() != null 
                    ? b.getSessionPaie().getTypeSession() 
                    : (b.getTypeSession() != null ? b.getTypeSession() : "ORDINAIRE");
            String dateDebutStr = b.getDateFrom() != null ? b.getDateFrom().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "01/07/2026";
            String dateFinStr = b.getDateTo() != null ? b.getDateTo().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "31/07/2026";

            // 1. En-tête Banque & Cadre Session
            addHeader(document, codeBulletin, periode, sessionType, dateDebutStr, dateFinStr);

            // 2. Grille Employé (2 colonnes officielles)
            addEmployeeInfoGrid(document, emp, null, empName, matricule, fonction, grade, charges, b.getDateTo());

            // 3. Tableau des éléments de paie (5 colonnes officielles BPBF)
            addPayrollElementsTable(document, b);

            // 4. Bloc Règlements & Net à payer
            BigDecimal net = b.getSalaireNet() != null ? b.getSalaireNet() : BigDecimal.ZERO;
            String banqueNom = emp != null && emp.getBanque() != null && !emp.getBanque().isEmpty() ? emp.getBanque() : "BANQUE POSTALE DU BURKINA FASO";
            boolean isDummyCompte = iban == null || iban.isBlank() || iban.equals("—") 
                    || iban.contains("0000000000") || iban.contains("000000000000") 
                    || iban.equals("08000002501") || iban.contains("BF01 01001 000000000000 00");
            String compteBancaire = !isDummyCompte
                    ? iban
                    : (emp != null && emp.getMatricule() != null ? ("Compte BPBF — " + emp.getMatricule()) : "—");
            addPaymentAndNetSection(document, banqueNom, compteBancaire, net);

            // 5. Tableau Récapitulatif Mois & Exercice
            addSummaryTableMoisExercice(document, b);

            // 6. Mention officielle de conservation
            addOfficialFooterNotice(document);

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Erreur lors de la génération du PDF du bulletin : " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }

    private byte[] buildBulletinFromDto(BulletinDto dto) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 25, 25, 25, 25);

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            String empName = dto.getEmployeeName() != null ? dto.getEmployeeName().toUpperCase(Locale.ROOT) : "AGENT";
            String matricule = dto.getMatricule() != null ? dto.getMatricule() : "—";
            String fonction = dto.getFonction() != null ? dto.getFonction() : "Agent";
            String grade = "—";
            Employee empObj = null;
            if (dto.getEmployeeId() != null) {
                try {
                    empObj = employeeRepository.findById(dto.getEmployeeId()).orElse(null);
                    if (empObj != null) {
                        grade = computeGradeCode(empObj);
                    }
                } catch (Exception ignored) {}
            }
            if (grade == null || grade.equals("—")) {
                grade = formatStandardGrade(dto.getGradeLibelle(), "", "");
                if (grade == null || grade.isEmpty() || grade.equals("—")) {
                    grade = dto.getGradeLibelle() != null ? dto.getGradeLibelle() : (dto.getClassification() != null ? dto.getClassification() : "—");
                }
            }
            int charges = 0;
            if (empObj != null) {
                try {
                    charges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(empObj.getId()));
                } catch (Exception ignored) {}
            } else if (dto.getNombreCharges() != null) {
                charges = dto.getNombreCharges();
            }

            String codeBulletin = dto.getCode() != null ? dto.getCode() : "PREVIEW";
            String periode = formatPeriode(dto.getDateFrom(), dto.getDateTo());
            String sessionType = dto.getTypeSession() != null ? dto.getTypeSession() : "ORDINAIRE";
            String dateDebutStr = dto.getDateFrom() != null ? dto.getDateFrom().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "01/07/2026";
            String dateFinStr = dto.getDateTo() != null ? dto.getDateTo().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "31/07/2026";

            addHeader(document, codeBulletin, periode, sessionType, dateDebutStr, dateFinStr);
            addEmployeeInfoGrid(document, empObj, dto, empName, matricule, fonction, grade, charges, dto.getDateTo());
            addPayrollElementsTableFromDto(document, dto, empObj);

            BigDecimal net = dto.getSalaireNet() != null ? dto.getSalaireNet() : BigDecimal.ZERO;
            String banqueNom = empObj != null && empObj.getBanque() != null && !empObj.getBanque().isEmpty() 
                    ? empObj.getBanque() 
                    : (dto.getBanque() != null && !dto.getBanque().isBlank() ? dto.getBanque() : "BANQUE POSTALE DU BURKINA FASO");
            String rawIban = empObj != null && empObj.getIban() != null ? empObj.getIban() : dto.getNumeroCompteBancaire();
            boolean isDummyIban = rawIban == null || rawIban.isBlank() || rawIban.equals("—")
                    || rawIban.contains("0000000000") || rawIban.contains("000000000000")
                    || rawIban.equals("08000002501") || rawIban.contains("BF01 01001 000000000000 00");
            String compteIban = !isDummyIban
                    ? rawIban
                    : (matricule != null && !matricule.equals("—") ? ("Compte BPBF — " + matricule) : "—");
            addPaymentAndNetSection(document, banqueNom, compteIban, net);

            addSummaryTableMoisExerciceFromDto(document, dto);
            addOfficialFooterNotice(document);

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Erreur lors de la génération du PDF preview : " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }

    private void addHeader(Document doc, String code, String periode, String sessionType, String dateDebut, String dateFin) throws DocumentException {
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{58, 42});
        headerTable.setSpacingAfter(8f);

        // Colonne gauche : Logo officiel BPBF + Raison sociale & Boîte postale
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(Rectangle.NO_BORDER);
        leftCell.setPadding(0f);

        boolean logoLoaded = false;
        try {
            byte[] logoBytes = null;
            java.io.InputStream is = getClass().getResourceAsStream("/static/bpbf-logo.png");
            if (is == null) is = getClass().getResourceAsStream("/bpbf-logo.png");
            if (is == null) {
                ClassLoader cl = Thread.currentThread().getContextClassLoader();
                if (cl != null) {
                    is = cl.getResourceAsStream("static/bpbf-logo.png");
                    if (is == null) is = cl.getResourceAsStream("bpbf-logo.png");
                }
            }
            if (is == null) {
                Resource logoRes = new ClassPathResource("static/bpbf-logo.png");
                if (logoRes.exists()) is = logoRes.getInputStream();
            }
            if (is == null) {
                Resource logoRes = new ClassPathResource("bpbf-logo.png");
                if (logoRes.exists()) is = logoRes.getInputStream();
            }
            if (is != null) {
                logoBytes = is.readAllBytes();
                is.close();
            }
            if (logoBytes != null && logoBytes.length > 0) {
                Image img = Image.getInstance(logoBytes);
                // Dimensions officielles BPBF : 283pt x 57pt (large et imposant comme Image 1)
                img.scaleToFit(280f, 58f);
                img.setAlignment(Element.ALIGN_LEFT);
                leftCell.addElement(img);
                logoLoaded = true;
            }
        } catch (Exception ignored) {}

        if (!logoLoaded) {
            Paragraph pBank = new Paragraph("BPBF", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BPBF_BLUE));
            leftCell.addElement(pBank);
        }

        Paragraph pBankName = new Paragraph("BANQUE POSTALE DU BURKINA FASO", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, TEXT_DARK));
        pBankName.setSpacingBefore(3f);
        Paragraph pBp = new Paragraph("BP 1366 OUAGADOUGOU CNTC", FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_DARK));
        leftCell.addElement(pBankName);
        leftCell.addElement(pBp);
        headerTable.addCell(leftCell);

        // Colonne droite : Cadre d'identification de la Session
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(Rectangle.BOX);
        rightCell.setBorderWidth(1f);
        rightCell.setBorderColor(TEXT_DARK);
        rightCell.setPadding(5f);
        rightCell.setBackgroundColor(HEADER_BG);

        Paragraph pTitre = new Paragraph("BULLETIN DE PAIE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, TEXT_DARK));
        pTitre.setAlignment(Element.ALIGN_CENTER);
        rightCell.addElement(pTitre);

        Paragraph pPer = new Paragraph("PERIODE : " + (periode != null ? periode : "Juillet 2026"), FONT_SMALL);
        Paragraph pSess = new Paragraph("SESSION : " + (sessionType != null ? sessionType.toUpperCase(Locale.ROOT) : "ORDINAIRE"), FONT_SMALL);
        Paragraph pDeb = new Paragraph("DEBUT : " + (dateDebut != null ? dateDebut : "01/07/2026"), FONT_SMALL);
        Paragraph pFin = new Paragraph("FIN : " + (dateFin != null ? dateFin : "31/07/2026"), FONT_SMALL);

        rightCell.addElement(pPer);
        rightCell.addElement(pSess);
        rightCell.addElement(pDeb);
        rightCell.addElement(pFin);

        headerTable.addCell(rightCell);
        doc.add(headerTable);
    }

    private void addEmployeeInfoGrid(Document doc, Employee emp, BulletinDto dto, String name, String mat, String fct, String grp, int charges, LocalDate refDate) throws DocumentException {
        PdfPTable box = new PdfPTable(2);
        box.setWidthPercentage(100);
        box.setWidths(new float[]{52, 48});
        box.setSpacingAfter(8f);

        String nom = "—";
        String prenom = "—";
        if (emp != null) {
            if (emp.getNom() != null && !emp.getNom().isBlank()) nom = emp.getNom().toUpperCase(Locale.ROOT);
            if (emp.getPrenom() != null && !emp.getPrenom().isBlank()) prenom = emp.getPrenom().toUpperCase(Locale.ROOT);
        } else if (dto != null) {
            if (dto.getEmployeeNom() != null && !dto.getEmployeeNom().isBlank()) nom = dto.getEmployeeNom().toUpperCase(Locale.ROOT);
            if (dto.getEmployeePrenom() != null && !dto.getEmployeePrenom().isBlank()) prenom = dto.getEmployeePrenom().toUpperCase(Locale.ROOT);
            if (nom.equals("—") && dto.getEmployeeName() != null && !dto.getEmployeeName().isBlank()) {
                String[] p = dto.getEmployeeName().trim().split(" ");
                nom = p[0].toUpperCase(Locale.ROOT);
                prenom = p.length > 1 ? dto.getEmployeeName().trim().substring(p[0].length()).trim().toUpperCase(Locale.ROOT) : "—";
            }
        }
        if (nom.equals("—") && name != null && !name.isBlank() && !name.equals("—")) {
            String[] p = name.trim().split(" ");
            nom = p[0].toUpperCase(Locale.ROOT);
            prenom = p.length > 1 ? name.trim().substring(p[0].length()).trim().toUpperCase(Locale.ROOT) : "—";
        }

        String emploi = "—";
        if (fct != null && !fct.isEmpty() && !fct.equals("Agent") && !fct.equals("—")) {
            emploi = fct;
        } else if (emp != null && emp.getEmploi() != null && emp.getEmploi().getName() != null) {
            emploi = emp.getEmploi().getName();
        } else if (dto != null && dto.getEmploi() != null && !dto.getEmploi().isBlank() && !dto.getEmploi().equals("—")) {
            emploi = dto.getEmploi();
        } else if (dto != null && dto.getFonction() != null && !dto.getFonction().isBlank() && !dto.getFonction().equals("—")) {
            emploi = dto.getFonction();
        } else if (fct != null) {
            emploi = fct;
        }

        String rawDateEmb = (emp != null && emp.getDateEmbauche() != null && !emp.getDateEmbauche().isBlank())
                ? emp.getDateEmbauche()
                : (dto != null && dto.getDateEmbauche() != null ? dto.getDateEmbauche() : null);
        String dateEmb = formatDateClean(rawDateEmb);

        String serviceNom = "—";
        if (emp != null) {
            if (emp.getService() != null && emp.getService().getName() != null && !emp.getService().getName().isBlank()) {
                serviceNom = emp.getService().getName();
            } else if (emp.getDepartment() != null && emp.getDepartment().getName() != null && !emp.getDepartment().getName().isBlank()) {
                serviceNom = emp.getDepartment().getName();
            } else if (emp.getDirection() != null && emp.getDirection().getName() != null && !emp.getDirection().getName().isBlank()) {
                serviceNom = emp.getDirection().getName();
            }
        }
        if (serviceNom.equals("—") && dto != null) {
            if (dto.getService() != null && !dto.getService().isBlank()) serviceNom = dto.getService();
            else if (dto.getDepartement() != null && !dto.getDepartement().isBlank()) serviceNom = dto.getDepartement();
        }

        String cnssNum = "—";
        String rawCnss = (emp != null && emp.getNumeroCnss() != null) ? emp.getNumeroCnss() : (dto != null ? dto.getNumeroCnss() : null);
        if (rawCnss != null && !rawCnss.isBlank() && !rawCnss.equalsIgnoreCase("CNI") && !rawCnss.equals("—")) {
            cnssNum = rawCnss.trim();
        }
        
        String sitFamille = "Célibataire";
        if (emp != null) {
            if (emp.getSituationFamiliale() != null && !emp.getSituationFamiliale().isBlank() && !emp.getSituationFamiliale().equals("—")) {
                sitFamille = emp.getSituationFamiliale().trim();
            } else if (emp.getSituationMatrimoniale() != null && !emp.getSituationMatrimoniale().isBlank() && !emp.getSituationMatrimoniale().equals("—")) {
                sitFamille = emp.getSituationMatrimoniale().trim();
            } else {
                try {
                    boolean hasConjoint = familleRepository.findByEmployeeId(emp.getId()).stream()
                            .anyMatch(m -> m.getLienParente() == com.bpbf.sirh_backend.entities.LienParente.CONJOINT);
                    sitFamille = hasConjoint ? "Marié" : "Célibataire";
                } catch (Exception ignored) {
                    sitFamille = "Célibataire";
                }
            }
        } else if (dto != null) {
            if (dto.getSituationFamiliale() != null && !dto.getSituationFamiliale().isBlank() && !dto.getSituationFamiliale().equals("—")) {
                sitFamille = dto.getSituationFamiliale().trim();
            } else if (dto.getSituationMatrimoniale() != null && !dto.getSituationMatrimoniale().isBlank() && !dto.getSituationMatrimoniale().equals("—")) {
                sitFamille = dto.getSituationMatrimoniale().trim();
            }
        }
        if (sitFamille.equals("—") || sitFamille.isBlank()) {
            sitFamille = "Célibataire";
        }

        int partsFiscales;
        if (dto != null && dto.getPartsFiscales() != null) {
            partsFiscales = dto.getPartsFiscales();
        } else {
            partsFiscales = charges;
        }

        String classification = grp != null && !grp.isEmpty() && !grp.equals("—") 
                ? grp 
                : (dto != null && dto.getClassification() != null && !dto.getClassification().equals("—") ? dto.getClassification() : computeGradeCode(emp));

        int anciennete = (emp != null && emp.getAncienneteReprise() != null && emp.getAncienneteReprise() > 0) ? emp.getAncienneteReprise() : 0;
        if (rawDateEmb != null && !rawDateEmb.isBlank()) {
            try {
                String cleanDateIso = rawDateEmb.contains("T") ? rawDateEmb.split("T")[0] : rawDateEmb.trim();
                LocalDate dEmb = LocalDate.parse(cleanDateIso);
                LocalDate target = refDate != null ? refDate : LocalDate.now();
                anciennete += Math.max(0, java.time.Period.between(dEmb, target).getYears());
            } catch (Exception ignored) {}
        }
        if (anciennete == 0 && dto != null) {
            if (dto.getAnciennete() != null && dto.getAnciennete() > 0) anciennete = dto.getAnciennete();
            else if (dto.getAncienneteAnnees() != null && dto.getAncienneteAnnees() > 0) anciennete = dto.getAncienneteAnnees();
        }

        // Colonne Gauche
        PdfPCell c1 = new PdfPCell();
        c1.setBorder(Rectangle.BOX);
        c1.setBorderColor(BORDER_COLOR);
        c1.setPadding(5f);

        c1.addElement(new Paragraph("NOM           : " + nom, FONT_CELL_BOLD));
        c1.addElement(new Paragraph("PRENOM        : " + prenom, FONT_CELL_BOLD));
        c1.addElement(new Paragraph("EMPLOI        : " + emploi, FONT_CELL));
        c1.addElement(new Paragraph("DATE EMBAUCHE : " + dateEmb, FONT_CELL));
        c1.addElement(new Paragraph("SERVICE       : " + serviceNom, FONT_CELL));
        c1.addElement(new Paragraph("N° CNSS       : " + cnssNum, FONT_CELL));
        box.addCell(c1);

        // Colonne Droite
        PdfPCell c2 = new PdfPCell();
        c2.setBorder(Rectangle.BOX);
        c2.setBorderColor(BORDER_COLOR);
        c2.setPadding(5f);

        c2.addElement(new Paragraph("MATRICULE     : " + mat, FONT_CELL_BOLD));
        c2.addElement(new Paragraph("SIT FAMILLE   : " + sitFamille, FONT_CELL));
        c2.addElement(new Paragraph("PARTS FISCALES: " + partsFiscales, FONT_CELL));
        c2.addElement(new Paragraph("CLASSIFICATION: " + classification, FONT_CELL_BOLD));
        c2.addElement(new Paragraph("ANCIENNETE    : " + anciennete, FONT_CELL));
        box.addCell(c2);

        doc.add(box);
    }

    private String formatDateClean(String rawDate) {
        if (rawDate == null || rawDate.isBlank() || rawDate.equals("—")) return "—";
        String s = rawDate.trim();
        if (s.contains("T")) {
            s = s.split("T")[0];
        }
        if (s.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
            String[] p = s.split("-");
            return p[2] + "/" + p[1] + "/" + p[0];
        }
        return s;
    }

    private static class DisplayLine {
        final String code;
        final String libelle;
        final String baseStr;
        final String tauxStr;
        final BigDecimal avoir;
        final BigDecimal retenue;
        final int sortWeight;

        DisplayLine(String code, String libelle, String baseStr, String tauxStr, BigDecimal avoir, BigDecimal retenue, int sortWeight) {
            this.code = code != null ? code : "";
            this.libelle = libelle != null ? libelle : "";
            this.baseStr = baseStr != null ? baseStr : "";
            this.tauxStr = tauxStr != null ? tauxStr : "";
            this.avoir = avoir;
            this.retenue = retenue;
            this.sortWeight = sortWeight;
        }
    }

    private void addPayrollElementsTable(Document doc, Bulletin b) throws DocumentException {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{38, 17, 15, 15, 15});
        table.setSpacingAfter(6f);

        // En-têtes officiels BPBF (5 colonnes)
        addHeaderCell(table, "ELEMENT DE SALAIRE", Element.ALIGN_LEFT);
        addHeaderCell(table, "BASE", Element.ALIGN_RIGHT);
        addHeaderCell(table, "TAUX/NB", Element.ALIGN_CENTER);
        addHeaderCell(table, "AVOIRS", Element.ALIGN_RIGHT);
        addHeaderCell(table, "RETENUES", Element.ALIGN_RIGHT);

        String daysStr = b.getWorkedDays() != null ? b.getWorkedDays().stripTrailingZeros().toPlainString() : "30";
        List<DisplayLine> displayLines = new ArrayList<>();
        List<BulletinLine> existingLines = b.getLines() != null ? b.getLines() : List.of();

        // 1. Salaire de base
        BulletinLine salBaseL = existingLines.stream().filter(l -> "SAL_BASE".equalsIgnoreCase(l.getCode())).findFirst().orElse(null);
        BigDecimal salBaseAmount = b.getSalaireBase();
        BigDecimal salBaseBase = (salBaseL != null && salBaseL.getBaseCalcul() != null && salBaseL.getBaseCalcul().compareTo(BigDecimal.ZERO) > 0)
                ? salBaseL.getBaseCalcul()
                : (b.getSalaireBase() != null ? b.getSalaireBase() : BigDecimal.ZERO);
        String salBaseDays = (salBaseL != null && salBaseL.getTaux() != null && salBaseL.getTaux().compareTo(BigDecimal.ZERO) > 0 && salBaseL.getTaux().compareTo(new BigDecimal("31.00")) <= 0)
                ? salBaseL.getTaux().stripTrailingZeros().toPlainString()
                : daysStr;
        if (salBaseAmount != null && salBaseAmount.compareTo(BigDecimal.ZERO) > 0) {
            displayLines.add(new DisplayLine("SAL_BASE", "SALAIRE DE BASE", formatMoney(salBaseBase), salBaseDays, salBaseAmount, null, 0));
        }

        // 2. Sursalaire
        BulletinLine surSalL = existingLines.stream().filter(l -> "SUR_SALAIRE".equalsIgnoreCase(l.getCode())).findFirst().orElse(null);
        BigDecimal surSalAmount = b.getSurSalaire();
        BigDecimal surSalBase = (surSalL != null && surSalL.getBaseCalcul() != null && surSalL.getBaseCalcul().compareTo(BigDecimal.ZERO) > 0)
                ? surSalL.getBaseCalcul()
                : (b.getSurSalaire() != null ? b.getSurSalaire() : BigDecimal.ZERO);
        String surSalDays = (surSalL != null && surSalL.getTaux() != null && surSalL.getTaux().compareTo(BigDecimal.ZERO) > 0 && surSalL.getTaux().compareTo(new BigDecimal("31.00")) <= 0)
                ? surSalL.getTaux().stripTrailingZeros().toPlainString()
                : daysStr;
        if (surSalAmount != null && surSalAmount.compareTo(BigDecimal.ZERO) > 0) {
            displayLines.add(new DisplayLine("SUR_SALAIRE", "SUR-SALAIRE", formatMoney(surSalBase), surSalDays, surSalAmount, null, 1));
        }

        // 3. Examiner les lignes du bulletin
        boolean hasAggregatedIndemnites = false;
        boolean hasIndividualIndemnites = false;
        boolean hasCrraeLine = false;

        for (BulletinLine l : existingLines) {
            String code = l.getCode() != null ? l.getCode().toUpperCase(Locale.ROOT) : "";
            String rawLib = l.getLibelle() != null ? l.getLibelle() : "";
            String lib = rawLib.replaceAll("[()]", "").replaceAll("\\s+", " ").trim().toUpperCase(Locale.ROOT);

            if ("SAL_BASE".equals(code) || "SUR_SALAIRE".equals(code) || "NET_PAYE".equals(code)) continue;

            if (lib.contains("INDEMNIT") && lib.contains("TOTAL")) {
                hasAggregatedIndemnites = true;
                continue;
            }
            if (code.startsWith("IND_") || (code.contains("INDEMNITE") && !lib.contains("TOTAL"))) {
                hasIndividualIndemnites = true;
            }
            if (code.contains("CRRAE") || lib.contains("CRRAE")) {
                hasCrraeLine = true;
            }

            boolean isGain = "GAIN".equalsIgnoreCase(l.getTypeLigne());
            boolean isRetenue = "RETENUE".equalsIgnoreCase(l.getTypeLigne()) ||
                    "RETENUE_SOCIALE".equalsIgnoreCase(l.getTypeLigne()) ||
                    "IMPOT".equalsIgnoreCase(l.getTypeLigne()) ||
                    "PRECOMPTE".equalsIgnoreCase(l.getTypeLigne());

            String baseStr = l.getBaseCalcul() != null && l.getBaseCalcul().compareTo(BigDecimal.ZERO) > 0 ? formatMoney(l.getBaseCalcul()) : "";
            String tauxStr = "";
            if (code.contains("IUTS") || lib.contains("IUTS")) {
                lib = "RETENUE IUTS";
                if (l.getTaux() != null) {
                    tauxStr = String.valueOf(l.getTaux().intValue());
                } else {
                    tauxStr = "0";
                }
            } else if (code.contains("CNSS") || lib.contains("CNSS")) {
                lib = "COTISATION CNSS";
                tauxStr = "5,5 %";
            } else if (code.contains("CRRAE") || lib.contains("CRRAE")) {
                lib = "COTISATION CRRAE/RCPNC";
                tauxStr = "6 %";
            } else if (code.contains("SOLIDAR") || lib.contains("SOLIDAR") || code.contains("FSP")) {
                lib = "RETENUE FONDS DE SOLIDARITE";
                tauxStr = "1 %";
            } else if (code.contains("ANC")) {
                tauxStr = (l.getTaux() != null ? l.getTaux().stripTrailingZeros().toPlainString() : "0") + " %";
            } else if (l.getTaux() != null && l.getTaux().compareTo(BigDecimal.ZERO) > 0) {
                tauxStr = l.getTaux().stripTrailingZeros().toPlainString() + " %";
            }

            BigDecimal mnt = l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO;
            BigDecimal avoir = isGain ? mnt : null;
            BigDecimal retenue = isRetenue ? mnt : (isGain ? null : mnt);

            int weight = BulletinService.getOverallLineSortWeight(code, lib, l.getTypeLigne());
            displayLines.add(new DisplayLine(code, lib, baseStr, tauxStr, avoir, retenue, weight));
        }

        displayLines.removeIf(dl -> (dl.avoir == null || dl.avoir.compareTo(BigDecimal.ZERO) <= 0) && (dl.retenue == null || dl.retenue.compareTo(BigDecimal.ZERO) <= 0));

        // 4. Si indemnités agrégées ou manquantes alors que totalIndemnites > 0, ventiler les indemnités réelles
        if ((hasAggregatedIndemnites || !hasIndividualIndemnites) && b.getTotalIndemnites() != null && b.getTotalIndemnites().compareTo(BigDecimal.ZERO) > 0 && b.getEmployee() != null) {
            List<IndemniteEmploye> realIndemnites = indemniteRepository.findByEmployeeId(b.getEmployee().getId());
            for (IndemniteEmploye ind : realIndemnites) {
                if (Boolean.FALSE.equals(ind.getActif())) continue;
                String iCode = ind.getTypeIndemnite() != null && ind.getTypeIndemnite().getCode() != null ? ind.getTypeIndemnite().getCode().toUpperCase(Locale.ROOT) : "IND";
                String iLib = (ind.getLibelle() != null ? ind.getLibelle() : (ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getName() : "INDEMNITE")).toUpperCase(Locale.ROOT);

                if (Boolean.TRUE.equals(b.getEmployee().getVehiculeFourni()) && (iCode.contains("TRP") || iLib.contains("TRANSPORT"))) continue;
                if (Boolean.TRUE.equals(b.getEmployee().getLogementFourni()) && (iCode.contains("LOG") || iLib.contains("LOGEMENT"))) continue;

                BigDecimal mnt = ind.getMontant() != null ? BigDecimal.valueOf(ind.getMontant()) : BigDecimal.ZERO;
                if (mnt.compareTo(BigDecimal.ZERO) > 0) {
                    displayLines.add(new DisplayLine(iCode, iLib, formatMoney(mnt), "100 %", mnt, null, 10));
                }
            }
        }

        // 5. Garantir la ligne CRRAE si montant CRRAE > 0 et absente
        BigDecimal mntCrrae = extractCrraeFromBulletin(b);
        if (!hasCrraeLine && mntCrrae.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal baseCrrae = BigDecimal.ZERO;
            if (b.getSalaireBase() != null) baseCrrae = baseCrrae.add(b.getSalaireBase());
            if (b.getSurSalaire() != null) baseCrrae = baseCrrae.add(b.getSurSalaire());
            displayLines.add(new DisplayLine("COTIS_CRRAE", "COTISATION CRRAE/RCPNC", formatMoney(baseCrrae), "3 %", null, mntCrrae, 35));
        }

        // 6. Vérifier la somme des retenues par rapport à totalRetenues pour équilibre parfait
        BigDecimal totRetenuesTarget = b.getTotalRetenues() != null ? b.getTotalRetenues() : BigDecimal.ZERO;
        BigDecimal currentSumRet = displayLines.stream().map(l -> l.retenue != null ? l.retenue : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal diffRet = totRetenuesTarget.subtract(currentSumRet);
        if (diffRet.compareTo(new BigDecimal("1.00")) >= 0) {
            displayLines.add(new DisplayLine("RET_SOLIDARITE", "RETENUE FONDS DE SOLIDARITE", "", "1 %", null, diffRet, 40));
        }

        // 7. Trier les lignes
        displayLines.sort(Comparator.comparingInt(l -> l.sortWeight));

        // 8. Écrire les lignes dans la table PDF
        for (DisplayLine line : displayLines) {
            addRowCell(table, line.libelle, Element.ALIGN_LEFT, false);
            addRowCell(table, line.baseStr, Element.ALIGN_RIGHT, false);
            addRowCell(table, line.tauxStr, Element.ALIGN_CENTER, false);
            addRowCell(table, line.avoir != null ? formatMoney(line.avoir) : "", Element.ALIGN_RIGHT, false);
            addRowCell(table, line.retenue != null ? formatMoney(line.retenue) : "", Element.ALIGN_RIGHT, false);
        }

        // Ligne Totaux officielle BPBF
        BigDecimal totalAvoirs = b.getSalaireBrut() != null ? b.getSalaireBrut() : (b.getTotalAvoirs() != null ? b.getTotalAvoirs() : BigDecimal.ZERO);
        BigDecimal totalRetenues = b.getTotalRetenues() != null ? b.getTotalRetenues() : BigDecimal.ZERO;

        addTotalCell(table, "TOTAL", Element.ALIGN_RIGHT, 3);
        addTotalCell(table, formatMoney(totalAvoirs), Element.ALIGN_RIGHT, 1);
        addTotalCell(table, formatMoney(totalRetenues), Element.ALIGN_RIGHT, 1);

        doc.add(table);
    }

    private void addPayrollElementsTableFromDto(Document doc, BulletinDto dto, Employee emp) throws DocumentException {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{38, 17, 15, 15, 15});
        table.setSpacingAfter(6f);

        addHeaderCell(table, "ELEMENT DE SALAIRE", Element.ALIGN_LEFT);
        addHeaderCell(table, "BASE", Element.ALIGN_RIGHT);
        addHeaderCell(table, "TAUX/NB", Element.ALIGN_CENTER);
        addHeaderCell(table, "AVOIRS", Element.ALIGN_RIGHT);
        addHeaderCell(table, "RETENUES", Element.ALIGN_RIGHT);

        String daysStr = dto.getWorkedDays() != null ? dto.getWorkedDays().stripTrailingZeros().toPlainString() : "30";
        List<DisplayLine> displayLines = new ArrayList<>();
        List<com.bpbf.sirh_backend.dtos.BulletinLineDto> dLines = dto.getLines() != null ? dto.getLines() : List.of();

        // 1. Salaire de base
        com.bpbf.sirh_backend.dtos.BulletinLineDto salBaseL = dLines.stream().filter(l -> "SAL_BASE".equalsIgnoreCase(l.getCode())).findFirst().orElse(null);
        BigDecimal salBaseAmount = dto.getSalaireBase();
        BigDecimal salBaseBase = (salBaseL != null && salBaseL.getBaseCalcul() != null && salBaseL.getBaseCalcul().compareTo(BigDecimal.ZERO) > 0)
                ? salBaseL.getBaseCalcul()
                : (dto.getSalaireBase() != null ? dto.getSalaireBase() : BigDecimal.ZERO);
        String salBaseDays = (salBaseL != null && salBaseL.getTaux() != null && salBaseL.getTaux().compareTo(BigDecimal.ZERO) > 0 && salBaseL.getTaux().compareTo(new BigDecimal("31.00")) <= 0)
                ? salBaseL.getTaux().stripTrailingZeros().toPlainString()
                : daysStr;
        if (salBaseAmount != null && salBaseAmount.compareTo(BigDecimal.ZERO) > 0) {
            displayLines.add(new DisplayLine("SAL_BASE", "SALAIRE DE BASE", formatMoney(salBaseBase), salBaseDays, salBaseAmount, null, 0));
        }

        // 2. Sursalaire
        com.bpbf.sirh_backend.dtos.BulletinLineDto surSalL = dLines.stream().filter(l -> "SUR_SALAIRE".equalsIgnoreCase(l.getCode())).findFirst().orElse(null);
        BigDecimal surSalAmount = dto.getSurSalaire();
        BigDecimal surSalBase = (surSalL != null && surSalL.getBaseCalcul() != null && surSalL.getBaseCalcul().compareTo(BigDecimal.ZERO) > 0)
                ? surSalL.getBaseCalcul()
                : (dto.getSurSalaire() != null ? dto.getSurSalaire() : BigDecimal.ZERO);
        String surSalDays = (surSalL != null && surSalL.getTaux() != null && surSalL.getTaux().compareTo(BigDecimal.ZERO) > 0 && surSalL.getTaux().compareTo(new BigDecimal("31.00")) <= 0)
                ? surSalL.getTaux().stripTrailingZeros().toPlainString()
                : daysStr;
        if (surSalAmount != null && surSalAmount.compareTo(BigDecimal.ZERO) > 0) {
            displayLines.add(new DisplayLine("SUR_SALAIRE", "SUR-SALAIRE", formatMoney(surSalBase), surSalDays, surSalAmount, null, 1));
        }

        boolean hasAggregatedIndemnites = false;
        boolean hasIndividualIndemnites = false;
        boolean hasCrraeLine = false;

        if (dto.getLines() != null && !dto.getLines().isEmpty()) {
            for (com.bpbf.sirh_backend.dtos.BulletinLineDto l : dto.getLines()) {
                String code = l.getCode() != null ? l.getCode().toUpperCase(Locale.ROOT) : "";
                String rawLib = l.getLibelle() != null ? l.getLibelle() : (l.getName() != null ? l.getName() : code);
                String lib = rawLib.replaceAll("[()]", "").replaceAll("\\s+", " ").trim().toUpperCase(Locale.ROOT);

                if ("SAL_BASE".equals(code) || "SUR_SALAIRE".equals(code) || "NET_PAYE".equals(code)) continue;

                if (lib.contains("INDEMNIT") && lib.contains("TOTAL")) {
                    hasAggregatedIndemnites = true;
                    continue;
                }
                if (code.startsWith("IND_") || (code.contains("INDEMNITE") && !lib.contains("TOTAL"))) {
                    hasIndividualIndemnites = true;
                }
                if (code.contains("CRRAE") || lib.contains("CRRAE")) {
                    hasCrraeLine = true;
                }

                boolean isGain = "GAIN".equalsIgnoreCase(l.getTypeLigne()) || "AVOIR".equalsIgnoreCase(l.getTypeLigne());
                boolean isRetenue = "RETENUE".equalsIgnoreCase(l.getTypeLigne()) || 
                        "RETENUE_SOCIALE".equalsIgnoreCase(l.getTypeLigne()) || 
                        "IMPOT".equalsIgnoreCase(l.getTypeLigne()) || 
                        "PRECOMPTE".equalsIgnoreCase(l.getTypeLigne());

                String baseStr = l.getBaseCalcul() != null && l.getBaseCalcul().compareTo(BigDecimal.ZERO) > 0 ? formatMoney(l.getBaseCalcul()) : "";
                String tauxStr = "";
                if (code.contains("IUTS")) {
                    if (l.getTaux() != null && l.getTaux().compareTo(BigDecimal.ZERO) > 0) {
                        tauxStr = l.getTaux().stripTrailingZeros().toPlainString() + " %";
                    } else {
                        tauxStr = "Barème";
                    }
                } else if (code.contains("ANC")) {
                    tauxStr = (l.getTaux() != null ? l.getTaux().stripTrailingZeros().toPlainString() : "0") + " %";
                } else if (l.getTaux() != null && l.getTaux().compareTo(BigDecimal.ZERO) > 0) {
                    tauxStr = l.getTaux().stripTrailingZeros().toPlainString() + " %";
                }

                BigDecimal mnt = l.getMontant() != null ? l.getMontant() : (l.getAmount() != null ? BigDecimal.valueOf(Math.abs(l.getAmount())) : BigDecimal.ZERO);
                BigDecimal avoir = isGain ? mnt : null;
                BigDecimal retenue = isRetenue ? mnt : (isGain ? null : mnt);

                int weight = BulletinService.getOverallLineSortWeight(code, lib, l.getTypeLigne());
                displayLines.add(new DisplayLine(code, lib, baseStr, tauxStr, avoir, retenue, weight));
            }
        }

        displayLines.removeIf(dl -> (dl.avoir == null || dl.avoir.compareTo(BigDecimal.ZERO) <= 0) && (dl.retenue == null || dl.retenue.compareTo(BigDecimal.ZERO) <= 0));

        // Si indemnités agrégées ou manquantes
        if ((hasAggregatedIndemnites || !hasIndividualIndemnites) && dto.getTotalIndemnites() != null && dto.getTotalIndemnites().compareTo(BigDecimal.ZERO) > 0 && emp != null) {
            List<IndemniteEmploye> realIndemnites = indemniteRepository.findByEmployeeId(emp.getId());
            for (IndemniteEmploye ind : realIndemnites) {
                if (Boolean.FALSE.equals(ind.getActif())) continue;
                String iCode = ind.getTypeIndemnite() != null && ind.getTypeIndemnite().getCode() != null ? ind.getTypeIndemnite().getCode().toUpperCase(Locale.ROOT) : "IND";
                String iLib = (ind.getLibelle() != null ? ind.getLibelle() : (ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getName() : "INDEMNITE")).toUpperCase(Locale.ROOT);

                if (Boolean.TRUE.equals(emp.getVehiculeFourni()) && (iCode.contains("TRP") || iLib.contains("TRANSPORT"))) continue;
                if (Boolean.TRUE.equals(emp.getLogementFourni()) && (iCode.contains("LOG") || iLib.contains("LOGEMENT"))) continue;

                BigDecimal mnt = ind.getMontant() != null ? BigDecimal.valueOf(ind.getMontant()) : BigDecimal.ZERO;
                if (mnt.compareTo(BigDecimal.ZERO) > 0) {
                    displayLines.add(new DisplayLine(iCode, iLib, formatMoney(mnt), "100 %", mnt, null, 10));
                }
            }
        }

        BigDecimal mntCrrae = extractCrraeFromDto(dto);
        if (!hasCrraeLine && mntCrrae.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal baseCrrae = BigDecimal.ZERO;
            if (dto.getSalaireBase() != null) baseCrrae = baseCrrae.add(dto.getSalaireBase());
            if (dto.getSurSalaire() != null) baseCrrae = baseCrrae.add(dto.getSurSalaire());
            displayLines.add(new DisplayLine("COTIS_CRRAE", "COTISATION CRRAE/RCPNC", formatMoney(baseCrrae), "3 %", null, mntCrrae, 35));
        }

        BigDecimal totRetenuesTarget = dto.getTotalRetenues() != null ? dto.getTotalRetenues() : BigDecimal.ZERO;
        BigDecimal currentSumRet = displayLines.stream().map(l -> l.retenue != null ? l.retenue : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal diffRet = totRetenuesTarget.subtract(currentSumRet);
        if (diffRet.compareTo(new BigDecimal("1.00")) >= 0) {
            displayLines.add(new DisplayLine("RET_SOLIDARITE", "RETENUE FONDS DE SOLIDARITE", "", "1 %", null, diffRet, 40));
        }

        displayLines.sort(Comparator.comparingInt(l -> l.sortWeight));

        for (DisplayLine line : displayLines) {
            addRowCell(table, line.libelle, Element.ALIGN_LEFT, false);
            addRowCell(table, line.baseStr, Element.ALIGN_RIGHT, false);
            addRowCell(table, line.tauxStr, Element.ALIGN_CENTER, false);
            addRowCell(table, line.avoir != null ? formatMoney(line.avoir) : "", Element.ALIGN_RIGHT, false);
            addRowCell(table, line.retenue != null ? formatMoney(line.retenue) : "", Element.ALIGN_RIGHT, false);
        }

        BigDecimal totalAvoirs = dto.getSalaireBrut() != null ? dto.getSalaireBrut() : (dto.getTotalAvoirs() != null ? dto.getTotalAvoirs() : BigDecimal.ZERO);
        BigDecimal totalRetenues = dto.getTotalRetenues() != null ? dto.getTotalRetenues() : BigDecimal.ZERO;

        addTotalCell(table, "TOTAL", Element.ALIGN_RIGHT, 3);
        addTotalCell(table, formatMoney(totalAvoirs), Element.ALIGN_RIGHT, 1);
        addTotalCell(table, formatMoney(totalRetenues), Element.ALIGN_RIGHT, 1);

        doc.add(table);
    }

    private void addPaymentAndNetSection(Document doc, String banqueNom, String iban, BigDecimal net) throws DocumentException {
        PdfPTable payNetTable = new PdfPTable(2);
        payNetTable.setWidthPercentage(100);
        payNetTable.setWidths(new float[]{62, 38});
        payNetTable.setSpacingAfter(8f);

        // Gauche : Règlements & Compte N°
        PdfPCell payCell = new PdfPCell();
        payCell.setBorder(Rectangle.NO_BORDER);
        payCell.setPadding(4f);
        payCell.addElement(new Paragraph("REGLEMENTS  : " + (banqueNom != null && !banqueNom.isBlank() ? banqueNom.replaceAll("[()]", "") : "Banque Postale du Burkina Faso - BPBF"), FONT_CELL_BOLD));
        
        String cleanIban = "—";
        if (iban != null && !iban.isBlank() && !iban.equals("—") && !iban.contains("0000000000") && !iban.equals("08000002501")) {
            cleanIban = iban.trim();
        }
        payCell.addElement(new Paragraph("COMPTE N°    : " + cleanIban, FONT_CELL_BOLD));
        payNetTable.addCell(payCell);

        // Droite : Cartouche NET A PAYER
        PdfPCell netCell = new PdfPCell();
        netCell.setBorder(Rectangle.BOX);
        netCell.setBorderWidth(1.2f);
        netCell.setBorderColor(TEXT_DARK);
        netCell.setPadding(6f);
        netCell.setBackgroundColor(HEADER_BG);

        PdfPTable innerNet = new PdfPTable(2);
        innerNet.setWidthPercentage(100);
        innerNet.setWidths(new float[]{50, 50});

        PdfPCell cLbl = new PdfPCell(new Phrase("NET A PAYER", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, TEXT_DARK)));
        cLbl.setBorder(Rectangle.NO_BORDER);
        cLbl.setVerticalAlignment(Element.ALIGN_MIDDLE);
        innerNet.addCell(cLbl);

        PdfPCell cVal = new PdfPCell(new Phrase(formatMoney(net), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, TEXT_DARK)));
        cVal.setBorder(Rectangle.NO_BORDER);
        cVal.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cVal.setVerticalAlignment(Element.ALIGN_MIDDLE);
        innerNet.addCell(cVal);

        netCell.addElement(innerNet);
        payNetTable.addCell(netCell);

        doc.add(payNetTable);
    }

    private BigDecimal extractCrraeFromBulletin(Bulletin b) {
        if (b == null) return BigDecimal.ZERO;
        if (b.getLines() != null) {
            for (BulletinLine line : b.getLines()) {
                String code = line.getCode() != null ? line.getCode().toUpperCase(Locale.ROOT) : "";
                String lib = line.getLibelle() != null ? line.getLibelle().toUpperCase(Locale.ROOT) : "";
                if (code.contains("CRRAE") || lib.contains("CRRAE")) {
                    return line.getMontant() != null ? line.getMontant() : BigDecimal.ZERO;
                }
            }
        }
        BigDecimal base = BigDecimal.ZERO;
        if (b.getSalaireBase() != null) base = base.add(b.getSalaireBase());
        if (b.getSurSalaire() != null) base = base.add(b.getSurSalaire());
        return base.multiply(new BigDecimal("0.03")).setScale(0, RoundingMode.HALF_UP);
    }

    private BigDecimal extractCrraeFromDto(BulletinDto dto) {
        if (dto == null) return BigDecimal.ZERO;
        if (dto.getCotisationCrrae() != null && dto.getCotisationCrrae().compareTo(BigDecimal.ZERO) > 0) {
            return dto.getCotisationCrrae();
        }
        if (dto.getLines() != null) {
            for (BulletinLineDto line : dto.getLines()) {
                String code = line.getCode() != null ? line.getCode().toUpperCase(Locale.ROOT) : "";
                String lib = (line.getLibelle() != null ? line.getLibelle() : (line.getName() != null ? line.getName() : "")).toUpperCase(Locale.ROOT);
                if (code.contains("CRRAE") || lib.contains("CRRAE")) {
                    return line.getMontant() != null ? line.getMontant() : (line.getAmount() != null ? BigDecimal.valueOf(Math.abs(line.getAmount())) : BigDecimal.ZERO);
                }
            }
        }
        BigDecimal base = BigDecimal.ZERO;
        if (dto.getSalaireBase() != null) base = base.add(dto.getSalaireBase());
        if (dto.getSurSalaire() != null) base = base.add(dto.getSurSalaire());
        return base.multiply(new BigDecimal("0.03")).setScale(0, RoundingMode.HALF_UP);
    }

    private BigDecimal extractCnssFromBulletin(Bulletin b) {
        if (b == null) return BigDecimal.ZERO;
        if (b.getCotisationCnss() != null && b.getCotisationCnss().compareTo(BigDecimal.ZERO) > 0) {
            return b.getCotisationCnss();
        }
        if (b.getLines() != null) {
            for (BulletinLine line : b.getLines()) {
                String code = line.getCode() != null ? line.getCode().toUpperCase(Locale.ROOT) : "";
                String lib = line.getLibelle() != null ? line.getLibelle().toUpperCase(Locale.ROOT) : "";
                if ((code.contains("CNSS") || lib.contains("CNSS")) && !code.contains("PATRON") && !lib.contains("PATRON")) {
                    if (line.getMontant() != null && line.getMontant().compareTo(BigDecimal.ZERO) > 0) {
                        return line.getMontant();
                    }
                }
            }
        }
        // Failsafe légal : 5.5% du brut
        BigDecimal brut = b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO;
        if (brut.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal baseCnss = brut.min(new BigDecimal("800000.00"));
            return baseCnss.multiply(new BigDecimal("0.055")).setScale(0, RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal extractCnssFromDto(BulletinDto dto) {
        if (dto == null) return BigDecimal.ZERO;
        if (dto.getCotisationCnss() != null && dto.getCotisationCnss().compareTo(BigDecimal.ZERO) > 0) {
            return dto.getCotisationCnss();
        }
        if (dto.getLines() != null) {
            for (BulletinLineDto line : dto.getLines()) {
                String code = line.getCode() != null ? line.getCode().toUpperCase(Locale.ROOT) : "";
                String lib = (line.getLibelle() != null ? line.getLibelle() : (line.getName() != null ? line.getName() : "")).toUpperCase(Locale.ROOT);
                if ((code.contains("CNSS") || lib.contains("CNSS")) && !code.contains("PATRON") && !lib.contains("PATRON")) {
                    if (line.getMontant() != null && line.getMontant().compareTo(BigDecimal.ZERO) > 0) {
                        return line.getMontant();
                    }
                    if (line.getAmount() != null && Math.abs(line.getAmount()) > 0) {
                        return BigDecimal.valueOf(Math.abs(line.getAmount()));
                    }
                }
            }
        }
        // Failsafe légal : 5.5% du brut
        BigDecimal brut = dto.getSalaireBrut() != null ? dto.getSalaireBrut() : BigDecimal.ZERO;
        if (brut.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal baseCnss = brut.min(new BigDecimal("800000.00"));
            return baseCnss.multiply(new BigDecimal("0.055")).setScale(0, RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal extractIutsFromBulletin(Bulletin b) {
        if (b == null) return BigDecimal.ZERO;
        if (b.getImpotIuts() != null && b.getImpotIuts().compareTo(BigDecimal.ZERO) > 0) {
            return b.getImpotIuts();
        }
        if (b.getLines() != null) {
            for (BulletinLine line : b.getLines()) {
                String code = line.getCode() != null ? line.getCode().toUpperCase(Locale.ROOT) : "";
                String lib = line.getLibelle() != null ? line.getLibelle().toUpperCase(Locale.ROOT) : "";
                if (code.contains("IUTS") || lib.contains("IUTS")) {
                    if (line.getMontant() != null && line.getMontant().compareTo(BigDecimal.ZERO) > 0) {
                        return line.getMontant();
                    }
                }
            }
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal extractIutsFromDto(BulletinDto dto) {
        if (dto == null) return BigDecimal.ZERO;
        if (dto.getImpotIuts() != null && dto.getImpotIuts().compareTo(BigDecimal.ZERO) > 0) {
            return dto.getImpotIuts();
        }
        if (dto.getLines() != null) {
            for (BulletinLineDto line : dto.getLines()) {
                String code = line.getCode() != null ? line.getCode().toUpperCase(Locale.ROOT) : "";
                String lib = (line.getLibelle() != null ? line.getLibelle() : (line.getName() != null ? line.getName() : "")).toUpperCase(Locale.ROOT);
                if (code.contains("IUTS") || lib.contains("IUTS")) {
                    if (line.getMontant() != null && line.getMontant().compareTo(BigDecimal.ZERO) > 0) {
                        return line.getMontant();
                    }
                    if (line.getAmount() != null && Math.abs(line.getAmount()) > 0) {
                        return BigDecimal.valueOf(Math.abs(line.getAmount()));
                    }
                }
            }
        }
        return BigDecimal.ZERO;
    }

    private void addSummaryTableMoisExercice(Document doc, Bulletin b) throws DocumentException {
        BigDecimal brutMois = b.getSalaireBrut() != null ? b.getSalaireBrut() : (b.getTotalAvoirs() != null ? b.getTotalAvoirs() : BigDecimal.ZERO);
        BigDecimal baseImpMois = b.getBaseImposable() != null ? b.getBaseImposable() : BigDecimal.ZERO;
        BigDecimal cnssMois = extractCnssFromBulletin(b);
        BigDecimal iutsMois = extractIutsFromBulletin(b);
        BigDecimal crraeMois = extractCrraeFromBulletin(b);

        BigDecimal cumulBrut = brutMois;
        BigDecimal cumulBaseImp = baseImpMois;
        BigDecimal cumulCnss = cnssMois;
        BigDecimal cumulIuts = iutsMois;
        BigDecimal cumulCrrae = crraeMois;

        // Calcul dynamique des cumuls de l'exercice pour l'année civile
        if (b.getEmployee() != null && b.getEmployee().getId() != null) {
            try {
                List<Bulletin> yearBulletins = bulletinRepository.findByEmployeeId(b.getEmployee().getId());
                if (yearBulletins != null && !yearBulletins.isEmpty()) {
                    int year = b.getDateFrom() != null ? b.getDateFrom().getYear() : (b.getSessionPaie() != null && b.getSessionPaie().getAnnee() != null ? b.getSessionPaie().getAnnee() : LocalDate.now().getYear());
                    LocalDate targetDate = b.getDateTo() != null ? b.getDateTo() : (b.getDateFrom() != null ? b.getDateFrom() : LocalDate.now());
                    BigDecimal sBrut = BigDecimal.ZERO;
                    BigDecimal sBase = BigDecimal.ZERO;
                    BigDecimal sCnss = BigDecimal.ZERO;
                    BigDecimal sIuts = BigDecimal.ZERO;
                    BigDecimal sCrrae = BigDecimal.ZERO;
                    for (Bulletin yb : yearBulletins) {
                        int ybYear = yb.getDateFrom() != null ? yb.getDateFrom().getYear() : (yb.getSessionPaie() != null && yb.getSessionPaie().getAnnee() != null ? yb.getSessionPaie().getAnnee() : 0);
                        if (ybYear == year) {
                            LocalDate ybDate = yb.getDateTo() != null ? yb.getDateTo() : yb.getDateFrom();
                            if (ybDate == null || !ybDate.isAfter(targetDate)) {
                                sBrut = sBrut.add(yb.getSalaireBrut() != null ? yb.getSalaireBrut() : (yb.getTotalAvoirs() != null ? yb.getTotalAvoirs() : BigDecimal.ZERO));
                                sBase = sBase.add(yb.getBaseImposable() != null ? yb.getBaseImposable() : BigDecimal.ZERO);
                                sCnss = sCnss.add(extractCnssFromBulletin(yb));
                                sIuts = sIuts.add(extractIutsFromBulletin(yb));
                                sCrrae = sCrrae.add(extractCrraeFromBulletin(yb));
                            }
                        }
                    }
                    if (sBrut.compareTo(BigDecimal.ZERO) > 0) cumulBrut = sBrut;
                    if (sBase.compareTo(BigDecimal.ZERO) > 0) cumulBaseImp = sBase;
                    if (sCnss.compareTo(BigDecimal.ZERO) > 0) cumulCnss = sCnss;
                    if (sIuts.compareTo(BigDecimal.ZERO) > 0) cumulIuts = sIuts;
                    if (sCrrae.compareTo(BigDecimal.ZERO) > 0) cumulCrrae = sCrrae;
                }
            } catch (Exception ignored) {}
        }

        renderSummaryTable(doc, brutMois, baseImpMois, cnssMois, iutsMois, crraeMois, cumulBrut, cumulBaseImp, cumulCnss, cumulIuts, cumulCrrae);
    }

    private void addSummaryTableMoisExerciceFromDto(Document doc, BulletinDto dto) throws DocumentException {
        BigDecimal brutMois = dto.getSalaireBrut() != null ? dto.getSalaireBrut() : (dto.getTotalAvoirs() != null ? dto.getTotalAvoirs() : BigDecimal.ZERO);
        BigDecimal baseImpMois = dto.getBaseImposable() != null ? dto.getBaseImposable() : BigDecimal.ZERO;
        BigDecimal cnssMois = extractCnssFromDto(dto);
        BigDecimal iutsMois = extractIutsFromDto(dto);
        BigDecimal crraeMois = extractCrraeFromDto(dto);

        BigDecimal cumulBrut = (dto.getCumulBrutExercice() != null && dto.getCumulBrutExercice().compareTo(BigDecimal.ZERO) > 0) ? dto.getCumulBrutExercice() : brutMois;
        BigDecimal cumulBaseImp = (dto.getCumulBaseImposableExercice() != null && dto.getCumulBaseImposableExercice().compareTo(BigDecimal.ZERO) > 0) ? dto.getCumulBaseImposableExercice() : baseImpMois;
        BigDecimal cumulCnss = (dto.getCumulCnssExercice() != null && dto.getCumulCnssExercice().compareTo(BigDecimal.ZERO) > 0) ? dto.getCumulCnssExercice() : cnssMois;
        BigDecimal cumulIuts = (dto.getCumulIutsExercice() != null && dto.getCumulIutsExercice().compareTo(BigDecimal.ZERO) > 0) ? dto.getCumulIutsExercice() : iutsMois;
        BigDecimal cumulCrrae = (dto.getCumulCrraeExercice() != null && dto.getCumulCrraeExercice().compareTo(BigDecimal.ZERO) > 0) ? dto.getCumulCrraeExercice() : crraeMois;

        if (dto.getEmployeeId() != null) {
            try {
                List<Bulletin> yearBulletins = bulletinRepository.findByEmployeeId(dto.getEmployeeId());
                if (yearBulletins != null && !yearBulletins.isEmpty()) {
                    int year = dto.getDateFrom() != null ? dto.getDateFrom().getYear() : LocalDate.now().getYear();
                    LocalDate targetDate = dto.getDateTo() != null ? dto.getDateTo() : (dto.getDateFrom() != null ? dto.getDateFrom() : LocalDate.now());
                    BigDecimal sBrut = BigDecimal.ZERO;
                    BigDecimal sBase = BigDecimal.ZERO;
                    BigDecimal sCnss = BigDecimal.ZERO;
                    BigDecimal sIuts = BigDecimal.ZERO;
                    BigDecimal sCrrae = BigDecimal.ZERO;
                    for (Bulletin yb : yearBulletins) {
                        int ybYear = yb.getDateFrom() != null ? yb.getDateFrom().getYear() : (yb.getSessionPaie() != null && yb.getSessionPaie().getAnnee() != null ? yb.getSessionPaie().getAnnee() : 0);
                        if (ybYear == year) {
                            LocalDate ybDate = yb.getDateTo() != null ? yb.getDateTo() : yb.getDateFrom();
                            if (ybDate == null || !ybDate.isAfter(targetDate)) {
                                sBrut = sBrut.add(yb.getSalaireBrut() != null ? yb.getSalaireBrut() : (yb.getTotalAvoirs() != null ? yb.getTotalAvoirs() : BigDecimal.ZERO));
                                sBase = sBase.add(yb.getBaseImposable() != null ? yb.getBaseImposable() : BigDecimal.ZERO);
                                sCnss = sCnss.add(extractCnssFromBulletin(yb));
                                sIuts = sIuts.add(extractIutsFromBulletin(yb));
                                sCrrae = sCrrae.add(extractCrraeFromBulletin(yb));
                            }
                        }
                    }
                    if (sBrut.compareTo(BigDecimal.ZERO) > 0) cumulBrut = sBrut;
                    if (sBase.compareTo(BigDecimal.ZERO) > 0) cumulBaseImp = sBase;
                    if (sCnss.compareTo(BigDecimal.ZERO) > 0) cumulCnss = sCnss;
                    if (sIuts.compareTo(BigDecimal.ZERO) > 0) cumulIuts = sIuts;
                    if (sCrrae.compareTo(BigDecimal.ZERO) > 0) cumulCrrae = sCrrae;
                }
            } catch (Exception ignored) {}
        }

        if (cumulCnss.compareTo(BigDecimal.ZERO) == 0 && cnssMois.compareTo(BigDecimal.ZERO) > 0) {
            cumulCnss = cnssMois;
        }

        renderSummaryTable(doc, brutMois, baseImpMois, cnssMois, iutsMois, crraeMois, cumulBrut, cumulBaseImp, cumulCnss, cumulIuts, cumulCrrae);
    }

    private void renderSummaryTable(Document doc, BigDecimal brutMois, BigDecimal baseImpMois, BigDecimal cnssMois, BigDecimal iutsMois, BigDecimal crraeMois,
                                    BigDecimal cumulBrut, BigDecimal cumulBaseImp, BigDecimal cumulCnss, BigDecimal cumulIuts, BigDecimal cumulCrrae) throws DocumentException {
        PdfPTable summaryTable = new PdfPTable(6);
        summaryTable.setWidthPercentage(100);
        summaryTable.setWidths(new float[]{18, 18, 16, 16, 16, 16});
        summaryTable.setSpacingAfter(10f);

        addHeaderCell(summaryTable, "Salaire brut", Element.ALIGN_CENTER);
        addHeaderCell(summaryTable, "Base imposable", Element.ALIGN_CENTER);
        addHeaderCell(summaryTable, "CNSS", Element.ALIGN_CENTER);
        addHeaderCell(summaryTable, "IUTS", Element.ALIGN_CENTER);
        addHeaderCell(summaryTable, "CRRAE", Element.ALIGN_CENTER);
        addHeaderCell(summaryTable, "", Element.ALIGN_CENTER);

        // Ligne MOIS
        addRowCell(summaryTable, formatMoney(brutMois), Element.ALIGN_RIGHT, false);
        addRowCell(summaryTable, formatMoney(baseImpMois), Element.ALIGN_RIGHT, false);
        addRowCell(summaryTable, formatMoney(cnssMois), Element.ALIGN_RIGHT, false);
        addRowCell(summaryTable, formatMoney(iutsMois), Element.ALIGN_RIGHT, false);
        addRowCell(summaryTable, formatMoney(crraeMois), Element.ALIGN_RIGHT, false);
        addRowCell(summaryTable, "MOIS", Element.ALIGN_CENTER, true);

        // Ligne EXERCICE
        addRowCell(summaryTable, formatMoney(cumulBrut), Element.ALIGN_RIGHT, false);
        addRowCell(summaryTable, formatMoney(cumulBaseImp), Element.ALIGN_RIGHT, false);
        addRowCell(summaryTable, formatMoney(cumulCnss), Element.ALIGN_RIGHT, false);
        addRowCell(summaryTable, formatMoney(cumulIuts), Element.ALIGN_RIGHT, false);
        addRowCell(summaryTable, formatMoney(cumulCrrae), Element.ALIGN_RIGHT, false);
        addRowCell(summaryTable, "EXERCICE", Element.ALIGN_CENTER, true);

        doc.add(summaryTable);
    }

    private void addOfficialFooterNotice(Document doc) throws DocumentException {
        Paragraph notice = new Paragraph(
                "Pour faire valoir vos droits, conservez ce bulletin sans limitation de durée",
                FONT_SMALL
        );
        notice.setAlignment(Element.ALIGN_CENTER);
        doc.add(notice);
    }

    private void addHeaderCell(PdfPTable table, String text, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FONT_HEADER_TH));
        cell.setBackgroundColor(HEADER_BG);
        cell.setBorderColor(BORDER_COLOR);
        cell.setHorizontalAlignment(align);
        cell.setPadding(5f);
        table.addCell(cell);
    }

    private void addRowCell(PdfPTable table, String text, int align, boolean bold) {
        PdfPCell cell = new PdfPCell(new Phrase(text, bold ? FONT_CELL_BOLD : FONT_CELL));
        cell.setBorderColor(BORDER_COLOR);
        cell.setHorizontalAlignment(align);
        cell.setPadding(4f);
        table.addCell(cell);
    }

    private void addTotalCell(PdfPTable table, String text, int align, int colspan) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FONT_CELL_BOLD));
        cell.setColspan(colspan);
        cell.setBackgroundColor(new Color(241, 245, 249));
        cell.setBorderColor(BORDER_COLOR);
        cell.setHorizontalAlignment(align);
        cell.setPadding(4.5f);
        table.addCell(cell);
    }

    private void addTotalCell(PdfPTable table, String text, int align) {
        addTotalCell(table, text, align, 1);
    }

    private byte[] buildRegistrePaieDocument(List<Bulletin> bulletins) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate(), 20, 20, 20, 20);

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            Paragraph title = new Paragraph("BANQUE POSTALE DU BURKINA FASO — REGISTRE GÉNÉRAL DE PAIE", FONT_TITLE);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(12f);
            document.add(title);

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{10, 24, 14, 13, 13, 13, 13, 15});
            table.setSpacingAfter(10f);

            addHeaderCell(table, "N° MAT", Element.ALIGN_LEFT);
            addHeaderCell(table, "NOM ET PRÉNOMS", Element.ALIGN_LEFT);
            addHeaderCell(table, "FONCTION", Element.ALIGN_LEFT);
            addHeaderCell(table, "SAL. BASE", Element.ALIGN_RIGHT);
            addHeaderCell(table, "INDEMNITÉS", Element.ALIGN_RIGHT);
            addHeaderCell(table, "SAL. BRUT", Element.ALIGN_RIGHT);
            addHeaderCell(table, "RETENUES", Element.ALIGN_RIGHT);
            addHeaderCell(table, "NET À PAYER", Element.ALIGN_RIGHT);

            BigDecimal totBase = BigDecimal.ZERO;
            BigDecimal totIndem = BigDecimal.ZERO;
            BigDecimal totBrut = BigDecimal.ZERO;
            BigDecimal totRet = BigDecimal.ZERO;
            BigDecimal totNet = BigDecimal.ZERO;

            for (Bulletin b : bulletins) {
                Employee emp = b.getEmployee();
                String mat = emp != null && emp.getMatricule() != null ? emp.getMatricule() : "—";
                String name = emp != null ? ((emp.getPrenom() != null ? emp.getPrenom() : "") + " " + (emp.getNom() != null ? emp.getNom() : "")).trim().toUpperCase() : "AGENT";
                String fct = emp != null && emp.getFonction() != null ? (emp.getFonction().getName() != null ? emp.getFonction().getName() : emp.getFonction().getCode()) : "—";

                BigDecimal base = b.getSalaireBase() != null ? b.getSalaireBase() : BigDecimal.ZERO;
                BigDecimal indem = b.getTotalIndemnites() != null ? b.getTotalIndemnites() : BigDecimal.ZERO;
                BigDecimal brut = b.getSalaireBrut() != null ? b.getSalaireBrut() : (b.getTotalAvoirs() != null ? b.getTotalAvoirs() : BigDecimal.ZERO);
                BigDecimal ret = b.getTotalRetenues() != null ? b.getTotalRetenues() : BigDecimal.ZERO;
                BigDecimal net = b.getSalaireNet() != null ? b.getSalaireNet() : BigDecimal.ZERO;

                totBase = totBase.add(base);
                totIndem = totIndem.add(indem);
                totBrut = totBrut.add(brut);
                totRet = totRet.add(ret);
                totNet = totNet.add(net);

                addRowCell(table, mat, Element.ALIGN_LEFT, false);
                addRowCell(table, name, Element.ALIGN_LEFT, false);
                addRowCell(table, fct, Element.ALIGN_LEFT, false);
                addRowCell(table, formatMoney(base), Element.ALIGN_RIGHT, false);
                addRowCell(table, formatMoney(indem), Element.ALIGN_RIGHT, false);
                addRowCell(table, formatMoney(brut), Element.ALIGN_RIGHT, false);
                addRowCell(table, formatMoney(ret), Element.ALIGN_RIGHT, false);
                addRowCell(table, formatMoney(net), Element.ALIGN_RIGHT, true);
            }

            addTotalCell(table, "TOTAUX", Element.ALIGN_LEFT);
            addTotalCell(table, bulletins.size() + " salariés", Element.ALIGN_LEFT);
            addTotalCell(table, "", Element.ALIGN_LEFT);
            addTotalCell(table, formatMoney(totBase), Element.ALIGN_RIGHT);
            addTotalCell(table, formatMoney(totIndem), Element.ALIGN_RIGHT);
            addTotalCell(table, formatMoney(totBrut), Element.ALIGN_RIGHT);
            addTotalCell(table, formatMoney(totRet), Element.ALIGN_RIGHT);
            addTotalCell(table, formatMoney(totNet), Element.ALIGN_RIGHT);

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Erreur lors de la génération du Registre de Paie PDF : " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }

    private String formatMoney(BigDecimal amount) {
        if (amount == null) return "0";
        NumberFormat nf = NumberFormat.getInstance(Locale.FRANCE);
        nf.setMaximumFractionDigits(0);
        long val = amount.setScale(0, RoundingMode.CEILING).longValue();
        return nf.format(val).replace('\u00A0', ' ');
    }

    public static String formatPeriode(LocalDate from, LocalDate to) {
        if (from == null && to == null) return "Période en cours";
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String sFrom = from != null ? from.format(fmt) : "";
        String sTo = to != null ? to.format(fmt) : "";
        if (!sFrom.isEmpty() && !sTo.isEmpty()) {
            return sFrom + " au " + sTo;
        }
        return !sFrom.isEmpty() ? sFrom : sTo;
    }

    public static String numberToFrenchWords(long number) {
        if (number <= 0) return "Zéro Franc CFA";

        String[] units = {
                "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
                "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept",
                "dix-huit", "dix-neuf"
        };
        String[] tens = {
                "", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix",
                "quatre-vingt", "quatre-vingt-dix"
        };

        long millions = number / 1_000_000;
        long thousands = (number % 1_000_000) / 1_000;
        long remainder = number % 1_000;

        StringBuilder sb = new StringBuilder();

        if (millions > 0) {
            if (millions == 1) {
                sb.append("un million ");
            } else {
                sb.append(convertThreeDigits((int) millions, units, tens)).append(" millions ");
            }
        }

        if (thousands > 0) {
            if (thousands == 1) {
                sb.append("mille ");
            } else {
                sb.append(convertThreeDigits((int) thousands, units, tens)).append(" mille ");
            }
        }

        if (remainder > 0) {
            sb.append(convertThreeDigits((int) remainder, units, tens));
        }

        String result = sb.toString().trim();
        if (result.isEmpty()) return "Zéro Franc CFA";

        return Character.toUpperCase(result.charAt(0)) + result.substring(1) + " Francs CFA";
    }

    private static String convertThreeDigits(int num, String[] units, String[] tens) {
        StringBuilder sb = new StringBuilder();
        int hundreds = num / 100;
        int rem = num % 100;

        if (hundreds > 0) {
            if (hundreds == 1) {
                sb.append("cent ");
            } else {
                sb.append(units[hundreds]).append(" cent");
                if (rem == 0) sb.append("s");
                sb.append(" ");
            }
        }

        if (rem > 0) {
            if (rem < 20) {
                sb.append(units[rem]);
            } else {
                int tenDigit = rem / 10;
                int unitDigit = rem % 10;

                if (tenDigit == 7) {
                    sb.append("soixante-");
                    sb.append(unitDigit == 1 ? "et-onze" : units[10 + unitDigit]);
                } else if (tenDigit == 9) {
                    sb.append("quatre-vingt-").append(units[10 + unitDigit]);
                } else {
                    sb.append(tens[tenDigit]);
                    if (unitDigit == 1 && tenDigit != 8) {
                        sb.append(" et un");
                    } else if (unitDigit > 0) {
                        sb.append("-").append(units[unitDigit]);
                    } else if (tenDigit == 8) {
                        sb.append("s");
                    }
                }
            }
        }

        return sb.toString().trim();
    }

    public static String computeGradeCode(Employee emp) {
        if (emp != null) {
            // 1. Grille salariale si présente et valide
            if (emp.getGrilleSalariale() != null && emp.getGrilleSalariale().getGrade() != null && !emp.getGrilleSalariale().getGrade().trim().isEmpty()) {
                String g = emp.getGrilleSalariale().getGrade().trim();
                if (g.matches("^(?i)(C|CL|HC)\\d*(E\\d+|EX)$")) {
                    return g.toUpperCase();
                }
            }

            // 2. ExtraData JSON si présent
            if (emp.getExtraData() != null && !emp.getExtraData().trim().isEmpty()) {
                try {
                    com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(emp.getExtraData());
                    if (node.hasNonNull("grade")) {
                        String g = node.get("grade").asText().trim();
                        if (!g.isEmpty()) {
                            String c = node.hasNonNull("categorie") ? node.get("categorie").asText() : "";
                            String e = node.hasNonNull("echelon") ? node.get("echelon").asText() : "";
                            String formatted = formatStandardGrade(g, c, e);
                            if (!formatted.isEmpty()) return formatted;
                        }
                    }
                } catch (Exception ignored) {}
            }

            // 3. Calcul à partir des relations catégorie, échelon, grade
            String rawCat = "";
            if (emp.getCategorieObj() != null) {
                rawCat = emp.getCategorieObj().getLibelle() != null ? emp.getCategorieObj().getLibelle() : emp.getCategorieObj().getCode();
            }
            String rawEch = "";
            if (emp.getEchelonObj() != null) {
                rawEch = emp.getEchelonObj().getLibelle() != null ? emp.getEchelonObj().getLibelle() : emp.getEchelonObj().getCode();
            }
            String rawG = "";
            if (emp.getGradeObj() != null) {
                rawG = emp.getGradeObj().getCode() != null ? emp.getGradeObj().getCode() : emp.getGradeObj().getLibelle();
            }

            String calculated = formatStandardGrade(rawG, rawCat, rawEch);
            if (calculated != null && !calculated.isEmpty()) {
                return calculated;
            }
            if (rawG != null && !rawG.isEmpty()) {
                return rawG;
            }
        }
        return "—";
    }

    public static String formatStandardGrade(String rawGrade, String rawCat, String rawEch) {
        if (rawGrade != null && rawGrade.trim().matches("^(?i)(C|CL|HC)\\d*(E\\d+|EX)$")) {
            return rawGrade.trim().toUpperCase();
        }

        String g = rawGrade != null ? rawGrade.trim() : "";
        String c = rawCat != null ? rawCat.trim() : "";
        String e = rawEch != null ? rawEch.trim() : "";

        if (g.toLowerCase().contains("échelon") || g.toLowerCase().contains("echelon")) {
            String[] parts = g.split("(?i)(?=échelon|echelon)");
            if (parts.length >= 2) {
                if (c.isEmpty()) c = parts[0].trim();
                if (e.isEmpty()) e = parts[1].trim();
            }
        }

        String catCode = "";
        String cUpper = (!c.isEmpty() ? c : g).toUpperCase();
        if (cUpper.contains("HORS") || cUpper.startsWith("HC")) {
            catCode = "HC";
        } else if (cUpper.contains("CLASSE") || cUpper.startsWith("CL")) {
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("\\d+|VIII|VII|VI|V|IV|III|II|I").matcher(cUpper);
            if (m.find()) {
                String val = m.group();
                String num = switch (val) {
                    case "I" -> "1";
                    case "II" -> "2";
                    case "III" -> "3";
                    case "IV" -> "4";
                    case "V" -> "5";
                    case "VI" -> "6";
                    case "VII" -> "7";
                    case "VIII" -> "8";
                    default -> val;
                };
                catCode = "CL" + num;
            } else {
                catCode = "CL1";
            }
        } else {
            String num = cUpper.replaceAll("[^0-9]", "");
            catCode = !num.isEmpty() ? ("C" + num) : "C1";
        }

        String echCode = "";
        String eUpper = (!e.isEmpty() ? e : g).toUpperCase();
        if (eUpper.contains("EXCEPT") || eUpper.endsWith("EX")) {
            echCode = "EX";
        } else {
            String numStr = eUpper.replaceAll("[^0-9]", "");
            if (!numStr.isEmpty()) {
                try {
                    int n = Integer.parseInt(numStr);
                    echCode = n < 10 ? String.format("E%02d", n) : ("E" + n);
                } catch (Exception ignored) {
                    echCode = "E01";
                }
            } else {
                echCode = "E01";
            }
        }

        return catCode + echCode;
    }
}
