package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Competence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetenceRepository extends JpaRepository<Competence, Long> {
}
