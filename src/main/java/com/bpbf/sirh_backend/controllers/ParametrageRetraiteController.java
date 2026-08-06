package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.ParametrageRetraite;
import com.bpbf.sirh_backend.repositories.ParametrageRetraiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paramretraite")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParametrageRetraiteController {

    private final ParametrageRetraiteRepository repository;

    @GetMapping
    public List<ParametrageRetraite> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ParametrageRetraite create(@RequestBody ParametrageRetraite entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public ParametrageRetraite update(@PathVariable Long id, @RequestBody ParametrageRetraite entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
