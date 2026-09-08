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
    private Long agence_id;
    private Long superviseur_id;
    private Long grilleSalarialeId;
    private Long categorieId;
    private Long echelonId;
    private Long gradeId;
    private Long regimeSecuriteSocialId;

    private String name;
    private String phone;
    private String state;

    private String fonctionLibelle;
    private String emploiLibelle;
    private String departmentLibelle;
    private String directionLibelle;
    private String serviceLibelle;
    private String agenceLibelle;
    private String regimeSecuriteSocialCode;
    private String regimeSecuriteSocialLibelle;

    private String gradeLibelle;
    private String categorieLibelle;
    private String echelonLibelle;

    // Famille
    private Object conjoint;
    private Object enfants;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

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

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContactsUrgenceJson() { return contactsUrgenceJson; }
    public void setContactsUrgenceJson(String contactsUrgenceJson) { this.contactsUrgenceJson = contactsUrgenceJson; }

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

    public Integer getAgeRetraite() { return ageRetraite; }
    public void setAgeRetraite(Integer ageRetraite) { this.ageRetraite = ageRetraite; }

    public String getDateRetraite() { return dateRetraite; }
    public void setDateRetraite(String dateRetraite) { this.dateRetraite = dateRetraite; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }

    public String getDateEmbauche() { return dateEmbauche; }
    public void setDateEmbauche(String dateEmbauche) { this.dateEmbauche = dateEmbauche; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }

    public Double getPrimeLogement() { return primeLogement; }
    public void setPrimeLogement(Double primeLogement) { this.primeLogement = primeLogement; }

    public Double getPrimeTransport() { return primeTransport; }
    public void setPrimeTransport(Double primeTransport) { this.primeTransport = primeTransport; }

    public Double getPrimeResponsabilite() { return primeResponsabilite; }
    public void setPrimeResponsabilite(Double primeResponsabilite) { this.primeResponsabilite = primeResponsabilite; }

    public String getAutresIndemnitesJson() { return autresIndemnitesJson; }
    public void setAutresIndemnitesJson(String autresIndemnitesJson) { this.autresIndemnitesJson = autresIndemnitesJson; }

    public String getExonerationsFiscalesJson() { return exonerationsFiscalesJson; }
    public void setExonerationsFiscalesJson(String exonerationsFiscalesJson) { this.exonerationsFiscalesJson = exonerationsFiscalesJson; }

    public String getExonerationsSocialesJson() { return exonerationsSocialesJson; }
    public void setExonerationsSocialesJson(String exonerationsSocialesJson) { this.exonerationsSocialesJson = exonerationsSocialesJson; }

    public String getAvantagesParticuliersJson() { return avantagesParticuliersJson; }
    public void setAvantagesParticuliersJson(String avantagesParticuliersJson) { this.avantagesParticuliersJson = avantagesParticuliersJson; }

    public Double getSalaireBase() { return salaireBase; }
    public void setSalaireBase(Double salaireBase) { this.salaireBase = salaireBase; }

    public Double getSalaireBrut() { return salaireBrut; }
    public void setSalaireBrut(Double salaireBrut) { this.salaireBrut = salaireBrut; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    public String getBanque() { return banque; }
    public void setBanque(String banque) { this.banque = banque; }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }

    public String getIntituleCompte() { return intituleCompte; }
    public void setIntituleCompte(String intituleCompte) { this.intituleCompte = intituleCompte; }

    public String getDocumentsJson() { return documentsJson; }
    public void setDocumentsJson(String documentsJson) { this.documentsJson = documentsJson; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    public String getEvaluationsJson() { return evaluationsJson; }
    public void setEvaluationsJson(String evaluationsJson) { this.evaluationsJson = evaluationsJson; }

    public String getHistoriqueActionsJson() { return historiqueActionsJson; }
    public void setHistoriqueActionsJson(String historiqueActionsJson) { this.historiqueActionsJson = historiqueActionsJson; }

    public Long getFonction_id() { return fonction_id; }
    public void setFonction_id(Long fonction_id) { this.fonction_id = fonction_id; }

    public Long getEmploi_id() { return emploi_id; }
    public void setEmploi_id(Long emploi_id) { this.emploi_id = emploi_id; }

    public Long getDepartment_id() { return department_id; }
    public void setDepartment_id(Long department_id) { this.department_id = department_id; }

    public Long getDirection_id() { return direction_id; }
    public void setDirection_id(Long direction_id) { this.direction_id = direction_id; }

    public Long getService_id() { return service_id; }
    public void setService_id(Long service_id) { this.service_id = service_id; }

    public Long getAgence_id() { return agence_id; }
    public void setAgence_id(Long agence_id) { this.agence_id = agence_id; }

    public Long getSuperviseur_id() { return superviseur_id; }
    public void setSuperviseur_id(Long superviseur_id) { this.superviseur_id = superviseur_id; }

    public Long getGrilleSalarialeId() { return grilleSalarialeId; }
    public void setGrilleSalarialeId(Long grilleSalarialeId) { this.grilleSalarialeId = grilleSalarialeId; }

    public Long getCategorieId() { return categorieId; }
    public void setCategorieId(Long categorieId) { this.categorieId = categorieId; }

    public Long getEchelonId() { return echelonId; }
    public void setEchelonId(Long echelonId) { this.echelonId = echelonId; }

    public Long getGradeId() { return gradeId; }
    public void setGradeId(Long gradeId) { this.gradeId = gradeId; }

    public Long getRegimeSecuriteSocialId() { return regimeSecuriteSocialId; }
    public void setRegimeSecuriteSocialId(Long regimeSecuriteSocialId) { this.regimeSecuriteSocialId = regimeSecuriteSocialId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getFonctionLibelle() { return fonctionLibelle; }
    public void setFonctionLibelle(String fonctionLibelle) { this.fonctionLibelle = fonctionLibelle; }

    public String getEmploiLibelle() { return emploiLibelle; }
    public void setEmploiLibelle(String emploiLibelle) { this.emploiLibelle = emploiLibelle; }

    public String getDepartmentLibelle() { return departmentLibelle; }
    public void setDepartmentLibelle(String departmentLibelle) { this.departmentLibelle = departmentLibelle; }

    public String getDirectionLibelle() { return directionLibelle; }
    public void setDirectionLibelle(String directionLibelle) { this.directionLibelle = directionLibelle; }

    public String getServiceLibelle() { return serviceLibelle; }
    public void setServiceLibelle(String serviceLibelle) { this.serviceLibelle = serviceLibelle; }

    public String getAgenceLibelle() { return agenceLibelle; }
    public void setAgenceLibelle(String agenceLibelle) { this.agenceLibelle = agenceLibelle; }

    public String getRegimeSecuriteSocialCode() { return regimeSecuriteSocialCode; }
    public void setRegimeSecuriteSocialCode(String regimeSecuriteSocialCode) { this.regimeSecuriteSocialCode = regimeSecuriteSocialCode; }

    public String getRegimeSecuriteSocialLibelle() { return regimeSecuriteSocialLibelle; }
    public void setRegimeSecuriteSocialLibelle(String regimeSecuriteSocialLibelle) { this.regimeSecuriteSocialLibelle = regimeSecuriteSocialLibelle; }

    public String getGradeLibelle() { return gradeLibelle; }
    public void setGradeLibelle(String gradeLibelle) { this.gradeLibelle = gradeLibelle; }

    public String getCategorieLibelle() { return categorieLibelle; }
    public void setCategorieLibelle(String categorieLibelle) { this.categorieLibelle = categorieLibelle; }

    public String getEchelonLibelle() { return echelonLibelle; }
    public void setEchelonLibelle(String echelonLibelle) { this.echelonLibelle = echelonLibelle; }

    public Object getConjoint() { return conjoint; }
    public void setConjoint(Object conjoint) { this.conjoint = conjoint; }

    public Object getEnfants() { return enfants; }
    public void setEnfants(Object enfants) { this.enfants = enfants; }
}
