package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Banque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BanqueRepository extends JpaRepository<Banque, Long> {

}

