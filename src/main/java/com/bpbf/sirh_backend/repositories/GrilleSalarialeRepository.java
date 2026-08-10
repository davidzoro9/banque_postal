package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.GrilleSalariale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrilleSalarialeRepository extends JpaRepository<GrilleSalariale, Long> {
    List<GrilleSalariale> findByGradeObjId(Long gradeId);
    Optional<GrilleSalariale> findByCategorieObjIdAndEchelonObjId(Long categorieId, Long echelonId);
    Optional<GrilleSalariale> findByGradeObjIdAndCategorieObjIdAndEchelonObjId(Long gradeId, Long categorieId, Long echelonId);
}

