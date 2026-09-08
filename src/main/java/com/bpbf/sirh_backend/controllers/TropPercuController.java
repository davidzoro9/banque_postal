package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.TropPercuDto;
import com.bpbf.sirh_backend.services.TropPercuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trop-percus")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TropPercuController {

    private final TropPercuService tropPercuService;

    @GetMapping
    public ResponseEntity<List<TropPercuDto>> getAll() {
        return ResponseEntity.ok(tropPercuService.getAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<TropPercuDto>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(tropPercuService.getByEmployee(employeeId));
    }

    @GetMapping("/mois/{mois}")
    public ResponseEntity<List<TropPercuDto>> getByMois(@PathVariable String mois) {
        return ResponseEntity.ok(tropPercuService.getByMoisApplication(mois));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TropPercuDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tropPercuService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TropPercuDto> create(@RequestBody TropPercuDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tropPercuService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TropPercuDto> update(@PathVariable Long id, @RequestBody TropPercuDto dto) {
        return ResponseEntity.ok(tropPercuService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tropPercuService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<TropPercuDto> changerStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statut = body.getOrDefault("statut", "EN_ATTENTE");
        return ResponseEntity.ok(tropPercuService.changerStatut(id, statut));
    }
}
