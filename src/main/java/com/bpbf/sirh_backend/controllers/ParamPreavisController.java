package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.ParamPreavisDto;
import com.bpbf.sirh_backend.services.ParamPreavisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/param-preavis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParamPreavisController {

    private final ParamPreavisService service;

    @GetMapping({"", "/all"})
    public ResponseEntity<List<ParamPreavisDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParamPreavisDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping({"", "/create"})
    public ResponseEntity<ParamPreavisDto> create(@RequestBody ParamPreavisDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParamPreavisDto> update(@PathVariable Long id, @RequestBody ParamPreavisDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ParamPreavisDto> toggleActif(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleActif(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

