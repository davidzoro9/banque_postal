package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Retenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RetenueRepository extends JpaRepository<Retenue, Long> {
    @Query("select r from Retenue r where r.actif = true and r.regimeSecuriteSocial is null order by r.libelle")
    List<Retenue> findGeneralRetenues();

    @Query("select r from Retenue r where r.actif = true and " +
            "(r.regimeSecuriteSocial is null or r.regimeSecuriteSocial.id = :regimeId) order by r.libelle")
    List<Retenue> findApplicable(@Param("regimeId") Long regimeId);
}
