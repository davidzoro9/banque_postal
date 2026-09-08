package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.TypeAbsenceConge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TypeAbsenceCongeRepository extends JpaRepository<TypeAbsenceConge, Long> {
    Optional<TypeAbsenceConge> findByCode(String code);
}
