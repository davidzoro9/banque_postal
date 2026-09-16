package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Contrat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratRepository extends JpaRepository<Contrat, Long> {
    java.util.List<Contrat> findByEmployeeId(Long employeeId);
    java.util.Optional<Contrat> findFirstByEmployeeIdOrderByIdDesc(Long employeeId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(c) FROM Contrat c WHERE LOWER(TRIM(c.statut)) = 'en attente' OR LOWER(TRIM(c.statut)) = 'en_attente' OR LOWER(TRIM(c.statut)) = 'a renouveler' OR LOWER(TRIM(c.statut)) = 'à renouveler'")
    long countContratsEnAttente();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(c) FROM Contrat c WHERE c.statut IS NULL OR LOWER(TRIM(c.statut)) NOT IN ('terminé', 'termine', 'rompu', 'résilié', 'resilie')")
    long countContratsActifs();
}
