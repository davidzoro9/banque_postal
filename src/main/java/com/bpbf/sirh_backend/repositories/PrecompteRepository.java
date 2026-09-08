package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Precompte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrecompteRepository extends JpaRepository<Precompte, Long> {
    List<Precompte> findByEmployeeId(Long employeeId);
    List<Precompte> findByEmployeeIdAndStatut(Long employeeId, String statut);
    List<Precompte> findByStatut(String statut);
    void deleteByEmployeeId(Long employeeId);
}
