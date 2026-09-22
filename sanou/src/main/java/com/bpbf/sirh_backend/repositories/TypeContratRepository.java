package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.TypeContrat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeContratRepository extends JpaRepository<TypeContrat, Long> {
}
