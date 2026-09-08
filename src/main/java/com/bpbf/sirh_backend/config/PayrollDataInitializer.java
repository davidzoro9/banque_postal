package com.bpbf.sirh_backend.config;

import com.bpbf.sirh_backend.entities.SalaryCategory;
import com.bpbf.sirh_backend.entities.SalaryElement;
import com.bpbf.sirh_backend.repositories.SalaryCategoryRepository;
import com.bpbf.sirh_backend.repositories.SalaryElementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@Order(10)
@RequiredArgsConstructor
@Slf4j
public class PayrollDataInitializer implements CommandLineRunner {

    private final SalaryCategoryRepository categoryRepository;
    private final SalaryElementRepository elementRepository;
    private final com.bpbf.sirh_backend.repositories.TypeAbsenceCongeRepository typeAbsenceCongeRepository;
    private final com.bpbf.sirh_backend.repositories.JourFerieRepository jourFerieRepository;
    private final com.bpbf.sirh_backend.repositories.EmployeeRepository employeeRepository;
    private final com.bpbf.sirh_backend.services.EmployeeService employeeService;
    private final com.bpbf.sirh_backend.repositories.BaremeIUTSRepository baremeIutsRepository;
    private final com.bpbf.sirh_backend.repositories.TypeRetenueRepository typeRetenueRepository;
    private final com.bpbf.sirh_backend.repositories.RetenueRepository retenueRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("Initialisation sécurisée des données de référence (Paie, Congés, Fériés, Retenues, IUTS)...");

        // Réparation automatique des séquences ID PostgreSQL
        String[] tables = {"type_absence_conge", "conge", "absence", "jour_ferie", "parametrage_conge", "bareme_iuts", "type_retenue", "retenue", "role_profil", "action_permission"};
        for (String tbl : tables) {
            try {
                jdbcTemplate.execute("CREATE SEQUENCE IF NOT EXISTS " + tbl + "_id_seq");
                jdbcTemplate.execute("ALTER TABLE " + tbl + " ALTER COLUMN id SET DEFAULT nextval('" + tbl + "_id_seq')");
                jdbcTemplate.execute("SELECT setval('" + tbl + "_id_seq', COALESCE((SELECT MAX(id) FROM " + tbl + "), 0) + 1, false)");
            } catch (Exception e) {
                log.debug("Auto-réparation séquence {} (non bloquant): {}", tbl, e.getMessage());
            }
        }

