package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "conge")
@Getter
@Setter
public class Conge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "superviseur", "fonction", "emploi", "department", "direction", "service", "agence", "regimeSecuriteSocial", "grilleSalariale", "categorieObj", "echelonObj", "gradeObj"})
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_absence_conge_id")
    private TypeAbsenceConge typeAbsenceConge;

    private String dateDebut;
    private String dateFin;
    private Integer nbJours;
    
    @Column(name = "employe_nom")
    private String employe;

    @Column(name = "type_nom")
    private String type;
    
    @Column(length = 1000)
    private String motif;
    
    @Column(columnDefinition = "TEXT")
    private String justificatif;
    private String justificatifNom;
    private String dateDemande;
    private String dateValidation;
    private String validePar;
    
    @Column(length = 1000)
    private String motifRefus;
    
    private Integer soldeAvantDemande;
    private Integer soldeApresDemande;

    /**
     * Statuts du Workflow Bancaire :
     * - EN_ATTENTE_INTERIM : En attente de l'avis de l'intérimaire pressenti (Étape 2)
     * - EN_ATTENTE_N1      : En attente du visa du Directeur/Chef N+1 (Étape 3)
     * - EN_ATTENTE_DRH     : En attente du contrôle et délivrance du Titre de Congé DRH (Étape 4)
     * - APPROUVE           : Validé définitivement par la DRH avec Titre de Congé délivré
     * - REJETE             : Refusé à une des étapes
     * - ANNULE             : Annulé par le collaborateur
     */
    private String statut;

    // ── ÉTAPE 2 : AVIS INTÉRIMAIRE (COLLÈGUE PRESSENTI) ──
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "interimaire_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "superviseur", "fonction", "emploi", "department", "direction", "service", "agence", "regimeSecuriteSocial", "grilleSalariale", "categorieObj", "echelonObj", "gradeObj"})
    private Employee interimaire;

    @Column(name = "statut_interim")
    private String statutInterim; // EN_ATTENTE_INTERIM, ACCEPTE, REFUSE

    @Column(name = "date_avis_interim")
    private String dateAvisInterim;

    @Column(name = "commentaire_interim", length = 1000)
    private String commentaireInterim;

    // ── ÉTAPE 3 : VALIDATION N+1 (DIRECTEUR / CHEF DE PÔLE / VALIDATEUR) ──
    @Column(name = "visa_n1_par")
    private String visaN1Par;

    @Column(name = "date_visa_n1")
    private String dateVisaN1;

    @Column(name = "commentaire_n1", length = 1000)
    private String commentaireN1;

    // ── ÉTAPE 4 : CONTRÔLE ET DÉLIVRANCE TITRE DE CONGÉ DRH ──
    @Column(name = "visa_drh_par")
    private String visaDrhPar;

    @Column(name = "date_visa_drh")
    private String dateVisaDrh;

    @Column(name = "numero_titre_conge")
    private String numeroTitreConge;

    // ── ÉTAPE 5 : SÉCURITÉ SI & SUSPENSION ACCÈS (RÈGLE PRUDENTIELLE BCEAO) ──
    @Column(name = "poste_sensible_bceao")
    private Boolean posteSensibleBceao = false;

    @Column(name = "statut_si")
    private String statutSi = "NON_REQUIS"; // NON_REQUIS, A_SUSPENDRE, ACCES_SUSPENDU, ACCES_RESTAURE

    public String getEmploye() {
        if (employe != null && !employe.trim().isEmpty() && !employe.equalsIgnoreCase("Agent non spécifié")) {
            return employe;
        }
        if (employee != null) {
            String p = employee.getPrenom() != null ? employee.getPrenom().trim() : "";
            String n = employee.getNom() != null ? employee.getNom().trim() : "";
            String full = (p + " " + n).trim();
            if (!full.isEmpty()) return full;
            if (employee.getName() != null) return employee.getName().trim();
        }
        return employe != null ? employe : "Collaborateur BPBF";
    }

    public String getType() {
        if (type != null && !type.trim().isEmpty()) {
            return type;
        }
        if (typeAbsenceConge != null) {
            return typeAbsenceConge.getName() != null ? typeAbsenceConge.getName() : typeAbsenceConge.getCode();
        }
        return "Congé annuel payé";
    }

    public Conge() {}
}
