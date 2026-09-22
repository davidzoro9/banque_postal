package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.TypeIndemnite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeIndemniteRepository extends JpaRepository<TypeIndemnite, Long> {
}
