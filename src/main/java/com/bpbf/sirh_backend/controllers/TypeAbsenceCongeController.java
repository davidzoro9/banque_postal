package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.TypeAbsenceCongeDto;
import com.bpbf.sirh_backend.services.TypeAbsenceCongeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/typeabsenceconge")
@CrossOrigin(origins = "*")
public class TypeAbsenceCongeController {

    private final TypeAbsenceCongeService typeAbsenceCongeService;

    @GetMapping({"", "/all"})
    public List<TypeAbsenceCongeDto> getAll() {
        return typeAbsenceCongeService.getAllTypeAbsenceConge();
    }

    @PostMapping({"", "/create"})
    public TypeAbsenceCongeDto create(@RequestBody TypeAbsenceCongeDto typeAbsenceCongeDto){
        return typeAbsenceCongeService.createTypeAbsenceConge(typeAbsenceCongeDto);
    }

    @PutMapping("/{id}")
    public TypeAbsenceCongeDto update(@PathVariable Long id, @RequestBody TypeAbsenceCongeDto typeAbsenceCongeDto){
        return typeAbsenceCongeService.updateTypeAbsenceConge(id, typeAbsenceCongeDto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        typeAbsenceCongeService.delete(id);
        return "Opération éffectutée avec succès";
    }
}
