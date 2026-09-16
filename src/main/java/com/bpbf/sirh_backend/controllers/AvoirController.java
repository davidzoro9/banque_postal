package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.paie.AvoirRequestDto;
import com.bpbf.sirh_backend.dtos.paie.AvoirResponseDto;
import com.bpbf.sirh_backend.services.VariablesPaieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avoirs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AvoirController {

    private final VariablesPaieService variablesPaieService;

    @GetMapping
    public ResponseEntity<List<AvoirResponseDto>> getAll() {
        return ResponseEntity.ok(variablesPaieService.getAllAvoirs());
    }

    @GetMapping("/next-reference")
    public ResponseEntity<java.util.Map<String, String>> getNextReference() {
        String ref = variablesPaieService.generateNextAvoirReference();
        return ResponseEntity.ok(java.util.Map.of("reference", ref));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvoirResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(variablesPaieService.getAvoirById(id));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<AvoirResponseDto>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(variablesPaieService.getAvoirsByEmployee(employeeId));
    }

    @PostMapping
    public ResponseEntity<AvoirResponseDto> create(@RequestBody AvoirRequestDto dto) {
        return ResponseEntity.ok(variablesPaieService.createAvoir(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AvoirResponseDto> update(@PathVariable Long id, @RequestBody AvoirRequestDto dto) {
        return ResponseEntity.ok(variablesPaieService.updateAvoir(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        variablesPaieService.deleteAvoir(id);
        return ResponseEntity.noContent().build();
    }
}
