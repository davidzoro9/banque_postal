package com.bpbf.sirh_backend.dtos.paie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvoirRequestDto {
    private Long employeeId;
    private Long salaryElementId;
    private String reference;
    private String motif;
    private String motifAnnulation;
    private LocalDate dateDebut;
    private BigDecimal amount;
    private BigDecimal montantRestant;
    private BigDecimal versementMensuel;
    private Integer echeance;
    private LocalDate dateEcheance;
    private String statut;
}

