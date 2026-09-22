package com.bpbf.sirh_backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "rubrique_paie")
public class RubriquePaie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codeRubrique;
    private String libelle;
    private String typeRubrique; // GAIN, RETENUE, COTISATION
    private Boolean imposable = true;
    private Boolean cotisable = true;
    private String formuleCalcul;
    private Boolean actif = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodeRubrique() { return codeRubrique; }
    public void setCodeRubrique(String codeRubrique) { this.codeRubrique = codeRubrique; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getTypeRubrique() { return typeRubrique; }
    public void setTypeRubrique(String typeRubrique) { this.typeRubrique = typeRubrique; }

    public Boolean getImposable() { return imposable; }
    public void setImposable(Boolean imposable) { this.imposable = imposable; }

    public Boolean getCotisable() { return cotisable; }
    public void setCotisable(Boolean cotisable) { this.cotisable = cotisable; }

    public String getFormuleCalcul() { return formuleCalcul; }
    public void setFormuleCalcul(String formuleCalcul) { this.formuleCalcul = formuleCalcul; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}

