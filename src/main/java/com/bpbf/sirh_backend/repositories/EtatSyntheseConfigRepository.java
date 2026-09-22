package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.EtatSyntheseConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtatSyntheseConfigRepository extends JpaRepository<EtatSyntheseConfig, Long> {
    List<EtatSyntheseConfig> findAllByOrderByOrdreAsc();
    List<EtatSyntheseConfig> findByActifTrueOrderByOrdreAsc();
    Optional<EtatSyntheseConfig> findByCode(String code);
    boolean existsByCode(String code);
}
