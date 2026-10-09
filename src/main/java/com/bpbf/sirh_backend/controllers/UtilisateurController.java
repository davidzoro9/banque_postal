package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.auth.AuthResponseDto;
import com.bpbf.sirh_backend.entities.Utilisateur;
import com.bpbf.sirh_backend.repositories.UtilisateurRepository;
import com.bpbf.sirh_backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
@Slf4j
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/all")
    public ResponseEntity<List<Utilisateur>> getAll() {
        return ResponseEntity.ok(utilisateurRepository.findAll());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody Map<String, String> credentials) {
        String login = credentials != null ? credentials.get("email") : null;
        if (login == null && credentials != null) {
            login = credentials.get("username");
        }
        String password = credentials != null ? credentials.get("password") : null;

        if (login == null || login.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Identifiant et mot de passe requis");
        }

        String trimmedLogin = login.trim();

        // Recherche par email ou username (insensible à la casse)
        Optional<Utilisateur> existing = utilisateurRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(trimmedLogin, trimmedLogin);

        if (existing.isPresent()) {
            Utilisateur u = existing.get();
            if (!u.isActif()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ce compte utilisateur est désactivé.");
            }

            boolean passwordMatches = false;
            // 1. Vérification par BCrypt
            if (u.getPassword() != null && u.getPassword().startsWith("$2a$")) {
                passwordMatches = passwordEncoder.matches(password, u.getPassword());
            } else if (u.getPassword() != null && u.getPassword().equals(password)) {
                // 2. Migration automatique transparente des anciens mots de passe en clair vers BCrypt
                passwordMatches = true;
                u.setPassword(passwordEncoder.encode(password));
                utilisateurRepository.save(u);
                log.info("Migration automatique du mot de passe vers BCrypt pour l'utilisateur '{}'.", u.getUsername());
            }

            if (!passwordMatches) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiant ou mot de passe incorrect.");
            }

            // Génération du jeton JWT sécurisé
            String token = jwtTokenProvider.generateToken(u.getUsername(), u.getRole(), u.getId());

            AuthResponseDto responseDto = AuthResponseDto.builder()
                    .token(token)
                    .type("Bearer")
                    .id(u.getId())
                    .username(u.getUsername())
                    .nom(u.getNom())
                    .prenom(u.getPrenom())
                    .email(u.getEmail())
                    .role(u.getRole() != null ? u.getRole() : "EMPLOYE")
                    .actif(u.isActif())
                    .build();

            return ResponseEntity.ok(responseDto);
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiant ou mot de passe incorrect.");
    }

    @PostMapping("/create")
    public ResponseEntity<Utilisateur> create(@RequestBody Utilisateur user) {
        user.setId(null);
        if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword().trim()));
        } else {
            user.setPassword(passwordEncoder.encode("changeMe123!"));
        }
        Utilisateur saved = utilisateurRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> update(@PathVariable Long id, @RequestBody Utilisateur user) {
        Utilisateur existing = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        existing.setUsername(user.getUsername());
        existing.setNom(user.getNom());
        existing.setPrenom(user.getPrenom());
        existing.setEmail(user.getEmail());
        existing.setRole(user.getRole());
        existing.setActif(user.isActif());

        if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(user.getPassword().trim()));
        }

        Utilisateur updated = utilisateurRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Map<String, String>> updatePassword(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Utilisateur existing = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        String newPassword = payload.get("password");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nouveau mot de passe ne peut pas être vide.");
        }

        existing.setPassword(passwordEncoder.encode(newPassword.trim()));
        utilisateurRepository.save(existing);

        return ResponseEntity.ok(Map.of("message", "Mot de passe mis à jour avec succès."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        utilisateurRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
