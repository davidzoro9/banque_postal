package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.IndemniteEmploye;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface IndemniteEmployeRepository extends JpaRepository<IndemniteEmploye, Long> {
    List<IndemniteEmploye> findByEmployeeId(Long employeeId);
    Optional<IndemniteEmploye> findByEmployeeIdAndParametrageIndemniteId(Long employeeId, Long parametrageId);
    void deleteByEmployeeId(Long employeeId);
}
