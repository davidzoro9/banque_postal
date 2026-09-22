package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.DashboardStatsDto;

public interface DashboardStatsService {
    DashboardStatsDto.GrhStats getGrhStats();
    DashboardStatsDto.DonneesBaseStats getDonneesBaseStats();
    DashboardStatsDto.ProfilsStats getProfilsStats();
    DashboardStatsDto.PaieStats getPaieStats();
    DashboardStatsDto.GlobalStats getGlobalStats();
}
