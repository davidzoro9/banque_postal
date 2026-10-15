package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "param_classe_comptable")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClasseComptable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(length = 20)
    private String numero; // ex: 6, 4, 1, 5, 7, 2

    @Column(length = 150)
    private String nom; // ex: Charges de personnel, Comptes de tiers / Dettes

    @Column(nullable = false, length = 150)
    private String libelle; // ex: Classe 6 — Charges de personnel

    @Column(length = 255)
    private String description;

    @Builder.Default
    private Integer ordre = 0;

    @Builder.Default
    private Boolean actif = true;
}
