package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.Contrat;
import com.bpbf.sirh_backend.repositories.ContratRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/contrats")
@RequiredArgsConstructor
public class ContratController {

    private final ContratRepository contratRepository;

    @GetMapping("/all")
    public List<Contrat> getAll() {
        return contratRepository.findAll();
    }

    @GetMapping("/{id}")
    public Contrat getById(@PathVariable Long id) {
        return contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));
    }

    @PostMapping("/create")
    public Contrat create(@RequestBody Contrat contrat) {
        return contratRepository.save(contrat);
    }

    @PutMapping("/{id}")
    public Contrat update(@PathVariable Long id, @RequestBody Contrat contrat) {
        Contrat existing = contratRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable"));
        existing.setEmployee(contrat.getEmployee());
        existing.setTypeContratObj(contrat.getTypeContratObj());
        existing.setServiceObj(contrat.getServiceObj());
        existing.setDateDebut(contrat.getDateDebut());
        existing.setDateFin(contrat.getDateFin());
        existing.setStatut(contrat.getStatut());
        return contratRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        contratRepository.deleteById(id);
    }
}
