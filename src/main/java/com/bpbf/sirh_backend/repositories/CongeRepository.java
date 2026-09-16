package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Conge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CongeRepository extends JpaRepository<Conge, Long> {
    
    @Query("SELECT c FROM Conge c LEFT JOIN FETCH c.employee LEFT JOIN FETCH c.typeAbsenceConge ORDER BY c.id DESC")
    List<Conge> findAllWithDetails();

    @Query("SELECT c FROM Conge c LEFT JOIN FETCH c.employee LEFT JOIN FETCH c.typeAbsenceConge WHERE c.employee.id = :empId ORDER BY c.id DESC")
    List<Conge> findByEmployeeId(@Param("empId") Long empId);

    List<Conge> findByStatut(String statut);

    long countByStatutIgnoreCase(String statut);

    @Query("SELECT COUNT(c) FROM Conge c WHERE LOWER(TRIM(c.statut)) = 'en_attente' OR LOWER(TRIM(c.statut)) = 'en attente'")
    long countPendingConges();
}
