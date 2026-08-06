package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "categorie")
public class Categorie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;
    private String libelle;
    private Double tauxAbattement;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Boolean actif = true;
}
