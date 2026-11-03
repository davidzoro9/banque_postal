package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "param_preavis")
public class ParamPreavis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(name = "type_personnel", nullable = false, length = 50)
    private String typePersonnel; // CADRE, MAITRISE, NON_CADRE

    @Column(name = "duree_mois", nullable = false)
    @Builder.Default
    private Integer dureeMois = 1;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private Integer ordre = 1;

    @Builder.Default
    private Boolean actif = true;
}

