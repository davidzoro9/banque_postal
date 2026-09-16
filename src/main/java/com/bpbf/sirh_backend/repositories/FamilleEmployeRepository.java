package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.FamilleEmploye;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FamilleEmployeRepository extends JpaRepository<FamilleEmploye, Long> {
    List<FamilleEmploye> findByEmployeeId(Long employeeId);
    List<FamilleEmploye> findByEmployeeIdOrderByNomAscPrenomAsc(Long employeeId);
    long countByEmployeeIdAndEstChargeTrue(Long employeeId);
    void deleteByEmployeeId(Long employeeId);
}
