package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.ParametragePriseEnCharge;
import com.bpbf.sirh_backend.repositories.ParametragePriseEnChargeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parampriseencharge")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParametragePriseEnChargeController {

    private final ParametragePriseEnChargeRepository repository;

    @GetMapping
    public List<ParametragePriseEnCharge> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ParametragePriseEnCharge create(@RequestBody ParametragePriseEnCharge entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public ParametragePriseEnCharge update(@PathVariable Long id, @RequestBody ParametragePriseEnCharge entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
