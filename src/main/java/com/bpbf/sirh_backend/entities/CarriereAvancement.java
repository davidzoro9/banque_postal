package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "carriere_avancement")
public class CarriereAvancement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private Integer exercice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "echelon_actuel_id")
    private Echelon echelonActuel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "echelon_propose_id")
    private Echelon echelonPropose;

    private Double salaireBaseActuel;
    private Double salaireBasePropose;
    private Double ecartSalaire;

    private String typeAvancement = "ANCIENNETE"; // "ANCIENNETE", "CHOIX_MERITE"
    private String statut = "PROPOSE"; // "PROPOSE", "VALIDE", "REJETE"

    private LocalDate dateProposition;
    private LocalDate dateValidation;
    private String validateur;

    @Column(columnDefinition = "TEXT")
    private String observations;
}
