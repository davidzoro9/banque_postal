package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class DashboardStatsDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GrhStats {
        private long agentsActifs;
        private long totalAgents;
        private long demandesCongeEnAttente;
        private long totalConges;
        private long absencesSignalees;
        private long contratsActifs;
        private long contratsARenouveler;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DonneesBaseStats {
        private long emploisCount;
        private long directionsCount;
        private long departmentsCount;
        private long directionsEtDeptsCount;
        private long grillesCount;
        private long echelonsCount;
        private long indemnitesCount;
        private long typesContratsCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfilsStats {
        private long rolesCount;
        private long usersCount;
        private long activeUsers;
        private long permissionsCount;
        private long manualsCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaieStats {
        private long bulletinsTraites;
        private long bulletinsATraiter;
        private long totalAgents;
        private long rubriquesCount;
        private long sessionsCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GlobalStats {
        private GrhStats grh;
        private DonneesBaseStats donneesBase;
        private ProfilsStats profils;
        private PaieStats paie;
    }
}
