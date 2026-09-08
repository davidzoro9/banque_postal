package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "avoir")
public class Avoir {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salary_element_id")
    private SalaryElement salaryElement;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(precision = 15, scale = 2)
    private BigDecimal montantRestant;

    private Integer echeance; // Nombre d'échéances ou mois

    private LocalDate dateEcheance;

    @Builder.Default
    private String statut = "ACTIF"; // ACTIF, SOLDE, SUSPENDU

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public SalaryElement getSalaryElement() { return salaryElement; }
    public void setSalaryElement(SalaryElement salaryElement) { this.salaryElement = salaryElement; }

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

