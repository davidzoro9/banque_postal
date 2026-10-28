package com.bpbf.sirh_backend.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SensEcritureDto {
    private Long id;
    private String code;
    private String libelle;
    private String description;
    private Integer ordre;
    private Boolean actif;

    public SensEcritureDto() {}

    public SensEcritureDto(Long id, String code, String libelle, String description, Integer ordre, Boolean actif) {
        this.id = id;
        this.code = code;
        this.libelle = libelle;
        this.description = description;
        this.ordre = ordre;
        this.actif = actif;
    }
}
