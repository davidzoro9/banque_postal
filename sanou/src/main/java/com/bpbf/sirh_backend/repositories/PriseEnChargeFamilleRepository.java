package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.PriseEnChargeFamille;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriseEnChargeFamilleRepository extends JpaRepository<PriseEnChargeFamille, Long> {
    @Query("SELECT p FROM PriseEnChargeFamille p WHERE p.employee.id = :employeeId")
    List<PriseEnChargeFamille> findByEmployeeId(@Param("employeeId") Long employeeId);
}
