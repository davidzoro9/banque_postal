package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.TypeRetenueEmploi;
import com.bpbf.sirh_backend.repositories.TypeRetenueEmploiRepository;
import com.bpbf.sirh_backend.repositories.TypeRetenueEmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/typeretenueemploi")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TypeRetenueEmploiController {

    private final TypeRetenueEmploiRepository repository;
    private final TypeRetenueEmployeRepository typeRetenueEmployeRepository;

    @GetMapping
    public List<TypeRetenueEmploi> getAll() {
        List<TypeRetenueEmploi> list = repository.findAll();
        list.forEach(this::resolveRelationships);
        return list;
    }

    @PostMapping({"", "/create"})
    public TypeRetenueEmploi create(@RequestBody TypeRetenueEmploi entity) {
        resolveRelationships(entity);
        return repository.save(entity);
    }

    @PutMapping("/{id}")
    public TypeRetenueEmploi update(@PathVariable Long id, @RequestBody TypeRetenueEmploi entity) {
        entity.setId(id);
        resolveRelationships(entity);
        return repository.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

    private void resolveRelationships(TypeRetenueEmploi entity) {
        if (entity.getTypeRetenueEmploye() == null && entity.getTypeRetenue() != null && !entity.getTypeRetenue().trim().isEmpty()) {
            String trStr = entity.getTypeRetenue().trim();
            typeRetenueEmployeRepository.findAll().stream()
                    .filter(tr -> trStr.equalsIgnoreCase(tr.getCode()) || trStr.equalsIgnoreCase(tr.getLibelle()))
                    .findFirst().ifPresent(entity::setTypeRetenueEmploye);
        }
    }
}
