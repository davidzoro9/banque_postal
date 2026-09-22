package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Agence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgenceRepository extends JpaRepository<Agence, Long> {
}
