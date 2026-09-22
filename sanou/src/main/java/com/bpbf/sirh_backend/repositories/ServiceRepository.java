package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    Optional<Service> findByCode(String code);
    Optional<Service> findByNameIgnoreCase(String name);
    boolean existsByCode(String code);
}
