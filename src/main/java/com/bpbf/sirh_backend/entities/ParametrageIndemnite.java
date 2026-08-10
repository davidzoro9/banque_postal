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
@Table(name = "parametrage_indemnite")
public class ParametrageIndemnite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_indemnite_id")
    private TypeIndemnite typeIndemniteObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fonction_id")
    private Fonction fonctionObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_id")
    private Grade gradeObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categorie_id")
    private Categorie categorieObj;

    private Double taux;
    private Double tauxExoneration;
    private Double plafondExoneration;
    private String regleType;
    private String typeNomination;
    private Boolean actif = true;
}
