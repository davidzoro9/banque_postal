package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.SalaryElement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryElementRepository extends JpaRepository<SalaryElement, Long> {
    Optional<SalaryElement> findByCode(String code);
    Optional<SalaryElement> findByCodeIgnoreCase(String code);
    Optional<SalaryElement> findByCodeCorrespondantIgnoreCase(String codeCorrespondant);
    List<SalaryElement> findByCodeCorrespondant(String codeCorrespondant);
    boolean existsByCode(String code);
    boolean existsByCodeIgnoreCase(String code);
    List<SalaryElement> findBySalaryCategoryId(Long categoryId);
    List<SalaryElement> findByStatut(String statut);
}
