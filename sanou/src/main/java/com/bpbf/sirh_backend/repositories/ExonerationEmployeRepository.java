package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ExonerationEmploye;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ExonerationEmployeRepository extends JpaRepository<ExonerationEmploye, Long> {
    List<ExonerationEmploye> findByEmployeeId(Long employeeId);
    Optional<ExonerationEmploye> findByIndemniteEmployeId(Long indemniteEmployeId);
    void deleteByIndemniteEmployeId(Long indemniteEmployeId);
    void deleteByEmployeeId(Long employeeId);
}
