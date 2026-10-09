package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteComptableDto {
    private Long id;
    private String numeroCompte;
    private String libelle;
    private String classeCompte;
    private String sensParDefaut;
    private String typeRubriqueAssociee;
    private String codeJournal;
    private String description;
    private Boolean actif;
}
