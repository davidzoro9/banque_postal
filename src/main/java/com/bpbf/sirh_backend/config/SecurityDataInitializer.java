package com.bpbf.sirh_backend.config;

import com.bpbf.sirh_backend.entities.ActionPermission;
import com.bpbf.sirh_backend.entities.RoleProfil;
import com.bpbf.sirh_backend.repositories.ActionPermissionRepository;
import com.bpbf.sirh_backend.repositories.RoleProfilRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
@Order(15)
@RequiredArgsConstructor
@Slf4j
public class SecurityDataInitializer implements CommandLineRunner {

    private final RoleProfilRepository roleProfilRepository;
    private final ActionPermissionRepository actionPermissionRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) {
        log.info("Vérification et initialisation sécurisée des rôles et habilitations dans PostgreSQL...");
        try {
            seedRoles();
            seedActionPermissions();
        } catch (Exception e) {
            log.warn("Erreur mineure initialisation sécurité: {}", e.getMessage());
        }
    }

    private void seedRoles() {
        seedRoleIfMissing("ADMIN", "Administrateur Système",
                "Accès complet sans restriction à l'ensemble des modules, configurations et données de l'application.",
                "#c62828",
                Arrays.asList("TOUS_LES_ACCES", "GESTION_UTILISATEURS", "CLOTURE_PAIE", "DONNEES_BASE_EDIT"));

        seedRoleIfMissing("DRH", "Directeur des Ressources Humaines",
                "Supervision de la gestion du personnel, validation de la paie, accès aux bilans et rapports analytiques.",
                "#1565c0",
                Arrays.asList("GRH_FULL", "PAIE_VALIDATION", "RAPPORTS_GLOBAL", "DOCUMENTATION_VIEW"));

        seedRoleIfMissing("GESTIONNAIRE_PAIE", "Gestionnaire de Paie",
                "Calcul des salaires, gestion des indemnités, saisie des variables et génération des bulletins.",
                "#2e7d32",
                Arrays.asList("PAIE_CALCUL", "PAIE_VARIABLES", "BULLETINS_GENERATE", "AVOIRS_PRECOMPTES"));

        seedRoleIfMissing("VALIDATEUR", "Validateur Hiérarchique",
                "Validation des demandes de congés, des autorisations d'absence et contrôle intermédiaire des opérations.",
                "#ef6c00",
                Arrays.asList("CONGES_VALIDATION", "ABSENCES_VALIDATION", "ALERTES_VIEW"));

        seedRoleIfMissing("CONSULTANT", "Consultant & Auditeur",
                "Accès en lecture seule sur les rapports, tableaux de bord de synthèse et conformité réglementaire.",
                "#6a1b9a",
                Arrays.asList("READ_ONLY_RAPPORTS", "DASHBOARD_VIEW", "AUDIT_VIEW"));

        seedRoleIfMissing("EMPLOYE", "Collaborateur Salarié",
                "Espace personnel collaborateur : consultation des bulletins personnels et saisie de demandes d'absence.",
                "#0d9488",
                Arrays.asList("ESPACE_SALARIE", "MES_BULLETINS", "MES_CONGES"));
    }

    private void seedRoleIfMissing(String code, String libelle, String description, String badgeColor, java.util.List<String> perms) {
        if (!roleProfilRepository.existsByCode(code)) {
            RoleProfil r = new RoleProfil();
            r.setCode(code);
            r.setLibelle(libelle);
            r.setDescription(description);
            r.setBadgeColor(badgeColor);
            r.setActif(true);
            try {
                r.setPermissions(objectMapper.writeValueAsString(perms));
            } catch (Exception e) {
                r.setPermissions("[]");
            }
            roleProfilRepository.save(r);
            log.info("Rôle '{}' initialisé avec succès.", code);
        }
    }

    private void seedActionPermissions() {
        if (actionPermissionRepository.count() > 0) {
            return;
        }

        int ord = 1;
        // Données de Base
        addAction(ord++, "Données de Base", "Accès au menu Données de Base", "DB_VIEW", roles(true, true, true, true, true, false));
        addAction(ord++, "Données de Base", "Modifier Grille Salariale", "DB_GRILLE_EDIT", roles(true, true, false, false, false, false));
        addAction(ord++, "Données de Base", "Modifier Grille Indemnitaire", "DB_INDEMNITE_EDIT", roles(true, true, true, false, false, false));
        addAction(ord++, "Données de Base", "Créer/Editer Référentiels (Direction, Service)", "DB_REF_EDIT", roles(true, true, false, false, false, false));

        // GRH & Employés
        addAction(ord++, "GRH & Employés", "Accès au menu Liste Employés", "EMP_VIEW", roles(true, true, true, true, true, false));
        addAction(ord++, "GRH & Employés", "Créer / Recruter un Employé", "EMP_CREATE", roles(true, true, false, false, false, false));
        addAction(ord++, "GRH & Employés", "Modifier Fiche Employé & Contrat", "EMP_EDIT", roles(true, true, true, false, false, false));
        addAction(ord++, "GRH & Employés", "Supprimer / Archiver un Employé", "EMP_DELETE", roles(true, false, false, false, false, false));

        // Paie
        addAction(ord++, "Gestion Paie", "Accès au module Paie & Bulletins", "PAIE_VIEW", roles(true, true, true, true, true, false));
        addAction(ord++, "Gestion Paie", "Saisie Variables (Avoirs / Précomptes)", "PAIE_VARIABLES", roles(true, true, true, false, false, false));
        addAction(ord++, "Gestion Paie", "Lancer Calcul & Génération de Paie", "PAIE_GENERATE", roles(true, true, true, false, false, false));
        addAction(ord++, "Gestion Paie", "Valider les Bulletins de Paie", "PAIE_VALIDATE", roles(true, true, false, true, false, false));
        addAction(ord++, "Gestion Paie", "Clôturer la Session de Paie", "PAIE_CLOTURE", roles(true, true, false, false, false, false));
        addAction(ord++, "Gestion Paie", "Exporter les Bulletins (PDF / Excel / Virement)", "PAIE_EXPORT", roles(true, true, true, true, true, false));

        // Congés & Absences
        addAction(ord++, "Congés & Absences", "Accès au Tableau de bord Congés", "CONGE_VIEW", roles(true, true, true, true, true, true));
        addAction(ord++, "Congés & Absences", "Poser une Demande de Congé", "CONGE_DEMANDE", roles(true, true, true, true, true, true));
        addAction(ord++, "Congés & Absences", "Valider / Rejeter les Demandes", "CONGE_VALIDATE", roles(true, true, false, true, false, false));

        // Mon Espace
        addAction(ord++, "Mon Espace", "Accès à l'Espace Collaborateur", "MON_ESPACE_VIEW", roles(true, true, true, true, true, true));
        addAction(ord++, "Mon Espace", "Télécharger ses Bulletins Personnels", "MON_ESPACE_BULLETINS", roles(true, true, true, true, true, true));

        // Profils & Sécurité
        addAction(ord++, "Profils & Sécurité", "Gestion des Profils & Matrice", "PROFIL_EDIT", roles(true, false, false, false, false, false));
        addAction(ord++, "Profils & Sécurité", "Gestion des Comptes Utilisateurs", "USER_MANAGE", roles(true, true, false, false, false, false));

        log.info("21 actions d'habilitation initialisées dans PostgreSQL avec succès.");
    }

    private void addAction(int ordre, String module, String name, String code, Map<String, Boolean> rolesAccess) {
        ActionPermission p = new ActionPermission();
        p.setOrdre(ordre);
        p.setModuleName(module);
        p.setActionName(name);
        p.setActionCode(code);
        try {
            p.setRolesAccessJson(objectMapper.writeValueAsString(rolesAccess));
        } catch (Exception e) {
            p.setRolesAccessJson("{}");
        }
        actionPermissionRepository.save(p);
    }

    private Map<String, Boolean> roles(boolean admin, boolean drh, boolean paie, boolean validateur, boolean consultant, boolean employe) {
        Map<String, Boolean> m = new HashMap<>();
        m.put("ADMIN", admin);
        m.put("DRH", drh);
        m.put("GESTIONNAIRE_PAIE", paie);
        m.put("VALIDATEUR", validateur);
        m.put("CONSULTANT", consultant);
        m.put("EMPLOYE", employe);
        return m;
    }
}
