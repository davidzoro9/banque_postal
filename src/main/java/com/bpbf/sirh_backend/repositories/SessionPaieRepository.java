package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.SessionPaie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SessionPaieRepository extends JpaRepository<SessionPaie, Long> {
    Optional<SessionPaie> findByMoisAndAnnee(String mois, Integer annee);
    Optional<SessionPaie> findByCodeSession(String codeSession);
    List<SessionPaie> findAllByOrderByAnneeDescMoisDesc();
    Optional<SessionPaie> findTopByOrderByAnneeDescMoisDesc();
    Optional<SessionPaie> findTopByOrderByDateCreationDesc();
}

