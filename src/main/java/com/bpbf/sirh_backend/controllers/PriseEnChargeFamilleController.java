package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.PriseEnChargeFamille;
import com.bpbf.sirh_backend.repositories.PriseEnChargeFamilleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prises-en-charge-famille")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PriseEnChargeFamilleController {

    private final PriseEnChargeFamilleRepository repository;

    @GetMapping
    public List<PriseEnChargeFamille> getAll() {
        return repository.findAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<PriseEnChargeFamille> getByEmployee(@PathVariable Long employeeId) {
        return repository.findByEmployeeId(employeeId);
    }

    @PostMapping
    public PriseEnChargeFamille create(@RequestBody PriseEnChargeFamille entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public PriseEnChargeFamille update(@PathVariable Long id, @RequestBody PriseEnChargeFamille entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
