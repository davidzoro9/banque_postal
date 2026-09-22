package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.GenericRefData;
import com.bpbf.sirh_backend.repositories.GenericRefDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ref-data/{type}")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RefDataController {

    private final GenericRefDataRepository repository;

    @GetMapping({"", "/all"})
    public List<GenericRefData> getAll(@PathVariable String type) {
        return repository.findByType(type);
    }

    @PostMapping({"", "/create"})
    public GenericRefData create(@PathVariable String type, @RequestBody GenericRefData data) {
        data.setType(type);
        return repository.save(data);
    }

    @PutMapping("/{id}")
    public GenericRefData update(@PathVariable String type, @PathVariable Long id, @RequestBody GenericRefData data) {
        GenericRefData existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        existing.setCode(data.getCode());
        existing.setLibelle(data.getLibelle());
        existing.setDescription(data.getDescription());
        existing.setGrade(data.getGrade());
        existing.setCategorie(data.getCategorie());
        existing.setTaux(data.getTaux());
        existing.setTypeRetenue(data.getTypeRetenue());
        existing.setActif(data.isActif());
        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String type, @PathVariable Long id) {
        repository.deleteById(id);
    }
}
