package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "famille_employe_membre")
public class FamilleEmploye {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private LocalDate dateNaissance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LienParente lienParente;

    @Column(nullable = false)
    private Boolean estCharge = false;

    private String statut;
}
