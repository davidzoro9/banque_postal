package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.BulletinLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BulletinLotRepository extends JpaRepository<BulletinLot, Long> {
    List<BulletinLot> findByStatut(String statut);
    List<BulletinLot> findByTypeSession(String typeSession);
}
