package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Emploi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmploiRepository extends JpaRepository<Emploi, Long> {
}
