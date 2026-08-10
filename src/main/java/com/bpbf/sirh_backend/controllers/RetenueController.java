package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.Retenue;
import com.bpbf.sirh_backend.repositories.RetenueRepository;
import com.bpbf.sirh_backend.repositories.TypeRetenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/retenue", "/api/type-retenue-emploi"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RetenueController {
    private final RetenueRepository repository;
    private final TypeRetenueRepository typeRetenueRepository;

    @GetMapping
    public List<Retenue> getAll() {
        List<Retenue> list = repository.findAll();
        list.forEach(this::resolveRelationships);
        return list;
    }

    @PostMapping
    public Retenue create(@RequestBody Retenue entity) {
        resolveRelationships(entity);
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public Retenue update(@PathVariable Long id, @RequestBody Retenue entity) {
        entity.setId(id);
        resolveRelationships(entity);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

    private void resolveRelationships(Retenue entity) {
        if (entity.getTypeRetenue() == null) {
            typeRetenueRepository.findAll().stream()
                    .findFirst().ifPresent(entity::setTypeRetenue);
        }
    }
}
