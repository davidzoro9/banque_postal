package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.SessionPaie;
import com.bpbf.sirh_backend.repositories.SessionPaieRepository;
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
        List<SessionPaie> list = sessionPaieRepository.findAllByOrderByAnneeDescMoisDesc();
        for (SessionPaie s : list) {
            enrichSessionMetrics(s);
        }
        return list;
    }

    @GetMapping("/maternite-eligibles")
    public ResponseEntity<List<com.bpbf.sirh_backend.dtos.EmployeeDto>> getFemmesEnCongeMaternite(
            @RequestParam(required = false) String mois,
            @RequestParam(required = false) Integer annee) {
        int m = (mois != null && !mois.isBlank()) ? com.bpbf.sirh_backend.services.BulletinService.parseMois(mois) : java.time.LocalDate.now().getMonthValue();
        int a = (annee != null && annee > 0) ? annee : java.time.LocalDate.now().getYear();

        java.time.LocalDate debut = java.time.LocalDate.of(a, m, 1);
        java.time.LocalDate fin = debut.withDayOfMonth(debut.lengthOfMonth());

        List<com.bpbf.sirh_backend.entities.Employee> eligibles = employeeRepository.findAll().stream()
                .filter(bulletinService::isEmployeeEligiblePaie)
                .filter(congeWorkflowService::isFeminin)
                .filter(emp -> congeWorkflowService.isEmployeeOnApprovedMaternite(emp.getId(), debut, fin))
                .toList();

        return ResponseEntity.ok(employeeMapper.toDtos(eligibles));
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
                    } else if (n.contains("MATERNITE") || n.contains("MATERNITÉ")) {
                        session.setNatureSession("DIFFERENTIEL_MATERNITE");
                    } else {
                        session.setNatureSession("TREIZIEME_MOIS");
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
}
