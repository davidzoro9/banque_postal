package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.DirectionDto;
import com.bpbf.sirh_backend.services.DirectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/directions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DirectionController {

    private final DirectionService directionService;

    @GetMapping({"", "/all"})
    public List<DirectionDto> getAll(){
        return directionService.getAllDirection();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DirectionDto> getById(@PathVariable Long id){
        return ResponseEntity.ok(directionService.getDirectionById(id));
    }

    @PostMapping({"", "/create"})
    public DirectionDto create(@RequestBody DirectionDto directionDto){
        return directionService.createDirection(directionDto);
    }

    @PutMapping("/{id}")
    public DirectionDto update(@PathVariable Long id , @RequestBody DirectionDto directionDto){
        return directionService.updateDirection(id, directionDto);
    }

    @PutMapping("/{id}/directeur")
    public ResponseEntity<DirectionDto> assignDirecteur(
            @PathVariable Long id,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(defaultValue = "true") boolean syncEmployees) {
        return ResponseEntity.ok(directionService.assignDirecteur(id, employeeId, syncEmployees));
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        directionService.delete(id);
        return "Opération éffectutée avec succès";
    }
}
