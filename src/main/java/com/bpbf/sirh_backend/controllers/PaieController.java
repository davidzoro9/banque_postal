package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.PaieBulletinDto;
import com.bpbf.sirh_backend.services.EmployeeProcessService;
import com.bpbf.sirh_backend.services.PaieCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/paie")
@RequiredArgsConstructor
public class PaieController {

    private final PaieCalculationService paieCalculationService;
    private final EmployeeProcessService employeeProcessService;

    @GetMapping("/calculer/{employeeId}")
    public PaieBulletinDto getCalculatedPayslip(@PathVariable Long employeeId) {
        return paieCalculationService.calculatePayslipForEmployee(employeeId);
    }

    @GetMapping("/calculer-tous")
    public List<PaieBulletinDto> getAllCalculatedPayslips() {
        return paieCalculationService.calculateAllPayslips();
    }

    /**
     * Recalcule les exonérations fiscales de tous les employés avec la formule corrigée.
     * À appeler après un changement de configuration des taux d'exonération
     * ou après une mise à jour de la formule de calcul.
     *
     * POST /api/paie/recalculer-exonerations
     */
    @PostMapping("/recalculer-exonerations")
    public ResponseEntity<Map<String, Object>> recalculerExonerations() {
        Map<String, Object> result = employeeProcessService.recalculerToutesLesExonerations();
        return ResponseEntity.ok(result);
    }
}
