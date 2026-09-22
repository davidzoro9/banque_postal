package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LivrePaieRowDto {
    private Long bulletinId;
    private String matricule;
    private String nomPrenom;
    private String emploi;
    private String direction;
    private String service;
    private BigDecimal salaireBase;
    private BigDecimal surSalaire;
    private BigDecimal indemnites;
    private BigDecimal totalAvoirs;
    private BigDecimal salaireBrut;
    private BigDecimal cotisationCnss;
    private BigDecimal impotIuts;
    private BigDecimal totalPrecomptes;
    private BigDecimal totalRetenues;
    private BigDecimal salaireNet;
}
