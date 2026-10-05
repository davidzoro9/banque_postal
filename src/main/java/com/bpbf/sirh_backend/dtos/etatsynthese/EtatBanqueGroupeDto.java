package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatBanqueGroupeDto {
    private String banqueNom;
    private String codeBanque;
    private Integer nombreBeneficiaires;
    private BigDecimal totalNet;
    private String montantEnLettres; // Arrêté le présent état à la somme de...

    @Builder.Default
    private List<VirementItemDto> virements = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VirementItemDto {
        // Colonnes officielles - Modèle 2 (Page 2) : ÉTAT DE VIREMENT DES SALAIRES
        private String matricule;
        private String nomPrenom;
        private String codeBanque;
        private String codeGuichet;
        private String compteACrediter;
        private String cle;
        private BigDecimal montant;

        // Champs de rétrocompatibilité
        private String emploi;
        private String numeroCompte;
        private String iban;
        private BigDecimal montantNet;
    }
}
