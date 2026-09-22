package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Retenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RetenueRepository extends JpaRepository<Retenue, Long> {
    Optional<Retenue> findByCode(String code);
    boolean existsByCode(String code);

    @Query("select r from Retenue r where r.actif = true and r.regimeSecuriteSocial is null order by r.libelle")
    List<Retenue> findGeneralRetenues();

    @Query("select r from Retenue r where r.actif = true and " +
            "(r.regimeSecuriteSocial is null or r.regimeSecuriteSocial.id = :regimeId) order by r.libelle")
    List<Retenue> findApplicable(@Param("regimeId") Long regimeId);
}
