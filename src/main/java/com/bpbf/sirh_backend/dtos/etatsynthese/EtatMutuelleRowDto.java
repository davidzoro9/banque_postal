package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatMutuelleRowDto {
    private String matricule;
    private String nomPrenom;
    private String direction;
    private String formuleMutuelle;
    private BigDecimal partSalariale;
    private BigDecimal partPatronale;
    private BigDecimal totalCotisation;
}
