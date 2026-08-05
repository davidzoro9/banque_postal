package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.PaieBulletinDto;
import com.bpbf.sirh_backend.services.PaieCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/paie")
@RequiredArgsConstructor
public class PaieController {

    private final PaieCalculationService paieCalculationService;

    @GetMapping("/calculer/{employeeId}")
    public PaieBulletinDto getCalculatedPayslip(@PathVariable Long employeeId) {
        return paieCalculationService.calculatePayslipForEmployee(employeeId);
    }

    @GetMapping("/calculer-tous")
    public List<PaieBulletinDto> getAllCalculatedPayslips() {
        return paieCalculationService.calculateAllPayslips();
    }
}
