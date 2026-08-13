package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "indemnite_employe", uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "parametrage_indemnite_id"}))
public class IndemniteEmploye {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "type_indemnite_id", nullable = false)
    private TypeIndemnite typeIndemnite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parametrage_indemnite_id")
    private ParametrageIndemnite parametrageIndemnite;

    private String libelle;
    private Double montant;
    private Boolean actif;
}
