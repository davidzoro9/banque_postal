package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "employee")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String matricule;
    private String email;
    private String phone;

    // ─── État Civil & Identité ─────────────────────────────────────
    private String nom;
    private String prenom;
    private String nomJeuneFille;
    private String sexe;
    private String dateNaissance; // Format "YYYY-MM-DD"
    private String lieuNaissance;
    private String nationalite;
    private String numeroCNI;

    // ─── Coordonnées ────────────────────────────────────────────────
    private String adresse;
    private String ville;
    private String codePostal;
    private String pays;
    private String telephone;
    private String dateEmbauche;
    private String statut;
    // ─── Informations Bancaires & Paiement ──────────────────────────
    private String modePaiement;
    private String banque;
    private String iban;
    private String intituleCompte;

    // ─── Contacts d'urgence ─────────────────────────────────────────
    private String contactUrgenceNom;
    private String contactUrgenceTelephone;
    private String contactUrgenceLien;

    // ─── Études & Diplômes ──────────────────────────────────────────
    private String dernierDiplome;
    private String diplomeRecrutement;
    private String brancheEtude;
    private String ecoleUniversite;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "fonction_id", nullable = true)
    private Fonction fonction;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "emploi_id", nullable = true)
    private Emploi emploi;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "department_id", nullable = true)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "direction_id", nullable = true)
    private Direction direction;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "service_id", nullable = true)
    private Service service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agence_id", nullable = true)
    private Agence agence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regime_securite_social_id", nullable = true)
    private RegimeSecuriteSocial regimeSecuriteSocial;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "superviseur_id", nullable = true)
    private Employee superviseur;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "grille_salariale_id", nullable = true)
    private GrilleSalariale grilleSalariale;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "categorie_id", nullable = true)
    private Categorie categorieObj;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "echelon_id", nullable = true)
    private Echelon echelonObj;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "grade_id", nullable = true)
    private Grade gradeObj;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus state;

    @Column(columnDefinition = "TEXT")
    private String extraData;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getNomJeuneFille() { return nomJeuneFille; }
    public void setNomJeuneFille(String nomJeuneFille) { this.nomJeuneFille = nomJeuneFille; }

    public String getSexe() { return sexe; }
    public void setSexe(String sexe) { this.sexe = sexe; }

    public String getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(String dateNaissance) { this.dateNaissance = dateNaissance; }

    public String getLieuNaissance() { return lieuNaissance; }
    public void setLieuNaissance(String lieuNaissance) { this.lieuNaissance = lieuNaissance; }

    public String getNationalite() { return nationalite; }
    public void setNationalite(String nationalite) { this.nationalite = nationalite; }

    public String getNumeroCNI() { return numeroCNI; }
    public void setNumeroCNI(String numeroCNI) { this.numeroCNI = numeroCNI; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }

    public String getCodePostal() { return codePostal; }
    public void setCodePostal(String codePostal) { this.codePostal = codePostal; }

    public String getPays() { return pays; }
    public void setPays(String pays) { this.pays = pays; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getDateEmbauche() { return dateEmbauche; }
    public void setDateEmbauche(String dateEmbauche) { this.dateEmbauche = dateEmbauche; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    public String getBanque() { return banque; }
    public void setBanque(String banque) { this.banque = banque; }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }

    public String getIntituleCompte() { return intituleCompte; }
    public void setIntituleCompte(String intituleCompte) { this.intituleCompte = intituleCompte; }

    public String getContactUrgenceNom() { return contactUrgenceNom; }
    public void setContactUrgenceNom(String contactUrgenceNom) { this.contactUrgenceNom = contactUrgenceNom; }

    public String getContactUrgenceTelephone() { return contactUrgenceTelephone; }
    public void setContactUrgenceTelephone(String contactUrgenceTelephone) { this.contactUrgenceTelephone = contactUrgenceTelephone; }

    public String getContactUrgenceLien() { return contactUrgenceLien; }
    public void setContactUrgenceLien(String contactUrgenceLien) { this.contactUrgenceLien = contactUrgenceLien; }

    public String getDernierDiplome() { return dernierDiplome; }
    public void setDernierDiplome(String dernierDiplome) { this.dernierDiplome = dernierDiplome; }

    public String getDiplomeRecrutement() { return diplomeRecrutement; }
    public void setDiplomeRecrutement(String diplomeRecrutement) { this.diplomeRecrutement = diplomeRecrutement; }

    public String getBrancheEtude() { return brancheEtude; }
    public void setBrancheEtude(String brancheEtude) { this.brancheEtude = brancheEtude; }

    public String getEcoleUniversite() { return ecoleUniversite; }
    public void setEcoleUniversite(String ecoleUniversite) { this.ecoleUniversite = ecoleUniversite; }

    public EmployeeStatus getState() { return state; }
    public void setState(EmployeeStatus state) { this.state = state; }

    public Agence getAgence() { return agence; }
    public void setAgence(Agence agence) { this.agence = agence; }

    public RegimeSecuriteSocial getRegimeSecuriteSocial() { return regimeSecuriteSocial; }
    public void setRegimeSecuriteSocial(RegimeSecuriteSocial regimeSecuriteSocial) { this.regimeSecuriteSocial = regimeSecuriteSocial; }

    public Categorie getCategorieObj() { return categorieObj; }
    public void setCategorieObj(Categorie categorieObj) { this.categorieObj = categorieObj; }

    public Echelon getEchelonObj() { return echelonObj; }
    public void setEchelonObj(Echelon echelonObj) { this.echelonObj = echelonObj; }

    public Grade getGradeObj() { return gradeObj; }
    public void setGradeObj(Grade gradeObj) { this.gradeObj = gradeObj; }

    public String getExtraData() { return extraData; }
    public void setExtraData(String extraData) { this.extraData = extraData; }

    public Fonction getFonction() { return fonction; }
    public void setFonction(Fonction fonction) { this.fonction = fonction; }

    public Emploi getEmploi() { return emploi; }
    public void setEmploi(Emploi emploi) { this.emploi = emploi; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public Direction getDirection() { return direction; }
    public void setDirection(Direction direction) { this.direction = direction; }

    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }

    public Employee getSuperviseur() { return superviseur; }
    public void setSuperviseur(Employee superviseur) { this.superviseur = superviseur; }

    public GrilleSalariale getGrilleSalariale() { return grilleSalariale; }
    public void setGrilleSalariale(GrilleSalariale grilleSalariale) { this.grilleSalariale = grilleSalariale; }
}


