package com.bpbf.sirh_backend.entities;

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
@Table(name = "generic_ref_data")
public class GenericRefData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String code;
    private String libelle;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String grade;
    private String categorie;
    private Double taux;
    private String typeRetenue;
    
    private boolean actif;
}
