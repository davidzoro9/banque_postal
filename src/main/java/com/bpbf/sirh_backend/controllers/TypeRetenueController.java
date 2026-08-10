package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.TypeRetenue;
import com.bpbf.sirh_backend.repositories.TypeRetenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/type-retenue")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TypeRetenueController {
    private final TypeRetenueRepository repository;

    @GetMapping
    public List<TypeRetenue> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public TypeRetenue create(@RequestBody TypeRetenue entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public TypeRetenue update(@PathVariable Long id, @RequestBody TypeRetenue entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
