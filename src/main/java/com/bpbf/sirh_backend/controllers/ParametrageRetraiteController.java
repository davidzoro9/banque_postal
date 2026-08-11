package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.ParametrageRetraiteDto;
import com.bpbf.sirh_backend.services.ParametrageRetraiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paramretraite")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParametrageRetraiteController {

    private final ParametrageRetraiteService service;

    @GetMapping({"", "/all"})
    public List<ParametrageRetraiteDto> getAll() {
        return service.getAll();
    }

    @PostMapping({"", "/create"})
    public ParametrageRetraiteDto create(@RequestBody ParametrageRetraiteDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ParametrageRetraiteDto update(@PathVariable Long id, @RequestBody ParametrageRetraiteDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
