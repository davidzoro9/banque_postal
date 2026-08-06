package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ExonerationFiscale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExonerationFiscaleRepository extends JpaRepository<ExonerationFiscale, Long> {
}
