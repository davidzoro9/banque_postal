package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "bulletin", indexes = {
    @Index(name = "idx_bulletin_emp", columnList = "employee_id"),
    @Index(name = "idx_bulletin_session", columnList = "session_paie_id"),
    @Index(name = "idx_bulletin_lot", columnList = "bulletin_lot_id"),
    @Index(name = "idx_bulletin_code", columnList = "code")
})
public class Bulletin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_paie_id")
    private SessionPaie sessionPaie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bulletin_lot_id")
    private BulletinLot bulletinLot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_id")
    private Grade grade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contrat_id")
    private Contrat contrat;

    @Column(length = 50)
    private String typeSession;

    private LocalDate dateFrom;

    private LocalDate dateTo;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal scheduledWorkingDays = new BigDecimal("30.00");

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal workedDays = new BigDecimal("30.00");

    @Column(precision = 19, scale = 2)
    private BigDecimal salaireBase;

    @Column(precision = 19, scale = 2)
    private BigDecimal surSalaire;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalIndemnites;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalAvoirs;

    @Column(precision = 19, scale = 2)
    private BigDecimal salaireBrut;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalExonerations;

    @Column(precision = 19, scale = 2)
    private BigDecimal abattementForfaitaire;

    @Column(precision = 19, scale = 2)
    private BigDecimal baseImposable;

    @Column(precision = 19, scale = 2)
    private BigDecimal cotisationCnss;

    @Column(precision = 19, scale = 2)
    private BigDecimal impotIutsSansCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal reductionIutsCharge;

    @Column(precision = 19, scale = 2)
    private BigDecimal impotIuts;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalRetenuesSociales;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalPrecomptes;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalRetenues;

    @Column(precision = 19, scale = 2)
    private BigDecimal totalCotisationsPatronales;

    @Column(precision = 19, scale = 2)
    private BigDecimal salaireNet;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String statut = "GENERE"; // GENERE, VALIDE, PAYE, ANNULE

    private LocalDateTime dateCalcul;

    private LocalDateTime dateValidation;

    @Column(columnDefinition = "TEXT")
    private String justificationEcart;

    @OneToMany(mappedBy = "bulletin", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    @OrderBy("ordre ASC, id ASC")
    private List<BulletinLine> lines = new ArrayList<>();

    public void addLine(BulletinLine line) {
        lines.add(line);
        line.setBulletin(this);
    }

    public void removeLine(BulletinLine line) {
        lines.remove(line);
        line.setBulletin(null);
    }

    @PrePersist
    public void onCreate() {
        if (this.dateCalcul == null) {
            this.dateCalcul = LocalDateTime.now();
        }
        if (this.statut == null) {
            this.statut = "GENERE";
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public SessionPaie getSessionPaie() { return sessionPaie; }
    public void setSessionPaie(SessionPaie sessionPaie) { this.sessionPaie = sessionPaie; }

    public BulletinLot getBulletinLot() { return bulletinLot; }
    public void setBulletinLot(BulletinLot bulletinLot) { this.bulletinLot = bulletinLot; }

    public Grade getGrade() { return grade; }
    public void setGrade(Grade grade) { this.grade = grade; }

    public Contrat getContrat() { return contrat; }
    public void setContrat(Contrat contrat) { this.contrat = contrat; }

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

    public List<BulletinLine> getLines() { return lines; }
    public void setLines(List<BulletinLine> lines) { this.lines = lines; }

    public static BulletinBuilder builder() {
        return new BulletinBuilder();
    }

    public static class BulletinBuilder {
        private Long id;
        private String code;
        private Employee employee;
        private SessionPaie sessionPaie;
        private BulletinLot bulletinLot;
        private Grade grade;
        private Contrat contrat;
        private String typeSession;
        private LocalDate dateFrom;
        private LocalDate dateTo;
        private BigDecimal scheduledWorkingDays = new BigDecimal("30.00");
        private BigDecimal workedDays = new BigDecimal("30.00");
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
        private String statut = "GENERE";
        private LocalDateTime dateCalcul;
        private LocalDateTime dateValidation;
        private String justificationEcart;
        private List<BulletinLine> lines = new ArrayList<>();

        public BulletinBuilder id(Long id) { this.id = id; return this; }
        public BulletinBuilder code(String code) { this.code = code; return this; }
        public BulletinBuilder employee(Employee employee) { this.employee = employee; return this; }
        public BulletinBuilder sessionPaie(SessionPaie sessionPaie) { this.sessionPaie = sessionPaie; return this; }
        public BulletinBuilder bulletinLot(BulletinLot bulletinLot) { this.bulletinLot = bulletinLot; return this; }
        public BulletinBuilder grade(Grade grade) { this.grade = grade; return this; }
        public BulletinBuilder contrat(Contrat contrat) { this.contrat = contrat; return this; }
        public BulletinBuilder typeSession(String typeSession) { this.typeSession = typeSession; return this; }
        public BulletinBuilder dateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; return this; }
        public BulletinBuilder dateTo(LocalDate dateTo) { this.dateTo = dateTo; return this; }
        public BulletinBuilder scheduledWorkingDays(BigDecimal scheduledWorkingDays) { this.scheduledWorkingDays = scheduledWorkingDays; return this; }
        public BulletinBuilder workedDays(BigDecimal workedDays) { this.workedDays = workedDays; return this; }
        public BulletinBuilder salaireBase(BigDecimal salaireBase) { this.salaireBase = salaireBase; return this; }
        public BulletinBuilder surSalaire(BigDecimal surSalaire) { this.surSalaire = surSalaire; return this; }
        public BulletinBuilder totalIndemnites(BigDecimal totalIndemnites) { this.totalIndemnites = totalIndemnites; return this; }
        public BulletinBuilder totalAvoirs(BigDecimal totalAvoirs) { this.totalAvoirs = totalAvoirs; return this; }
        public BulletinBuilder salaireBrut(BigDecimal salaireBrut) { this.salaireBrut = salaireBrut; return this; }
        public BulletinBuilder totalExonerations(BigDecimal totalExonerations) { this.totalExonerations = totalExonerations; return this; }
        public BulletinBuilder abattementForfaitaire(BigDecimal abattementForfaitaire) { this.abattementForfaitaire = abattementForfaitaire; return this; }
        public BulletinBuilder baseImposable(BigDecimal baseImposable) { this.baseImposable = baseImposable; return this; }
        public BulletinBuilder cotisationCnss(BigDecimal cotisationCnss) { this.cotisationCnss = cotisationCnss; return this; }
        public BulletinBuilder impotIutsSansCharge(BigDecimal impotIutsSansCharge) { this.impotIutsSansCharge = impotIutsSansCharge; return this; }
        public BulletinBuilder reductionIutsCharge(BigDecimal reductionIutsCharge) { this.reductionIutsCharge = reductionIutsCharge; return this; }
        public BulletinBuilder impotIuts(BigDecimal impotIuts) { this.impotIuts = impotIuts; return this; }
        public BulletinBuilder totalRetenuesSociales(BigDecimal totalRetenuesSociales) { this.totalRetenuesSociales = totalRetenuesSociales; return this; }
        public BulletinBuilder totalPrecomptes(BigDecimal totalPrecomptes) { this.totalPrecomptes = totalPrecomptes; return this; }
        public BulletinBuilder totalRetenues(BigDecimal totalRetenues) { this.totalRetenues = totalRetenues; return this; }
        public BulletinBuilder totalCotisationsPatronales(BigDecimal totalCotisationsPatronales) { this.totalCotisationsPatronales = totalCotisationsPatronales; return this; }
        public BulletinBuilder salaireNet(BigDecimal salaireNet) { this.salaireNet = salaireNet; return this; }
        public BulletinBuilder statut(String statut) { this.statut = statut; return this; }
        public BulletinBuilder dateCalcul(LocalDateTime dateCalcul) { this.dateCalcul = dateCalcul; return this; }
        public BulletinBuilder dateValidation(LocalDateTime dateValidation) { this.dateValidation = dateValidation; return this; }
        public BulletinBuilder justificationEcart(String justificationEcart) { this.justificationEcart = justificationEcart; return this; }
        public BulletinBuilder lines(List<BulletinLine> lines) { this.lines = lines; return this; }

        public Bulletin build() {
            Bulletin b = new Bulletin();
            b.setId(id);
            b.setCode(code);
            b.setEmployee(employee);
            b.setSessionPaie(sessionPaie);
            b.setBulletinLot(bulletinLot);
            b.setGrade(grade);
            b.setContrat(contrat);
            b.setTypeSession(typeSession);
            b.setDateFrom(dateFrom);
            b.setDateTo(dateTo);
            b.setScheduledWorkingDays(scheduledWorkingDays);
            b.setWorkedDays(workedDays);
            b.setSalaireBase(salaireBase);
            b.setSurSalaire(surSalaire);
            b.setTotalIndemnites(totalIndemnites);
            b.setTotalAvoirs(totalAvoirs);
            b.setSalaireBrut(salaireBrut);
            b.setTotalExonerations(totalExonerations);
            b.setAbattementForfaitaire(abattementForfaitaire);
            b.setBaseImposable(baseImposable);
            b.setCotisationCnss(cotisationCnss);
            b.setImpotIutsSansCharge(impotIutsSansCharge);
            b.setReductionIutsCharge(reductionIutsCharge);
            b.setImpotIuts(impotIuts);
            b.setTotalRetenuesSociales(totalRetenuesSociales);
            b.setTotalPrecomptes(totalPrecomptes);
            b.setTotalRetenues(totalRetenues);
            b.setTotalCotisationsPatronales(totalCotisationsPatronales);
            b.setSalaireNet(salaireNet);
            b.setStatut(statut != null ? statut : "GENERE");
            b.setDateCalcul(dateCalcul != null ? dateCalcul : LocalDateTime.now());
            b.setDateValidation(dateValidation);
            b.setJustificationEcart(justificationEcart);
            b.setLines(lines != null ? lines : new ArrayList<>());
            return b;
        }
    }
}

