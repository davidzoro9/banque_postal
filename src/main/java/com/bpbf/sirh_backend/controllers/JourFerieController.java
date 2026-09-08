package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.JourFerie;
import com.bpbf.sirh_backend.repositories.JourFerieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jours-feries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JourFerieController {

    private final JourFerieRepository jourFerieRepository;

    @GetMapping
    public ResponseEntity<List<JourFerie>> getAll() {
        return ResponseEntity.ok(jourFerieRepository.findAllByOrderByDateAsc());
    }

    @GetMapping("/annee/{year}")
    public ResponseEntity<List<JourFerie>> getByYear(@PathVariable String year) {
        return ResponseEntity.ok(jourFerieRepository.findByDateStartingWithOrderByDateAsc(year));
    }

    @PostMapping
    public ResponseEntity<JourFerie> create(@RequestBody JourFerie jourFerie) {
        return ResponseEntity.ok(jourFerieRepository.save(jourFerie));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JourFerie> update(@PathVariable Long id, @RequestBody JourFerie jourFerie) {
        JourFerie existing = jourFerieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jour férié introuvable avec l'id: " + id));
        existing.setLibelle(jourFerie.getLibelle());
        existing.setDate(jourFerie.getDate());
        existing.setType(jourFerie.getType());
        existing.setChomePaye(jourFerie.getChomePaye());
        existing.setDescription(jourFerie.getDescription());
        return ResponseEntity.ok(jourFerieRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        jourFerieRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
