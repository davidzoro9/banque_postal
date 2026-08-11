package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParametrageRetraiteDto {
    private Long id;
    private String code;
    private Long gradeId;
    private String gradeLibelle;
    private String libelle;
    private Double taux;
    private String description;
    private Boolean actif;
}
