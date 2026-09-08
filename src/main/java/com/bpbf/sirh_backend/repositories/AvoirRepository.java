package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Avoir;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvoirRepository extends JpaRepository<Avoir, Long> {
    List<Avoir> findByEmployeeId(Long employeeId);
    List<Avoir> findByEmployeeIdAndStatut(Long employeeId, String statut);
    List<Avoir> findByStatut(String statut);
    void deleteByEmployeeId(Long employeeId);
}
