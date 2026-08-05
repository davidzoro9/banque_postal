package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.MobiliteDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MobiliteDemandeRepository extends JpaRepository<MobiliteDemande, Long> {
    List<MobiliteDemande> findAllByOrderByIdDesc();
}
