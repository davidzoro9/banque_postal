package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.ModePaiement;
import com.bpbf.sirh_backend.repositories.ModePaiementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modes-paiement")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ModePaiementController {

    private final ModePaiementRepository repository;

    @GetMapping({"", "/all"})
    public List<ModePaiement> getAll() {
        return repository.findAll();
    }

    @PostMapping({"", "/create"})
    public ModePaiement create(@RequestBody ModePaiement entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public ModePaiement update(@PathVariable Long id, @RequestBody ModePaiement entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
