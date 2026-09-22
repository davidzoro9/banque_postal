package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatSyntheseWrapperDto {
    private String typeEtat;
    private String titreEtat;
    private String codeSession;
    private String periode;
    private Integer annee;
    private String mois;
    private String typeSession;
    private Integer nombreBulletins;
    private BigDecimal totalBrut;
    private BigDecimal totalNet;
    private BigDecimal totalRetenues;
    private BigDecimal totalCotisationsPatronales;
    private BigDecimal totalMasseSalariale;

    @Builder.Default
    private List<Object> donnees = new ArrayList<>();
    
    // Résumé ou totaux personnalisés selon l'état
    private Object totaux;
}
