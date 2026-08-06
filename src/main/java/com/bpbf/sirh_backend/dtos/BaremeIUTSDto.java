package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BaremeIUTSDto {
    private Long id;
    private String code;
    private Double trancheMin;
    private Double trancheMax;
    private Double tauxPercent;
    private Double abattementFixe;
    private Boolean actif;
}
