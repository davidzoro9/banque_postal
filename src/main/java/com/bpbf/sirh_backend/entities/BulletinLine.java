package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bulletin_line")
public class BulletinLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bulletin_id", nullable = false)
    @JsonBackReference
    private Bulletin bulletin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rubrique_paie_id")
    private RubriquePaie rubriquePaie;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(nullable = false, length = 50)
    private String typeLigne; // GAIN, RETENUE_SOCIALE, IMPOT, PRECOMPTE, COTISATION_PATRONALE

    @Column(precision = 19, scale = 2)
    private BigDecimal baseCalcul;

    @Column(precision = 8, scale = 4)
    private BigDecimal taux;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal montant;

    @Column(precision = 19, scale = 2)
    private BigDecimal partPatronale;

    private Integer ordre;
}
