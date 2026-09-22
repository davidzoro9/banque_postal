package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "prise_en_charge_famille")
public class PriseEnChargeFamille {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    private String nomMembre;
    private String prenomMembre;
    private String lienParente; // CONJOINT, ENFANT, AYANT_DROIT
    private LocalDate dateNaissance;
    private Double tauxPriseEnCharge; // ex: 80.0 pour 80%
    private Double plafondAnnuel;
    private String statutMatrimonial;
    private Boolean actif = true;
}
