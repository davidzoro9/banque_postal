package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "retenue")
public class Retenue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;
    private String libelle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_retenue_id")
    private TypeRetenue typeRetenue;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "regime_securite_social_id")
    private RegimeSecuriteSocial regimeSecuriteSocial;

    private Double taux;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Boolean actif = true;
}
