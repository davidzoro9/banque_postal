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

    public SessionPaieController(SessionPaieRepository sessionPaieRepository,
                                 com.bpbf.sirh_backend.services.BulletinService bulletinService,
                                 com.bpbf.sirh_backend.repositories.BulletinRepository bulletinRepository) {
        this.sessionPaieRepository = sessionPaieRepository;
        this.bulletinService = bulletinService;
        this.bulletinRepository = bulletinRepository;
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

            // Pour extraordinaire : libellé de la session obligatoire
            if ("EXTRAORDINAIRE".equals(type)) {
                if (session.getName() == null || session.getName().trim().isBlank()) {
                    throw new IllegalArgumentException("Le libellé de la session extraordinaire est obligatoire.");
                }
            }

            if (session.getPeriode() == null || session.getPeriode().isBlank()) {
                String[] moisNoms = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};
                int mIdx = 0;
                try {
                    mIdx = Integer.parseInt(session.getMois()) - 1;
                } catch (Exception ignored) {}
                String nomMois = (mIdx >= 0 && mIdx < 12) ? moisNoms[mIdx] : "Mois " + session.getMois();
                if ("EXTRAORDINAIRE".equals(type)) {
                    session.setPeriode(session.getName() != null ? session.getName() : "Session Extraordinaire " + nomMois + " " + session.getAnnee());
                } else {
                    session.setPeriode(nomMois + " " + session.getAnnee());
                }
            }

            if (session.getName() == null || session.getName().isBlank()) {
                session.setName(session.getPeriode());
            }

            String baseCode = session.getCodeSession() != null && !session.getCodeSession().isBlank()
                    ? session.getCodeSession()
                    : String.format("SESS-%d-%s%s", session.getAnnee(), session.getMois(), "EXTRAORDINAIRE".equals(type) ? "-EXT" : "");

            String candidateCode = baseCode;
            int suffix = 1;
            while (sessionPaieRepository.findByCodeSession(candidateCode).isPresent()) {
                candidateCode = String.format("%s-%d", baseCode, suffix++);
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
    public ResponseEntity<SessionPaie> cloturerSession(@PathVariable Long id, @RequestParam(required = false) String user) {
        return sessionPaieRepository.findById(id).map(session -> {
            session.setStatut("CLOTURE");
            session.setDateCloture(LocalDateTime.now());
            if (user != null) {
                session.setCloturePar(user);
            }
            return ResponseEntity.ok(sessionPaieRepository.save(session));
        }).orElse(ResponseEntity.notFound().build());
    }
}
