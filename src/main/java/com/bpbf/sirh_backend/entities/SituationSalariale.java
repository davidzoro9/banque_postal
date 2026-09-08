package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "situation_salariale", uniqueConstraints = @UniqueConstraint(columnNames = "employee_id"))
public class SituationSalariale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grille_salariale_id")
    private GrilleSalariale grilleSalariale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "echelon_id")
    private Echelon echelon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_id")
    private Grade grade;

    private Double salaireBase;
    private Double totalIndemnites;
    private Double salaireBrut;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public GrilleSalariale getGrilleSalariale() { return grilleSalariale; }
    public void setGrilleSalariale(GrilleSalariale grilleSalariale) { this.grilleSalariale = grilleSalariale; }

    public Categorie getCategorie() { return categorie; }
    public void setCategorie(Categorie categorie) { this.categorie = categorie; }

    public Echelon getEchelon() { return echelon; }
    public void setEchelon(Echelon echelon) { this.echelon = echelon; }

    public Grade getGrade() { return grade; }
    public void setGrade(Grade grade) { this.grade = grade; }

    public Double getSalaireBase() { return salaireBase; }
    public void setSalaireBase(Double salaireBase) { this.salaireBase = salaireBase; }

    public Double getTotalIndemnites() { return totalIndemnites; }
    public void setTotalIndemnites(Double totalIndemnites) { this.totalIndemnites = totalIndemnites; }

    public Double getSalaireBrut() { return salaireBrut; }
    public void setSalaireBrut(Double salaireBrut) { this.salaireBrut = salaireBrut; }
}

