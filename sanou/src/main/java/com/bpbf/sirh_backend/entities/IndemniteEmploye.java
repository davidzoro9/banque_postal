package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "indemnite_employe", uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "parametrage_indemnite_id"}))
public class IndemniteEmploye {
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
    @JoinColumn(name = "parametrage_indemnite_id")
    private ParametrageIndemnite parametrageIndemnite;

    private String libelle;
    private Double montant;
    private Boolean actif;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public TypeIndemnite getTypeIndemnite() { return typeIndemnite; }
    public void setTypeIndemnite(TypeIndemnite typeIndemnite) { this.typeIndemnite = typeIndemnite; }

    public ParametrageIndemnite getParametrageIndemnite() { return parametrageIndemnite; }
    public void setParametrageIndemnite(ParametrageIndemnite parametrageIndemnite) { this.parametrageIndemnite = parametrageIndemnite; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}

