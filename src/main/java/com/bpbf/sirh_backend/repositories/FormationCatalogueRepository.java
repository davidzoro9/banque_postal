package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.FormationCatalogue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormationCatalogueRepository extends JpaRepository<FormationCatalogue, Long> {
}
