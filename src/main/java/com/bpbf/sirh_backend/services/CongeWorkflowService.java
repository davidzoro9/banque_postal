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
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

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

    @Transactional
    public Conge createConge(Conge conge) {
        if (conge.getEmployee() != null && conge.getEmployee().getId() != null) {
            Employee emp = employeeRepository.findById(conge.getEmployee().getId()).orElse(null);
            conge.setEmployee(emp);
        }

        if (conge.getTypeAbsenceConge() != null) {
            TypeAbsenceConge type = null;
            if (conge.getTypeAbsenceConge().getId() != null) {
                type = typeAbsenceCongeRepository.findById(conge.getTypeAbsenceConge().getId()).orElse(null);
            }
            if (type == null && conge.getTypeAbsenceConge().getCode() != null) {
                type = typeAbsenceCongeRepository.findByCode(conge.getTypeAbsenceConge().getCode()).orElse(null);
            }
            if (type == null && conge.getTypeAbsenceConge().getName() != null) {
                String code = conge.getTypeAbsenceConge().getCode() != null ? conge.getTypeAbsenceConge().getCode() : "CONGE_" + System.currentTimeMillis();
                try {
                    TypeAbsenceConge newType = new TypeAbsenceConge();
                    newType.setCode(code);
                    newType.setName(conge.getTypeAbsenceConge().getName());
                    type = typeAbsenceCongeRepository.save(newType);
                } catch (Exception e) {
                    try {
                        Long nextId = jdbcTemplate.queryForObject("SELECT COALESCE(MAX(id), 0) + 1 FROM type_absence_conge", Long.class);
                        jdbcTemplate.update("INSERT INTO type_absence_conge (id, code, name) VALUES (?, ?, ?)", nextId, code, conge.getTypeAbsenceConge().getName());
                        type = typeAbsenceCongeRepository.findByCode(code).orElse(null);
                    } catch (Exception ignored) {}
                }
            }
            conge.setTypeAbsenceConge(type);
        }

        // Calcul automatique du nombre de jours ouvrables si non spécifié ou si dates valides
        if (conge.getDateDebut() != null && conge.getDateFin() != null) {
            try {
                LocalDate start = LocalDate.parse(conge.getDateDebut());
                LocalDate end = LocalDate.parse(conge.getDateFin());
                int calculatedDays = calculateJoursOuvrables(start, end);
                if (conge.getNbJours() == null || conge.getNbJours() <= 0) {
                    conge.setNbJours(calculatedDays);
                }
            } catch (Exception e) {
                log.warn("Impossible de parser les dates de congé : {} / {}", conge.getDateDebut(), conge.getDateFin());
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

        if (conge.getStatut() == null || conge.getStatut().isBlank()) {
            conge.setStatut("EN_ATTENTE");
        }

        // Enregistrer le solde avant la demande
        if (conge.getEmployee() != null && conge.getEmployee().getId() != null) {
            try {
                SoldeCongeDto solde = getSoldeForEmployee(conge.getEmployee().getId());
                if (solde != null && solde.getSoldeRestant() != null) {
                    conge.setSoldeAvantDemande(solde.getSoldeRestant().intValue());
                    int nbJours = conge.getNbJours() != null ? conge.getNbJours() : 0;
                    conge.setSoldeApresDemande(Math.max(0, solde.getSoldeRestant().intValue() - nbJours));
                }
            } catch (Exception e) {
                log.warn("Erreur calcul solde pour employé : {}", e.getMessage());
                conge.setSoldeAvantDemande(30);
                conge.setSoldeApresDemande(Math.max(0, 30 - (conge.getNbJours() != null ? conge.getNbJours() : 0)));
            }
        }

        try {
            return congeRepository.save(conge);
        } catch (Exception e) {
            log.error("JPA conge save failed: {}, applying safe fallback SQL insert...", e.getMessage());
            try {
                Long nextId = jdbcTemplate.queryForObject("SELECT COALESCE(MAX(id), 0) + 1 FROM conge", Long.class);
                conge.setId(nextId);
                Long empId = conge.getEmployee() != null ? conge.getEmployee().getId() : null;
                Long tacId = conge.getTypeAbsenceConge() != null ? conge.getTypeAbsenceConge().getId() : null;
                jdbcTemplate.update(
                    "INSERT INTO conge (id, employee_id, type_absence_conge_id, date_debut, date_fin, nb_jours, motif, justificatif, date_demande, date_validation, valide_par, motif_refus, solde_avant_demande, solde_apres_demande, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    nextId, empId, tacId, conge.getDateDebut(), conge.getDateFin(), conge.getNbJours(), conge.getMotif(), conge.getJustificatif(), conge.getDateDemande(), conge.getDateValidation(), conge.getValidePar(), conge.getMotifRefus(), conge.getSoldeAvantDemande(), conge.getSoldeApresDemande(), conge.getStatut()
                );
                return conge;
            } catch (Exception ex) {
                log.error("Fallback SQL insert conge failed: {}", ex.getMessage());
                throw new RuntimeException("Erreur lors de l'enregistrement de la demande de congé : " + ex.getMessage());
            }
        }
    }

    @Transactional
    public Conge approuverConge(Long id, String validePar) {
        Conge conge = getCongeById(id);
        conge.setStatut("APPROUVE");
        conge.setDateValidation(LocalDate.now().format(ISO_FORMATTER));
        conge.setValidePar(validePar != null && !validePar.isBlank() ? validePar : "DRH / Supérieur Hiérarchique");
        conge.setMotifRefus(null);

        // Si la date du jour est dans la plage de congé, mettre à jour le statut de l'employé
        try {
            LocalDate now = LocalDate.now();
            LocalDate start = LocalDate.parse(conge.getDateDebut());
            LocalDate end = LocalDate.parse(conge.getDateFin());
            if (!now.isBefore(start) && !now.isAfter(end) && conge.getEmployee() != null) {
                conge.getEmployee().setStatut("EN_CONGE");
                employeeRepository.save(conge.getEmployee());
            }
        } catch (Exception ignored) {}

        return congeRepository.save(conge);
    }

    @Transactional
    public Conge rejeterConge(Long id, String motifRefus, String rejetePar) {
        Conge conge = getCongeById(id);
        conge.setStatut("REJETE");
        conge.setDateValidation(LocalDate.now().format(ISO_FORMATTER));
        conge.setValidePar(rejetePar != null && !rejetePar.isBlank() ? rejetePar : "DRH / Supérieur Hiérarchique");
        conge.setMotifRefus(motifRefus != null && !motifRefus.isBlank() ? motifRefus : "Demande non conforme aux nécessités de service");
        return congeRepository.save(conge);
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
            if ("APPROUVE".equalsIgnoreCase(c.getStatut()) || "VALIDE".equalsIgnoreCase(c.getStatut())) {
                joursPris += j;
                if (dernierConge == null || (c.getDateDebut() != null && c.getDateDebut().compareTo(dernierConge) > 0)) {
                    dernierConge = c.getDateDebut();
                }
            } else if ("EN_ATTENTE".equalsIgnoreCase(c.getStatut()) || "SOUMIS".equalsIgnoreCase(c.getStatut())) {
                joursEnAttente += j;
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

    /**
     * Calcule le nombre de jours de congé entre deux dates selon les règles configurées (jours ouvrables/calendaires, fériés).
     */
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
            } else { // CALENDAIRE
                isExcludedDay = false;
            }

            // Vérifier si c'est un jour férié chômé payé au Burkina Faso
            String dateStr = current.format(ISO_FORMATTER);
            boolean isFerie = checkFeries && jourFerieRepository.findByDate(dateStr)
                    .map(jf -> Boolean.TRUE.equals(jf.getChomePaye()))
                    .orElse(false);

            if (!isExcludedDay && !isFerie) {
                workingDays++;
            }
            current = current.plusDays(1);
        }
        return Math.max(1, workingDays);
    }
}
