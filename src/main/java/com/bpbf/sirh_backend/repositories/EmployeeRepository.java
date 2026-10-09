package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Employee;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByMatricule(String matricule);
    Optional<Employee> findByMatriculeIgnoreCase(String matricule);
    boolean existsByMatricule(String matricule);

    @EntityGraph(attributePaths = {
            "fonction", "emploi", "department", "direction", "service",
            "agence", "regimeSecuriteSocial", "superviseur", "grilleSalariale",
            "categorieObj", "echelonObj", "gradeObj"
    })
    @Query("SELECT e FROM Employee e ORDER BY e.id ASC")
    List<Employee> findAllWithRelations();

    @EntityGraph(attributePaths = {
            "fonction", "emploi", "department", "direction", "service",
            "agence", "regimeSecuriteSocial", "superviseur", "grilleSalariale",
            "categorieObj", "echelonObj", "gradeObj"
    })
    @Query("SELECT e FROM Employee e WHERE e.id = :id")
    Optional<Employee> findByIdWithRelations(@Param("id") Long id);

    @EntityGraph(attributePaths = {
            "fonction", "emploi", "department", "direction", "service",
            "agence", "regimeSecuriteSocial", "superviseur", "grilleSalariale",
            "categorieObj", "echelonObj", "gradeObj"
    })
    @Query("SELECT e FROM Employee e WHERE LOWER(e.matricule) = LOWER(:matricule)")
    Optional<Employee> findByMatriculeWithRelations(@Param("matricule") String matricule);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.statut IS NULL OR LOWER(TRIM(e.statut)) NOT IN ('inactif', 'détaché', 'detache', 'archivé', 'archive', 'demissionnaire', 'radie')")
    long countActiveEmployees();
}

