package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.SoldeCongeDto;
import com.bpbf.sirh_backend.entities.Conge;
import com.bpbf.sirh_backend.services.CongeWorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conges")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CongeController {

    private final CongeWorkflowService congeService;

    @GetMapping("/all")
    public ResponseEntity<List<Conge>> getAll() {
        return ResponseEntity.ok(congeService.getAllConges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conge> getById(@PathVariable Long id) {
        return ResponseEntity.ok(congeService.getCongeById(id));
    }

    @GetMapping("/employe/{employeeId}")
    public ResponseEntity<List<Conge>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(congeService.getCongesByEmployee(employeeId));
    }

    @GetMapping("/interimaire/{interimaireId}")
    public ResponseEntity<List<Conge>> getByInterimaire(@PathVariable Long interimaireId) {
        return ResponseEntity.ok(congeService.getCongesByInterimaire(interimaireId));
    }

    // ── ÉTAPE 1 : CRÉATION / SOUMISSION ──
    @PostMapping("/create")
    public ResponseEntity<Conge> create(@RequestBody Conge conge) {
        Conge saved = congeService.createConge(conge);
        return ResponseEntity.ok(saved);
    }

    // ── ÉTAPE 2 : AVIS INTÉRIMAIRE (COLLÈGUE PRESSENTI) ──
    @PutMapping("/{id}/avis-interim")
    public ResponseEntity<Conge> avisInterim(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        boolean accord = Boolean.TRUE.equals(body.get("accord"));
        String commentaire = (String) body.get("commentaire");
        String interimaireNom = (String) body.get("interimaireNom");
        return ResponseEntity.ok(congeService.donnerAvisInterim(id, accord, commentaire, interimaireNom));
    }

    // ── ÉTAPE 3 : VISA HIÉRARCHIQUE N+1 (DIRECTEUR / CHEF DE PÔLE) ──
    @PutMapping("/{id}/visa-n1")
    public ResponseEntity<Conge> visaN1(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        boolean accord = Boolean.TRUE.equals(body.get("accord"));
        String commentaire = (String) body.get("commentaire");
        String validePar = (String) body.get("validePar");
        return ResponseEntity.ok(congeService.donnerVisaN1(id, accord, commentaire, validePar));
    }

    // ── ÉTAPE 4 : CONTRÔLE ET DÉLIVRANCE TITRE DE CONGÉ DRH ──
    @PutMapping("/{id}/validation-drh")
    public ResponseEntity<Conge> validationDrh(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        boolean accord = Boolean.TRUE.equals(body.get("accord"));
        String motifRefus = (String) body.get("motifRefus");
        String validePar = (String) body.get("validePar");
        return ResponseEntity.ok(congeService.validationFinaleDrh(id, accord, motifRefus, validePar));
    }

    // ── ÉTAPE 5 : ACTION SÉCURITÉ SI (POSTE SENSIBLE BCEAO) ──
    @PutMapping("/{id}/securite-si")
    public ResponseEntity<Conge> securiteSi(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statutSi = body != null ? body.get("statutSi") : "ACCES_SUSPENDU";
        String operateurSi = body != null ? body.get("operateurSi") : "DSI";
        return ResponseEntity.ok(congeService.actionSecuriteSi(id, statutSi, operateurSi));
    }

    // ── QUORUM DIRECTION (RÈGLE MAX 30% D'ABSENTS) ──
    @GetMapping("/quorum/{directionId}")
    public ResponseEntity<Map<String, Object>> getQuorumDirection(@PathVariable Long directionId) {
        return ResponseEntity.ok(congeService.verifierQuorumDirection(directionId));
    }

    // Compatibilité 1-clic existante
    @PutMapping("/{id}/approuver")
    public ResponseEntity<Conge> approuver(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String validePar = body != null ? body.get("validePar") : null;
        return ResponseEntity.ok(congeService.approuverConge(id, validePar));
    }

    @PutMapping("/{id}/rejeter")
    public ResponseEntity<Conge> rejeter(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String motifRefus = body != null ? body.get("motifRefus") : null;
        String rejetePar = body != null ? body.get("rejetePar") : null;
        return ResponseEntity.ok(congeService.rejeterConge(id, motifRefus, rejetePar));
    }

    @PutMapping("/{id}/annuler")
    public ResponseEntity<Conge> annuler(@PathVariable Long id) {
        return ResponseEntity.ok(congeService.annulerConge(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        congeService.deleteConge(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/soldes")
    public ResponseEntity<List<SoldeCongeDto>> getAllSoldes() {
        return ResponseEntity.ok(congeService.getAllSoldes());
    }

    @GetMapping("/soldes/{employeeId}")
    public ResponseEntity<SoldeCongeDto> getSoldeByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(congeService.getSoldeForEmployee(employeeId));
    }
}
