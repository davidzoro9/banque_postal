package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.InformationSalarialeRetenue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InformationSalarialeRetenueRepository extends JpaRepository<InformationSalarialeRetenue, Long> {
    List<InformationSalarialeRetenue> findByInformationSalarialeIdOrderByLibelleAsc(Long informationSalarialeId);
    void deleteByInformationSalarialeId(Long informationSalarialeId);
}
