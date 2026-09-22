package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "parametrage_conge")
public class ParametrageConge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer droitAnnuelDefaut = 30; // 30 jours par an (Burkina Faso)

    @Column(nullable = false)
    private Double joursAcquisParMois = 2.5; // 2.5 j/mois

    @Column(nullable = false)
    private String modeDecompte = "OUVRABLE_5J"; // OUVRABLE_5J (hors sam/dim), OUVRABLE_6J (hors dim), CALENDAIRE (tous les jours)

    @Column(nullable = false)
    private Boolean deduireJoursFeries = true; // Déduire automatiquement les fêtes légales

    @Column(nullable = false)
    private Integer plafondReportJours = 15;

    @Column(nullable = false)
    private Boolean bloquerSiSoldeInsuffisant = false;
}
