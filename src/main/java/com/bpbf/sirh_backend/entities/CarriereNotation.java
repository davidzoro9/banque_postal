package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "carriere_notation")
public class CarriereNotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private Integer exercice;

    private Double noteObjectifs;
    private Double noteCompetences;
    private Double noteComportement;
    private Double noteGlobale;

    @Column(columnDefinition = "TEXT")
    private String appreciation;

    private String evaluateur;
    private LocalDate dateEvaluation;
    private String statut = "VALIDE";
}
