package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.JourFerie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JourFerieRepository extends JpaRepository<JourFerie, Long> {
    Optional<JourFerie> findByDate(String date);
    List<JourFerie> findAllByOrderByDateAsc();
    List<JourFerie> findByDateStartingWithOrderByDateAsc(String year);
}
