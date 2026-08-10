package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.Conge;
import com.bpbf.sirh_backend.repositories.CongeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/conges")
@RequiredArgsConstructor
public class CongeController {

    private final CongeRepository congeRepository;

    @GetMapping("/all")
    public List<Conge> getAll() {
        return congeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Conge getById(@PathVariable Long id) {
        return congeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Congé introuvable"));
    }

    @PostMapping("/create")
    public Conge create(@RequestBody Conge conge) {
        return congeRepository.save(conge);
    }

    @PutMapping("/{id}")
    public Conge update(@PathVariable Long id, @RequestBody Conge conge) {
        Conge existing = congeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Congé introuvable"));
        existing.setEmployee(conge.getEmployee());
        existing.setTypeAbsenceConge(conge.getTypeAbsenceConge());
        existing.setDateDebut(conge.getDateDebut());
        existing.setDateFin(conge.getDateFin());
        existing.setNbJours(conge.getNbJours());
        existing.setStatut(conge.getStatut());
        return congeRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        congeRepository.deleteById(id);
    }
}
