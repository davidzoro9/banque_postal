package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.RubriquePaie;
import com.bpbf.sirh_backend.repositories.RubriquePaieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rubriques-paie")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RubriquePaieController {

    private final RubriquePaieRepository repository;

    @GetMapping({"", "/all"})
    public List<RubriquePaie> getAll() {
        return repository.findAll();
    }

    @PostMapping({"", "/create"})
    public RubriquePaie create(@RequestBody RubriquePaie entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public RubriquePaie update(@PathVariable Long id, @RequestBody RubriquePaie entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
