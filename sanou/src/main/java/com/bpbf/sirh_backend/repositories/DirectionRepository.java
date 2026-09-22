package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Direction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DirectionRepository extends JpaRepository<Direction, Long> {
    Optional<Direction> findByCode(String code);
    Optional<Direction> findByNameIgnoreCase(String name);
    boolean existsByCode(String code);
}
