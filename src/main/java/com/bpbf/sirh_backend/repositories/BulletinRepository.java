package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Bulletin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BulletinRepository extends JpaRepository<Bulletin, Long> {

    List<Bulletin> findBySessionPaieId(Long sessionPaieId);

    List<Bulletin> findByEmployeeIdOrderByDateCalculDesc(Long employeeId);

    Optional<Bulletin> findBySessionPaieIdAndEmployeeId(Long sessionPaieId, Long employeeId);

    Optional<Bulletin> findByCode(String code);

    long countBySessionPaieId(Long sessionPaieId);

    long countBySessionPaieIdAndStatut(Long sessionPaieId, String statut);

    @Query("SELECT b FROM Bulletin b LEFT JOIN FETCH b.lines WHERE b.id = :id")
    Optional<Bulletin> findByIdWithLines(@Param("id") Long id);
}
