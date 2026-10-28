package com.bpbf.sirh_backend.security;

import com.bpbf.sirh_backend.entities.Utilisateur;
import com.bpbf.sirh_backend.repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        java.util.List<Utilisateur> users = utilisateurRepository.findByUsernameOrEmail(usernameOrEmail);
        if (users == null || users.isEmpty()) {
            throw new UsernameNotFoundException("Utilisateur non trouvé avec l'identifiant: " + usernameOrEmail);
        }

        Utilisateur user = users.stream()
                .filter(u -> Boolean.TRUE.equals(u.isActif()))
                .findFirst()
                .orElse(users.get(0));

        return UserPrincipal.create(user);
    }
}
