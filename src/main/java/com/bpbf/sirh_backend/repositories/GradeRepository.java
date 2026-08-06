package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeRepository extends JpaRepository<Grade, Long> {
}
