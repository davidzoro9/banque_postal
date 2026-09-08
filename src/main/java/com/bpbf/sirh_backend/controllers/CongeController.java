package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.SoldeCongeDto;
import com.bpbf.sirh_backend.entities.Conge;
import com.bpbf.sirh_backend.services.CongeWorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conges")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CongeController {

    private final CongeWorkflowService congeService;

    @GetMapping("/all")
    public ResponseEntity<List<Conge>> getAll() {
        return ResponseEntity.ok(congeService.getAllConges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conge> getById(@PathVariable Long id) {
        return ResponseEntity.ok(congeService.getCongeById(id));
    }

    @GetMapping("/employe/{employeeId}")
    public ResponseEntity<List<Conge>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(congeService.getCongesByEmployee(employeeId));
    }

    @PostMapping("/create")
    public ResponseEntity<Conge> create(@RequestBody Conge conge) {
        Conge saved = congeService.createConge(conge);
        if (saved != null && saved.getEmployee() != null) {
            com.bpbf.sirh_backend.entities.Employee emp = new com.bpbf.sirh_backend.entities.Employee();
            emp.setId(saved.getEmployee().getId());
            emp.setMatricule(saved.getEmployee().getMatricule());
            emp.setNom(saved.getEmployee().getNom());
            emp.setPrenom(saved.getEmployee().getPrenom());
            saved.setEmployee(emp);
        }
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/approuver")
    public ResponseEntity<Conge> approuver(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String validePar = body != null ? body.get("validePar") : null;
        return ResponseEntity.ok(congeService.approuverConge(id, validePar));
    }

    @PutMapping("/{id}/rejeter")
    public ResponseEntity<Conge> rejeter(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String motifRefus = body != null ? body.get("motifRefus") : null;
        String rejetePar = body != null ? body.get("rejetePar") : null;
        return ResponseEntity.ok(congeService.rejeterConge(id, motifRefus, rejetePar));
    }

    @PutMapping("/{id}/annuler")
    public ResponseEntity<Conge> annuler(@PathVariable Long id) {
        return ResponseEntity.ok(congeService.annulerConge(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        congeService.deleteConge(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/soldes")
    public ResponseEntity<List<SoldeCongeDto>> getAllSoldes() {
        return ResponseEntity.ok(congeService.getAllSoldes());
    }

    @GetMapping("/soldes/{employeeId}")
    public ResponseEntity<SoldeCongeDto> getSoldeByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(congeService.getSoldeForEmployee(employeeId));
    }
}
