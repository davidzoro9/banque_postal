package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exoneration_employe", uniqueConstraints = @UniqueConstraint(columnNames = "indemnite_employe_id"))
public class ExonerationEmploye {
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
    @JoinColumn(name = "indemnite_employe_id", unique = true)
    private IndemniteEmploye indemniteEmploye;

    private String libelle;
    private Double montant;
    private Double tauxExonere;
    private Double plafondExonere;
}
