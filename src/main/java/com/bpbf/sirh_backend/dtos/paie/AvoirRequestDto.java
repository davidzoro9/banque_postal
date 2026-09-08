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
public class AvoirRequestDto {
    private Long employeeId;
    private Long salaryElementId;
    private BigDecimal amount;
    private BigDecimal montantRestant;
    private Integer echeance;
    private LocalDate dateEcheance;
    private String statut;

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getSalaryElementId() { return salaryElementId; }
    public void setSalaryElementId(Long salaryElementId) { this.salaryElementId = salaryElementId; }

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

