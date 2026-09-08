package com.bpbf.sirh_backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "retenue")
public class Retenue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;
    private String libelle;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_retenue_id")
    private TypeRetenue typeRetenue;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "regime_securite_social_id")
    private RegimeSecuriteSocial regimeSecuriteSocial;

    private Double taux;

    @Enumerated(EnumType.STRING)
    @Column(name = "base_calcul", nullable = false, length = 50)
    private BaseCalculRetenue baseCalcul = BaseCalculRetenue.REMUNERATION_BRUTE;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Boolean actif = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public TypeRetenue getTypeRetenue() { return typeRetenue; }
    public void setTypeRetenue(TypeRetenue typeRetenue) { this.typeRetenue = typeRetenue; }

    public RegimeSecuriteSocial getRegimeSecuriteSocial() { return regimeSecuriteSocial; }
    public void setRegimeSecuriteSocial(RegimeSecuriteSocial regimeSecuriteSocial) { this.regimeSecuriteSocial = regimeSecuriteSocial; }

    public Double getTaux() { return taux; }
    public void setTaux(Double taux) { this.taux = taux; }

    public BaseCalculRetenue getBaseCalcul() { return baseCalcul; }
    public void setBaseCalcul(BaseCalculRetenue baseCalcul) { this.baseCalcul = baseCalcul; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}

