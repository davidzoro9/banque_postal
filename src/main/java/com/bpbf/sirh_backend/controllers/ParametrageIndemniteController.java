package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.ParametrageIndemniteDto;
import com.bpbf.sirh_backend.services.ParametrageIndemniteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paramindemnite")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParametrageIndemniteController {

    private final ParametrageIndemniteService service;

    @GetMapping({"", "/all"})
    public List<ParametrageIndemniteDto> getAll() {
        return service.getAll();
    }

    @PostMapping({"", "/create"})
    public ParametrageIndemniteDto create(@RequestBody ParametrageIndemniteDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ParametrageIndemniteDto update(@PathVariable Long id, @RequestBody ParametrageIndemniteDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Opération effectuée avec succès";
    }
}
