package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bulletin", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"session_paie_id", "employee_id"})
})
public class Bulletin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_paie_id", nullable = false)
    private SessionPaie sessionPaie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_id")
    private Grade grade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contrat_id")
    private Contrat contrat;

    @Column(length = 50)
    private String typeSession;

    private LocalDate dateFrom;

    private LocalDate dateTo;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal scheduledWorkingDays = new BigDecimal("30.00");

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal workedDays = new BigDecimal("30.00");

    @Column(precision = 19, scale = 2)
    private BigDecimal salaireBase;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalIndemnites;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalAvoirs;

    @Column(precision = 19, scale = 2)
    private BigDecimal salaireBrut;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalExonerations;

    @Column(precision = 19, scale = 2)
    private BigDecimal abattementForfaitaire;

    @Column(precision = 19, scale = 2)
    private BigDecimal baseImposable;

    @Column(precision = 19, scale = 2)
    private BigDecimal cotisationCnss;

    @Column(precision = 19, scale = 2)
    private BigDecimal impotIutsSansCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal reductionIutsCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal impotIuts;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalRetenuesSociales;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalPrecomptes;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalRetenues;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalCotisationsPatronales;

    @Column(precision = 19, scale = 2)
    private BigDecimal salaireNet;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String statut = "GENERE"; // GENERE, VALIDE, PAYE, ANNULE

    private LocalDateTime dateCalcul;

    private LocalDateTime dateValidation;

    @OneToMany(mappedBy = "bulletin", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    @OrderBy("ordre ASC, id ASC")
    private List<BulletinLine> lines = new ArrayList<>();

    public void addLine(BulletinLine line) {
        lines.add(line);
        line.setBulletin(this);
    }

    public void removeLine(BulletinLine line) {
        lines.remove(line);
        line.setBulletin(null);
    }

    @PrePersist
    public void onCreate() {
        if (this.dateCalcul == null) {
            this.dateCalcul = LocalDateTime.now();
        }
        if (this.statut == null) {
            this.statut = "GENERE";
        }
    }
}
