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
@Table(name = "retenue_salariale")
public class RetenueSalariale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String libelle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_retenue_employe_id")
    private TypeRetenueEmploye typeRetenueEmploye;

    @Transient private String typeRetenueStr;

    @JsonProperty("typeRetenue")
    public String getTypeRetenue() {
        if (typeRetenueEmploye != null) return typeRetenueEmploye.getLibelle();
        return typeRetenueStr;
    }

    @JsonProperty("typeRetenue")
    public void setTypeRetenue(String val) { this.typeRetenueStr = val; }

    private Double montantTotal;
    private Double mensualite;
    private Double resteAPayer;
    private Double taux;
    private Boolean actif = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @JsonProperty("employeeId")
    public Long getEmployeeId() {
        return employee != null ? employee.getId() : null;
    }

    @JsonProperty("employeeId")
    public void setEmployeeId(Long empId) {
        if (empId != null) {
            Employee e = new Employee();
            e.setId(empId);
            this.employee = e;
        }
    }
}
