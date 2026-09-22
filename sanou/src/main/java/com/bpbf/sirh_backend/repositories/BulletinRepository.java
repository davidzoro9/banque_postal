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

    List<Bulletin> findByBulletinLotId(Long bulletinLotId);

    List<Bulletin> findByEmployeeIdOrderByDateCalculDesc(Long employeeId);

    List<Bulletin> findByEmployeeId(Long employeeId);

    List<Bulletin> findBySessionPaieIdAndEmployeeId(Long sessionPaieId, Long employeeId);

    Optional<Bulletin> findByCode(String code);

    @Query("SELECT DISTINCT b FROM Bulletin b LEFT JOIN FETCH b.lines WHERE b.id = :id")
    Optional<Bulletin> findByIdWithLines(@Param("id") Long id);

    long countByEmployeeId(Long employeeId);

    long countBySessionPaieId(Long sessionPaieId);

    long countBySessionPaieIdAndStatut(Long sessionPaieId, String statut);

    @Query("SELECT COALESCE(SUM(b.salaireBrut), 0) FROM Bulletin b WHERE b.sessionPaie.id = :sessionPaieId")
    java.math.BigDecimal sumSalaireBrutBySessionPaieId(@Param("sessionPaieId") Long sessionPaieId);

    @Query("SELECT COALESCE(SUM(b.salaireNet), 0) FROM Bulletin b WHERE b.sessionPaie.id = :sessionPaieId")
    java.math.BigDecimal sumSalaireNetBySessionPaieId(@Param("sessionPaieId") Long sessionPaieId);

    @Query("SELECT COALESCE(SUM(b.totalCotisationsPatronales), 0) FROM Bulletin b WHERE b.sessionPaie.id = :sessionPaieId")
    java.math.BigDecimal sumCotisationsPatronalesBySessionPaieId(@Param("sessionPaieId") Long sessionPaieId);

    void deleteByEmployeeId(Long employeeId);
}
