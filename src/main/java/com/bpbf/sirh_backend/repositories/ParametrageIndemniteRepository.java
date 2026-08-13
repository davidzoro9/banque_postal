package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ParametrageIndemnite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParametrageIndemniteRepository extends JpaRepository<ParametrageIndemnite, Long> {
    @Query("""
        select p from ParametrageIndemnite p
        where p.actif = true and p.typeIndemniteObj is not null
          and (p.fonctionObj is null or (:fonctionId is not null and p.fonctionObj.id = :fonctionId))
          and (p.gradeObj is null or (:gradeId is not null and p.gradeObj.id = :gradeId))
          and (p.categorieObj is null or (:categorieId is not null and p.categorieObj.id = :categorieId))
        """)
    List<ParametrageIndemnite> findApplicable(@Param("fonctionId") Long fonctionId,
                                               @Param("gradeId") Long gradeId,
                                               @Param("categorieId") Long categorieId);
}
