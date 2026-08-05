package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.ParametreRH;
import com.bpbf.sirh_backend.repositories.ParametreRHRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/parametres-rh")
@RequiredArgsConstructor
public class ParametresRhController {

    private final ParametreRHRepository parametreRHRepository;

    @GetMapping("/all")
    public List<ParametreRH> getAll() {
        return parametreRHRepository.findAll();
    }

    @GetMapping("/type/{type}")
    public List<ParametreRH> getByType(@PathVariable String type) {
        return parametreRHRepository.findByType(type);
    }

    @PostMapping("/create")
    public ParametreRH create(@RequestBody ParametreRH item) {
        return parametreRHRepository.save(item);
    }

    @PutMapping("/{id}")
    public ParametreRH update(@PathVariable Long id, @RequestBody ParametreRH item) {
        ParametreRH existing = parametreRHRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paramètre introuvable"));
        existing.setCode(item.getCode());
        existing.setLibelle(item.getLibelle());
        existing.setDescription(item.getDescription());
        existing.setActif(item.isActif());
        existing.setType(item.getType());
        return parametreRHRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        parametreRHRepository.deleteById(id);
    }
}
