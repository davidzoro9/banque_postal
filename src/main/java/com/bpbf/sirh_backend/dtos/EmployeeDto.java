package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private Long id;
    private String matricule;
    
    // Civil status / Identity
    private String nom;
    private String prenom;
    private String nomJeuneFille;
    private String sexe;
    private String dateNaissance;
    private String lieuNaissance;
    private String nationalite;
    private String numeroCNI;

    // Contact
    private String adresse;
    private String ville;
    private String codePostal;
    private String pays;
    private String telephone;
    private String email;

    // Contacts d'urgence
    private String contactsUrgenceJson;
    private String contactUrgenceNom;
    private String contactUrgenceTelephone;
    private String contactUrgenceLien;

    // Éducation
    private String dernierDiplome;
    private String diplomeRecrutement;
    private String brancheEtude;
    private String ecoleUniversite;

    // Retraite
    private Integer ageRetraite;
    private String dateRetraite;

    // Photo
    private String photo;

    // Famille
    private String conjointJson;
    private String enfantsJson;
    private String personnesChargeJson;

    // Job / Position dates & status
    private String dateEmbauche;
    private String statut;
    private String niveau;

    // Allowances / Indemnités
    private Double primeLogement;
    private Double primeTransport;
    private Double primeResponsabilite;
    private String autresIndemnitesJson;

    // Exonérations / Avantages
    private String exonerationsFiscalesJson;
    private String exonerationsSocialesJson;
    private String avantagesParticuliersJson;

    // Salary & Payment
    private Double salaireBase;
    private Double salaireBrut;
    private String modePaiement;
    private String banque;
    private String iban;
    private String intituleCompte;

    // HR Documents & Notes
    private String documentsJson;
    private String observations;
    private String evaluationsJson;
    private String historiqueActionsJson;

    // Relational IDs
    private Long fonction_id;
    private Long emploi_id;
    private Long department_id;
    private Long direction_id;
    private Long service_id;
    private Long superviseur_id;
    private Long grilleSalarialeId;
    private Long categorieId;
    private Long echelonId;
    private Long gradeId;

    private String name;
    private String phone;
    private String state;
}
