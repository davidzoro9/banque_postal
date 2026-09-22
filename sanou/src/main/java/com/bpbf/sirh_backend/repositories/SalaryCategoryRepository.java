package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.SalaryCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalaryCategoryRepository extends JpaRepository<SalaryCategory, Long> {
    Optional<SalaryCategory> findByCode(String code);
    boolean existsByCode(String code);
}
