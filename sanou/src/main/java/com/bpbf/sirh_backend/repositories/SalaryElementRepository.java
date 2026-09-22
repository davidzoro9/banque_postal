package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.SalaryElement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryElementRepository extends JpaRepository<SalaryElement, Long> {
    Optional<SalaryElement> findByCode(String code);
    boolean existsByCode(String code);
    List<SalaryElement> findBySalaryCategoryId(Long categoryId);
    List<SalaryElement> findByStatut(String statut);
}
