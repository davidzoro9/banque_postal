package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.GenericRefData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenericRefDataRepository extends JpaRepository<GenericRefData, Long> {
    List<GenericRefData> findByType(String type);
    Optional<GenericRefData> findByTypeAndCode(String type, String code);
}
