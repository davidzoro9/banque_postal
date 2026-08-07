package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.TypeRetenueEmploi;
import com.bpbf.sirh_backend.repositories.TypeRetenueEmploiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/typeretenueemploi")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TypeRetenueEmploiController {

    private final TypeRetenueEmploiRepository repository;

    @GetMapping
    public List<TypeRetenueEmploi> getAll() {
        return repository.findAll();
    }

    @PostMapping({"", "/create"})
    public TypeRetenueEmploi create(@RequestBody TypeRetenueEmploi entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public TypeRetenueEmploi update(@PathVariable Long id, @RequestBody TypeRetenueEmploi entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
