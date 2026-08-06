package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RubriquePaieDto {
    private Long id;
    private String code;
    private String name;
    private String sens;
    private Boolean imposable;
    private Boolean cotisable;
    private String description;
    private Boolean actif;
}
