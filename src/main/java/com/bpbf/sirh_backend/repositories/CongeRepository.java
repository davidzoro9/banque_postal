package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Conge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CongeRepository extends JpaRepository<Conge, Long> {
    
    @Query("SELECT c FROM Conge c LEFT JOIN FETCH c.employee LEFT JOIN FETCH c.typeAbsenceConge LEFT JOIN FETCH c.interimaire ORDER BY c.id DESC")
    List<Conge> findAllWithDetails();

    @Query("SELECT c FROM Conge c LEFT JOIN FETCH c.employee LEFT JOIN FETCH c.typeAbsenceConge LEFT JOIN FETCH c.interimaire WHERE c.employee.id = :empId ORDER BY c.id DESC")
    List<Conge> findByEmployeeId(@Param("empId") Long empId);

    @Query("SELECT c FROM Conge c LEFT JOIN FETCH c.employee LEFT JOIN FETCH c.typeAbsenceConge LEFT JOIN FETCH c.interimaire WHERE c.interimaire.id = :interimaireId ORDER BY c.id DESC")
    List<Conge> findByInterimaireId(@Param("interimaireId") Long interimaireId);

    List<Conge> findByStatut(String statut);

    long countByStatutIgnoreCase(String statut);

    @Query("SELECT COUNT(c) FROM Conge c WHERE UPPER(c.statut) LIKE '%EN_ATTENTE%' OR UPPER(c.statut) = 'SOUMIS'")
    long countPendingConges();
}
