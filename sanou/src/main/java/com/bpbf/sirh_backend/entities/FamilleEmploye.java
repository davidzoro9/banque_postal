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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public LocalDate getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }

    public LienParente getLienParente() { return lienParente; }
    public void setLienParente(LienParente lienParente) { this.lienParente = lienParente; }

    public Boolean getEstCharge() { return estCharge; }
    public void setEstCharge(Boolean estCharge) { this.estCharge = estCharge; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}

