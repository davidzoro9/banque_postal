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
public class SimulationResultDto {
    private String mode;

    // Rémunération
    private Double salaireBase;
    private Double surSalaire;
    private Double indemniteLogement;
    private Double indemniteTransport;
    private Double indemniteFonction;
    private Double indemniteCaisse;
    private Double indemniteSujetion;
    private Double indemniteCashPoint;
    private Double autresIndemnites;
    private Double totalIndemnites;
    private List<SimulationIndemnitesAutoDto.IndemniteDetailDto> detailsIndemnites;
    private Double remunerationBrute;

    // Sécurité Sociale (CNSS)
    private Double baseCnss;
    private Double tauxCnssSalarial;
    private Double cotisationCnss;
    private Double brutApresCnss;

    // Fiscalité (IUTS)
    private Double totalExonerations;
    private Double abattementForfaitaire;
    private Double baseImposableIuts;
    private Double iutsBrut;
    private Integer nombrePersonnesCharge;
    private Double tauxReductionCharges;
    private Double reductionIutsCharges;
    private Double iutsNet;

    // Synthèse Salarié
    private Double totalRetenuesSalariales;
    private Double salaireNet;
    private Double netCibleSouhaite;
    private Double ecartNetCible;

    // Coût Global Employeur
    private Double cotisationCnssPatronale;
    private Double totalChargesPatronales;
    private Double coutTotalEmployeur;

    // Poste et Fonction appliqués
    private Long emploiId;
    private String emploiNom;
    private Long fonctionId;
    private String fonctionNom;

    // Remarques et recommandations RH
    private String message;
    private String statutSimulation;
    
    // Lignes de ventilation pour affichage type fiche/bulletin
    private List<LigneSimulationDto> lignesDetails;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LigneSimulationDto {
        private String code;
        private String libelle;
        private String type; // "GAIN", "RETENUE_SALARIALE", "RETENUE_PATRONALE"
        private Double base;
        private Double taux;
        private Double montantGain;
        private Double montantRetenue;
    }
}
