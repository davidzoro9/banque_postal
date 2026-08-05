package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Fonction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FonctionRepository extends JpaRepository<Fonction, Long> {
}
