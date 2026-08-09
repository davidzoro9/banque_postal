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
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String matricule;
    private String email;
    private String phone;
    
    // Front-end fields mapped directly for indexing / reference
    private String nom;
    private String prenom;
    private String telephone;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "fonction_id", nullable = true)
    private Fonction fonction;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "emploi_id", nullable = true)
    private Emploi emploi;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "department_id", nullable = true)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "direction_id", nullable = true)
    private Direction direction;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "service_id", nullable = true)
    private Service service;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "superviseur_id", nullable = true)
    private Employee superviseur;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "grille_salariale_id", nullable = true)
    private GrilleSalariale grilleSalariale;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "categorie_id", nullable = true)
    private Categorie categorieObj;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "echelon_id", nullable = true)
    private Echelon echelonObj;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "grade_id", nullable = true)
    private Grade gradeObj;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus state;

    @Column(columnDefinition = "TEXT")
    private String extraData;
}
