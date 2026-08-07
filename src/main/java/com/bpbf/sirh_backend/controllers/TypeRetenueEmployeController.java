package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.TypeRetenueEmploye;
import com.bpbf.sirh_backend.repositories.TypeRetenueEmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/typeretenueemploye")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TypeRetenueEmployeController {

    private final TypeRetenueEmployeRepository repository;

    @GetMapping
    public List<TypeRetenueEmploye> getAll() {
        return repository.findAll();
    }

    @PostMapping({"", "/create"})
    public TypeRetenueEmploye create(@RequestBody TypeRetenueEmploye entity) {
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public TypeRetenueEmploye update(@PathVariable Long id, @RequestBody TypeRetenueEmploye entity) {
        entity.setId(id);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
