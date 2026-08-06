package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.Agence;
import com.bpbf.sirh_backend.repositories.AgenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agences")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AgenceController {

    private final AgenceRepository repository;

    @GetMapping
    public List<Agence> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Agence create(@RequestBody Agence entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public Agence update(@PathVariable Long id, @RequestBody Agence entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
