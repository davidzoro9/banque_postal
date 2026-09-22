package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.CarriereReclassement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarriereReclassementRepository extends JpaRepository<CarriereReclassement, Long> {
    List<CarriereReclassement> findByEmployeeId(Long employeeId);
    List<CarriereReclassement> findByStatut(String statut);
    List<CarriereReclassement> findAllByOrderByDateDemandeDesc();
}
