package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Contrat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContratRepository extends JpaRepository<Contrat, Long> {
    java.util.List<Contrat> findByEmployeeId(Long employeeId);
    java.util.Optional<Contrat> findFirstByEmployeeIdOrderByIdDesc(Long employeeId);
}
