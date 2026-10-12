package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.entities.Conge;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.repositories.CongeRepository;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class CongePdfService {

    private final CongeRepository congeRepository;

    private static final Color BPBF_BLUE = new Color(0, 96, 179);
    private static final Color BPBF_BLUE_LIGHT = new Color(238, 245, 255);
    private static final Color BPBF_GOLD = new Color(217, 119, 6);
    private static final Color TEXT_DARK = new Color(30, 41, 59);
    private static final Color TEXT_MUTED = new Color(100, 116, 139);
    private static final Color BORDER_COLOR = new Color(203, 213, 225);
    private static final Color SUCCESS_GREEN = new Color(22, 101, 52);
    private static final Color SUCCESS_BG = new Color(240, 253, 244);

    private static final Font FONT_TITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, BPBF_BLUE);
    private static final Font FONT_SUBTITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, TEXT_DARK);
    private static final Font FONT_HEADER_TH = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, TEXT_DARK);
    private static final Font FONT_CELL = FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_DARK);
    private static final Font FONT_CELL_BOLD = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, TEXT_DARK);
    private static final Font FONT_SMALL = FontFactory.getFont(FontFactory.HELVETICA, 7, TEXT_MUTED);
    private static final Font FONT_SMALL_BOLD = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7, TEXT_DARK);
    private static final Font FONT_BADGE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);

    @Transactional(readOnly = true)
    public byte[] generateTitreCongePdf(Long congeId) {
        Conge conge = congeRepository.findByIdWithDetails(congeId)
                .orElseGet(() -> congeRepository.findById(congeId)
                        .orElseThrow(() -> new ResourceNotFoundException("Demande de congé introuvable avec l'ID : " + congeId)));

        return buildTitreCongeDocument(conge);
    }

    private byte[] buildTitreCongeDocument(Conge conge) {
        Document document = new Document(PageSize.A4, 30, 30, 25, 25);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // 1. En-tête officiel BPBF
            addHeader(document, conge);

            // 2. Encadré Titre du Document
            addDocumentTitle(document, conge);

            // 3. Section 1 : Bénéficiaire
            addBeneficiaireSection(document, conge);

            // 4. Section 2 : Détails du Congé
            addDetailsCongeSection(document, conge);

            // 5. Section 3 : Situation des Soldes & Intérim
            addSoldesEtInterimSection(document, conge);

            // 6. Section 4 : Circuit de Visa & Approbation DRH
            addVisasSection(document, conge);

            // 7. Pied de page légal
            addFooter(document, conge);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Erreur génération Titre de Congé PDF pour congé #{}: {}", conge.getId(), e.getMessage(), e);
            throw new RuntimeException("Erreur lors de la génération du Titre de Congé PDF", e);
        }
    }

    private void addHeader(Document document, Conge conge) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{65, 35});

        // Colonne gauche : Logo / Identité Banque
        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(Rectangle.NO_BORDER);
        leftCell.setPadding(0);

        Paragraph bankTitle = new Paragraph("BANQUE POSTALE DU BURKINA FASO", FONT_TITLE);
        Paragraph slogan = new Paragraph("Une banque citoyenne à votre service", FONT_SMALL);
        slogan.setSpacingAfter(4);
        Paragraph drh = new Paragraph("DIRECTION DES RESSOURCES HUMAINES ET DE LA FORMATION", FONT_SUBTITLE);
        Paragraph subdrh = new Paragraph("Service Gestion Prévisionnelle des Emplois et des Compétences", FONT_SMALL);

        leftCell.addElement(bankTitle);
        leftCell.addElement(slogan);
        leftCell.addElement(drh);
        leftCell.addElement(subdrh);
        table.addCell(leftCell);

        // Colonne droite : Numéro Titre de Congé & Date
        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(Rectangle.NO_BORDER);
        rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        rightCell.setPadding(0);

        String numTitre = conge.getNumeroTitreConge() != null && !conge.getNumeroTitreConge().isBlank()
                ? conge.getNumeroTitreConge()
                : String.format("TC-%d-%04d", LocalDate.now().getYear(), conge.getId());

        PdfPTable badgeTable = new PdfPTable(1);
        badgeTable.setWidthPercentage(100);

        PdfPCell badgeCell = new PdfPCell(new Phrase("TITRE OFFICIEL N° " + numTitre, FONT_BADGE));
        badgeCell.setBackgroundColor(BPBF_BLUE);
        badgeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        badgeCell.setPadding(6);
        badgeCell.setBorder(Rectangle.NO_BORDER);
        badgeTable.addCell(badgeCell);

        rightCell.addElement(badgeTable);

        Paragraph dateDeliv = new Paragraph("Délivré le : " + formatDate(conge.getDateVisaDrh() != null ? conge.getDateVisaDrh() : conge.getDateValidation()), FONT_SMALL_BOLD);
        dateDeliv.setAlignment(Element.ALIGN_RIGHT);
        dateDeliv.setSpacingBefore(4);
        rightCell.addElement(dateDeliv);

        table.addCell(rightCell);
        document.add(table);

        // Séparateur
        addSeparator(document);
    }

    private void addDocumentTitle(Document document, Conge conge) throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(4);
        table.setSpacingAfter(10);

        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(BPBF_BLUE_LIGHT);
        cell.setBorderColor(BPBF_BLUE);
        cell.setBorderWidth(1.2f);
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph title = new Paragraph("TITRE DE CONGÉ & AUTORISATION D'ABSENCE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BPBF_BLUE));
        title.setAlignment(Element.ALIGN_CENTER);
        Paragraph subtitle = new Paragraph("Délivré conformément aux dispositions du Code du Travail du Burkina Faso et de la Convention Collective Bancaire", FONT_SMALL);
        subtitle.setAlignment(Element.ALIGN_CENTER);

        cell.addElement(title);
        cell.addElement(subtitle);
        table.addCell(cell);
        document.add(table);
    }

    private void addBeneficiaireSection(Document document, Conge conge) throws DocumentException {
        Employee emp = conge.getEmployee();
        String mat = emp != null && emp.getMatricule() != null ? emp.getMatricule() : "AGENT";
        String nomComplet = conge.getEmploye();

        String direction = emp != null && emp.getDirection() != null ? emp.getDirection().getName() : (emp != null && emp.getDepartment() != null ? emp.getDepartment().getName() : "Siège BPBF");
        String service = emp != null && emp.getService() != null ? emp.getService().getName() : "Non spécifié";
        String fonction = emp != null && emp.getFonction() != null ? emp.getFonction().getName() : (emp != null && emp.getEmploi() != null ? emp.getEmploi().getName() : "Collaborateur");

        PdfPTable table = createSectionTable("1. BÉNÉFICIAIRE DU CONGÉ", 4);
        table.setWidths(new float[]{22, 28, 22, 28});

        addKeyValueCells(table, "Matricule :", mat, "Nom & Prénoms :", nomComplet);
        addKeyValueCells(table, "Direction :", direction, "Service / Agence :", service);
        addKeyValueCells(table, "Fonction / Poste :", fonction, "Statut Agent :", (emp != null && emp.getStatut() != null ? emp.getStatut() : "ACTIF"));

        document.add(table);
    }

    private void addDetailsCongeSection(Document document, Conge conge) throws DocumentException {
        PdfPTable table = createSectionTable("2. MODALITÉS DU CONGÉ ACCORDÉ", 4);
        table.setWidths(new float[]{24, 26, 24, 26});

        String typeLabel = conge.getType();
        String nbJoursStr = (conge.getNbJours() != null ? conge.getNbJours() : 0) + " jour(s) ouvrable(s)";
        String debutStr = formatDate(conge.getDateDebut());
        String finStr = formatDate(conge.getDateFin());

        // Calcul date de reprise estimée (lendemain ouvré)
        String repriseStr = calculerDateReprise(conge.getDateFin());

        addKeyValueCells(table, "Nature du Congé :", typeLabel, "Durée Accordée :", nbJoursStr);
        addKeyValueCells(table, "Date de départ :", debutStr, "Date de fin :", finStr);
        addKeyValueCells(table, "Reprise de service :", repriseStr, "Statut Validation :", "APPROUVÉ & VALIDÉ DRH");

        if (conge.getMotif() != null && !conge.getMotif().isBlank()) {
            PdfPCell mLabel = new PdfPCell(new Phrase("Motif précisé :", FONT_CELL_BOLD));
            mLabel.setBackgroundColor(BPBF_BLUE_LIGHT);
            mLabel.setPadding(4);
            table.addCell(mLabel);

            PdfPCell mVal = new PdfPCell(new Phrase(conge.getMotif(), FONT_CELL));
            mVal.setColspan(3);
            mVal.setPadding(4);
            table.addCell(mVal);
        }

        document.add(table);
    }

    private void addSoldesEtInterimSection(Document document, Conge conge) throws DocumentException {
        PdfPTable table = createSectionTable("3. SITUATION DES SOLDES & DISPOSITIONS DE SERVICE", 4);
        table.setWidths(new float[]{25, 25, 25, 25});

        String sAvant = conge.getSoldeAvantDemande() != null ? conge.getSoldeAvantDemande() + " jours" : "30.0 jours";
        String deduit = (conge.getNbJours() != null ? conge.getNbJours() : 0) + " jours";
        String sApres = conge.getSoldeApresDemande() != null ? conge.getSoldeApresDemande() + " jours" : "—";

        String interimNom = conge.getInterimaire() != null
                ? (conge.getInterimaire().getPrenom() + " " + conge.getInterimaire().getNom() + " (" + conge.getInterimaire().getMatricule() + ")")
                : "Sans intérimaire requis";

        addKeyValueCells(table, "Solde avant départ :", sAvant, "Jours déduits :", deduit);
        addKeyValueCells(table, "Solde restant :", sApres, "Intérim assuré par :", interimNom);

        if (Boolean.TRUE.equals(conge.getPosteSensibleBceao())) {
            PdfPCell secLabel = new PdfPCell(new Phrase("Règle BCEAO Poste Sensible :", FONT_CELL_BOLD));
            secLabel.setBackgroundColor(BPBF_BLUE_LIGHT);
            secLabel.setPadding(4);
            table.addCell(secLabel);

            PdfPCell secVal = new PdfPCell(new Phrase("OUI — Suspension temporaire des accès SI appliquée la veille du départ", FONT_CELL));
            secVal.setColspan(3);
            secVal.setPadding(4);
            table.addCell(secVal);
        }

        document.add(table);
    }

    private void addVisasSection(Document document, Conge conge) throws DocumentException {
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setSpacingBefore(8);
        table.setSpacingAfter(8);
        table.setWidths(new float[]{33, 33, 34});

        // Colonne 1 : L'Agent
        PdfPCell c1 = new PdfPCell();
        c1.setBorderColor(BORDER_COLOR);
        c1.setPadding(6);
        c1.addElement(new Paragraph("LE COLLABORATEUR", FONT_HEADER_TH));
        c1.addElement(new Paragraph("« Pour accord & engagement de reprise »", FONT_SMALL));
        c1.addElement(new Paragraph("\n\nSignature de l'agent :", FONT_SMALL));
        table.addCell(c1);

        // Colonne 2 : Le Supérieur Hiérarchique N+1
        PdfPCell c2 = new PdfPCell();
        c2.setBorderColor(BORDER_COLOR);
        c2.setPadding(6);
        c2.addElement(new Paragraph("LE SUPÉRIEUR HIÉRARCHIQUE N+1", FONT_HEADER_TH));
        String n1Par = conge.getVisaN1Par() != null ? conge.getVisaN1Par() : "Directeur N+1";
        String n1Date = conge.getDateVisaN1() != null ? formatDate(conge.getDateVisaN1()) : formatDate(conge.getDateDemande());
        c2.addElement(new Paragraph("Visa favorable accordé par : " + n1Par, FONT_SMALL));
        c2.addElement(new Paragraph("Date du visa : " + n1Date, FONT_SMALL));
        c2.addElement(new Paragraph("\nSignature & Visa N+1 :", FONT_SMALL));
        table.addCell(c2);

        // Colonne 3 : La Direction des Ressources Humaines
        PdfPCell c3 = new PdfPCell();
        c3.setBackgroundColor(SUCCESS_BG);
        c3.setBorderColor(SUCCESS_GREEN);
        c3.setBorderWidth(1.2f);
        c3.setPadding(6);

        c3.addElement(new Paragraph("POUR LA DIRECTION GÉNÉRALE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, SUCCESS_GREEN)));
        c3.addElement(new Paragraph("LE DIRECTEUR DES RESSOURCES HUMAINES", FONT_HEADER_TH));
        String drhPar = conge.getVisaDrhPar() != null ? conge.getVisaDrhPar() : "La Direction des Ressources Humaines";
        String drhDate = conge.getDateVisaDrh() != null ? formatDate(conge.getDateVisaDrh()) : formatDate(conge.getDateValidation());
        c3.addElement(new Paragraph("Délivré par : " + drhPar, FONT_SMALL_BOLD));
        c3.addElement(new Paragraph("Date d'approbation : " + drhDate, FONT_SMALL));

        Paragraph cachet = new Paragraph("\n[TITRE OFFICIEL VALIDÉ & DÉLIVRÉ]", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BPBF_BLUE));
        cachet.setAlignment(Element.ALIGN_CENTER);
        c3.addElement(cachet);

        table.addCell(c3);
        document.add(table);
    }

    private void addFooter(Document document, Conge conge) throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(0);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph notice = new Paragraph("Important : L'agent est tenu de reprendre effectivement son service à la date indiquée ci-dessus. " +
                "Toute prolongation doit faire l'objet d'une demande préalable dûment autorisée par la Direction des Ressources Humaines.", FONT_SMALL);
        notice.setAlignment(Element.ALIGN_CENTER);

        String genDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm", Locale.FRENCH));
        Paragraph legal = new Paragraph("SIGRH — Système Intégré de Gestion RH • Banque Postale du Burkina Faso • Document généré le " + genDate, FONT_SMALL);
        legal.setAlignment(Element.ALIGN_CENTER);
        legal.setSpacingBefore(4);

        cell.addElement(notice);
        cell.addElement(legal);
        table.addCell(cell);
        document.add(table);
    }

    private PdfPTable createSectionTable(String headerTitle, int columns) throws DocumentException {
        PdfPTable table = new PdfPTable(columns);
        table.setWidthPercentage(100);
        table.setSpacingBefore(6);
        table.setSpacingAfter(4);

        PdfPCell headerCell = new PdfPCell(new Phrase(headerTitle, FONT_SUBTITLE));
        headerCell.setColspan(columns);
        headerCell.setBackgroundColor(BPBF_BLUE_LIGHT);
        headerCell.setBorderColor(BPBF_BLUE);
        headerCell.setPadding(5);
        table.addCell(headerCell);

        return table;
    }

    private void addKeyValueCells(PdfPTable table, String k1, String v1, String k2, String v2) {
        PdfPCell cK1 = new PdfPCell(new Phrase(k1, FONT_CELL_BOLD));
        cK1.setBackgroundColor(BPBF_BLUE_LIGHT);
        cK1.setBorderColor(BORDER_COLOR);
        cK1.setPadding(4);
        table.addCell(cK1);

        PdfPCell cV1 = new PdfPCell(new Phrase(v1 != null ? v1 : "—", FONT_CELL));
        cV1.setBorderColor(BORDER_COLOR);
        cV1.setPadding(4);
        table.addCell(cV1);

        PdfPCell cK2 = new PdfPCell(new Phrase(k2, FONT_CELL_BOLD));
        cK2.setBackgroundColor(BPBF_BLUE_LIGHT);
        cK2.setBorderColor(BORDER_COLOR);
        cK2.setPadding(4);
        table.addCell(cK2);

        PdfPCell cV2 = new PdfPCell(new Phrase(v2 != null ? v2 : "—", FONT_CELL));
        cV2.setBorderColor(BORDER_COLOR);
        cV2.setPadding(4);
        table.addCell(cV2);
    }

    private void addSeparator(Document document) throws DocumentException {
        PdfPTable sep = new PdfPTable(1);
        sep.setWidthPercentage(100);
        sep.setSpacingBefore(4);
        sep.setSpacingAfter(4);
        PdfPCell c = new PdfPCell();
        c.setBorder(Rectangle.BOTTOM);
        c.setBorderColor(BPBF_BLUE);
        c.setBorderWidth(1.5f);
        c.setFixedHeight(2);
        sep.addCell(c);
        document.add(sep);
    }

    private String formatDate(String d) {
        if (d == null || d.isBlank()) return LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        try {
            if (d.contains("T")) d = d.substring(0, d.indexOf("T"));
            if (d.matches("\\d{4}-\\d{2}-\\d{2}")) {
                LocalDate ld = LocalDate.parse(d);
                return ld.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            }
            return d;
        } catch (Exception e) {
            return d;
        }
    }

    private String calculerDateReprise(String dateFin) {
        if (dateFin == null || dateFin.isBlank()) return "Lendemain ouvré";
        try {
            String d = dateFin.contains("T") ? dateFin.substring(0, dateFin.indexOf("T")) : dateFin;
            if (d.matches("\\d{4}-\\d{2}-\\d{2}")) {
                LocalDate fin = LocalDate.parse(d);
                LocalDate reprise = fin.plusDays(1);
                // Si dimanche -> lundi
                if (reprise.getDayOfWeek() == java.time.DayOfWeek.SUNDAY) {
                    reprise = reprise.plusDays(1);
                }
                return reprise.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            }
            return "Lendemain ouvré";
        } catch (Exception e) {
            return "Lendemain ouvré";
        }
    }
}
