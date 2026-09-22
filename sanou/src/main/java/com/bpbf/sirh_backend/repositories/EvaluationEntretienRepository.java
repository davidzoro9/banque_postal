package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.EvaluationEntretien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationEntretienRepository extends JpaRepository<EvaluationEntretien, Long> {
    List<EvaluationEntretien> findAllByOrderByIdDesc();
}
