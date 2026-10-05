package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.etatsynthese.*;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.repositories.*;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EtatSynthesePaieService {

    private final BulletinRepository bulletinRepository;
    private final SessionPaieRepository sessionPaieRepository;
    private final BulletinLotRepository bulletinLotRepository;
    private final DirectionRepository directionRepository;
    private final SignataireConfigService signataireConfigService;
    private final PrecompteRepository precompteRepository;
    private final AvoirRepository avoirRepository;
    private final TropPercuRepository tropPercuRepository;

    private static final Color BPBF_BLUE = new Color(0, 96, 179);
    private static final Color BPBF_NAVY = new Color(15, 42, 74);
    private static final Color HEADER_BG = new Color(241, 245, 249);
    private static final Color BORDER_COLOR = new Color(203, 213, 225);
    private static final Color TEXT_DARK = new Color(15, 23, 42);

    private static final Font FONT_TITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, BPBF_BLUE);
    private static final Font FONT_SUBTITLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, TEXT_DARK);
    private static final Font FONT_TH = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Color.WHITE);
    private static final Font FONT_TD = FontFactory.getFont(FontFactory.HELVETICA, 7.5f, TEXT_DARK);
    private static final Font FONT_TD_BOLD = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7.5f, TEXT_DARK);
    private static final Font FONT_TH_MINI = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 6f, Color.WHITE);
    private static final Font FONT_TD_MINI = FontFactory.getFont(FontFactory.HELVETICA, 5.5f, TEXT_DARK);
    private static final Font FONT_TD_BOLD_MINI = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 5.5f, TEXT_DARK);

    @Transactional(readOnly = true)
    public EtatSyntheseWrapperDto getEtatSynthese(String typeEtat, Long sessionPaieId, Long bulletinLotId, Long directionId, String banqueNom) {
        String type = typeEtat != null ? typeEtat.trim().toUpperCase(Locale.ROOT) : "LIVRE_PAIE";

        // 1. Récupération des bulletins éligibles selon les filtres
        List<Bulletin> bulletins = findBulletins(sessionPaieId, bulletinLotId, directionId, banqueNom);

        // Récupérer les informations de la session ou du lot de référence
        String codeSession = "GLOBAL";
        String periode = "Toutes périodes";
        Integer annee = 2026;
        String mois = "Toutes";
        String typeSession = "ORDINAIRE";

        if (sessionPaieId != null) {
            SessionPaie s = sessionPaieRepository.findById(sessionPaieId).orElse(null);
            if (s != null) {
                codeSession = s.getCodeSession();
                periode = s.getPeriode() != null ? s.getPeriode() : (s.getMois() + " " + s.getAnnee());
                annee = s.getAnnee();
                mois = s.getMois();
                typeSession = s.getTypeSession() != null ? s.getTypeSession() : "ORDINAIRE";
            }
        } else if (bulletinLotId != null) {
            BulletinLot l = bulletinLotRepository.findById(bulletinLotId).orElse(null);
            if (l != null) {
                codeSession = l.getName();
                periode = (l.getDateFrom() != null ? l.getDateFrom().toString() : "") + " au " + (l.getDateTo() != null ? l.getDateTo().toString() : "");
                typeSession = l.getTypeSession() != null ? l.getTypeSession() : "ORDINAIRE";
            }
        } else if (!bulletins.isEmpty() && bulletins.get(0).getSessionPaie() != null) {
            SessionPaie s = bulletins.get(0).getSessionPaie();
            codeSession = s.getCodeSession();
            periode = s.getPeriode() != null ? s.getPeriode() : (s.getMois() + " " + s.getAnnee());
            annee = s.getAnnee();
            mois = s.getMois();
            typeSession = s.getTypeSession() != null ? s.getTypeSession() : "ORDINAIRE";
        }

        // Totaux globaux de la sélection
        BigDecimal totalBrut = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalRetenues = BigDecimal.ZERO;
        BigDecimal totalPatronales = BigDecimal.ZERO;

        for (Bulletin b : bulletins) {
            if (b.getSalaireBrut() != null) totalBrut = totalBrut.add(b.getSalaireBrut());
            if (b.getSalaireNet() != null) totalNet = totalNet.add(b.getSalaireNet());
            if (b.getTotalRetenues() != null) totalRetenues = totalRetenues.add(b.getTotalRetenues());
            if (b.getTotalCotisationsPatronales() != null) totalPatronales = totalPatronales.add(b.getTotalCotisationsPatronales());
        }
        BigDecimal totalMasseSalariale = totalBrut.add(totalPatronales);

        List<Object> rows = new ArrayList<>();
        String titreEtat = "Livre de Paie";

        switch (type) {
            case "RECAPITULATIF_GLOBAL":
                titreEtat = "Récapitulatif Global de la Paie (Journal Débit / Crédit)";
                rows.addAll(buildRecapitulatifGlobalRows(bulletins));
                break;

            case "ETAT_CRRAE_RRPC":
                titreEtat = "État Nominatif Mensuel de Déclaration des Cotisations RRPC (19%)";
                rows.addAll(buildEtatCrraeRows(bulletins, "RRPC"));
                break;

            case "ETAT_CRRAE_RCPNC":
                titreEtat = "État Nominatif Mensuel de Déclaration des Cotisations RCPNC (12%)";
                rows.addAll(buildEtatCrraeRows(bulletins, "RCPNC"));
                break;

            case "ETAT_CRRAE_FAAM":
                titreEtat = "État Nominatif Mensuel de Déclaration des Cotisations FAAM (1.5%)";
                rows.addAll(buildEtatCrraeRows(bulletins, "FAAM"));
                break;

            case "LIVRE_PAIE":
                titreEtat = "Livre de Paie (Registre Général)";
                rows.addAll(buildLivrePaieRows(bulletins));
                break;

            case "ETAT_NOMINATIF":
                titreEtat = "État Nominatif de Paie";
                rows.addAll(buildEtatNominatifRows(bulletins));
                break;

            case "ETAT_SALAIRE":
                titreEtat = "État Salaire & Masses par Structure";
                rows.addAll(buildEtatSalaireRows(bulletins));
                break;

            case "ETAT_BANQUE":
                titreEtat = "État des Virements par Banque";
                rows.addAll(buildEtatBanqueRows(bulletins));
                break;

            case "ETAT_CNSS":
                titreEtat = "Bordereau Déclaratif des Cotisations CNSS";
                rows.addAll(buildEtatCnssRows(bulletins));
                break;

            case "ETAT_IUTS":
                titreEtat = "État Déclaratif Fiscal de l'IUTS";
                rows.addAll(buildEtatIutsRows(bulletins));
                break;

            case "ETAT_PRECOMPTE":
                titreEtat = "État des Précomptes & Retenues sur Salaire";
                rows.addAll(buildEtatPrecompteRows(bulletins));
                break;

            case "ETAT_FSP":
                titreEtat = "État du Fonds de Soutien Patriotique (FSP)";
                rows.addAll(buildEtatFspRows(bulletins));
                break;

            case "ETAT_MUTUELLE":
                titreEtat = "État des Cotisations Mutuelle de Santé";
                rows.addAll(buildEtatMutuelleRows(bulletins));
                break;

            case "ETAT_TYPE_EMPLOYE":
                titreEtat = "État Éléments par Type et Statut d'Employé";
                rows.addAll(buildEtatTypeEmployeRows(bulletins));
                break;

            case "ETAT_ELEMENTS_SALAIRE":
                titreEtat = "État Récapitulatif des Rubriques & Éléments de Salaire";
                rows.addAll(buildEtatElementsSalaireRows(bulletins));
                break;

            case "ETAT_BULLETIN":
            default:
                titreEtat = "État Répertoire & Contrôle des Bulletins";
                rows.addAll(buildEtatBulletinControleRows(bulletins));
                break;
        }

        SignatairesEtatDto signataires = signataireConfigService != null 
                ? signataireConfigService.getSignataires() 
                : SignatairesEtatDto.builder()
                        .titreSignataire1("Le Comptable")
                        .nomSignataire1("Ahadi Ismaël YONLI")
                        .titreSignataire2("Le Directeur Financier et Comptable")
                        .nomSignataire2("Inoussa SANOUIDI")
                        .build();

        return EtatSyntheseWrapperDto.builder()
                .typeEtat(type)
                .titreEtat(titreEtat)
                .codeSession(codeSession)
                .periode(periode)
                .annee(annee)
                .mois(mois)
                .typeSession(typeSession)
                .nombreBulletins(bulletins.size())
                .totalBrut(totalBrut)
                .totalNet(totalNet)
                .totalRetenues(totalRetenues)
                .totalCotisationsPatronales(totalPatronales)
                .totalMasseSalariale(totalMasseSalariale)
                .donnees(rows)
                .titreSignataire1(signataires.getTitreSignataire1())
                .nomSignataire1(signataires.getNomSignataire1())
                .titreSignataire2(signataires.getTitreSignataire2())
                .nomSignataire2(signataires.getNomSignataire2())
                .build();
    }

    private List<Bulletin> findBulletins(Long sessionPaieId, Long bulletinLotId, Long directionId, String banqueNom) {
        List<Bulletin> list;
        if (sessionPaieId != null) {
            list = bulletinRepository.findBySessionPaieId(sessionPaieId);
        } else if (bulletinLotId != null) {
            list = bulletinRepository.findByBulletinLotId(bulletinLotId);
        } else {
            // Prendre les bulletins de la dernière session créée
            List<SessionPaie> sessions = sessionPaieRepository.findAllByOrderByAnneeDescMoisDesc();
            if (!sessions.isEmpty()) {
                list = bulletinRepository.findBySessionPaieId(sessions.get(0).getId());
            } else {
                list = bulletinRepository.findAll();
            }
        }

        // Filtre Direction
        if (directionId != null) {
            list = list.stream().filter(b -> {
                Employee e = b.getEmployee();
                return e != null && e.getDirection() != null && Objects.equals(e.getDirection().getId(), directionId);
            }).collect(Collectors.toList());
        }

        // Filtre Banque
        if (banqueNom != null && !banqueNom.isBlank() && !banqueNom.equalsIgnoreCase("TOUTES")) {
            String bqNorm = banqueNom.trim().toLowerCase(Locale.ROOT);
            list = list.stream().filter(b -> {
                Employee e = b.getEmployee();
                if (e == null) return false;
                String bq = e.getBanque() != null ? e.getBanque().toLowerCase(Locale.ROOT) : "";
                return bq.contains(bqNorm) || bqNorm.contains(bq);
            }).collect(Collectors.toList());
        }

        // Trier par matricule ou nom
        list.sort(Comparator.comparing(b -> {
            Employee e = b.getEmployee();
            return e != null && e.getMatricule() != null ? e.getMatricule() : "";
        }));

        return list;
    }

    // ─── CONSTRUCTEURS DES LIGNES PAR ÉTAT ──────────────────────────────────

    private List<LivrePaieRowDto> buildLivrePaieRows(List<Bulletin> bulletins) {
        List<LivrePaieRowDto> rows = new ArrayList<>();
        for (Bulletin b : bulletins) {
            Employee e = b.getEmployee();
            String mat = e != null && e.getMatricule() != null ? e.getMatricule() : "—";
            String nom = e != null ? ((e.getPrenom() != null ? e.getPrenom() : "") + " " + (e.getNom() != null ? e.getNom() : "")).trim().toUpperCase(Locale.ROOT) : "—";
            String emp = e != null && e.getFonction() != null ? (e.getFonction().getName() != null ? e.getFonction().getName() : e.getFonction().getCode()) : (e != null && e.getEmploi() != null ? e.getEmploi().getName() : "Agent");
            String dir = e != null && e.getDirection() != null ? e.getDirection().getName() : "—";
            String srv = e != null && e.getService() != null ? e.getService().getName() : "—";
            String grade = b.getGrade() != null ? b.getGrade().getCode() : (e != null && e.getGradeObj() != null ? e.getGradeObj().getCode() : "—");

            BigDecimal sBase = b.getSalaireBase() != null ? b.getSalaireBase() : BigDecimal.ZERO;
            BigDecimal surSal = b.getSurSalaire() != null ? b.getSurSalaire() : BigDecimal.ZERO;
            BigDecimal indem = b.getTotalIndemnites() != null ? b.getTotalIndemnites() : BigDecimal.ZERO;
            BigDecimal sBrut = b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO;
            BigDecimal cnss = b.getCotisationCnss() != null ? b.getCotisationCnss() : BigDecimal.ZERO;
            BigDecimal partPat = b.getTotalCotisationsPatronales() != null ? b.getTotalCotisationsPatronales() : BigDecimal.ZERO;
            BigDecimal baseImp = b.getBaseImposable() != null ? b.getBaseImposable() : BigDecimal.ZERO;
            int charges = 0;
            if (b.getLines() != null) {
                BulletinLine iutsL = b.getLines().stream().filter(l -> "IUTS".equalsIgnoreCase(l.getCode()) || "IMP_IUTS".equalsIgnoreCase(l.getCode())).findFirst().orElse(null);
                if (iutsL != null && iutsL.getTaux() != null) {
                    charges = iutsL.getTaux().intValue();
                }
            }
            BigDecimal iuts = b.getImpotIuts() != null ? b.getImpotIuts() : BigDecimal.ZERO;
            BigDecimal sNet = b.getSalaireNet() != null ? b.getSalaireNet() : BigDecimal.ZERO;
            BigDecimal totRet = b.getTotalRetenues() != null ? b.getTotalRetenues() : BigDecimal.ZERO;
            BigDecimal netAPayer = sNet;
            BigDecimal tpa = sBrut.multiply(new BigDecimal("0.03")).setScale(0, RoundingMode.HALF_UP);
            BigDecimal masseSal = sBrut.add(partPat);

            BigDecimal rappels = BigDecimal.ZERO;
            BigDecimal tropPercus = BigDecimal.ZERO;
            BigDecimal precomptes = BigDecimal.ZERO;

            if (b.getLines() != null) {
                for (BulletinLine l : b.getLines()) {
                    String code = l.getCode() != null ? l.getCode().toUpperCase(Locale.ROOT) : "";
                    String lib = l.getLibelle() != null ? l.getLibelle().toUpperCase(Locale.ROOT) : "";
                    String typeLigne = l.getTypeLigne() != null ? l.getTypeLigne().toUpperCase(Locale.ROOT) : "";
                    BigDecimal montant = l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO;

                    if (code.contains("RAPPEL") || code.contains("AVOIR") || lib.contains("RAPPEL") || lib.contains("AVOIR")) {
                        rappels = rappels.add(montant);
                    } else if (code.contains("TROP") || lib.contains("TROP") || lib.contains("PERCU")) {
                        tropPercus = tropPercus.add(montant);
                    } else if ("PRECOMPTE".equals(typeLigne) || code.startsWith("PREC_") || code.contains("PRET") || code.contains("AVANCE") || lib.contains("PRÉCOMPTE") || lib.contains("PRECOMPTE") || lib.contains("PRÊT")) {
                        precomptes = precomptes.add(montant);
                    }
                }
            }

            if (precomptes.compareTo(BigDecimal.ZERO) == 0 && b.getTotalPrecomptes() != null) {
                precomptes = b.getTotalPrecomptes();
            }

            rows.add(LivrePaieRowDto.builder()
                    .bulletinId(b.getId())
                    .matricule(mat)
                    .nomPrenom(nom)
                    .grade(grade)
                    .salaireBase(sBase)
                    .surSalaire(surSal)
                    .indemnitesEtPrimes(indem)
                    .salaireBrut(sBrut)
                    .assVieillesse(cnss)
                    .partPatronale(partPat)
                    .baseImposable(baseImp)
                    .charges(charges)
                    .impotIuts(iuts)
                    .salaireNet(sNet)
                    .totalRetenues(totRet)
                    .netAPayer(netAPayer)
                    .tpa(tpa)
                    .masseSalariale(masseSal)
                    .emploi(emp)
                    .direction(dir)
                    .service(srv)
                    .indemnites(indem)
                    .totalAvoirs(sBrut)
                    .cotisationCnss(cnss)
                    .totalPrecomptes(precomptes)
                    .totalRappels(rappels)
                    .totalTropPercus(tropPercus)
                    .build());
        }
        return rows;
    }

    private List<EtatNominatifRowDto> buildEtatNominatifRows(List<Bulletin> bulletins) {
        List<EtatNominatifRowDto> rows = new ArrayList<>();
        for (Bulletin b : bulletins) {
            Employee e = b.getEmployee();
            String mat = e != null && e.getMatricule() != null ? e.getMatricule() : "—";
            String nom = e != null ? ((e.getPrenom() != null ? e.getPrenom() : "") + " " + (e.getNom() != null ? e.getNom() : "")).trim().toUpperCase(Locale.ROOT) : "—";
            String poste = e != null && e.getFonction() != null ? (e.getFonction().getName() != null ? e.getFonction().getName() : e.getFonction().getCode()) : (e != null && e.getEmploi() != null ? e.getEmploi().getName() : "Agent");
            String dir = e != null && e.getDirection() != null ? e.getDirection().getName() : "—";
            String classif = b.getGrade() != null ? b.getGrade().getCode() : (e != null && e.getGradeObj() != null ? e.getGradeObj().getCode() : "—");

            List<Map<String, Object>> gains = new ArrayList<>();
            List<Map<String, Object>> retenues = new ArrayList<>();

            if (b.getLines() != null) {
                for (BulletinLine l : b.getLines()) {
                    if (l.getMontant() == null || l.getMontant().compareTo(BigDecimal.ZERO) == 0) continue;
                    Map<String, Object> map = new HashMap<>();
                    map.put("code", l.getCode());
                    map.put("libelle", l.getLibelle());
                    map.put("montant", l.getMontant());

                    if ("GAIN".equalsIgnoreCase(l.getTypeLigne()) || (l.getTypeLigne() == null && l.getMontant().compareTo(BigDecimal.ZERO) > 0 && !l.getCode().contains("RET_") && !l.getCode().contains("COTIS_") && !l.getCode().contains("PREC_") && !l.getCode().contains("IUTS"))) {
                        gains.add(map);
                    } else {
                        retenues.add(map);
                    }
                }
            }

            rows.add(EtatNominatifRowDto.builder()
                    .bulletinId(b.getId())
                    .matricule(mat)
                    .nomPrenom(nom)
                    .poste(poste)
                    .direction(dir)
                    .classification(classif)
                    .salaireBase(b.getSalaireBase() != null ? b.getSalaireBase() : BigDecimal.ZERO)
                    .gains(gains)
                    .retenues(retenues)
                    .salaireBrut(b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO)
                    .totalRetenues(b.getTotalRetenues() != null ? b.getTotalRetenues() : BigDecimal.ZERO)
                    .salaireNet(b.getSalaireNet() != null ? b.getSalaireNet() : BigDecimal.ZERO)
                    .build());
        }
        return rows;
    }

    private List<EtatSalaireDirectionRowDto> buildEtatSalaireRows(List<Bulletin> bulletins) {
        Map<String, List<Bulletin>> grouped = bulletins.stream().collect(Collectors.groupingBy(b -> {
            Employee e = b.getEmployee();
            String dir = e != null && e.getDirection() != null ? e.getDirection().getName() : "Direction Non Rattachée";
            return dir;
        }));

        List<EtatSalaireDirectionRowDto> rows = new ArrayList<>();
        for (Map.Entry<String, List<Bulletin>> entry : grouped.entrySet()) {
            String dirNom = entry.getKey();
            List<Bulletin> blts = entry.getValue();

            int eff = blts.size();
            BigDecimal base = BigDecimal.ZERO;
            BigDecimal indem = BigDecimal.ZERO;
            BigDecimal brut = BigDecimal.ZERO;
            BigDecimal patronale = BigDecimal.ZERO;
            BigDecimal ret = BigDecimal.ZERO;
            BigDecimal net = BigDecimal.ZERO;

            for (Bulletin b : blts) {
                if (b.getSalaireBase() != null) base = base.add(b.getSalaireBase());
                if (b.getTotalIndemnites() != null) indem = indem.add(b.getTotalIndemnites());
                if (b.getSalaireBrut() != null) brut = brut.add(b.getSalaireBrut());
                if (b.getTotalCotisationsPatronales() != null) patronale = patronale.add(b.getTotalCotisationsPatronales());
                if (b.getTotalRetenues() != null) ret = ret.add(b.getTotalRetenues());
                if (b.getSalaireNet() != null) net = net.add(b.getSalaireNet());
            }

            rows.add(EtatSalaireDirectionRowDto.builder()
                    .directionNom(dirNom)
                    .departementNom("Tous Départements")
                    .effectif(eff)
                    .totalSalaireBase(base)
                    .totalIndemnites(indem)
                    .totalBrut(brut)
                    .totalCotisationsPatronales(patronale)
                    .totalMasseSalariale(brut.add(patronale))
                    .totalRetenues(ret)
                    .totalNet(net)
                    .build());
        }
        rows.sort(Comparator.comparing(EtatSalaireDirectionRowDto::getDirectionNom));
        return rows;
    }

    private List<EtatBanqueGroupeDto> buildEtatBanqueRows(List<Bulletin> bulletins) {
        Map<String, List<Bulletin>> grouped = bulletins.stream().collect(Collectors.groupingBy(b -> {
            Employee e = b.getEmployee();
            String bq = e != null && e.getBanque() != null && !e.getBanque().isBlank() ? e.getBanque().trim() : "BANQUE POSTALE DU BURKINA FASO (BPBF)";
            return bq;
        }));

        List<EtatBanqueGroupeDto> rows = new ArrayList<>();
        for (Map.Entry<String, List<Bulletin>> entry : grouped.entrySet()) {
            String banqueNom = entry.getKey();
            List<Bulletin> blts = entry.getValue();

            BigDecimal totalBq = BigDecimal.ZERO;
            List<EtatBanqueGroupeDto.VirementItemDto> virs = new ArrayList<>();

            for (Bulletin b : blts) {
                Employee e = b.getEmployee();
                String mat = e != null && e.getMatricule() != null ? e.getMatricule() : "—";
                String nom = e != null ? ((e.getPrenom() != null ? e.getPrenom() : "") + " " + (e.getNom() != null ? e.getNom() : "")).trim().toUpperCase(Locale.ROOT) : "—";
                String poste = e != null && e.getFonction() != null ? (e.getFonction().getName() != null ? e.getFonction().getName() : e.getFonction().getCode()) : "Collaborateur";
                String iban = e != null && e.getIban() != null && !e.getIban().isBlank() ? e.getIban().replaceAll("\\s+", "") : "";

                String codeBq = "BF080";
                String codeGuichet = "01001";
                String compteCred = !iban.isEmpty() ? iban : (mat.equals("—") ? "00000000000" : String.format("%011d", Math.abs(mat.hashCode() % 10000000000L)));
                String cleRib = "45";

                if (iban.length() >= 23) {
                    try {
                        codeBq = iban.substring(0, 5);
                        codeGuichet = iban.substring(5, 10);
                        compteCred = iban.substring(10, 21);
                        cleRib = iban.substring(21, Math.min(23, iban.length()));
                    } catch (Exception ignored) {}
                }

                BigDecimal net = b.getSalaireNet() != null ? b.getSalaireNet() : BigDecimal.ZERO;
                totalBq = totalBq.add(net);

                virs.add(EtatBanqueGroupeDto.VirementItemDto.builder()
                        .matricule(mat)
                        .nomPrenom(nom)
                        .codeBanque(codeBq)
                        .codeGuichet(codeGuichet)
                        .compteACrediter(compteCred)
                        .cle(cleRib)
                        .montant(net)
                        .emploi(poste)
                        .numeroCompte(compteCred)
                        .iban(iban)
                        .montantNet(net)
                        .build());
            }

            String montantLettres = BulletinPdfService.numberToFrenchWords(totalBq.longValue());

            rows.add(EtatBanqueGroupeDto.builder()
                    .banqueNom(banqueNom)
                    .codeBanque(banqueNom.contains("BPBF") ? "BF080" : "BANQUE")
                    .nombreBeneficiaires(blts.size())
                    .totalNet(totalBq)
                    .montantEnLettres(montantLettres)
                    .virements(virs)
                    .build());
        }
        rows.sort(Comparator.comparing(EtatBanqueGroupeDto::getBanqueNom));
        return rows;
    }

    private List<EtatCnssRowDto> buildEtatCnssRows(List<Bulletin> bulletins) {
        List<EtatCnssRowDto> rows = new ArrayList<>();
        BigDecimal plafondCnss = new BigDecimal("800000");

        for (Bulletin b : bulletins) {
            Employee e = b.getEmployee();
            String mat = e != null && e.getMatricule() != null ? e.getMatricule() : "—";
            String nom = e != null ? ((e.getPrenom() != null ? e.getPrenom() : "") + " " + (e.getNom() != null ? e.getNom() : "")).trim().toUpperCase(Locale.ROOT) : "—";
            String cnssNum = e != null && e.getNumeroCnss() != null ? e.getNumeroCnss() : "—";
            String embauche = e != null && e.getDateEmbauche() != null ? e.getDateEmbauche() : "—";

            BigDecimal brut = b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO;
            BigDecimal assiette = brut.min(plafondCnss);

            // Part Salariale 5.5%
            BigDecimal partSal = b.getCotisationCnss() != null && b.getCotisationCnss().compareTo(BigDecimal.ZERO) > 0
                    ? b.getCotisationCnss()
                    : assiette.multiply(new BigDecimal("0.055")).setScale(0, RoundingMode.HALF_UP);

            // Parts Patronales : PF 7.0%, Risques Pro 3.5%, Retraite 5.5% = 16.0%
            BigDecimal pf = assiette.multiply(new BigDecimal("0.070")).setScale(0, RoundingMode.HALF_UP);
            BigDecimal at = assiette.multiply(new BigDecimal("0.035")).setScale(0, RoundingMode.HALF_UP);
            BigDecimal ret = assiette.multiply(new BigDecimal("0.055")).setScale(0, RoundingMode.HALF_UP);
            BigDecimal totalPat = pf.add(at).add(ret);

            rows.add(EtatCnssRowDto.builder()
                    .matricule(mat)
                    .nomPrenom(nom)
                    .noCnss(cnssNum)
                    .dateEmbauche(embauche)
                    .salaireBrut(brut)
                    .assietteCotisable(assiette)
                    .partSalariale(partSal)
                    .partPatronalePrestations(pf)
                    .partPatronaleRisques(at)
                    .partPatronaleRetraite(ret)
                    .totalPartPatronale(totalPat)
                    .totalCotisationCnss(partSal.add(totalPat))
                    .build());
        }
        return rows;
    }

    private List<EtatIutsRowDto> buildEtatIutsRows(List<Bulletin> bulletins) {
        List<EtatIutsRowDto> rows = new ArrayList<>();
        int ord = 1;
        for (Bulletin b : bulletins) {
            Employee e = b.getEmployee();
            String mat = e != null && e.getMatricule() != null ? e.getMatricule() : "—";
            String nom = e != null ? ((e.getPrenom() != null ? e.getPrenom() : "") + " " + (e.getNom() != null ? e.getNom() : "")).trim().toUpperCase(Locale.ROOT) : "—";

            BigDecimal brut = b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO;
            BigDecimal exon = b.getTotalExonerations() != null ? b.getTotalExonerations() : BigDecimal.ZERO;
            BigDecimal abatt = b.getAbattementForfaitaire() != null ? b.getAbattementForfaitaire() : BigDecimal.ZERO;
            BigDecimal baseImp = b.getBaseImposable() != null ? b.getBaseImposable() : BigDecimal.ZERO;
            int charges = 0;
            if (b.getLines() != null) {
                BulletinLine iutsL = b.getLines().stream().filter(l -> "IUTS".equalsIgnoreCase(l.getCode()) || "IMP_IUTS".equalsIgnoreCase(l.getCode())).findFirst().orElse(null);
                if (iutsL != null && iutsL.getTaux() != null) {
                    charges = iutsL.getTaux().intValue();
                }
            }
            BigDecimal brutIuts = b.getImpotIutsSansCharge() != null ? b.getImpotIutsSansCharge() : (b.getImpotIuts() != null ? b.getImpotIuts() : BigDecimal.ZERO);
            BigDecimal reduc = b.getReductionIutsCharge() != null ? b.getReductionIutsCharge() : BigDecimal.ZERO;
            BigDecimal netIuts = b.getImpotIuts() != null ? b.getImpotIuts() : BigDecimal.ZERO;

            rows.add(EtatIutsRowDto.builder()
                    .numeroOrdre(ord++)
                    .nomPrenom(nom)
                    .salaireBruts(brut)
                    .baseImposable(baseImp)
                    .nbDeCharges(charges)
                    .iutsAReverser(netIuts)
                    .matricule(mat)
                    .salaireBrut(brut)
                    .totalExonerations(exon)
                    .abattementForfaitaire(abatt)
                    .nombreCharges(charges)
                    .impotIutsBrut(brutIuts)
                    .reductionPourCharges(reduc)
                    .impotIutsNet(netIuts)
                    .build());
        }
        return rows;
    }

    private List<EtatPrecompteRowDto> buildEtatPrecompteRows(List<Bulletin> bulletins) {
        List<EtatPrecompteRowDto> rows = new ArrayList<>();
        Set<String> processedKeys = new HashSet<>();

        for (Bulletin b : bulletins) {
            Employee e = b.getEmployee();
            String mat = e != null && e.getMatricule() != null ? e.getMatricule() : "—";
            String nom = e != null ? ((e.getPrenom() != null ? e.getPrenom() : "") + " " + (e.getNom() != null ? e.getNom() : "")).trim().toUpperCase(Locale.ROOT) : "—";
            Long empId = e != null ? e.getId() : null;

            if (b.getLines() != null) {
                for (BulletinLine l : b.getLines()) {
                    String typeLigne = l.getTypeLigne() != null ? l.getTypeLigne().toUpperCase(Locale.ROOT) : "";
                    String code = l.getCode() != null ? l.getCode().toUpperCase(Locale.ROOT) : "";
                    String lib = l.getLibelle() != null ? l.getLibelle().toUpperCase(Locale.ROOT) : "";

                    if ("PRECOMPTE".equalsIgnoreCase(typeLigne) || code.startsWith("PREC_") || code.contains("PRET") || code.contains("AVANCE") || lib.contains("PRÉCOMPTE") || lib.contains("PRECOMPTE") || lib.contains("PRÊT")) {
                        BigDecimal montant = l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO;
                        BigDecimal base = l.getBaseCalcul() != null && l.getBaseCalcul().compareTo(BigDecimal.ZERO) > 0 ? l.getBaseCalcul() : montant.multiply(new BigDecimal("12"));

                        String libelle = l.getLibelle() != null ? l.getLibelle() : "Précompte / Avance";
                        String key = mat + "_" + libelle;
                        processedKeys.add(key);

                        rows.add(EtatPrecompteRowDto.builder()
                                .matricule(mat)
                                .nomPrenom(nom)
                                .typePrecompte(libelle)
                                .organismeBeneficiaire("BANQUE POSTALE DU BURKINA FASO")
                                .montantTotalInitial(base)
                                .retenuePeriode(montant)
                                .soldeRestantDu(base.subtract(montant).max(BigDecimal.ZERO))
                                .echeanceCourante(1)
                                .nombreEcheancesTotal(12)
                                .build());
                    }
                }
            }

            if (empId != null && precompteRepository != null) {
                List<Precompte> dbPrecomptes = precompteRepository.findByEmployeeId(empId);
                for (Precompte p : dbPrecomptes) {
                    String typeP = p.getSalaryElement() != null ? p.getSalaryElement().getName() : (p.getMotif() != null ? p.getMotif() : "Prêt du Personnel");
                    String key = mat + "_" + typeP;
                    if (!processedKeys.contains(key)) {
                        processedKeys.add(key);
                        BigDecimal retMens = p.getRetenueMensuelle() != null ? p.getRetenueMensuelle() : (p.getAmount() != null && p.getEcheance() != null && p.getEcheance() > 0 ? p.getAmount().divide(new BigDecimal(p.getEcheance()), 0, RoundingMode.HALF_UP) : BigDecimal.ZERO);
                        BigDecimal totalInit = p.getAmount() != null ? p.getAmount() : retMens.multiply(new BigDecimal("12"));
                        BigDecimal solde = p.getMontantRestant() != null ? p.getMontantRestant() : totalInit.subtract(retMens).max(BigDecimal.ZERO);

                        rows.add(EtatPrecompteRowDto.builder()
                                .matricule(mat)
                                .nomPrenom(nom)
                                .typePrecompte(typeP)
                                .organismeBeneficiaire("BANQUE POSTALE DU BURKINA FASO")
                                .montantTotalInitial(totalInit)
                                .retenuePeriode(retMens)
                                .soldeRestantDu(solde)
                                .echeanceCourante(1)
                                .nombreEcheancesTotal(p.getEcheance() != null ? p.getEcheance() : 12)
                                .build());
                    }
                }
            }
        }
        return rows;
    }

    private List<EtatFspRowDto> buildEtatFspRows(List<Bulletin> bulletins) {
        List<EtatFspRowDto> rows = new ArrayList<>();
        int ord = 1;
        for (Bulletin b : bulletins) {
            Employee e = b.getEmployee();
            String mat = e != null && e.getMatricule() != null ? e.getMatricule() : "—";
            String nom = e != null ? ((e.getPrenom() != null ? e.getPrenom() : "") + " " + (e.getNom() != null ? e.getNom() : "")).trim().toUpperCase(Locale.ROOT) : "—";
            String dir = e != null && e.getDirection() != null ? e.getDirection().getName() : "—";

            BigDecimal fspMontant = BigDecimal.ZERO;
            BigDecimal fspBase = b.getSalaireNet() != null ? b.getSalaireNet() : BigDecimal.ZERO;
            BigDecimal fspTaux = new BigDecimal("1.00");

            if (b.getLines() != null) {
                for (BulletinLine l : b.getLines()) {
                    if (l.getCode() != null && (l.getCode().contains("FSP") || l.getCode().contains("SOLIDAR"))) {
                        fspMontant = fspMontant.add(l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO);
                        if (l.getBaseCalcul() != null) fspBase = l.getBaseCalcul();
                        if (l.getTaux() != null && l.getTaux().compareTo(BigDecimal.ZERO) > 0) fspTaux = l.getTaux();
                    }
                }
            }

            if (fspMontant.compareTo(BigDecimal.ZERO) > 0) {
                rows.add(EtatFspRowDto.builder()
                        .numeroOrdre(ord++)
                        .matricule(mat)
                        .nomPrenom(nom)
                        .salaireNet(fspBase)
                        .taux(fspTaux)
                        .montant(fspMontant)
                        .direction(dir)
                        .salaireBrut(b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO)
                        .assietteCalcul(fspBase)
                        .tauxFsp(fspTaux)
                        .montantRetenu(fspMontant)
                        .build());
            }
        }
        return rows;
    }

    private List<RecapitulatifGlobalRowDto> buildRecapitulatifGlobalRows(List<Bulletin> bulletins) {
        BigDecimal totalSalBase = BigDecimal.ZERO;
        BigDecimal totalSurSal = BigDecimal.ZERO;
        BigDecimal totalIndemnites = BigDecimal.ZERO;
        BigDecimal totalCnssPatronale = BigDecimal.ZERO;
        BigDecimal totalCrraePatronale = BigDecimal.ZERO;
        BigDecimal totalTpa = BigDecimal.ZERO;

        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalCnssSal = BigDecimal.ZERO;
        BigDecimal totalCrraeSal = BigDecimal.ZERO;
        BigDecimal totalIuts = BigDecimal.ZERO;
        BigDecimal totalFsp = BigDecimal.ZERO;
        BigDecimal totalPrecomptes = BigDecimal.ZERO;

        BigDecimal totalRappels = BigDecimal.ZERO;
        BigDecimal totalTropPercus = BigDecimal.ZERO;

        for (Bulletin b : bulletins) {
            if (b.getSalaireBase() != null) totalSalBase = totalSalBase.add(b.getSalaireBase());
            if (b.getSurSalaire() != null) totalSurSal = totalSurSal.add(b.getSurSalaire());
            if (b.getTotalIndemnites() != null) totalIndemnites = totalIndemnites.add(b.getTotalIndemnites());
            if (b.getSalaireNet() != null) totalNet = totalNet.add(b.getSalaireNet());
            if (b.getCotisationCnss() != null) totalCnssSal = totalCnssSal.add(b.getCotisationCnss());
            if (b.getImpotIuts() != null) totalIuts = totalIuts.add(b.getImpotIuts());
            if (b.getTotalPrecomptes() != null) totalPrecomptes = totalPrecomptes.add(b.getTotalPrecomptes());

            if (b.getLines() != null) {
                for (BulletinLine l : b.getLines()) {
                    String c = l.getCode() != null ? l.getCode().toUpperCase(Locale.ROOT) : "";
                    String lib = l.getLibelle() != null ? l.getLibelle().toUpperCase(Locale.ROOT) : "";
                    String typeL = l.getTypeLigne() != null ? l.getTypeLigne().toUpperCase(Locale.ROOT) : "";
                    BigDecimal m = l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO;

                    if (c.contains("CRRAE") || lib.contains("CRRAE")) {
                        if (l.getMontant() != null) totalCrraeSal = totalCrraeSal.add(l.getMontant());
                        if (l.getPartPatronale() != null) totalCrraePatronale = totalCrraePatronale.add(l.getPartPatronale());
                    }
                    if (c.contains("FSP") || c.contains("SOLIDAR") || lib.contains("SOLIDAR")) {
                        if (l.getMontant() != null) totalFsp = totalFsp.add(l.getMontant());
                    }
                    if (c.contains("RAPPEL") || c.contains("AVOIR") || lib.contains("RAPPEL") || lib.contains("AVOIR")) {
                        totalRappels = totalRappels.add(m);
                    }
                    if (c.contains("TROP") || lib.contains("TROP") || lib.contains("PERCU")) {
                        totalTropPercus = totalTropPercus.add(m);
                    }
                    if ("PRECOMPTE".equals(typeL) || c.startsWith("PREC_") || c.contains("PRET") || c.contains("AVANCE")) {
                        totalPrecomptes = totalPrecomptes.add(m);
                    }
                }
            }

            BigDecimal brut = b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO;
            BigDecimal baseCnss = brut.min(new BigDecimal("600000"));
            totalCnssPatronale = totalCnssPatronale.add(baseCnss.multiply(new BigDecimal("0.16")).setScale(0, RoundingMode.HALF_UP));
            totalTpa = totalTpa.add(brut.multiply(new BigDecimal("0.03")).setScale(0, RoundingMode.HALF_UP));
        }

        BigDecimal totalCnssGlobal = totalCnssSal.add(totalCnssPatronale);
        BigDecimal totalCrraeGlobal = totalCrraeSal.add(totalCrraePatronale);

        List<RecapitulatifGlobalRowDto> rows = new ArrayList<>();
        // Débit : Charges de personnel (Comptes 64)
        rows.add(RecapitulatifGlobalRowDto.builder()
                .numeroCompte("642100")
                .intituleCompte("Salaires de base du personnel")
                .sens("DEBIT")
                .montantDebit(totalSalBase)
                .montantCredit(BigDecimal.ZERO)
                .categorieComptable("CHARGES_PERSONNEL")
                .build());

        if (totalSurSal.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("642200")
                    .intituleCompte("Sur-salaires du personnel")
                    .sens("DEBIT")
                    .montantDebit(totalSurSal)
                    .montantCredit(BigDecimal.ZERO)
                    .categorieComptable("CHARGES_PERSONNEL")
                    .build());
        }

        if (totalIndemnites.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("642300")
                    .intituleCompte("Indemnités, primes et gratifications diverses")
                    .sens("DEBIT")
                    .montantDebit(totalIndemnites)
                    .montantCredit(BigDecimal.ZERO)
                    .categorieComptable("CHARGES_PERSONNEL")
                    .build());
        }

        if (totalRappels.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("642500")
                    .intituleCompte("Rappels sur salaires antérieurs (Avoirs accordés)")
                    .sens("DEBIT")
                    .montantDebit(totalRappels)
                    .montantCredit(BigDecimal.ZERO)
                    .categorieComptable("CHARGES_PERSONNEL")
                    .build());
        }

        if (totalCnssPatronale.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("641100")
                    .intituleCompte("Cotisations patronales de sécurité sociale (CNSS)")
                    .sens("DEBIT")
                    .montantDebit(totalCnssPatronale)
                    .montantCredit(BigDecimal.ZERO)
                    .categorieComptable("CHARGES_SOCIALES")
                    .build());
        }

        if (totalCrraePatronale.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("641200")
                    .intituleCompte("Cotisations patronales régimes complémentaires (CRRAE)")
                    .sens("DEBIT")
                    .montantDebit(totalCrraePatronale)
                    .montantCredit(BigDecimal.ZERO)
                    .categorieComptable("CHARGES_SOCIALES")
                    .build());
        }

        if (totalTpa.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("641300")
                    .intituleCompte("Taxe Patronale d'Apprentissage (TPA)")
                    .sens("DEBIT")
                    .montantDebit(totalTpa)
                    .montantCredit(BigDecimal.ZERO)
                    .categorieComptable("IMPOTS_TAXES")
                    .build());
        }

        // Crédit : Rémunérations nettes, Organismes et État
        rows.add(RecapitulatifGlobalRowDto.builder()
                .numeroCompte("352200")
                .intituleCompte("Personnel - Rémunérations nettes à payer (Virements)")
                .sens("CREDIT")
                .montantDebit(BigDecimal.ZERO)
                .montantCredit(totalNet)
                .categorieComptable("DETTES_PERSONNEL")
                .build());

        if (totalCnssGlobal.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("431100")
                    .intituleCompte("Sécurité Sociale (CNSS Part Salariale + Patronale)")
                    .sens("CREDIT")
                    .montantDebit(BigDecimal.ZERO)
                    .montantCredit(totalCnssGlobal)
                    .categorieComptable("ORGANISMES_SOCIAUX")
                    .build());
        }

        if (totalCrraeGlobal.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("431200")
                    .intituleCompte("Organismes de Prévoyance (CRRAE RRPC/RCPNC/FAAM)")
                    .sens("CREDIT")
                    .montantDebit(BigDecimal.ZERO)
                    .montantCredit(totalCrraeGlobal)
                    .categorieComptable("ORGANISMES_SOCIAUX")
                    .build());
        }

        if (totalIuts.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("447100")
                    .intituleCompte("État - Impôt Unique sur Traitements & Salaires (IUTS)")
                    .sens("CREDIT")
                    .montantDebit(BigDecimal.ZERO)
                    .montantCredit(totalIuts)
                    .categorieComptable("DETTES_FISCALES")
                    .build());
        }

        if (totalFsp.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("447200")
                    .intituleCompte("État - Fonds de Soutien Patriotique (FSP)")
                    .sens("CREDIT")
                    .montantDebit(BigDecimal.ZERO)
                    .montantCredit(totalFsp)
                    .categorieComptable("DETTES_FISCALES")
                    .build());
        }

        if (totalTpa.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("447300")
                    .intituleCompte("État - Taxe Patronale d'Apprentissage à reverser (TPA)")
                    .sens("CREDIT")
                    .montantDebit(BigDecimal.ZERO)
                    .montantCredit(totalTpa)
                    .categorieComptable("DETTES_FISCALES")
                    .build());
        }

        if (totalPrecomptes.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("422000")
                    .intituleCompte("Personnel - Prêts, avances et précomptes récupérés")
                    .sens("CREDIT")
                    .montantDebit(BigDecimal.ZERO)
                    .montantCredit(totalPrecomptes)
                    .categorieComptable("CREANCES_PERSONNEL")
                    .build());
        }

        if (totalTropPercus.compareTo(BigDecimal.ZERO) > 0) {
            rows.add(RecapitulatifGlobalRowDto.builder()
                    .numeroCompte("428700")
                    .intituleCompte("Personnel - Trop-perçus régularisés sur salaires antérieurs")
                    .sens("CREDIT")
                    .montantDebit(BigDecimal.ZERO)
                    .montantCredit(totalTropPercus)
                    .categorieComptable("CREANCES_PERSONNEL")
                    .build());
        }

        return rows;
    }

    private List<EtatCrraeRowDto> buildEtatCrraeRows(List<Bulletin> bulletins, String typeRegime) {
        List<EtatCrraeRowDto> rows = new ArrayList<>();
        BigDecimal tauxPat;
        BigDecimal tauxSal;

        if ("RRPC".equalsIgnoreCase(typeRegime) || "ETAT_CRRAE_RRPC".equalsIgnoreCase(typeRegime)) {
            tauxPat = new BigDecimal("12.67");
            tauxSal = new BigDecimal("6.33");
            typeRegime = "RRPC (19%)";
        } else if ("FAAM".equalsIgnoreCase(typeRegime) || "ETAT_CRRAE_FAAM".equalsIgnoreCase(typeRegime)) {
            tauxPat = new BigDecimal("1.00");
            tauxSal = new BigDecimal("0.50");
            typeRegime = "FAAM (1.5%)";
        } else {
            tauxPat = new BigDecimal("6.00");
            tauxSal = new BigDecimal("6.00");
            typeRegime = "RCPNC (12%)";
        }

        int ord = 1;
        for (Bulletin b : bulletins) {
            Employee e = b.getEmployee();
            String mat = e != null && e.getMatricule() != null ? e.getMatricule() : "—";
            String nom = e != null ? ((e.getPrenom() != null ? e.getPrenom() : "") + " " + (e.getNom() != null ? e.getNom() : "")).trim().toUpperCase(Locale.ROOT) : "—";

            BigDecimal base = b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO;
            BigDecimal salBase = b.getSalaireBase() != null ? b.getSalaireBase() : BigDecimal.ZERO;
            BigDecimal surSal = b.getSurSalaire() != null ? b.getSurSalaire() : BigDecimal.ZERO;
            BigDecimal assiette = salBase.add(surSal);
            if (assiette.compareTo(BigDecimal.ZERO) <= 0) assiette = base;

            BigDecimal partPat = assiette.multiply(tauxPat).divide(new BigDecimal("100"), 0, RoundingMode.HALF_UP);
            BigDecimal partSal = assiette.multiply(tauxSal).divide(new BigDecimal("100"), 0, RoundingMode.HALF_UP);
            BigDecimal totalCotis = partPat.add(partSal);

            rows.add(EtatCrraeRowDto.builder()
                    .numeroOrdre(ord++)
                    .matricule(mat)
                    .nomPrenom(nom)
                    .salaireSoumisCotisation(assiette)
                    .tauxPatronal(tauxPat)
                    .cotisationPatronale(partPat)
                    .tauxSalarial(tauxSal)
                    .cotisationSalariale(partSal)
                    .montantTotalCotisations(totalCotis)
                    .typeRegime(typeRegime)
                    .build());
        }
        return rows;
    }

    private List<EtatMutuelleRowDto> buildEtatMutuelleRows(List<Bulletin> bulletins) {
        List<EtatMutuelleRowDto> rows = new ArrayList<>();
        for (Bulletin b : bulletins) {
            Employee e = b.getEmployee();
            String mat = e != null && e.getMatricule() != null ? e.getMatricule() : "—";
            String nom = e != null ? ((e.getPrenom() != null ? e.getPrenom() : "") + " " + (e.getNom() != null ? e.getNom() : "")).trim().toUpperCase(Locale.ROOT) : "—";
            String dir = e != null && e.getDirection() != null ? e.getDirection().getName() : "—";

            BigDecimal mutSal = BigDecimal.ZERO;
            BigDecimal mutPat = BigDecimal.ZERO;

            if (b.getLines() != null) {
                for (BulletinLine l : b.getLines()) {
                    if (l.getCode() != null && (l.getCode().contains("MUT") || l.getCode().contains("SANTE") || l.getCode().contains("PREVOY"))) {
                        mutSal = mutSal.add(l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO);
                        if (l.getPartPatronale() != null) mutPat = mutPat.add(l.getPartPatronale());
                    }
                }
            }

            if (mutSal.compareTo(BigDecimal.ZERO) > 0 || mutPat.compareTo(BigDecimal.ZERO) > 0) {
                rows.add(EtatMutuelleRowDto.builder()
                        .matricule(mat)
                        .nomPrenom(nom)
                        .direction(dir)
                        .formuleMutuelle("Régime Standard BPBF Santé")
                        .partSalariale(mutSal)
                        .partPatronale(mutPat)
                        .totalCotisation(mutSal.add(mutPat))
                        .build());
            }
        }
        return rows;
    }

    private List<EtatTypeEmployeRowDto> buildEtatTypeEmployeRows(List<Bulletin> bulletins) {
        Map<String, List<Bulletin>> grouped = bulletins.stream().collect(Collectors.groupingBy(b -> {
            Employee e = b.getEmployee();
            if (e == null) return "Non Classifié";
            if (b.getContrat() != null && b.getContrat().getTypeContratObj() != null && b.getContrat().getTypeContratObj().getName() != null) {
                return b.getContrat().getTypeContratObj().getName();
            }
            Grade g = b.getGrade() != null ? b.getGrade() : (e != null ? e.getGradeObj() : null);
            if (g != null && g.getCode() != null) {
                String c = g.getCode().toUpperCase(Locale.ROOT);
                if (c.startsWith("C") || c.contains("CADRE")) return "Cadres";
                if (c.startsWith("M") || c.contains("MAITRISE")) return "Agents de Maîtrise";
                return "Employés";
            }
            return "Personnel Bancaire CDI";
        }));

        List<EtatTypeEmployeRowDto> rows = new ArrayList<>();
        for (Map.Entry<String, List<Bulletin>> entry : grouped.entrySet()) {
            String typeEmp = entry.getKey();
            List<Bulletin> blts = entry.getValue();

            int eff = blts.size();
            BigDecimal base = BigDecimal.ZERO;
            BigDecimal indem = BigDecimal.ZERO;
            BigDecimal brut = BigDecimal.ZERO;
            BigDecimal patronale = BigDecimal.ZERO;
            BigDecimal ret = BigDecimal.ZERO;
            BigDecimal net = BigDecimal.ZERO;

            for (Bulletin b : blts) {
                if (b.getSalaireBase() != null) base = base.add(b.getSalaireBase());
                if (b.getTotalIndemnites() != null) indem = indem.add(b.getTotalIndemnites());
                if (b.getSalaireBrut() != null) brut = brut.add(b.getSalaireBrut());
                if (b.getTotalCotisationsPatronales() != null) patronale = patronale.add(b.getTotalCotisationsPatronales());
                if (b.getTotalRetenues() != null) ret = ret.add(b.getTotalRetenues());
                if (b.getSalaireNet() != null) net = net.add(b.getSalaireNet());
            }

            BigDecimal moyNet = eff > 0 ? net.divide(BigDecimal.valueOf(eff), 0, RoundingMode.HALF_UP) : BigDecimal.ZERO;

            rows.add(EtatTypeEmployeRowDto.builder()
                    .typeEmploye(typeEmp)
                    .effectif(eff)
                    .totalSalaireBase(base)
                    .totalIndemnites(indem)
                    .totalBrut(brut)
                    .totalCotisationsPatronales(patronale)
                    .totalRetenues(ret)
                    .totalNet(net)
                    .salaireMoyenNet(moyNet)
                    .build());
        }
        rows.sort(Comparator.comparing(EtatTypeEmployeRowDto::getTypeEmploye));
        return rows;
    }

    private List<EtatElementSalaireRowDto> buildEtatElementsSalaireRows(List<Bulletin> bulletins) {
        Map<String, List<BulletinLine>> linesByRubrique = new HashMap<>();

        for (Bulletin b : bulletins) {
            if (b.getLines() != null) {
                for (BulletinLine l : b.getLines()) {
                    String code = l.getCode() != null ? l.getCode() : "RUB";
                    linesByRubrique.computeIfAbsent(code, k -> new ArrayList<>()).add(l);
                }
            }
        }

        List<EtatElementSalaireRowDto> rows = new ArrayList<>();
        for (Map.Entry<String, List<BulletinLine>> entry : linesByRubrique.entrySet()) {
            String code = entry.getKey();
            List<BulletinLine> lList = entry.getValue();

            String lib = lList.get(0).getLibelle() != null ? lList.get(0).getLibelle() : code;
            String typeL = lList.get(0).getTypeLigne() != null ? lList.get(0).getTypeLigne() : "GAIN";

            BigDecimal totSal = BigDecimal.ZERO;
            BigDecimal totPat = BigDecimal.ZERO;
            int countBenef = 0;

            for (BulletinLine l : lList) {
                BigDecimal m = l.getMontant() != null ? l.getMontant() : BigDecimal.ZERO;
                BigDecimal p = l.getPartPatronale() != null ? l.getPartPatronale() : BigDecimal.ZERO;
                if (m.compareTo(BigDecimal.ZERO) > 0 || p.compareTo(BigDecimal.ZERO) > 0) {
                    countBenef++;
                    totSal = totSal.add(m);
                    totPat = totPat.add(p);
                }
            }

            if (countBenef > 0) {
                rows.add(EtatElementSalaireRowDto.builder()
                        .codeRubrique(code)
                        .libelleRubrique(lib)
                        .typeRubrique(typeL)
                        .nombreBeneficiaires(countBenef)
                        .totalMontantSalarial(totSal)
                        .totalMontantPatronal(totPat)
                        .totalGlobal(totSal.add(totPat))
                        .build());
            }
        }
        rows.sort(Comparator.comparing(EtatElementSalaireRowDto::getCodeRubrique));
        return rows;
    }

    private List<EtatBulletinControleRowDto> buildEtatBulletinControleRows(List<Bulletin> bulletins) {
        List<EtatBulletinControleRowDto> rows = new ArrayList<>();
        for (Bulletin b : bulletins) {
            Employee e = b.getEmployee();
            String mat = e != null && e.getMatricule() != null ? e.getMatricule() : "—";
            String nom = e != null ? ((e.getPrenom() != null ? e.getPrenom() : "") + " " + (e.getNom() != null ? e.getNom() : "")).trim().toUpperCase(Locale.ROOT) : "—";
            String dir = e != null && e.getDirection() != null ? e.getDirection().getName() : "—";

            rows.add(EtatBulletinControleRowDto.builder()
                    .bulletinId(b.getId())
                    .codeBulletin(b.getCode() != null ? b.getCode() : ("BLT-" + b.getId()))
                    .matricule(mat)
                    .nomPrenom(nom)
                    .direction(dir)
                    .typeSession(b.getTypeSession() != null ? b.getTypeSession() : "ORDINAIRE")
                    .statut(b.getStatut() != null ? b.getStatut() : "GENERE")
                    .salaireBrut(b.getSalaireBrut() != null ? b.getSalaireBrut() : BigDecimal.ZERO)
                    .totalRetenues(b.getTotalRetenues() != null ? b.getTotalRetenues() : BigDecimal.ZERO)
                    .salaireNet(b.getSalaireNet() != null ? b.getSalaireNet() : BigDecimal.ZERO)
                    .dateCalcul(b.getDateCalcul())
                    .dateValidation(b.getDateValidation())
                    .justificationEcart(b.getJustificationEcart())
                    .build());
        }
        return rows;
    }

    // ─── GÉNÉRATION DU PDF OFFICIEL ─────────────────────────────────────────

    public byte[] generatePdfReport(String typeEtat, Long sessionPaieId, Long bulletinLotId, Long directionId, String banqueNom) {
        EtatSyntheseWrapperDto etat = getEtatSynthese(typeEtat, sessionPaieId, bulletinLotId, directionId, banqueNom);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate(), 15, 15, 20, 20);

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // En-tête officiel BPBF
            addReportHeader(document, etat);

            // Tableau de données selon le type
            addReportTable(document, etat);

            // Pied de page officiel avec totaux et signataires
            addReportFooter(document, etat);

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Erreur lors de la génération du PDF d'état de synthèse : " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }

    private void addReportHeader(Document doc, EtatSyntheseWrapperDto etat) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{60, 40});
        table.setSpacingAfter(10f);

        PdfPCell leftCell = new PdfPCell();
        leftCell.setBorder(Rectangle.NO_BORDER);

        Paragraph pBank = new Paragraph("BANQUE POSTALE DU BURKINA FASO", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BPBF_NAVY));
        Paragraph pSub = new Paragraph("DIRECTION DU CAPITAL HUMAIN & DE LA PAIE", FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY));
        Paragraph pTitle = new Paragraph(etat.getTitreEtat().toUpperCase(Locale.ROOT), FONT_TITLE);
        pTitle.setSpacingBefore(4f);

        leftCell.addElement(pBank);
        leftCell.addElement(pSub);
        leftCell.addElement(pTitle);

        PdfPCell rightCell = new PdfPCell();
        rightCell.setBorder(Rectangle.NO_BORDER);
        rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        Paragraph pSess = new Paragraph("SESSION : " + etat.getCodeSession(), FONT_SUBTITLE);
        pSess.setAlignment(Element.ALIGN_RIGHT);
        Paragraph pPer = new Paragraph("Période : " + etat.getPeriode(), FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_DARK));
        pPer.setAlignment(Element.ALIGN_RIGHT);
        Paragraph pEff = new Paragraph("Effectif traité : " + etat.getNombreBulletins() + " agents", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BPBF_BLUE));
        pEff.setAlignment(Element.ALIGN_RIGHT);

        rightCell.addElement(pSess);
        rightCell.addElement(pPer);
        rightCell.addElement(pEff);

        table.addCell(leftCell);
        table.addCell(rightCell);
        doc.add(table);
    }

    private void addReportTable(Document doc, EtatSyntheseWrapperDto etat) throws DocumentException {
        String type = etat.getTypeEtat();
        List<Object> data = etat.getDonnees();

        if ("RECAPITULATIF_GLOBAL".equalsIgnoreCase(type)) {
            addTableRecapitulatifGlobal(doc, data);
        } else if ("ETAT_CRRAE_RRPC".equalsIgnoreCase(type) || "ETAT_CRRAE_RCPNC".equalsIgnoreCase(type) || "ETAT_CRRAE_FAAM".equalsIgnoreCase(type)) {
            addTableCrrae(doc, data, etat.getTitreEtat());
        } else if ("ETAT_BANQUE".equalsIgnoreCase(type)) {
            addTableBanque(doc, data);
        } else if ("ETAT_CNSS".equalsIgnoreCase(type)) {
            addTableCnss(doc, data);
        } else if ("ETAT_IUTS".equalsIgnoreCase(type)) {
            addTableIuts(doc, data);
        } else if ("ETAT_SALAIRE".equalsIgnoreCase(type)) {
            addTableSalaire(doc, data);
        } else if ("ETAT_PRECOMPTE".equalsIgnoreCase(type)) {
            addTablePrecompte(doc, data);
        } else if ("ETAT_FSP".equalsIgnoreCase(type)) {
            addTableFsp(doc, data);
        } else if ("ETAT_MUTUELLE".equalsIgnoreCase(type)) {
            addTableMutuelle(doc, data);
        } else if ("ETAT_ELEMENTS_SALAIRE".equalsIgnoreCase(type)) {
            addTableElementsSalaire(doc, data);
        } else if ("ETAT_TYPE_EMPLOYE".equalsIgnoreCase(type)) {
            addTableTypeEmploye(doc, data);
        } else {
            // LIVRE_PAIE par défaut
            addTableLivrePaie(doc, data);
        }
    }

    private void addTableRecapitulatifGlobal(Document doc, List<Object> data) throws DocumentException {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{15, 45, 20, 20});
        table.setSpacingAfter(8f);

        addTh(table, "COMPTE", Element.ALIGN_LEFT);
        addTh(table, "LIBELLÉ DU COMPTE", Element.ALIGN_LEFT);
        addTh(table, "DÉBIT (FCFA)", Element.ALIGN_RIGHT);
        addTh(table, "CRÉDIT (FCFA)", Element.ALIGN_RIGHT);

        BigDecimal totDebit = BigDecimal.ZERO;
        BigDecimal totCredit = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof RecapitulatifGlobalRowDto row) {
                addTd(table, row.getNumeroCompte(), Element.ALIGN_LEFT, false);
                addTd(table, row.getIntituleCompte(), Element.ALIGN_LEFT, false);
                addTd(table, row.getMontantDebit() != null && row.getMontantDebit().compareTo(BigDecimal.ZERO) > 0 ? formatMoney(row.getMontantDebit()) : "—", Element.ALIGN_RIGHT, false);
                addTd(table, row.getMontantCredit() != null && row.getMontantCredit().compareTo(BigDecimal.ZERO) > 0 ? formatMoney(row.getMontantCredit()) : "—", Element.ALIGN_RIGHT, false);

                if (row.getMontantDebit() != null) totDebit = totDebit.add(row.getMontantDebit());
                if (row.getMontantCredit() != null) totCredit = totCredit.add(row.getMontantCredit());
            }
        }

        addTot(table, "TOTAL DE L'ÉTAT (BALANCE ÉQUILIBRÉE)", 2, Element.ALIGN_LEFT);
        addTot(table, formatMoney(totDebit), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totCredit), 1, Element.ALIGN_RIGHT);

        doc.add(table);
    }

    private void addTableCrrae(Document doc, List<Object> data, String titre) throws DocumentException {
        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{8, 12, 34, 14, 11, 10, 11});
        table.setSpacingAfter(8f);

        addTh(table, "N° D'ORDRE", Element.ALIGN_CENTER);
        addTh(table, "MATRICULE", Element.ALIGN_LEFT);
        addTh(table, "NOM ET PRÉNOMS", Element.ALIGN_LEFT);
        addTh(table, "SALAIRE SOUMIS", Element.ALIGN_RIGHT);
        addTh(table, "PART EMPLOY.", Element.ALIGN_RIGHT);
        addTh(table, "PART SALAR.", Element.ALIGN_RIGHT);
        addTh(table, "TOTAL COTIS.", Element.ALIGN_RIGHT);

        BigDecimal totBase = BigDecimal.ZERO;
        BigDecimal totPat = BigDecimal.ZERO;
        BigDecimal totSal = BigDecimal.ZERO;
        BigDecimal totCotis = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof EtatCrraeRowDto row) {
                addTd(table, String.valueOf(row.getNumeroOrdre() != null ? row.getNumeroOrdre() : "—"), Element.ALIGN_CENTER, false);
                addTd(table, row.getMatricule(), Element.ALIGN_LEFT, false);
                addTd(table, row.getNomPrenom(), Element.ALIGN_LEFT, false);
                addTd(table, formatMoney(row.getSalaireSoumisCotisation()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getCotisationPatronale()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getCotisationSalariale()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getMontantTotalCotisations()), Element.ALIGN_RIGHT, true);

                if (row.getSalaireSoumisCotisation() != null) totBase = totBase.add(row.getSalaireSoumisCotisation());
                if (row.getCotisationPatronale() != null) totPat = totPat.add(row.getCotisationPatronale());
                if (row.getCotisationSalariale() != null) totSal = totSal.add(row.getCotisationSalariale());
                if (row.getMontantTotalCotisations() != null) totCotis = totCotis.add(row.getMontantTotalCotisations());
            }
        }

        addTot(table, "TOTAL DÉCLARATION COTISATIONS", 3, Element.ALIGN_LEFT);
        addTot(table, formatMoney(totBase), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totPat), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totSal), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totCotis), 1, Element.ALIGN_RIGHT);

        doc.add(table);
    }

    private void addTableLivrePaie(Document doc, List<Object> data) throws DocumentException {
        // Page 3 - REGISTRE DE PAIE : 17 colonnes officielles
        PdfPTable table = new PdfPTable(17);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{4, 13, 4, 6, 6, 6, 6, 5, 6, 6, 3, 5, 6, 6, 6, 5, 7});
        table.setSpacingAfter(8f);

        addThMini(table, "Mle");
        addThMini(table, "Nom et Prénoms");
        addThMini(table, "Grade");
        addThMini(table, "Sal. base");
        addThMini(table, "Sursalaire");
        addThMini(table, "Indem. & Pr.");
        addThMini(table, "Total brut");
        addThMini(table, "Ass. vi.");
        addThMini(table, "Part patr.");
        addThMini(table, "Base imp.");
        addThMini(table, "Chrg");
        addThMini(table, "IUTS");
        addThMini(table, "Sal. net");
        addThMini(table, "Tot. ret.");
        addThMini(table, "Net payer");
        addThMini(table, "TPA");
        addThMini(table, "Masse sal.");

        BigDecimal totBase = BigDecimal.ZERO;
        BigDecimal totSurSal = BigDecimal.ZERO;
        BigDecimal totIndem = BigDecimal.ZERO;
        BigDecimal totBrut = BigDecimal.ZERO;
        BigDecimal totCnss = BigDecimal.ZERO;
        BigDecimal totPat = BigDecimal.ZERO;
        BigDecimal totBaseImp = BigDecimal.ZERO;
        BigDecimal totIuts = BigDecimal.ZERO;
        BigDecimal totNet = BigDecimal.ZERO;
        BigDecimal totRet = BigDecimal.ZERO;
        BigDecimal totNetPayer = BigDecimal.ZERO;
        BigDecimal totTpa = BigDecimal.ZERO;
        BigDecimal totMasseSal = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof LivrePaieRowDto row) {
                addTdMini(table, row.getMatricule(), Element.ALIGN_LEFT, false);
                addTdMini(table, row.getNomPrenom(), Element.ALIGN_LEFT, false);
                addTdMini(table, row.getGrade(), Element.ALIGN_CENTER, false);
                addTdMini(table, formatMoney(row.getSalaireBase()), Element.ALIGN_RIGHT, false);
                addTdMini(table, formatMoney(row.getSurSalaire()), Element.ALIGN_RIGHT, false);
                addTdMini(table, formatMoney(row.getIndemnitesEtPrimes()), Element.ALIGN_RIGHT, false);
                addTdMini(table, formatMoney(row.getSalaireBrut()), Element.ALIGN_RIGHT, false);
                addTdMini(table, formatMoney(row.getAssVieillesse()), Element.ALIGN_RIGHT, false);
                addTdMini(table, formatMoney(row.getPartPatronale()), Element.ALIGN_RIGHT, false);
                addTdMini(table, formatMoney(row.getBaseImposable()), Element.ALIGN_RIGHT, false);
                addTdMini(table, String.valueOf(row.getCharges() != null ? row.getCharges() : 0), Element.ALIGN_CENTER, false);
                addTdMini(table, formatMoney(row.getImpotIuts()), Element.ALIGN_RIGHT, false);
                addTdMini(table, formatMoney(row.getSalaireNet()), Element.ALIGN_RIGHT, false);
                addTdMini(table, formatMoney(row.getTotalRetenues()), Element.ALIGN_RIGHT, false);
                addTdMini(table, formatMoney(row.getNetAPayer()), Element.ALIGN_RIGHT, true);
                addTdMini(table, formatMoney(row.getTpa()), Element.ALIGN_RIGHT, false);
                addTdMini(table, formatMoney(row.getMasseSalariale()), Element.ALIGN_RIGHT, true);

                if (row.getSalaireBase() != null) totBase = totBase.add(row.getSalaireBase());
                if (row.getSurSalaire() != null) totSurSal = totSurSal.add(row.getSurSalaire());
                if (row.getIndemnitesEtPrimes() != null) totIndem = totIndem.add(row.getIndemnitesEtPrimes());
                if (row.getSalaireBrut() != null) totBrut = totBrut.add(row.getSalaireBrut());
                if (row.getAssVieillesse() != null) totCnss = totCnss.add(row.getAssVieillesse());
                if (row.getPartPatronale() != null) totPat = totPat.add(row.getPartPatronale());
                if (row.getBaseImposable() != null) totBaseImp = totBaseImp.add(row.getBaseImposable());
                if (row.getImpotIuts() != null) totIuts = totIuts.add(row.getImpotIuts());
                if (row.getSalaireNet() != null) totNet = totNet.add(row.getSalaireNet());
                if (row.getTotalRetenues() != null) totRet = totRet.add(row.getTotalRetenues());
                if (row.getNetAPayer() != null) totNetPayer = totNetPayer.add(row.getNetAPayer());
                if (row.getTpa() != null) totTpa = totTpa.add(row.getTpa());
                if (row.getMasseSalariale() != null) totMasseSal = totMasseSal.add(row.getMasseSalariale());
            }
        }

        // Ligne Totale
        addTotMini(table, "TOTAL GÉNÉRAL", 3, Element.ALIGN_LEFT);
        addTotMini(table, formatMoney(totBase), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totSurSal), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totIndem), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totBrut), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totCnss), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totPat), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totBaseImp), 1, Element.ALIGN_RIGHT);
        addTotMini(table, "—", 1, Element.ALIGN_CENTER);
        addTotMini(table, formatMoney(totIuts), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totNet), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totRet), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totNetPayer), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totTpa), 1, Element.ALIGN_RIGHT);
        addTotMini(table, formatMoney(totMasseSal), 1, Element.ALIGN_RIGHT);

        doc.add(table);
    }

    private void addTableBanque(Document doc, List<Object> data) throws DocumentException {
        // Page 2 - ÉTAT DE VIREMENT DES SALAIRES
        for (Object obj : data) {
            if (obj instanceof EtatBanqueGroupeDto bq) {
                Paragraph pBq = new Paragraph("Établissement : " + bq.getBanqueNom() + " (Code : " + bq.getCodeBanque() + ")", FONT_SUBTITLE);
                pBq.setSpacingBefore(8f);
                pBq.setSpacingAfter(4f);
                doc.add(pBq);

                PdfPTable table = new PdfPTable(7);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{10, 28, 12, 12, 20, 6, 12});
                table.setSpacingAfter(6f);

                addTh(table, "MATRICULE", Element.ALIGN_LEFT);
                addTh(table, "NOM & PRENOM(S)", Element.ALIGN_LEFT);
                addTh(table, "CODE BANQUE", Element.ALIGN_CENTER);
                addTh(table, "CODE GUICHET", Element.ALIGN_CENTER);
                addTh(table, "COMPTE A CREDITER", Element.ALIGN_LEFT);
                addTh(table, "CLE", Element.ALIGN_CENTER);
                addTh(table, "MONTANT", Element.ALIGN_RIGHT);

                if (bq.getVirements() != null) {
                    for (EtatBanqueGroupeDto.VirementItemDto vir : bq.getVirements()) {
                        addTd(table, vir.getMatricule(), Element.ALIGN_LEFT, false);
                        addTd(table, vir.getNomPrenom(), Element.ALIGN_LEFT, false);
                        addTd(table, vir.getCodeBanque(), Element.ALIGN_CENTER, false);
                        addTd(table, vir.getCodeGuichet(), Element.ALIGN_CENTER, false);
                        addTd(table, vir.getCompteACrediter(), Element.ALIGN_LEFT, false);
                        addTd(table, vir.getCle(), Element.ALIGN_CENTER, false);
                        addTd(table, formatMoney(vir.getMontant()), Element.ALIGN_RIGHT, true);
                    }
                }

                addTot(table, "TOTAL DE L'ORDRE DE VIREMENT (" + bq.getNombreBeneficiaires() + " Bénéficiaires)", 6, Element.ALIGN_LEFT);
                addTot(table, formatMoney(bq.getTotalNet()), 1, Element.ALIGN_RIGHT);
                doc.add(table);

                if (bq.getMontantEnLettres() != null && !bq.getMontantEnLettres().isBlank()) {
                    Paragraph pArr = new Paragraph("Arrêté le présent état à la somme de : " + bq.getMontantEnLettres() + " Francs CFA.", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, TEXT_DARK));
                    pArr.setSpacingAfter(10f);
                    doc.add(pArr);
                }
            }
        }
    }

    private void addTableCnss(Document doc, List<Object> data) throws DocumentException {
        PdfPTable table = new PdfPTable(8);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{10, 22, 13, 14, 13, 13, 13, 14});
        table.setSpacingAfter(8f);

        addTh(table, "MATRICULE", Element.ALIGN_LEFT);
        addTh(table, "NOM ET PRÉNOMS", Element.ALIGN_LEFT);
        addTh(table, "N° CNSS", Element.ALIGN_CENTER);
        addTh(table, "ASSIETTE CNSS", Element.ALIGN_RIGHT);
        addTh(table, "PART SAL. (5.5%)", Element.ALIGN_RIGHT);
        addTh(table, "PREST. FAM. (7%)", Element.ALIGN_RIGHT);
        addTh(table, "RISQUES (3.5%)", Element.ALIGN_RIGHT);
        addTh(table, "TOTAL CNSS", Element.ALIGN_RIGHT);

        BigDecimal totAss = BigDecimal.ZERO;
        BigDecimal totSal = BigDecimal.ZERO;
        BigDecimal totPf = BigDecimal.ZERO;
        BigDecimal totAt = BigDecimal.ZERO;
        BigDecimal totGlobal = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof EtatCnssRowDto row) {
                addTd(table, row.getMatricule(), Element.ALIGN_LEFT, false);
                addTd(table, row.getNomPrenom(), Element.ALIGN_LEFT, false);
                addTd(table, row.getNoCnss(), Element.ALIGN_CENTER, false);
                addTd(table, formatMoney(row.getAssietteCotisable()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getPartSalariale()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getPartPatronalePrestations()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getPartPatronaleRisques()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getTotalCotisationCnss()), Element.ALIGN_RIGHT, true);

                if (row.getAssietteCotisable() != null) totAss = totAss.add(row.getAssietteCotisable());
                if (row.getPartSalariale() != null) totSal = totSal.add(row.getPartSalariale());
                if (row.getPartPatronalePrestations() != null) totPf = totPf.add(row.getPartPatronalePrestations());
                if (row.getPartPatronaleRisques() != null) totAt = totAt.add(row.getPartPatronaleRisques());
                if (row.getTotalCotisationCnss() != null) totGlobal = totGlobal.add(row.getTotalCotisationCnss());
            }
        }

        addTot(table, "TOTAL DÉCLARATION CNSS", 3, Element.ALIGN_LEFT);
        addTot(table, formatMoney(totAss), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totSal), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totPf), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totAt), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totGlobal), 1, Element.ALIGN_RIGHT);

        doc.add(table);
    }

    private void addTableIuts(Document doc, List<Object> data) throws DocumentException {
        // Page 7 - ÉTAT DES RETENUES IUTS (IFU: 00164311Z)
        Paragraph pIfu = new Paragraph("N° IFU DE LA BANQUE : 00164311Z", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, BPBF_BLUE));
        pIfu.setSpacingAfter(4f);
        doc.add(pIfu);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{8, 38, 14, 14, 10, 16});
        table.setSpacingAfter(8f);

        addTh(table, "N° D'ORDRE", Element.ALIGN_CENTER);
        addTh(table, "NOM ET PRÉNOMS", Element.ALIGN_LEFT);
        addTh(table, "SALAIRE BRUT", Element.ALIGN_RIGHT);
        addTh(table, "BASE IMPOSABLE", Element.ALIGN_RIGHT);
        addTh(table, "NB CHARGES", Element.ALIGN_CENTER);
        addTh(table, "IUTS À REVERSER", Element.ALIGN_RIGHT);

        BigDecimal totBrut = BigDecimal.ZERO;
        BigDecimal totBase = BigDecimal.ZERO;
        BigDecimal totIuts = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof EtatIutsRowDto row) {
                addTd(table, String.valueOf(row.getNumeroOrdre() != null ? row.getNumeroOrdre() : "—"), Element.ALIGN_CENTER, false);
                addTd(table, row.getNomPrenom(), Element.ALIGN_LEFT, false);
                BigDecimal brut = row.getSalaireBruts() != null ? row.getSalaireBruts() : row.getSalaireBrut();
                BigDecimal base = row.getBaseImposable() != null ? row.getBaseImposable() : BigDecimal.ZERO;
                BigDecimal iuts = row.getIutsAReverser() != null ? row.getIutsAReverser() : row.getImpotIutsNet();
                int chg = row.getNbDeCharges() != null ? row.getNbDeCharges() : (row.getNombreCharges() != null ? row.getNombreCharges() : 0);

                addTd(table, formatMoney(brut), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(base), Element.ALIGN_RIGHT, false);
                addTd(table, String.valueOf(chg), Element.ALIGN_CENTER, false);
                addTd(table, formatMoney(iuts), Element.ALIGN_RIGHT, true);

                if (brut != null) totBrut = totBrut.add(brut);
                if (base != null) totBase = totBase.add(base);
                if (iuts != null) totIuts = totIuts.add(iuts);
            }
        }

        addTot(table, "TOTAL DE L'ÉTAT IUTS À REVERSER", 2, Element.ALIGN_LEFT);
        addTot(table, formatMoney(totBrut), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totBase), 1, Element.ALIGN_RIGHT);
        addTot(table, "—", 1, Element.ALIGN_CENTER);
        addTot(table, formatMoney(totIuts), 1, Element.ALIGN_RIGHT);

        doc.add(table);
    }

    private void addTableSalaire(Document doc, List<Object> data) throws DocumentException {
        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{25, 10, 15, 15, 15, 15, 15});
        table.setSpacingAfter(8f);

        addTh(table, "DIRECTION / STRUCTURE", Element.ALIGN_LEFT);
        addTh(table, "EFFECTIF", Element.ALIGN_CENTER);
        addTh(table, "SALAIRE BASE", Element.ALIGN_RIGHT);
        addTh(table, "INDEMNITÉS", Element.ALIGN_RIGHT);
        addTh(table, "SALAIRE BRUT", Element.ALIGN_RIGHT);
        addTh(table, "CHARGES PATR.", Element.ALIGN_RIGHT);
        addTh(table, "SALAIRE NET", Element.ALIGN_RIGHT);

        int totEff = 0;
        BigDecimal totBase = BigDecimal.ZERO;
        BigDecimal totBrut = BigDecimal.ZERO;
        BigDecimal totPat = BigDecimal.ZERO;
        BigDecimal totNet = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof EtatSalaireDirectionRowDto row) {
                addTd(table, row.getDirectionNom(), Element.ALIGN_LEFT, false);
                addTd(table, String.valueOf(row.getEffectif()), Element.ALIGN_CENTER, false);
                addTd(table, formatMoney(row.getTotalSalaireBase()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getTotalIndemnites()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getTotalBrut()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getTotalCotisationsPatronales()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getTotalNet()), Element.ALIGN_RIGHT, true);

                totEff += row.getEffectif();
                if (row.getTotalSalaireBase() != null) totBase = totBase.add(row.getTotalSalaireBase());
                if (row.getTotalBrut() != null) totBrut = totBrut.add(row.getTotalBrut());
                if (row.getTotalCotisationsPatronales() != null) totPat = totPat.add(row.getTotalCotisationsPatronales());
                if (row.getTotalNet() != null) totNet = totNet.add(row.getTotalNet());
            }
        }

        addTot(table, "MASSE SALARIALE TOTALE", 1, Element.ALIGN_LEFT);
        addTot(table, String.valueOf(totEff), 1, Element.ALIGN_CENTER);
        addTot(table, formatMoney(totBase), 1, Element.ALIGN_RIGHT);
        addTot(table, "—", 1, Element.ALIGN_CENTER);
        addTot(table, formatMoney(totBrut), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totPat), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totNet), 1, Element.ALIGN_RIGHT);

        doc.add(table);
    }

    private void addTablePrecompte(Document doc, List<Object> data) throws DocumentException {
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{12, 28, 25, 15, 15, 15});
        table.setSpacingAfter(8f);

        addTh(table, "MATRICULE", Element.ALIGN_LEFT);
        addTh(table, "NOM ET PRÉNOMS", Element.ALIGN_LEFT);
        addTh(table, "TYPE PRÉCOMPTE", Element.ALIGN_LEFT);
        addTh(table, "MONTANT INITIAL", Element.ALIGN_RIGHT);
        addTh(table, "RETENUE MOIS", Element.ALIGN_RIGHT);
        addTh(table, "SOLDE RESTANT", Element.ALIGN_RIGHT);

        BigDecimal totRet = BigDecimal.ZERO;
        BigDecimal totSolde = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof EtatPrecompteRowDto row) {
                addTd(table, row.getMatricule(), Element.ALIGN_LEFT, false);
                addTd(table, row.getNomPrenom(), Element.ALIGN_LEFT, false);
                addTd(table, row.getTypePrecompte(), Element.ALIGN_LEFT, false);
                addTd(table, formatMoney(row.getMontantTotalInitial()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getRetenuePeriode()), Element.ALIGN_RIGHT, true);
                addTd(table, formatMoney(row.getSoldeRestantDu()), Element.ALIGN_RIGHT, false);

                if (row.getRetenuePeriode() != null) totRet = totRet.add(row.getRetenuePeriode());
                if (row.getSoldeRestantDu() != null) totSolde = totSolde.add(row.getSoldeRestantDu());
            }
        }

        addTot(table, "TOTAL PRÉCOMPTES PRÉLEVÉS", 3, Element.ALIGN_LEFT);
        addTot(table, "—", 1, Element.ALIGN_CENTER);
        addTot(table, formatMoney(totRet), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totSolde), 1, Element.ALIGN_RIGHT);

        doc.add(table);
    }

    private void addTableFsp(Document doc, List<Object> data) throws DocumentException {
        // Page 8 - RETENUE FONDS DE SOLIDARITE
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{8, 14, 38, 16, 8, 16});
        table.setSpacingAfter(8f);

        addTh(table, "N° D'ORDRE", Element.ALIGN_CENTER);
        addTh(table, "MATRICULE", Element.ALIGN_LEFT);
        addTh(table, "NOM ET PRÉNOMS", Element.ALIGN_LEFT);
        addTh(table, "SALAIRE NET", Element.ALIGN_RIGHT);
        addTh(table, "TAUX", Element.ALIGN_CENTER);
        addTh(table, "MONTANT", Element.ALIGN_RIGHT);

        BigDecimal totNet = BigDecimal.ZERO;
        BigDecimal totFsp = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof EtatFspRowDto row) {
                addTd(table, String.valueOf(row.getNumeroOrdre() != null ? row.getNumeroOrdre() : "—"), Element.ALIGN_CENTER, false);
                addTd(table, row.getMatricule(), Element.ALIGN_LEFT, false);
                addTd(table, row.getNomPrenom(), Element.ALIGN_LEFT, false);
                BigDecimal net = row.getSalaireNet() != null ? row.getSalaireNet() : row.getAssietteCalcul();
                BigDecimal m = row.getMontant() != null ? row.getMontant() : row.getMontantRetenu();

                addTd(table, formatMoney(net), Element.ALIGN_RIGHT, false);
                addTd(table, "1%", Element.ALIGN_CENTER, false);
                addTd(table, formatMoney(m), Element.ALIGN_RIGHT, true);

                if (net != null) totNet = totNet.add(net);
                if (m != null) totFsp = totFsp.add(m);
            }
        }

        addTot(table, "TOTAL DE L'ÉTAT DU FONDS DE SOLIDARITÉ", 3, Element.ALIGN_LEFT);
        addTot(table, formatMoney(totNet), 1, Element.ALIGN_RIGHT);
        addTot(table, "1%", 1, Element.ALIGN_CENTER);
        addTot(table, formatMoney(totFsp), 1, Element.ALIGN_RIGHT);

        doc.add(table);
    }

    private void addTableMutuelle(Document doc, List<Object> data) throws DocumentException {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{15, 35, 20, 15, 15});
        table.setSpacingAfter(8f);

        addTh(table, "MATRICULE", Element.ALIGN_LEFT);
        addTh(table, "NOM ET PRÉNOMS", Element.ALIGN_LEFT);
        addTh(table, "PART SALARIALE", Element.ALIGN_RIGHT);
        addTh(table, "PART PATRONALE", Element.ALIGN_RIGHT);
        addTh(table, "TOTAL MUTUELLE", Element.ALIGN_RIGHT);

        BigDecimal totSal = BigDecimal.ZERO;
        BigDecimal totPat = BigDecimal.ZERO;
        BigDecimal totGlob = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof EtatMutuelleRowDto row) {
                addTd(table, row.getMatricule(), Element.ALIGN_LEFT, false);
                addTd(table, row.getNomPrenom(), Element.ALIGN_LEFT, false);
                addTd(table, formatMoney(row.getPartSalariale()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getPartPatronale()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getTotalCotisation()), Element.ALIGN_RIGHT, true);

                if (row.getPartSalariale() != null) totSal = totSal.add(row.getPartSalariale());
                if (row.getPartPatronale() != null) totPat = totPat.add(row.getPartPatronale());
                if (row.getTotalCotisation() != null) totGlob = totGlob.add(row.getTotalCotisation());
            }
        }

        addTot(table, "TOTAL COTISATIONS MUTUELLE", 2, Element.ALIGN_LEFT);
        addTot(table, formatMoney(totSal), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totPat), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totGlob), 1, Element.ALIGN_RIGHT);

        doc.add(table);
    }

    private void addTableElementsSalaire(Document doc, List<Object> data) throws DocumentException {
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{15, 35, 15, 10, 15, 15});
        table.setSpacingAfter(8f);

        addTh(table, "CODE", Element.ALIGN_LEFT);
        addTh(table, "RUBRIQUE", Element.ALIGN_LEFT);
        addTh(table, "TYPE", Element.ALIGN_CENTER);
        addTh(table, "NB AGENTS", Element.ALIGN_CENTER);
        addTh(table, "PART SALARIALE", Element.ALIGN_RIGHT);
        addTh(table, "TOTAL GLOBAL", Element.ALIGN_RIGHT);

        BigDecimal totSal = BigDecimal.ZERO;
        BigDecimal totGlob = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof EtatElementSalaireRowDto row) {
                addTd(table, row.getCodeRubrique(), Element.ALIGN_LEFT, false);
                addTd(table, row.getLibelleRubrique(), Element.ALIGN_LEFT, false);
                addTd(table, row.getTypeRubrique(), Element.ALIGN_CENTER, false);
                addTd(table, String.valueOf(row.getNombreBeneficiaires()), Element.ALIGN_CENTER, false);
                addTd(table, formatMoney(row.getTotalMontantSalarial()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getTotalGlobal()), Element.ALIGN_RIGHT, true);

                if (row.getTotalMontantSalarial() != null) totSal = totSal.add(row.getTotalMontantSalarial());
                if (row.getTotalGlobal() != null) totGlob = totGlob.add(row.getTotalGlobal());
            }
        }

        addTot(table, "TOTAL DES RUBRIQUES DE PAIE", 3, Element.ALIGN_LEFT);
        addTot(table, "—", 1, Element.ALIGN_CENTER);
        addTot(table, formatMoney(totSal), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totGlob), 1, Element.ALIGN_RIGHT);

        doc.add(table);
    }

    private void addTableTypeEmploye(Document doc, List<Object> data) throws DocumentException {
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{30, 10, 15, 15, 15, 15});
        table.setSpacingAfter(8f);

        addTh(table, "STATUT / CATÉGORIE", Element.ALIGN_LEFT);
        addTh(table, "EFFECTIF", Element.ALIGN_CENTER);
        addTh(table, "SALAIRE BRUT", Element.ALIGN_RIGHT);
        addTh(table, "RETENUES", Element.ALIGN_RIGHT);
        addTh(table, "SALAIRE NET", Element.ALIGN_RIGHT);
        addTh(table, "NET MOYEN", Element.ALIGN_RIGHT);

        int totEff = 0;
        BigDecimal totBrut = BigDecimal.ZERO;
        BigDecimal totRet = BigDecimal.ZERO;
        BigDecimal totNet = BigDecimal.ZERO;

        for (Object obj : data) {
            if (obj instanceof EtatTypeEmployeRowDto row) {
                addTd(table, row.getTypeEmploye(), Element.ALIGN_LEFT, false);
                addTd(table, String.valueOf(row.getEffectif()), Element.ALIGN_CENTER, false);
                addTd(table, formatMoney(row.getTotalBrut()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getTotalRetenues()), Element.ALIGN_RIGHT, false);
                addTd(table, formatMoney(row.getTotalNet()), Element.ALIGN_RIGHT, true);
                addTd(table, formatMoney(row.getSalaireMoyenNet()), Element.ALIGN_RIGHT, false);

                totEff += row.getEffectif();
                if (row.getTotalBrut() != null) totBrut = totBrut.add(row.getTotalBrut());
                if (row.getTotalRetenues() != null) totRet = totRet.add(row.getTotalRetenues());
                if (row.getTotalNet() != null) totNet = totNet.add(row.getTotalNet());
            }
        }

        addTot(table, "TOTAL TOUS STATUTS CONFONDUS", 1, Element.ALIGN_LEFT);
        addTot(table, String.valueOf(totEff), 1, Element.ALIGN_CENTER);
        addTot(table, formatMoney(totBrut), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totRet), 1, Element.ALIGN_RIGHT);
        addTot(table, formatMoney(totNet), 1, Element.ALIGN_RIGHT);
        addTot(table, "—", 1, Element.ALIGN_CENTER);

        doc.add(table);
    }

    private void addReportFooter(Document doc, EtatSyntheseWrapperDto etat) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{50, 50});
        table.setSpacingBefore(18f);

        String t1 = (etat != null && etat.getTitreSignataire1() != null && !etat.getTitreSignataire1().isBlank()) 
                ? etat.getTitreSignataire1() : "Le Comptable";
        String n1 = (etat != null && etat.getNomSignataire1() != null && !etat.getNomSignataire1().isBlank()) 
                ? etat.getNomSignataire1() : "Ahadi Ismaël YONLI";
        String t2 = (etat != null && etat.getTitreSignataire2() != null && !etat.getTitreSignataire2().isBlank()) 
                ? etat.getTitreSignataire2() : "Le Directeur Financier et Comptable";
        String n2 = (etat != null && etat.getNomSignataire2() != null && !etat.getNomSignataire2().isBlank()) 
                ? etat.getNomSignataire2() : "Inoussa SANOUIDI";

        PdfPCell c1 = new PdfPCell(new Paragraph(t1 + "\n\n\n\n\n" + n1, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, TEXT_DARK)));
        c1.setBorder(Rectangle.NO_BORDER);
        c1.setHorizontalAlignment(Element.ALIGN_CENTER);

        PdfPCell c2 = new PdfPCell(new Paragraph(t2 + "\n\n\n\n\n" + n2, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, TEXT_DARK)));
        c2.setBorder(Rectangle.NO_BORDER);
        c2.setHorizontalAlignment(Element.ALIGN_CENTER);

        table.addCell(c1);
        table.addCell(c2);
        doc.add(table);
    }

    // ─── GÉNÉRATION DU FICHIER CSV (COMPATIBLE EXCEL UTF-8 AVEC BOM) ─────────

    public byte[] generateCsvExport(String typeEtat, Long sessionPaieId, Long bulletinLotId, Long directionId, String banqueNom) {
        EtatSyntheseWrapperDto etat = getEtatSynthese(typeEtat, sessionPaieId, bulletinLotId, directionId, banqueNom);

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        // Directive officielle Microsoft pour forcer Excel à découper par point-virgule sur toutes les versions Windows
        pw.println("sep=;");

        // Titre et métadonnées d'en-tête
        pw.println("BANQUE POSTALE DU BURKINA FASO");
        pw.println("ÉTAT DE SYNTHÈSE : " + etat.getTitreEtat());
        pw.println("SESSION : " + (etat.getCodeSession() != null ? etat.getCodeSession() : "—") + ";PÉRIODE : " + (etat.getPeriode() != null ? etat.getPeriode() : "—"));
        pw.println("");

        List<Object> data = etat.getDonnees() != null ? etat.getDonnees() : Collections.emptyList();
        String type = etat.getTypeEtat();

        if ("RECAPITULATIF_GLOBAL".equalsIgnoreCase(type)) {
            pw.println("Numéro Compte;Intitulé Compte;Sens;Débit (FCFA);Crédit (FCFA)");
            for (Object o : data) {
                if (o instanceof RecapitulatifGlobalRowDto r) {
                    pw.println(escape(r.getNumeroCompte()) + ";" +
                               escape(r.getIntituleCompte()) + ";" +
                               escape(r.getSens()) + ";" +
                               formatCsvMontant(r.getMontantDebit()) + ";" +
                               formatCsvMontant(r.getMontantCredit()));
                }
            }
            pw.println("TOTAL DE L'ÉTAT (BALANCE ÉQUILIBRÉE);;; " + formatCsvMontant(etat.getTotalMasseSalariale()) + ";" + formatCsvMontant(etat.getTotalMasseSalariale()));

        } else if ("ETAT_CRRAE_RRPC".equalsIgnoreCase(type) || "ETAT_CRRAE_RCPNC".equalsIgnoreCase(type) || "ETAT_CRRAE_FAAM".equalsIgnoreCase(type)) {
            pw.println("N° d'Ordre;Matricule;Nom et Prénoms;Salaire Soumis (FCFA);Part Employeur (FCFA);Part Salariale (FCFA);Total Cotisations (FCFA)");
            BigDecimal totSoumis = BigDecimal.ZERO;
            BigDecimal totPat = BigDecimal.ZERO;
            BigDecimal totSal = BigDecimal.ZERO;
            BigDecimal totGlob = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatCrraeRowDto c) {
                    pw.println(c.getNumeroOrdre() + ";" +
                               escape(c.getMatricule()) + ";" +
                               escape(c.getNomPrenom()) + ";" +
                               formatCsvMontant(c.getSalaireSoumisCotisation()) + ";" +
                               formatCsvMontant(c.getCotisationPatronale()) + ";" +
                               formatCsvMontant(c.getCotisationSalariale()) + ";" +
                               formatCsvMontant(c.getMontantTotalCotisations()));

                    if (c.getSalaireSoumisCotisation() != null) totSoumis = totSoumis.add(c.getSalaireSoumisCotisation());
                    if (c.getCotisationPatronale() != null) totPat = totPat.add(c.getCotisationPatronale());
                    if (c.getCotisationSalariale() != null) totSal = totSal.add(c.getCotisationSalariale());
                    if (c.getMontantTotalCotisations() != null) totGlob = totGlob.add(c.getMontantTotalCotisations());
                }
            }
            pw.println("TOTAL DE LA DÉCLARATION DES COTISATIONS;;;" + formatCsvMontant(totSoumis) + ";" + formatCsvMontant(totPat) + ";" + formatCsvMontant(totSal) + ";" + formatCsvMontant(totGlob));

        } else if ("ETAT_BANQUE".equalsIgnoreCase(type)) {
            pw.println("Banque;Matricule;Nom & Prénom(s);Code Banque;Code Guichet;Compte à créditer;Clé;Montant Net (FCFA)");
            BigDecimal totalNetBq = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatBanqueGroupeDto bq) {
                    if (bq.getVirements() != null) {
                        for (EtatBanqueGroupeDto.VirementItemDto v : bq.getVirements()) {
                            pw.println(escape(bq.getBanqueNom()) + ";" +
                                       escape(v.getMatricule()) + ";" +
                                       escape(v.getNomPrenom()) + ";" +
                                       escape(v.getCodeBanque()) + ";" +
                                       escape(v.getCodeGuichet()) + ";" +
                                       escape(v.getCompteACrediter()) + ";" +
                                       escape(v.getCle()) + ";" +
                                       formatCsvMontant(v.getMontant() != null ? v.getMontant() : v.getMontantNet()));
                            if (v.getMontant() != null) totalNetBq = totalNetBq.add(v.getMontant());
                            else if (v.getMontantNet() != null) totalNetBq = totalNetBq.add(v.getMontantNet());
                        }
                    }
                }
            }
            pw.println("TOTAL DES ORDRES DE VIREMENT;;;;;;;" + formatCsvMontant(totalNetBq));

        } else if ("ETAT_CNSS".equalsIgnoreCase(type)) {
            pw.println("Matricule;Nom et Prénoms;N° CNSS;Date Embauche;Salaire Brut (FCFA);Assiette CNSS (plaf. 800k);Part Sal. (5.5%);Prest. Fam. (7.0%);Risques Pro (3.5%);Retraite Pat. (5.5%);Total Patronal;Total reversé CNSS");
            BigDecimal totBrut = BigDecimal.ZERO;
            BigDecimal totAss = BigDecimal.ZERO;
            BigDecimal totSal = BigDecimal.ZERO;
            BigDecimal totPf = BigDecimal.ZERO;
            BigDecimal totRp = BigDecimal.ZERO;
            BigDecimal totRetPat = BigDecimal.ZERO;
            BigDecimal totPat = BigDecimal.ZERO;
            BigDecimal totRev = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatCnssRowDto c) {
                    pw.println(escape(c.getMatricule()) + ";" +
                               escape(c.getNomPrenom()) + ";" +
                               escape(c.getNoCnss()) + ";" +
                               escape(c.getDateEmbauche()) + ";" +
                               formatCsvMontant(c.getSalaireBrut()) + ";" +
                               formatCsvMontant(c.getAssietteCotisable()) + ";" +
                               formatCsvMontant(c.getPartSalariale()) + ";" +
                               formatCsvMontant(c.getPartPatronalePrestations()) + ";" +
                               formatCsvMontant(c.getPartPatronaleRisques()) + ";" +
                               formatCsvMontant(c.getPartPatronaleRetraite()) + ";" +
                               formatCsvMontant(c.getTotalPartPatronale()) + ";" +
                               formatCsvMontant(c.getTotalCotisationCnss()));

                    if (c.getSalaireBrut() != null) totBrut = totBrut.add(c.getSalaireBrut());
                    if (c.getAssietteCotisable() != null) totAss = totAss.add(c.getAssietteCotisable());
                    if (c.getPartSalariale() != null) totSal = totSal.add(c.getPartSalariale());
                    if (c.getPartPatronalePrestations() != null) totPf = totPf.add(c.getPartPatronalePrestations());
                    if (c.getPartPatronaleRisques() != null) totRp = totRp.add(c.getPartPatronaleRisques());
                    if (c.getPartPatronaleRetraite() != null) totRetPat = totRetPat.add(c.getPartPatronaleRetraite());
                    if (c.getTotalPartPatronale() != null) totPat = totPat.add(c.getTotalPartPatronale());
                    if (c.getTotalCotisationCnss() != null) totRev = totRev.add(c.getTotalCotisationCnss());
                }
            }
            pw.println("TOTAL DÉCLARATIF COTISATIONS CNSS;;;;" + formatCsvMontant(totBrut) + ";" + formatCsvMontant(totAss) + ";" + formatCsvMontant(totSal) + ";" + formatCsvMontant(totPf) + ";" + formatCsvMontant(totRp) + ";" + formatCsvMontant(totRetPat) + ";" + formatCsvMontant(totPat) + ";" + formatCsvMontant(totRev));

        } else if ("ETAT_IUTS".equalsIgnoreCase(type)) {
            pw.println("N° d'Ordre;Nom et Prénoms;Total Salaires Bruts (FCFA);Base Imposable IUTS (FCFA);Nb de charges;IUTS Net à Reverser (FCFA)");
            BigDecimal totBrut = BigDecimal.ZERO;
            BigDecimal totBase = BigDecimal.ZERO;
            BigDecimal totIuts = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatIutsRowDto i) {
                    BigDecimal brut = i.getSalaireBruts() != null ? i.getSalaireBruts() : i.getSalaireBrut();
                    BigDecimal netIuts = i.getIutsAReverser() != null ? i.getIutsAReverser() : i.getImpotIutsNet();
                    Integer ch = i.getNbDeCharges() != null ? i.getNbDeCharges() : i.getNombreCharges();

                    pw.println((i.getNumeroOrdre() != null ? i.getNumeroOrdre() : "—") + ";" +
                               escape(i.getNomPrenom()) + ";" +
                               formatCsvMontant(brut) + ";" +
                               formatCsvMontant(i.getBaseImposable()) + ";" +
                               (ch != null ? ch : 0) + ";" +
                               formatCsvMontant(netIuts));

                    if (brut != null) totBrut = totBrut.add(brut);
                    if (i.getBaseImposable() != null) totBase = totBase.add(i.getBaseImposable());
                    if (netIuts != null) totIuts = totIuts.add(netIuts);
                }
            }
            pw.println("TOTAL DE L'ÉTAT IUTS À REVERSER;;" + formatCsvMontant(totBrut) + ";" + formatCsvMontant(totBase) + ";;" + formatCsvMontant(totIuts));

        } else if ("ETAT_FSP".equalsIgnoreCase(type)) {
            pw.println("N° d'Ordre;Matricule;Nom et Prénoms;Salaire Net (FCFA);Taux;Montant (FCFA)");
            BigDecimal totNet = BigDecimal.ZERO;
            BigDecimal totFsp = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatFspRowDto f) {
                    BigDecimal net = f.getSalaireNet() != null ? f.getSalaireNet() : f.getAssietteCalcul();
                    BigDecimal m = f.getMontant() != null ? f.getMontant() : f.getMontantRetenu();

                    pw.println((f.getNumeroOrdre() != null ? f.getNumeroOrdre() : "—") + ";" +
                               escape(f.getMatricule()) + ";" +
                               escape(f.getNomPrenom()) + ";" +
                               formatCsvMontant(net) + ";" +
                               (f.getTaux() != null ? f.getTaux() : "1%") + ";" +
                               formatCsvMontant(m));

                    if (net != null) totNet = totNet.add(net);
                    if (m != null) totFsp = totFsp.add(m);
                }
            }
            pw.println("TOTAL DU FONDS DE SOLIDARITÉ PATRIOTIQUE;;;" + formatCsvMontant(totNet) + ";1%;" + formatCsvMontant(totFsp));

        } else if ("ETAT_SALAIRE".equalsIgnoreCase(type)) {
            pw.println("Direction;Département;Effectif;Salaire Base (FCFA);Indemnités (FCFA);Salaire Brut (FCFA);Charges Patronales (FCFA);Masse Salariale Totale (FCFA);Retenues (FCFA);Net Payé (FCFA)");
            int totEff = 0;
            BigDecimal totBase = BigDecimal.ZERO;
            BigDecimal totIndem = BigDecimal.ZERO;
            BigDecimal totBrut = BigDecimal.ZERO;
            BigDecimal totPat = BigDecimal.ZERO;
            BigDecimal totMasse = BigDecimal.ZERO;
            BigDecimal totRet = BigDecimal.ZERO;
            BigDecimal totNet = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatSalaireDirectionRowDto s) {
                    pw.println(escape(s.getDirectionNom()) + ";" +
                               escape(s.getDepartementNom()) + ";" +
                               s.getEffectif() + ";" +
                               formatCsvMontant(s.getTotalSalaireBase()) + ";" +
                               formatCsvMontant(s.getTotalIndemnites()) + ";" +
                               formatCsvMontant(s.getTotalBrut()) + ";" +
                               formatCsvMontant(s.getTotalCotisationsPatronales()) + ";" +
                               formatCsvMontant(s.getTotalMasseSalariale()) + ";" +
                               formatCsvMontant(s.getTotalRetenues()) + ";" +
                               formatCsvMontant(s.getTotalNet()));

                    totEff += s.getEffectif() != null ? s.getEffectif() : 0;
                    if (s.getTotalSalaireBase() != null) totBase = totBase.add(s.getTotalSalaireBase());
                    if (s.getTotalIndemnites() != null) totIndem = totIndem.add(s.getTotalIndemnites());
                    if (s.getTotalBrut() != null) totBrut = totBrut.add(s.getTotalBrut());
                    if (s.getTotalCotisationsPatronales() != null) totPat = totPat.add(s.getTotalCotisationsPatronales());
                    if (s.getTotalMasseSalariale() != null) totMasse = totMasse.add(s.getTotalMasseSalariale());
                    if (s.getTotalRetenues() != null) totRet = totRet.add(s.getTotalRetenues());
                    if (s.getTotalNet() != null) totNet = totNet.add(s.getTotalNet());
                }
            }
            pw.println("TOTAL CONSOLIDÉ TOUTES DIRECTIONS;;" + totEff + ";" + formatCsvMontant(totBase) + ";" + formatCsvMontant(totIndem) + ";" + formatCsvMontant(totBrut) + ";" + formatCsvMontant(totPat) + ";" + formatCsvMontant(totMasse) + ";" + formatCsvMontant(totRet) + ";" + formatCsvMontant(totNet));

        } else if ("ETAT_NOMINATIF".equalsIgnoreCase(type)) {
            pw.println("Matricule;Nom et Prénoms;Poste / Classification;Direction;Salaire Base (FCFA);Sal. Brut (FCFA);Total Ret. (FCFA);Net Payé (FCFA)");
            BigDecimal totBase = BigDecimal.ZERO;
            BigDecimal totBrut = BigDecimal.ZERO;
            BigDecimal totRet = BigDecimal.ZERO;
            BigDecimal totNet = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatNominatifRowDto n) {
                    pw.println(escape(n.getMatricule()) + ";" +
                               escape(n.getNomPrenom()) + ";" +
                               escape(n.getPoste() + (n.getClassification() != null ? " (" + n.getClassification() + ")" : "")) + ";" +
                               escape(n.getDirection()) + ";" +
                               formatCsvMontant(n.getSalaireBase()) + ";" +
                               formatCsvMontant(n.getSalaireBrut()) + ";" +
                               formatCsvMontant(n.getTotalRetenues()) + ";" +
                               formatCsvMontant(n.getSalaireNet()));

                    if (n.getSalaireBase() != null) totBase = totBase.add(n.getSalaireBase());
                    if (n.getSalaireBrut() != null) totBrut = totBrut.add(n.getSalaireBrut());
                    if (n.getTotalRetenues() != null) totRet = totRet.add(n.getTotalRetenues());
                    if (n.getSalaireNet() != null) totNet = totNet.add(n.getSalaireNet());
                }
            }
            pw.println("TOTAL GÉNÉRAL DE L'ÉTAT NOMINATIF;;;;" + formatCsvMontant(totBase) + ";" + formatCsvMontant(totBrut) + ";" + formatCsvMontant(totRet) + ";" + formatCsvMontant(totNet));

        } else if ("ETAT_PRECOMPTE".equalsIgnoreCase(type)) {
            pw.println("Matricule;Nom et Prénoms;Type de Précompte / Prêt;Organisme Bénéficiaire;Montant Initial (FCFA);Retenue Période (FCFA);Solde Restant Dû (FCFA)");
            BigDecimal totInit = BigDecimal.ZERO;
            BigDecimal totRet = BigDecimal.ZERO;
            BigDecimal totSolde = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatPrecompteRowDto p) {
                    pw.println(escape(p.getMatricule()) + ";" +
                               escape(p.getNomPrenom()) + ";" +
                               escape(p.getTypePrecompte()) + ";" +
                               escape(p.getOrganismeBeneficiaire()) + ";" +
                               formatCsvMontant(p.getMontantTotalInitial()) + ";" +
                               formatCsvMontant(p.getRetenuePeriode()) + ";" +
                               formatCsvMontant(p.getSoldeRestantDu()));

                    if (p.getMontantTotalInitial() != null) totInit = totInit.add(p.getMontantTotalInitial());
                    if (p.getRetenuePeriode() != null) totRet = totRet.add(p.getRetenuePeriode());
                    if (p.getSoldeRestantDu() != null) totSolde = totSolde.add(p.getSoldeRestantDu());
                }
            }
            pw.println("TOTAL DES PRÉCOMPTES ET RETENUES;;;;" + formatCsvMontant(totInit) + ";" + formatCsvMontant(totRet) + ";" + formatCsvMontant(totSolde));

        } else if ("ETAT_MUTUELLE".equalsIgnoreCase(type)) {
            pw.println("Matricule;Nom et Prénoms;Direction;Formule / Régime;Part Salariale (FCFA);Part Patronale (FCFA);Total Cotisation Mutuelle (FCFA)");
            BigDecimal totSal = BigDecimal.ZERO;
            BigDecimal totPat = BigDecimal.ZERO;
            BigDecimal totCot = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatMutuelleRowDto m) {
                    pw.println(escape(m.getMatricule()) + ";" +
                               escape(m.getNomPrenom()) + ";" +
                               escape(m.getDirection()) + ";" +
                               escape(m.getFormuleMutuelle()) + ";" +
                               formatCsvMontant(m.getPartSalariale()) + ";" +
                               formatCsvMontant(m.getPartPatronale()) + ";" +
                               formatCsvMontant(m.getTotalCotisation()));

                    if (m.getPartSalariale() != null) totSal = totSal.add(m.getPartSalariale());
                    if (m.getPartPatronale() != null) totPat = totPat.add(m.getPartPatronale());
                    if (m.getTotalCotisation() != null) totCot = totCot.add(m.getTotalCotisation());
                }
            }
            pw.println("TOTAL DES COTISATIONS MUTUELLE DE SANTÉ;;;;" + formatCsvMontant(totSal) + ";" + formatCsvMontant(totPat) + ";" + formatCsvMontant(totCot));

        } else if ("ETAT_TYPE_EMPLOYE".equalsIgnoreCase(type)) {
            pw.println("Statut / Type d'Employé;Effectif;Salaire Base (FCFA);Indemnités (FCFA);Salaire Brut (FCFA);Charges Patronales (FCFA);Retenues (FCFA);Net Global (FCFA);Net Moyen (FCFA)");
            int totEff = 0;
            BigDecimal totBase = BigDecimal.ZERO;
            BigDecimal totIndem = BigDecimal.ZERO;
            BigDecimal totBrut = BigDecimal.ZERO;
            BigDecimal totPat = BigDecimal.ZERO;
            BigDecimal totRet = BigDecimal.ZERO;
            BigDecimal totNet = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatTypeEmployeRowDto te) {
                    pw.println(escape(te.getTypeEmploye()) + ";" +
                               te.getEffectif() + ";" +
                               formatCsvMontant(te.getTotalSalaireBase()) + ";" +
                               formatCsvMontant(te.getTotalIndemnites()) + ";" +
                               formatCsvMontant(te.getTotalBrut()) + ";" +
                               formatCsvMontant(te.getTotalCotisationsPatronales()) + ";" +
                               formatCsvMontant(te.getTotalRetenues()) + ";" +
                               formatCsvMontant(te.getTotalNet()) + ";" +
                               formatCsvMontant(te.getSalaireMoyenNet()));

                    totEff += te.getEffectif() != null ? te.getEffectif() : 0;
                    if (te.getTotalSalaireBase() != null) totBase = totBase.add(te.getTotalSalaireBase());
                    if (te.getTotalIndemnites() != null) totIndem = totIndem.add(te.getTotalIndemnites());
                    if (te.getTotalBrut() != null) totBrut = totBrut.add(te.getTotalBrut());
                    if (te.getTotalCotisationsPatronales() != null) totPat = totPat.add(te.getTotalCotisationsPatronales());
                    if (te.getTotalRetenues() != null) totRet = totRet.add(te.getTotalRetenues());
                    if (te.getTotalNet() != null) totNet = totNet.add(te.getTotalNet());
                }
            }
            BigDecimal moyNet = totEff > 0 ? totNet.divide(new BigDecimal(totEff), 0, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            pw.println("TOTAL GÉNÉRAL PAR STATUT;" + totEff + ";" + formatCsvMontant(totBase) + ";" + formatCsvMontant(totIndem) + ";" + formatCsvMontant(totBrut) + ";" + formatCsvMontant(totPat) + ";" + formatCsvMontant(totRet) + ";" + formatCsvMontant(totNet) + ";" + formatCsvMontant(moyNet));

        } else if ("ETAT_ELEMENTS_SALAIRE".equalsIgnoreCase(type) || "ETAT_ELEMENT_SALAIRE".equalsIgnoreCase(type)) {
            pw.println("Code Rubrique;Libellé de l'Élément;Nature / Type;Nombre Bénéficiaires;Part Salariale (FCFA);Part Patronale (FCFA);Total Général (FCFA)");
            int totBenef = 0;
            BigDecimal totSal = BigDecimal.ZERO;
            BigDecimal totPat = BigDecimal.ZERO;
            BigDecimal totGlob = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatElementSalaireRowDto el) {
                    pw.println(escape(el.getCodeRubrique()) + ";" +
                               escape(el.getLibelleRubrique()) + ";" +
                               escape(el.getTypeRubrique()) + ";" +
                               el.getNombreBeneficiaires() + ";" +
                               formatCsvMontant(el.getTotalMontantSalarial()) + ";" +
                               formatCsvMontant(el.getTotalMontantPatronal()) + ";" +
                               formatCsvMontant(el.getTotalGlobal()));

                    totBenef += el.getNombreBeneficiaires() != null ? el.getNombreBeneficiaires() : 0;
                    if (el.getTotalMontantSalarial() != null) totSal = totSal.add(el.getTotalMontantSalarial());
                    if (el.getTotalMontantPatronal() != null) totPat = totPat.add(el.getTotalMontantPatronal());
                    if (el.getTotalGlobal() != null) totGlob = totGlob.add(el.getTotalGlobal());
                }
            }
            pw.println("TOTAL DES RUBRIQUES DE SALAIRE;;;" + totBenef + ";" + formatCsvMontant(totSal) + ";" + formatCsvMontant(totPat) + ";" + formatCsvMontant(totGlob));

        } else if ("ETAT_BULLETIN".equalsIgnoreCase(type)) {
            pw.println("Code Bulletin;Matricule;Nom et Prénoms;Direction;Type Session;Statut;Salaire Brut (FCFA);Total Retenues (FCFA);Net à Payer (FCFA);Justification Écart");
            BigDecimal totBrut = BigDecimal.ZERO;
            BigDecimal totRet = BigDecimal.ZERO;
            BigDecimal totNet = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof EtatBulletinControleRowDto b) {
                    pw.println(escape(b.getCodeBulletin()) + ";" +
                               escape(b.getMatricule()) + ";" +
                               escape(b.getNomPrenom()) + ";" +
                               escape(b.getDirection()) + ";" +
                               escape(b.getTypeSession()) + ";" +
                               escape(b.getStatut()) + ";" +
                               formatCsvMontant(b.getSalaireBrut()) + ";" +
                               formatCsvMontant(b.getTotalRetenues()) + ";" +
                               formatCsvMontant(b.getSalaireNet()) + ";" +
                               escape(b.getJustificationEcart() != null ? b.getJustificationEcart() : "—"));

                    if (b.getSalaireBrut() != null) totBrut = totBrut.add(b.getSalaireBrut());
                    if (b.getTotalRetenues() != null) totRet = totRet.add(b.getTotalRetenues());
                    if (b.getSalaireNet() != null) totNet = totNet.add(b.getSalaireNet());
                }
            }
            pw.println("TOTAL CONTRÔLE DE TOUS LES BULLETINS;;;;;;" + formatCsvMontant(totBrut) + ";" + formatCsvMontant(totRet) + ";" + formatCsvMontant(totNet) + ";");

        } else {
            // Livre de paie - 17 colonnes officielles réglementaires (Modèle 3)
            pw.println("Mle;Nom et Prénoms;Grade;Sal. base;Sursalaire;Indem. & Pr.;Total brut;Ass. vi.;Part patr.;Base imp.;Chrg;IUTS;Sal. net;Tot. ret.;Net payer;TPA;Masse sal.");
            BigDecimal totBase = BigDecimal.ZERO;
            BigDecimal totSurSal = BigDecimal.ZERO;
            BigDecimal totIndem = BigDecimal.ZERO;
            BigDecimal totBrut = BigDecimal.ZERO;
            BigDecimal totAssVi = BigDecimal.ZERO;
            BigDecimal totPartPat = BigDecimal.ZERO;
            BigDecimal totBaseImp = BigDecimal.ZERO;
            BigDecimal totIuts = BigDecimal.ZERO;
            BigDecimal totSalNet = BigDecimal.ZERO;
            BigDecimal totRet = BigDecimal.ZERO;
            BigDecimal totNetPayer = BigDecimal.ZERO;
            BigDecimal totTpa = BigDecimal.ZERO;
            BigDecimal totMasseSal = BigDecimal.ZERO;

            for (Object o : data) {
                if (o instanceof LivrePaieRowDto l) {
                    pw.println(escape(l.getMatricule()) + ";" +
                               escape(l.getNomPrenom()) + ";" +
                               escape(l.getGrade()) + ";" +
                               formatCsvMontant(l.getSalaireBase()) + ";" +
                               formatCsvMontant(l.getSurSalaire()) + ";" +
                               formatCsvMontant(l.getIndemnitesEtPrimes() != null ? l.getIndemnitesEtPrimes() : l.getIndemnites()) + ";" +
                               formatCsvMontant(l.getSalaireBrut()) + ";" +
                               formatCsvMontant(l.getAssVieillesse() != null ? l.getAssVieillesse() : l.getCotisationCnss()) + ";" +
                               formatCsvMontant(l.getPartPatronale()) + ";" +
                               formatCsvMontant(l.getBaseImposable()) + ";" +
                               (l.getCharges() != null ? l.getCharges() : 0) + ";" +
                               formatCsvMontant(l.getImpotIuts()) + ";" +
                               formatCsvMontant(l.getSalaireNet()) + ";" +
                               formatCsvMontant(l.getTotalRetenues()) + ";" +
                               formatCsvMontant(l.getNetAPayer() != null ? l.getNetAPayer() : l.getSalaireNet()) + ";" +
                               formatCsvMontant(l.getTpa()) + ";" +
                               formatCsvMontant(l.getMasseSalariale()));

                    if (l.getSalaireBase() != null) totBase = totBase.add(l.getSalaireBase());
                    if (l.getSurSalaire() != null) totSurSal = totSurSal.add(l.getSurSalaire());
                    BigDecimal ind = l.getIndemnitesEtPrimes() != null ? l.getIndemnitesEtPrimes() : l.getIndemnites();
                    if (ind != null) totIndem = totIndem.add(ind);
                    if (l.getSalaireBrut() != null) totBrut = totBrut.add(l.getSalaireBrut());
                    BigDecimal ass = l.getAssVieillesse() != null ? l.getAssVieillesse() : l.getCotisationCnss();
                    if (ass != null) totAssVi = totAssVi.add(ass);
                    if (l.getPartPatronale() != null) totPartPat = totPartPat.add(l.getPartPatronale());
                    if (l.getBaseImposable() != null) totBaseImp = totBaseImp.add(l.getBaseImposable());
                    if (l.getImpotIuts() != null) totIuts = totIuts.add(l.getImpotIuts());
                    if (l.getSalaireNet() != null) totSalNet = totSalNet.add(l.getSalaireNet());
                    if (l.getTotalRetenues() != null) totRet = totRet.add(l.getTotalRetenues());
                    BigDecimal netP = l.getNetAPayer() != null ? l.getNetAPayer() : l.getSalaireNet();
                    if (netP != null) totNetPayer = totNetPayer.add(netP);
                    if (l.getTpa() != null) totTpa = totTpa.add(l.getTpa());
                    if (l.getMasseSalariale() != null) totMasseSal = totMasseSal.add(l.getMasseSalariale());
                }
            }
            pw.println("TOTAL GÉNÉRAL DU REGISTRE DE PAIE;;;" +
                       formatCsvMontant(totBase) + ";" +
                       formatCsvMontant(totSurSal) + ";" +
                       formatCsvMontant(totIndem) + ";" +
                       formatCsvMontant(totBrut) + ";" +
                       formatCsvMontant(totAssVi) + ";" +
                       formatCsvMontant(totPartPat) + ";" +
                       formatCsvMontant(totBaseImp) + ";;" +
                       formatCsvMontant(totIuts) + ";" +
                       formatCsvMontant(totSalNet) + ";" +
                       formatCsvMontant(totRet) + ";" +
                       formatCsvMontant(totNetPayer) + ";" +
                       formatCsvMontant(totTpa) + ";" +
                       formatCsvMontant(totMasseSal));
        }

        // Ajout du BOM UTF-8 (EF BB BF) pour ouverture native et propre sous Microsoft Excel
        byte[] bom = new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF};
        byte[] contentBytes = sw.toString().getBytes(StandardCharsets.UTF_8);
        byte[] result = new byte[bom.length + contentBytes.length];
        System.arraycopy(bom, 0, result, 0, bom.length);
        System.arraycopy(contentBytes, 0, result, bom.length, contentBytes.length);
        return result;
    }

    private String formatCsvMontant(BigDecimal bd) {
        if (bd == null) return "0";
        return bd.setScale(0, RoundingMode.HALF_UP).toPlainString();
    }

    private String escape(String s) {
        if (s == null) return "";
        return "\"" + s.replace("\"", "\"\"") + "\"";
    }

    // ─── GÉNÉRATION DU FICHIER EXCEL NATIF (.XLSX MULTI-COLONNES STYLISÉ) ───

    public byte[] generateExcelExport(String typeEtat, Long sessionPaieId, Long bulletinLotId, Long directionId, String banqueNom) {
        EtatSyntheseWrapperDto etat = getEtatSynthese(typeEtat, sessionPaieId, bulletinLotId, directionId, banqueNom);

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            String sheetName = etat.getTypeEtat() != null ? etat.getTypeEtat() : "ETAT";
            if (sheetName.length() > 30) {
                sheetName = sheetName.substring(0, 30);
            }
            XSSFSheet sheet = workbook.createSheet(sheetName);
            sheet.setDisplayGridlines(true);

            // Palette de couleurs BPBF
            byte[] navyRgb = new byte[]{(byte) 0, (byte) 96, (byte) 179}; // #0060B3
            XSSFColor navyColor = new XSSFColor(navyRgb, null);

            byte[] grayRgb = new byte[]{(byte) 241, (byte) 245, (byte) 249}; // #F1F5F9
            XSSFColor grayColor = new XSSFColor(grayRgb, null);

            // Polices
            XSSFFont titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 13);
            titleFont.setColor(navyColor);

            XSSFFont subTitleFont = workbook.createFont();
            subTitleFont.setBold(true);
            subTitleFont.setFontHeightInPoints((short) 10.5);

            XSSFFont metaFont = workbook.createFont();
            metaFont.setFontHeightInPoints((short) 9);
            metaFont.setColor(IndexedColors.GREY_50_PERCENT.getIndex());

            XSSFFont thFont = workbook.createFont();
            thFont.setBold(true);
            thFont.setFontHeightInPoints((short) 9.5);
            thFont.setColor(IndexedColors.WHITE.getIndex());

            XSSFFont tdFont = workbook.createFont();
            tdFont.setFontHeightInPoints((short) 9);

            XSSFFont tdBoldFont = workbook.createFont();
            tdBoldFont.setBold(true);
            tdBoldFont.setFontHeightInPoints((short) 9.5);

            DataFormat dataFormat = workbook.createDataFormat();
            short numFmt = dataFormat.getFormat("#,##0");

            // Styles
            XSSFCellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setFont(titleFont);

            XSSFCellStyle subTitleStyle = workbook.createCellStyle();
            subTitleStyle.setFont(subTitleFont);

            XSSFCellStyle metaStyle = workbook.createCellStyle();
            metaStyle.setFont(metaFont);

            XSSFCellStyle thStyle = workbook.createCellStyle();
            thStyle.setFont(thFont);
            thStyle.setFillForegroundColor(navyColor);
            thStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            thStyle.setAlignment(HorizontalAlignment.CENTER);
            thStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            thStyle.setBorderTop(BorderStyle.THIN);
            thStyle.setBorderBottom(BorderStyle.THIN);
            thStyle.setBorderLeft(BorderStyle.THIN);
            thStyle.setBorderRight(BorderStyle.THIN);

            XSSFCellStyle thNumStyle = workbook.createCellStyle();
            thNumStyle.cloneStyleFrom(thStyle);
            thNumStyle.setAlignment(HorizontalAlignment.RIGHT);

            XSSFCellStyle tdTextStyle = workbook.createCellStyle();
            tdTextStyle.setFont(tdFont);
            tdTextStyle.setAlignment(HorizontalAlignment.LEFT);
            tdTextStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            tdTextStyle.setBorderTop(BorderStyle.THIN);
            tdTextStyle.setBorderBottom(BorderStyle.THIN);
            tdTextStyle.setBorderLeft(BorderStyle.THIN);
            tdTextStyle.setBorderRight(BorderStyle.THIN);

            XSSFCellStyle tdCenterStyle = workbook.createCellStyle();
            tdCenterStyle.setFont(tdFont);
            tdCenterStyle.setAlignment(HorizontalAlignment.CENTER);
            tdCenterStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            tdCenterStyle.setBorderTop(BorderStyle.THIN);
            tdCenterStyle.setBorderBottom(BorderStyle.THIN);
            tdCenterStyle.setBorderLeft(BorderStyle.THIN);
            tdCenterStyle.setBorderRight(BorderStyle.THIN);

            XSSFCellStyle tdNumStyle = workbook.createCellStyle();
            tdNumStyle.setFont(tdFont);
            tdNumStyle.setDataFormat(numFmt);
            tdNumStyle.setAlignment(HorizontalAlignment.RIGHT);
            tdNumStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            tdNumStyle.setBorderTop(BorderStyle.THIN);
            tdNumStyle.setBorderBottom(BorderStyle.THIN);
            tdNumStyle.setBorderLeft(BorderStyle.THIN);
            tdNumStyle.setBorderRight(BorderStyle.THIN);

            XSSFCellStyle totalLabelStyle = workbook.createCellStyle();
            totalLabelStyle.setFont(tdBoldFont);
            totalLabelStyle.setFillForegroundColor(grayColor);
            totalLabelStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            totalLabelStyle.setAlignment(HorizontalAlignment.LEFT);
            totalLabelStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            totalLabelStyle.setBorderTop(BorderStyle.THIN);
            totalLabelStyle.setBorderBottom(BorderStyle.DOUBLE);
            totalLabelStyle.setBorderLeft(BorderStyle.THIN);
            totalLabelStyle.setBorderRight(BorderStyle.THIN);

            XSSFCellStyle totalNumStyle = workbook.createCellStyle();
            totalNumStyle.setFont(tdBoldFont);
            totalNumStyle.setFillForegroundColor(grayColor);
            totalNumStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            totalNumStyle.setDataFormat(numFmt);
            totalNumStyle.setAlignment(HorizontalAlignment.RIGHT);
            totalNumStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            totalNumStyle.setBorderTop(BorderStyle.THIN);
            totalNumStyle.setBorderBottom(BorderStyle.DOUBLE);
            totalNumStyle.setBorderLeft(BorderStyle.THIN);
            totalNumStyle.setBorderRight(BorderStyle.THIN);

            // En-tête officiel BPBF
            Row r0 = sheet.createRow(0);
            createCell(r0, 0, "BANQUE POSTALE DU BURKINA FASO", titleStyle);

            Row r1 = sheet.createRow(1);
            createCell(r1, 0, "ÉTAT DE SYNTHÈSE : " + (etat.getTitreEtat() != null ? etat.getTitreEtat() : ""), subTitleStyle);

            Row r2 = sheet.createRow(2);
            String infoSession = "Session : " + (etat.getCodeSession() != null ? etat.getCodeSession() : "—") +
                    "  |  Période : " + (etat.getPeriode() != null ? etat.getPeriode() : "—") +
                    "  |  Date d'export : " + java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
            createCell(r2, 0, infoSession, metaStyle);

            List<Object> data = etat.getDonnees() != null ? etat.getDonnees() : Collections.emptyList();
            String type = etat.getTypeEtat();
            int rowIndex = 4;
            int colCount = 0;

            Row headerRow = sheet.createRow(rowIndex++);
            headerRow.setHeightInPoints(24);

            if ("RECAPITULATIF_GLOBAL".equalsIgnoreCase(type)) {
                String[] headers = {"Numéro Compte", "Intitulé Compte", "Sens", "Débit (FCFA)", "Crédit (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 3) ? thNumStyle : thStyle);
                }
                for (Object o : data) {
                    if (o instanceof RecapitulatifGlobalRowDto r) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, r.getNumeroCompte(), tdCenterStyle);
                        createCell(row, 1, r.getIntituleCompte(), tdTextStyle);
                        createCell(row, 2, r.getSens(), tdCenterStyle);
                        createCell(row, 3, r.getMontantDebit(), tdNumStyle);
                        createCell(row, 4, r.getMontantCredit(), tdNumStyle);
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL DE L'ÉTAT (BALANCE ÉQUILIBRÉE)", totalLabelStyle);
                createCell(totRow, 1, "", totalLabelStyle);
                createCell(totRow, 2, "", totalLabelStyle);
                createCell(totRow, 3, etat.getTotalMasseSalariale(), totalNumStyle);
                createCell(totRow, 4, etat.getTotalMasseSalariale(), totalNumStyle);

            } else if ("ETAT_CRRAE_RRPC".equalsIgnoreCase(type) || "ETAT_CRRAE_RCPNC".equalsIgnoreCase(type) || "ETAT_CRRAE_FAAM".equalsIgnoreCase(type)) {
                String[] headers = {"N° d'Ordre", "Matricule", "Nom et Prénoms", "Salaire Soumis (FCFA)", "Part Employeur (FCFA)", "Part Salariale (FCFA)", "Total Cotisations (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 3) ? thNumStyle : thStyle);
                }
                BigDecimal totSoumis = BigDecimal.ZERO;
                BigDecimal totPat = BigDecimal.ZERO;
                BigDecimal totSal = BigDecimal.ZERO;
                BigDecimal totGlob = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatCrraeRowDto c) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, c.getNumeroOrdre() != null ? c.getNumeroOrdre().toString() : "", tdCenterStyle);
                        createCell(row, 1, c.getMatricule(), tdCenterStyle);
                        createCell(row, 2, c.getNomPrenom(), tdTextStyle);
                        createCell(row, 3, c.getSalaireSoumisCotisation(), tdNumStyle);
                        createCell(row, 4, c.getCotisationPatronale(), tdNumStyle);
                        createCell(row, 5, c.getCotisationSalariale(), tdNumStyle);
                        createCell(row, 6, c.getMontantTotalCotisations(), tdNumStyle);

                        if (c.getSalaireSoumisCotisation() != null) totSoumis = totSoumis.add(c.getSalaireSoumisCotisation());
                        if (c.getCotisationPatronale() != null) totPat = totPat.add(c.getCotisationPatronale());
                        if (c.getCotisationSalariale() != null) totSal = totSal.add(c.getCotisationSalariale());
                        if (c.getMontantTotalCotisations() != null) totGlob = totGlob.add(c.getMontantTotalCotisations());
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL DE LA DÉCLARATION DES COTISATIONS", totalLabelStyle);
                createCell(totRow, 1, "", totalLabelStyle);
                createCell(totRow, 2, "", totalLabelStyle);
                createCell(totRow, 3, totSoumis, totalNumStyle);
                createCell(totRow, 4, totPat, totalNumStyle);
                createCell(totRow, 5, totSal, totalNumStyle);
                createCell(totRow, 6, totGlob, totalNumStyle);

            } else if ("ETAT_BANQUE".equalsIgnoreCase(type)) {
                String[] headers = {"Banque", "Matricule", "Nom & Prénom(s)", "Code Banque", "Code Guichet", "Compte à créditer", "Clé", "Montant Net (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i == 7) ? thNumStyle : thStyle);
                }
                BigDecimal totalNetBq = BigDecimal.ZERO;
                for (Object o : data) {
                    if (o instanceof EtatBanqueGroupeDto bq) {
                        if (bq.getVirements() != null) {
                            for (EtatBanqueGroupeDto.VirementItemDto v : bq.getVirements()) {
                                Row row = sheet.createRow(rowIndex++);
                                createCell(row, 0, bq.getBanqueNom(), tdTextStyle);
                                createCell(row, 1, v.getMatricule(), tdCenterStyle);
                                createCell(row, 2, v.getNomPrenom(), tdTextStyle);
                                createCell(row, 3, v.getCodeBanque(), tdCenterStyle);
                                createCell(row, 4, v.getCodeGuichet(), tdCenterStyle);
                                createCell(row, 5, v.getCompteACrediter(), tdCenterStyle);
                                createCell(row, 6, v.getCle(), tdCenterStyle);
                                BigDecimal m = v.getMontant() != null ? v.getMontant() : v.getMontantNet();
                                createCell(row, 7, m, tdNumStyle);
                                if (m != null) totalNetBq = totalNetBq.add(m);
                            }
                        }
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL DES ORDRES DE VIREMENT", totalLabelStyle);
                for (int i = 1; i <= 6; i++) createCell(totRow, i, "", totalLabelStyle);
                createCell(totRow, 7, totalNetBq, totalNumStyle);

            } else if ("ETAT_CNSS".equalsIgnoreCase(type)) {
                String[] headers = {"Matricule", "Nom et Prénoms", "N° CNSS", "Date Embauche", "Salaire Brut (FCFA)", "Assiette CNSS (plaf. 800k)", "Part Sal. (5.5%)", "Prest. Fam. (7.0%)", "Risques Pro (3.5%)", "Retraite Pat. (5.5%)", "Total Patronal", "Total reversé CNSS"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 4) ? thNumStyle : thStyle);
                }
                BigDecimal totBrut = BigDecimal.ZERO;
                BigDecimal totAss = BigDecimal.ZERO;
                BigDecimal totSal = BigDecimal.ZERO;
                BigDecimal totPf = BigDecimal.ZERO;
                BigDecimal totRp = BigDecimal.ZERO;
                BigDecimal totRetPat = BigDecimal.ZERO;
                BigDecimal totPat = BigDecimal.ZERO;
                BigDecimal totRev = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatCnssRowDto c) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, c.getMatricule(), tdCenterStyle);
                        createCell(row, 1, c.getNomPrenom(), tdTextStyle);
                        createCell(row, 2, c.getNoCnss(), tdCenterStyle);
                        createCell(row, 3, c.getDateEmbauche(), tdCenterStyle);
                        createCell(row, 4, c.getSalaireBrut(), tdNumStyle);
                        createCell(row, 5, c.getAssietteCotisable(), tdNumStyle);
                        createCell(row, 6, c.getPartSalariale(), tdNumStyle);
                        createCell(row, 7, c.getPartPatronalePrestations(), tdNumStyle);
                        createCell(row, 8, c.getPartPatronaleRisques(), tdNumStyle);
                        createCell(row, 9, c.getPartPatronaleRetraite(), tdNumStyle);
                        createCell(row, 10, c.getTotalPartPatronale(), tdNumStyle);
                        createCell(row, 11, c.getTotalCotisationCnss(), tdNumStyle);

                        if (c.getSalaireBrut() != null) totBrut = totBrut.add(c.getSalaireBrut());
                        if (c.getAssietteCotisable() != null) totAss = totAss.add(c.getAssietteCotisable());
                        if (c.getPartSalariale() != null) totSal = totSal.add(c.getPartSalariale());
                        if (c.getPartPatronalePrestations() != null) totPf = totPf.add(c.getPartPatronalePrestations());
                        if (c.getPartPatronaleRisques() != null) totRp = totRp.add(c.getPartPatronaleRisques());
                        if (c.getPartPatronaleRetraite() != null) totRetPat = totRetPat.add(c.getPartPatronaleRetraite());
                        if (c.getTotalPartPatronale() != null) totPat = totPat.add(c.getTotalPartPatronale());
                        if (c.getTotalCotisationCnss() != null) totRev = totRev.add(c.getTotalCotisationCnss());
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL DÉCLARATIF COTISATIONS CNSS", totalLabelStyle);
                for (int i = 1; i <= 3; i++) createCell(totRow, i, "", totalLabelStyle);
                createCell(totRow, 4, totBrut, totalNumStyle);
                createCell(totRow, 5, totAss, totalNumStyle);
                createCell(totRow, 6, totSal, totalNumStyle);
                createCell(totRow, 7, totPf, totalNumStyle);
                createCell(totRow, 8, totRp, totalNumStyle);
                createCell(totRow, 9, totRetPat, totalNumStyle);
                createCell(totRow, 10, totPat, totalNumStyle);
                createCell(totRow, 11, totRev, totalNumStyle);

            } else if ("ETAT_IUTS".equalsIgnoreCase(type)) {
                String[] headers = {"N° d'Ordre", "Nom et Prénoms", "Total Salaires Bruts (FCFA)", "Base Imposable IUTS (FCFA)", "Nb de charges", "IUTS Net à Reverser (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i == 2 || i == 3 || i == 5) ? thNumStyle : thStyle);
                }
                BigDecimal totBrut = BigDecimal.ZERO;
                BigDecimal totBase = BigDecimal.ZERO;
                BigDecimal totIuts = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatIutsRowDto i) {
                        BigDecimal brut = i.getSalaireBruts() != null ? i.getSalaireBruts() : i.getSalaireBrut();
                        BigDecimal netIuts = i.getIutsAReverser() != null ? i.getIutsAReverser() : i.getImpotIutsNet();
                        Integer ch = i.getNbDeCharges() != null ? i.getNbDeCharges() : i.getNombreCharges();

                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, i.getNumeroOrdre() != null ? i.getNumeroOrdre().toString() : "—", tdCenterStyle);
                        createCell(row, 1, i.getNomPrenom(), tdTextStyle);
                        createCell(row, 2, brut, tdNumStyle);
                        createCell(row, 3, i.getBaseImposable(), tdNumStyle);
                        createCell(row, 4, ch != null ? ch : 0, tdCenterStyle);
                        createCell(row, 5, netIuts, tdNumStyle);

                        if (brut != null) totBrut = totBrut.add(brut);
                        if (i.getBaseImposable() != null) totBase = totBase.add(i.getBaseImposable());
                        if (netIuts != null) totIuts = totIuts.add(netIuts);
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL DE L'ÉTAT IUTS À REVERSER", totalLabelStyle);
                createCell(totRow, 1, "", totalLabelStyle);
                createCell(totRow, 2, totBrut, totalNumStyle);
                createCell(totRow, 3, totBase, totalNumStyle);
                createCell(totRow, 4, "", totalLabelStyle);
                createCell(totRow, 5, totIuts, totalNumStyle);

            } else if ("ETAT_FSP".equalsIgnoreCase(type)) {
                String[] headers = {"N° d'Ordre", "Matricule", "Nom et Prénoms", "Salaire Net (FCFA)", "Taux", "Montant (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i == 3 || i == 5) ? thNumStyle : thStyle);
                }
                BigDecimal totNet = BigDecimal.ZERO;
                BigDecimal totFsp = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatFspRowDto f) {
                        BigDecimal net = f.getSalaireNet() != null ? f.getSalaireNet() : f.getAssietteCalcul();
                        BigDecimal m = f.getMontant() != null ? f.getMontant() : f.getMontantRetenu();

                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, f.getNumeroOrdre() != null ? f.getNumeroOrdre().toString() : "—", tdCenterStyle);
                        createCell(row, 1, f.getMatricule(), tdCenterStyle);
                        createCell(row, 2, f.getNomPrenom(), tdTextStyle);
                        createCell(row, 3, net, tdNumStyle);
                        createCell(row, 4, f.getTaux() != null ? (f.getTaux() + "%") : "1%", tdCenterStyle);
                        createCell(row, 5, m, tdNumStyle);

                        if (net != null) totNet = totNet.add(net);
                        if (m != null) totFsp = totFsp.add(m);
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL DU FONDS DE SOLIDARITÉ PATRIOTIQUE", totalLabelStyle);
                createCell(totRow, 1, "", totalLabelStyle);
                createCell(totRow, 2, "", totalLabelStyle);
                createCell(totRow, 3, totNet, totalNumStyle);
                createCell(totRow, 4, "1%", totalLabelStyle);
                createCell(totRow, 5, totFsp, totalNumStyle);

            } else if ("ETAT_SALAIRE".equalsIgnoreCase(type)) {
                String[] headers = {"Direction", "Département", "Effectif", "Salaire Base (FCFA)", "Indemnités (FCFA)", "Salaire Brut (FCFA)", "Charges Patronales (FCFA)", "Masse Salariale Totale (FCFA)", "Retenues (FCFA)", "Net Payé (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 2) ? thNumStyle : thStyle);
                }
                int totEff = 0;
                BigDecimal totBase = BigDecimal.ZERO;
                BigDecimal totIndem = BigDecimal.ZERO;
                BigDecimal totBrut = BigDecimal.ZERO;
                BigDecimal totPat = BigDecimal.ZERO;
                BigDecimal totMasse = BigDecimal.ZERO;
                BigDecimal totRet = BigDecimal.ZERO;
                BigDecimal totNet = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatSalaireDirectionRowDto s) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, s.getDirectionNom(), tdTextStyle);
                        createCell(row, 1, s.getDepartementNom(), tdTextStyle);
                        createCell(row, 2, s.getEffectif() != null ? s.getEffectif() : 0, tdCenterStyle);
                        createCell(row, 3, s.getTotalSalaireBase(), tdNumStyle);
                        createCell(row, 4, s.getTotalIndemnites(), tdNumStyle);
                        createCell(row, 5, s.getTotalBrut(), tdNumStyle);
                        createCell(row, 6, s.getTotalCotisationsPatronales(), tdNumStyle);
                        createCell(row, 7, s.getTotalMasseSalariale(), tdNumStyle);
                        createCell(row, 8, s.getTotalRetenues(), tdNumStyle);
                        createCell(row, 9, s.getTotalNet(), tdNumStyle);

                        totEff += s.getEffectif() != null ? s.getEffectif() : 0;
                        if (s.getTotalSalaireBase() != null) totBase = totBase.add(s.getTotalSalaireBase());
                        if (s.getTotalIndemnites() != null) totIndem = totIndem.add(s.getTotalIndemnites());
                        if (s.getTotalBrut() != null) totBrut = totBrut.add(s.getTotalBrut());
                        if (s.getTotalCotisationsPatronales() != null) totPat = totPat.add(s.getTotalCotisationsPatronales());
                        if (s.getTotalMasseSalariale() != null) totMasse = totMasse.add(s.getTotalMasseSalariale());
                        if (s.getTotalRetenues() != null) totRet = totRet.add(s.getTotalRetenues());
                        if (s.getTotalNet() != null) totNet = totNet.add(s.getTotalNet());
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL CONSOLIDÉ TOUTES DIRECTIONS", totalLabelStyle);
                createCell(totRow, 1, "", totalLabelStyle);
                createCell(totRow, 2, totEff, totalNumStyle);
                createCell(totRow, 3, totBase, totalNumStyle);
                createCell(totRow, 4, totIndem, totalNumStyle);
                createCell(totRow, 5, totBrut, totalNumStyle);
                createCell(totRow, 6, totPat, totalNumStyle);
                createCell(totRow, 7, totMasse, totalNumStyle);
                createCell(totRow, 8, totRet, totalNumStyle);
                createCell(totRow, 9, totNet, totalNumStyle);

            } else if ("ETAT_NOMINATIF".equalsIgnoreCase(type)) {
                String[] headers = {"Matricule", "Nom et Prénoms", "Poste / Classification", "Direction", "Salaire Base (FCFA)", "Sal. Brut (FCFA)", "Total Ret. (FCFA)", "Net Payé (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 4) ? thNumStyle : thStyle);
                }
                BigDecimal totBase = BigDecimal.ZERO;
                BigDecimal totBrut = BigDecimal.ZERO;
                BigDecimal totRet = BigDecimal.ZERO;
                BigDecimal totNet = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatNominatifRowDto n) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, n.getMatricule(), tdCenterStyle);
                        createCell(row, 1, n.getNomPrenom(), tdTextStyle);
                        String posteClass = (n.getPoste() != null ? n.getPoste() : "") + (n.getClassification() != null ? " (" + n.getClassification() + ")" : "");
                        createCell(row, 2, posteClass, tdTextStyle);
                        createCell(row, 3, n.getDirection(), tdTextStyle);
                        createCell(row, 4, n.getSalaireBase(), tdNumStyle);
                        createCell(row, 5, n.getSalaireBrut(), tdNumStyle);
                        createCell(row, 6, n.getTotalRetenues(), tdNumStyle);
                        createCell(row, 7, n.getSalaireNet(), tdNumStyle);

                        if (n.getSalaireBase() != null) totBase = totBase.add(n.getSalaireBase());
                        if (n.getSalaireBrut() != null) totBrut = totBrut.add(n.getSalaireBrut());
                        if (n.getTotalRetenues() != null) totRet = totRet.add(n.getTotalRetenues());
                        if (n.getSalaireNet() != null) totNet = totNet.add(n.getSalaireNet());
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL GÉNÉRAL DE L'ÉTAT NOMINATIF", totalLabelStyle);
                for (int i = 1; i <= 3; i++) createCell(totRow, i, "", totalLabelStyle);
                createCell(totRow, 4, totBase, totalNumStyle);
                createCell(totRow, 5, totBrut, totalNumStyle);
                createCell(totRow, 6, totRet, totalNumStyle);
                createCell(totRow, 7, totNet, totalNumStyle);

            } else if ("ETAT_PRECOMPTE".equalsIgnoreCase(type)) {
                String[] headers = {"Matricule", "Nom et Prénoms", "Type de Précompte / Prêt", "Organisme Bénéficiaire", "Montant Initial (FCFA)", "Retenue Période (FCFA)", "Solde Restant Dû (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 4) ? thNumStyle : thStyle);
                }
                BigDecimal totInit = BigDecimal.ZERO;
                BigDecimal totRet = BigDecimal.ZERO;
                BigDecimal totSolde = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatPrecompteRowDto p) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, p.getMatricule(), tdCenterStyle);
                        createCell(row, 1, p.getNomPrenom(), tdTextStyle);
                        createCell(row, 2, p.getTypePrecompte(), tdTextStyle);
                        createCell(row, 3, p.getOrganismeBeneficiaire(), tdTextStyle);
                        createCell(row, 4, p.getMontantTotalInitial(), tdNumStyle);
                        createCell(row, 5, p.getRetenuePeriode(), tdNumStyle);
                        createCell(row, 6, p.getSoldeRestantDu(), tdNumStyle);

                        if (p.getMontantTotalInitial() != null) totInit = totInit.add(p.getMontantTotalInitial());
                        if (p.getRetenuePeriode() != null) totRet = totRet.add(p.getRetenuePeriode());
                        if (p.getSoldeRestantDu() != null) totSolde = totSolde.add(p.getSoldeRestantDu());
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL DES PRÉCOMPTES ET RETENUES", totalLabelStyle);
                for (int i = 1; i <= 3; i++) createCell(totRow, i, "", totalLabelStyle);
                createCell(totRow, 4, totInit, totalNumStyle);
                createCell(totRow, 5, totRet, totalNumStyle);
                createCell(totRow, 6, totSolde, totalNumStyle);

            } else if ("ETAT_MUTUELLE".equalsIgnoreCase(type)) {
                String[] headers = {"Matricule", "Nom et Prénoms", "Direction", "Formule / Régime", "Part Salariale (FCFA)", "Part Patronale (FCFA)", "Total Cotisation Mutuelle (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 4) ? thNumStyle : thStyle);
                }
                BigDecimal totSal = BigDecimal.ZERO;
                BigDecimal totPat = BigDecimal.ZERO;
                BigDecimal totCot = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatMutuelleRowDto m) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, m.getMatricule(), tdCenterStyle);
                        createCell(row, 1, m.getNomPrenom(), tdTextStyle);
                        createCell(row, 2, m.getDirection(), tdTextStyle);
                        createCell(row, 3, m.getFormuleMutuelle(), tdTextStyle);
                        createCell(row, 4, m.getPartSalariale(), tdNumStyle);
                        createCell(row, 5, m.getPartPatronale(), tdNumStyle);
                        createCell(row, 6, m.getTotalCotisation(), tdNumStyle);

                        if (m.getPartSalariale() != null) totSal = totSal.add(m.getPartSalariale());
                        if (m.getPartPatronale() != null) totPat = totPat.add(m.getPartPatronale());
                        if (m.getTotalCotisation() != null) totCot = totCot.add(m.getTotalCotisation());
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL DES COTISATIONS MUTUELLE DE SANTÉ", totalLabelStyle);
                for (int i = 1; i <= 3; i++) createCell(totRow, i, "", totalLabelStyle);
                createCell(totRow, 4, totSal, totalNumStyle);
                createCell(totRow, 5, totPat, totalNumStyle);
                createCell(totRow, 6, totCot, totalNumStyle);

            } else if ("ETAT_TYPE_EMPLOYE".equalsIgnoreCase(type)) {
                String[] headers = {"Statut / Type d'Employé", "Effectif", "Salaire Base (FCFA)", "Indemnités (FCFA)", "Salaire Brut (FCFA)", "Charges Patronales (FCFA)", "Retenues (FCFA)", "Net Global (FCFA)", "Net Moyen (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 1) ? thNumStyle : thStyle);
                }
                int totEff = 0;
                BigDecimal totBase = BigDecimal.ZERO;
                BigDecimal totIndem = BigDecimal.ZERO;
                BigDecimal totBrut = BigDecimal.ZERO;
                BigDecimal totPat = BigDecimal.ZERO;
                BigDecimal totRet = BigDecimal.ZERO;
                BigDecimal totNet = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatTypeEmployeRowDto te) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, te.getTypeEmploye(), tdTextStyle);
                        createCell(row, 1, te.getEffectif() != null ? te.getEffectif() : 0, tdCenterStyle);
                        createCell(row, 2, te.getTotalSalaireBase(), tdNumStyle);
                        createCell(row, 3, te.getTotalIndemnites(), tdNumStyle);
                        createCell(row, 4, te.getTotalBrut(), tdNumStyle);
                        createCell(row, 5, te.getTotalCotisationsPatronales(), tdNumStyle);
                        createCell(row, 6, te.getTotalRetenues(), tdNumStyle);
                        createCell(row, 7, te.getTotalNet(), tdNumStyle);
                        createCell(row, 8, te.getSalaireMoyenNet(), tdNumStyle);

                        totEff += te.getEffectif() != null ? te.getEffectif() : 0;
                        if (te.getTotalSalaireBase() != null) totBase = totBase.add(te.getTotalSalaireBase());
                        if (te.getTotalIndemnites() != null) totIndem = totIndem.add(te.getTotalIndemnites());
                        if (te.getTotalBrut() != null) totBrut = totBrut.add(te.getTotalBrut());
                        if (te.getTotalCotisationsPatronales() != null) totPat = totPat.add(te.getTotalCotisationsPatronales());
                        if (te.getTotalRetenues() != null) totRet = totRet.add(te.getTotalRetenues());
                        if (te.getTotalNet() != null) totNet = totNet.add(te.getTotalNet());
                    }
                }
                BigDecimal moyNet = totEff > 0 ? totNet.divide(new BigDecimal(totEff), 0, RoundingMode.HALF_UP) : BigDecimal.ZERO;
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL GÉNÉRAL PAR STATUT", totalLabelStyle);
                createCell(totRow, 1, totEff, totalNumStyle);
                createCell(totRow, 2, totBase, totalNumStyle);
                createCell(totRow, 3, totIndem, totalNumStyle);
                createCell(totRow, 4, totBrut, totalNumStyle);
                createCell(totRow, 5, totPat, totalNumStyle);
                createCell(totRow, 6, totRet, totalNumStyle);
                createCell(totRow, 7, totNet, totalNumStyle);
                createCell(totRow, 8, moyNet, totalNumStyle);

            } else if ("ETAT_ELEMENTS_SALAIRE".equalsIgnoreCase(type) || "ETAT_ELEMENT_SALAIRE".equalsIgnoreCase(type)) {
                String[] headers = {"Code Rubrique", "Libellé de l'Élément", "Nature / Type", "Nombre Bénéficiaires", "Part Salariale (FCFA)", "Part Patronale (FCFA)", "Total Général (FCFA)"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 3) ? thNumStyle : thStyle);
                }
                int totBenef = 0;
                BigDecimal totSal = BigDecimal.ZERO;
                BigDecimal totPat = BigDecimal.ZERO;
                BigDecimal totGlob = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatElementSalaireRowDto el) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, el.getCodeRubrique(), tdCenterStyle);
                        createCell(row, 1, el.getLibelleRubrique(), tdTextStyle);
                        createCell(row, 2, el.getTypeRubrique(), tdCenterStyle);
                        createCell(row, 3, el.getNombreBeneficiaires() != null ? el.getNombreBeneficiaires() : 0, tdCenterStyle);
                        createCell(row, 4, el.getTotalMontantSalarial(), tdNumStyle);
                        createCell(row, 5, el.getTotalMontantPatronal(), tdNumStyle);
                        createCell(row, 6, el.getTotalGlobal(), tdNumStyle);

                        totBenef += el.getNombreBeneficiaires() != null ? el.getNombreBeneficiaires() : 0;
                        if (el.getTotalMontantSalarial() != null) totSal = totSal.add(el.getTotalMontantSalarial());
                        if (el.getTotalMontantPatronal() != null) totPat = totPat.add(el.getTotalMontantPatronal());
                        if (el.getTotalGlobal() != null) totGlob = totGlob.add(el.getTotalGlobal());
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL DES RUBRIQUES DE SALAIRE", totalLabelStyle);
                createCell(totRow, 1, "", totalLabelStyle);
                createCell(totRow, 2, "", totalLabelStyle);
                createCell(totRow, 3, totBenef, totalNumStyle);
                createCell(totRow, 4, totSal, totalNumStyle);
                createCell(totRow, 5, totPat, totalNumStyle);
                createCell(totRow, 6, totGlob, totalNumStyle);

            } else if ("ETAT_BULLETIN".equalsIgnoreCase(type)) {
                String[] headers = {"Code Bulletin", "Matricule", "Nom et Prénoms", "Direction", "Type Session", "Statut", "Salaire Brut (FCFA)", "Total Retenues (FCFA)", "Net à Payer (FCFA)", "Justification Écart"};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 6 && i <= 8) ? thNumStyle : thStyle);
                }
                BigDecimal totBrut = BigDecimal.ZERO;
                BigDecimal totRet = BigDecimal.ZERO;
                BigDecimal totNet = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof EtatBulletinControleRowDto b) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, b.getCodeBulletin(), tdCenterStyle);
                        createCell(row, 1, b.getMatricule(), tdCenterStyle);
                        createCell(row, 2, b.getNomPrenom(), tdTextStyle);
                        createCell(row, 3, b.getDirection(), tdTextStyle);
                        createCell(row, 4, b.getTypeSession(), tdCenterStyle);
                        createCell(row, 5, b.getStatut(), tdCenterStyle);
                        createCell(row, 6, b.getSalaireBrut(), tdNumStyle);
                        createCell(row, 7, b.getTotalRetenues(), tdNumStyle);
                        createCell(row, 8, b.getSalaireNet(), tdNumStyle);
                        createCell(row, 9, b.getJustificationEcart() != null ? b.getJustificationEcart() : "—", tdTextStyle);

                        if (b.getSalaireBrut() != null) totBrut = totBrut.add(b.getSalaireBrut());
                        if (b.getTotalRetenues() != null) totRet = totRet.add(b.getTotalRetenues());
                        if (b.getSalaireNet() != null) totNet = totNet.add(b.getSalaireNet());
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL CONTRÔLE DE TOUS LES BULLETINS", totalLabelStyle);
                for (int i = 1; i <= 5; i++) createCell(totRow, i, "", totalLabelStyle);
                createCell(totRow, 6, totBrut, totalNumStyle);
                createCell(totRow, 7, totRet, totalNumStyle);
                createCell(totRow, 8, totNet, totalNumStyle);
                createCell(totRow, 9, "", totalLabelStyle);

            } else {
                // Livre de paie officiel - 17 colonnes réglementaires
                String[] headers = {"Mle", "Nom et Prénoms", "Grade", "Sal. base", "Sursalaire", "Indem. & Pr.", "Total brut", "Ass. vi.", "Part patr.", "Base imp.", "Chrg", "IUTS", "Sal. net", "Tot. ret.", "Net payer", "TPA", "Masse sal."};
                colCount = headers.length;
                for (int i = 0; i < headers.length; i++) {
                    createCell(headerRow, i, headers[i], (i >= 3) ? thNumStyle : thStyle);
                }
                BigDecimal totBase = BigDecimal.ZERO;
                BigDecimal totSurSal = BigDecimal.ZERO;
                BigDecimal totIndem = BigDecimal.ZERO;
                BigDecimal totBrut = BigDecimal.ZERO;
                BigDecimal totAssVi = BigDecimal.ZERO;
                BigDecimal totPartPat = BigDecimal.ZERO;
                BigDecimal totBaseImp = BigDecimal.ZERO;
                BigDecimal totIuts = BigDecimal.ZERO;
                BigDecimal totSalNet = BigDecimal.ZERO;
                BigDecimal totRet = BigDecimal.ZERO;
                BigDecimal totNetPayer = BigDecimal.ZERO;
                BigDecimal totTpa = BigDecimal.ZERO;
                BigDecimal totMasseSal = BigDecimal.ZERO;

                for (Object o : data) {
                    if (o instanceof LivrePaieRowDto l) {
                        Row row = sheet.createRow(rowIndex++);
                        createCell(row, 0, l.getMatricule(), tdCenterStyle);
                        createCell(row, 1, l.getNomPrenom(), tdTextStyle);
                        createCell(row, 2, l.getGrade(), tdCenterStyle);
                        createCell(row, 3, l.getSalaireBase(), tdNumStyle);
                        createCell(row, 4, l.getSurSalaire(), tdNumStyle);
                        BigDecimal ind = l.getIndemnitesEtPrimes() != null ? l.getIndemnitesEtPrimes() : l.getIndemnites();
                        createCell(row, 5, ind, tdNumStyle);
                        createCell(row, 6, l.getSalaireBrut(), tdNumStyle);
                        BigDecimal ass = l.getAssVieillesse() != null ? l.getAssVieillesse() : l.getCotisationCnss();
                        createCell(row, 7, ass, tdNumStyle);
                        createCell(row, 8, l.getPartPatronale(), tdNumStyle);
                        createCell(row, 9, l.getBaseImposable(), tdNumStyle);
                        createCell(row, 10, l.getCharges() != null ? l.getCharges() : 0, tdCenterStyle);
                        createCell(row, 11, l.getImpotIuts(), tdNumStyle);
                        createCell(row, 12, l.getSalaireNet(), tdNumStyle);
                        createCell(row, 13, l.getTotalRetenues(), tdNumStyle);
                        BigDecimal netP = l.getNetAPayer() != null ? l.getNetAPayer() : l.getSalaireNet();
                        createCell(row, 14, netP, tdNumStyle);
                        createCell(row, 15, l.getTpa(), tdNumStyle);
                        createCell(row, 16, l.getMasseSalariale(), tdNumStyle);

                        if (l.getSalaireBase() != null) totBase = totBase.add(l.getSalaireBase());
                        if (l.getSurSalaire() != null) totSurSal = totSurSal.add(l.getSurSalaire());
                        if (ind != null) totIndem = totIndem.add(ind);
                        if (l.getSalaireBrut() != null) totBrut = totBrut.add(l.getSalaireBrut());
                        if (ass != null) totAssVi = totAssVi.add(ass);
                        if (l.getPartPatronale() != null) totPartPat = totPartPat.add(l.getPartPatronale());
                        if (l.getBaseImposable() != null) totBaseImp = totBaseImp.add(l.getBaseImposable());
                        if (l.getImpotIuts() != null) totIuts = totIuts.add(l.getImpotIuts());
                        if (l.getSalaireNet() != null) totSalNet = totSalNet.add(l.getSalaireNet());
                        if (l.getTotalRetenues() != null) totRet = totRet.add(l.getTotalRetenues());
                        if (netP != null) totNetPayer = totNetPayer.add(netP);
                        if (l.getTpa() != null) totTpa = totTpa.add(l.getTpa());
                        if (l.getMasseSalariale() != null) totMasseSal = totMasseSal.add(l.getMasseSalariale());
                    }
                }
                Row totRow = sheet.createRow(rowIndex++);
                totRow.setHeightInPoints(20);
                createCell(totRow, 0, "TOTAL GÉNÉRAL DU REGISTRE DE PAIE", totalLabelStyle);
                createCell(totRow, 1, "", totalLabelStyle);
                createCell(totRow, 2, "", totalLabelStyle);
                createCell(totRow, 3, totBase, totalNumStyle);
                createCell(totRow, 4, totSurSal, totalNumStyle);
                createCell(totRow, 5, totIndem, totalNumStyle);
                createCell(totRow, 6, totBrut, totalNumStyle);
                createCell(totRow, 7, totAssVi, totalNumStyle);
                createCell(totRow, 8, totPartPat, totalNumStyle);
                createCell(totRow, 9, totBaseImp, totalNumStyle);
                createCell(totRow, 10, "", totalLabelStyle);
                createCell(totRow, 11, totIuts, totalNumStyle);
                createCell(totRow, 12, totSalNet, totalNumStyle);
                createCell(totRow, 13, totRet, totalNumStyle);
                createCell(totRow, 14, totNetPayer, totalNumStyle);
                createCell(totRow, 15, totTpa, totalNumStyle);
                createCell(totRow, 16, totMasseSal, totalNumStyle);
            }

            // Auto-ajustement des largeurs de colonnes avec marge
            for (int col = 0; col < colCount; col++) {
                sheet.autoSizeColumn(col);
                int currentWidth = sheet.getColumnWidth(col);
                sheet.setColumnWidth(col, Math.max(currentWidth + 1200, 3600));
            }

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            workbook.write(bos);
            return bos.toByteArray();

        } catch (Exception e) {
            log.error("Erreur lors de la génération de l'export Excel natif XLSX : {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de la génération du fichier Excel XLSX", e);
        }
    }

    private void createCell(Row row, int col, String val, CellStyle style) {
        Cell cell = row.createCell(col);
        cell.setCellValue(val != null ? val : "");
        cell.setCellStyle(style);
    }

    private void createCell(Row row, int col, Number val, CellStyle style) {
        Cell cell = row.createCell(col);
        if (val != null) {
            cell.setCellValue(val.doubleValue());
        } else {
            cell.setCellValue(0.0);
        }
        cell.setCellStyle(style);
    }

    // ─── UTILITAIRES DE RENDU PDF ───────────────────────────────────────────

    private void addTh(PdfPTable table, String text, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FONT_TH));
        cell.setBackgroundColor(BPBF_NAVY);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(4f);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private void addTd(PdfPTable table, String text, int align, boolean bold) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", bold ? FONT_TD_BOLD : FONT_TD));
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(3f);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private void addTot(PdfPTable table, String text, int colSpan, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", FONT_TD_BOLD));
        cell.setColspan(colSpan);
        cell.setBackgroundColor(HEADER_BG);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(4f);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private void addThMini(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FONT_TH_MINI));
        cell.setBackgroundColor(BPBF_NAVY);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(2f);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private void addTdMini(PdfPTable table, String text, int align, boolean bold) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", bold ? FONT_TD_BOLD_MINI : FONT_TD_MINI));
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(2f);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private void addTotMini(PdfPTable table, String text, int colSpan, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", FONT_TD_BOLD_MINI));
        cell.setColspan(colSpan);
        cell.setBackgroundColor(HEADER_BG);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(2f);
        cell.setBorderColor(BORDER_COLOR);
        table.addCell(cell);
    }

    private String formatMoney(BigDecimal amount) {
        if (amount == null) return "0";
        NumberFormat nf = NumberFormat.getInstance(Locale.FRENCH);
        nf.setMinimumFractionDigits(0);
        nf.setMaximumFractionDigits(0);
        return nf.format(amount);
    }
}
