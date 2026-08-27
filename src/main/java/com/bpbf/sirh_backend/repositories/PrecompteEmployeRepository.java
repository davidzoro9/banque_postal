package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.PrecompteEmploye;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrecompteEmployeRepository extends JpaRepository<PrecompteEmploye, Long> {

    List<PrecompteEmploye> findByEmployeeId(Long employeeId);

    List<PrecompteEmploye> findByEmployeeIdAndStatut(Long employeeId, String statut);

    List<PrecompteEmploye> findByStatut(String statut);
}
