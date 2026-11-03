package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.SessionPaie;
import com.bpbf.sirh_backend.repositories.SessionPaieRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/paie/sessions")
@CrossOrigin(origins = "*")
public class SessionPaieController {

    private final SessionPaieRepository sessionPaieRepository;
    private final com.bpbf.sirh_backend.services.BulletinService bulletinService;
    private final com.bpbf.sirh_backend.repositories.BulletinRepository bulletinRepository;
    private final com.bpbf.sirh_backend.repositories.EmployeeRepository employeeRepository;
    private final com.bpbf.sirh_backend.services.CongeWorkflowService congeWorkflowService;
    private final com.bpbf.sirh_backend.mappers.EmployeeMapper employeeMapper;

    public SessionPaieController(SessionPaieRepository sessionPaieRepository,
                                 com.bpbf.sirh_backend.services.BulletinService bulletinService,
                                 com.bpbf.sirh_backend.repositories.BulletinRepository bulletinRepository,
                                 com.bpbf.sirh_backend.repositories.EmployeeRepository employeeRepository,
                                 com.bpbf.sirh_backend.services.CongeWorkflowService congeWorkflowService,
                                 com.bpbf.sirh_backend.mappers.EmployeeMapper employeeMapper) {
        this.sessionPaieRepository = sessionPaieRepository;
        this.bulletinService = bulletinService;
        this.bulletinRepository = bulletinRepository;
        this.employeeRepository = employeeRepository;
        this.congeWorkflowService = congeWorkflowService;
        this.employeeMapper = employeeMapper;
    }

    private void enrichSessionMetrics(SessionPaie s) {
        if (s == null || s.getId() == null) return;
        long count = bulletinRepository.countBySessionPaieId(s.getId());
        java.math.BigDecimal brut = bulletinRepository.sumSalaireBrutBySessionPaieId(s.getId());
        java.math.BigDecimal net = bulletinRepository.sumSalaireNetBySessionPaieId(s.getId());
        java.math.BigDecimal patronale = bulletinRepository.sumCotisationsPatronalesBySessionPaieId(s.getId());

        s.setNombreEmployes((int) count);
        s.setTotalBrut(brut != null ? brut : java.math.BigDecimal.ZERO);
        s.setTotalNet(net != null ? net : java.math.BigDecimal.ZERO);
        s.setTotalCotisationsPatronales(patronale != null ? patronale : java.math.BigDecimal.ZERO);
        s.setTotalMasseSalariale((brut != null ? brut : java.math.BigDecimal.ZERO).add(patronale != null ? patronale : java.math.BigDecimal.ZERO));
    }

    @GetMapping
    public List<SessionPaie> getAllSessions() {
        // NOTE RÈGLE MÉTIER : Ne plus synchroniser automatiquement les sessions maternité à chaque GET,
        // afin de permettre à l'utilisateur de supprimer définitivement les sessions reliquat non voulues.
        List<SessionPaie> list = sessionPaieRepository.findAllByOrderByAnneeDescMoisDesc();
        for (SessionPaie s : list) {
            enrichSessionMetrics(s);
        }
        return list;
    }

