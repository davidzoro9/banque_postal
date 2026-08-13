package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.InformationSalariale;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InformationSalarialeRepository extends JpaRepository<InformationSalariale, Long> {
    Optional<InformationSalariale> findByEmployeeId(Long employeeId);
    void deleteByEmployeeId(Long employeeId);
}
