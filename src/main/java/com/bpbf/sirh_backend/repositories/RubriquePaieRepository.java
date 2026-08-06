package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.RubriquePaie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RubriquePaieRepository extends JpaRepository<RubriquePaie, Long> {
}
