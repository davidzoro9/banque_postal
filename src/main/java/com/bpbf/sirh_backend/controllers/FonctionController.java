package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.FonctionDto;
import com.bpbf.sirh_backend.services.FonctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fonctions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FonctionController {

    private final FonctionService fonctionService;

    @GetMapping({"", "/all"})
    public List<FonctionDto> getAll() {
        return fonctionService.getAllFonction();
    }

    @PostMapping({"", "/create"})
    public FonctionDto create(@RequestBody FonctionDto fonctionDto){
        return fonctionService.createFonction(fonctionDto);
    }

    @PutMapping("/{id}")
    public FonctionDto update(@PathVariable Long id, @RequestBody FonctionDto fonctionDto){
        return fonctionService.updateFonction(id, fonctionDto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        fonctionService.delete(id);
        return "Opération éffectutée avec succès";
    }
}
