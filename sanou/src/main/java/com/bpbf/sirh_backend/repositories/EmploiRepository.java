package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Emploi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmploiRepository extends JpaRepository<Emploi, Long> {
    Optional<Emploi> findByCode(String code);
    Optional<Emploi> findByNameIgnoreCase(String name);
    List<Emploi> findAllByOrderByOrdreAscIdAsc();
}
