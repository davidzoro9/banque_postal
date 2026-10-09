package com.bpbf.sirh_backend.security;

import com.bpbf.sirh_backend.entities.Utilisateur;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String username;
    private final String email;
    private final String nom;
    private final String prenom;
    private final String password;
    private final String role;
    private final boolean actif;
    private final Collection<? extends GrantedAuthority> authorities;

    public static UserPrincipal create(Utilisateur u) {
        String roleStr = u.getRole() != null ? u.getRole().toUpperCase() : "EMPLOYE";
        if (!roleStr.startsWith("ROLE_")) {
            roleStr = "ROLE_" + roleStr;
        }
        GrantedAuthority authority = new SimpleGrantedAuthority(roleStr);

        return new UserPrincipal(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getNom(),
                u.getPrenom(),
                u.getPassword(),
                u.getRole(),
                u.isActif(),
                Collections.singletonList(authority)
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username != null ? username : email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return actif;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return actif;
    }
}
