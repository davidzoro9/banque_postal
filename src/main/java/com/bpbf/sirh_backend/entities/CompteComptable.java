package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "compte_comptable")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteComptable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String numeroCompte;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(length = 50)
    private String classeCompte; // CLASSE_6 (Charges), CLASSE_4 (Tiers), etc.

    @Column(length = 10)
    private String sensParDefaut; // DEBIT ou CREDIT

    @Column(length = 50)
    private String typeRubriqueAssociee; // SALAIRE_BASE, INDEMNITES, COTISATIONS_PATRONALES, NET_A_PAYER, CNSS, IUTS, FSP, PRECOMPTES

    @Column(length = 30)
    private String codeJournal; // OD_PAIE

    @Column(length = 255)
    private String description;

    @Builder.Default
    private Boolean actif = true;
}
