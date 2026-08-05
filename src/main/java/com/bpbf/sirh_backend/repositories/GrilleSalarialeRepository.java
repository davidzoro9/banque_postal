package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.GrilleSalariale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrilleSalarialeRepository extends JpaRepository<GrilleSalariale, Long> {

}
