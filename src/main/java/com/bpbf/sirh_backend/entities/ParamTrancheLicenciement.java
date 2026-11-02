package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "param_tranche_indemnite_licenciement")
public class ParamTrancheLicenciement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false)
    private String libelle;

    @Column(name = "annee_debut", nullable = false)
    private Integer anneeDebut;

    @Column(name = "annee_fin")
    private Integer anneeFin; // null signifie "au-delà"

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal taux; // en pourcentage, ex: 25.00, 30.00, 40.00

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Integer ordre = 1;

    @Builder.Default
    private Boolean actif = true;
}

