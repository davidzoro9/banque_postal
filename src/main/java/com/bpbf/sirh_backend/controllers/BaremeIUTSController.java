package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.BaremeIUTS;
import com.bpbf.sirh_backend.repositories.BaremeIUTSRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/baremes-iuts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BaremeIUTSController {

    private final BaremeIUTSRepository repository;

    @GetMapping({"", "/all"})
    public List<BaremeIUTS> getAll() {
        return repository.findAll();
    }

    @PostMapping({"", "/create"})
    public BaremeIUTS create(@RequestBody BaremeIUTS entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public BaremeIUTS update(@PathVariable Long id, @RequestBody BaremeIUTS entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
