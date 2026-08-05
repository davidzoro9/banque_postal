package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParametrageIndemniteDto {
    private Long id;
    private String code;
    private String typeIndemnite;
    private String fonction;
    private String grade;
    private String categorie;
    private Double taux;
    private Double tauxExoneration;
    private Double plafondExoneration;
    private Boolean actif;
}
