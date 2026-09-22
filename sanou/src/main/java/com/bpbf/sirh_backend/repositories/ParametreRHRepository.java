package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ParametreRH;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ParametreRHRepository extends JpaRepository<ParametreRH, Long> {
    List<ParametreRH> findByType(String type);
}
