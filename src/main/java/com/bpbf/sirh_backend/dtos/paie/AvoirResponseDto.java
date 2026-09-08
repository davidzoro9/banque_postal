package com.bpbf.sirh_backend.dtos.paie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvoirResponseDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String matricule;
    private Long salaryElementId;
    private String salaryElementName;
    private String salaryElementCode;
    private BigDecimal amount;
    private BigDecimal montantRestant;
    private Integer echeance;
    private LocalDate dateEcheance;
    private String statut;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public Long getSalaryElementId() { return salaryElementId; }
    public void setSalaryElementId(Long salaryElementId) { this.salaryElementId = salaryElementId; }

    public String getSalaryElementName() { return salaryElementName; }
    public void setSalaryElementName(String salaryElementName) { this.salaryElementName = salaryElementName; }

    public String getSalaryElementCode() { return salaryElementCode; }
    public void setSalaryElementCode(String salaryElementCode) { this.salaryElementCode = salaryElementCode; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getMontantRestant() { return montantRestant; }
    public void setMontantRestant(BigDecimal montantRestant) { this.montantRestant = montantRestant; }

    public Integer getEcheance() { return echeance; }
    public void setEcheance(Integer echeance) { this.echeance = echeance; }

    public LocalDate getDateEcheance() { return dateEcheance; }
    public void setDateEcheance(LocalDate dateEcheance) { this.dateEcheance = dateEcheance; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}

