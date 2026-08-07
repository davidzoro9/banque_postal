package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
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
@Table(name = "conge")
public class Conge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_absence_conge_id")
    private TypeAbsenceConge typeAbsenceConge;

    @Transient private String employeStr;
    @Transient private String typeStr;

    @JsonProperty("employe")
    public String getEmploye() {
        if (employee != null) return employee.getName() != null ? employee.getName() : (employee.getPrenom() + " " + employee.getNom());
        return employeStr;
    }

    @JsonProperty("employe")
    public void setEmploye(String val) { this.employeStr = val; }

    @JsonProperty("type")
    public String getType() {
        if (typeAbsenceConge != null) return typeAbsenceConge.getName() != null ? typeAbsenceConge.getName() : typeAbsenceConge.getCode();
        return typeStr;
    }

    @JsonProperty("type")
    public void setType(String val) { this.typeStr = val; }

    private String dateDebut;
    private String dateFin;
    private Integer nbJours;
    private String statut;
}
