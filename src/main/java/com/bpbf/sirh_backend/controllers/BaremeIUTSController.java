package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.BaremeIUTSDto;
import com.bpbf.sirh_backend.services.BaremeIUTSService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/baremes-iuts", "/api/bareme-iuts"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BaremeIUTSController {

    private final BaremeIUTSService service;

    @GetMapping({"", "/all"})
    public List<BaremeIUTSDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public BaremeIUTSDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping({"", "/create"})
    @ResponseStatus(HttpStatus.CREATED)
    public BaremeIUTSDto create(@RequestBody BaremeIUTSDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public BaremeIUTSDto update(@PathVariable Long id, @RequestBody BaremeIUTSDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
