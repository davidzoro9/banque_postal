package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.Categorie;
import com.bpbf.sirh_backend.repositories.CategorieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorie")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategorieController {

    private final CategorieRepository repository;

    @GetMapping
    public List<Categorie> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Categorie create(@RequestBody Categorie entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public Categorie update(@PathVariable Long id, @RequestBody Categorie entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
