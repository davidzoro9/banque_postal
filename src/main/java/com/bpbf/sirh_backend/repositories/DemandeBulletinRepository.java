package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.DemandeBulletin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeBulletinRepository extends JpaRepository<DemandeBulletin, Long> {
    List<DemandeBulletin> findByEmployeeIdOrderByDateDemandeDesc(Long employeeId);
    List<DemandeBulletin> findAllByOrderByDateDemandeDesc();
    long countByStatut(String statut);
}
