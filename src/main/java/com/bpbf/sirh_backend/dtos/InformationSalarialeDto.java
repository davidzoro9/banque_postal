package com.bpbf.sirh_backend.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class InformationSalarialeDto {
    private Long id;
    private Long employeeId;
    private String modePaiement;
    private String banque;
    private String iban;
    private String intituleCompte;
    private BigDecimal salaireBase;
    private List<IndemniteEmployeDto> indemnites;
    private BigDecimal totalIndemnites;
    private BigDecimal remunerationBrute;
    private BigDecimal totalExonerations;
    private BigDecimal baseImposable;
    private BigDecimal abattementForfaitaire;
    private List<InformationSalarialeRetenueDto> retenuesAgent;
    private BigDecimal totalRetenuesAgent;
    private List<InformationSalarialeRetenueDto> retenuesEmployeur;
    private BigDecimal totalRetenuesEmployeur;
    private Integer nombrePersonnesCharge;
    private BigDecimal iutsSansCharge;
    private BigDecimal tauxReductionCharge;
    private BigDecimal reductionIutsCharge;
    private BigDecimal iutsAvecCharge;
    private BigDecimal totalDeduitEmploye;
    private BigDecimal salaireNet;
}
