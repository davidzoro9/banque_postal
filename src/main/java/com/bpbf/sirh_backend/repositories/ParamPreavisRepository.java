package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ParamPreavis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParamPreavisRepository extends JpaRepository<ParamPreavis, Long> {

    List<ParamPreavis> findAllByOrderByOrdreAsc();

    List<ParamPreavis> findByActifTrueOrderByOrdreAsc();

    Optional<ParamPreavis> findByCode(String code);

    Optional<ParamPreavis> findFirstByTypePersonnelAndActifTrue(String typePersonnel);
}

