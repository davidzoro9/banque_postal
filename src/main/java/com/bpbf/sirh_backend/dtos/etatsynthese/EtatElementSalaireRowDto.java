package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatElementSalaireRowDto {
    private String codeRubrique;
    private String libelleRubrique;
    private String typeRubrique; // GAIN, RETENUE_SOCIALE, IMPOT, PRECOMPTE, COTISATION_PATRONALE
    private Integer nombreBeneficiaires;
    private BigDecimal totalMontantSalarial;
    private BigDecimal totalMontantPatronal;
    private BigDecimal totalGlobal;
}
