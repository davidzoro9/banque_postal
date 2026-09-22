package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatCnssRowDto {
    private String matricule;
    private String nomPrenom;
    private String noCnss;
    private String dateEmbauche;
    private BigDecimal salaireBrut;
    private BigDecimal assietteCotisable;
    private BigDecimal partSalariale; // 5.5%
    private BigDecimal partPatronalePrestations; // 7.0%
    private BigDecimal partPatronaleRisques; // 3.5%
    private BigDecimal partPatronaleRetraite; // 5.5%
    private BigDecimal totalPartPatronale; // 16.0% ou 19.5%
    private BigDecimal totalCotisationCnss; // Salariale + Patronale
}
