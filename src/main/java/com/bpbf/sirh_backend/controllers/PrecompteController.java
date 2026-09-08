package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.paie.PrecompteRequestDto;
import com.bpbf.sirh_backend.dtos.paie.PrecompteResponseDto;
import com.bpbf.sirh_backend.services.VariablesPaieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/precomptes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PrecompteController {

    private final VariablesPaieService variablesPaieService;

    @GetMapping
    public ResponseEntity<List<PrecompteResponseDto>> getAll() {
        return ResponseEntity.ok(variablesPaieService.getAllPrecomptes());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PrecompteResponseDto>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(variablesPaieService.getPrecomptesByEmployee(employeeId));
    }

    @PostMapping
    public ResponseEntity<PrecompteResponseDto> create(@RequestBody PrecompteRequestDto dto) {
        return ResponseEntity.ok(variablesPaieService.createPrecompte(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrecompteResponseDto> update(@PathVariable Long id, @RequestBody PrecompteRequestDto dto) {
        return ResponseEntity.ok(variablesPaieService.updatePrecompte(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        variablesPaieService.deletePrecompte(id);
        return ResponseEntity.noContent().build();
    }
}
