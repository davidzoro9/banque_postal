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

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "prise_en_charge_famille")
public class PriseEnChargeFamille {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private String nomMembre;
    private String prenomMembre;
    private String lienParente; // CONJOINT, ENFANT, AYANT_DROIT
    private LocalDate dateNaissance;
    private Double tauxPriseEnCharge; // ex: 80.0 pour 80%
    private Double plafondAnnuel;
    private String statutMatrimonial;
    private Boolean actif = true;
}
