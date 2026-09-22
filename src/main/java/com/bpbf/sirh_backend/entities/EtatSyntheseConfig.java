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
@Table(name = "etat_synthese_config")
public class EtatSyntheseConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String code;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(length = 80)
    private String categorie;

    @Column(length = 500)
    private String description;

    @Column(length = 50)
    private String icon;

    private Integer ordre;

    private boolean actif = true;

    private boolean isSystem = false;

    @Column(length = 50)
    private String filtreType; // ALL, INDEMNITE, RETENUE, BANQUE, DIRECTION, CATEGORIE

    @Column(length = 80)
    private String typeElementCode;

    @Column(columnDefinition = "TEXT")
    private String colonnesJson;
}
