package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Absence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AbsenceRepository extends JpaRepository<Absence, Long> {
}
