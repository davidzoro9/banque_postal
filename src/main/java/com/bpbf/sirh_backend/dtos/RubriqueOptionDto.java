package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RubriqueOptionDto {
    private Long id;
    private String code;
    private String libelle;
    private String sensSuggere;
    private String classeSuggeree;
    private String numeroCompteDefaut;
    private String typeRubrique;
    private String description;
    private Integer ordre;
    private Boolean actif;
}
