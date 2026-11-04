package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LivrePaieEcartDto {
    private String codeRubrique;
    private String libelle;
    private String typeLigne;
    private BigDecimal montantActuel;
    private BigDecimal montantPrecedent;
    private BigDecimal ecart;
    private Double pourcentageVariation;
    private String justification;
    private Integer nombreBeneficiairesActuel;
    private Integer nombreBeneficiairesPrecedent;
}
