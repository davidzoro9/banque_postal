package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.BulletinDto;
import com.bpbf.sirh_backend.services.BulletinPdfService;
import com.bpbf.sirh_backend.services.BulletinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bulletins")
@RequiredArgsConstructor
public class BulletinController {

    private final BulletinService bulletinService;
    private final BulletinPdfService bulletinPdfService;

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

    @PutMapping("/{id}/justification")
    public ResponseEntity<BulletinDto> updateJustification(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String justification = body != null ? body.get("justification") : null;
        return ResponseEntity.ok(bulletinService.updateJustification(id, justification));
    }

    @PostMapping("/generer/session/{sessionPaieId}")
    public ResponseEntity<List<BulletinDto>> generateForSession(
            @PathVariable Long sessionPaieId,
            @RequestBody(required = false) List<Long> employeeIds) {
        return ResponseEntity.ok(bulletinService.generateBulletinsForSession(sessionPaieId, employeeIds));
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

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getBulletinPdf(@PathVariable Long id) {
        byte[] pdfBytes = bulletinPdfService.generateBulletinPdf(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"bulletin-" + id + ".pdf\"")
                .body(pdfBytes);
    }

    @PostMapping("/pdf/preview")
    public ResponseEntity<byte[]> previewBulletinPdf(@RequestBody BulletinDto dto) {
        byte[] pdfBytes = bulletinPdfService.generateBulletinPreviewPdf(dto);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"bulletin-preview.pdf\"")
                .body(pdfBytes);
    }

    @GetMapping("/session/{sessionPaieId}/registre/pdf")
    public ResponseEntity<byte[]> getRegistrePaiePdf(@PathVariable Long sessionPaieId) {
        byte[] pdfBytes = bulletinPdfService.generateRegistrePaiePdf(sessionPaieId);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"registre-paie-" + sessionPaieId + ".pdf\"")
                .body(pdfBytes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bulletinService.deleteBulletin(id);
        return ResponseEntity.noContent().build();
    }
}
