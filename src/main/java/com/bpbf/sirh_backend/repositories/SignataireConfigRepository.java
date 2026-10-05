package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.SignataireConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SignataireConfigRepository extends JpaRepository<SignataireConfig, Long> {
    Optional<SignataireConfig> findByCode(String code);
}
