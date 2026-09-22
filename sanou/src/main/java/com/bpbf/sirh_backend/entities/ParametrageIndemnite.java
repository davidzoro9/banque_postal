package com.bpbf.sirh_backend.entities;

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
@Table(name = "parametrage_indemnite")
public class ParametrageIndemnite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_indemnite_id")
    private TypeIndemnite typeIndemniteObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fonction_id")
    private Fonction fonctionObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "grade_id")
    private Grade gradeObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categorie_id")
    private Categorie categorieObj;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "emploi_id")
    private Emploi emploiObj;

    private Double taux;
    private Boolean actif = true;

    @Column(name = "regle_type")
    private String regleType;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public TypeIndemnite getTypeIndemniteObj() { return typeIndemniteObj; }
    public void setTypeIndemniteObj(TypeIndemnite typeIndemniteObj) { this.typeIndemniteObj = typeIndemniteObj; }

    public Fonction getFonctionObj() { return fonctionObj; }
    public void setFonctionObj(Fonction fonctionObj) { this.fonctionObj = fonctionObj; }

    public Grade getGradeObj() { return gradeObj; }
    public void setGradeObj(Grade gradeObj) { this.gradeObj = gradeObj; }

    public Categorie getCategorieObj() { return categorieObj; }
    public void setCategorieObj(Categorie categorieObj) { this.categorieObj = categorieObj; }

    public Emploi getEmploiObj() { return emploiObj; }
    public void setEmploiObj(Emploi emploiObj) { this.emploiObj = emploiObj; }

    public Double getTaux() { return taux; }
    public void setTaux(Double taux) { this.taux = taux; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }

    public String getRegleType() { return regleType; }
    public void setRegleType(String regleType) { this.regleType = regleType; }
}

