package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.ExonerationFiscale;
import com.bpbf.sirh_backend.repositories.ExonerationFiscaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exonerations-fiscales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExonerationFiscaleController {

    private final ExonerationFiscaleRepository repository;

    @GetMapping
    public List<ExonerationFiscale> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ExonerationFiscale create(@RequestBody ExonerationFiscale entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public ExonerationFiscale update(@PathVariable Long id, @RequestBody ExonerationFiscale entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
