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
public class ParametrageIndemnite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_indemnite_id")
    private TypeIndemnite typeIndemniteObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fonction_id")
    private Fonction fonctionObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_id")
    private Grade gradeObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categorie_id")
    private Categorie categorieObj;

    @Column(name = "type_indemnite")
    private String typeIndemniteStr;

    @Column(name = "fonction_str")
    private String fonctionStr;

    @Column(name = "grade_str")
    private String gradeStr;

    @Column(name = "categorie_str")
    private String categorieStr;

    @JsonProperty("typeIndemnite")
    public String getTypeIndemnite() {
        if (typeIndemniteStr != null && !typeIndemniteStr.trim().isEmpty()) {
            return typeIndemniteStr;
        }
        if (typeIndemniteObj != null && typeIndemniteObj.getName() != null && !typeIndemniteObj.getName().trim().isEmpty()) {
            return typeIndemniteObj.getName();
        }
        if (code != null && !code.trim().isEmpty()) {
            String uCode = code.toUpperCase();
            if (uCode.contains("FCT")) return "Indemnité de fonction";
            if (uCode.contains("TRP")) return "Indemnité de Transport";
            if (uCode.contains("LOG")) return "Indemnité de Logement";
            if (uCode.contains("CMP")) return "Indemnité compensatrice";
            if (uCode.contains("AST")) return "Prime d'astreinte";
            if (uCode.contains("GCP-CP")) return "Indemnité Cash Point";
            if (uCode.contains("CP-CS") || uCode.contains("GCP-CS") || uCode.contains("CA-CS")) return "Indemnité de caisse";
            if (uCode.contains("SUJ")) return "Indemnité de Sujétion";
            if (uCode.contains("RIS")) return "Indemnité de Risque Bancaire";
            return code;
        }
        return "Indemnité";
    }

    @JsonProperty("typeIndemnite")
    public void setTypeIndemnite(String val) { this.typeIndemniteStr = val; }

    @JsonProperty("fonction")
    public String getFonction() {
        if (fonctionObj != null) return fonctionObj.getName();
        return fonctionStr;
    }

    @JsonProperty("fonction")
    public void setFonction(String val) { this.fonctionStr = val; }

    @JsonProperty("grade")
    public String getGrade() {
        if (gradeObj != null) return gradeObj.getLibelle();
        return gradeStr;
    }

    @JsonProperty("grade")
    public void setGrade(String val) { this.gradeStr = val; }

    @JsonProperty("categorie")
    public String getCategorie() {
        if (categorieObj != null) return categorieObj.getLibelle();
        return categorieStr;
    }

    @JsonProperty("categorie")
    public void setCategorie(String val) { this.categorieStr = val; }

    private Double taux;
    private Double tauxExoneration;
    private Double plafondExoneration;
    /** "ORDINAIRE", "NOMINATION", ou "SPECIFIQUE" */
    private String regleType = "ORDINAIRE";
    /** "NOMMEE", "NON_NOMMEE", ou "TOUTES" */
    private String typeNomination = "TOUTES";
    private Boolean actif = true;
}
