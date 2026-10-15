package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.SensEcritureComptable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SensEcritureRepository extends JpaRepository<SensEcritureComptable, Long> {
    List<SensEcritureComptable> findAllByOrderByOrdreAsc();
    List<SensEcritureComptable> findByActifTrueOrderByOrdreAsc();
    Optional<SensEcritureComptable> findByCode(String code);
}
