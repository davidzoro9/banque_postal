package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "conge")
public class Conge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_absence_conge_id")
    private TypeAbsenceConge typeAbsenceConge;

    private String dateDebut;
    private String dateFin;
    private Integer nbJours;
    
    @Column(length = 1000)
    private String motif;
    
    private String justificatif;
    private String dateDemande;
    private String dateValidation;
    private String validePar;
    
    @Column(length = 1000)
    private String motifRefus;
    
    private Integer soldeAvantDemande;
    private Integer soldeApresDemande;
    private String statut; // EN_ATTENTE, APPROUVE, REJETE, ANNULE

    public Conge() {}

    public Conge(Long id, Employee employee, TypeAbsenceConge typeAbsenceConge, String dateDebut, String dateFin,
                 Integer nbJours, String motif, String justificatif, String dateDemande, String dateValidation,
                 String validePar, String motifRefus, Integer soldeAvantDemande, Integer soldeApresDemande, String statut) {
        this.id = id;
        this.employee = employee;
        this.typeAbsenceConge = typeAbsenceConge;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.nbJours = nbJours;
        this.motif = motif;
        this.justificatif = justificatif;
        this.dateDemande = dateDemande;
        this.dateValidation = dateValidation;
        this.validePar = validePar;
        this.motifRefus = motifRefus;
        this.soldeAvantDemande = soldeAvantDemande;
        this.soldeApresDemande = soldeApresDemande;
        this.statut = statut;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public TypeAbsenceConge getTypeAbsenceConge() { return typeAbsenceConge; }
    public void setTypeAbsenceConge(TypeAbsenceConge typeAbsenceConge) { this.typeAbsenceConge = typeAbsenceConge; }

    public String getDateDebut() { return dateDebut; }
    public void setDateDebut(String dateDebut) { this.dateDebut = dateDebut; }

    public String getDateFin() { return dateFin; }
    public void setDateFin(String dateFin) { this.dateFin = dateFin; }

    public Integer getNbJours() { return nbJours; }
    public void setNbJours(Integer nbJours) { this.nbJours = nbJours; }

    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }

    public String getJustificatif() { return justificatif; }
    public void setJustificatif(String justificatif) { this.justificatif = justificatif; }

    public String getDateDemande() { return dateDemande; }
    public void setDateDemande(String dateDemande) { this.dateDemande = dateDemande; }

    public String getDateValidation() { return dateValidation; }
    public void setDateValidation(String dateValidation) { this.dateValidation = dateValidation; }

    public String getValidePar() { return validePar; }
    public void setValidePar(String validePar) { this.validePar = validePar; }

    public String getMotifRefus() { return motifRefus; }
    public void setMotifRefus(String motifRefus) { this.motifRefus = motifRefus; }

    public Integer getSoldeAvantDemande() { return soldeAvantDemande; }
    public void setSoldeAvantDemande(Integer soldeAvantDemande) { this.soldeAvantDemande = soldeAvantDemande; }

    public Integer getSoldeApresDemande() { return soldeApresDemande; }
    public void setSoldeApresDemande(Integer soldeApresDemande) { this.soldeApresDemande = soldeApresDemande; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}
