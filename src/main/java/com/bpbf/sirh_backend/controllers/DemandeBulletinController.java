package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.DemandeBulletin;
import com.bpbf.sirh_backend.repositories.DemandeBulletinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demandes-bulletin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DemandeBulletinController {

    private final DemandeBulletinRepository demandeBulletinRepository;

    @GetMapping
    public ResponseEntity<List<DemandeBulletin>> getAll() {
        return ResponseEntity.ok(demandeBulletinRepository.findAllByOrderByDateDemandeDesc());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<DemandeBulletin>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(demandeBulletinRepository.findByEmployeeIdOrderByDateDemandeDesc(employeeId));
    }

    @PostMapping
    public ResponseEntity<DemandeBulletin> create(@RequestBody DemandeBulletin payload) {
        if (payload.getDateDemande() == null) {
            payload.setDateDemande(LocalDateTime.now());
        }
        if (payload.getStatut() == null || payload.getStatut().isBlank()) {
            payload.setStatut("EN_ATTENTE_RH");
        }
        DemandeBulletin saved = demandeBulletinRepository.save(payload);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/traiter")
    public ResponseEntity<DemandeBulletin> traiter(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        DemandeBulletin demande = demandeBulletinRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande non trouvée : " + id));

        String statut = body != null && body.get("statut") != null ? body.get("statut") : "TRAITEE";
        String traitePar = body != null ? body.get("traitePar") : "GESTIONNAIRE_PAIE";

        demande.setStatut(statut);
        demande.setTraitePar(traitePar);
        demande.setDateTraitement(LocalDateTime.now());

        return ResponseEntity.ok(demandeBulletinRepository.save(demande));
    }
}
