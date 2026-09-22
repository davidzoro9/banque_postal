package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.repositories.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarriereService {

    private final CarriereNotationRepository notationRepository;
    private final CarriereAvancementRepository avancementRepository;
    private final CarriereReclassementRepository reclassementRepository;
    private final EmployeeRepository employeeRepository;
    private final EchelonRepository echelonRepository;
    private final CategorieRepository categorieRepository;
    private final GradeRepository gradeRepository;
    private final GrilleSalarialeRepository grilleSalarialeRepository;
    private final SituationSalarialeRepository situationSalarialeRepository;
    private final InformationSalarialeCalculService informationSalarialeCalculService;

    @PostConstruct
    @Transactional
    public void initEchelonsEtGrilles() {
        try {
            // S'assurer que les 15 échelons bancaires (E01 à E15) existent en base
            List<Echelon> existingEchelons = echelonRepository.findAll();
            Map<String, Echelon> echelonMap = new HashMap<>();
            for (Echelon e : existingEchelons) {
                if (e.getLibelle() != null) {
                    echelonMap.put(e.getLibelle().toUpperCase().trim(), e);
                }
            }

            for (int i = 1; i <= 15; i++) {
                String codeEch = String.format("E%02d", i);
                if (!echelonMap.containsKey(codeEch)) {
                    Echelon ech = new Echelon();
                    ech.setCode(String.format("ECH-%03d", i));
                    ech.setLibelle(codeEch);
                    ech.setDescription("Échelon bancaire " + i);
                    ech.setActif(true);
                    echelonRepository.save(ech);
                    echelonMap.put(codeEch, ech);
                }
            }

            // S'assurer de la présence d'entrées dans grille_salariale pour la catégorie 1 (ou catégories existantes)
            List<Categorie> categories = categorieRepository.findAll();
            List<Grade> grades = gradeRepository.findAll();
            if (!categories.isEmpty() && !grades.isEmpty()) {
                Categorie cat1 = categories.get(0);
                Grade grp1 = grades.get(0);
                double baseInitial = 224217.0; // Salaire de base référence E01
                for (int i = 1; i <= 15; i++) {
                    String codeEch = String.format("E%02d", i);
                    Echelon ech = echelonMap.get(codeEch);
                    if (ech != null) {
                        Optional<GrilleSalariale> optGrille = grilleSalarialeRepository.findByCategorieObjIdAndEchelonObjId(cat1.getId(), ech.getId());
                        if (optGrille.isEmpty()) {
                            GrilleSalariale gs = new GrilleSalariale();
                            gs.setCategorieObj(cat1);
                            gs.setGradeObj(grp1);
                            gs.setEchelonObj(ech);
                            // Progression de 5% par échelon
                            double sb = Math.round(baseInitial * Math.pow(1.05, i - 1));
                            gs.setBasicSalary(BigDecimal.valueOf(sb));
                            grilleSalarialeRepository.save(gs);
                        }
                    }
                }
            }
            log.info("Échelons (E01-E15) et grille salariale de carrière vérifiés/initialisés avec succès.");
        } catch (Exception ex) {
            log.warn("Notice initialisation échelons carrière: {}", ex.getMessage());
        }
    }

    // --- Statistiques Dashboard ---
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        List<Employee> employees = employeeRepository.findAll();
        long totalEmployees = employees.stream()
                .filter(e -> e.getStatut() == null || !"Inactif".equalsIgnoreCase(e.getStatut()))
                .count();

        List<CarriereNotation> notations = notationRepository.findAll();
        double avgNote = notations.stream()
                .filter(n -> n.getNoteGlobale() != null)
                .mapToDouble(CarriereNotation::getNoteGlobale)
                .average()
                .orElse(0.0);

        List<CarriereAvancement> avancements = avancementRepository.findAll();
        long avancementsProposes = avancements.stream()
                .filter(a -> "PROPOSE".equalsIgnoreCase(a.getStatut()))
                .count();
        long avancementsValides = avancements.stream()
                .filter(a -> "VALIDE".equalsIgnoreCase(a.getStatut()))
                .count();

        List<CarriereReclassement> reclassements = reclassementRepository.findAll();
        long totalReclassements = reclassements.size();

        stats.put("totalEmployees", totalEmployees);
        stats.put("totalNotations", notations.size());
        stats.put("moyenneNotes", Math.round(avgNote * 100.0) / 100.0);
        stats.put("avancementsProposes", avancementsProposes);
        stats.put("avancementsValides", avancementsValides);
        stats.put("totalReclassements", totalReclassements);

        return stats;
    }

    // --- Notations & Évaluations ---
    public List<CarriereNotation> getAllNotations() {
        return notationRepository.findAll();
    }

    public List<CarriereNotation> getNotationsByExercice(Integer exercice) {
        if (exercice != null && exercice > 0) {
            return notationRepository.findByExercice(exercice);
        }
        return notationRepository.findAll();
    }

    @Transactional
    public CarriereNotation saveNotation(CarriereNotation notation) {
        if (notation.getDateEvaluation() == null) {
            notation.setDateEvaluation(LocalDate.now());
        }
        if (notation.getExercice() == null) {
            notation.setExercice(notation.getDateEvaluation().getYear());
        }
        // Calcul note globale si non fixée
        if (notation.getNoteGlobale() == null || notation.getNoteGlobale() <= 0) {
            double obj = notation.getNoteObjectifs() != null ? notation.getNoteObjectifs() : 0.0;
            double comp = notation.getNoteCompetences() != null ? notation.getNoteCompetences() : 0.0;
            double behave = notation.getNoteComportement() != null ? notation.getNoteComportement() : 0.0;
            double global = (obj * 0.4) + (comp * 0.4) + (behave * 0.2);
            notation.setNoteGlobale(Math.round(global * 100.0) / 100.0);
        }

        // Détermination automatique de l'appréciation standard
        if (notation.getAppreciation() == null || notation.getAppreciation().trim().isEmpty()) {
            double g = notation.getNoteGlobale();
            if (g >= 18.0) {
                notation.setAppreciation("Excellent — Éligible à un avancement d'échelon accéléré");
            } else if (g >= 15.0) {
                notation.setAppreciation("Très Bien — Avancement normal recommandé");
            } else if (g >= 12.0) {
                notation.setAppreciation("Bien — Performance satisfaisante");
            } else if (g >= 10.0) {
                notation.setAppreciation("Passable — Conforme aux exigences du poste");
            } else {
                notation.setAppreciation("Insuffisant — Plan de formation et accompagnement requis");
            }
        }

        return notationRepository.save(notation);
    }

    public void deleteNotation(Long id) {
        notationRepository.deleteById(id);
    }

    // --- Avancements d'Échelon ---
    public List<CarriereAvancement> getAllAvancements() {
        return avancementRepository.findAll();
    }

    public List<CarriereAvancement> getAvancementsByExercice(Integer exercice) {
        if (exercice != null && exercice > 0) {
            return avancementRepository.findByExercice(exercice);
        }
        return avancementRepository.findAll();
    }

    @Transactional
    public List<CarriereAvancement> genererPropositions(Integer exercice) {
        int annee = (exercice != null && exercice > 0) ? exercice : LocalDate.now().getYear();
        List<Employee> employees = employeeRepository.findAll();
        List<Echelon> allEchelons = echelonRepository.findAll();

        Map<Integer, Echelon> echelonByNumber = new HashMap<>();
        for (Echelon e : allEchelons) {
            int num = extraireNumeroEchelon(e.getLibelle());
            if (num > 0) {
                echelonByNumber.put(num, e);
            }
        }

        List<CarriereAvancement> generated = new ArrayList<>();

        for (Employee emp : employees) {
            if ("Inactif".equalsIgnoreCase(emp.getStatut()) || "Détaché".equalsIgnoreCase(emp.getStatut())) {
                continue;
            }

            // Vérifier si une proposition existe déjà pour cet exercice
            Optional<CarriereAvancement> existing = avancementRepository.findByEmployeeIdAndExercice(emp.getId(), annee);
            if (existing.isPresent()) {
                generated.add(existing.get());
                continue;
            }

            // Identifier l'échelon actuel
            Echelon currentEch = emp.getEchelonObj();
            int currentNum = 1;
            if (currentEch != null) {
                currentNum = extraireNumeroEchelon(currentEch.getLibelle());
            } else {
                // Par défaut, s'il n'en a pas, associer l'échelon 1
                currentEch = echelonByNumber.get(1);
            }

            // Si déjà à l'échelon maximal (15), pas d'avancement automatique possible
            if (currentNum >= 15) {
                continue;
            }

            int proposedNum = currentNum + 1;
            Echelon proposedEch = echelonByNumber.get(proposedNum);
            if (proposedEch == null) {
                continue;
            }

            // Déterminer le salaire de base actuel
            Double salaireActuel = 0.0;
            SituationSalariale sit = situationSalarialeRepository.findByEmployeeId(emp.getId()).orElse(null);
            if (sit != null && sit.getSalaireBase() != null && sit.getSalaireBase() > 0) {
                salaireActuel = sit.getSalaireBase();
            } else if (emp.getGrilleSalariale() != null && emp.getGrilleSalariale().getSalaireBase() != null) {
                salaireActuel = emp.getGrilleSalariale().getSalaireBase();
            }

            // Déterminer le salaire de base proposé
            Double salairePropose = 0.0;
            Long catId = emp.getCategorieObj() != null ? emp.getCategorieObj().getId() : 1L;
            Optional<GrilleSalariale> optGrille = grilleSalarialeRepository.findByCategorieObjIdAndEchelonObjId(catId, proposedEch.getId());
            if (optGrille.isPresent() && optGrille.get().getSalaireBase() != null) {
                salairePropose = optGrille.get().getSalaireBase();
            } else {
                salairePropose = Math.round(salaireActuel * 1.05 * 100.0) / 100.0;
            }

            Double ecart = Math.max(0.0, Math.round((salairePropose - salaireActuel) * 100.0) / 100.0);

            CarriereAvancement avancement = new CarriereAvancement();
            avancement.setEmployee(emp);
            avancement.setExercice(annee);
            avancement.setEchelonActuel(currentEch);
            avancement.setEchelonPropose(proposedEch);
            avancement.setSalaireBaseActuel(salaireActuel);
            avancement.setSalaireBasePropose(salairePropose);
            avancement.setEcartSalaire(ecart);
            avancement.setTypeAvancement("ANCIENNETE");
            avancement.setStatut("PROPOSE");
            avancement.setDateProposition(LocalDate.now());
            avancement.setObservations("Proposition conforme à la convention collective bancaire (2 ans d'ancienneté d'échelon).");

            generated.add(avancementRepository.save(avancement));
        }

        return generated;
    }

    @Transactional
    public CarriereAvancement validerAvancement(Long id, String validateur) {
        CarriereAvancement avancement = avancementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposition d'avancement introuvable avec ID: " + id));

        Employee emp = avancement.getEmployee();
        Echelon newEch = avancement.getEchelonPropose();

        avancement.setStatut("VALIDE");
        avancement.setDateValidation(LocalDate.now());
        avancement.setValidateur((validateur != null && !validateur.trim().isEmpty()) ? validateur : "DRH — Banque Postale");

        // 1. Mettre à jour l'employé avec le nouvel échelon
        emp.setEchelonObj(newEch);

        // 2. Mettre à jour la grille salariale associée si disponible
        Long catId = emp.getCategorieObj() != null ? emp.getCategorieObj().getId() : 1L;
        Optional<GrilleSalariale> optGrille = grilleSalarialeRepository.findByCategorieObjIdAndEchelonObjId(catId, newEch.getId());
        optGrille.ifPresent(emp::setGrilleSalariale);
        employeeRepository.save(emp);

        // 3. Mettre à jour la situation salariale
        SituationSalariale situation = situationSalarialeRepository.findByEmployeeId(emp.getId())
                .orElseGet(() -> {
                    SituationSalariale s = new SituationSalariale();
                    s.setEmployee(emp);
                    return s;
                });
        situation.setEchelon(newEch);
        optGrille.ifPresent(situation::setGrilleSalariale);
        situation.setSalaireBase(avancement.getSalaireBasePropose());
        situationSalarialeRepository.save(situation);

        // 4. Recalculer automatiquement les fiches de paie pour que le nouveau salaire prenne effet immédiatement
        try {
            informationSalarialeCalculService.recalculate(emp);
        } catch (Exception ex) {
            log.warn("Recalcul salarial post-avancement (non bloquant): {}", ex.getMessage());
        }

        log.info("Avancement validé pour l'employé {}: nouvel échelon {}, nouveau salaire de base {}",
                emp.getMatricule(), newEch.getLibelle(), avancement.getSalaireBasePropose());

        return avancementRepository.save(avancement);
    }

    @Transactional
    public CarriereAvancement rejeterAvancement(Long id, String motif) {
        CarriereAvancement avancement = avancementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposition d'avancement introuvable"));

        avancement.setStatut("REJETE");
        avancement.setObservations((motif != null && !motif.trim().isEmpty()) ? motif : "Rejeté par la commission de carrière");
        return avancementRepository.save(avancement);
    }

    // --- Reclassements ---
    public List<CarriereReclassement> getAllReclassements() {
        return reclassementRepository.findAllByOrderByDateDemandeDesc();
    }

    @Transactional
    public CarriereReclassement saveReclassement(CarriereReclassement reclassement) {
        if (reclassement.getDateDemande() == null) {
            reclassement.setDateDemande(LocalDate.now());
        }
        if (reclassement.getDateEffet() == null) {
            reclassement.setDateEffet(reclassement.getDateDemande());
        }
        if (reclassement.getStatut() == null) {
            reclassement.setStatut("VALIDE");
        }

        // Si le statut est VALIDE dès l'enregistrement, appliquer directement à l'employé
        if ("VALIDE".equalsIgnoreCase(reclassement.getStatut())) {
            appliquerReclassementAEmploye(reclassement);
        }

        return reclassementRepository.save(reclassement);
    }

    @Transactional
    public CarriereReclassement validerReclassement(Long id, String validateur) {
        CarriereReclassement reclassement = reclassementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande de reclassement introuvable"));

        reclassement.setStatut("VALIDE");
        reclassement.setDateValidation(LocalDate.now());
        reclassement.setValidateur((validateur != null && !validateur.trim().isEmpty()) ? validateur : "Direction Générale BPBF");

        appliquerReclassementAEmploye(reclassement);

        return reclassementRepository.save(reclassement);
    }

    private void appliquerReclassementAEmploye(CarriereReclassement reclassement) {
        Employee emp = reclassement.getEmployee();
        if (emp == null) return;

        if (reclassement.getCategorieNouvelle() != null) {
            emp.setCategorieObj(reclassement.getCategorieNouvelle());
        }
        if (reclassement.getGradeNouveau() != null) {
            emp.setGradeObj(reclassement.getGradeNouveau());
        }
        if (reclassement.getEchelonNouveau() != null) {
            emp.setEchelonObj(reclassement.getEchelonNouveau());
        }

        Long catId = emp.getCategorieObj() != null ? emp.getCategorieObj().getId() : 1L;
        Long echId = emp.getEchelonObj() != null ? emp.getEchelonObj().getId() : 1L;
        Optional<GrilleSalariale> optGrille = grilleSalarialeRepository.findByCategorieObjIdAndEchelonObjId(catId, echId);
        optGrille.ifPresent(emp::setGrilleSalariale);
        employeeRepository.save(emp);

        SituationSalariale situation = situationSalarialeRepository.findByEmployeeId(emp.getId())
                .orElseGet(() -> {
                    SituationSalariale s = new SituationSalariale();
                    s.setEmployee(emp);
                    return s;
                });
        if (reclassement.getCategorieNouvelle() != null) situation.setCategorie(reclassement.getCategorieNouvelle());
        if (reclassement.getGradeNouveau() != null) situation.setGrade(reclassement.getGradeNouveau());
        if (reclassement.getEchelonNouveau() != null) situation.setEchelon(reclassement.getEchelonNouveau());
        if (reclassement.getSalaireBaseNouveau() != null && reclassement.getSalaireBaseNouveau() > 0) {
            situation.setSalaireBase(reclassement.getSalaireBaseNouveau());
        } else if (optGrille.isPresent() && optGrille.get().getSalaireBase() != null) {
            situation.setSalaireBase(optGrille.get().getSalaireBase());
        }
        situationSalarialeRepository.save(situation);

        try {
            informationSalarialeCalculService.recalculate(emp);
        } catch (Exception ex) {
            log.warn("Recalcul salarial post-reclassement: {}", ex.getMessage());
        }
    }

    private int extraireNumeroEchelon(String code) {
        if (code == null) return 1;
        try {
            String digits = code.replaceAll("\\D+", "");
            if (!digits.isEmpty()) {
                return Integer.parseInt(digits);
            }
        } catch (Exception ignored) {}
        return 1;
    }
}
