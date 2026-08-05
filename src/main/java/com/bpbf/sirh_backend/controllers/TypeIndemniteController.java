package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.TypeIndemniteDto;
import com.bpbf.sirh_backend.services.TypeIndemniteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/typeindemnite")
@RequiredArgsConstructor
public class TypeIndemniteController {

    private final TypeIndemniteService typeIndemniteService;

    @GetMapping
    public List<TypeIndemniteDto> getAll() {
        return typeIndemniteService.getAllTypeIndemnite();
    }

    @PostMapping("/create")
    public TypeIndemniteDto create(@RequestBody TypeIndemniteDto typeIndemniteDto){
        return typeIndemniteService.createTypeIndemnite(typeIndemniteDto);
    }

    @PutMapping("/{id}")
    public TypeIndemniteDto update(@PathVariable Long id, @RequestBody TypeIndemniteDto typeIndemniteDto){
        return typeIndemniteService.updateTypeIndemnite(id, typeIndemniteDto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        typeIndemniteService.delete(id);
        return "Opération éffectutée avec succès";
    }
}
