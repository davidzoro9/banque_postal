package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.paie.SalaryElementRequestDto;
import com.bpbf.sirh_backend.dtos.paie.SalaryElementResponseDto;
import com.bpbf.sirh_backend.services.SalaryParametrageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary-elements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalaryElementController {

    private final SalaryParametrageService parametrageService;

    @GetMapping
    public ResponseEntity<List<SalaryElementResponseDto>> getAll() {
        return ResponseEntity.ok(parametrageService.getAllElements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryElementResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(parametrageService.getElementById(id));
    }

    @PostMapping
    public ResponseEntity<SalaryElementResponseDto> create(@RequestBody SalaryElementRequestDto dto) {
        return ResponseEntity.ok(parametrageService.createElement(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaryElementResponseDto> update(@PathVariable Long id, @RequestBody SalaryElementRequestDto dto) {
        return ResponseEntity.ok(parametrageService.updateElement(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        parametrageService.deleteElement(id);
        return ResponseEntity.noContent().build();
    }
}
