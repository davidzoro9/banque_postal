package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrecompteEmployeDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String matricule;
    private Long rubriquePaieId;
    private String rubriquePaieLibelle;
    private String libelle;
    private BigDecimal montantInitial;
    private BigDecimal montantMensuel;
    private BigDecimal montantRestant;
    private Integer echeancesTotal;
    private Integer echeancesRestantes;
    private LocalDate dateDebut;
    private LocalDate dateFinPrevue;
    private String statut;
    private String motif;
    private LocalDateTime dateCreation;
}
