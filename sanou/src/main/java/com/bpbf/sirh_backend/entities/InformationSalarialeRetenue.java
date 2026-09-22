package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "information_salariale_retenue",
        uniqueConstraints = @UniqueConstraint(columnNames = {"information_salariale_id", "retenue_id"}))
public class InformationSalarialeRetenue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "information_salariale_id", nullable = false)
    private InformationSalariale informationSalariale;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "retenue_id", nullable = false)
    private Retenue retenue;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String libelle;

    @Column(name = "type_retenue_code", nullable = false)
    private String typeRetenueCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "base_calcul", nullable = false)
    private BaseCalculRetenue baseCalcul;

    @Column(name = "montant_base", precision = 19, scale = 2, nullable = false)
    private BigDecimal montantBase;

    @Column(precision = 7, scale = 2, nullable = false)
    private BigDecimal taux;

    @Column(name = "montant_calcule", precision = 19, scale = 2, nullable = false)
    private BigDecimal montantCalcule;
}
