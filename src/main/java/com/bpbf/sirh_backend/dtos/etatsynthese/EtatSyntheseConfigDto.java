package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatSyntheseConfigDto {
    private Long id;
    private String code;
    private String libelle;
    private String categorie;
    private String description;
    private String icon;
    private Integer ordre;
    private boolean actif;
    private boolean isSystem;
    private String filtreType;
    private String typeElementCode;
    private String colonnesJson;
}
