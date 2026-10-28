package com.bpbf.sirh_backend.dtos.etatsynthese;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
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

    public EtatTypeEmployeRowDto() {}

    public EtatTypeEmployeRowDto(String typeEmploye, Integer effectif, BigDecimal totalSalaireBase, BigDecimal totalIndemnites, BigDecimal totalBrut, BigDecimal totalCotisationsPatronales, BigDecimal totalRetenues, BigDecimal totalNet, BigDecimal salaireMoyenNet) {
        this.typeEmploye = typeEmploye;
        this.effectif = effectif;
        this.totalSalaireBase = totalSalaireBase;
        this.totalIndemnites = totalIndemnites;
        this.totalBrut = totalBrut;
        this.totalCotisationsPatronales = totalCotisationsPatronales;
        this.totalRetenues = totalRetenues;
        this.totalNet = totalNet;
        this.salaireMoyenNet = salaireMoyenNet;
    }
}
