package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.etatsynthese.EtatSyntheseConfigDto;
import com.bpbf.sirh_backend.entities.EtatSyntheseConfig;
import com.bpbf.sirh_backend.repositories.EtatSyntheseConfigRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EtatSyntheseConfigService {

    private final EtatSyntheseConfigRepository repository;

    @PostConstruct
    public void init() {
        try {
            initDefaultConfigs();
        } catch (Exception e) {
            log.error("Erreur lors de l'initialisation des états de synthèse par défaut", e);
        }
    }

    @Transactional(readOnly = true)
    public List<EtatSyntheseConfigDto> getAllConfigs(boolean onlyActive) {
        List<EtatSyntheseConfig> entities = onlyActive 
                ? repository.findByActifTrueOrderByOrdreAsc()
                : repository.findAllByOrderByOrdreAsc();

        if (entities.isEmpty()) {
            initDefaultConfigs();
            entities = onlyActive 
                    ? repository.findByActifTrueOrderByOrdreAsc()
                    : repository.findAllByOrderByOrdreAsc();
        }

        return entities.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EtatSyntheseConfigDto getConfigById(Long id) {
        EtatSyntheseConfig config = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Configuration d'état introuvable avec ID : " + id));
        return toDto(config);
    }

    @Transactional
    public EtatSyntheseConfigDto createConfig(EtatSyntheseConfigDto dto) {
        String cleanCode = (dto.getCode() != null ? dto.getCode().trim().toUpperCase() : "ETAT_PERSO_" + System.currentTimeMillis())
                .replaceAll("[^A-Z0-9_]", "_");

        if (repository.existsByCode(cleanCode)) {
            cleanCode = cleanCode + "_" + System.currentTimeMillis();
        }

        Integer nextOrdre = dto.getOrdre();
        if (nextOrdre == null) {
            List<EtatSyntheseConfig> all = repository.findAll();
            nextOrdre = all.stream().mapToInt(c -> c.getOrdre() != null ? c.getOrdre() : 0).max().orElse(0) + 1;
        }

        EtatSyntheseConfig entity = new EtatSyntheseConfig();
        entity.setCode(cleanCode);
        entity.setLibelle(dto.getLibelle() != null ? dto.getLibelle().trim() : "Nouvel état personnalisé");
        entity.setCategorie(dto.getCategorie() != null ? dto.getCategorie().trim() : "Personnalisé");
        entity.setDescription(dto.getDescription());
        entity.setIcon(dto.getIcon() != null && !dto.getIcon().isBlank() ? dto.getIcon() : "assessment");
        entity.setOrdre(nextOrdre);
        entity.setActif(dto.isActif());
        entity.setSystem(false); // États créés par l'utilisateur ne sont jamais système
        entity.setFiltreType(dto.getFiltreType() != null ? dto.getFiltreType() : "ALL");
        entity.setTypeElementCode(dto.getTypeElementCode());
        entity.setColonnesJson(dto.getColonnesJson());

        EtatSyntheseConfig saved = repository.save(entity);
        log.info("Nouvel état de synthèse créé : code={}, libelle={}", saved.getCode(), saved.getLibelle());
        return toDto(saved);
    }

    @Transactional
    public EtatSyntheseConfigDto updateConfig(Long id, EtatSyntheseConfigDto dto) {
        EtatSyntheseConfig entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Configuration d'état introuvable avec ID : " + id));

        if (dto.getLibelle() != null && !dto.getLibelle().isBlank()) {
            entity.setLibelle(dto.getLibelle().trim());
        }
        if (dto.getCategorie() != null) {
            entity.setCategorie(dto.getCategorie().trim());
        }
        if (dto.getDescription() != null) {
            entity.setDescription(dto.getDescription().trim());
        }
        if (dto.getIcon() != null && !dto.getIcon().isBlank()) {
            entity.setIcon(dto.getIcon().trim());
        }
        if (dto.getOrdre() != null) {
            entity.setOrdre(dto.getOrdre());
        }
        entity.setActif(dto.isActif());
        if (dto.getFiltreType() != null) {
            entity.setFiltreType(dto.getFiltreType());
        }
        if (dto.getTypeElementCode() != null) {
            entity.setTypeElementCode(dto.getTypeElementCode());
        }
        if (dto.getColonnesJson() != null) {
            entity.setColonnesJson(dto.getColonnesJson());
        }

        EtatSyntheseConfig updated = repository.save(entity);
        log.info("État de synthèse mis à jour : id={}, code={}", updated.getId(), updated.getCode());
        return toDto(updated);
    }

    @Transactional
    public EtatSyntheseConfigDto toggleActive(Long id) {
        EtatSyntheseConfig entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Configuration d'état introuvable avec ID : " + id));
        entity.setActif(!entity.isActif());
        EtatSyntheseConfig updated = repository.save(entity);
        return toDto(updated);
    }

    @Transactional
    public void deleteConfig(Long id) {
        EtatSyntheseConfig entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Configuration d'état introuvable avec ID : " + id));

        if (entity.isSystem()) {
            throw new IllegalStateException("L'état '" + entity.getLibelle() + "' est un état système réglementaire et ne peut pas être supprimé. Vous pouvez le désactiver.");
        }

        repository.delete(entity);
        log.info("État de synthèse supprimé : id={}, code={}", id, entity.getCode());
    }

    @Transactional
    public void initDefaultConfigs() {
        log.info("Vérification et synchronisation des états de synthèse officiels dans PostgreSQL...");

        List<EtatSyntheseConfig> defaults = new ArrayList<>();

        defaults.add(createEntity("RECAPITULATIF_GLOBAL", "Récapitulatif Global de la Paie", "Comptabilité & Paie",
                "Journal comptable officiel des charges (comptes 642, 641) et retenues/salaires nets (compte 3522).", "account_balance_wallet", 1, true, true));

        defaults.add(createEntity("LIVRE_PAIE", "Registre de Paie", "Paie Globale", 
                "Registre officiel de paie (format paysage 17 colonnes réglementaires : SB, Sursalaire, Indemnités, CNSS, IUTS, Net, TPA, Masse salariale).", "menu_book", 2, true, true));

        defaults.add(createEntity("ETAT_BANQUE", "État de Virement des Salaires", "Bancaire", 
                "Ordres et récapitulatif des virements bancaires par établissement financier avec code guichet, compte et clé RIB.", "account_balance", 3, true, true));

        defaults.add(createEntity("ETAT_CRRAE_RRPC", "Déclaration Cotisations RRPC (CRRAE 19%)", "Charges Sociales", 
                "État nominatif mensuel de déclaration des cotisations Régime de Retraite Professionnelle Complémentaire (12,67% patronal, 6,33% salarié).", "security", 4, true, true));

        defaults.add(createEntity("ETAT_CRRAE_RCPNC", "Déclaration Cotisations RCPNC (CRRAE 12%)", "Charges Sociales", 
                "État nominatif mensuel de déclaration des cotisations Régime Complémentaire de Pension Non Cadre (6% patronal, 6% salarié).", "security", 5, true, true));

        defaults.add(createEntity("ETAT_CRRAE_FAAM", "Déclaration Cotisations FAAM (CRRAE 1,5%)", "Charges Sociales", 
                "État nominatif mensuel de déclaration des cotisations Fonds d'Action et d'Assistance Médicale (1% patronal, 0,5% salarié).", "health_and_safety", 6, true, true));

        defaults.add(createEntity("ETAT_IUTS", "État des Retenues IUTS", "Fiscalité", 
                "État déclaratif fiscal officiel de l'IUTS (IFU 00164311Z) : salaires bruts, base imposable, charges de famille et IUTS à reverser.", "receipt_long", 7, true, true));

        defaults.add(createEntity("ETAT_FSP", "Retenue Fonds de Solidarité", "Cotisations Légales", 
                "État officiel du prélèvement légal obligatoire de 1% au titre du Fonds de Soutien Patriotique.", "shield", 8, true, true));

        defaults.add(createEntity("ETAT_NOMINATIF", "État nominatif de paie", "Salaires", 
                "Détail individuel nominatif par collaborateur avec matricule, emploi et rémunération brute/nette.", "badge", 9, true, true));

        defaults.add(createEntity("ETAT_SALAIRE", "État salaire par direction", "Analytique", 
                "Consolidation de la masse salariale et ventilation par Direction et Service.", "payments", 10, true, true));

        defaults.add(createEntity("ETAT_CNSS", "État Cotisation CNSS", "Charges Sociales", 
                "Déclaration sociale CNSS : base plafonnée à 800 000 FCFA, part salariale (5.5%), part patronale (16%).", "security", 11, true, true));

        defaults.add(createEntity("ETAT_PRECOMPTE", "État Précompte", "Retenues", 
                "Synthèse des retenues à la source, acomptes, saisies-arrêts et prêts du personnel.", "credit_card_off", 12, true, true));

        defaults.add(createEntity("ETAT_MUTUELLE", "État Mutuelle", "Assurance & Santé", 
                "Cotisations à la mutuelle de santé et prévoyance santé des salariés.", "health_and_safety", 13, true, true));

        defaults.add(createEntity("ETAT_TYPE_EMPLOYE", "État élément type employé", "Analytique", 
                "Répartition des charges salariales par catégorie socio-professionnelle et type de contrat.", "people", 14, true, true));

        defaults.add(createEntity("ETAT_ELEMENT_SALAIRE", "État Éléments De Salaire", "Rubriques & Primes", 
                "Ventilation analytique détaillée par rubrique de salaire (indemnités, primes, sursalaire).", "pie_chart", 15, true, true));

        defaults.add(createEntity("ETAT_BULLETIN", "État Bulletin (Contrôle exhaustif)", "Audit & Contrôle", 
                "Contrôle exhaustif ligne par ligne de tous les bulletins de paie émis lors de la session.", "rule", 16, true, true));

        for (EtatSyntheseConfig def : defaults) {
            if (!repository.existsByCode(def.getCode())) {
                repository.save(def);
                log.info("État de synthèse ajouté dans PostgreSQL : code={}, libelle={}", def.getCode(), def.getLibelle());
            }
        }
        log.info("Synchronisation des états de synthèse terminée.");
    }

    private EtatSyntheseConfig createEntity(String code, String libelle, String categorie, String desc, String icon, int ordre, boolean actif, boolean isSystem) {
        EtatSyntheseConfig c = new EtatSyntheseConfig();
        c.setCode(code);
        c.setLibelle(libelle);
        c.setCategorie(categorie);
        c.setDescription(desc);
        c.setIcon(icon);
        c.setOrdre(ordre);
        c.setActif(actif);
        c.setSystem(isSystem);
        c.setFiltreType("ALL");
        return c;
    }

    private EtatSyntheseConfigDto toDto(EtatSyntheseConfig entity) {
        if (entity == null) return null;
        return EtatSyntheseConfigDto.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .libelle(entity.getLibelle())
                .categorie(entity.getCategorie())
                .description(entity.getDescription())
                .icon(entity.getIcon())
                .ordre(entity.getOrdre())
                .actif(entity.isActif())
                .isSystem(entity.isSystem())
                .filtreType(entity.getFiltreType())
                .typeElementCode(entity.getTypeElementCode())
                .colonnesJson(entity.getColonnesJson())
                .build();
    }
}