        try {
            seedPayrollAndConges();
        } catch (Exception e) {
            log.warn("Erreur mineure initialisation des données: {}", e.getMessage());
        }
    }

    private void seedPayrollAndConges() {
        // 1. Les 10 Catégories officielles (Genres)
        SalaryCategory catRemuDue = getOrCreateCategory("CAT_REMU_DUE", "Rémunération due");
        SalaryCategory catSalBase = getOrCreateCategory("CAT_SAL_BASE", "Salaire de base");
        SalaryCategory catIndem = getOrCreateCategory("CAT_INDEMNITES", "Indemnités");
        SalaryCategory catPrimes = getOrCreateCategory("CAT_PRIMES", "Primes");
        SalaryCategory catCotisSoc = getOrCreateCategory("CAT_COTIS_SOC", "Cotisation sécurité sociale");
        SalaryCategory catIuts = getOrCreateCategory("CAT_IUTS", "IUTS");
        SalaryCategory catRetenues = getOrCreateCategory("CAT_RETENUES", "Retenue");
        SalaryCategory catChgPat = getOrCreateCategory("CAT_CHG_PATRONALES", "Charges patronales");
        SalaryCategory catCotisPat = getOrCreateCategory("CAT_COTIS_PATRONALES", "Cotisations patronales");
        SalaryCategory catCotisNonRev = getOrCreateCategory("CAT_COTIS_NON_REV", "Cotisations non reversées");

        // 2. Éléments de Salaire (Types)
        // Rémunération due
        getOrCreateElement("REM_DUE_NET", "Rémunération due (Net à payer viré)", catRemuDue, null, false, false, "FORMULE", "NET_A_PAYER", 1);

        // Salaire de base
        getOrCreateElement("SAL_MENSUEL", "Salaire mensuel", catSalBase, null, true, true, "GRILLE", "GRILLE_ECHELON", 2);
        getOrCreateElement("HEURE_SUP", "Heure supplémentaire", catSalBase, null, true, true, "FORMULE", "HEURES_SUP_130_150", 3);
        getOrCreateElement("SURSALAIRE", "Sursalaire", catSalBase, null, true, true, "MONTANT_FIXE", "0", 4);
        getOrCreateElement("RAPPEL_SALAIRE", "Rappel salaire", catSalBase, null, true, true, "MONTANT_FIXE", "0", 5);
        getOrCreateElement("CONGE_PAYE", "Congé payé", catSalBase, null, true, true, "FORMULE", "CALCUL_CONGE", 6);
        getOrCreateElement("REMU_HEURE", "Rémunération à l'heure", catSalBase, null, true, true, "FORMULE", "TAUX_HORAIRE * HEURES", 7);
        getOrCreateElement("REMU_JOUR", "Rémunération journalière", catSalBase, null, true, true, "FORMULE", "TAUX_JOUR * JOURS", 8);
        getOrCreateElement("AUTRE_SALAIRE", "Autre salaire", catSalBase, null, true, true, "MONTANT_FIXE", "0", 9);

        // Indemnités
        getOrCreateElement("INDEM_FONCTION", "Indemnité de fonction", catIndem, null, true, true, "MONTANT_FIXE", "0", 10);
        getOrCreateElement("INDEM_TRANSPORT", "Indemnité de transport", catIndem, null, false, false, "MONTANT_FIXE", "30000", 11);
        getOrCreateElement("INDEM_LOGEMENT", "Indemnité de logement", catIndem, null, false, false, "MONTANT_FIXE", "65000", 12);
        getOrCreateElement("INDEM_AUTRE", "Autre indemnité", catIndem, null, true, true, "MONTANT_FIXE", "0", 13);

        // Primes
        getOrCreateElement("PRIME_ANC", "Prime d'ancienneté", catPrimes, null, true, true, "FORMULE", "ANCIENNETE_ECHELON", 14);
        getOrCreateElement("PRIME_GRATIF", "Gratification", catPrimes, null, true, true, "MONTANT_FIXE", "0", 15);
        getOrCreateElement("PRIME_PROD", "Prime de productivité", catPrimes, null, true, true, "MONTANT_FIXE", "0", 16);
        getOrCreateElement("ALLOC_FAMILIALE", "Allocations familiales", catPrimes, null, false, false, "MONTANT_FIXE", "2000", 17);
        getOrCreateElement("AUTRE_PRIME", "Autre prime", catPrimes, null, true, true, "MONTANT_FIXE", "0", 18);

        // Cotisation sécurité sociale
        getOrCreateElement("COTIS_CNSS", "Cotisation CNSS (Salariale)", catCotisSoc, new BigDecimal("5.50"), false, false, "POURCENTAGE", "BRUT_COTISABLE * 0.055", 19);
        getOrCreateElement("COTIS_CARFO", "Cotisation CARFO (Salariale)", catCotisSoc, new BigDecimal("8.00"), false, false, "POURCENTAGE", "BASE_INDICE * 0.08", 20);
        getOrCreateElement("REGUL_CNSS", "Régularisation CNSS", catCotisSoc, null, false, false, "MONTANT_FIXE", "0", 21);
        getOrCreateElement("REGUL_CARFO", "Régularisation CARFO", catCotisSoc, null, false, false, "MONTANT_FIXE", "0", 22);

        // IUTS
        getOrCreateElement("RETENUE_IUTS", "Retenue IUTS", catIuts, null, false, false, "FORMULE", "BAREME_PROGRESSIF_BF", 23);
        getOrCreateElement("REGUL_IUTS", "Régularisation IUTS", catIuts, null, false, false, "MONTANT_FIXE", "0", 24);

        // Retenues & Précomptes bancaires individuels
        getOrCreateElement("PRET_EQUIP", "Prêt Équipement & Personnel BPBF", catRetenues, null, false, false, "MONTANT_FIXE", "0", 25);
        getOrCreateElement("AVANCE_SAL", "Avance sur Salaire (Quinzaine / Acompte)", catRetenues, null, false, false, "MONTANT_FIXE", "0", 26);
        getOrCreateElement("PRET_SCOLAIRE", "Prêt Scolarité / Fêtes / Tabaski", catRetenues, null, false, false, "MONTANT_FIXE", "0", 27);
        getOrCreateElement("PRET_VEHICULE", "Prêt Véhicule / Immobilier", catRetenues, null, false, false, "MONTANT_FIXE", "0", 28);
        getOrCreateElement("RET_MUTUELLE", "Cotisation Mutuelle de Santé des Banques", catRetenues, null, false, false, "MONTANT_FIXE", "0", 29);
        getOrCreateElement("RET_ASSURANCE", "Assurance Groupe / Prévoyance", catRetenues, null, false, false, "MONTANT_FIXE", "0", 30);
        getOrCreateElement("SAISIE_ARRET", "Saisie-arrêt sur salaire", catRetenues, null, false, false, "MONTANT_FIXE", "0", 31);
        getOrCreateElement("RET_VIVRES", "Remboursement Vivres & Achats groupés", catRetenues, null, false, false, "MONTANT_FIXE", "0", 32);
        getOrCreateElement("RET_DIVERS", "Autre retenue sur salaire net (Auto-école, UAB...)", catRetenues, null, false, false, "MONTANT_FIXE", "0", 33);
        // Trop-perçus & Régularisations négatives spontanées en 1 fois
        getOrCreateElement("RET_TROP_PERCU_SAL", "Trop-perçu sur salaire de base", catRetenues, null, false, false, "MONTANT_FIXE", "0", 34);
        getOrCreateElement("RET_TROP_PERCU_PRIME", "Trop-perçu sur primes & indemnités", catRetenues, null, false, false, "MONTANT_FIXE", "0", 35);
        getOrCreateElement("RET_TROP_PERCU", "Trop-perçu & Régularisation diverse", catRetenues, null, false, false, "MONTANT_FIXE", "0", 36);

        // Charges patronales
        getOrCreateElement("CHG_PAT_CNSS", "Charges patronales CNSS", catChgPat, new BigDecimal("16.00"), false, false, "POURCENTAGE", "BRUT_COTISABLE * 0.16", 26);
        getOrCreateElement("CHG_PAT_CARFO", "Charges patronales CARFO", catChgPat, new BigDecimal("14.00"), false, false, "POURCENTAGE", "BASE_INDICE * 0.14", 27);
        getOrCreateElement("TPA_BURKINA", "TPA personnel burkinabè", catChgPat, new BigDecimal("3.00"), false, false, "POURCENTAGE", "3.0%", 28);
        getOrCreateElement("TPA_ETRANGER", "TPA personnel étranger", catChgPat, new BigDecimal("4.00"), false, false, "POURCENTAGE", "4.0%", 29);

        // Cotisations patronales
        getOrCreateElement("COT_PAT_CNSS", "Cotisations patronales CNSS", catCotisPat, new BigDecimal("16.00"), false, false, "POURCENTAGE", "16.0%", 30);
        getOrCreateElement("COT_PAT_CARFO", "Cotisations patronales CARFO", catCotisPat, new BigDecimal("14.00"), false, false, "POURCENTAGE", "14.0%", 31);
        getOrCreateElement("TPA_REVERSER", "TPA à reverser (Cumul personnel burkinabè & étranger)", catCotisPat, null, false, false, "FORMULE", "TPA_BURKINA + TPA_ETRANGER", 32);

        // Cotisations non reversées
        getOrCreateElement("COTIS_EMP_NON_REV", "Cotisation employé non reversée", catCotisNonRev, null, false, false, "MONTANT_FIXE", "0", 33);
        // 3. Types officiels de Congés et Absences au Burkina Faso
        getOrCreateTypeAbsence("CONGE_ANNUEL", "Congé annuel payé");
        getOrCreateTypeAbsence("CONGE_MATERNITE", "Congé de maternité");
        getOrCreateTypeAbsence("CONGE_PATERNITE", "Congé de paternité");
        getOrCreateTypeAbsence("CONGE_MALADIE", "Congé de maladie");
        getOrCreateTypeAbsence("EVT_MARIAGE", "Événement familial - Mariage");
        getOrCreateTypeAbsence("EVT_DECES", "Événement familial - Décès");
        getOrCreateTypeAbsence("EVT_NAISSANCE", "Événement familial - Naissance");
        getOrCreateTypeAbsence("ABS_AUTORISEE", "Absence autorisée");
        // 4. Jours Fériés Légaux au Burkina Faso (Article 11.3 des spécifications)
        seedJoursFeries("2026");
        seedJoursFeries("2025");
        seedJoursFeries("2027");

        // 5. Synchronisation automatique des comptes utilisateurs de tous les employés existants
        try {
            if (employeeRepository != null && employeeService != null) {
                employeeRepository.findAll().forEach(emp -> {
                    employeeService.syncUserAccountForEmployee(emp);
                });
                log.info("Comptes utilisateurs des employés synchronisés avec succès.");
            }
        } catch (Exception e) {
            log.warn("Erreur mineure synchronisation comptes utilisateurs employés: {}", e.getMessage());
        }

        // 6. Barème progressif officiel IUTS Burkina Faso
        seedBaremesIuts();

        // 7. Retenues salariales et patronales officielles
        seedRetenues();

        log.info("Les données de base (catégories, éléments, congés, fériés, IUTS, retenues) ont été initialisées avec succès.");
    }

    private void seedBaremesIuts() {
        if (baremeIutsRepository.count() == 0) {
            log.info("Initialisation du barème officiel IUTS Burkina Faso (Circulaire MINEFID N°2020-0432)...");
            saveBareme("IUTS_TR1", 0.0, 30000.0, 0.0, 0.0);
            saveBareme("IUTS_TR2", 30001.0, 50000.0, 10.0, 3000.0);
            saveBareme("IUTS_TR3", 50001.0, 80000.0, 15.0, 5500.0);
            saveBareme("IUTS_TR4", 80001.0, 120000.0, 18.0, 7900.0);
            saveBareme("IUTS_TR5", 120001.0, 170000.0, 21.0, 11500.0);
            saveBareme("IUTS_TR6", 170001.0, 250000.0, 23.0, 14900.0);
            saveBareme("IUTS_TR7", 250001.0, 999999999.0, 25.0, 19900.0);
        }
    }

    private void saveBareme(String code, Double min, Double max, Double taux, Double abattement) {
        com.bpbf.sirh_backend.entities.BaremeIUTS b = new com.bpbf.sirh_backend.entities.BaremeIUTS();
        b.setCodeTranche(code);
        b.setTrancheMin(min);
        b.setTrancheMax(max);
        b.setTauxImposition(taux);
        b.setAbattementForfaitaire(abattement);
        b.setActif(true);
        baremeIutsRepository.save(b);
    }

    private void seedRetenues() {
        com.bpbf.sirh_backend.entities.TypeRetenue tAgent = getOrCreateTypeRetenue("PART_AGENT", "Part Agent (Salariale)", "Sécurité sociale obligatoire - Part salariale prélevée à la source");
        com.bpbf.sirh_backend.entities.TypeRetenue tPatronale = getOrCreateTypeRetenue("PART_EMPLOYEUR", "Part Employeur (Patronale)", "Contribution obligatoire de l'employeur");
        com.bpbf.sirh_backend.entities.TypeRetenue tFiscale = getOrCreateTypeRetenue("RET_FISCALE", "Retenue Fiscale (Agent)", "Impôt direct retenu à la source");
        com.bpbf.sirh_backend.entities.TypeRetenue tTaxe = getOrCreateTypeRetenue("TAXE_PATRONALE", "Taxe Patronale (Employeur)", "Taxe patronale sur la masse salariale");
        com.bpbf.sirh_backend.entities.TypeRetenue tMutuelle = getOrCreateTypeRetenue("MUTUELLE", "Cotisation Mutuelle & Santé", "Couverture santé complémentaire groupe entreprise");
        com.bpbf.sirh_backend.entities.TypeRetenue tPret = getOrCreateTypeRetenue("PRET_AVANCE", "Remboursement Prêt & Avance", "Remboursement prêt interne ou avance");
        com.bpbf.sirh_backend.entities.TypeRetenue tSyndicat = getOrCreateTypeRetenue("SYNDICAT", "Cotisation Syndicale", "Cotisation syndicale du personnel");

        if (retenueRepository.count() == 0) {
            log.info("Initialisation des 14 règles de retenues officielles dans PostgreSQL...");
            saveRetenue("RET-001", "Cotisation Sociale CNSS (Part Agent)", tAgent, 5.5, "Sécurité sociale obligatoire - Part salariale prélevée à la source (Plafond 600 000)");
            saveRetenue("RET-002", "Cotisation Sociale CNSS (Part Employeur)", tPatronale, 16.0, "Sécurité sociale obligatoire - Part patronale prise en charge directement (Plafond 600 000)");
            saveRetenue("RET-003", "Cotisation CARFO (Part Agent)", tAgent, 8.0, "Caisse Autonome de Retraite des Fonctionnaires - Part Salariale");
            saveRetenue("RET-004", "Cotisation CARFO (Part Employeur)", tPatronale, 14.0, "Caisse Autonome de Retraite des Fonctionnaires - Part Patronale");
            saveRetenue("RET-005", "Retraite Complémentaire CRRAE-UMOA (Part Agent)", tAgent, 6.0, "Retraite complémentaire bancaire UMOA par répartition avec épargne - Part Agent");
            saveRetenue("RET-006", "Retraite Complémentaire CRRAE-UMOA (Part Employeur)", tPatronale, 10.0, "Retraite complémentaire bancaire UMOA par répartition avec épargne - Part Employeur");
            saveRetenue("RET-007", "Impôt Unique sur Traitements et Salaires (IUTS)", tFiscale, 10.0, "Impôt direct retenu à la source selon le barème progressif officiel (2% à 30%)");
            saveRetenue("RET-008", "Taxe Patronale sur les Salaires (TPA/TFP)", tTaxe, 3.0, "Taxe patronale d'apprentissage et de formation professionnelle versée au Trésor");
            saveRetenue("RET-009", "Assurance Maladie Groupe (Part Agent)", tAgent, 50.0, "Couverture santé complémentaire groupe entreprise - Part Agent (50%)");
            saveRetenue("RET-010", "Assurance Maladie Groupe (Part Employeur)", tPatronale, 50.0, "Couverture santé complémentaire groupe entreprise - Part Employeur (50%)");
            saveRetenue("RET-011", "Mutuelle de Santé & Entraide (MUPER)", tMutuelle, 2.0, "Cotisation mutuelle d'entraide interne du personnel (Prêts d'urgence & solidarité)");
            saveRetenue("RET-012", "Remboursement Prêt Équipement & Véhicule", tPret, 15.0, "Mensualité de remboursement de prêt interne équipement ou acquisition véhicule");
            saveRetenue("RET-013", "Remboursement Avance & Acompte sur Salaire", tPret, 10.0, "Récupération mensuelle des acomptes et avances sur salaire");
            saveRetenue("RET-014", "Cotisation Syndicale du Personnel", tSyndicat, 1.0, "Prélèvement d'adhésion au syndicat des travailleurs");
        }
    }

    private com.bpbf.sirh_backend.entities.TypeRetenue getOrCreateTypeRetenue(String code, String libelle, String desc) {
        return typeRetenueRepository.findByCode(code).orElseGet(() -> {
            com.bpbf.sirh_backend.entities.TypeRetenue t = new com.bpbf.sirh_backend.entities.TypeRetenue();
            t.setCode(code);
            t.setLibelle(libelle);
            t.setDescription(desc);
            t.setActif(true);
            return typeRetenueRepository.save(t);
        });
    }

    private void saveRetenue(String code, String libelle, com.bpbf.sirh_backend.entities.TypeRetenue type, Double taux, String desc) {
        if (!retenueRepository.existsByCode(code)) {
            com.bpbf.sirh_backend.entities.Retenue r = new com.bpbf.sirh_backend.entities.Retenue();
            r.setCode(code);
            r.setLibelle(libelle);
            r.setTypeRetenue(type);
            r.setTaux(taux);
            r.setDescription(desc);
            r.setActif(true);
            r.setBaseCalcul(com.bpbf.sirh_backend.entities.BaseCalculRetenue.REMUNERATION_BRUTE);
            retenueRepository.save(r);
        }
    }

    private void seedJoursFeries(String year) {
        getOrCreateJourFerie("Jour de l'An", year + "-01-01", "FIXE", "Fête du Nouvel An");
        getOrCreateJourFerie("Soulèvement populaire du 3 Janvier 1966", year + "-01-03", "FIXE", "Commémoration nationale");
        getOrCreateJourFerie("Journée Internationale des Droits des Femmes", year + "-03-08", "FIXE", "8 Mars");
        getOrCreateJourFerie("Fête du Travail", year + "-05-01", "FIXE", "1er Mai");
        getOrCreateJourFerie("Fête de l'Indépendance", year + "-08-05", "FIXE", "Proclamation de l'Indépendance");
        getOrCreateJourFerie("Assomption", year + "-08-15", "FIXE", "Fête religieuse chrétienne");
        getOrCreateJourFerie("Journée des Martyrs", year + "-10-31", "FIXE", "Hommage aux martyrs de l'insurrection");
        getOrCreateJourFerie("Toussaint", year + "-11-01", "FIXE", "Fête religieuse chrétienne");
        getOrCreateJourFerie("Fête Nationale", year + "-12-11", "FIXE", "Proclamation de la République");
        getOrCreateJourFerie("Noël", year + "-12-25", "FIXE", "Fête de la Nativité");

        // Fêtes mobiles selon l'année
        if ("2026".equals(year)) {
            getOrCreateJourFerie("Lundi de Pâques", "2026-04-06", "MOBILE", "Fête chrétienne");
            getOrCreateJourFerie("Ascension", "2026-05-14", "MOBILE", "Fête chrétienne");
            getOrCreateJourFerie("Lundi de Pentecôte", "2026-05-25", "MOBILE", "Fête chrétienne");
            getOrCreateJourFerie("Aïd el-Fitr (Ramadan)", "2026-03-20", "RELIGIEUX", "Fête musulmane");
            getOrCreateJourFerie("Aïd el-Kébir (Tabaski)", "2026-05-27", "RELIGIEUX", "Fête musulmane");
            getOrCreateJourFerie("Mouloud", "2026-08-26", "RELIGIEUX", "Naissance du Prophète");
        } else if ("2025".equals(year)) {
            getOrCreateJourFerie("Lundi de Pâques", "2025-04-21", "MOBILE", "Fête chrétienne");
            getOrCreateJourFerie("Ascension", "2025-05-29", "MOBILE", "Fête chrétienne");
            getOrCreateJourFerie("Lundi de Pentecôte", "2025-06-09", "MOBILE", "Fête chrétienne");
            getOrCreateJourFerie("Aïd el-Fitr (Ramadan)", "2025-03-31", "RELIGIEUX", "Fête musulmane");
            getOrCreateJourFerie("Aïd el-Kébir (Tabaski)", "2025-06-07", "RELIGIEUX", "Fête musulmane");
            getOrCreateJourFerie("Mouloud", "2025-09-05", "RELIGIEUX", "Naissance du Prophète");
        }
    }

    private com.bpbf.sirh_backend.entities.JourFerie getOrCreateJourFerie(String libelle, String date, String type, String desc) {
        return jourFerieRepository.findByDate(date).orElseGet(() -> {
            com.bpbf.sirh_backend.entities.JourFerie jf = new com.bpbf.sirh_backend.entities.JourFerie();
            jf.setLibelle(libelle);
            jf.setDate(date);
            jf.setType(type);
            jf.setChomePaye(true);
            jf.setDescription(desc);
            return jourFerieRepository.save(jf);
        });
    }

    private com.bpbf.sirh_backend.entities.TypeAbsenceConge getOrCreateTypeAbsence(String code, String name) {
        return typeAbsenceCongeRepository.findByCode(code).orElseGet(() -> {
            try {
                com.bpbf.sirh_backend.entities.TypeAbsenceConge t = new com.bpbf.sirh_backend.entities.TypeAbsenceConge();
                t.setCode(code);
                t.setName(name);
                return typeAbsenceCongeRepository.save(t);
            } catch (Exception e) {
                try {
                    Long nextId = jdbcTemplate.queryForObject("SELECT COALESCE(MAX(id), 0) + 1 FROM type_absence_conge", Long.class);
                    jdbcTemplate.update("INSERT INTO type_absence_conge (id, code, name) VALUES (?, ?, ?) ON CONFLICT DO NOTHING", nextId, code, name);
                    return typeAbsenceCongeRepository.findByCode(code).orElse(null);
                } catch (Exception ex) {
                    log.debug("Notice insert type absence: {}", ex.getMessage());
                    return null;
                }
            }
        });
    }

    private SalaryCategory getOrCreateCategory(String code, String name) {
        return categoryRepository.findByCode(code).orElseGet(() -> {
            SalaryCategory cat = new SalaryCategory();
            cat.setCode(code);
            cat.setName(name);
            return categoryRepository.save(cat);
        });
    }

    private SalaryElement getOrCreateElement(String code, String name, SalaryCategory category,
                                             BigDecimal rate, Boolean isCotisable, Boolean isImposable,
                                             String methodCalcul, String formule, Integer ordre) {
        return elementRepository.findByCode(code).orElseGet(() -> {
            SalaryElement el = new SalaryElement();
            el.setCode(code);
            el.setName(name);
            el.setSalaryCategory(category);
            el.setRate(rate);
            el.setIsCotisable(isCotisable);
            el.setIsImposable(isImposable);
            el.setMethodCalcul(methodCalcul);
            el.setFormule(formule);
            el.setOrdre(ordre);
            el.setStatut("ACTIF");
            return elementRepository.save(el);
        });
    }
}
