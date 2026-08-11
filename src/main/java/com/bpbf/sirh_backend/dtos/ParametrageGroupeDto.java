package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParametrageGroupeDto {
    private Long id;
    private String code;
    private Long gradeId;
    private String gradeLibelle;
    private Long categorieId;
    private String categorieLibelle;
    private String libelle;
    private String description;
    private Boolean actif;
}
