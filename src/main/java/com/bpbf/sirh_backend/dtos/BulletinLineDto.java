package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulletinLineDto {
    private Long id;
    private Long bulletinId;
    private Long rubriquePaieId;
    private String code;
    private String libelle;
    private String typeLigne; // GAIN, RETENUE_SOCIALE, IMPOT, PRECOMPTE, COTISATION_PATRONALE
    private BigDecimal baseCalcul;
    private BigDecimal taux;
    private BigDecimal montant;
    private BigDecimal partPatronale;
    private Integer ordre;
}
