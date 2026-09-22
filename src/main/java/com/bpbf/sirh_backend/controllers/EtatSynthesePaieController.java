package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.etatsynthese.EtatSyntheseWrapperDto;
import com.bpbf.sirh_backend.services.EtatSynthesePaieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paie/etats-synthese")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EtatSynthesePaieController {

    private final EtatSynthesePaieService etatSynthesePaieService;
    private final com.bpbf.sirh_backend.services.EtatSyntheseConfigService etatSyntheseConfigService;

    @GetMapping("/configs")
    public ResponseEntity<java.util.List<com.bpbf.sirh_backend.dtos.etatsynthese.EtatSyntheseConfigDto>> getAllConfigs(
            @RequestParam(defaultValue = "false") boolean onlyActive) {
        return ResponseEntity.ok(etatSyntheseConfigService.getAllConfigs(onlyActive));
    }

    @PostMapping("/configs")
    public ResponseEntity<com.bpbf.sirh_backend.dtos.etatsynthese.EtatSyntheseConfigDto> createConfig(
            @RequestBody com.bpbf.sirh_backend.dtos.etatsynthese.EtatSyntheseConfigDto dto) {
        return ResponseEntity.ok(etatSyntheseConfigService.createConfig(dto));
    }

    @PutMapping("/configs/{id}")
    public ResponseEntity<com.bpbf.sirh_backend.dtos.etatsynthese.EtatSyntheseConfigDto> updateConfig(
            @PathVariable Long id,
            @RequestBody com.bpbf.sirh_backend.dtos.etatsynthese.EtatSyntheseConfigDto dto) {
        return ResponseEntity.ok(etatSyntheseConfigService.updateConfig(id, dto));
    }

    @PatchMapping("/configs/{id}/toggle")
    public ResponseEntity<com.bpbf.sirh_backend.dtos.etatsynthese.EtatSyntheseConfigDto> toggleConfig(
            @PathVariable Long id) {
        return ResponseEntity.ok(etatSyntheseConfigService.toggleActive(id));
    }

    @DeleteMapping("/configs/{id}")
    public ResponseEntity<Void> deleteConfig(@PathVariable Long id) {
        etatSyntheseConfigService.deleteConfig(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<EtatSyntheseWrapperDto> getEtatSynthese(
            @RequestParam(defaultValue = "LIVRE_PAIE") String typeEtat,
            @RequestParam(required = false) Long sessionPaieId,
            @RequestParam(required = false) Long bulletinLotId,
            @RequestParam(required = false) Long directionId,
            @RequestParam(required = false) String banque) {

        EtatSyntheseWrapperDto dto = etatSynthesePaieService.getEtatSynthese(
                typeEtat, sessionPaieId, bulletinLotId, directionId, banque);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downloadPdf(
            @RequestParam(defaultValue = "LIVRE_PAIE") String typeEtat,
            @RequestParam(required = false) Long sessionPaieId,
            @RequestParam(required = false) Long bulletinLotId,
            @RequestParam(required = false) Long directionId,
            @RequestParam(required = false) String banque) {

        byte[] pdfBytes = etatSynthesePaieService.generatePdfReport(
                typeEtat, sessionPaieId, bulletinLotId, directionId, banque);

        String filename = "etat-" + typeEtat.toLowerCase() + ".pdf";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(pdfBytes);
    }

    @GetMapping("/excel")
    public ResponseEntity<byte[]> downloadExcel(
            @RequestParam(defaultValue = "LIVRE_PAIE") String typeEtat,
            @RequestParam(required = false) Long sessionPaieId,
            @RequestParam(required = false) Long bulletinLotId,
            @RequestParam(required = false) Long directionId,
            @RequestParam(required = false) String banque) {

        byte[] csvBytes = etatSynthesePaieService.generateCsvExport(
                typeEtat, sessionPaieId, bulletinLotId, directionId, banque);

        String filename = "etat-" + typeEtat.toLowerCase() + ".csv";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(csvBytes);
    }
}
