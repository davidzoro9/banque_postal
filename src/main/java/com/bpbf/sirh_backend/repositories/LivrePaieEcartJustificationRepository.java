package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.LivrePaieEcartJustification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivrePaieEcartJustificationRepository extends JpaRepository<LivrePaieEcartJustification, Long> {

    List<LivrePaieEcartJustification> findBySessionId(Long sessionId);

    Optional<LivrePaieEcartJustification> findBySessionIdAndCodeRubrique(Long sessionId, String codeRubrique);
}
