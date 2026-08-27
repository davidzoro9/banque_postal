package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "precompte_employe")
public class PrecompteEmploye {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rubrique_paie_id")
    private RubriquePaie rubriquePaie;

    @Column(nullable = false, length = 100)
    private String libelle;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal montantInitial;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal montantMensuel;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal montantRestant;

    private Integer echeancesTotal;

    private Integer echeancesRestantes;

    private LocalDate dateDebut;

    private LocalDate dateFinPrevue;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String statut = "ACTIF"; // ACTIF, SOLDE, SUSPENDU

    private String motif;

    private LocalDateTime dateCreation;

    @PrePersist
    public void onCreate() {
        if (this.dateCreation == null) {
            this.dateCreation = LocalDateTime.now();
        }
        if (this.statut == null) {
            this.statut = "ACTIF";
        }
        if (this.montantRestant == null) {
            this.montantRestant = this.montantInitial;
        }
        if (this.echeancesRestantes == null) {
            this.echeancesRestantes = this.echeancesTotal;
        }
    }
}
