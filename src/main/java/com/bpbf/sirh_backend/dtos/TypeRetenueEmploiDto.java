package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TypeRetenueEmploiDto {
    private Long id;
    private String code;
    private String libelle;
    private String typeRetenue;
    private Double taux;
    private String description;
    private Boolean actif;
}
