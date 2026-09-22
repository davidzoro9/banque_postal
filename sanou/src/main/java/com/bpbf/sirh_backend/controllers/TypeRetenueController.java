package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.TypeRetenueDto;
import com.bpbf.sirh_backend.services.TypeRetenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/type-retenue", "/api/types-retenues"})
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TypeRetenueController {

    private final TypeRetenueService service;

    @GetMapping
    public List<TypeRetenueDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public TypeRetenueDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TypeRetenueDto create(@RequestBody TypeRetenueDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public TypeRetenueDto update(@PathVariable Long id, @RequestBody TypeRetenueDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
