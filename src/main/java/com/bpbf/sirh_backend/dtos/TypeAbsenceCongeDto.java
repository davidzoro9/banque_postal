package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TypeAbsenceCongeDto {
    private Long id;
    private String code;
    private String name;
    private Boolean deductibleDuSolde;
    private Integer dureeMaxLegaleJours;
    private String categorie;
    private String sexeRequis;
    private Boolean remunere;
    private Double tauxRemuneration;
    private Boolean justificatifRequis;
    private String typeJustificatif;
    private Boolean actif;
    private Integer delaiJustificationJours;
    private String description;
}
