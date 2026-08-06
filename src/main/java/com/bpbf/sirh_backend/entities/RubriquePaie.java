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
@Table(name = "rubrique_paie")
public class RubriquePaie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codeRubrique;
    private String libelle;
    private String typeRubrique; // GAIN, RETENUE, COTISATION
    private Boolean imposable = true;
    private Boolean cotisable = true;
    private String formuleCalcul;
    private Boolean actif = true;
}
