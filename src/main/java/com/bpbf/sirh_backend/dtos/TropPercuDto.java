package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TropPercuDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String matricule;
    private Long salaryElementId;
    private String salaryElementName;
    private String salaryElementCode;
    private String moisOrigine;
    private String moisApplication;
    private BigDecimal amount;
    private String motif;
    private String statut;
    private LocalDateTime dateCreation;
}
