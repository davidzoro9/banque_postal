package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.Grade;
import com.bpbf.sirh_backend.repositories.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grade")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GradeController {

    private final GradeRepository repository;

    @GetMapping
    public List<Grade> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Grade create(@RequestBody Grade entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public Grade update(@PathVariable Long id, @RequestBody Grade entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
