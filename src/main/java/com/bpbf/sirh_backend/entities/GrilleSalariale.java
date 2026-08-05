package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "grille_salariale")
public class GrilleSalariale {
    @Id
    @GeneratedValue
    private Long id;
    private String classe;
    private String category;
    private String echelle;
    private String echellon;

    @Column(precision = 10, scale = 2, name = "salaire_base")
    private BigDecimal basicSalary;
}
