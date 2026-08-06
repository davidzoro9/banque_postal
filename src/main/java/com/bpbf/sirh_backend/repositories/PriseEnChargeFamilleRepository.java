package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.PriseEnChargeFamille;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriseEnChargeFamilleRepository extends JpaRepository<PriseEnChargeFamille, Long> {
    List<PriseEnChargeFamille> findByEmployeeId(Long employeeId);
}
