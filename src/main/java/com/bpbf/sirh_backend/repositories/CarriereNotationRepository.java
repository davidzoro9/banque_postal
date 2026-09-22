package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.CarriereNotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarriereNotationRepository extends JpaRepository<CarriereNotation, Long> {
    List<CarriereNotation> findByExercice(Integer exercice);
    List<CarriereNotation> findByEmployeeId(Long employeeId);
    List<CarriereNotation> findByEmployeeIdOrderByExerciceDesc(Long employeeId);
}
