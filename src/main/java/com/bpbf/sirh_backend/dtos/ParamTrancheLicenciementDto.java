package com.bpbf.sirh_backend.dtos;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParamTrancheLicenciementDto {
    private Long id;
    private String code;
    private String libelle;
    private Integer anneeDebut;
    private Integer anneeFin;
    private BigDecimal taux;
    private String description;
    private Integer ordre;
    private Boolean actif;
}

