package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ClasseComptable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClasseComptableRepository extends JpaRepository<ClasseComptable, Long> {
    List<ClasseComptable> findAllByOrderByOrdreAsc();
    List<ClasseComptable> findByActifTrueOrderByOrdreAsc();
    Optional<ClasseComptable> findByCode(String code);
}
