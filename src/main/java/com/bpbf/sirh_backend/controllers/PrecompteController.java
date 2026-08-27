package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.PrecompteEmployeDto;
import com.bpbf.sirh_backend.services.PrecompteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/precomptes")
@RequiredArgsConstructor
public class PrecompteController {

    private final PrecompteService precompteService;

    @GetMapping
    public ResponseEntity<List<PrecompteEmployeDto>> getAll() {
        return ResponseEntity.ok(precompteService.getAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PrecompteEmployeDto>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(precompteService.getByEmployee(employeeId));
    }

    @GetMapping("/employee/{employeeId}/actifs")
    public ResponseEntity<List<PrecompteEmployeDto>> getActiveByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(precompteService.getActiveByEmployee(employeeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrecompteEmployeDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(precompteService.getById(id));
    }

    @PostMapping
    public ResponseEntity<PrecompteEmployeDto> create(@RequestBody PrecompteEmployeDto dto) {
        return ResponseEntity.ok(precompteService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrecompteEmployeDto> update(@PathVariable Long id, @RequestBody PrecompteEmployeDto dto) {
        return ResponseEntity.ok(precompteService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        precompteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
