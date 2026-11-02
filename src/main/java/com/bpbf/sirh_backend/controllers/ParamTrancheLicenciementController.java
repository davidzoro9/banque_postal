package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.ParamTrancheLicenciementDto;
import com.bpbf.sirh_backend.services.ParamTrancheLicenciementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/param-tranche-licenciement")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParamTrancheLicenciementController {

    private final ParamTrancheLicenciementService service;

    @GetMapping({"", "/all"})
    public ResponseEntity<List<ParamTrancheLicenciementDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParamTrancheLicenciementDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping({"", "/create"})
    public ResponseEntity<ParamTrancheLicenciementDto> create(@RequestBody ParamTrancheLicenciementDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParamTrancheLicenciementDto> update(@PathVariable Long id, @RequestBody ParamTrancheLicenciementDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ParamTrancheLicenciementDto> toggleActif(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleActif(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
