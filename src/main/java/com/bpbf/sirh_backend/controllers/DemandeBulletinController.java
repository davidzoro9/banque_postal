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

    @GetMapping("/mes-demandes")
    public ResponseEntity<List<DemandeBulletin>> getMesDemandes(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) String matricule,
            @RequestParam(required = false) String employeeName) {
        List<DemandeBulletin> all = demandeBulletinRepository.findAllByOrderByDateDemandeDesc();
        if (employeeId == null && (matricule == null || matricule.isBlank()) && (employeeName == null || employeeName.isBlank())) {
            return ResponseEntity.ok(all);
        }
        final String mNorm = matricule != null ? matricule.trim().toUpperCase() : "";
        final String nNorm = employeeName != null ? employeeName.trim().toUpperCase() : "";

        List<DemandeBulletin> filtered = all.stream().filter(d -> {
            if (employeeId != null && d.getEmployeeId() != null && d.getEmployeeId().equals(employeeId)) {
                return true;
            }
            if (!mNorm.isEmpty() && d.getMatricule() != null && d.getMatricule().trim().toUpperCase().equals(mNorm)) {
                return true;
            }
            if (!nNorm.isEmpty() && d.getEmployeeName() != null && d.getEmployeeName().trim().toUpperCase().contains(nNorm)) {
                return true;
            }
            return false;
        }).toList();

        return ResponseEntity.ok(filtered);
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

    @PutMapping({"/{id}", "/{id}/traiter"})
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
