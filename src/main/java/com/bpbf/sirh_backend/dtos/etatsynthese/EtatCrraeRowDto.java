package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatCrraeRowDto {
    private Integer numeroOrdre;
    private String matricule;
    private String nomPrenom;
    private BigDecimal salaireSoumisCotisation;
    private BigDecimal tauxPatronal;
    private BigDecimal cotisationPatronale;
    private BigDecimal tauxSalarial;
    private BigDecimal cotisationSalariale;
    private BigDecimal montantTotalCotisations;
    private String typeRegime; // RRPC (19%), RCPNC (12%), FAAM (1.5%)
}
