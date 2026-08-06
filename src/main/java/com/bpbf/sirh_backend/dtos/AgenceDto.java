package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgenceDto {
    private Long id;
    private String code;
    private String name;
    private String ville;
    private String adresse;
    private Boolean actif;
}
