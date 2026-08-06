package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RetenueSalarialeDto {
    private Long id;
    private String code;
    private String name;
    private String typeRetenue;
    private Double tauxPercent;
    private Double montantFixe;
    private String description;
    private Boolean actif;
}
