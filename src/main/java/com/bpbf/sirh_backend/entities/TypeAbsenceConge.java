package com.bpbf.sirh_backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "type_absence_conge")
public class TypeAbsenceConge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String name;
    private Boolean deductibleDuSolde;
    private Integer dureeMaxLegaleJours;

    public TypeAbsenceConge() {}

    public TypeAbsenceConge(Long id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.deductibleDuSolde = isDeductibleDuSolde();
        this.dureeMaxLegaleJours = getPlafondJoursNonDeductible();
    }

    public TypeAbsenceConge(Long id, String code, String name, Boolean deductibleDuSolde, Integer dureeMaxLegaleJours) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.deductibleDuSolde = deductibleDuSolde;
        this.dureeMaxLegaleJours = dureeMaxLegaleJours;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getDeductibleDuSolde() { return deductibleDuSolde; }
    public void setDeductibleDuSolde(Boolean deductibleDuSolde) { this.deductibleDuSolde = deductibleDuSolde; }

    public Integer getDureeMaxLegaleJours() { return dureeMaxLegaleJours; }
    public void setDureeMaxLegaleJours(Integer dureeMaxLegaleJours) { this.dureeMaxLegaleJours = dureeMaxLegaleJours; }

    /**
     * Détermine si cette absence/congé s'impute entièrement sur le solde annuel de congés payés.
     */
    public boolean isDeductibleDuSolde() {
        if (deductibleDuSolde != null) return deductibleDuSolde;
        if (code != null) {
            String c = code.toUpperCase();
            return c.contains("ANNUEL") || c.equals("CONGE_ANNUEL") || c.equals("PAYE");
        }
        if (name != null) {
            String n = name.toLowerCase();
            return n.contains("annuel") || n.contains("payé");
        }
        return false;
    }

    /**
     * Plafond légal ou conventionnel au Burkina Faso non déductible du solde de congé annuel.
     * Tout dépassement éventuel de ce quota s'impute sur les congés payés annuels.
     */
    public int getPlafondJoursNonDeductible() {
        if (code != null) {
            String c = code.toUpperCase();
            if (c.contains("MALADIE")) return Integer.MAX_VALUE; // Dépend de la prescription médicale (100% pris en charge)
            if (c.contains("MATERNITE")) return 98; // 14 semaines (3,5 mois) selon Art. 152 Code du travail BF
            if (c.contains("PATERNITE")) return 3;  // 3 jours ouvrables conventionnels
            if (c.contains("MARIAGE")) return 3;    // 3 jours ouvrables
            if (c.contains("DECES")) return 5;      // 5 jours ouvrables
            if (c.contains("NAISSANCE")) return 3;  // 3 jours ouvrables
            if (c.contains("ANNUEL")) return 0;     // 100% déductible du congé annuel
        }
        if (dureeMaxLegaleJours != null) return dureeMaxLegaleJours;
        return 0;
    }
}
