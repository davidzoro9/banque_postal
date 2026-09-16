package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.DashboardStatsDto;
import com.bpbf.sirh_backend.services.DashboardStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/stats", "/api/dashboard/stats"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardStatsController {

    private final DashboardStatsService dashboardStatsService;

    @GetMapping("/grh")
    public ResponseEntity<DashboardStatsDto.GrhStats> getGrhStats() {
        return ResponseEntity.ok(dashboardStatsService.getGrhStats());
    }

    @GetMapping("/donnees-base")
    public ResponseEntity<DashboardStatsDto.DonneesBaseStats> getDonneesBaseStats() {
        return ResponseEntity.ok(dashboardStatsService.getDonneesBaseStats());
    }

    @GetMapping("/profils")
    public ResponseEntity<DashboardStatsDto.ProfilsStats> getProfilsStats() {
        return ResponseEntity.ok(dashboardStatsService.getProfilsStats());
    }

    @GetMapping("/paie")
    public ResponseEntity<DashboardStatsDto.PaieStats> getPaieStats() {
        return ResponseEntity.ok(dashboardStatsService.getPaieStats());
    }

    @GetMapping("/global")
    public ResponseEntity<DashboardStatsDto.GlobalStats> getGlobalStats() {
        return ResponseEntity.ok(dashboardStatsService.getGlobalStats());
    }
}
