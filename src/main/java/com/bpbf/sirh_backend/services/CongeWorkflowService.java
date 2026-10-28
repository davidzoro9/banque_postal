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
    private final com.bpbf.sirh_backend.repositories.SessionPaieRepository sessionPaieRepository;
    private final com.bpbf.sirh_backend.repositories.UtilisateurRepository utilisateurRepository;
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

    @Transactional(readOnly = true)
    public List<Conge> getCongesBySuperviseur(Long superviseurId) {
        if (superviseurId == null) return List.of();
        Long targetEmpId = superviseurId;
        java.util.Optional<com.bpbf.sirh_backend.entities.Utilisateur> userOpt = utilisateurRepository.findById(superviseurId);
        if (userOpt.isPresent()) {
            com.bpbf.sirh_backend.entities.Utilisateur u = userOpt.get();
            java.util.Optional<Employee> empOpt = employeeRepository.findAll().stream()
                    .filter(e -> (e.getMatricule() != null && e.getMatricule().equalsIgnoreCase(u.getUsername()))
                              || (e.getEmail() != null && e.getEmail().equalsIgnoreCase(u.getEmail())))
                    .findFirst();
            if (empOpt.isPresent()) {
                targetEmpId = empOpt.get().getId();
            }
        }

        final Long finalSupId = targetEmpId;
        return congeRepository.findAll().stream()
                .filter(c -> c.getEmployee() != null && c.getEmployee().getSuperviseur() != null
                        && (finalSupId.equals(c.getEmployee().getSuperviseur().getId())
                            || superviseurId.equals(c.getEmployee().getSuperviseur().getId())))
                .toList();
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

        // Calcul automatique des jours ouvrables avec parsing robuste (gère YYYY-MM-DD et DD/MM/YYYY)
        if (conge.getDateDebut() != null && conge.getDateFin() != null) {
            try {
                LocalDate start = parseDateRobust(conge.getDateDebut());
                LocalDate end = parseDateRobust(conge.getDateFin());
                if (start != null) conge.setDateDebut(start.format(ISO_FORMATTER));
                if (end != null) conge.setDateFin(end.format(ISO_FORMATTER));

                if (start != null && end != null) {
                    int calculatedDays = calculateJoursConge(start, end, conge.getTypeAbsenceConge());
                    if (conge.getNbJours() == null || conge.getNbJours() <= 0) {
                        conge.setNbJours(calculatedDays);
                    }
                } else if (conge.getNbJours() == null || conge.getNbJours() <= 0) {
                    conge.setNbJours(1);
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
                LocalDate start = parseDateRobust(conge.getDateDebut());
                LocalDate end = parseDateRobust(conge.getDateFin());
                if (start != null && end != null && !now.isBefore(start) && !now.isAfter(end) && conge.getEmployee() != null) {
                    conge.getEmployee().setStatut("EN_CONGE");
                    employeeRepository.save(conge.getEmployee());
                }
            } catch (Exception ignored) {}

            // ÉTAPE 5 AUTOMATISÉE : SUSPENSION SÉCURISÉE DU COMPTE UTILISATEUR JUSQU'À LA FIN DU CONGÉ
            try {
                desactiverCompteUtilisateurPendantConge(conge);
                conge.setStatutSi("COMPTE_DESACTIVE_AUTO");
            } catch (Exception e) {
                log.warn("Notice désactivation automatique compte utilisateur pour congé #{}: {}", conge.getId(), e.getMessage());
            }

            // DÉCLENCHEMENT AUTOMATIQUE DES SESSIONS DIFFÉRENTIEL MATERNITÉ (STATUT: NON_TRAITE)
            try {
                TypeAbsenceConge tac = conge.getTypeAbsenceConge();
                String cCode = tac != null && tac.getCode() != null ? tac.getCode().toUpperCase() : "";
                String cNom = (tac != null && tac.getName() != null ? tac.getName() : (conge.getType() != null ? conge.getType() : "")).toUpperCase();
                if (cCode.contains("MATERNITE") || cNom.contains("MATERNITE") || cNom.contains("MATERNITÉ")) {
                    autoCreateMaterniteSessions(conge);
                }
            } catch (Exception e) {
                log.warn("Notice création automatique session maternité pour congé #{}: {}", conge.getId(), e.getMessage());
            }
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

        int quotaPermissions = config.getQuotaPermissionsAnnuel() != null ? config.getQuotaPermissionsAnnuel() : 10;
        int permissionsPrises = 0;

        for (Conge c : employeeConges) {
            int j = c.getNbJours() != null ? c.getNbJours() : 0;
            boolean isPermission = false;
            if (c.getTypeAbsenceConge() != null) {
                String cat = c.getTypeAbsenceConge().getCategorie();
                String code = c.getTypeAbsenceConge().getCode();
                if ("PERMISSION".equalsIgnoreCase(cat) || "ABSENCE".equalsIgnoreCase(cat)
                        || (code != null && (code.startsWith("EVT_") || code.startsWith("ABS_") || code.contains("PERMISSION")))) {
                    isPermission = true;
                }
            } else if (c.getType() != null && (c.getType().toLowerCase().contains("permission") || c.getType().toLowerCase().contains("absence") || c.getType().toLowerCase().contains("événement") || c.getType().toLowerCase().contains("evenement"))) {
                isPermission = true;
            }

            if (isPermission) {
                if ("APPROUVE".equalsIgnoreCase(c.getStatut()) || "VALIDE".equalsIgnoreCase(c.getStatut())) {
                    permissionsPrises += j;
                }
            }

            int jDeductibles = 0;
            if (c.getTypeAbsenceConge() != null) {
                TypeAbsenceConge type = c.getTypeAbsenceConge();
                if (type.isDeductibleDuSolde()) {
                    jDeductibles = j;
                } else {
                    int plafond = type.getPlafondJoursNonDeductible();
                    jDeductibles = Math.max(0, j - plafond);
                }
            } else if (!isPermission) {
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
        int soldePermissionsRestant = Math.max(0, quotaPermissions - permissionsPrises);

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
                .quotaPermissions(quotaPermissions)
                .permissionsPrises(permissionsPrises)
                .soldePermissionsRestant(soldePermissionsRestant)
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
        return calculateJoursConge(start, end, null);
    }

    public int calculateJoursConge(LocalDate start, LocalDate end, TypeAbsenceConge typeAbsence) {
        if (start == null || end == null) return 0;
        if (end.isBefore(start)) return 0;

        com.bpbf.sirh_backend.entities.ParametrageConge config = parametrageCongeRepository.findAll().stream().findFirst()
                .orElseGet(com.bpbf.sirh_backend.entities.ParametrageConge::new);

        String typeJourConfig = (typeAbsence != null && typeAbsence.getTypeJour() != null && !typeAbsence.getTypeJour().isBlank())
                ? typeAbsence.getTypeJour().toUpperCase()
                : null;

        String mode = typeJourConfig != null ? typeJourConfig : (config.getModeDecompte() != null ? config.getModeDecompte().toUpperCase() : "OUVRABLE_5J");
        boolean checkFeries = Boolean.TRUE.equals(config.getDeduireJoursFeries());

        int workingDays = 0;
        LocalDate current = start;
        while (!current.isAfter(end)) {
            DayOfWeek day = current.getDayOfWeek();
            boolean isExcludedDay = false;

            if ("OUVRE".equals(mode) || "OUVRABLE_5J".equals(mode)) {
                // Jours ouvrés : 5 jours/semaine (exclut Samedi et Dimanche)
                isExcludedDay = (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY);
            } else if ("OUVRABLE".equals(mode) || "OUVRABLE_6J".equals(mode)) {
                // Jours ouvrables : 6 jours/semaine (compte le Samedi, exclut uniquement le Dimanche)
                isExcludedDay = (day == DayOfWeek.SUNDAY);
            } else if ("CALENDAIRE".equals(mode)) {
                // Jours calendaires : 7 jours/semaine
                isExcludedDay = false;
            } else {
                isExcludedDay = (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY);
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
                            LocalDate cDebut = parseDateRobust(c.getDateDebut());
                            LocalDate cFin = parseDateRobust(c.getDateFin());
                            if (cDebut != null && cFin != null && !cDebut.isAfter(fin) && !cFin.isBefore(debut)) {
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
            "03-08", // Journée Internationale des Droits de la Femme
            "05-01", // Fête du Travail
            "05-15", // Journée des Coutumes et Traditions
            "08-15", // Assomption
            "12-11", // Fête Nationale
            "12-25"  // Noël
    );

    private boolean isBurkinaFasoFixedHoliday(LocalDate date) {
        if (date == null) return false;
        String mmDd = String.format("%02d-%02d", date.getMonthValue(), date.getDayOfMonth());
        return FERIES_FIXES_BF.contains(mmDd);
    }

    public static LocalDate parseDateRobust(String dStr) {
        if (dStr == null || dStr.isBlank()) return null;
        String clean = dStr.trim();
        try {
            if (clean.contains("T")) {
                clean = clean.substring(0, clean.indexOf("T"));
            }
            if (clean.contains("/")) {
                String[] parts = clean.split("/");
                if (parts.length == 3) {
                    if (parts[2].length() == 4) { // DD/MM/YYYY
                        return LocalDate.of(Integer.parseInt(parts[2]), Integer.parseInt(parts[1]), Integer.parseInt(parts[0]));
                    } else if (parts[0].length() == 4) { // YYYY/MM/DD
                        return LocalDate.of(Integer.parseInt(parts[0]), Integer.parseInt(parts[1]), Integer.parseInt(parts[2]));
                    }
                }
            }
            return LocalDate.parse(clean);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Ouvre automatiquement les sessions "Différentiel Maternité" au statut NON_TRAITE
     * pour chacun des mois couverts par le congé de maternité approuvé.
     */
    @Transactional
    public void autoCreateMaterniteSessions(Conge conge) {
        if (conge == null) return;
        try {
            LocalDate start = parseDateRobust(conge.getDateDebut());
            LocalDate end = parseDateRobust(conge.getDateFin());
            if (start == null || end == null || start.isAfter(end)) return;

            LocalDate current = start.withDayOfMonth(1);
            LocalDate endMonth = end.withDayOfMonth(1);

            String[] moisNoms = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};

            while (!current.isAfter(endMonth)) {
                int annee = current.getYear();
                int moisNum = current.getMonthValue();
                String moisStr = String.format("%02d", moisNum);
                String nomMois = (moisNum >= 1 && moisNum <= 12) ? moisNoms[moisNum - 1] : "Mois " + moisNum;

                // Vérifier si une session Différentiel Maternité existe déjà pour ce mois et cette année
                boolean exists = sessionPaieRepository.findAll().stream().anyMatch(s -> {
                    if (s.getAnnee() == null || !s.getAnnee().equals(annee)) return false;
                    int sMois = 0;
                    try { sMois = Integer.parseInt(s.getMois().trim()); } catch (Exception ignored) {}
                    if (sMois != moisNum) return false;
                    String nature = s.getNatureSession() != null ? s.getNatureSession().toUpperCase() : "";
                    String sNom = s.getName() != null ? s.getName().toUpperCase() : "";
                    String sCode = s.getCodeSession() != null ? s.getCodeSession().toUpperCase() : "";
                    return nature.contains("MATERNITE") || sNom.contains("MATERNITE") || sCode.contains("MATERNITE");
                });

                if (!exists) {
                    com.bpbf.sirh_backend.entities.SessionPaie session = new com.bpbf.sirh_backend.entities.SessionPaie();
                    session.setAnnee(annee);
                    session.setMois(moisStr);
                    session.setTypeSession("EXTRAORDINAIRE");
                    session.setNatureSession("DIFFERENTIEL_MATERNITE");
                    session.setStatut("NON_TRAITE");
                    session.setName("Différentiel Maternité - " + nomMois + " " + annee);
                    session.setPeriode(nomMois + " " + annee);

                    LocalDate dFrom = current;
                    LocalDate dTo = current.withDayOfMonth(current.lengthOfMonth());
                    session.setDateFrom(dFrom);
                    session.setDateTo(dTo);

                    String baseCode = String.format("SESS-%d-%s-MATERNITE", annee, moisStr);
                    String candidateCode = baseCode;
                    int suffix = 1;
                    while (sessionPaieRepository.findByCodeSession(candidateCode).isPresent()) {
                        candidateCode = String.format("%s-%d", baseCode, suffix++);
                    }
                    session.setCodeSession(candidateCode);
                    session.setNombreEmployes(0);
                    session.setTotalBrut(java.math.BigDecimal.ZERO);
                    session.setTotalNet(java.math.BigDecimal.ZERO);
                    session.setTotalCotisationsPatronales(java.math.BigDecimal.ZERO);
                    session.setTotalMasseSalariale(java.math.BigDecimal.ZERO);

                    sessionPaieRepository.save(session);
                    log.info("Session Différentiel Maternité créée automatiquement : {} (statut: NON_TRAITE) suite au congé #{}",
                            candidateCode, conge.getId());
                }

                current = current.plusMonths(1);
            }
        } catch (Exception e) {
            log.error("Erreur lors de la création automatique des sessions de maternité : {}", e.getMessage(), e);
        }
    }

    /**
     * Synchronise et crée les sessions NON_TRAITE pour tous les congés maternité déjà approuvés en base.
     */
    @Transactional
    public void synchroniserSessionsMaterniteEnAttente() {
        try {
            List<Conge> conges = congeRepository.findAll();
            for (Conge c : conges) {
                if (c == null) continue;
                String st = c.getStatut() != null ? c.getStatut().toUpperCase() : "";
                if (st.equals("APPROUVE") || st.equals("VALIDE") || st.equals("ACCEPTE") || st.equals("EN_COURS")) {
                    TypeAbsenceConge tac = c.getTypeAbsenceConge();
                    String cCode = tac != null && tac.getCode() != null ? tac.getCode().toUpperCase() : "";
                    String cNom = (tac != null && tac.getName() != null ? tac.getName() : (c.getType() != null ? c.getType() : "")).toUpperCase();
                    if (cCode.contains("MATERNITE") || cNom.contains("MATERNITE") || cNom.contains("MATERNITÉ")) {
                        autoCreateMaterniteSessions(c);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Erreur lors de la synchronisation des sessions maternité en attente : {}", e.getMessage());
        }
    }

    /**
     * Désactive automatiquement le compte utilisateur d'un employé lors de la validation DRH de son congé.
     */
    @Transactional
    public void desactiverCompteUtilisateurPendantConge(Conge conge) {
        if (conge == null) return;
        Employee emp = conge.getEmployee();
        if (emp == null && conge.getId() != null) {
            Conge fresh = congeRepository.findById(conge.getId()).orElse(null);
            if (fresh != null) emp = fresh.getEmployee();
        }
        if (emp == null) return;

        final String matricule = emp.getMatricule() != null ? emp.getMatricule().trim() : "";
        final String email = emp.getEmail() != null ? emp.getEmail().trim().toLowerCase() : "";

        utilisateurRepository.findAll().stream()
                .filter(u -> (!matricule.isEmpty() && u.getUsername() != null && u.getUsername().equalsIgnoreCase(matricule))
                          || (!email.isEmpty() && u.getEmail() != null && u.getEmail().equalsIgnoreCase(email)))
                .findFirst()
                .ifPresent(u -> {
                    u.setActif(false);
                    utilisateurRepository.save(u);
                    log.info("Sécurité congé : Compte utilisateur '{}' automatiquement désactivé suite à validation DRH (congé #{} jusqu'au {})",
                            u.getUsername(), conge.getId(), conge.getDateFin());
                });
    }

    /**
     * Vérifie si un compte utilisateur doit être réactivé (congé terminé) ou maintenu désactivé (congé en cours).
     */
    @Transactional
    public void verifierStatutCompteConge(com.bpbf.sirh_backend.entities.Utilisateur u) {
        if (u == null) return;
        final String login = u.getUsername() != null ? u.getUsername().trim() : "";
        final String email = u.getEmail() != null ? u.getEmail().trim() : "";

        Employee emp = employeeRepository.findAll().stream()
                .filter(e -> (!login.isEmpty() && e.getMatricule() != null && e.getMatricule().equalsIgnoreCase(login))
                          || (!email.isEmpty() && e.getEmail() != null && e.getEmail().equalsIgnoreCase(email)))
                .findFirst()
                .orElse(null);

        if (emp == null || emp.getId() == null) return;

        LocalDate today = LocalDate.now();
        List<Conge> conges = congeRepository.findByEmployeeId(emp.getId());

        boolean enCongeActuellement = false;

        for (Conge c : conges) {
            String st = c.getStatut() != null ? c.getStatut().toUpperCase() : "";
            if (st.equals("APPROUVE") || st.equals("VALIDE") || st.equals("EN_COURS")) {
                LocalDate start = parseDateRobust(c.getDateDebut());
                LocalDate end = parseDateRobust(c.getDateFin());
                if (start != null && end != null) {
                    if (!today.isBefore(start) && !today.isAfter(end)) {
                        enCongeActuellement = true;
                        break;
                    }
                }
            }
        }

        if (enCongeActuellement) {
            if (u.isActif()) {
                u.setActif(false);
                utilisateurRepository.save(u);
            }
            if (!"EN_CONGE".equalsIgnoreCase(emp.getStatut())) {
                emp.setStatut("EN_CONGE");
                employeeRepository.save(emp);
            }
        } else {
            // Si l'employé n'est plus en congé et que son compte était inactif
            if (!u.isActif() && !"Inactif".equalsIgnoreCase(emp.getStatut()) && !"Suspendu".equalsIgnoreCase(emp.getStatut())) {
                u.setActif(true);
                utilisateurRepository.save(u);
                if ("EN_CONGE".equalsIgnoreCase(emp.getStatut())) {
                    emp.setStatut("ACTIF");
                    employeeRepository.save(emp);
                }
                log.info("Réactivation automatique du compte utilisateur '{}' : la période de congé est achevée.", u.getUsername());
            }
        }
    }

    /**
     * Retourne le motif de suspension si l'utilisateur est actuellement sous congé approuvé.
     */
    @Transactional(readOnly = true)
    public String getMotifSuspensionCongeSiActif(com.bpbf.sirh_backend.entities.Utilisateur u) {
        if (u == null) return null;
        final String login = u.getUsername() != null ? u.getUsername().trim() : "";
        final String email = u.getEmail() != null ? u.getEmail().trim() : "";

        Employee emp = employeeRepository.findAll().stream()
                .filter(e -> (!login.isEmpty() && e.getMatricule() != null && e.getMatricule().equalsIgnoreCase(login))
                          || (!email.isEmpty() && e.getEmail() != null && e.getEmail().equalsIgnoreCase(email)))
                .findFirst()
                .orElse(null);

        if (emp == null || emp.getId() == null) return null;

        LocalDate today = LocalDate.now();
        List<Conge> conges = congeRepository.findByEmployeeId(emp.getId());

        for (Conge c : conges) {
            String st = c.getStatut() != null ? c.getStatut().toUpperCase() : "";
            if (st.equals("APPROUVE") || st.equals("VALIDE") || st.equals("EN_COURS")) {
                LocalDate start = parseDateRobust(c.getDateDebut());
                LocalDate end = parseDateRobust(c.getDateFin());
                if (start != null && end != null && !today.isBefore(start) && !today.isAfter(end)) {
                    return "Compte utilisateur temporairement suspendu pour cause de congé en cours jusqu'au " + c.getDateFin() + ".";
                }
            }
        }
        return null;
    }
}
