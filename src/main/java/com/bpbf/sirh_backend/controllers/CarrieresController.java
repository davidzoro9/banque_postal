package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.repositories.*;
import com.bpbf.sirh_backend.services.CarriereService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/carrieres")
@RequiredArgsConstructor
public class CarrieresController {

    private final CarriereService carriereService;
    private final CompetenceRepository competenceRepository;
    private final FormationCatalogueRepository catalogueRepository;
    private final FormationSessionRepository sessionRepository;
    private final EvaluationEntretienRepository evaluationRepository;
    private final MobiliteDemandeRepository mobiliteRepository;

    // ==========================================
    // 1. DASHBOARD & STATISTIQUES CARRIÈRE
    // ==========================================
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        return carriereService.getDashboardStats();
    }

    // ==========================================
    // 2. NOTATIONS & ÉVALUATIONS DE PERFORMANCE
    // ==========================================
    @GetMapping("/notations")
    public List<CarriereNotation> getNotations(@RequestParam(required = false) Integer exercice) {
        return carriereService.getNotationsByExercice(exercice);
    }

    @PostMapping("/notations")
    public CarriereNotation saveNotation(@RequestBody CarriereNotation notation) {
        return carriereService.saveNotation(notation);
    }

    @DeleteMapping("/notations/{id}")
    public void deleteNotation(@PathVariable Long id) {
        carriereService.deleteNotation(id);
    }

    // ==========================================
    // 3. AVANCEMENTS D'ÉCHELON (PROMOTION AUTOMATIQUE)
    // ==========================================
    @GetMapping("/avancements")
    public List<CarriereAvancement> getAvancements(@RequestParam(required = false) Integer exercice) {
        return carriereService.getAvancementsByExercice(exercice);
    }

    @PostMapping("/avancements/generer")
    public List<CarriereAvancement> genererAvancements(@RequestParam(required = false) Integer exercice) {
        return carriereService.genererPropositions(exercice);
    }

    @PostMapping("/avancements/{id}/valider")
    public CarriereAvancement validerAvancement(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Direction des Ressources Humaines") String validateur) {
        return carriereService.validerAvancement(id, validateur);
    }

    @PostMapping("/avancements/{id}/rejeter")
    public CarriereAvancement rejeterAvancement(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Rejeté par la commission de carrière") String motif) {
        return carriereService.rejeterAvancement(id, motif);
    }

    // ==========================================
    // 4. RECLASSEMENTS PROFESSIONNELS
    // ==========================================
    @GetMapping("/reclassements")
    public List<CarriereReclassement> getReclassements() {
        return carriereService.getAllReclassements();
    }

    @PostMapping("/reclassements")
    public CarriereReclassement saveReclassement(@RequestBody CarriereReclassement reclassement) {
        return carriereService.saveReclassement(reclassement);
    }

    @PostMapping("/reclassements/{id}/valider")
    public CarriereReclassement validerReclassement(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Direction Générale BPBF") String validateur) {
        return carriereService.validerReclassement(id, validateur);
    }

    // ==========================================
    // 5. COMPÉTENCES (RÉFÉRENTIEL)
    // ==========================================
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

    // ==========================================
    // 6. FORMATIONS (CATALOGUE & SESSIONS)
    // ==========================================
    @GetMapping("/catalogue")
    public List<FormationCatalogue> getCatalogue() {
        return catalogueRepository.findAll();
    }

    @PostMapping("/catalogue")
    public FormationCatalogue addCourse(@RequestBody FormationCatalogue course) {
        return catalogueRepository.save(course);
    }

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

    // ==========================================
    // 7. ENTRETIENS & MOBILITÉ (LEGACY/COMPAT)
    // ==========================================
    @GetMapping("/evaluations")
    public List<EvaluationEntretien> getEvaluations() {
        return evaluationRepository.findAllByOrderByIdDesc();
    }

    @PostMapping("/evaluations")
    public EvaluationEntretien addEvaluation(@RequestBody EvaluationEntretien evaluation) {
        return evaluationRepository.save(evaluation);
    }

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
