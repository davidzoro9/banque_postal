package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.Absence;
import com.bpbf.sirh_backend.repositories.AbsenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/absences")
@RequiredArgsConstructor
public class AbsenceController {

    private final AbsenceRepository absenceRepository;

    @GetMapping("/all")
    public List<Absence> getAll() {
        return absenceRepository.findAll();
    }

    @GetMapping("/{id}")
    public Absence getById(@PathVariable Long id) {
        return absenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Absence introuvable"));
    }

    @PostMapping("/create")
    public Absence create(@RequestBody Absence absence) {
        return absenceRepository.save(absence);
    }

    @PutMapping("/{id}")
    public Absence update(@PathVariable Long id, @RequestBody Absence absence) {
        Absence existing = absenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Absence introuvable"));
        existing.setEmployee(absence.getEmployee());
        existing.setTypeAbsenceConge(absence.getTypeAbsenceConge());
        existing.setDate(absence.getDate());
        existing.setDuree(absence.getDuree());
        existing.setMotif(absence.getMotif());
        existing.setStatut(absence.getStatut());
        return absenceRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        absenceRepository.deleteById(id);
    }
}
