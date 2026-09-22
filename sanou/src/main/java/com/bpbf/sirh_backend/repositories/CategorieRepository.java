package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {
}
