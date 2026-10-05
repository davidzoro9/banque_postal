package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.SimulationIndemnitesAutoDto;
import com.bpbf.sirh_backend.dtos.SimulationRequestDto;
import com.bpbf.sirh_backend.dtos.SimulationResultDto;
import com.bpbf.sirh_backend.services.SimulationRemunerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/simulation")
@CrossOrigin(origins = "*")
public class SimulationRemunerationController {

    private final SimulationRemunerationService simulationService;

    @PostMapping("/calculer")
    public ResponseEntity<SimulationResultDto> simuler(@RequestBody SimulationRequestDto request) {
        SimulationResultDto result = simulationService.simuler(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/indemnites-auto")
    public ResponseEntity<SimulationIndemnitesAutoDto> determinerIndemnitesAuto(@RequestBody SimulationRequestDto request) {
        SimulationIndemnitesAutoDto indemnites = simulationService.determinerIndemnitesConventionnelles(request);
        return ResponseEntity.ok(indemnites);
    }

    @GetMapping("/indemnites-auto")
    public ResponseEntity<SimulationIndemnitesAutoDto> determinerIndemnitesAutoGet(
            @RequestParam(required = false) Long gradeId,
            @RequestParam(required = false) String gradeCode,
            @RequestParam(required = false) Long categorieId,
            @RequestParam(required = false) String categorieCode,
            @RequestParam(required = false) Long emploiId,
            @RequestParam(required = false) String emploiNom,
            @RequestParam(required = false) Long fonctionId,
            @RequestParam(required = false) String fonctionNom,
            @RequestParam(required = false) Boolean vehiculeFourni,
            @RequestParam(required = false) Boolean logementFourni) {

        SimulationRequestDto req = SimulationRequestDto.builder()
                .gradeId(gradeId)
                .gradeCode(gradeCode)
                .categorieId(categorieId)
                .categorieCode(categorieCode)
                .emploiId(emploiId)
                .emploiNom(emploiNom)
                .fonctionId(fonctionId)
                .fonctionNom(fonctionNom)
                .vehiculeFourni(vehiculeFourni)
                .logementFourni(logementFourni)
                .build();

        SimulationIndemnitesAutoDto indemnites = simulationService.determinerIndemnitesConventionnelles(req);
        return ResponseEntity.ok(indemnites);
    }
}
