package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatFspRowDto {
    // Colonnes officielles - Modèle 8 (Page 8) : RETENUE FONDS DE SOLIDARITE
    private Integer numeroOrdre;
    private String matricule;
    private String nomPrenom;
    private BigDecimal salaireNet;       // Assiette net cédulaire
    private BigDecimal taux;             // Taux (1%)
    private BigDecimal montant;          // Montant prélevé

    // Rétrocompatibilité
    private String direction;
    private BigDecimal salaireBrut;
    private BigDecimal assietteCalcul;
    private BigDecimal tauxFsp;
    private BigDecimal montantRetenu;
}
