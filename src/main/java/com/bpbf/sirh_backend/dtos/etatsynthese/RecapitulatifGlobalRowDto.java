package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecapitulatifGlobalRowDto {
    private String numeroCompte;
    private String intituleCompte;
    private String sens; // DEBIT ou CREDIT
    private BigDecimal montantDebit;
    private BigDecimal montantCredit;
    private String categorieComptable;
}
