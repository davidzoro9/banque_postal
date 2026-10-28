package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatStcRowDto {
    private Integer numeroOrdre;
    private Long bulletinId;
    private String matricule;
    private String nomPrenom;
    private String emploi;
    private String direction;
    private String motifRupture; // Ex: Licenciement, Retraite, Fin CDD, Rupture conventionnelle
    
    // Ancienneté & Salaires de référence
    private BigDecimal ancienneteAnnees; // Ex: 12.0 ans
    private BigDecimal salaireGlobalMoyen; // SGM (Base préavis / licenciement)
    private BigDecimal salaireMoyenJournalier; // SMJ (Base congés acquis)
    
    // 1. Congés acquis (ICCP)
    private BigDecimal joursCongesAcquis; // Ex: 15.0 jours
    private BigDecimal indemniteCongesAcquis; // Ex: 252 153 FCFA
    
    // 2. Indemnité de Licenciement ou de Départ à la retraite
    private BigDecimal indemniteLicenciement; // Ex: 2 303 940 FCFA
    
    // 3. Indemnité compensatrice de préavis
    private Integer moisPreavis; // Ex: 3 mois ou 1 mois
    private BigDecimal indemnitePreavis; // Ex: montant préavis
    
    // 4. Prorata 13ème et 14ème mois
    private BigDecimal prorataGratifications; // Prorata 13ème + 14ème mois
    
    // 5. Total Brut STC
    private BigDecimal totalBrutStc;
    
    // 6. Exonérations fiscales & sociales (licenciement/retraite 100% exonérées)
    private BigDecimal totalExonerations;
    
    // 7. Retenues fiscales et sociales (IUTS + CNSS + FSP sur éléments imposables)
    private BigDecimal retenuesFiscalesSociales;
    
    // 8. Solde des prêts & précomptes recouvrés intégralement
    private BigDecimal retenuesPretsEtPrecomptes;
    
    // 9. Total Retenues
    private BigDecimal totalRetenues;
    
    // 10. Net Solde de Tout Compte à payer
    private BigDecimal netSoldeToutCompte;
}
