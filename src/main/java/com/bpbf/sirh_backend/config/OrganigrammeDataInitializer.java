package com.bpbf.sirh_backend.config;

import com.bpbf.sirh_backend.entities.Department;
import com.bpbf.sirh_backend.entities.Direction;
import com.bpbf.sirh_backend.entities.Service;
import com.bpbf.sirh_backend.repositories.DepartmentRepository;
import com.bpbf.sirh_backend.repositories.DirectionRepository;
import com.bpbf.sirh_backend.repositories.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@Order(20)
@RequiredArgsConstructor
@Slf4j
public class OrganigrammeDataInitializer implements CommandLineRunner {

    private final DirectionRepository directionRepository;
    private final DepartmentRepository departmentRepository;
    private final ServiceRepository serviceRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Vérification et synchronisation de l'organigramme officiel BPBF dans PostgreSQL...");
        repairSequences();
        try {
            seedOrganigramme();
            log.info("Organigramme officiel BPBF synchronisé avec succès dans PostgreSQL.");
        } catch (Exception e) {
            log.warn("Avertissement lors de l'initialisation de l'organigramme: {}", e.getMessage(), e);
        }
    }

    private void repairSequences() {
        String[] tables = {"direction", "department", "service"};
        for (String tbl : tables) {
            try {
                jdbcTemplate.execute("CREATE SEQUENCE IF NOT EXISTS " + tbl + "_id_seq");
                jdbcTemplate.execute("ALTER TABLE " + tbl + " ALTER COLUMN id SET DEFAULT nextval('" + tbl + "_id_seq')");
                jdbcTemplate.execute("SELECT setval('" + tbl + "_id_seq', COALESCE((SELECT MAX(id) FROM " + tbl + "), 0) + 1, false)");
            } catch (Exception e) {
                log.debug("Auto-réparation séquence {} (non bloquant): {}", tbl, e.getMessage());
            }
        }
    }

    private void seedOrganigramme() {
        // ─── 1. DIRECTIONS DE CONTRÔLE (Rattachées au DG + Liens fonctionnels aux Comités) ───
        Direction dirAudit = getOrCreateDirection(
                "DIR_AUDIT",
                "Direction Audit Interne",
                "Direction de contrôle rattachée au DG, avec lien fonctionnel au Comité Audit"
        );

        Direction dirRisques = getOrCreateDirection(
                "DIR_RISQUES",
                "Direction Risque et conformité",
                "Direction de contrôle rattachée au DG, avec lien fonctionnel au Comité Risques"
        );

        // ─── 2. DIRECTIONS OPÉRATIONNELLES (Sous la coordination du DGA / DG) ───
        Direction dirEntr = getOrCreateDirection(
                "DIR_ENTREPRISES",
                "Direction des Entreprises et institutionnels",
                "Gestion commerciale entreprises, PME/PMI et grands comptes institutionnels"
        );

        Direction dirReseau = getOrCreateDirection(
                "DIR_RESEAU",
                "Direction Réseau",
                "Animation et pilotage du réseau d'agences, cash points et services digitaux"
        );

        Direction dirEngag = getOrCreateDirection(
                "DIR_ENGAGEMENTS",
                "Direction des Engagements",
                "Instruction, analyse de crédits, suivi des engagements et précontentieux"
        );

        Direction dirOps = getOrCreateDirection(
                "DIR_OPERATIONS",
                "Direction des Opérations bancaires",
                "Traitement et supervision des opérations domestiques et internationales"
        );

        Direction dirJuridique = getOrCreateDirection(
                "DIR_JURIDIQUE",
                "Direction Affaires juridiques & contentieux",
                "Affaires juridiques, conformité des actes, gouvernance et recouvrement"
        );

        Direction dirDsi = getOrCreateDirection(
                "DIR_DSI",
                "Direction des Systèmes d'informations",
                "Gestion des infrastructures, bases de données, applications et support technique"
        );

        Direction dirDamg = getOrCreateDirection(
                "DIR_DAMG",
                "Direction Administration et Moyens Généraux",
                "Administration générale, moyens généraux, sécurité et capital humain"
        );

        Direction dirDfc = getOrCreateDirection(
                "DIR_DFC",
                "Direction Financière et comptable",
                "Comptabilité générale, fiscalité, contrôle de gestion et états financiers"
        );

        // ─── 3. DÉPARTEMENTS AU MÊME NIVEAU (Directement rattachés sous DGA) ───
        Department depMarketing = getOrCreateDepartment(
                "DEP_MARKETING",
                "Département Marketing, commercial et communication"
        );

        Department depTresorerie = getOrCreateDepartment(
                "DEP_TRESORERIE",
                "Département Trésorerie"
        );

        // ─── 4. SERVICES OFFICIELS RATTACHÉS AUX DIRECTIONS ───
        // Direction des Entreprises et institutionnels
        getOrCreateService("SRV_PME_PMI", "Service PME/PMI", "Accompagnement et financements PME/PMI", dirEntr, null);
        getOrCreateService("SRV_GRANDES_ENTR", "Service Grandes entreprises", "Gestion des grands comptes d'entreprises", dirEntr, null);
        getOrCreateService("SRV_INSTITUTIONNELS", "Service Institutionnels", "Relations et partenariats avec les institutionnels", dirEntr, null);

        // Direction Réseau
        getOrCreateService("SRV_AGENCE", "Service Agence", "Supervision et exploitation des agences bancaires", dirReseau, null);
        getOrCreateService("SRV_CASH_POINT", "Service Cash Point", "Déploiement et gestion des points de cash et proximité", dirReseau, null);
        getOrCreateService("SRV_MONETIQUE_DIGITAL", "Service Monétique et digital", "Solutions de paiement électronique et banque digitale", dirReseau, null);

        // Direction des Engagements
        getOrCreateService("SRV_SUIVI_ENGAG", "Service Suivi des Engagements", "Monitoring des risques et encours de crédit", dirEngag, null);
        getOrCreateService("SRV_ANALYSE_CREDIT", "Service Analyse et administration de crédits", "Étude des dossiers de crédit et administration", dirEngag, null);
        getOrCreateService("SRV_PRECONTENTIEUX", "Service Précontentieux", "Gestion amiable et recouvrement précontentieux", dirEngag, null);

        // Direction des Opérations bancaires
        getOrCreateService("SRV_OPS_DOMESTIQUES", "Service des Opérations domestiques", "Traitement des virements, compensations et opérations locales", dirOps, null);
        getOrCreateService("SRV_OPS_INTERNAT", "Service des Opérations à l'international", "Opérations de commerce international, transferts et devises", dirOps, null);

        // Direction Affaires juridiques & contentieux
        getOrCreateService("SRV_JURIDIQUE_GOUV", "Service Affaires juridiques & Gouvernance", "Conseil juridique, gouvernance et conformité contractuelle", dirJuridique, null);
        getOrCreateService("SRV_RECOUVREMENT", "Service Recouvrement", "Poursuite contentieuse et recouvrement forcé", dirJuridique, null);

        // Direction des Systèmes d'informations
        getOrCreateService("SRV_BD_APPS", "Service Base de données et applications", "Administration des bases de données et progiciels bancaires", dirDsi, null);
        getOrCreateService("SRV_SYSTEMES_RESEAUX", "Service Systèmes et réseaux", "Infrastructures réseaux, télécoms et serveurs", dirDsi, null);
        getOrCreateService("SRV_SUPPORTS", "Service Supports", "Assistance aux utilisateurs et maintenance du parc informatique", dirDsi, null);

        // Direction Administration et Moyens Généraux
        getOrCreateService("SRV_MOYENS_GEN_SEC", "Service Moyens généraux et Sécurité", "Logistique, approvisionnements, patrimoine et sûreté", dirDamg, null);
        getOrCreateService("SRV_CAPITAL_HUMAIN", "Service Capital Humain", "Gestion prévisionnelle, carrières, recrutement et formation", dirDamg, null);

        // Direction Financière et comptable
        getOrCreateService("SRV_COMPTA_FISC", "Service Comptabilité et fiscalité", "Tenue des comptes, déclarations fiscales et réglementaires", dirDfc, null);
        getOrCreateService("SRV_CTRL_GESTION", "Service Contrôle de gestion", "Pilotage budgétaire, tableaux de bord et rentabilité", dirDfc, null);
    }

    private Direction getOrCreateDirection(String code, String name, String description) {
        Optional<Direction> existing = directionRepository.findByCode(code);
        if (existing.isEmpty()) {
            existing = directionRepository.findByNameIgnoreCase(name);
        }

        if (existing.isPresent()) {
            Direction dir = existing.get();
            dir.setName(name);
            dir.setDescription(description);
            return directionRepository.save(dir);
        } else {
            Direction dir = new Direction();
            dir.setCode(code);
            dir.setName(name);
            dir.setDescription(description);
            return directionRepository.save(dir);
        }
    }

    private Department getOrCreateDepartment(String code, String name) {
        Optional<Department> existing = departmentRepository.findByCode(code);
        if (existing.isEmpty()) {
            existing = departmentRepository.findByNameIgnoreCase(name);
        }

        if (existing.isPresent()) {
            Department dep = existing.get();
            dep.setName(name);
            return departmentRepository.save(dep);
        } else {
            Department dep = new Department();
            dep.setCode(code);
            dep.setName(name);
            return departmentRepository.save(dep);
        }
    }

    private Service getOrCreateService(String code, String name, String description, Direction direction, Department department) {
        Optional<Service> existing = serviceRepository.findByCode(code);
        if (existing.isEmpty()) {
            existing = serviceRepository.findByNameIgnoreCase(name);
        }

        Service srv;
        if (existing.isPresent()) {
            srv = existing.get();
        } else {
            srv = new Service();
            srv.setCode(code);
        }

        srv.setName(name);
        srv.setDescription(description);
        if (direction != null) {
            srv.setDirection(direction);
            srv.setDepartment(null);
        } else if (department != null) {
            srv.setDepartment(department);
            srv.setDirection(null);
        }
        return serviceRepository.save(srv);
    }
}
