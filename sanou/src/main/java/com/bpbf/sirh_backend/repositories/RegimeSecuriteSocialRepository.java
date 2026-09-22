package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.RegimeSecuriteSocial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegimeSecuriteSocialRepository extends JpaRepository<RegimeSecuriteSocial, Long> {

	Optional<RegimeSecuriteSocial> findByCodeIgnoreCase(String code);

	boolean existsByCodeIgnoreCase(String code);
}