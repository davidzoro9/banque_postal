package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.*;
import com.bpbf.sirh_backend.services.CompteComptableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comptes-comptables")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompteComptableController {

    private final CompteComptableService service;

    @GetMapping
    public ResponseEntity<List<CompteComptableDto>> getAll(@RequestParam(required = false, defaultValue = "false") boolean actifOnly) {
        return ResponseEntity.ok(service.getAll(actifOnly));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompteComptableDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<CompteComptableDto> create(@RequestBody CompteComptableDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompteComptableDto> update(@PathVariable Long id, @RequestBody CompteComptableDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<CompteComptableDto> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // =========================================================================
    // ENDPOINTS DE PARAMÉTRAGE DYNAMIQUE DU FORMULAIRE (SYSCOHADA & PAIE)
    // =========================================================================

    @GetMapping("/parametres-formulaire")
    public ResponseEntity<ParametresFormulaireCompteDto> getParametresFormulaire() {
        return ResponseEntity.ok(service.getParametresFormulaire());
    }

    @GetMapping("/classes")
    public ResponseEntity<List<ClasseComptableDto>> getClasses(@RequestParam(required = false, defaultValue = "true") boolean actifOnly) {
        return ResponseEntity.ok(service.getClasses(actifOnly));
    }

    @PostMapping("/classes")
    public ResponseEntity<ClasseComptableDto> saveClasse(@RequestBody ClasseComptableDto dto) {
        return ResponseEntity.ok(service.saveClasse(dto));
    }

    @DeleteMapping("/classes/{id}")
    public ResponseEntity<Void> deleteClasse(@PathVariable Long id) {
        service.deleteClasse(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/classes/{id}/toggle-status")
    public ResponseEntity<ClasseComptableDto> toggleClasseStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleClasseStatus(id));
    }

    @GetMapping("/sens")
    public ResponseEntity<List<SensEcritureDto>> getSens(@RequestParam(required = false, defaultValue = "true") boolean actifOnly) {
        return ResponseEntity.ok(service.getSens(actifOnly));
    }

    @PostMapping("/sens")
    public ResponseEntity<SensEcritureDto> saveSens(@RequestBody SensEcritureDto dto) {
        return ResponseEntity.ok(service.saveSens(dto));
    }

    @DeleteMapping("/sens/{id}")
    public ResponseEntity<Void> deleteSens(@PathVariable Long id) {
        service.deleteSens(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/sens/{id}/toggle-status")
    public ResponseEntity<SensEcritureDto> toggleSensStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleSensStatus(id));
    }

    @GetMapping("/journaux")
    public ResponseEntity<List<JournalComptableDto>> getJournaux(@RequestParam(required = false, defaultValue = "true") boolean actifOnly) {
        return ResponseEntity.ok(service.getJournaux(actifOnly));
    }

    @PostMapping("/journaux")
    public ResponseEntity<JournalComptableDto> saveJournal(@RequestBody JournalComptableDto dto) {
        return ResponseEntity.ok(service.saveJournal(dto));
    }

    @DeleteMapping("/journaux/{id}")
    public ResponseEntity<Void> deleteJournal(@PathVariable Long id) {
        service.deleteJournal(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/journaux/{id}/toggle-status")
    public ResponseEntity<JournalComptableDto> toggleJournalStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleJournalStatus(id));
    }

    @GetMapping("/rubriques-options")
    public ResponseEntity<List<RubriqueOptionDto>> getRubriquesOptions(@RequestParam(required = false, defaultValue = "true") boolean actifOnly) {
        return ResponseEntity.ok(service.getRubriquesOptions(actifOnly));
    }

    @PostMapping("/rubriques-options")
    public ResponseEntity<RubriqueOptionDto> saveRubrique(@RequestBody RubriqueOptionDto dto) {
        return ResponseEntity.ok(service.saveRubrique(dto));
    }

    @DeleteMapping("/rubriques-options/{id}")
    public ResponseEntity<Void> deleteRubrique(@PathVariable Long id) {
        service.deleteRubrique(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/rubriques-options/{id}/toggle-status")
    public ResponseEntity<RubriqueOptionDto> toggleRubriqueStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleRubriqueStatus(id));
    }
}
