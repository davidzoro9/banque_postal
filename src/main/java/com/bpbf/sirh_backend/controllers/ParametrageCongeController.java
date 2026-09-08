package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.ParametrageConge;
import com.bpbf.sirh_backend.repositories.ParametrageCongeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conges/parametrage")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParametrageCongeController {

    private final ParametrageCongeRepository parametrageCongeRepository;

    @GetMapping
    public ResponseEntity<ParametrageConge> getParametrage() {
        ParametrageConge config = parametrageCongeRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    ParametrageConge p = new ParametrageConge();
                    return parametrageCongeRepository.save(p);
                });
        return ResponseEntity.ok(config);
    }

    @PutMapping
    public ResponseEntity<ParametrageConge> saveParametrage(@RequestBody ParametrageConge payload) {
        ParametrageConge existing = parametrageCongeRepository.findAll().stream().findFirst()
                .orElse(new ParametrageConge());

        existing.setDroitAnnuelDefaut(payload.getDroitAnnuelDefaut() != null ? payload.getDroitAnnuelDefaut() : 30);
        existing.setJoursAcquisParMois(payload.getJoursAcquisParMois() != null ? payload.getJoursAcquisParMois() : 2.5);
        existing.setModeDecompte(payload.getModeDecompte() != null ? payload.getModeDecompte() : "OUVRABLE_5J");
        existing.setDeduireJoursFeries(payload.getDeduireJoursFeries() != null ? payload.getDeduireJoursFeries() : true);
        existing.setPlafondReportJours(payload.getPlafondReportJours() != null ? payload.getPlafondReportJours() : 15);
        existing.setBloquerSiSoldeInsuffisant(payload.getBloquerSiSoldeInsuffisant() != null ? payload.getBloquerSiSoldeInsuffisant() : false);

        return ResponseEntity.ok(parametrageCongeRepository.save(existing));
    }
}
