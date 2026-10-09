package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.CompteComptable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompteComptableRepository extends JpaRepository<CompteComptable, Long> {
    List<CompteComptable> findAllByOrderByNumeroCompteAsc();
    List<CompteComptable> findByActifTrueOrderByNumeroCompteAsc();
    Optional<CompteComptable> findByNumeroCompte(String numeroCompte);
    Optional<CompteComptable> findByTypeRubriqueAssociee(String typeRubriqueAssociee);
}
