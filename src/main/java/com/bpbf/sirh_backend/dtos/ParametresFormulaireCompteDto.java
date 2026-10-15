package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParametresFormulaireCompteDto {
    private List<ClasseComptableDto> classes;
    private List<SensEcritureDto> sens;
    private List<JournalComptableDto> journaux;
    private List<RubriqueOptionDto> rubriques;
}
