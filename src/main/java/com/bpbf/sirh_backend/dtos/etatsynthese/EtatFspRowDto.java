package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatFspRowDto {
    private String matricule;
    private String nomPrenom;
    private String direction;
    private BigDecimal salaireBrut;
    private BigDecimal assietteCalcul;
    private BigDecimal tauxFsp;
    private BigDecimal montantRetenu;
}
