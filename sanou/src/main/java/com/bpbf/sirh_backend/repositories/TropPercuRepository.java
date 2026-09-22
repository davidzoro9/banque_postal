package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.TropPercu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TropPercuRepository extends JpaRepository<TropPercu, Long> {
    List<TropPercu> findByEmployeeId(Long employeeId);
    List<TropPercu> findByMoisApplication(String moisApplication);
    List<TropPercu> findByStatut(String statut);
    List<TropPercu> findByEmployeeIdAndStatut(Long employeeId, String statut);
    List<TropPercu> findAllByOrderByDateCreationDesc();
}
