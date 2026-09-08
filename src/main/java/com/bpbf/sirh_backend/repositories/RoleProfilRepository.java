package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.RoleProfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleProfilRepository extends JpaRepository<RoleProfil, Long> {
    Optional<RoleProfil> findByCode(String code);
    boolean existsByCode(String code);
}
