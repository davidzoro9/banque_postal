package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.RegimeSecuriteSocial;
import com.bpbf.sirh_backend.dtos.RegimeSecuriteSocialDto;
import lombok.RequiredArgsConstructor;
import com.bpbf.sirh_backend.services.RegimeSecuriteSocialService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/regime-securite-social")
public class RegimeSecuriteSocialController {

	private final RegimeSecuriteSocialService service;

	@GetMapping({"", "/all"})
    public List<RegimeSecuriteSocialDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public RegimeSecuriteSocialDto getById(
            @PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping({"", "/create"})
    public RegimeSecuriteSocialDto create(
            @RequestBody RegimeSecuriteSocialDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public RegimeSecuriteSocialDto update(
            @PathVariable Long id,
            @RequestBody RegimeSecuriteSocialDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}