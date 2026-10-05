package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LivrePaieRowDto {
    private Long bulletinId;
    
    // 17 Colonnes officielles - Modèle 3 (Page 3) : REGISTRE DE PAIE
    private String matricule;            // 1. Mle
    private String nomPrenom;             // 2. Nom et Prénoms
    private String grade;                 // 3. Grade
    private BigDecimal salaireBase;       // 4. Salaire de base
    private BigDecimal surSalaire;        // 5. Sursalaire
    private BigDecimal indemnitesEtPrimes;// 6. Indemnités et primes
    private BigDecimal salaireBrut;       // 7. Total brut
    private BigDecimal assVieillesse;     // 8. Ass. vieillesse (CNSS 5.5%)
    private BigDecimal partPatronale;     // 9. Part patronale
    private BigDecimal baseImposable;     // 10. Base imposable
    private Integer charges;              // 11. Chrg (charges de famille)
    private BigDecimal impotIuts;         // 12. IUTS
    private BigDecimal salaireNet;        // 13. Salaire net
    private BigDecimal totalRetenues;     // 14. Total retenues
    private BigDecimal netAPayer;         // 15. Net à payer
    private BigDecimal tpa;               // 16. TPA (Taxe Patronale d'Apprentissage)
    private BigDecimal masseSalariale;    // 17. Masse salariale

    // Champs analytiques complémentaires
    private String emploi;
    private String direction;
    private String service;
    private BigDecimal indemnites;        // Alias pour indemnitesEtPrimes
    private BigDecimal totalAvoirs;
    private BigDecimal cotisationCnss;    // Alias pour assVieillesse
    private BigDecimal totalPrecomptes;
}
