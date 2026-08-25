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

    public SessionPaieController(SessionPaieRepository sessionPaieRepository) {
        this.sessionPaieRepository = sessionPaieRepository;
    }

    @GetMapping
    public List<SessionPaie> getAllSessions() {
        return sessionPaieRepository.findAllByOrderByAnneeDescMoisDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionPaie> getSessionById(@PathVariable Long id) {
        return sessionPaieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SessionPaie> createOrUpdateSession(@RequestBody SessionPaie session) {
        if (session.getMois() != null && session.getAnnee() != null) {
            sessionPaieRepository.findByMoisAndAnnee(session.getMois(), session.getAnnee())
                    .ifPresent(existing -> session.setId(existing.getId()));
        }
        SessionPaie saved = sessionPaieRepository.save(session);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<SessionPaie> validerSession(@PathVariable Long id) {
        return sessionPaieRepository.findById(id).map(session -> {
            session.setStatut("VALIDE");
            session.setDateValidation(LocalDateTime.now());
            return ResponseEntity.ok(sessionPaieRepository.save(session));
        }).orElse(ResponseEntity.notFound().build());
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
