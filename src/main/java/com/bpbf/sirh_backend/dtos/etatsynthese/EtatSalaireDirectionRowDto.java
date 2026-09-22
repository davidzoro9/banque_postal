package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatSalaireDirectionRowDto {
    private String directionNom;
    private String departementNom;
    private Integer effectif;
    private BigDecimal totalSalaireBase;
    private BigDecimal totalIndemnites;
    private BigDecimal totalBrut;
    private BigDecimal totalCotisationsPatronales;
    private BigDecimal totalMasseSalariale;
    private BigDecimal totalRetenues;
    private BigDecimal totalNet;
}
