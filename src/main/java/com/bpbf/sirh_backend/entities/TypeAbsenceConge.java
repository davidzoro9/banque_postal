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
    private String categorie;
    private String sexeRequis;
    private Boolean remunere = true;
    private Double tauxRemuneration = 100.0;
    private Boolean justificatifRequis = false;
    private String typeJustificatif;
    private Boolean actif = true;
    private Integer delaiJustificationJours = 3;
    private String description;

    public TypeAbsenceConge() {}

    public TypeAbsenceConge(Long id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.deductibleDuSolde = isDeductibleDuSolde();
        this.dureeMaxLegaleJours = getPlafondJoursNonDeductible();
        this.categorie = getCategorie();
        this.sexeRequis = getSexeRequis();
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
            if (c.contains("ACCIDENT") || c.contains("MALADIE") || c.contains("FORCE_MAJEURE")) return false;
            return c.contains("ANNUEL") || c.equals("CONGE_ANNUEL") || c.equals("PAYE");
        }
        if (name != null) {
            String n = name.toLowerCase();
            if (n.contains("accident") || n.contains("maladie")) return false;
            return n.contains("annuel") || n.contains("payé");
        }
        return false;
    }

    public String getCategorie() {
        if (categorie != null) return categorie;
        if (code != null) {
            String c = code.toUpperCase();
            if (c.startsWith("CONGE") || c.contains("ANNUEL") || c.contains("MATERNITE") || c.contains("PATERNITE") || c.contains("MALADIE")) {
                return "CONGE";
            }
        }
        return "ABSENCE";
    }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public String getSexeRequis() {
        if (sexeRequis != null) return sexeRequis;
        if (code != null) {
            String c = code.toUpperCase();
            if (c.contains("MATERNITE")) return "FEMININ";
            if (c.contains("PATERNITE")) return "MASCULIN";
        }
        return "TOUS";
    }
    public void setSexeRequis(String sexeRequis) { this.sexeRequis = sexeRequis; }

    /**
     * Plafond légal ou conventionnel au Burkina Faso non déductible du solde de congé annuel.
     * Tout dépassement éventuel de ce quota s'impute sur les congés payés annuels.
     */
    public int getPlafondJoursNonDeductible() {
        if (code != null) {
            String c = code.toUpperCase();
            if (c.contains("ACCIDENT")) return Integer.MAX_VALUE; // Accident du travail ou de trajet (100% pris en charge CNSS/maintien)
            if (c.contains("MALADIE")) return Integer.MAX_VALUE; // Dépend de la prescription médicale (100% pris en charge)
            if (c.contains("FORCE_MAJEURE")) return 5;           // Cas de force majeure / Urgence familiale
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

    public Boolean getRemunere() { return remunere != null ? remunere : true; }
    public void setRemunere(Boolean remunere) { this.remunere = remunere; }

    public Double getTauxRemuneration() { return tauxRemuneration != null ? tauxRemuneration : 100.0; }
    public void setTauxRemuneration(Double tauxRemuneration) { this.tauxRemuneration = tauxRemuneration; }

    public Boolean getJustificatifRequis() { return justificatifRequis != null ? justificatifRequis : false; }
    public void setJustificatifRequis(Boolean justificatifRequis) { this.justificatifRequis = justificatifRequis; }

    public String getTypeJustificatif() { return typeJustificatif; }
    public void setTypeJustificatif(String typeJustificatif) { this.typeJustificatif = typeJustificatif; }

    public Boolean getActif() { return actif != null ? actif : true; }
    public void setActif(Boolean actif) { this.actif = actif; }

    public Integer getDelaiJustificationJours() { return delaiJustificationJours != null ? delaiJustificationJours : 3; }
    public void setDelaiJustificationJours(Integer delaiJustificationJours) { this.delaiJustificationJours = delaiJustificationJours; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
