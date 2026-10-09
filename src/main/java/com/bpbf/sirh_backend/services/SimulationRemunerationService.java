package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.GrilleSalarialeDto;
import com.bpbf.sirh_backend.dtos.SimulationIndemnitesAutoDto;
import com.bpbf.sirh_backend.dtos.SimulationRequestDto;
import com.bpbf.sirh_backend.dtos.SimulationResultDto;
import com.bpbf.sirh_backend.dtos.SimulationResultDto.LigneSimulationDto;
import com.bpbf.sirh_backend.entities.GrilleSalariale;
import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SimulationRemunerationService {

    private final GrilleSalarialeService grilleSalarialeService;
    private final EmploiRepository emploiRepository;
    private final FonctionRepository fonctionRepository;
    private final ParametrageIndemniteRepository parametrageIndemniteRepository;
    private final GradeRepository gradeRepository;
    private final CategorieRepository categorieRepository;

    private static final BigDecimal CENT = new BigDecimal("100");
    private static final BigDecimal PLAFOND_CNSS = new BigDecimal("800000.00");
    private static final BigDecimal TAUX_CNSS_SALARIE = new BigDecimal("5.50");
    private static final BigDecimal TAUX_CNSS_PATRONAL = new BigDecimal("16.00"); // 7% PF + 3.5% AT/MP + 5.5% Retraite
    private static final BigDecimal PLAFOND_ABATTEMENT = new BigDecimal("75000.00");

    // Grille de secours officielle BPBF (Salaire de base brut mensuel en FCFA, index 1 à 15 - source PostgreSQL)
    private static final Map<String, int[]> GRILLE_BPBF_OFFICIELLE = Map.ofEntries(
            Map.entry("1", new int[]{0, 95945, 98823, 101788, 104842, 107987, 111227, 114563, 118000, 121540, 125186, 128942, 132810, 136795, 140898, 145125}),
            Map.entry("2", new int[]{0, 104474, 107608, 110836, 114162, 117586, 121114, 124747, 128490, 132345, 136315, 140404, 144616, 148955, 153424, 158026}),
            Map.entry("3", new int[]{0, 107135, 110349, 113660, 117069, 120581, 124199, 127925, 131763, 135715, 139787, 143980, 148300, 152749, 157331, 162051}),
            Map.entry("4", new int[]{0, 115558, 119025, 122595, 126273, 130062, 133963, 137982, 142122, 146385, 150777, 155300, 159959, 164758, 169701, 174792}),
            Map.entry("5", new int[]{0, 128831, 132696, 136677, 140777, 145000, 149350, 153831, 158446, 163199, 168095, 173138, 178332, 183682, 189193, 194868}),
            Map.entry("6", new int[]{0, 157940, 162678, 167559, 172585, 177763, 183096, 188589, 194246, 200074, 206076, 212258, 218626, 225185, 231940, 238898}),
            Map.entry("7", new int[]{0, 176441, 181734, 187186, 192802, 198586, 204543, 210680, 217000, 223510, 230215, 237122, 244236, 251563, 259110, 266883}),
            Map.entry("I", new int[]{0, 173090, 178283, 183631, 189140, 194814, 200659, 206679, 212879, 219265, 225843, 232618, 239597, 246785, 254189, 261814}),
            Map.entry("II", new int[]{0, 203834, 209949, 216247, 222735, 229417, 236299, 243388, 250690, 258211, 265957, 273936, 282154, 290619, 299337, 308317}),
            Map.entry("III", new int[]{0, 278697, 287058, 295670, 304540, 313676, 323086, 332779, 342762, 353045, 363636, 374545, 385782, 397355, 409276, 421554}),
            Map.entry("IV", new int[]{0, 405758, 417931, 430469, 443383, 456684, 470385, 484496, 499031, 514002, 529422, 545305, 561664, 578514, 595869, 613745}),
            Map.entry("V", new int[]{0, 581390, 598832, 616797, 635301, 654360, 673990, 694210, 715036, 736487, 758582, 781340, 804780, 828923, 853791, 879405}),
            Map.entry("VI", new int[]{0, 599438, 617421, 635944, 655022, 674673, 694913, 715760, 737233, 759350, 782131, 805595, 829762, 854655, 880295, 906704}),
            Map.entry("VII", new int[]{0, 631454, 650398, 669910, 690007, 710707, 732028, 753989, 776609, 799907, 823904, 848621, 874080, 900302, 927311, 955131}),
            Map.entry("VIII", new int[]{0, 710386, 731698, 753649, 776258, 799546, 823532, 848238, 873685, 899896, 926893, 954699, 983340, 1012841, 1043226, 1074523})
    );

    /**
     * Détermine les indemnités conventionnelles applicables (PostgreSQL & Convention BPBF).
     */
    public SimulationIndemnitesAutoDto determinerIndemnitesConventionnelles(SimulationRequestDto request) {
        if (request == null) request = new SimulationRequestDto();

        // 1. Résolution de l'Emploi (Poste)
        Long empId = request.getEmploiId();
        String nomEmploi = request.getEmploiNom();
        if (empId != null) {
            var empOpt = emploiRepository.findById(empId);
            if (empOpt.isPresent()) {
                nomEmploi = empOpt.get().getName();
            }
        } else if (nomEmploi != null && !nomEmploi.isBlank()) {
            for (var emp : emploiRepository.findAll()) {
                if (emp.getName() != null && emp.getName().equalsIgnoreCase(nomEmploi.trim())) {
                    empId = emp.getId();
                    break;
                }
            }
        }

        // 2. Résolution de la Fonction
        Long fctId = request.getFonctionId();
        String nomFonction = request.getFonctionNom();
        if (fctId != null) {
            var fctOpt = fonctionRepository.findById(fctId);
            if (fctOpt.isPresent()) {
                nomFonction = fctOpt.get().getName();
            }
        } else if (nomFonction != null && !nomFonction.isBlank()) {
            for (var fct : fonctionRepository.findAll()) {
                if (fct.getName() != null && fct.getName().equalsIgnoreCase(nomFonction.trim())) {
                    fctId = fct.getId();
                    break;
                }
            }
        }

        // 3. Normalisation Catégorie et Grade
        String rawCat = request.getCategorieCode() != null ? request.getCategorieCode().trim().toUpperCase() : "1";
        String catCode = rawCat.replace("CATEGORIE", "").replace("CLASSE", "").replace("C", "").trim();

        Long catId = request.getCategorieId();
        if (catId == null) {
            for (var c : categorieRepository.findAll()) {
                String cCode = c.getCode() != null ? c.getCode().trim().toUpperCase() : "";
                String cLib = c.getLibelle() != null ? c.getLibelle().trim().toUpperCase() : "";
                if (cCode.equals(catCode) || cCode.equals(rawCat) || cLib.equals(rawCat) || cLib.contains("CLASSE " + catCode) || cLib.contains(catCode + "ÈRE") || cLib.contains(catCode + "ÈME")) {
                    catId = c.getId();
                    break;
                }
            }
        }

        Long grdId = request.getGradeId();
        if (grdId == null && request.getGradeCode() != null) {
            for (var g : gradeRepository.findAll()) {
                if (g.getCode() != null && g.getCode().equalsIgnoreCase(request.getGradeCode().trim())) {
                    grdId = g.getId();
                    break;
                }
            }
        }

        BigDecimal log = BigDecimal.ZERO;
        BigDecimal trp = BigDecimal.ZERO;
        BigDecimal fnc = BigDecimal.ZERO;
        BigDecimal cai = BigDecimal.ZERO;
        BigDecimal suj = BigDecimal.ZERO;
        BigDecimal cashPoint = BigDecimal.ZERO;
        BigDecimal autres = BigDecimal.ZERO;

        List<SimulationIndemnitesAutoDto.IndemniteDetailDto> details = new ArrayList<>();

        // RECHERCHE DANS POSTGRESQL (ParametrageIndemniteRepository)
        // A. Nomination managériale (Tableau 2)
        boolean hasDbNomination = false;
        try {
            if (fctId != null) {
                List<ParametrageIndemnite> nominationParams = parametrageIndemniteRepository.findNominationByFonction(fctId);
                if (!nominationParams.isEmpty()) {
                    hasDbNomination = true;
                    for (ParametrageIndemnite p : nominationParams) {
                        if (p.getTypeIndemniteObj() == null || p.getTaux() == null || p.getTaux() <= 0) continue;
                        double t = p.getTaux();
                        String tCode = p.getTypeIndemniteObj().getCode() != null ? p.getTypeIndemniteObj().getCode().toUpperCase() : "";
                        String tLib = p.getTypeIndemniteObj().getName() != null ? p.getTypeIndemniteObj().getName() : "Indemnité";

                        if (isLogement(tCode, tLib)) {
                            log = BigDecimal.valueOf(t);
                        } else if (isTransport(tCode, tLib)) {
                            trp = BigDecimal.valueOf(t);
                        } else if (isFonction(tCode, tLib)) {
                            fnc = BigDecimal.valueOf(t);
                        } else {
                            autres = autres.add(BigDecimal.valueOf(t));
                        }
                        details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto(tCode, tLib, t, "FONCTION"));
                    }
                }
            }

            // B. Statutaires (Tableau 1 - si pas de nomination)
            if (!hasDbNomination && (catId != null || grdId != null)) {
                List<ParametrageIndemnite> statutaires = parametrageIndemniteRepository.findStatutairesByGradeAndCategorie(
                        grdId,
                        catId
                );
                for (ParametrageIndemnite p : statutaires) {
                    if (p.getTypeIndemniteObj() == null || p.getTaux() == null || p.getTaux() <= 0) continue;
                    double t = p.getTaux();
                    String tCode = p.getTypeIndemniteObj().getCode() != null ? p.getTypeIndemniteObj().getCode().toUpperCase() : "";
                    String tLib = p.getTypeIndemniteObj().getName() != null ? p.getTypeIndemniteObj().getName() : "Indemnité";

                    if (isLogement(tCode, tLib)) {
                        if (log.compareTo(BigDecimal.ZERO) == 0) {
                            log = BigDecimal.valueOf(t);
                            details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto(tCode, tLib, t, "STATUTAIRE"));
                        }
                    } else if (isTransport(tCode, tLib)) {
                        if (trp.compareTo(BigDecimal.ZERO) == 0) {
                            trp = BigDecimal.valueOf(t);
                            details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto(tCode, tLib, t, "STATUTAIRE"));
                        }
                    } else if (isSujetion(tCode, tLib)) {
                        if (suj.compareTo(BigDecimal.ZERO) == 0) {
                            suj = BigDecimal.valueOf(t);
                            details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto(tCode, tLib, t, "STATUTAIRE"));
                        }
                    } else if (!isFonction(tCode, tLib) && !isCaisse(tCode, tLib) && !isCashPoint(tCode, tLib)) {
                        autres = autres.add(BigDecimal.valueOf(t));
                        details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto(tCode, tLib, t, "STATUTAIRE"));
                    }
                }
            }

            // C. Spécifiques d'emploi ou de fonction (Tableau 3)
            if (empId != null || fctId != null) {
                List<ParametrageIndemnite> specifiques = parametrageIndemniteRepository.findSpecifiqueByEmploiOrFonction(
                        empId != null ? empId : -1L,
                        fctId != null ? fctId : -1L
                );
                for (ParametrageIndemnite p : specifiques) {
                    if (p.getTypeIndemniteObj() == null || p.getTaux() == null || p.getTaux() <= 0) continue;
                    double t = p.getTaux();
                    String tCode = p.getTypeIndemniteObj().getCode() != null ? p.getTypeIndemniteObj().getCode().toUpperCase() : "";
                    String tLib = p.getTypeIndemniteObj().getName() != null ? p.getTypeIndemniteObj().getName() : "Prime spécifique";

                    if (isCaisse(tCode, tLib) && cai.compareTo(BigDecimal.ZERO) == 0) {
                        cai = BigDecimal.valueOf(t);
                        details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto(tCode, tLib, t, "POSTE"));
                    } else if (isCashPoint(tCode, tLib) && cashPoint.compareTo(BigDecimal.ZERO) == 0) {
                        cashPoint = BigDecimal.valueOf(t);
                        details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto(tCode, tLib, t, "POSTE"));
                    } else {
                        autres = autres.add(BigDecimal.valueOf(t));
                        details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto(tCode, tLib, t, "POSTE"));
                    }
                }
            }
        } catch (Exception ignored) {
        }

        // FALLBACK GRILLE CONVENTIONNELLE BPBF OFFICIELLE (si des indemnités n'étaient pas configurées en base)
        // A. Tableau 2 (Nomination managériale) si fonction spécifiée
        boolean nominationAppliquee = false;
        if (nomFonction != null && !nomFonction.isBlank()) {
            String u = nomFonction.toUpperCase();
            if (u.contains("DIRECTEUR GÉNÉRAL")) {
                if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("300000.00");
                if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("150000.00");
                if (fnc.compareTo(BigDecimal.ZERO) == 0) fnc = new BigDecimal("300000.00");
                nominationAppliquee = true;
            } else if (u.contains("DIRECTEUR")) {
                if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("200000.00");
                if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("100000.00");
                if (fnc.compareTo(BigDecimal.ZERO) == 0) fnc = new BigDecimal("150000.00");
                nominationAppliquee = true;
            } else if (u.contains("RESPONSABLE")) {
                if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("150000.00");
                if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("75000.00");
                if (fnc.compareTo(BigDecimal.ZERO) == 0) fnc = new BigDecimal("100000.00");
                nominationAppliquee = true;
            } else if (u.contains("CHEF DE SERVICE")) {
                if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("120000.00");
                if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("75000.00");
                if (fnc.compareTo(BigDecimal.ZERO) == 0) fnc = new BigDecimal("80000.00");
                nominationAppliquee = true;
            } else if (u.contains("CHEF D'AGENCE")) {
                if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("100000.00");
                if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("75000.00");
                if (fnc.compareTo(BigDecimal.ZERO) == 0) fnc = new BigDecimal("75000.00");
                nominationAppliquee = true;
            }
        }

        // B. Tableau 1 (Statutaire Grade/Catégorie) si pas de nomination
        if (!nominationAppliquee && (log.compareTo(BigDecimal.ZERO) == 0 || trp.compareTo(BigDecimal.ZERO) == 0)) {
            switch (catCode) {
                case "1", "2", "3", "4", "5", "6", "7" -> {
                    if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("35000.00");
                    if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("30000.00");
                }
                case "I" -> {
                    if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("45000.00");
                    if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("45000.00");
                    if (suj.compareTo(BigDecimal.ZERO) == 0) suj = new BigDecimal("20000.00");
                }
                case "II" -> {
                    if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("45000.00");
                    if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("45000.00");
                    if (suj.compareTo(BigDecimal.ZERO) == 0) suj = new BigDecimal("30000.00");
                }
                case "III" -> {
                    if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("50000.00");
                    if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("50000.00");
                    if (suj.compareTo(BigDecimal.ZERO) == 0) suj = new BigDecimal("40000.00");
                }
                case "IV" -> {
                    if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("60000.00");
                    if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("50000.00");
                    if (suj.compareTo(BigDecimal.ZERO) == 0) suj = new BigDecimal("50000.00");
                }
                case "V" -> {
                    if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("90000.00");
                    if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("60000.00");
                    if (suj.compareTo(BigDecimal.ZERO) == 0) suj = new BigDecimal("60000.00");
                }
                case "VI" -> {
                    if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("100000.00");
                    if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("75000.00");
                    if (suj.compareTo(BigDecimal.ZERO) == 0) suj = new BigDecimal("60000.00");
                }
                case "VII" -> {
                    if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("110000.00");
                    if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("80000.00");
                    if (suj.compareTo(BigDecimal.ZERO) == 0) suj = new BigDecimal("70000.00");
                }
                case "VIII" -> {
                    if (log.compareTo(BigDecimal.ZERO) == 0) log = new BigDecimal("150000.00");
                    if (trp.compareTo(BigDecimal.ZERO) == 0) trp = new BigDecimal("100000.00");
                    if (suj.compareTo(BigDecimal.ZERO) == 0) suj = new BigDecimal("80000.00");
                }
            }
        }

        // C. Tableau 3 (Primes spécifiques d'emploi - convention)
        if (nomEmploi != null && !nomEmploi.isBlank()) {
            String u = nomEmploi.toUpperCase();
            if (u.contains("CASH POINT") || u.contains("GESTIONNAIRE CASH")) {
                if (cai.compareTo(BigDecimal.ZERO) == 0) cai = new BigDecimal("25000.00");
                if (cashPoint.compareTo(BigDecimal.ZERO) == 0) cashPoint = new BigDecimal("50000.00");
            } else if (u.contains("CAISSIER PRINCIPAL")) {
                if (cai.compareTo(BigDecimal.ZERO) == 0) cai = new BigDecimal("40000.00");
            } else if (u.contains("CAISSIER") || u.contains("GUICHETIER") || u.contains("CAISSE")) {
                if (cai.compareTo(BigDecimal.ZERO) == 0) cai = new BigDecimal("25000.00");
            } else if (u.contains("CHAUFFEUR")) {
                if (autres.compareTo(BigDecimal.ZERO) == 0) autres = new BigDecimal("15000.00");
            } else if (u.contains("ASSISTANTE DE DIRECTION")) {
                if (autres.compareTo(BigDecimal.ZERO) == 0) autres = new BigDecimal("30000.00");
            } else if (u.contains("LIAISON")) {
                if (autres.compareTo(BigDecimal.ZERO) == 0) autres = new BigDecimal("15000.00");
            }
        }

        // D. Prise en compte des avantages en nature
        if (Boolean.TRUE.equals(request.getVehiculeFourni())) trp = BigDecimal.ZERO;
        if (Boolean.TRUE.equals(request.getLogementFourni())) log = BigDecimal.ZERO;

        BigDecimal total = log.add(trp).add(fnc).add(cai).add(suj).add(cashPoint).add(autres);

        // Reconstituer la liste propre des détails pour l'UI
        details.clear();
        if (log.compareTo(BigDecimal.ZERO) > 0) {
            details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto("IND_LOG", "Indemnité de Logement", log.doubleValue(), nominationAppliquee ? "FONCTION" : "STATUTAIRE"));
        }
        if (trp.compareTo(BigDecimal.ZERO) > 0) {
            details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto("IND_TRP", "Indemnité de Transport", trp.doubleValue(), nominationAppliquee ? "FONCTION" : "STATUTAIRE"));
        }
        if (suj.compareTo(BigDecimal.ZERO) > 0) {
            details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto("IND_SUJ", "Indemnité de Sujétion", suj.doubleValue(), "STATUTAIRE"));
        }
        if (fnc.compareTo(BigDecimal.ZERO) > 0) {
            details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto("IND_FNC", "Indemnité de Fonction", fnc.doubleValue(), "FONCTION"));
        }
        if (cai.compareTo(BigDecimal.ZERO) > 0) {
            details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto("IND_CAI", "Indemnité de Caisse", cai.doubleValue(), "POSTE"));
        }
        if (cashPoint.compareTo(BigDecimal.ZERO) > 0) {
            details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto("IND_CASH", "Prime Cash Point", cashPoint.doubleValue(), "POSTE"));
        }
        if (autres.compareTo(BigDecimal.ZERO) > 0) {
            details.add(new SimulationIndemnitesAutoDto.IndemniteDetailDto("IND_AUTRES", "Autres Indemnités spécifiques", autres.doubleValue(), "CONVENTION"));
        }

        return SimulationIndemnitesAutoDto.builder()
                .indemniteLogement(log.doubleValue())
                .indemniteTransport(trp.doubleValue())
                .indemniteFonction(fnc.doubleValue())
                .indemniteCaisse(cai.doubleValue())
                .indemniteSujetion(suj.doubleValue())
                .indemniteCashPoint(cashPoint.doubleValue())
                .autresIndemnites(autres.doubleValue())
                .totalIndemnites(total.doubleValue())
                .details(details)
                .build();
    }

    private boolean isLogement(String code, String lib) {
        String c = (code + " " + lib).toUpperCase();
        return c.contains("LOG") || c.contains("MAISON") || c.contains("HABITAT");
    }

    private boolean isTransport(String code, String lib) {
        String c = (code + " " + lib).toUpperCase();
        return c.contains("TRP") || c.contains("TRANS") || c.contains("DEPLAC");
    }

    private boolean isFonction(String code, String lib) {
        String c = (code + " " + lib).toUpperCase();
        return c.contains("FNC") || c.contains("FONCT") || c.contains("RESP");
    }

    private boolean isCaisse(String code, String lib) {
        String c = (code + " " + lib).toUpperCase();
        return c.contains("CAI") || c.contains("GUICHET");
    }

    private boolean isSujetion(String code, String lib) {
        String c = (code + " " + lib).toUpperCase();
        return c.contains("SUJ");
    }

    private boolean isCashPoint(String code, String lib) {
        String c = (code + " " + lib).toUpperCase();
        return c.contains("CASH");
    }

    public SimulationResultDto simuler(SimulationRequestDto request) {
        if (request == null) {
            request = new SimulationRequestDto();
        }

        // 1. Résolution de l'Emploi (Poste)
        String nomEmploi = request.getEmploiNom();
        if (request.getEmploiId() != null) {
            var empOpt = emploiRepository.findById(request.getEmploiId());
            if (empOpt.isPresent()) {
                nomEmploi = empOpt.get().getName();
                request.setEmploiNom(nomEmploi);
            }
        }

        // 2. Résolution de la Fonction de nomination
        String nomFonction = request.getFonctionNom();
        if (request.getFonctionId() != null) {
            var fctOpt = fonctionRepository.findById(request.getFonctionId());
            if (fctOpt.isPresent()) {
                nomFonction = fctOpt.get().getName();
                request.setFonctionNom(nomFonction);
            }
        }

        BigDecimal salaireBase = determinerSalaireBase(request);
        int charges = request.getNombrePersonnesCharge() != null ? Math.max(0, request.getNombrePersonnesCharge()) : 0;

        // Détermination automatique des indemnités conventionnelles
        SimulationIndemnitesAutoDto auto = determinerIndemnitesConventionnelles(request);

        // Si l'utilisateur n'a pas explicitement saisi une valeur positive, on prend la valeur conventionnelle auto-déduite
        BigDecimal indemLogement = (request.getIndemniteLogement() != null && request.getIndemniteLogement() > 0)
                ? BigDecimal.valueOf(request.getIndemniteLogement())
                : BigDecimal.valueOf(auto.getIndemniteLogement() != null ? auto.getIndemniteLogement() : 0.0);

        BigDecimal indemTransport = (request.getIndemniteTransport() != null && request.getIndemniteTransport() > 0)
                ? BigDecimal.valueOf(request.getIndemniteTransport())
                : BigDecimal.valueOf(auto.getIndemniteTransport() != null ? auto.getIndemniteTransport() : 0.0);

        BigDecimal indemFonction = (request.getIndemniteFonction() != null && request.getIndemniteFonction() > 0)
                ? BigDecimal.valueOf(request.getIndemniteFonction())
                : BigDecimal.valueOf(auto.getIndemniteFonction() != null ? auto.getIndemniteFonction() : 0.0);

        BigDecimal indemCaisse = (request.getIndemniteCaisse() != null && request.getIndemniteCaisse() > 0)
                ? BigDecimal.valueOf(request.getIndemniteCaisse())
                : BigDecimal.valueOf(auto.getIndemniteCaisse() != null ? auto.getIndemniteCaisse() : 0.0);

        BigDecimal autresIndem = (request.getAutresIndemnites() != null && request.getAutresIndemnites() > 0)
                ? BigDecimal.valueOf(request.getAutresIndemnites())
                : BigDecimal.valueOf(auto.getAutresIndemnites() != null ? auto.getAutresIndemnites() : 0.0);

        // Prise en compte des avantages en nature
        if (Boolean.TRUE.equals(request.getVehiculeFourni())) indemTransport = BigDecimal.ZERO;
        if (Boolean.TRUE.equals(request.getLogementFourni())) indemLogement = BigDecimal.ZERO;

        BigDecimal sujVal = (request.getIndemniteSujetion() != null && request.getIndemniteSujetion() > 0)
                ? BigDecimal.valueOf(request.getIndemniteSujetion())
                : BigDecimal.valueOf(auto.getIndemniteSujetion() != null ? auto.getIndemniteSujetion() : 0.0);

        BigDecimal cashVal = (request.getIndemniteCashPoint() != null && request.getIndemniteCashPoint() > 0)
                ? BigDecimal.valueOf(request.getIndemniteCashPoint())
                : BigDecimal.valueOf(auto.getIndemniteCashPoint() != null ? auto.getIndemniteCashPoint() : 0.0);

        String mode = request.getMode() != null ? request.getMode().trim().toUpperCase() : "SURSALAIRE_VERS_NET";

        if ("NET_VERS_SURSALAIRE".equals(mode)) {
            BigDecimal netCible = request.getNetCibleSouhaite() != null 
                    ? BigDecimal.valueOf(request.getNetCibleSouhaite()) : BigDecimal.ZERO;
            
            // Résolution inverse : recherche du sursalaire exact
            BigDecimal surSalaireCalcule = resoudreSurSalairePourNetCible(
                    netCible, salaireBase, charges, indemLogement, indemTransport, indemFonction, indemCaisse, autresIndem,
                    sujVal, cashVal, auto.getDetails(),
                    request.getEmploiId(), nomEmploi, request.getFonctionId(), nomFonction
            );

            SimulationResultDto result = calculerSimulationDirecte(
                    surSalaireCalcule, salaireBase, charges, indemLogement, indemTransport, indemFonction, indemCaisse, autresIndem,
                    sujVal, cashVal, auto.getDetails(),
                    request.getEmploiId(), nomEmploi, request.getFonctionId(), nomFonction
            );
            result.setMode("NET_VERS_SURSALAIRE");
            result.setNetCibleSouhaite(netCible.doubleValue());
            result.setEcartNetCible(result.getSalaireNet() - netCible.doubleValue());

            if (surSalaireCalcule.compareTo(BigDecimal.ZERO) == 0 && result.getSalaireNet() > netCible.doubleValue()) {
                result.setMessage(String.format(
                        "Le salaire conventionnel minimum de la grille (%s FCFA Net) dépasse déjà la prétention du candidat (%s FCFA Net). Aucun sursalaire n'est requis.",
                        formatFcfa(result.getSalaireNet()), formatFcfa(netCible.doubleValue())
                ));
                result.setStatutSimulation("CONVENTION_SUGISANTE");
            } else {
                result.setMessage(String.format(
                        "Pour garantir un salaire net de %s FCFA, le sursalaire mensuel brut à proposer est de %s FCFA.",
                        formatFcfa(netCible.doubleValue()), formatFcfa(result.getSurSalaire())
                ));
                result.setStatutSimulation("SURSALAIRE_DETERMINE");
            }
            return result;
        } else {
            // Mode direct : Sursalaire -> Net
            BigDecimal surSalaire = request.getSurSalairePropose() != null 
                    ? BigDecimal.valueOf(request.getSurSalairePropose()) : BigDecimal.ZERO;

            SimulationResultDto result = calculerSimulationDirecte(
                    surSalaire, salaireBase, charges, indemLogement, indemTransport, indemFonction, indemCaisse, autresIndem,
                    sujVal, cashVal, auto.getDetails(),
                    request.getEmploiId(), nomEmploi, request.getFonctionId(), nomFonction
            );
            result.setMode("SURSALAIRE_VERS_NET");
            result.setMessage(String.format(
                    "Simulation effectuée avec un sursalaire de %s FCFA. Salaire net prévisionnel à payer : %s FCFA.",
                    formatFcfa(surSalaire.doubleValue()), formatFcfa(result.getSalaireNet())
            ));
            result.setStatutSimulation("CALCUL_DIRECT_EFFECTUE");
            return result;
        }
    }

    /**
     * Résolution exacte par recherche dichotomique du sursalaire pour atteindre le net cible.
     */
    private BigDecimal resoudreSurSalairePourNetCible(
            BigDecimal netCible, BigDecimal salaireBase, int charges,
            BigDecimal log, BigDecimal trp, BigDecimal fnc, BigDecimal cai, BigDecimal aut,
            BigDecimal suj, BigDecimal cash, List<SimulationIndemnitesAutoDto.IndemniteDetailDto> details,
            Long emploiId, String nomEmploi, Long fonctionId, String nomFonction) {

        if (netCible.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        // Test avec sursalaire = 0
        SimulationResultDto testZero = calculerSimulationDirecte(
                BigDecimal.ZERO, salaireBase, charges, log, trp, fnc, cai, aut,
                suj, cash, details,
                emploiId, nomEmploi, fonctionId, nomFonction
        );
        if (BigDecimal.valueOf(testZero.getSalaireNet()).compareTo(netCible) >= 0) {
            return BigDecimal.ZERO;
        }

        // Intervalle de recherche : de 0 à un majorant réaliste
        double delta = netCible.doubleValue() - testZero.getSalaireNet();
        double low = 0.0;
        double high = Math.max(delta * 2.2, 500000.0);

        // Assurer que 'high' produit un net >= netCible
        while (high < 30000000.0) {
            SimulationResultDto testHigh = calculerSimulationDirecte(
                    BigDecimal.valueOf(high), salaireBase, charges, log, trp, fnc, cai, aut,
                    suj, cash, details,
                    emploiId, nomEmploi, fonctionId, nomFonction
            );
            if (testHigh.getSalaireNet() >= netCible.doubleValue()) {
                break;
            }
            high *= 1.5;
        }

        // Recherche dichotomique à l'entier près (précision 1 FCFA)
        for (int i = 0; i < 40; i++) {
            double mid = Math.round((low + high) / 2.0);
            SimulationResultDto res = calculerSimulationDirecte(
                    BigDecimal.valueOf(mid), salaireBase, charges, log, trp, fnc, cai, aut,
                    suj, cash, details,
                    emploiId, nomEmploi, fonctionId, nomFonction
            );

            if (Math.abs(res.getSalaireNet() - netCible.doubleValue()) < 0.5) {
                return BigDecimal.valueOf(mid);
            }

            if (res.getSalaireNet() < netCible.doubleValue()) {
                low = mid;
            } else {
                high = mid;
            }

            if (high - low <= 1.0) {
                break;
            }
        }

        // Retenir la valeur haute pour garantir net >= netCible
        double finalSs = Math.ceil(high);
        return BigDecimal.valueOf(finalSs);
    }

    public SimulationResultDto calculerSimulationDirecte(
            BigDecimal surSalaire, BigDecimal salaireBase, int charges,
            BigDecimal log, BigDecimal trp, BigDecimal fnc, BigDecimal cai, BigDecimal aut) {
        return calculerSimulationDirecte(surSalaire, salaireBase, charges, log, trp, fnc, cai, aut, BigDecimal.ZERO, BigDecimal.ZERO, null, null, null, null, null);
    }

    /**
     * Moteur de calcul direct de simulation (fidèle à InformationSalarialeCalculService et au CGI Burkina Faso)
     */
    public SimulationResultDto calculerSimulationDirecte(
            BigDecimal surSalaire, BigDecimal salaireBase, int charges,
            BigDecimal log, BigDecimal trp, BigDecimal fnc, BigDecimal cai, BigDecimal aut,
            BigDecimal suj, BigDecimal cashPoint, List<SimulationIndemnitesAutoDto.IndemniteDetailDto> details,
            Long emploiId, String nomEmploi, Long fonctionId, String nomFonction) {

        BigDecimal sVal = suj != null ? suj : BigDecimal.ZERO;
        BigDecimal cpVal = cashPoint != null ? cashPoint : BigDecimal.ZERO;
        BigDecimal aVal = aut != null ? aut : BigDecimal.ZERO;
        BigDecimal totalIndem = log.add(trp).add(fnc).add(cai).add(sVal).add(cpVal).add(aVal);
        BigDecimal remunerationBrute = salaireBase.add(surSalaire).add(totalIndem);

        // 1. Cotisation CNSS Salarié (5.5% plafonné à 800 000 FCFA)
        BigDecimal baseCnss = remunerationBrute.min(PLAFOND_CNSS);
        BigDecimal cotisCnss = baseCnss.multiply(TAUX_CNSS_SALARIE).divide(CENT, 2, RoundingMode.HALF_UP);
        BigDecimal brutApresCnss = remunerationBrute.subtract(cotisCnss).max(BigDecimal.ZERO);

        // 2. Exonérations fiscales légales (CGI Burkina Faso)
        // Logement : max 20% du salaire brut total (Base + Sursalaire + Indemnités), plafond 75 000 FCFA
        BigDecimal limiteLogement = remunerationBrute.multiply(new BigDecimal("0.20")).min(new BigDecimal("75000.00"));
        BigDecimal exoLogement = log.min(limiteLogement);

        // Transport : max 5% du salaire brut total (Base + Sursalaire + Indemnités), plafond 30 000 FCFA
        BigDecimal limiteTransport = remunerationBrute.multiply(new BigDecimal("0.05")).min(new BigDecimal("30000.00"));
        BigDecimal exoTransport = trp.min(limiteTransport);

        // Fonction / Caisse : 5% du salaire brut total, plafond 50 000 FCFA
        BigDecimal totalFonctionnel = fnc.add(cai);
        BigDecimal limiteFonction = remunerationBrute.multiply(new BigDecimal("0.05")).min(new BigDecimal("50000.00"));
        BigDecimal exoFonction = totalFonctionnel.min(limiteFonction);

        BigDecimal totalExonerations = exoLogement.add(exoTransport).add(exoFonction);

        // 3. Abattement forfaitaire légal (20% du brut après CNSS plafonné à 75 000 FCFA)
        BigDecimal abattementForfaitaire = brutApresCnss.multiply(new BigDecimal("0.20"))
                .min(PLAFOND_ABATTEMENT);

        // 4. Base imposable IUTS
        BigDecimal baseImposableReelle = brutApresCnss.subtract(totalExonerations)
                .subtract(abattementForfaitaire).max(BigDecimal.ZERO);

        // Troncature à la centaine inférieure
        BigDecimal baseIutsTronquee = baseImposableReelle.divideToIntegralValue(CENT).multiply(CENT);

        // 5. Calcul IUTS progressif
        BigDecimal iutsBrut = calculerIutsProgressif(baseIutsTronquee);

        // 6. Réduction pour charges de famille
        BigDecimal tauxReduction = reductionRate(charges);
        BigDecimal reductionCharges = iutsBrut.multiply(tauxReduction).divide(CENT, 0, RoundingMode.HALF_UP);
        BigDecimal iutsNet = iutsBrut.subtract(reductionCharges).max(BigDecimal.ZERO);

        // Arrondis finaux FCFA
        BigDecimal cotisCnssArrondi = cotisCnss.setScale(0, RoundingMode.CEILING);
        BigDecimal iutsNetArrondi = iutsNet.setScale(0, RoundingMode.CEILING);
        BigDecimal totalRetenues = cotisCnssArrondi.add(iutsNetArrondi);
        BigDecimal salaireNet = remunerationBrute.setScale(0, RoundingMode.CEILING).subtract(totalRetenues);

        // 7. Charges patronales estimées (CNSS 16% plafonnée)
        BigDecimal cotisPatronale = baseCnss.multiply(TAUX_CNSS_PATRONAL).divide(CENT, 0, RoundingMode.HALF_UP);
        BigDecimal coutTotal = remunerationBrute.setScale(0, RoundingMode.CEILING).add(cotisPatronale);

        // 8. Génération des lignes de ventilation pour la fiche récapitulative
        List<LigneSimulationDto> lignes = new ArrayList<>();
        lignes.add(new LigneSimulationDto("SB", "Salaire de base (Grille)", "GAIN", salaireBase.doubleValue(), null, salaireBase.doubleValue(), 0.0));
        if (surSalaire.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneSimulationDto("SS", "Sursalaire proposé", "GAIN", surSalaire.doubleValue(), null, surSalaire.doubleValue(), 0.0));
        }
        if (log.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneSimulationDto("IND_LOG", "Indemnité de logement", "GAIN", log.doubleValue(), null, log.doubleValue(), 0.0));
        }
        if (trp.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneSimulationDto("IND_TRP", "Indemnité de transport", "GAIN", trp.doubleValue(), null, trp.doubleValue(), 0.0));
        }
        if (sVal.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneSimulationDto("IND_SUJ", "Indemnité de sujétion (Statutaire)", "GAIN", sVal.doubleValue(), null, sVal.doubleValue(), 0.0));
        }
        if (fnc.compareTo(BigDecimal.ZERO) > 0) {
            String labelFnc = (nomFonction != null && !nomFonction.isBlank())
                    ? "Indemnité de fonction (" + nomFonction + ")"
                    : "Indemnité de fonction";
            lignes.add(new LigneSimulationDto("IND_FNC", labelFnc, "GAIN", fnc.doubleValue(), null, fnc.doubleValue(), 0.0));
        }
        if (cai.compareTo(BigDecimal.ZERO) > 0) {
            String labelCai = (nomEmploi != null && !nomEmploi.isBlank())
                    ? "Indemnité de caisse (" + nomEmploi + ")"
                    : "Indemnité de caisse";
            lignes.add(new LigneSimulationDto("IND_CAI", labelCai, "GAIN", cai.doubleValue(), null, cai.doubleValue(), 0.0));
        }
        if (cpVal.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneSimulationDto("IND_CASH", "Prime Cash Point", "GAIN", cpVal.doubleValue(), null, cpVal.doubleValue(), 0.0));
        }
        if (aVal.compareTo(BigDecimal.ZERO) > 0) {
            lignes.add(new LigneSimulationDto("IND_AUT", "Autres indemnités spécifiques", "GAIN", aVal.doubleValue(), null, aVal.doubleValue(), 0.0));
        }

        // Retenues salariales
        lignes.add(new LigneSimulationDto("CNSS_SAL", "Cotisation CNSS (Salariale 5.5%)", "RETENUE_SALARIALE", baseCnss.doubleValue(), 5.5, 0.0, cotisCnssArrondi.doubleValue()));
        lignes.add(new LigneSimulationDto("IUTS_NET", "Impôt IUTS (après " + charges + " chg / -" + tauxReduction + "%)", "RETENUE_SALARIALE", baseIutsTronquee.doubleValue(), null, 0.0, iutsNetArrondi.doubleValue()));

        // Charge patronale
        lignes.add(new LigneSimulationDto("CNSS_PAT", "Cotisation CNSS Patronale (16%)", "RETENUE_PATRONALE", baseCnss.doubleValue(), 16.0, 0.0, cotisPatronale.doubleValue()));

        return SimulationResultDto.builder()
                .emploiId(emploiId)
                .emploiNom(nomEmploi)
                .fonctionId(fonctionId)
                .fonctionNom(nomFonction)
                .salaireBase(salaireBase.doubleValue())
                .surSalaire(surSalaire.doubleValue())
                .totalIndemnites(totalIndem.doubleValue())
                .indemniteLogement(log.doubleValue())
                .indemniteTransport(trp.doubleValue())
                .indemniteFonction(fnc.doubleValue())
                .indemniteCaisse(cai.doubleValue())
                .indemniteSujetion(sVal.doubleValue())
                .indemniteCashPoint(cpVal.doubleValue())
                .autresIndemnites(aVal.doubleValue())
                .detailsIndemnites(details)
                .remunerationBrute(remunerationBrute.doubleValue())
                .baseCnss(baseCnss.doubleValue())
                .tauxCnssSalarial(5.5)
                .cotisationCnss(cotisCnssArrondi.doubleValue())
                .brutApresCnss(brutApresCnss.doubleValue())
                .totalExonerations(totalExonerations.doubleValue())
                .abattementForfaitaire(abattementForfaitaire.doubleValue())
                .baseImposableIuts(baseIutsTronquee.doubleValue())
                .iutsBrut(iutsBrut.setScale(0, RoundingMode.CEILING).doubleValue())
                .nombrePersonnesCharge(charges)
                .tauxReductionCharges(tauxReduction.doubleValue())
                .reductionIutsCharges(reductionCharges.doubleValue())
                .iutsNet(iutsNetArrondi.doubleValue())
                .totalRetenuesSalariales(totalRetenues.doubleValue())
                .salaireNet(salaireNet.doubleValue())
                .cotisationCnssPatronale(cotisPatronale.doubleValue())
                .totalChargesPatronales(cotisPatronale.doubleValue())
                .coutTotalEmployeur(coutTotal.doubleValue())
                .lignesDetails(lignes)
                .build();
    }

    private BigDecimal determinerSalaireBase(SimulationRequestDto req) {
        if (req.getSalaireBaseManuel() != null && req.getSalaireBaseManuel() > 0) {
            return BigDecimal.valueOf(req.getSalaireBaseManuel());
        }

        // Recherche en base via GrilleSalarialeService
        try {
            GrilleSalarialeDto grille = grilleSalarialeService.findGrille(
                    req.getGradeId(), req.getCategorieId(), req.getEchelonId(),
                    req.getGradeCode(), req.getCategorieCode(), req.getEchelonCode()
            );
            if (grille != null && grille.getBasicSalary() != null && grille.getBasicSalary().compareTo(BigDecimal.ZERO) > 0) {
                return grille.getBasicSalary();
            }
        } catch (Exception ignored) {}

        // Fallback sécurisé : Grille officielle BPBF
        String rawCat = req.getCategorieCode() != null ? req.getCategorieCode().trim().toUpperCase() : "1";
        String catFormatted = GrilleSalariale.formatCategoryCode(rawCat);
        String cleanCat = rawCat.replace("CATEGORIE", "").replace("CLASSE", "").trim();

        int ech = 1;
        if (req.getEchelonCode() != null) {
            try {
                ech = Integer.parseInt(req.getEchelonCode().replaceAll("\\D+", ""));
            } catch (Exception ignored) {}
        }

        int[] echelons = GRILLE_BPBF_OFFICIELLE.get(rawCat);
        if (echelons == null) echelons = GRILLE_BPBF_OFFICIELLE.get(cleanCat);
        if (echelons == null) echelons = GRILLE_BPBF_OFFICIELLE.get(catFormatted);

        if (echelons != null && ech >= 1 && ech < echelons.length) {
            return BigDecimal.valueOf(echelons[ech]);
        }

        return new BigDecimal("95945.00"); // 1ère Catégorie, Échelon 1 par défaut
    }

    private BigDecimal calculerIutsProgressif(BigDecimal base) {
        if (base == null || base.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;
        BigDecimal result;
        if (base.compareTo(new BigDecimal("250000")) > 0) {
            result = new BigDecimal("39430").add(base.subtract(new BigDecimal("250000")).multiply(new BigDecimal("0.25")));
        } else if (base.compareTo(new BigDecimal("170000")) > 0) {
            result = new BigDecimal("22070").add(base.subtract(new BigDecimal("170000")).multiply(new BigDecimal("0.217")));
        } else if (base.compareTo(new BigDecimal("120000")) > 0) {
            result = new BigDecimal("12870").add(base.subtract(new BigDecimal("120000")).multiply(new BigDecimal("0.184")));
        } else if (base.compareTo(new BigDecimal("80000")) > 0) {
            result = new BigDecimal("6590").add(base.subtract(new BigDecimal("80000")).multiply(new BigDecimal("0.157")));
        } else if (base.compareTo(new BigDecimal("50000")) > 0) {
            result = new BigDecimal("2420").add(base.subtract(new BigDecimal("50000")).multiply(new BigDecimal("0.139")));
        } else if (base.compareTo(new BigDecimal("30000")) > 0) {
            result = base.subtract(new BigDecimal("30000")).multiply(new BigDecimal("0.121"));
        } else {
            result = BigDecimal.ZERO;
        }
        return result;
    }

    private BigDecimal reductionRate(int charges) {
        if (charges == 1) return new BigDecimal("8.00");
        if (charges == 2) return new BigDecimal("10.00");
        if (charges == 3) return new BigDecimal("12.00");
        if (charges >= 4) return new BigDecimal("14.00");
        return BigDecimal.ZERO;
    }

    private String formatFcfa(Double val) {
        if (val == null) return "0";
        return String.format(java.util.Locale.FRANCE, "%,.0f", val).replace('\u00A0', ' ');
    }
}
