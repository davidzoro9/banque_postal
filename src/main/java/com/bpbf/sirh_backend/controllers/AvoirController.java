package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.AvoirEmployeDto;
import com.bpbf.sirh_backend.services.AvoirService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avoirs")
@RequiredArgsConstructor
public class AvoirController {

    private final AvoirService avoirService;

    @GetMapping
    public ResponseEntity<List<AvoirEmployeDto>> getAll() {
        return ResponseEntity.ok(avoirService.getAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<AvoirEmployeDto>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(avoirService.getByEmployee(employeeId));
    }

    @GetMapping("/employee/{employeeId}/actifs")
    public ResponseEntity<List<AvoirEmployeDto>> getActiveByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(avoirService.getActiveByEmployee(employeeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvoirEmployeDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(avoirService.getById(id));
    }

    @PostMapping
    public ResponseEntity<AvoirEmployeDto> create(@RequestBody AvoirEmployeDto dto) {
        return ResponseEntity.ok(avoirService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AvoirEmployeDto> update(@PathVariable Long id, @RequestBody AvoirEmployeDto dto) {
        return ResponseEntity.ok(avoirService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        avoirService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