    @PostMapping("/synchroniser-maternite")
    public ResponseEntity<java.util.Map<String, Object>> synchroniserMaternite() {
        try {
            congeWorkflowService.synchroniserSessionsMaterniteEnAttente();
            return ResponseEntity.ok(java.util.Map.of("message", "Sessions maternité synchronisées avec succès."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Erreur lors de la synchronisation : " + e.getMessage()));
        }
    }

    @GetMapping("/maternite-eligibles")
    public ResponseEntity<List<com.bpbf.sirh_backend.dtos.EmployeeDto>> getFemmesEnCongeMaternite(
            @RequestParam(required = false) String mois,
            @RequestParam(required = false) Integer annee,
            @RequestParam(required = false) Long sessionId) {
        int m = (mois != null && !mois.isBlank()) ? com.bpbf.sirh_backend.services.BulletinService.parseMois(mois) : java.time.LocalDate.now().getMonthValue();
        int a = (annee != null && annee > 0) ? annee : java.time.LocalDate.now().getYear();

        if (sessionId != null) {
            SessionPaie s = sessionPaieRepository.findById(sessionId).orElse(null);
            if (s != null) {
                if (s.getMois() != null && !s.getMois().isBlank()) {
                    m = com.bpbf.sirh_backend.services.BulletinService.parseMois(s.getMois());
                }
                if (s.getAnnee() != null && s.getAnnee() > 0) {
                    a = s.getAnnee();
                }
            }
        }

        java.time.LocalDate debut = java.time.LocalDate.of(a, m, 1);
        java.time.LocalDate fin = debut.withDayOfMonth(debut.lengthOfMonth());

        final java.math.BigDecimal plafondMaterniteCnss = new java.math.BigDecimal("800000.00");

        // RÈGLE MÉTIER RELIQUAT : Seules les collaboratrices en congé de maternité avec rémunération brute > 800 000 FCFA
        List<com.bpbf.sirh_backend.entities.Employee> eligibles = employeeRepository.findAll().stream()
                .filter(bulletinService::isEmployeeEligiblePaie)
                .filter(congeWorkflowService::isFeminin)
                .filter(emp -> congeWorkflowService.isEmployeeOnApprovedMaternite(emp.getId(), debut, fin))
                .filter(emp -> {
                    java.math.BigDecimal remu = bulletinService.calculateRemunerationBruteTheorique(emp, debut);
                    return remu != null && remu.compareTo(plafondMaterniteCnss) > 0;
                })
                .toList();

        List<com.bpbf.sirh_backend.dtos.EmployeeDto> dtos = new java.util.ArrayList<>();
        for (com.bpbf.sirh_backend.entities.Employee emp : eligibles) {
            com.bpbf.sirh_backend.dtos.EmployeeDto dto = employeeMapper.toDto(emp);
            java.math.BigDecimal remu = bulletinService.calculateRemunerationBruteTheorique(emp, debut);
            java.math.BigDecimal surplus = remu.subtract(plafondMaterniteCnss).max(java.math.BigDecimal.ZERO);
            dto.setSalaireBrut(remu.doubleValue()); // Rémunération normale brute
            dto.setSurSalaire(surplus.doubleValue()); // Le Reliquat (Surplus au-delà de 800 000 F)
            dtos.add(dto);
        }

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionPaie> getSessionById(@PathVariable Long id) {
        return sessionPaieRepository.findById(id)
                .map(s -> {
                    enrichSessionMetrics(s);
                    return ResponseEntity.ok(s);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SessionPaie> createOrUpdateSession(@RequestBody SessionPaie session) {
        if (session.getId() == null) {
            if (session.getMois() == null || session.getMois().isBlank()) {
                session.setMois(String.format("%02d", java.time.LocalDate.now().getMonthValue()));
            }
            if (session.getAnnee() == null) {
                session.setAnnee(java.time.LocalDate.now().getYear());
            }

            // Normalisation du type de session en ORDINAIRE ou EXTRAORDINAIRE
            String type = session.getTypeSession() != null ? session.getTypeSession().trim().toUpperCase(java.util.Locale.ROOT) : "ORDINAIRE";
            if (type.contains("EXTRA")) {
                type = "EXTRAORDINAIRE";
            } else if (type.contains("GRATIF")) {
                type = "GRATIFICATION";
            } else {
                type = "ORDINAIRE";
            }
            session.setTypeSession(type);

            // Vérification : Une seule session ordinaire par mois
            if ("ORDINAIRE".equals(type)) {
                String moisFormatted = String.format("%02d", Integer.parseInt(session.getMois().trim()));
                boolean exists = sessionPaieRepository.findAll().stream()
                        .anyMatch(s -> s.getAnnee() != null && s.getAnnee().equals(session.getAnnee()) &&
                                s.getMois() != null && String.format("%02d", Integer.parseInt(s.getMois().trim())).equals(moisFormatted) &&
                                ("ORDINAIRE".equalsIgnoreCase(s.getTypeSession()) || "PAIE_NORMALE".equalsIgnoreCase(s.getTypeSession()) || "NORMALE".equalsIgnoreCase(s.getTypeSession())));
                if (exists) {
                    throw new IllegalArgumentException("Une session ordinaire existe déjà pour la période " + session.getMois() + "/" + session.getAnnee() + ". Une seule session ordinaire par mois est autorisée.");
                }
            }

            // Pour extraordinaire : libellé de la session obligatoire et nature de la session
            if ("EXTRAORDINAIRE".equals(type)) {
                if (session.getName() == null || session.getName().trim().isBlank()) {
                    throw new IllegalArgumentException("Le libellé de la session extraordinaire est obligatoire.");
                }
                if (session.getNatureSession() == null || session.getNatureSession().isBlank()) {
                    String n = session.getName().toUpperCase(java.util.Locale.ROOT);
                    if (n.contains("14") || n.contains("QUATORZIEME")) {
                        session.setNatureSession("QUATORZIEME_MOIS");
                    } else if (n.contains("CONGE") || n.contains("CONGÉ")) {
                        session.setNatureSession("CONGE_PAYE");
                    } else if (n.contains("RETRAITE")) {
                        session.setNatureSession("INDEMNITE_RETRAITE");
                    } else if (n.contains("STC") || n.contains("SOLDE")) {
                        session.setNatureSession("STC");
                    } else if (n.contains("MATERNITE") || n.contains("MATERNITÉ") || n.contains("RELIQUAT")) {
                        session.setNatureSession("RELIQUAT");
                    } else {
                        session.setNatureSession("TREIZIEME_MOIS");
                    }
                } else if ("DIFFERENTIEL_MATERNITE".equalsIgnoreCase(session.getNatureSession())) {
                    session.setNatureSession("RELIQUAT");
                }

                boolean is1314 = session.getNatureSession() != null &&
                        (session.getNatureSession().contains("13") || session.getNatureSession().contains("TREIZIEME") ||
                         session.getNatureSession().contains("14") || session.getNatureSession().contains("QUATORZIEME"));
                if (is1314) {
                    int an = session.getAnnee() != null ? session.getAnnee() : java.time.LocalDate.now().getYear();
                    session.setDateFrom(java.time.LocalDate.of(an, 1, 1));
                    session.setDateTo(java.time.LocalDate.of(an, 12, 31));
                    if (session.getMois() == null || session.getMois().isBlank()) {
                        session.setMois("12");
                    }
                    if (session.getPeriode() == null || session.getPeriode().isBlank() || session.getPeriode().contains("/")) {
                        boolean is14 = session.getNatureSession().contains("14") || session.getNatureSession().contains("QUATORZIEME");
                        session.setPeriode((is14 ? "14ème Mois " : "13ème Mois ") + an);
                    }
                }
            }

            String[] moisNoms = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};
            int mIdx = 0;
            try {
                mIdx = Integer.parseInt(session.getMois()) - 1;
            } catch (Exception ignored) {}
            String nomMois = (mIdx >= 0 && mIdx < 12) ? moisNoms[mIdx] : "Mois " + session.getMois();
            String periodeDefaut = nomMois + " " + session.getAnnee();

            if (session.getPeriode() == null || session.getPeriode().isBlank() || session.getPeriode().length() > 50) {
                session.setPeriode(periodeDefaut);
            }

            if (session.getName() == null || session.getName().isBlank()) {
                session.setName(session.getPeriode());
            } else if (session.getName().length() > 50) {
                session.setName(session.getName().substring(0, 50));
            }

            String baseCode = session.getCodeSession() != null && !session.getCodeSession().isBlank()
                    ? session.getCodeSession()
                    : String.format("SESS-%d-%s%s", session.getAnnee(), session.getMois(), "EXTRAORDINAIRE".equals(type) ? "-EXT" : "");

            if (baseCode.length() > 45) {
                baseCode = baseCode.substring(0, 45);
            }

            String candidateCode = baseCode;
            int suffix = 1;
            while (sessionPaieRepository.findByCodeSession(candidateCode).isPresent()) {
                candidateCode = String.format("%s-%d", baseCode, suffix++);
            }
            if (candidateCode.length() > 50) {
                candidateCode = candidateCode.substring(0, 50);
            }
            session.setCodeSession(candidateCode);
            if (session.getStatut() == null) {
                session.setStatut("BROUILLON");
            }
        }
        SessionPaie saved = sessionPaieRepository.save(session);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/generer")
    public ResponseEntity<List<com.bpbf.sirh_backend.dtos.BulletinDto>> genererBulletinsSession(
            @PathVariable Long id,
            @RequestBody(required = false) List<Long> employeeIds) {
        List<com.bpbf.sirh_backend.dtos.BulletinDto> bulletins = bulletinService.generateBulletinsForSession(id, employeeIds);
        return ResponseEntity.ok(bulletins);
    }

    @GetMapping("/{id}/bulletins")
    public ResponseEntity<List<com.bpbf.sirh_backend.dtos.BulletinDto>> getBulletinsSession(@PathVariable Long id) {
        return ResponseEntity.ok(bulletinService.getBulletinsBySession(id));
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<SessionPaie> validerSession(@PathVariable Long id) {
        bulletinService.validateSession(id);
        return sessionPaieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cloturer")
    public ResponseEntity<SessionPaie> cloturerSession(@PathVariable Long id, 
                                                       @RequestParam(required = false) String user,
                                                       java.security.Principal principal) {
        return sessionPaieRepository.findById(id).map(session -> {
            if ("CLOTURE".equalsIgnoreCase(session.getStatut())) {
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.CONFLICT, "La session #" + id + " est déjà clôturée.");
            }
            if (!"VALIDE".equalsIgnoreCase(session.getStatut())) {
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.CONFLICT, "Action refusée : la session #" + id + " doit être validée avant d'être clôturée (statut actuel : " + session.getStatut() + ").");
            }
            session.setStatut("CLOTURE");
            session.setDateCloture(LocalDateTime.now());
            String auteur = (principal != null && principal.getName() != null && !principal.getName().isBlank())
                    ? principal.getName()
                    : user;
            if (auteur != null && !auteur.isBlank()) {
                session.setCloturePar(auteur);
            }
            return ResponseEntity.ok(sessionPaieRepository.save(session));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/non-validees")
    public ResponseEntity<java.util.Map<String, Object>> deleteAllUnvalidatedSessions() {
        int count = bulletinService.deleteAllUnvalidatedSessions();
        return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", count + " session(s) non validée(s) supprimée(s) avec succès.",
                "count", count
        ));
    }

    @PutMapping("/tout-reinitialiser-validees")
    public ResponseEntity<java.util.Map<String, Object>> resetAllValidatedSessions() {
        int count = bulletinService.resetAllValidatedSessions();
        return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", count + " session(s) validée(s) réinitialisée(s) avec succès (GÉNÉRÉ).",
                "count", count
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        bulletinService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/reinitialiser")
    public ResponseEntity<SessionPaie> reinitialiserSession(@PathVariable Long id) {
        SessionPaie session = bulletinService.devaliderSession(id);
        enrichSessionMetrics(session);
        return ResponseEntity.ok(session);
    }

    @PutMapping("/{id}/devalider")
    public ResponseEntity<SessionPaie> devaliderSession(@PathVariable Long id) {
        SessionPaie session = bulletinService.devaliderSession(id);
        enrichSessionMetrics(session);
        return ResponseEntity.ok(session);
    }
}
