package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.TypeContratDto;
import com.bpbf.sirh_backend.services.TypeContratService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/typecontrat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TypeContratController {

    private final TypeContratService typeContratService;

    @GetMapping({"", "/all"})
    public List<TypeContratDto> getAll() {
        return typeContratService.getAllTypeContrat();
    }

    @PostMapping({"", "/create"})
    public TypeContratDto create(@RequestBody TypeContratDto typeContratDto){
        return typeContratService.createTypeContrat(typeContratDto);
    }

    @PutMapping("/{id}")
    public TypeContratDto update(@PathVariable Long id, @RequestBody TypeContratDto typeContratDto){
        return typeContratService.updateTypeContrat(id, typeContratDto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        typeContratService.delete(id);
        return "Opération éffectutée avec succès";
    }
}
