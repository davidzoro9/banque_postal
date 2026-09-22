package com.bpbf.sirh_backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exoneration_fiscale")
public class ExonerationFiscale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String libelle;
    private String typeExoneration; // IUTS, CNSS, CHARGE_FAMILLE, ABATTEMENT_FORFAITAIRE
    private Double tauxExoneration;
    private Double montantPlafond;
    private String baseCalcul;
    private Integer nbChargesFamille;
    private Boolean actif = true;
}
