package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "information_salariale", uniqueConstraints = @UniqueConstraint(columnNames = "employee_id"))
public class InformationSalariale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private String modePaiement;
    private String banque;
    private String iban;
    private String intituleCompte;
    @Column(precision = 19, scale = 2)
    private BigDecimal salaireBase;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalIndemnites;

    @Column(precision = 19, scale = 2)
    private BigDecimal remunerationBrute;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalExonerations;

    @Column(precision = 19, scale = 2)
    private BigDecimal baseImposable;

    @Column(precision = 19, scale = 2)
    private BigDecimal abattementForfaitaire;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalRetenuesAgent;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalRetenuesEmployeur;

    private Integer nombrePersonnesCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal iutsSansCharge;

    @Column(precision = 5, scale = 2)
    private BigDecimal tauxReductionCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal reductionIutsCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal iutsAvecCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalDeduitEmploye;

    @Column(precision = 19, scale = 2)
    private BigDecimal salaireNet;
}
