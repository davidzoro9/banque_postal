package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatOdComptableRowDto {
    private String codeJournal; // "OD_PAIE"
    private String numeroCompte; // Ex: 641100, 421100
    private String libelleCompte; // Ex: "Salaires de base du personnel"
    private String sens; // "D" ou "C"
    private BigDecimal montantDebit;
    private BigDecimal montantCredit;
    private String referencePiece;
    private String libelleEcriture;
}
