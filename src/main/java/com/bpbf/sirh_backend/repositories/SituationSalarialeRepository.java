package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.SituationSalariale;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SituationSalarialeRepository extends JpaRepository<SituationSalariale, Long> {
    Optional<SituationSalariale> findByEmployeeId(Long employeeId);
    void deleteByEmployeeId(Long employeeId);
}
