package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.BaremeIUTS;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BaremeIUTSRepository extends JpaRepository<BaremeIUTS, Long> {
}
