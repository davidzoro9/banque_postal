package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "type_retenue_emploi")
public class TypeRetenueEmploi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;
    private String libelle;
    private String typeRetenue;
    private Double taux;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Boolean actif = true;
}
