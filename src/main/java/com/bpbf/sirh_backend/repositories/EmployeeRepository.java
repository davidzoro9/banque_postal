package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByMatricule(String matricule);
    boolean existsByMatricule(String matricule);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(e) FROM Employee e WHERE e.statut IS NULL OR LOWER(TRIM(e.statut)) NOT IN ('inactif', 'détaché', 'detache', 'archivé', 'archive', 'demissionnaire', 'radie')")
    long countActiveEmployees();
}
