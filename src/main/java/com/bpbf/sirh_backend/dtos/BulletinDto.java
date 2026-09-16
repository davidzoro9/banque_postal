package com.bpbf.sirh_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulletinDto {
    private Long id;
    private String code;
    private Long employeeId;
    private String employeeName;
    private String matricule;
    private String fonction;
    private Long sessionPaieId;
    private String sessionPaieCode;
    private String sessionPeriode;
    private Long gradeId;
    private String gradeLibelle;
    private Long contratId;
    private String typeSession;
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private BigDecimal scheduledWorkingDays;
    private BigDecimal workedDays;
    private BigDecimal salaireBase;
    private BigDecimal surSalaire;
    private BigDecimal totalIndemnites;
    private BigDecimal totalAvoirs;
    private BigDecimal salaireBrut;
    private BigDecimal totalExonerations;
    private BigDecimal abattementForfaitaire;
    private BigDecimal baseImposable;
    private BigDecimal cotisationCnss;
    private BigDecimal impotIutsSansCharge;
    private BigDecimal reductionIutsCharge;
    private BigDecimal impotIuts;
    private BigDecimal totalRetenuesSociales;
    private BigDecimal totalPrecomptes;
    private BigDecimal totalRetenues;
    private BigDecimal totalCotisationsPatronales;
    private BigDecimal salaireNet;
    private String statut;
    private LocalDateTime dateCalcul;
    private LocalDateTime dateValidation;
    private String justificationEcart;
    private BigDecimal salaireNetPrecedent;
    private BigDecimal ecartNet;
    private List<BulletinLineDto> lines;

    private String employeeNom;
    private String employeePrenom;
    private String dateEmbauche;
    private String departement;
    private String numeroCnss;
    private String situationFamiliale;
    private Integer nombreCharges;
    private Integer ancienneteAnnees;
    private String modeReglement;
    private String numeroCompteBancaire;
    private BigDecimal cotisationCrrae;
    private BigDecimal cotisationSolidarite;
    private BigDecimal cumulBrutExercice;
    private BigDecimal cumulBaseImposableExercice;
    private BigDecimal cumulCnssExercice;
    private BigDecimal cumulIutsExercice;
    private BigDecimal cumulCrraeExercice;
    private String emploi;
    private String service;
    private String situationMatrimoniale;
    private Integer partsFiscales;
    private Integer anciennete;
    private String classification;
    private String banque;
    private String periode;
    private String sessionType;
    private String montantEnLettres;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }

    public String getFonction() { return fonction; }
    public void setFonction(String fonction) { this.fonction = fonction; }

    public Long getSessionPaieId() { return sessionPaieId; }
    public void setSessionPaieId(Long sessionPaieId) { this.sessionPaieId = sessionPaieId; }

    public String getSessionPaieCode() { return sessionPaieCode; }
    public void setSessionPaieCode(String sessionPaieCode) { this.sessionPaieCode = sessionPaieCode; }

    public String getSessionPeriode() { return sessionPeriode; }
    public void setSessionPeriode(String sessionPeriode) { this.sessionPeriode = sessionPeriode; }

    public Long getGradeId() { return gradeId; }
    public void setGradeId(Long gradeId) { this.gradeId = gradeId; }

    public String getGradeLibelle() { return gradeLibelle; }
    public void setGradeLibelle(String gradeLibelle) { this.gradeLibelle = gradeLibelle; }

    public Long getContratId() { return contratId; }
    public void setContratId(Long contratId) { this.contratId = contratId; }

    public String getTypeSession() { return typeSession; }
    public void setTypeSession(String typeSession) { this.typeSession = typeSession; }

    public LocalDate getDateFrom() { return dateFrom; }
    public void setDateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; }

    public LocalDate getDateTo() { return dateTo; }
    public void setDateTo(LocalDate dateTo) { this.dateTo = dateTo; }

    public BigDecimal getScheduledWorkingDays() { return scheduledWorkingDays; }
    public void setScheduledWorkingDays(BigDecimal scheduledWorkingDays) { this.scheduledWorkingDays = scheduledWorkingDays; }

    public BigDecimal getWorkedDays() { return workedDays; }
    public void setWorkedDays(BigDecimal workedDays) { this.workedDays = workedDays; }

    public BigDecimal getSalaireBase() { return salaireBase; }
    public void setSalaireBase(BigDecimal salaireBase) { this.salaireBase = salaireBase; }

    public BigDecimal getSurSalaire() { return surSalaire; }
    public void setSurSalaire(BigDecimal surSalaire) { this.surSalaire = surSalaire; }

    public BigDecimal getTotalIndemnites() { return totalIndemnites; }
    public void setTotalIndemnites(BigDecimal totalIndemnites) { this.totalIndemnites = totalIndemnites; }

    public BigDecimal getTotalAvoirs() { return totalAvoirs; }
    public void setTotalAvoirs(BigDecimal totalAvoirs) { this.totalAvoirs = totalAvoirs; }

    public BigDecimal getSalaireBrut() { return salaireBrut; }
    public void setSalaireBrut(BigDecimal salaireBrut) { this.salaireBrut = salaireBrut; }

    public BigDecimal getTotalExonerations() { return totalExonerations; }
    public void setTotalExonerations(BigDecimal totalExonerations) { this.totalExonerations = totalExonerations; }

    public BigDecimal getAbattementForfaitaire() { return abattementForfaitaire; }
    public void setAbattementForfaitaire(BigDecimal abattementForfaitaire) { this.abattementForfaitaire = abattementForfaitaire; }

    public BigDecimal getBaseImposable() { return baseImposable; }
    public void setBaseImposable(BigDecimal baseImposable) { this.baseImposable = baseImposable; }

    public BigDecimal getCotisationCnss() { return cotisationCnss; }
    public void setCotisationCnss(BigDecimal cotisationCnss) { this.cotisationCnss = cotisationCnss; }

    public BigDecimal getImpotIutsSansCharge() { return impotIutsSansCharge; }
    public void setImpotIutsSansCharge(BigDecimal impotIutsSansCharge) { this.impotIutsSansCharge = impotIutsSansCharge; }

    public BigDecimal getReductionIutsCharge() { return reductionIutsCharge; }
    public void setReductionIutsCharge(BigDecimal reductionIutsCharge) { this.reductionIutsCharge = reductionIutsCharge; }

    public BigDecimal getImpotIuts() { return impotIuts; }
    public void setImpotIuts(BigDecimal impotIuts) { this.impotIuts = impotIuts; }

    public BigDecimal getTotalRetenuesSociales() { return totalRetenuesSociales; }
    public void setTotalRetenuesSociales(BigDecimal totalRetenuesSociales) { this.totalRetenuesSociales = totalRetenuesSociales; }

    public BigDecimal getTotalPrecomptes() { return totalPrecomptes; }
    public void setTotalPrecomptes(BigDecimal totalPrecomptes) { this.totalPrecomptes = totalPrecomptes; }

    public BigDecimal getTotalRetenues() { return totalRetenues; }
    public void setTotalRetenues(BigDecimal totalRetenues) { this.totalRetenues = totalRetenues; }

    public BigDecimal getTotalCotisationsPatronales() { return totalCotisationsPatronales; }
    public void setTotalCotisationsPatronales(BigDecimal totalCotisationsPatronales) { this.totalCotisationsPatronales = totalCotisationsPatronales; }

    public BigDecimal getSalaireNet() { return salaireNet; }
    public void setSalaireNet(BigDecimal salaireNet) { this.salaireNet = salaireNet; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDateTime getDateCalcul() { return dateCalcul; }
    public void setDateCalcul(LocalDateTime dateCalcul) { this.dateCalcul = dateCalcul; }

    public LocalDateTime getDateValidation() { return dateValidation; }
    public void setDateValidation(LocalDateTime dateValidation) { this.dateValidation = dateValidation; }

    public String getJustificationEcart() { return justificationEcart; }
    public void setJustificationEcart(String justificationEcart) { this.justificationEcart = justificationEcart; }

    public BigDecimal getSalaireNetPrecedent() { return salaireNetPrecedent; }
    public void setSalaireNetPrecedent(BigDecimal salaireNetPrecedent) { this.salaireNetPrecedent = salaireNetPrecedent; }

    public BigDecimal getEcartNet() { return ecartNet; }
    public void setEcartNet(BigDecimal ecartNet) { this.ecartNet = ecartNet; }

    public List<BulletinLineDto> getLines() { return lines; }
    public void setLines(List<BulletinLineDto> lines) { this.lines = lines; }

    public String getEmployeeNom() { return employeeNom; }
    public void setEmployeeNom(String employeeNom) { this.employeeNom = employeeNom; }

    public String getEmployeePrenom() { return employeePrenom; }
    public void setEmployeePrenom(String employeePrenom) { this.employeePrenom = employeePrenom; }

    public String getDateEmbauche() { return dateEmbauche; }
    public void setDateEmbauche(String dateEmbauche) { this.dateEmbauche = dateEmbauche; }

    public String getDepartement() { return departement; }
    public void setDepartement(String departement) { this.departement = departement; }

    public String getNumeroCnss() { return numeroCnss; }
    public void setNumeroCnss(String numeroCnss) { this.numeroCnss = numeroCnss; }

    public String getSituationFamiliale() { return situationFamiliale; }
    public void setSituationFamiliale(String situationFamiliale) { this.situationFamiliale = situationFamiliale; }

    public Integer getNombreCharges() { return nombreCharges; }
    public void setNombreCharges(Integer nombreCharges) { this.nombreCharges = nombreCharges; }

    public Integer getAncienneteAnnees() { return ancienneteAnnees; }
    public void setAncienneteAnnees(Integer ancienneteAnnees) { this.ancienneteAnnees = ancienneteAnnees; }

    public String getModeReglement() { return modeReglement; }
    public void setModeReglement(String modeReglement) { this.modeReglement = modeReglement; }

    public String getNumeroCompteBancaire() { return numeroCompteBancaire; }
    public void setNumeroCompteBancaire(String numeroCompteBancaire) { this.numeroCompteBancaire = numeroCompteBancaire; }

    public BigDecimal getCotisationCrrae() { return cotisationCrrae; }
    public void setCotisationCrrae(BigDecimal cotisationCrrae) { this.cotisationCrrae = cotisationCrrae; }

    public BigDecimal getCotisationSolidarite() { return cotisationSolidarite; }
    public void setCotisationSolidarite(BigDecimal cotisationSolidarite) { this.cotisationSolidarite = cotisationSolidarite; }

    public BigDecimal getCumulBrutExercice() { return cumulBrutExercice; }
    public void setCumulBrutExercice(BigDecimal cumulBrutExercice) { this.cumulBrutExercice = cumulBrutExercice; }

    public BigDecimal getCumulBaseImposableExercice() { return cumulBaseImposableExercice; }
    public void setCumulBaseImposableExercice(BigDecimal cumulBaseImposableExercice) { this.cumulBaseImposableExercice = cumulBaseImposableExercice; }

    public BigDecimal getCumulCnssExercice() { return cumulCnssExercice; }
    public void setCumulCnssExercice(BigDecimal cumulCnssExercice) { this.cumulCnssExercice = cumulCnssExercice; }

    public BigDecimal getCumulIutsExercice() { return cumulIutsExercice; }
    public void setCumulIutsExercice(BigDecimal cumulIutsExercice) { this.cumulIutsExercice = cumulIutsExercice; }

    public BigDecimal getCumulCrraeExercice() { return cumulCrraeExercice; }
    public void setCumulCrraeExercice(BigDecimal cumulCrraeExercice) { this.cumulCrraeExercice = cumulCrraeExercice; }

    public String getMontantEnLettres() { return montantEnLettres; }
    public void setMontantEnLettres(String montantEnLettres) { this.montantEnLettres = montantEnLettres; }
}

