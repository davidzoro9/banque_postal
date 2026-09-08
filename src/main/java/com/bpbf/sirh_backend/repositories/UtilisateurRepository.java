package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    @Query("SELECT u FROM Utilisateur u WHERE (u.email = :login OR u.username = :login) AND u.password = :password AND u.actif = true")
    Optional<Utilisateur> login(@Param("login") String login, @Param("password") String password);

    Optional<Utilisateur> findByEmail(String email);

    long countByRole(String role);
}

