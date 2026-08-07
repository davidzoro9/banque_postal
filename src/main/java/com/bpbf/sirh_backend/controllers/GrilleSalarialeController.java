package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.GrilleSalarialeDto;
import com.bpbf.sirh_backend.services.GrilleSalarialeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/grillesalariale")
@CrossOrigin(origins = "*")
public class GrilleSalarialeController {

    private final GrilleSalarialeService grilleSalarialeService;

    @GetMapping({"", "/all"})
    public List<GrilleSalarialeDto> getAll(){
        return grilleSalarialeService.getAllGrilleSalariale();
    }

    @PostMapping({"", "/create"})
    public GrilleSalarialeDto create(@RequestBody GrilleSalarialeDto grilleSalarialeDto){
        return grilleSalarialeService.createGrilleSalariale(grilleSalarialeDto);
    }

    @PutMapping("/{id}")
    public GrilleSalarialeDto update(@PathVariable Long id, @RequestBody GrilleSalarialeDto grilleSalarialeDto){
        return grilleSalarialeService.updateGrilleSalariale(id, grilleSalarialeDto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        grilleSalarialeService.delete(id);
        return "Service supprimé avec succès";
    }

}
