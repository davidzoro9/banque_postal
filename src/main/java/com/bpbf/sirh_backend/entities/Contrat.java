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
@Table(name = "contrat")
public class Contrat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_contrat_id")
    private TypeContrat typeContratObj;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private Service serviceObj;

    @Transient private String employeStr;
    @Transient private String typeStr;
    @Transient private String serviceStr;

    @JsonProperty("employe")
    public String getEmploye() {
        if (employee != null) return employee.getName() != null ? employee.getName() : (employee.getPrenom() + " " + employee.getNom());
        return employeStr;
    }

    @JsonProperty("employe")
    public void setEmploye(String val) { this.employeStr = val; }

    @JsonProperty("type")
    public String getType() {
        if (typeContratObj != null) return typeContratObj.getName() != null ? typeContratObj.getName() : typeContratObj.getCode();
        return typeStr;
    }

    @JsonProperty("type")
    public void setType(String val) { this.typeStr = val; }

    @JsonProperty("service")
    public String getService() {
        if (serviceObj != null) return serviceObj.getName() != null ? serviceObj.getName() : serviceObj.getCode();
        return serviceStr;
    }

    @JsonProperty("service")
    public void setService(String val) { this.serviceStr = val; }

    private String dateDebut;
    private String dateFin;
    private String statut;
}
