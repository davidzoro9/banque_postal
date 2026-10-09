package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.CompteComptableDto;
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
}
