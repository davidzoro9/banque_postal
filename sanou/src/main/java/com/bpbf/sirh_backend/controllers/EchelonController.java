package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.Echelon;
import com.bpbf.sirh_backend.repositories.EchelonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/echelon")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EchelonController {

    private final EchelonRepository repository;

    @GetMapping({"", "/all"})
    public List<Echelon> getAll() {
        return repository.findAll();
    }

    @PostMapping({"", "/create"})
    public Echelon create(@RequestBody Echelon entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public Echelon update(@PathVariable Long id, @RequestBody Echelon entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
