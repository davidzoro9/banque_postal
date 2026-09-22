package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExonerationFiscaleDto {
    private Long id;
    private String code;
    private String name;
    private Double tauxExoneration;
    private Double plafondExoneration;
    private String description;
    private Boolean actif;
}
