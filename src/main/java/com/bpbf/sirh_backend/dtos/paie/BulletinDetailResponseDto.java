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
public class BulletinDetailResponseDto {
    private Long id;
    private String code;
    private Long employeeId;
    private String employeeName;
    private String matricule;
    private Long gradeId;
    private String gradeLibelle;
    private Long contractId;
    private String typeSession;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private BigDecimal scheduledWorkingDays;
    private BigDecimal workedDays;
    
    @Builder.Default
    private List<BulletinLineResponseDto> lines = new ArrayList<>();

    private BigDecimal totalBrut;
    private BigDecimal totalRetenues;
    private BigDecimal netAPayer;
    private String statut;
}
