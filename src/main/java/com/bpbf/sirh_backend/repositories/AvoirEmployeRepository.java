package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.AvoirEmploye;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvoirEmployeRepository extends JpaRepository<AvoirEmploye, Long> {

    List<AvoirEmploye> findByEmployeeId(Long employeeId);

    List<AvoirEmploye> findByEmployeeIdAndStatut(Long employeeId, String statut);

    List<AvoirEmploye> findByStatut(String statut);
}
