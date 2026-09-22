package com.bpbf.sirh_backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "bulletin_line")
public class BulletinLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bulletin_id", nullable = false)
    @JsonBackReference
    private Bulletin bulletin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rubrique_paie_id")
    private RubriquePaie rubriquePaie;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String libelle;

    @Column(nullable = false, length = 50)
    private String typeLigne; // GAIN, RETENUE_SOCIALE, IMPOT, PRECOMPTE, COTISATION_PATRONALE

    @Column(precision = 19, scale = 2)
    private BigDecimal baseCalcul;

    @Column(precision = 8, scale = 4)
    private BigDecimal taux;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal montant;

    @Column(precision = 19, scale = 2)
    private BigDecimal partPatronale;

    private Integer ordre;

    public BulletinLine() {}

    public BulletinLine(Long id, Bulletin bulletin, RubriquePaie rubriquePaie, String code, String libelle,
                        String typeLigne, BigDecimal baseCalcul, BigDecimal taux, BigDecimal montant,
                        BigDecimal partPatronale, Integer ordre) {
        this.id = id;
        this.bulletin = bulletin;
        this.rubriquePaie = rubriquePaie;
        this.code = code;
        this.libelle = libelle;
        this.typeLigne = typeLigne;
        this.baseCalcul = baseCalcul;
        this.taux = taux;
        this.montant = montant;
        this.partPatronale = partPatronale;
        this.ordre = ordre;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Bulletin getBulletin() { return bulletin; }
    public void setBulletin(Bulletin bulletin) { this.bulletin = bulletin; }

    public RubriquePaie getRubriquePaie() { return rubriquePaie; }
    public void setRubriquePaie(RubriquePaie rubriquePaie) { this.rubriquePaie = rubriquePaie; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getTypeLigne() { return typeLigne; }
    public void setTypeLigne(String typeLigne) { this.typeLigne = typeLigne; }

    public BigDecimal getBaseCalcul() { return baseCalcul; }
    public void setBaseCalcul(BigDecimal baseCalcul) { this.baseCalcul = baseCalcul; }

    public BigDecimal getTaux() { return taux; }
    public void setTaux(BigDecimal taux) { this.taux = taux; }

    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }

    public BigDecimal getPartPatronale() { return partPatronale; }
    public void setPartPatronale(BigDecimal partPatronale) { this.partPatronale = partPatronale; }

    public Integer getOrdre() { return ordre; }
    public void setOrdre(Integer ordre) { this.ordre = ordre; }

    public static BulletinLineBuilder builder() {
        return new BulletinLineBuilder();
    }

    public static class BulletinLineBuilder {
        private Long id;
        private Bulletin bulletin;
        private RubriquePaie rubriquePaie;
        private String code;
        private String libelle;
        private String typeLigne;
        private BigDecimal baseCalcul;
        private BigDecimal taux;
        private BigDecimal montant;
        private BigDecimal partPatronale;
        private Integer ordre;

        public BulletinLineBuilder id(Long id) { this.id = id; return this; }
        public BulletinLineBuilder bulletin(Bulletin bulletin) { this.bulletin = bulletin; return this; }
        public BulletinLineBuilder rubriquePaie(RubriquePaie rubriquePaie) { this.rubriquePaie = rubriquePaie; return this; }
        public BulletinLineBuilder code(String code) { this.code = code; return this; }
        public BulletinLineBuilder libelle(String libelle) { this.libelle = libelle; return this; }
        public BulletinLineBuilder typeLigne(String typeLigne) { this.typeLigne = typeLigne; return this; }
        public BulletinLineBuilder baseCalcul(BigDecimal baseCalcul) { this.baseCalcul = baseCalcul; return this; }
        public BulletinLineBuilder taux(BigDecimal taux) { this.taux = taux; return this; }
        public BulletinLineBuilder montant(BigDecimal montant) { this.montant = montant; return this; }
        public BulletinLineBuilder partPatronale(BigDecimal partPatronale) { this.partPatronale = partPatronale; return this; }
        public BulletinLineBuilder ordre(Integer ordre) { this.ordre = ordre; return this; }

        public BulletinLine build() {
            return new BulletinLine(id, bulletin, rubriquePaie, code, libelle, typeLigne, baseCalcul, taux, montant, partPatronale, ordre);
        }
    }
}
