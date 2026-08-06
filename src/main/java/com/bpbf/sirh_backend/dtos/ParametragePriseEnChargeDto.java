package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParametragePriseEnChargeDto {
    private Long id;
    private String code;
    private String libelle;
    private Double taux;
    private String description;
    private Boolean actif;
}
