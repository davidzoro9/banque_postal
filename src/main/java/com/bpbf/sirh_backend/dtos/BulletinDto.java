package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulletinDto {
    private Long id;
    private String code;
    private Long employeeId;
    private String employeeName;
    private String matricule;
    private String fonction;
    private Long sessionPaieId;
    private String sessionPaieCode;
    private String sessionPeriode;
    private Long gradeId;
    private String gradeLibelle;
    private Long contratId;
    private String typeSession;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private BigDecimal scheduledWorkingDays;
    private BigDecimal workedDays;
    private BigDecimal salaireBase;
    private BigDecimal totalIndemnites;
    private BigDecimal totalAvoirs;
    private BigDecimal salaireBrut;
    private BigDecimal totalExonerations;
    private BigDecimal abattementForfaitaire;
    private BigDecimal baseImposable;
    private BigDecimal cotisationCnss;
    private BigDecimal impotIutsSansCharge;
    private BigDecimal reductionIutsCharge;
    private BigDecimal impotIuts;
    private BigDecimal totalRetenuesSociales;
    private BigDecimal totalPrecomptes;
    private BigDecimal totalRetenues;
    private BigDecimal totalCotisationsPatronales;
    private BigDecimal salaireNet;
    private String statut;
    private LocalDateTime dateCalcul;
    private LocalDateTime dateValidation;
    private List<BulletinLineDto> lines;
}
