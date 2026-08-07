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

    @Transient private String typeIndemniteStr;
    @Transient private String fonctionStr;
    @Transient private String gradeStr;
    @Transient private String categorieStr;

    @JsonProperty("typeIndemnite")
    public String getTypeIndemnite() {
        if (typeIndemniteObj != null) return typeIndemniteObj.getName();
        return typeIndemniteStr;
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
