package com.bpbf.sirh_backend.dtos.paie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrecompteResponseDto {
    private Long id;
    private String numero;
    private String reference;
    private String motif;
    private String motifAnnulation;
    private Long employeeId;
    private String employeeName;
    private String matricule;
    private Long salaryElementId;
    private String salaryElementName;
    private String salaryElementCode;
    private BigDecimal amount;                // Montant Initial
    private BigDecimal montantRestant;        // Reste
    private BigDecimal montantRembourse;      // Mt. Remb.
    private BigDecimal retenueMensuelle;      // Ret. Mens.
    private Integer echeance;
    private LocalDate dateDebut;
    private LocalDate dateEcheance;
    private String statut;
    @Builder.Default
    private List<PrecompteVersementDto> versements = new ArrayList<>();
}
