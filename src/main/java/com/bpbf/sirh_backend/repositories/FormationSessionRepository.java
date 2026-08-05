package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.FormationSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormationSessionRepository extends JpaRepository<FormationSession, Long> {
}
