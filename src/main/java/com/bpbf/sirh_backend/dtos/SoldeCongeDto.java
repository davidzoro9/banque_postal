package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SoldeCongeDto {
    private Long employeeId;
    private String matricule;
    private String nomComplet;
    private String departement;
    private String poste;
    private Integer droitAnnuel; // Standard 30 jours au Burkina Faso
    private Double joursAcquis;  // Calculé au prorata : ex 2.5 jours / mois
    private Integer joursPris;   // Congés approuvés sur l'année
    private Integer joursEnAttente; // Congés soumis en attente de validation
    private Double soldeRestant; // Jours acquis - jours pris
    private String dateDernierConge;
}
