package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "grille_salariale")
public class GrilleSalariale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categorie_id")
    private Categorie categorieObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "echelon_id")
    private Echelon echelonObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_id")
    private Grade gradeObj;

    @JsonProperty("category")
    public String getCategory() {
        if (categorieObj != null) {
            String raw = categorieObj.getCode() != null ? categorieObj.getCode() : categorieObj.getLibelle();
            return formatCategoryCode(raw);
        }
        return "";
    }

    @JsonProperty("echellon")
    public String getEchellon() {
        if (echelonObj != null) {
            String raw = echelonObj.getCode() != null ? echelonObj.getCode() : echelonObj.getLibelle();
            return formatEchelonCode(raw);
        }
        return "";
    }

    @JsonProperty("classe")
    public String getClasse() {
        if (gradeObj != null) {
            return gradeObj.getLibelle() != null ? gradeObj.getLibelle() : gradeObj.getCode();
        }
        return "";
    }

    @JsonProperty("grade")
    public String getGrade() {
        String cat = getCategory();
        String ech = getEchellon();
        if (cat != null && !cat.isEmpty() && ech != null && !ech.isEmpty()) {
            return cat + ech;
        }
        if (gradeObj != null) {
            return gradeObj.getCode() != null ? gradeObj.getCode() : gradeObj.getLibelle();
        }
        return "";
    }

    public static String formatCategoryCode(String rawCat) {
        if (rawCat == null || rawCat.trim().isEmpty()) return "";
        String s = rawCat.trim().toUpperCase();
        if (s.startsWith("C") || s.startsWith("CL")) return s;
        if (s.matches("^[1-7]$")) {
            return "C" + s;
        }
        switch (s) {
            case "I": return "CL1";
            case "II": return "CL2";
            case "III": return "CL3";
            case "IV": return "CL4";
            case "V": return "CL5";
            case "VI": return "CL6";
            case "VII": return "CL7";
            case "VIII": return "CL8";
            default: return s;
        }
    }

    public static String formatEchelonCode(String rawEch) {
        if (rawEch == null || rawEch.trim().isEmpty()) return "";
        String s = rawEch.trim().toUpperCase();
        if (s.startsWith("E")) {
            try {
                int n = Integer.parseInt(s.substring(1));
                return String.format("E%02d", n);
            } catch (Exception ignored) {
                return s;
            }
        }
        try {
            int n = Integer.parseInt(s.replaceAll("\\D+", ""));
            return String.format("E%02d", n);
        } catch (Exception ignored) {
            return s;
        }
    }

    @Column(precision = 10, scale = 2, name = "salaire_base")
    private BigDecimal basicSalary;

    @JsonProperty("salaireBase")
    public Double getSalaireBase() {
        return basicSalary != null ? basicSalary.doubleValue() : null;
    }

    @JsonProperty("salaireBase")
    public void setSalaireBase(Double val) {
        this.basicSalary = val != null ? BigDecimal.valueOf(val) : null;
    }

    public String getCode() {
        return getGrade();
    }
}
