package com.bpbf.sirh_backend.config;

import com.bpbf.sirh_backend.entities.Emploi;
import com.bpbf.sirh_backend.entities.Fonction;
import com.bpbf.sirh_backend.repositories.EmploiRepository;
import com.bpbf.sirh_backend.repositories.FonctionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@Order(22)
@RequiredArgsConstructor
@Slf4j
public class PosteEtFonctionDataInitializer implements CommandLineRunner {

    private final EmploiRepository emploiRepository;
    private final FonctionRepository fonctionRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Synchronisation des Postes (Emplois) et Fonctions officielles BPBF dans PostgreSQL...");
        repairSequences();
        try {
            seedEmplois();
            seedFonctions();
            log.info("28 Postes opérationnels et 37 Fonctions officielles synchronisés avec succès dans PostgreSQL.");
        } catch (Exception e) {
            log.warn("Avertissement lors de la synchronisation des postes et fonctions: {}", e.getMessage(), e);
        }
    }

    private void repairSequences() {
        String[] tables = {"emploi", "fonction"};
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

    private void seedEmplois() {
        // 28 Postes opérationnels (métiers de base)
        seedEmploi(1,  "P-01", "Agent Chargé de la Monétique et Digitalisation", "Exploitation monétique et services digitaux");
        seedEmploi(2,  "P-02", "Agent de Liaison", "Courrier, transmission et liaisons administratives");
        seedEmploi(3,  "P-03", "Assistant Moyens Généraux", "Logistique, entretien et fournitures");
        seedEmploi(4,  "P-04", "Assistant Trésorerie", "Suivi des flux et opérations de trésorerie");
        seedEmploi(5,  "P-05", "Assistante Cash point", "Gestion des points de cash et proximité");
        seedEmploi(6,  "P-06", "Assistante de Direction", "Secrétariat et appui à la direction");
        seedEmploi(7,  "P-07", "Assistante Juridique", "Appui contentieux et secrétariat juridique");
        seedEmploi(8,  "P-08", "Auditeur Interne", "Missions de contrôle et audit des opérations");
        seedEmploi(9,  "P-09", "Auditeur Junior", "Contrôles opérationnels et assistance audit");
        seedEmploi(10, "P-10", "Caissier", "Opérations de guichet, encaissements et décaissements");
        seedEmploi(11, "P-11", "Caissier principal", "Supervision de la caisse centrale et coffre");
        seedEmploi(12, "P-12", "Chargé clientèle", "Gestion de portefeuille clients et souscriptions");
        seedEmploi(13, "P-13", "Chargé d'Affaires", "Développement commercial et crédits entreprises");
        seedEmploi(14, "P-14", "Chargé de la Monétique et Digitalisation", "Conception et suivi des produits digitaux");
        seedEmploi(15, "P-15", "Chargé de Système Réseau et Sécurité", "Administration réseau, télécoms et cybersécurité");
        seedEmploi(16, "P-16", "Chargé Marketing et Communication", "Campagnes, communication interne et externe");
        seedEmploi(17, "P-17", "Chargé Réseau Cash points", "Déploiement et animation des points cash");
        seedEmploi(18, "P-18", "Chargé Support IT", "Support helpdesk et maintenance du parc");
        seedEmploi(19, "P-19", "Chargée de la Conformité", "Contrôle conformité, LAB/FT et éthique");
        seedEmploi(20, "P-20", "Chargée des Opérations Bancaire", "Back-office et traitement des opérations");
        seedEmploi(21, "P-21", "Chargée des Ressources Humaines", "Administration du personnel, paie et formation");
        seedEmploi(22, "P-22", "Chargée du Précontentieux", "Recouvrement amiable et suivi des impayés");
        seedEmploi(23, "P-23", "Chauffeur", "Transport du personnel et courriers sécurisés");
        seedEmploi(45, "P-45", "Comptable", "Comptabilité générale, pointage et rapprochements");
        seedEmploi(46, "P-46", "Contrôleur de Gestion", "Contrôle budgétaire, rentabilité et reporting");
        seedEmploi(47, "P-47", "Contrôleur Permanent", "Contrôles de second niveau et conformité");
        seedEmploi(59, "P-59", "Gestionnaire Cash point", "Gestion et approvisionnement des points cash");
        seedEmploi(65, "P-65", "Standardiste", "Accueil physique, téléphonique et orientation");
    }

    private void seedFonctions() {
        // 37 Fonctions de Direction, Département et Service (Nominations officielles)
        seedFonction(24, "FCT-24", "Chef d'Agence", "Direction et animation d'agence bancaire", "NOMMEE");
        seedFonction(25, "FCT-25", "Chef de service Bases de Données et Applications", "Pilotage des bases de données et progiciels bancaires", "NOMMEE");
        seedFonction(26, "FCT-26", "Chef de service Agences", "Supervision et coordination du réseau d'agences", "NOMMEE");
        seedFonction(27, "FCT-27", "Chef de service Analyse de Risque de crédit", "Analyse, étude et notation des risques de crédit", "NOMMEE");
        seedFonction(28, "FCT-28", "Chef de service Base de Données et Applications", "Administration et exploitation applicative", "NOMMEE");
        seedFonction(29, "FCT-29", "Chef de service Capital Humain", "Pilotage RH, compétences et gestion des carrières", "NOMMEE");
        seedFonction(30, "FCT-30", "Chef de service Comptabilité et Fiscalité", "Supervision comptable, états financiers et fiscalité", "NOMMEE");
        seedFonction(31, "FCT-31", "Chef de service Conformité", "Surveillance conformité, réglementations et déontologie", "NOMMEE");
        seedFonction(32, "FCT-32", "Chef de service Controle Permanent", "Pilotage du dispositif de contrôle permanent", "NOMMEE");
        seedFonction(33, "FCT-33", "Chef de service Grandes Entreprises", "Animation commerciale du segment Grandes Entreprises", "NOMMEE");
        seedFonction(34, "FCT-34", "Chef de service Institutionnels", "Gestion et développement des relations institutionnelles (1)", "NOMMEE");
        seedFonction(35, "FCT-35", "Chef de service Institutionnels", "Gestion et développement des relations institutionnelles (2)", "NOMMEE");
        seedFonction(36, "FCT-36", "Chef de service Monétique et Digitalisation", "Supervision des produits électroniques et digitaux", "NOMMEE");
        seedFonction(37, "FCT-37", "Chef de service Moyens Généraux", "Gestion logistique, approvisionnements et patrimoine", "NOMMEE");
        seedFonction(38, "FCT-38", "Chef de service Opérations avec l'Extérieur", "Supervision des transferts et commerce international", "NOMMEE");
        seedFonction(39, "FCT-39", "Chef de service Opérations Domestiques", "Supervision des compensations et opérations locales", "NOMMEE");
        seedFonction(40, "FCT-40", "Chef de service suivi des Engagements et du Précontentieux", "Monitoring des encours et recouvrement amiable", "NOMMEE");
        seedFonction(41, "FCT-41", "Chef de service Supports", "Supervision du support utilisateur et maintenance", "NOMMEE");
        seedFonction(42, "FCT-42", "Chef de service Système et Réseau", "Infrastructures serveurs, télécoms et réseaux", "NOMMEE");
        seedFonction(43, "FCT-43", "Chef de service TPE-PME/PMI", "Financement et animation commerciale TPE / PME-PMI", "NOMMEE");
        seedFonction(44, "FCT-44", "Chef de Zone", "Supervision d'une zone géographique ou pôle d'agences", "NOMMEE");
        seedFonction(48, "FCT-48", "Directeur Financier et Comptable", "Direction des finances, trésorerie et comptabilité", "NOMMEE");
        seedFonction(49, "FCT-49", "Directeur Administration et Moyens Généraux", "Direction administrative, patrimoine et RH", "NOMMEE");
        seedFonction(50, "FCT-50", "Directeur de l'Audit Interne", "Direction de l'audit interne et contrôle périodique", "NOMMEE");
        seedFonction(51, "FCT-51", "Directeur des Engagements", "Direction des crédits, analyse et recouvrement", "NOMMEE");
        seedFonction(52, "FCT-52", "Directeur des Entreprises et Institutionnels", "Direction commerciale entreprises et institutionnels", "NOMMEE");
        seedFonction(53, "FCT-53", "Directeur des Opérations Bancaires", "Direction du traitement des opérations bancaires", "NOMMEE");
        seedFonction(54, "FCT-54", "Directeur des Risques et de la Conformité", "Direction globale de la gestion des risques et conformité", "NOMMEE");
        seedFonction(55, "FCT-55", "Directeur des Systèmes d'Information", "Direction générale des technologies et systèmes d'information", "NOMMEE");
        seedFonction(56, "FCT-56", "Directeur du Réseau", "Direction du réseau d'agences et points de vente", "NOMMEE");
        seedFonction(57, "FCT-57", "Directeur Général", "Direction générale de la banque BPBF", "NOMMEE");
        seedFonction(58, "FCT-58", "Directeur Général Adjoint", "Direction générale adjointe et coordination des opérations", "NOMMEE");
        seedFonction(60, "FCT-60", "Responsable de la Trésorerie", "Pilotage du département Trésorerie", "NOMMEE");
        seedFonction(61, "FCT-61", "Responsable des Affaires Juridiques et Contentieux", "Pilotage de la direction juridique et contentieux", "NOMMEE");
        seedFonction(62, "FCT-62", "Responsable des Engagements", "Coordination des engagements et comités de crédit", "NOMMEE");
        seedFonction(63, "FCT-63", "Chef de service Risques", "Supervision de l'analyse et surveillance des risques", "NOMMEE");
        seedFonction(64, "FCT-64", "Responsable Marketing et Communication", "Pilotage du département Marketing et communication", "NOMMEE");
    }

    private void seedEmploi(int ordre, String code, String name, String description) {
        Optional<Emploi> existing = emploiRepository.findByCode(code);
        if (existing.isEmpty()) {
            existing = emploiRepository.findByNameIgnoreCase(name);
        }

        Emploi emploi;
        if (existing.isPresent()) {
            emploi = existing.get();
        } else {
            emploi = new Emploi();
            emploi.setCode(code);
        }

        emploi.setName(name);
        emploi.setDescription(description);
        emploi.setOrdre(ordre);
        emploiRepository.save(emploi);
    }

    private void seedFonction(int ordre, String code, String name, String description, String typeNomination) {
        Optional<Fonction> existing = fonctionRepository.findByCode(code);
        if (existing.isEmpty()) {
            existing = fonctionRepository.findByNameIgnoreCase(name);
        }

        Fonction fonction;
        if (existing.isPresent()) {
            fonction = existing.get();
        } else {
            fonction = new Fonction();
            fonction.setCode(code);
        }

        fonction.setName(name);
        fonction.setDescription(description);
        fonction.setTypeNomination(typeNomination);
        fonction.setOrdre(ordre);
        fonction.setActif(true);
        fonctionRepository.save(fonction);
    }
}
