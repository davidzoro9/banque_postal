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
@Table(name = "evaluation_entretien")
public class EvaluationEntretien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private String date;
    private String evaluateur;
    private Integer note;

    @Column(columnDefinition = "TEXT")
    private String objectifs;

    @Column(columnDefinition = "TEXT")
    private String commentaires;
}
