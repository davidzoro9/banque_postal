package com.bpbf.sirh_backend.entities;

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
    private String grade;
    private String libelle;
    private String categorie;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Boolean actif = true;
}
