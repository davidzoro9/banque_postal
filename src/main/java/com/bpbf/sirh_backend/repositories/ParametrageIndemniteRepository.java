package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParametrageIndemniteRepository extends JpaRepository<ParametrageIndemnite, Long> {
    /**
     * Tableau 2 : Indemnités de Nomination managériale (Directeur, Responsable, Chef de service, Chef d'agence).
     */
    @Query("""
        select p from ParametrageIndemnite p
        where p.actif = true and p.typeIndemniteObj is not null
          and (p.regleType = 'NOMINATION' or (p.fonctionObj is not null and p.gradeObj is null and p.emploiObj is null))
          and p.fonctionObj.id = :fonctionId
        """)
    List<ParametrageIndemnite> findNominationByFonction(@Param("fonctionId") Long fonctionId);

    /**
     * Tableau 3 : Primes et indemnités spécifiques d'emploi opérationnel (Caissier, Cash point, Chauffeur, etc.).
     */
    @Query("""
        select p from ParametrageIndemnite p
        where p.actif = true and p.typeIndemniteObj is not null
          and (p.emploiObj.id = :emploiId or p.fonctionObj.id = :fonctionId)
        """)
    List<ParametrageIndemnite> findSpecifiqueByEmploiOrFonction(@Param("emploiId") Long emploiId,
                                                               @Param("fonctionId") Long fonctionId);

    /**
     * Tableau 1 : Indemnités Statutaires liées au Grade / Catégorie (Logement, Transport, Sujétion).
     */
    @Query("""
        select p from ParametrageIndemnite p
        where p.actif = true and p.typeIndemniteObj is not null
          and (p.gradeObj.id = :gradeId or p.categorieObj.id = :categorieId)
        """)
    List<ParametrageIndemnite> findStatutairesByGradeAndCategorie(@Param("gradeId") Long gradeId,
                                                                @Param("categorieId") Long categorieId);

    List<ParametrageIndemnite> findByFonctionObjIdAndActifTrue(Long fonctionId);
    List<ParametrageIndemnite> findByEmploiObjIdAndActifTrue(Long emploiId);
    List<ParametrageIndemnite> findByGradeObjIdAndActifTrue(Long gradeId);
    List<ParametrageIndemnite> findByCategorieObjIdAndActifTrue(Long categorieId);

    boolean existsByCode(String code);
}
