package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.RubriquePaie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RubriquePaieRepository extends JpaRepository<RubriquePaie, Long> {
    List<RubriquePaie> findAllByOrderByOrdreAsc();
    List<RubriquePaie> findByActifTrueOrderByOrdreAsc();
    Optional<RubriquePaie> findByCodeRubrique(String codeRubrique);
}
