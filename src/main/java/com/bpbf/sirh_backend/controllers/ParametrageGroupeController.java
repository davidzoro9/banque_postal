package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.ParametrageGroupe;
import com.bpbf.sirh_backend.repositories.ParametrageGroupeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paramgroupe")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParametrageGroupeController {

    private final ParametrageGroupeRepository repository;

    @GetMapping
    public List<ParametrageGroupe> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ParametrageGroupe create(@RequestBody ParametrageGroupe entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public ParametrageGroupe update(@PathVariable Long id, @RequestBody ParametrageGroupe entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
