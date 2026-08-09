package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

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

    // Fonction / Nomination
    private String fonction;

    // Photo
    private String photo;

    // Famille
    private String conjointJson;
    private String enfantsJson;
    private String personnesChargeJson;

    // Job / Position
    private String poste;
    private String service;
    private String direction;
    private String departement;
    private String dateEmbauche;
    private String statut;
    private String typeContrat;

    // Category / Grade
    @JsonAlias({"categorie", "categoriePro"})
    @JsonProperty("categoriePro")
    private String categoriePro;
    private String echelon;
    private String grade;
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
    private Long grilleSalarialeId;
    private Long categorieId;
    private Long echelonId;
    private Long gradeId;

    // Compatibility properties for old code if any
    private String name;
    private String phone;
    private Long fonction_id;
    private Long emploi_id;
    private Long department_id;
    private Long direction_id;
    private Long service_id;
    private Long superviseur_id;
    private String state;
}
