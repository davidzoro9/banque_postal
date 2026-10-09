package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.RibValidationDto;
import com.bpbf.sirh_backend.services.RibValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rib")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RibValidationController {

    private final RibValidationService ribValidationService;

    @GetMapping("/valider")
    public ResponseEntity<RibValidationDto> validerRib(
            @RequestParam(required = false) String rib,
            @RequestParam(required = false) String banque,
            @RequestParam(required = false) String guichet,
            @RequestParam(required = false) String compte,
            @RequestParam(required = false) String cle) {

        if (rib != null && !rib.isBlank()) {
            return ResponseEntity.ok(ribValidationService.validerRib(rib));
        }

        return ResponseEntity.ok(ribValidationService.validerComposants(banque, guichet, compte, cle));
    }

    @GetMapping("/calculer-cle")
    public ResponseEntity<RibValidationDto> calculerCle(
            @RequestParam String banque,
            @RequestParam String guichet,
            @RequestParam String compte) {

        String cle = ribValidationService.calculerCleRib(banque, guichet, compte);
        return ResponseEntity.ok(ribValidationService.validerComposants(banque, guichet, compte, cle));
    }
}
