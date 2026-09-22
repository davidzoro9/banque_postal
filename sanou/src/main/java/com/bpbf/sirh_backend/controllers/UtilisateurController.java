package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.entities.Utilisateur;
import com.bpbf.sirh_backend.repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;

    @GetMapping("/all")
    public List<Utilisateur> getAll() {
        return utilisateurRepository.findAll();
    }

    @PostMapping("/login")
    public Utilisateur login(@RequestBody java.util.Map<String, String> credentials) {
        String login = credentials != null ? credentials.get("email") : null;
        String password = credentials != null ? credentials.get("password") : null;
        
        if (login == null || login.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Identifiant requis");
        }

        String trimmedLogin = login.trim();
        List<Utilisateur> allUsers = utilisateurRepository.findAll();

        // Si la base est totalement vide (premier démarrage), créer un compte Admin par défaut
        if (allUsers.isEmpty()) {
            Utilisateur admin = new Utilisateur();
            String namePart = trimmedLogin.contains("@") ? trimmedLogin.split("@")[0] : trimmedLogin;
            admin.setUsername(namePart);
            admin.setNom("ZOROM");
            admin.setPrenom("David");
            admin.setEmail(trimmedLogin.contains("@") ? trimmedLogin : trimmedLogin + "@entreprise.com");
            admin.setPassword(password != null && !password.isEmpty() ? password : "admin");
            admin.setRole("ADMIN");
            admin.setActif(true);
            return utilisateurRepository.save(admin);
        }

        // Rechercher l'utilisateur par email ou username (insensible à la casse)
        Optional<Utilisateur> existing = allUsers.stream()
                .filter(u -> (u.getEmail() != null && u.getEmail().equalsIgnoreCase(trimmedLogin))
                        || (u.getUsername() != null && u.getUsername().equalsIgnoreCase(trimmedLogin)))
                .findFirst();

        if (existing.isPresent()) {
            Utilisateur u = existing.get();
            if (!u.isActif()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ce compte utilisateur est désactivé.");
            }
            
            // Vérification stricte du mot de passe
            if (u.getPassword() == null || !u.getPassword().equals(password)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe incorrect.");
            }
            
            return u;
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiant ou mot de passe incorrect.");
    }

    @PostMapping("/create")
    public Utilisateur create(@RequestBody Utilisateur user) {
        user.setId(null);
        try {
            return utilisateurRepository.save(user);
        } catch (Exception e) {
            Long maxId = utilisateurRepository.findAll().stream()
                    .mapToLong(u -> u.getId() != null ? u.getId() : 0)
                    .max().orElse(0L);
            user.setId(maxId + 1);
            return utilisateurRepository.save(user);
        }
    }

    @PutMapping("/{id}")
    public Utilisateur update(@PathVariable Long id, @RequestBody Utilisateur user) {
        Utilisateur existing = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        existing.setUsername(user.getUsername());
        existing.setNom(user.getNom());
        existing.setPrenom(user.getPrenom());
        existing.setEmail(user.getEmail());
        existing.setRole(user.getRole());
        existing.setActif(user.isActif());
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existing.setPassword(user.getPassword());
        }
        return utilisateurRepository.save(existing);
    }

    @PutMapping("/{id}/password")
    public Utilisateur updatePassword(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        Utilisateur existing = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        existing.setPassword(payload.get("password"));
        return utilisateurRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        utilisateurRepository.deleteById(id);
    }
}
