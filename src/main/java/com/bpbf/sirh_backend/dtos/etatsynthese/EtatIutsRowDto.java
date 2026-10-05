package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatIutsRowDto {
    // Colonnes officielles - Modèle 7 (Page 7) : ÉTAT DES RETENUES IUTS
    private Integer numeroOrdre;
    private String nomPrenom;
    private BigDecimal salaireBruts;        // Total des salaires bruts
    private BigDecimal baseImposable;       // Base imposable IUTS
    private Integer nbDeCharges;            // Nb de charges de famille
    private BigDecimal iutsAReverser;       // IUTS net à reverser

    // Rétrocompatibilité
    private String matricule;
    private BigDecimal salaireBrut;
    private BigDecimal totalExonerations;
    private BigDecimal abattementForfaitaire;
    private Integer nombreCharges;
    private BigDecimal impotIutsBrut;
    private BigDecimal reductionPourCharges;
    private BigDecimal impotIutsNet;
}
