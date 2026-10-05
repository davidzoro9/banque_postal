package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationIndemnitesAutoDto {
    private Double indemniteLogement;
    private Double indemniteTransport;
    private Double indemniteFonction;
    private Double indemniteCaisse;
    private Double indemniteSujetion;
    private Double indemniteCashPoint;
    private Double autresIndemnites;
    private Double totalIndemnites;
    private List<IndemniteDetailDto> details;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IndemniteDetailDto {
        private String code;
        private String libelle;
        private Double montant;
        private String origine; // "STATUTAIRE", "POSTE", "FONCTION", "CONVENTION"
    }
}
