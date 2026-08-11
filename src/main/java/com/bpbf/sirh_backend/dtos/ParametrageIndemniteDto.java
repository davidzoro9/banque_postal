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
    private String typeIndemniteLibelle;
    private Long fonctionId;
    private String fonctionLibelle;
    private Long gradeId;
    private String gradeLibelle;
    private Long categorieId;
    private String categorieLibelle;

    private Double taux;
    private Boolean actif;
}
