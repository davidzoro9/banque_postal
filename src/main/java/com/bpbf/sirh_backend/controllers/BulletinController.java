package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.BulletinDto;
import com.bpbf.sirh_backend.services.BulletinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bulletins")
@RequiredArgsConstructor
public class BulletinController {

    private final BulletinService bulletinService;

    @GetMapping
    public ResponseEntity<List<BulletinDto>> getAll() {
        return ResponseEntity.ok(bulletinService.getAllBulletins());
    }

    @PostMapping
    public ResponseEntity<BulletinDto> createOrSave(@RequestBody BulletinDto dto) {
        return ResponseEntity.ok(bulletinService.saveIndividualBulletin(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BulletinDto> update(@PathVariable Long id, @RequestBody BulletinDto dto) {
        return ResponseEntity.ok(bulletinService.updateBulletin(id, dto));
    }

    @PostMapping("/generer/session/{sessionPaieId}")
    public ResponseEntity<List<BulletinDto>> generateForSession(@PathVariable Long sessionPaieId) {
        return ResponseEntity.ok(bulletinService.generateBulletinsForSession(sessionPaieId));
    }

    @PostMapping("/valider/session/{sessionPaieId}")
    public ResponseEntity<Void> validateSession(@PathVariable Long sessionPaieId) {
        bulletinService.validateSession(sessionPaieId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/session/{sessionPaieId}")
    public ResponseEntity<List<BulletinDto>> getBySession(@PathVariable Long sessionPaieId) {
        return ResponseEntity.ok(bulletinService.getBulletinsBySession(sessionPaieId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<BulletinDto>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(bulletinService.getBulletinsByEmployee(employeeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BulletinDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bulletinService.getBulletinById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bulletinService.deleteBulletin(id);
        return ResponseEntity.noContent().build();
    }
}
