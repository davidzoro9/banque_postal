package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.ActionPermissionDto;
import com.bpbf.sirh_backend.services.ActionPermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/habilitations", "/api/action-permissions"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ActionPermissionController {

    private final ActionPermissionService service;

    @GetMapping({"", "/all"})
    public List<ActionPermissionDto> getAll() {
        return service.getAll();
    }

    @PostMapping({"", "/save-matrix"})
    public List<ActionPermissionDto> saveMatrix(@RequestBody List<ActionPermissionDto> dtoList) {
        return service.saveAll(dtoList);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ActionPermissionDto create(@RequestBody ActionPermissionDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ActionPermissionDto update(@PathVariable Long id, @RequestBody ActionPermissionDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
