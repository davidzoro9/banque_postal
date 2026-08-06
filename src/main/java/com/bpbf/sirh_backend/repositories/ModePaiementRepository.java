package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ModePaiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModePaiementRepository extends JpaRepository<ModePaiement, Long> {
}
