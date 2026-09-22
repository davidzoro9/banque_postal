package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatBulletinControleRowDto {
    private Long bulletinId;
    private String codeBulletin;
    private String matricule;
    private String nomPrenom;
    private String direction;
    private String typeSession;
    private String statut;
    private BigDecimal salaireBrut;
    private BigDecimal totalRetenues;
    private BigDecimal salaireNet;
    private LocalDateTime dateCalcul;
    private LocalDateTime dateValidation;
    private String justificationEcart;
}
