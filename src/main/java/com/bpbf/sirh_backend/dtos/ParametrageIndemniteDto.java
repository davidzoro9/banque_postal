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
    private Long typeIndemniteId;
    private Long fonctionId;
    private Long gradeId;
    private Long categorieId;

    private Double taux;
    private Boolean actif;
}
