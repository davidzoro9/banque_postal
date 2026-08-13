package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "information_salariale", uniqueConstraints = @UniqueConstraint(columnNames = "employee_id"))
public class InformationSalariale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private String modePaiement;
    private String banque;
    private String iban;
    private String intituleCompte;
    private Double salaireBrut;
}
