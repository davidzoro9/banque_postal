package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.JournalComptable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JournalComptableRepository extends JpaRepository<JournalComptable, Long> {
    List<JournalComptable> findAllByOrderByOrdreAsc();
    List<JournalComptable> findByActifTrueOrderByOrdreAsc();
    Optional<JournalComptable> findByCode(String code);
}
