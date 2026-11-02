package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ParamTrancheLicenciement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParamTrancheLicenciementRepository extends JpaRepository<ParamTrancheLicenciement, Long> {
    List<ParamTrancheLicenciement> findByActifTrueOrderByOrdreAscAnneeDebutAsc();
    List<ParamTrancheLicenciement> findAllByOrderByOrdreAscAnneeDebutAsc();
    Optional<ParamTrancheLicenciement> findByCode(String code);
    boolean existsByCode(String code);
}

