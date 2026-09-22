package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatTypeEmployeRowDto {
    private String typeEmploye; // ex: Cadre, Agent de Maîtrise, Employé, CDI, CDD, Stagiaire
    private Integer effectif;
    private BigDecimal totalSalaireBase;
    private BigDecimal totalIndemnites;
    private BigDecimal totalBrut;
    private BigDecimal totalCotisationsPatronales;
    private BigDecimal totalRetenues;
    private BigDecimal totalNet;
    private BigDecimal salaireMoyenNet;
}
