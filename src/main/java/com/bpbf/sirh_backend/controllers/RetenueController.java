package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.RetenueDto;
import com.bpbf.sirh_backend.services.RetenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/retenue", "/api/type-retenue-emploi"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RetenueController {
    private final RetenueService service;

    @GetMapping
    public List<RetenueDto> getAll() {
        return service.getAll();
    }

    @PostMapping
    public RetenueDto create(@RequestBody RetenueDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public RetenueDto update(@PathVariable Long id, @RequestBody RetenueDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
