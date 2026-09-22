package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "param_groupe")
public class ParametrageGroupe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_id")
    private Grade gradeObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categorie_id")
    private Categorie categorieObj;

    @JsonProperty("grade")
    public String getGrade() {
        if (gradeObj != null) return gradeObj.getLibelle() != null ? gradeObj.getLibelle() : gradeObj.getCode();
        return null;
    }

    @JsonProperty("categorie")
    public String getCategorie() {
        if (categorieObj != null) return categorieObj.getLibelle() != null ? categorieObj.getLibelle() : categorieObj.getCode();
        return null;
    }

    private String libelle;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Boolean actif = true;
}
