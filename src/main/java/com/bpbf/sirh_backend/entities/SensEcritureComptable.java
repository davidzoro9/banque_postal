package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "param_sens_ecriture")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensEcritureComptable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(length = 255)
    private String description;

    @Builder.Default
    private Integer ordre = 0;

    @Builder.Default
    private Boolean actif = true;
}
