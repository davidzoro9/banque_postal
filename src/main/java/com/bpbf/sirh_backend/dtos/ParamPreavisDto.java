package com.bpbf.sirh_backend.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParamPreavisDto {
    private Long id;
    private String code;
    private String libelle;
    private String typePersonnel;
    private Integer dureeMois;
    private String description;
    private Integer ordre;
    private Boolean actif;
}

