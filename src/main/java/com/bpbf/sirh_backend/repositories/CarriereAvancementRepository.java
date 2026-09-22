package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.CarriereAvancement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarriereAvancementRepository extends JpaRepository<CarriereAvancement, Long> {
    List<CarriereAvancement> findByExercice(Integer exercice);
    List<CarriereAvancement> findByEmployeeId(Long employeeId);
    List<CarriereAvancement> findByStatut(String statut);
    Optional<CarriereAvancement> findByEmployeeIdAndExercice(Long employeeId, Integer exercice);
}
