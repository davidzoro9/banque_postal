package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.paie.*;
import com.bpbf.sirh_backend.services.BulletinLotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bulletin-lots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BulletinLotController {

    private final BulletinLotService bulletinLotService;

    @GetMapping
    public ResponseEntity<List<BulletinLotResponseDto>> getAll() {
        return ResponseEntity.ok(bulletinLotService.getAllLots());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BulletinLotResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bulletinLotService.getLotById(id));
    }

    @PostMapping
    public ResponseEntity<BulletinLotResponseDto> create(@RequestBody BulletinLotCreateDto dto) {
        return ResponseEntity.ok(bulletinLotService.createLot(dto));
    }

    @PostMapping("/generate")
    public ResponseEntity<List<BulletinSummaryResponseDto>> generateForLot(@RequestBody GeneratePayrollRequestDto req) {
        return ResponseEntity.ok(bulletinLotService.generateBulletinsForLot(req));
    }

    @PostMapping("/{id}/valider")
    public ResponseEntity<BulletinLotResponseDto> valider(@PathVariable Long id) {
        return ResponseEntity.ok(bulletinLotService.validerLot(id));
    }

    @PostMapping("/{id}/cloturer")
    public ResponseEntity<BulletinLotResponseDto> cloturer(@PathVariable Long id) {
        return ResponseEntity.ok(bulletinLotService.cloturerLot(id));
    }
}
