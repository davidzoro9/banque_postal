package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "carriere_reclassement")
public class CarriereReclassement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private LocalDate dateDemande;
    private LocalDate dateEffet;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categorie_ancienne_id")
    private Categorie categorieAncienne;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categorie_nouvelle_id")
    private Categorie categorieNouvelle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_ancien_id")
    private Grade gradeAncien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_nouveau_id")
    private Grade gradeNouveau;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "echelon_ancien_id")
    private Echelon echelonAncien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "echelon_nouveau_id")
    private Echelon echelonNouveau;

    private Double salaireBaseAncien;
    private Double salaireBaseNouveau;

    private String referenceActe; // ex. "Décision N° 2026/012/DG/DRH"
    private String motif; // Diplôme, Concours, Titularisation, Promotion
    private String statut = "VALIDE"; // "PROPOSE", "VALIDE", "REJETE"

    private LocalDate dateValidation;
    private String validateur;

    @Column(columnDefinition = "TEXT")
    private String observations;
}
