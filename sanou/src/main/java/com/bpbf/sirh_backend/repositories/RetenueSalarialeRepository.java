package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.RetenueSalariale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetenueSalarialeRepository extends JpaRepository<RetenueSalariale, Long> {
    @Query("SELECT r FROM RetenueSalariale r WHERE r.employee.id = :employeeId")
    List<RetenueSalariale> findByEmployeeId(@Param("employeeId") Long employeeId);
}
