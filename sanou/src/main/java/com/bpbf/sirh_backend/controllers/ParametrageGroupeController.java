package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.ParametrageGroupeDto;
import com.bpbf.sirh_backend.services.ParametrageGroupeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paramgroupe")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParametrageGroupeController {

    private final ParametrageGroupeService service;

    @GetMapping({"", "/all"})
    public List<ParametrageGroupeDto> getAll() {
        return service.getAll();
    }

    @PostMapping({"", "/create"})
    public ParametrageGroupeDto create(@RequestBody ParametrageGroupeDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ParametrageGroupeDto update(@PathVariable Long id, @RequestBody ParametrageGroupeDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
