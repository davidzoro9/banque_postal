package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.EmploiDto;
import com.bpbf.sirh_backend.services.EmploiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emplois")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmploiController {

    private final EmploiService emploiService;

    @GetMapping({"", "/all"})
    public List<EmploiDto> getAll() {
        return emploiService.getAllEmploi();
    }

    @PostMapping({"", "/create"})
    public EmploiDto create(@RequestBody EmploiDto emploiDto){
        return emploiService.createEmploi(emploiDto);
    }

    @PutMapping("/{id}")
    public EmploiDto update(@PathVariable Long id, @RequestBody EmploiDto emploiDto){
        return emploiService.updateEmploi(id, emploiDto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        emploiService.delete(id);
        return "Opération éffectutée avec succès";
    }
}
