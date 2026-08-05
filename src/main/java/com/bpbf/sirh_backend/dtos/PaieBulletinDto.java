package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaieBulletinDto {
    private Long employeeId;
    private String employeeName;
    private String matricule;
    private String fonction;
    private String grade;
    private String categorie;
    
    private Double salaireBase;
    private List<IndemniteItemDto> indemnitesDetails;
    private Double totalIndemnites;
    
    private Double salaireBrut;
    private Double cotisationCNSS;
    private Double impotIUTS;
    private Double totalRetenues;
    
    private Double salaireNet;
    private String mois;
    private String etat;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IndemniteItemDto {
        private String code;
        private String typeIndemnite;
        private Double montant;
    }
}
