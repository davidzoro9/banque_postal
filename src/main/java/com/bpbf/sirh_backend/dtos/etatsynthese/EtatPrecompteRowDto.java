package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatPrecompteRowDto {
    private String matricule;
    private String nomPrenom;
    private String typePrecompte;
    private String organismeBeneficiaire;
    private BigDecimal montantTotalInitial;
    private BigDecimal retenuePeriode;
    private BigDecimal soldeRestantDu;
    private Integer echeanceCourante;
    private Integer nombreEcheancesTotal;
}
