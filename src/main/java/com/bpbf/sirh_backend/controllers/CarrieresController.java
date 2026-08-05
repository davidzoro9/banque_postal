package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/carrieres")
@RequiredArgsConstructor
public class CarrieresController {

    private final CompetenceRepository competenceRepository;
    private final FormationCatalogueRepository catalogueRepository;
    private final FormationSessionRepository sessionRepository;
    private final EvaluationEntretienRepository evaluationRepository;
    private final MobiliteDemandeRepository mobiliteRepository;

    // --- Competences ---
    @GetMapping("/competences")
    public List<Competence> getCompetences() {
        return competenceRepository.findAll();
    }

    @PostMapping("/competences")
    public Competence addCompetence(@RequestBody Competence competence) {
        return competenceRepository.save(competence);
    }

    @DeleteMapping("/competences/{id}")
    public void deleteCompetence(@PathVariable Long id) {
        competenceRepository.deleteById(id);
    }

    // --- Catalogue ---
    @GetMapping("/catalogue")
    public List<FormationCatalogue> getCatalogue() {
        return catalogueRepository.findAll();
    }

    @PostMapping("/catalogue")
    public FormationCatalogue addCourse(@RequestBody FormationCatalogue course) {
        return catalogueRepository.save(course);
    }

    // --- Sessions ---
    @GetMapping("/sessions")
    public List<FormationSession> getSessions() {
        return sessionRepository.findAll();
    }

    @PostMapping("/sessions")
    public FormationSession scheduleSession(@RequestBody FormationSession session) {
        return sessionRepository.save(session);
    }

    @PatchMapping("/sessions/{id}")
    public FormationSession updateSessionStatus(@PathVariable Long id, @RequestParam String statut) {
        FormationSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session introuvable"));
        session.setStatut(statut);
        return sessionRepository.save(session);
    }

    // --- Evaluations ---
    @GetMapping("/evaluations")
    public List<EvaluationEntretien> getEvaluations() {
        return evaluationRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/evaluations")
    public EvaluationEntretien addEvaluation(@RequestBody EvaluationEntretien evaluation) {
        return evaluationRepository.save(evaluation);
    }

    // --- Mobilites ---
    @GetMapping("/mobilites")
    public List<MobiliteDemande> getMobilites() {
        return mobiliteRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/mobilites")
    public MobiliteDemande addMobility(@RequestBody MobiliteDemande mobility) {
        return mobiliteRepository.save(mobility);
    }

    @PatchMapping("/mobilites/{id}")
    public MobiliteDemande updateMobilityStatus(@PathVariable Long id, @RequestParam String statut) {
        MobiliteDemande mobility = mobiliteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande introuvable"));
        mobility.setStatut(statut);
        return mobiliteRepository.save(mobility);
    }
}
