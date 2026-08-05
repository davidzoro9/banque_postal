package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Contrat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratRepository extends JpaRepository<Contrat, Long> {
}
