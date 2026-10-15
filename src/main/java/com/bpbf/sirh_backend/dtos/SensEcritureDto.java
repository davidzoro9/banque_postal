package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensEcritureDto {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private Integer ordre;
    private Boolean actif;
}
