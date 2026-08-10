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
@Table(name = "mobilite_demande")
public class MobiliteDemande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private String typeMobility;
    private String posteCible;
    private String serviceCible;
    private String dateDemande;

    @Column(columnDefinition = "TEXT")
    private String commentaires;

    private String statut;
}
