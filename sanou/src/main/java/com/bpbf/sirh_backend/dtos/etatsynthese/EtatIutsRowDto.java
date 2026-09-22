package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatIutsRowDto {
    private String matricule;
    private String nomPrenom;
    private BigDecimal salaireBrut;
    private BigDecimal totalExonerations;
    private BigDecimal abattementForfaitaire;
    private BigDecimal baseImposable;
    private Integer nombreCharges;
    private BigDecimal impotIutsBrut;
    private BigDecimal reductionPourCharges;
    private BigDecimal impotIutsNet;
}
