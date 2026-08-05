package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.DirectionDto;
import com.bpbf.sirh_backend.services.DirectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/directions")
@RequiredArgsConstructor
public class DirectionController {

    private final DirectionService directionService;

    @GetMapping
    public List<DirectionDto> getAll(){
        return directionService.getAllDirection();
    }

    @PostMapping("/create")
    public DirectionDto create(@RequestBody DirectionDto directionDto){
        return directionService.createDirection(directionDto);
    }

    @PutMapping("/{id}")
    public DirectionDto update(@PathVariable Long id , @RequestBody DirectionDto directionDto){
        return directionService.updateDirection(id, directionDto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        directionService.delete(id);
        return "Opération éffectutée avec succès";
    }
}
