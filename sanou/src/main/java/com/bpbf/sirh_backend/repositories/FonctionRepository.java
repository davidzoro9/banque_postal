package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Fonction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FonctionRepository extends JpaRepository<Fonction, Long> {
    Optional<Fonction> findByCode(String code);
    Optional<Fonction> findByNameIgnoreCase(String name);
    List<Fonction> findAllByOrderByOrdreAscIdAsc();
}
