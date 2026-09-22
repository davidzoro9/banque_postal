package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.RetenueSalariale;
import com.bpbf.sirh_backend.repositories.RetenueSalarialeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/retenues-salariales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RetenueSalarialeController {

    private final RetenueSalarialeRepository repository;

    @GetMapping({"", "/all"})
    public List<RetenueSalariale> getAll() {
        return repository.findAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<RetenueSalariale> getByEmployee(@PathVariable Long employeeId) {
        return repository.findByEmployeeId(employeeId);
    }

    @PostMapping({"", "/create"})
    public RetenueSalariale create(@RequestBody RetenueSalariale entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public RetenueSalariale update(@PathVariable Long id, @RequestBody RetenueSalariale entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
