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

    @Builder.Default
    private List<VirementItemDto> virements = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VirementItemDto {
        private String matricule;
        private String nomPrenom;
        private String emploi;
        private String numeroCompte;
        private String iban;
        private BigDecimal montantNet;
    }
}
