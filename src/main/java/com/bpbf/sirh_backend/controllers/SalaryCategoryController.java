package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.paie.SalaryCategoryRequestDto;
import com.bpbf.sirh_backend.dtos.paie.SalaryCategoryResponseDto;
import com.bpbf.sirh_backend.services.SalaryParametrageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary-categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalaryCategoryController {

    private final SalaryParametrageService parametrageService;

    @GetMapping
    public ResponseEntity<List<SalaryCategoryResponseDto>> getAll() {
        return ResponseEntity.ok(parametrageService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryCategoryResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(parametrageService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<SalaryCategoryResponseDto> create(@RequestBody SalaryCategoryRequestDto dto) {
        return ResponseEntity.ok(parametrageService.createCategory(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaryCategoryResponseDto> update(@PathVariable Long id, @RequestBody SalaryCategoryRequestDto dto) {
        return ResponseEntity.ok(parametrageService.updateCategory(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        parametrageService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
