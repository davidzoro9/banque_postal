package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.TypeRetenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TypeRetenueRepository extends JpaRepository<TypeRetenue, Long> {
    Optional<TypeRetenue> findByCode(String code);
    boolean existsByCode(String code);
}
