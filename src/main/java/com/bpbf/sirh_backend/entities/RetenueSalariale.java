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
@Table(name = "retenue_salariale")
public class RetenueSalariale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String libelle;
    private String typeRetenue; // PRET, ACOMPTE, SAISIE_ARRET, COTISATION, DIVERSE
    private Double montantTotal;
    private Double mensualite;
    private Double resteAPayer;
    private Double taux;
    private Boolean actif = true;
    private Long employeeId;
}
