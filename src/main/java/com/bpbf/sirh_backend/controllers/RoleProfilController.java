package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.RoleProfilDto;
import com.bpbf.sirh_backend.services.RoleProfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/roles", "/api/roles-profils"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoleProfilController {

    private final RoleProfilService service;

    @GetMapping({"", "/all"})
    public List<RoleProfilDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RoleProfilDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping({"", "/create"})
    @ResponseStatus(HttpStatus.CREATED)
    public RoleProfilDto create(@RequestBody RoleProfilDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public RoleProfilDto update(@PathVariable Long id, @RequestBody RoleProfilDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
