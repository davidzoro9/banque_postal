package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
	Optional<Department> findById(Long id);
	Optional<Department> findByCode(String code);
	Optional<Department> findByNameIgnoreCase(String name);
	boolean existsByCode(String code);
}
