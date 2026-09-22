package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "param_retraite")
public class ParametrageRetraite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_id")
    private Grade gradeObj;

    @JsonProperty("grade")
    public String getGrade() {
        if (gradeObj != null) return gradeObj.getLibelle() != null ? gradeObj.getLibelle() : gradeObj.getCode();
        return null;
    }

    private String libelle;
    private Double taux;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Boolean actif = true;
}
