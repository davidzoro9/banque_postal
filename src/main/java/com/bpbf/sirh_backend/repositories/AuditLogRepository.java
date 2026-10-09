package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findTop100ByOrderByDateHeureDesc();

    Page<AuditLog> findAllByOrderByDateHeureDesc(Pageable pageable);

    List<AuditLog> findByActionOrderByDateHeureDesc(String action);

    List<AuditLog> findByUtilisateurOrderByDateHeureDesc(String utilisateur);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:utilisateur IS NULL OR LOWER(a.utilisateur) LIKE LOWER(CONCAT('%', CAST(:utilisateur AS string), '%'))) AND " +
           "(:dateDebut IS NULL OR a.dateHeure >= :dateDebut) AND " +
           "(:dateFin IS NULL OR a.dateHeure <= :dateFin) " +
           "ORDER BY a.dateHeure DESC")
    Page<AuditLog> searchAuditLogs(
            @Param("action") String action,
            @Param("utilisateur") String utilisateur,
            @Param("dateDebut") LocalDateTime dateDebut,
            @Param("dateFin") LocalDateTime dateFin,
            Pageable pageable);
}
