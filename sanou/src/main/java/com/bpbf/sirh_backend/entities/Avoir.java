package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "avoir")
public class Avoir {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salary_element_id")
    private SalaryElement salaryElement;

    @Column(length = 50)
    private String reference;

    @Column(length = 255)
    private String motif;

    @Column(name = "motif_annulation", length = 255)
    private String motifAnnulation;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(precision = 15, scale = 2)
    private BigDecimal montantRestant;

    private Integer echeance; // Nombre d'échéances ou mois

    private LocalDate dateEcheance;

    @Builder.Default
    private String statut = "ACTIF"; // ACTIF, SOLDE, SUSPENDU
}
