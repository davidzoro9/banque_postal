package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exoneration_employe", uniqueConstraints = @UniqueConstraint(columnNames = "indemnite_employe_id"))
public class ExonerationEmploye {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "type_indemnite_id", nullable = false)
    private TypeIndemnite typeIndemnite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "indemnite_employe_id", unique = true)
    private IndemniteEmploye indemniteEmploye;

    private String libelle;
    private Double montant;
    private Double tauxExonere;
    private Double plafondExonere;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public TypeIndemnite getTypeIndemnite() { return typeIndemnite; }
    public void setTypeIndemnite(TypeIndemnite typeIndemnite) { this.typeIndemnite = typeIndemnite; }

    public IndemniteEmploye getIndemniteEmploye() { return indemniteEmploye; }
    public void setIndemniteEmploye(IndemniteEmploye indemniteEmploye) { this.indemniteEmploye = indemniteEmploye; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public Double getTauxExonere() { return tauxExonere; }
    public void setTauxExonere(Double tauxExonere) { this.tauxExonere = tauxExonere; }

    public Double getPlafondExonere() { return plafondExonere; }
    public void setPlafondExonere(Double plafondExonere) { this.plafondExonere = plafondExonere; }
}

