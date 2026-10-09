package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationRequestDto {
    /**
     * "NET_VERS_SURSALAIRE" ou "SURSALAIRE_VERS_NET"
     */
    private String mode;

    // Classification
    private Long gradeId;
    private String gradeCode;
    private Long categorieId;
    private String categorieCode;
    private Long echelonId;
    private String echelonCode;
    private Double salaireBaseManuel;

    // Montants cibles selon le mode
    private Double surSalairePropose;
    private Double netCibleSouhaite;

    // Charges familiales
    private Integer nombrePersonnesCharge;

    // Indemnités optionnelles
    private Double indemniteLogement;
    private Double indemniteTransport;
    private Double indemniteFonction;
    private Double indemniteCaisse;
    private Double indemniteSujetion;
    private Double indemniteCashPoint;
    private Double autresIndemnites;

    // Poste (Emploi) & Fonction à assurer
    private Long emploiId;
    private String emploiNom;
    private Long fonctionId;
    private String fonctionNom;
    private Boolean vehiculeFourni;
    private Boolean logementFourni;

    // Prise en compte des charges patronales
    private Boolean inclureChargesPatronales;
}
