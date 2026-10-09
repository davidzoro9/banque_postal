package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.SoldeCongeDto;
import com.bpbf.sirh_backend.entities.Conge;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.TypeAbsenceConge;
import com.bpbf.sirh_backend.repositories.CongeRepository;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import com.bpbf.sirh_backend.repositories.TypeAbsenceCongeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CongeWorkflowService {

    private final CongeRepository congeRepository;
    private final EmployeeRepository employeeRepository;
    private final TypeAbsenceCongeRepository typeAbsenceCongeRepository;
    private final com.bpbf.sirh_backend.repositories.JourFerieRepository jourFerieRepository;
    private final com.bpbf.sirh_backend.repositories.ParametrageCongeRepository parametrageCongeRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    @Transactional(readOnly = true)
    public List<Conge> getAllConges() {
        return congeRepository.findAllWithDetails();
    }

    @Transactional(readOnly = true)
    public Conge getCongeById(Long id) {
        return congeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande de congé introuvable avec l'identifiant : " + id));
    }

    @Transactional(readOnly = true)
    public List<Conge> getCongesByEmployee(Long employeeId) {
        return congeRepository.findByEmployeeId(employeeId);
    }

    @Transactional(readOnly = true)
    public List<Conge> getCongesByInterimaire(Long interimaireId) {
        return congeRepository.findByInterimaireId(interimaireId);
    }

    // ── ÉTAPE 1 : CRÉATION / SOUMISSION DE LA DEMANDE ──
    @Transactional
    public Conge createConge(Conge conge) {
        // Résolution robuste de l'employé pour ne JAMAIS avoir "Agent non spécifié"
        Employee emp = null;
        if (conge.getEmployee() != null && conge.getEmployee().getId() != null) {
            emp = employeeRepository.findById(conge.getEmployee().getId()).orElse(null);
        }
        if (emp == null && conge.getEmployee() != null && conge.getEmployee().getMatricule() != null && !conge.getEmployee().getMatricule().trim().isEmpty()) {
            emp = employeeRepository.findByMatricule(conge.getEmployee().getMatricule().trim()).orElse(null);
        }
        if (emp == null && conge.getEmploye() != null && !conge.getEmploye().trim().isEmpty()) {
            final String searchName = conge.getEmploye().trim().toUpperCase();
            emp = employeeRepository.findAll().stream()
                    .filter(e -> {
                        String eNom = e.getNom() != null ? e.getNom().trim().toUpperCase() : "";
                        String ePrenom = e.getPrenom() != null ? e.getPrenom().trim().toUpperCase() : "";
                        String full = (ePrenom + " " + eNom).trim();
                        return (!eNom.isEmpty() && searchName.contains(eNom)) || (!full.isEmpty() && full.contains(searchName));
                    })
                    .findFirst()
                    .orElse(null);
        }
        if (emp != null) {
            conge.setEmployee(emp);
            String p = emp.getPrenom() != null ? emp.getPrenom().trim() : "";
            String n = emp.getNom() != null ? emp.getNom().trim() : "";
            conge.setEmploye((p + " " + n).trim());
        } else if (conge.getEmploye() == null || conge.getEmploye().isBlank()) {
            conge.setEmploye("Collaborateur BPBF");
        }

        // Intérimaire désigné
        if (conge.getInterimaire() != null && conge.getInterimaire().getId() != null) {
            Employee inter = employeeRepository.findById(conge.getInterimaire().getId()).orElse(null);
            conge.setInterimaire(inter);
            conge.setStatutInterim("EN_ATTENTE_INTERIM");
            conge.setStatut("EN_ATTENTE_INTERIM");
        } else if ("APPROUVE".equalsIgnoreCase(conge.getStatut()) || "VALIDE".equalsIgnoreCase(conge.getStatut())) {
            conge.setStatutInterim("NON_REQUIS");
            conge.setStatut("APPROUVE");
            if (conge.getDateValidation() == null || conge.getDateValidation().isBlank()) {
                conge.setDateValidation(LocalDate.now().format(ISO_FORMATTER));
            }
            if (conge.getValidePar() == null || conge.getValidePar().isBlank()) {
                conge.setValidePar("Direction des Ressources Humaines (DRH)");
            }
        } else {
            conge.setStatutInterim("NON_REQUIS");
            conge.setStatut("EN_ATTENTE_N1");
        }

        // Type d'absence / congé
        if (conge.getTypeAbsenceConge() != null) {
            TypeAbsenceConge type = null;
            if (conge.getTypeAbsenceConge().getId() != null) {
                type = typeAbsenceCongeRepository.findById(conge.getTypeAbsenceConge().getId()).orElse(null);
            }
            if (type == null && conge.getTypeAbsenceConge().getCode() != null) {
                type = typeAbsenceCongeRepository.findByCode(conge.getTypeAbsenceConge().getCode()).orElse(null);
            }
            conge.setTypeAbsenceConge(type);
        }

        // Contrôle d'éligibilité légale selon le sexe de l'employé (Code du travail BF)
        if (conge.getTypeAbsenceConge() != null && emp != null) {
            TypeAbsenceConge type = conge.getTypeAbsenceConge();
            String req = type.getSexeRequis();
            String code = type.getCode() != null ? type.getCode().toUpperCase() : "";
            if ("FEMININ".equalsIgnoreCase(req) || code.contains("MATERNITE")) {
                if (isMasculin(emp)) {
                    throw new IllegalArgumentException("Conformément au Code du travail et à la réglementation bancaire, le congé de maternité est strictement réservé aux salariées de sexe féminin.");
                }
            } else if ("MASCULIN".equalsIgnoreCase(req) || code.contains("PATERNITE")) {
                if (isFeminin(emp)) {
                    throw new IllegalArgumentException("Conformément au Code du travail et à la réglementation bancaire, le congé de paternité est strictement réservé aux salariés de sexe masculin.");
                }
            }
        }

        // Calcul automatique des jours ouvrables
        if (conge.getDateDebut() != null && conge.getDateFin() != null) {
            try {
                LocalDate start = LocalDate.parse(conge.getDateDebut());
                LocalDate end = LocalDate.parse(conge.getDateFin());
                int calculatedDays = calculateJoursOuvrables(start, end);
                if (conge.getNbJours() == null || conge.getNbJours() <= 0) {
                    conge.setNbJours(calculatedDays);
                }
            } catch (Exception e) {
                log.warn("Impossible de parser les dates : {} / {}", conge.getDateDebut(), conge.getDateFin());
                if (conge.getNbJours() == null || conge.getNbJours() <= 0) {
                    conge.setNbJours(1);
                }
            }
        } else if (conge.getNbJours() == null || conge.getNbJours() <= 0) {
            conge.setNbJours(1);
        }

        if (conge.getDateDemande() == null || conge.getDateDemande().isBlank()) {
            conge.setDateDemande(LocalDate.now().format(ISO_FORMATTER));
        }

        // Détection automatique de poste sensible BCEAO
        boolean isSensible = false;
        if (conge.getEmployee() != null) {
            String fName = (conge.getEmployee().getFonction() != null ? conge.getEmployee().getFonction().getName() : "") + " "
                         + (conge.getEmployee().getEmploi() != null ? conge.getEmployee().getEmploi().getName() : "");
            fName = fName.toLowerCase();
            if (fName.contains("caisse") || fName.contains("caissier") || fName.contains("trésor")
                || fName.contains("trader") || fName.contains("gestionnaire de compte")
                || fName.contains("opérations") || fName.contains("monétique")) {
                isSensible = true;
            }
        }
        if (Boolean.TRUE.equals(conge.getPosteSensibleBceao())) {
            isSensible = true;
        }
        conge.setPosteSensibleBceao(isSensible);
        conge.setStatutSi(isSensible ? "A_SUSPENDRE" : "NON_REQUIS");

        // Calcul des jours déductibles selon le type et le quota statutaire/légal non déductible
        int nbJours = conge.getNbJours() != null ? conge.getNbJours() : 0;
        int joursDeductibles = 0;

        if (conge.getTypeAbsenceConge() != null) {
            TypeAbsenceConge type = conge.getTypeAbsenceConge();
            if (type.isDeductibleDuSolde()) {
                joursDeductibles = nbJours;
            } else {
                int plafond = type.getPlafondJoursNonDeductible();
                joursDeductibles = Math.max(0, nbJours - plafond);
            }
        } else {
            joursDeductibles = nbJours;
        }

        // Calcul solde avant / après
        if (conge.getEmployee() != null && conge.getEmployee().getId() != null) {
            try {
                SoldeCongeDto solde = getSoldeForEmployee(conge.getEmployee().getId());
                if (solde != null && solde.getSoldeRestant() != null) {
                    conge.setSoldeAvantDemande(solde.getSoldeRestant().intValue());
                    conge.setSoldeApresDemande(Math.max(0, solde.getSoldeRestant().intValue() - joursDeductibles));
                }
            } catch (Exception e) {
                conge.setSoldeAvantDemande(30);
                conge.setSoldeApresDemande(Math.max(0, 30 - joursDeductibles));
            }
        }

        return congeRepository.save(conge);
    }

    // ── ÉTAPE 2 : AVIS DE L'INTÉRIMAIRE (COLLÈGUE PRESSENTI) ──
    @Transactional
    public Conge donnerAvisInterim(Long id, boolean accord, String commentaire, String interimaireNom) {
        Conge conge = getCongeById(id);
        conge.setDateAvisInterim(LocalDate.now().format(ISO_FORMATTER));
        conge.setCommentaireInterim(commentaire != null ? commentaire.trim() : "");

        if (accord) {
            conge.setStatutInterim("ACCEPTE");
            conge.setStatut("EN_ATTENTE_N1"); // Passe à l'étape 3 (Visa N+1)
        } else {
            conge.setStatutInterim("REFUSE");
            conge.setStatut("REJETE");
            String comment = (commentaire != null && !commentaire.isBlank()) ? " : " + commentaire : "";
            conge.setMotifRefus("Intérim décliné par " + (interimaireNom != null ? interimaireNom : "le collègue") + comment);
        }

        return congeRepository.save(conge);
    }

    // ── ÉTAPE 3 : VISA HIÉRARCHIQUE N+1 (DIRECTEUR / CHEF DE PÔLE) ──
    @Transactional
    public Conge donnerVisaN1(Long id, boolean accord, String commentaire, String validePar) {
        Conge conge = getCongeById(id);
        conge.setDateVisaN1(LocalDate.now().format(ISO_FORMATTER));
        conge.setVisaN1Par(validePar != null && !validePar.isBlank() ? validePar : "Directeur N+1");
        conge.setCommentaireN1(commentaire != null ? commentaire.trim() : "");

        if (accord) {
            conge.setStatut("EN_ATTENTE_DRH"); // Passe à l'étape 4 (Contrôle DRH)
        } else {
            conge.setStatut("REJETE");
            String comment = (commentaire != null && !commentaire.isBlank()) ? " : " + commentaire : "";
            conge.setMotifRefus("Visa N+1 défavorable" + comment);
        }

        return congeRepository.save(conge);
    }

    // ── ÉTAPE 4 : CONTRÔLE ET DÉLIVRANCE DU TITRE DE CONGÉ DRH ──
    @Transactional
    public Conge validationFinaleDrh(Long id, boolean accord, String motifRefus, String validePar) {
        Conge conge = getCongeById(id);
        conge.setDateVisaDrh(LocalDate.now().format(ISO_FORMATTER));
        conge.setVisaDrhPar(validePar != null && !validePar.isBlank() ? validePar : "DRH");

        if (accord) {
            conge.setStatut("APPROUVE");
            conge.setValidePar(validePar != null && !validePar.isBlank() ? validePar : "DRH");
            conge.setDateValidation(LocalDate.now().format(ISO_FORMATTER));
            conge.setMotifRefus(null);

            // Génération du numéro officiel de Titre de Congé
            conge.setNumeroTitreConge("TC-" + LocalDate.now().getYear() + "-" + String.format("%04d", conge.getId()));

            // Mise à jour de l'employé si déjà en période
            try {
                LocalDate now = LocalDate.now();
                LocalDate start = LocalDate.parse(conge.getDateDebut());
                LocalDate end = LocalDate.parse(conge.getDateFin());
                if (!now.isBefore(start) && !now.isAfter(end) && conge.getEmployee() != null) {
                    conge.getEmployee().setStatut("EN_CONGE");
                    employeeRepository.save(conge.getEmployee());
                }
            } catch (Exception ignored) {}
        } else {
            conge.setStatut("REJETE");
            conge.setMotifRefus(motifRefus != null && !motifRefus.isBlank() ? motifRefus : "Refus DRH non conforme au cadre légal/conventionnel");
        }

        return congeRepository.save(conge);
    }

    // ── ÉTAPE 5 : SÉCURITÉ SI (SUSPENSION ACCÈS POSTE SENSIBLE BCEAO) ──
    @Transactional
    public Conge actionSecuriteSi(Long id, String statutSi, String operateurSi) {
        Conge conge = getCongeById(id);
        conge.setStatutSi(statutSi != null ? statutSi : "ACCES_SUSPENDU");
        return congeRepository.save(conge);
    }

    // Compatibilité directe pour les appels 1-clic existants
    @Transactional
    public Conge approuverConge(Long id, String validePar) {
        return validationFinaleDrh(id, true, null, validePar);
    }

    @Transactional
    public Conge rejeterConge(Long id, String motifRefus, String rejetePar) {
        return validationFinaleDrh(id, false, motifRefus, rejetePar);
    }

    @Transactional
    public Conge annulerConge(Long id) {
        Conge conge = getCongeById(id);
        conge.setStatut("ANNULE");
        conge.setDateValidation(LocalDate.now().format(ISO_FORMATTER));
        return congeRepository.save(conge);
    }

    @Transactional
    public void deleteConge(Long id) {
        congeRepository.deleteById(id);
    }

    // ── QUORUM DE PRÉSENCE DIRECTION (Vérification Règle Max 30% d'Absents) ──
    @Transactional(readOnly = true)
    public Map<String, Object> verifierQuorumDirection(Long directionId) {
        Map<String, Object> res = new HashMap<>();
        try {
            Long totalDirection = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM employee WHERE direction_id = ?",
                Long.class, directionId
            );
            if (totalDirection == null || totalDirection == 0) totalDirection = 1L;

            Long absentsActuels = jdbcTemplate.queryForObject(
                "SELECT COUNT(DISTINCT e.id) FROM conge c JOIN employee e ON c.employee_id = e.id " +
                "WHERE e.direction_id = ? AND c.statut = 'APPROUVE' " +
                "AND CAST(c.date_debut AS DATE) <= CURRENT_DATE AND CAST(c.date_fin AS DATE) >= CURRENT_DATE",
                Long.class, directionId
            );
            if (absentsActuels == null) absentsActuels = 0L;

            double tauxAbsence = Math.round(((double) absentsActuels / (double) totalDirection) * 1000.0) / 10.0;
            boolean quorumRespecte = tauxAbsence <= 30.0;

            res.put("directionId", directionId);
            res.put("totalAgents", totalDirection);
            res.put("absentsActuels", absentsActuels);
            res.put("tauxAbsencePourcentage", tauxAbsence);
            res.put("quorumRespecte", quorumRespecte);
            res.put("seuilMaxAbsentsPourcentage", 30.0);
        } catch (Exception e) {
            res.put("quorumRespecte", true);
            res.put("tauxAbsencePourcentage", 0.0);
        }
        return res;
    }

    // ── SOLDES ET CALCULS LÉGAUX BURKINA FASO ──
    @Transactional(readOnly = true)
    public SoldeCongeDto getSoldeForEmployee(Long employeeId) {
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employé introuvable : " + employeeId));

        com.bpbf.sirh_backend.entities.ParametrageConge config = parametrageCongeRepository.findAll().stream().findFirst()
                .orElseGet(com.bpbf.sirh_backend.entities.ParametrageConge::new);

        int droitAnnuel = config.getDroitAnnuelDefaut() != null ? config.getDroitAnnuelDefaut() : 30;
        double tauxMensuel = config.getJoursAcquisParMois() != null ? config.getJoursAcquisParMois() : 2.5;
        int currentMonth = LocalDate.now().getMonthValue();
        double joursAcquis = Math.min((double) droitAnnuel, Math.round(currentMonth * tauxMensuel * 10.0) / 10.0);

        List<Conge> employeeConges = congeRepository.findByEmployeeId(employeeId);
        int joursPris = 0;
        int joursEnAttente = 0;
        String dernierConge = null;

        for (Conge c : employeeConges) {
            int j = c.getNbJours() != null ? c.getNbJours() : 0;
            int jDeductibles = 0;
            if (c.getTypeAbsenceConge() != null) {
                TypeAbsenceConge type = c.getTypeAbsenceConge();
                if (type.isDeductibleDuSolde()) {
                    jDeductibles = j;
                } else {
                    int plafond = type.getPlafondJoursNonDeductible();
                    jDeductibles = Math.max(0, j - plafond);
                }
            } else {
                jDeductibles = j;
            }

            if (jDeductibles > 0) {
                if ("APPROUVE".equalsIgnoreCase(c.getStatut()) || "VALIDE".equalsIgnoreCase(c.getStatut())) {
                    joursPris += jDeductibles;
                    if (dernierConge == null || (c.getDateDebut() != null && c.getDateDebut().compareTo(dernierConge) > 0)) {
                        dernierConge = c.getDateDebut();
                    }
                } else if (c.getStatut() != null && c.getStatut().toUpperCase().contains("EN_ATTENTE")) {
                    joursEnAttente += jDeductibles;
                }
            }
        }

        double soldeRestant = Math.max(0.0, Math.round((joursAcquis - joursPris) * 10.0) / 10.0);

        String nomComplet = ((emp.getPrenom() != null ? emp.getPrenom() : "") + " "
                + (emp.getNom() != null ? emp.getNom() : "")).trim();
        if (nomComplet.isBlank() && emp.getName() != null) {
            nomComplet = emp.getName();
        }

        String depNom = emp.getDepartment() != null ? emp.getDepartment().getName() :
                (emp.getDirection() != null ? emp.getDirection().getName() : "Direction Générale");

        String posteNom = emp.getFonction() != null ? emp.getFonction().getName() :
                (emp.getEmploi() != null ? emp.getEmploi().getName() : "Agent");

        return SoldeCongeDto.builder()
                .employeeId(emp.getId())
                .matricule(emp.getMatricule() != null ? emp.getMatricule() : "EMP-" + emp.getId())
                .nomComplet(nomComplet)
                .departement(depNom)
                .poste(posteNom)
                .droitAnnuel(droitAnnuel)
                .joursAcquis(joursAcquis)
                .joursPris(joursPris)
                .joursEnAttente(joursEnAttente)
                .soldeRestant(soldeRestant)
                .dateDernierConge(dernierConge)
                .build();
    }

    @Transactional(readOnly = true)
    public List<SoldeCongeDto> getAllSoldes() {
        List<Employee> allEmployees = employeeRepository.findAll();
        List<SoldeCongeDto> result = new ArrayList<>();
        for (Employee emp : allEmployees) {
            try {
                result.add(getSoldeForEmployee(emp.getId()));
            } catch (Exception e) {
                log.warn("Erreur calcul solde employé {}: {}", emp.getId(), e.getMessage());
            }
        }
        return result;
    }

    public int calculateJoursOuvrables(LocalDate start, LocalDate end) {
        if (start == null || end == null) return 0;
        if (end.isBefore(start)) return 0;

        com.bpbf.sirh_backend.entities.ParametrageConge config = parametrageCongeRepository.findAll().stream().findFirst()
                .orElseGet(com.bpbf.sirh_backend.entities.ParametrageConge::new);

        String mode = config.getModeDecompte() != null ? config.getModeDecompte() : "OUVRABLE_5J";
        boolean checkFeries = Boolean.TRUE.equals(config.getDeduireJoursFeries());

        int workingDays = 0;
        LocalDate current = start;
        while (!current.isAfter(end)) {
            DayOfWeek day = current.getDayOfWeek();
            boolean isExcludedDay = false;

            if ("OUVRABLE_5J".equals(mode)) {
                isExcludedDay = (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY);
            } else if ("OUVRABLE_6J".equals(mode)) {
                isExcludedDay = (day == DayOfWeek.SUNDAY);
            } else {
                isExcludedDay = false;
            }

            String dateStr = current.format(ISO_FORMATTER);
            boolean isFerieDb = checkFeries && jourFerieRepository.findByDate(dateStr)
                    .map(jf -> Boolean.TRUE.equals(jf.getChomePaye()))
                    .orElse(false);
            boolean isFerieFixe = checkFeries && isBurkinaFasoFixedHoliday(current);
            boolean isFerie = isFerieDb || isFerieFixe;

            if (!isExcludedDay && !isFerie) {
                workingDays++;
            }
            current = current.plusDays(1);
        }
        return Math.max(1, workingDays);
    }

    public boolean isFeminin(Employee emp) {
        if (emp == null || emp.getSexe() == null) return false;
        String s = emp.getSexe().trim().toUpperCase();
        return s.startsWith("F") || s.contains("FEM");
    }

    public boolean isMasculin(Employee emp) {
        if (emp == null || emp.getSexe() == null) return false;
        String s = emp.getSexe().trim().toUpperCase();
        return s.startsWith("M") || s.contains("HOM");
    }

    @Transactional(readOnly = true)
    public boolean isEmployeeOnApprovedMaternite(Long employeeId, LocalDate debut, LocalDate fin) {
        if (employeeId == null || debut == null || fin == null) return false;
        List<Conge> conges = congeRepository.findByEmployeeId(employeeId);
        for (Conge c : conges) {
            String st = c.getStatut() != null ? c.getStatut().toUpperCase() : "";
            if (st.equals("APPROUVE") || st.equals("VALIDE") || st.equals("ACCEPTE") || st.equals("EN_COURS")) {
                TypeAbsenceConge tac = c.getTypeAbsenceConge();
                String code = tac != null && tac.getCode() != null ? tac.getCode().toUpperCase() : "";
                String name = (tac != null && tac.getName() != null ? tac.getName() : (c.getType() != null ? c.getType() : "")).toUpperCase();
                if (code.contains("MATERNITE") || name.contains("MATERNITE") || name.contains("MATERNITÉ")) {
                    if (c.getDateDebut() != null && c.getDateFin() != null) {
                        try {
                            LocalDate cDebut = LocalDate.parse(c.getDateDebut().trim());
                            LocalDate cFin = LocalDate.parse(c.getDateFin().trim());
                            if (!cDebut.isAfter(fin) && !cFin.isBefore(debut)) {
                                return true;
                            }
                        } catch (Exception ignored) {}
                    }
                }
            }
        }
        return false;
    }

    private static final java.util.Set<String> FERIES_FIXES_BF = java.util.Set.of(
            "01-01", // Jour de l'An
            "01-03", // Soulèvement Populaire
            "03-08", // Journée de la Femme
            "05-01", // Fête du Travail
            "08-05", // Fête de l'Indépendance
            "08-15", // Assomption
            "10-31", // Journée des Martyrs
            "11-01", // Toussaint
            "12-11", // Fête Nationale
            "12-25"  // Noël
    );

    private boolean isBurkinaFasoFixedHoliday(LocalDate date) {
        if (date == null) return false;
        String mmDd = String.format("%02d-%02d", date.getMonthValue(), date.getDayOfMonth());
        return FERIES_FIXES_BF.contains(mmDd);
    }
}
