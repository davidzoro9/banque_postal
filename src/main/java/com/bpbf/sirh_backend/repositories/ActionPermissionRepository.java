package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.ActionPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActionPermissionRepository extends JpaRepository<ActionPermission, Long> {
    Optional<ActionPermission> findByActionCode(String actionCode);
    List<ActionPermission> findAllByOrderByOrdreAsc();
}
