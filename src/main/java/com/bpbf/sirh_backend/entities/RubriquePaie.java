package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rubrique_paie")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RubriquePaie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String codeRubrique;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(length = 50)
    private String typeRubrique; // GAIN, RETENUE, PATRONALE, NET, REGULARISATION, AUTRE

    @Column(length = 20)
    private String sensSuggere; // DEBIT, CREDIT

    @Column(length = 50)
    private String classeSuggeree; // CLASSE_6, CLASSE_4

    @Column(length = 30)
    private String numeroCompteDefaut; // ex: 641100, 421100

    @Column(length = 255)
    private String description;

    @Builder.Default
    private Integer ordre = 0;

    @Builder.Default
    private Boolean imposable = true;

    @Builder.Default
    private Boolean cotisable = true;

    @Column(length = 255)
    private String formuleCalcul;

    @Builder.Default
    private Boolean actif = true;
}
