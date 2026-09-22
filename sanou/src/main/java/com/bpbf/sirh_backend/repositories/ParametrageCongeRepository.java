package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ParametrageConge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParametrageCongeRepository extends JpaRepository<ParametrageConge, Long> {
}
