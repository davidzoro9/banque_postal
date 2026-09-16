package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.*;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.exceptions.ResourceNotFoundException;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeProcessService {
    private final EmployeeRepository employeeRepository;
    private final FamilleEmployeRepository familleRepository;
    private final InformationSalarialeRepository informationRepository;
    private final SituationSalarialeRepository situationRepository;
    private final IndemniteEmployeRepository indemniteRepository;
    private final ExonerationEmployeRepository exonerationRepository;
    private final ParametrageIndemniteRepository parametrageRepository;
    private final InformationSalarialeRetenueRepository informationRetenueRepository;
    private final InformationSalarialeCalculService informationCalculService;
    private final BulletinRepository bulletinRepository;
    private final AvoirRepository avoirRepository;
    private final PrecompteRepository precompteRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Transactional
    public void sync(Employee employee, EmployeeDto dto) {
        if (dto != null) {
            upsertInformation(employee, dto.getModePaiement(), dto.getBanque(), dto.getIban(), dto.getIntituleCompte());
        }

        Long fonctionId = idOf(employee.getFonction());
        Long emploiId = idOf(employee.getEmploi());
        Long gradeId = idOf(employee.getGradeObj());
        Long categorieId = idOf(employee.getCategorieObj());
        List<ParametrageIndemnite> applicable = resolveApplicableIndemnites(employee, fonctionId, emploiId, gradeId, categorieId);
        Map<Long, IndemniteEmploye> existing = indemniteRepository.findByEmployeeId(employee.getId()).stream()
                .filter(i -> i.getParametrageIndemnite() != null)
                .collect(Collectors.toMap(i -> i.getParametrageIndemnite().getId(), Function.identity()));

        List<IndemniteEmploye> current = new ArrayList<>();
        for (ParametrageIndemnite parametrage : applicable) {
            IndemniteEmploye indemnite = existing.remove(parametrage.getId());
            if (indemnite == null) {
                indemnite = new IndemniteEmploye();
                indemnite.setEmployee(employee);
                indemnite.setParametrageIndemnite(parametrage);
            }
            TypeIndemnite type = parametrage.getTypeIndemniteObj();
            indemnite.setTypeIndemnite(type);
            indemnite.setLibelle(type.getName());

            String tCode = (type.getCode() != null ? type.getCode() : "").toUpperCase();
            String tName = (type.getName() != null ? type.getName() : "").toUpperCase();
            boolean isTransport = tCode.contains("TRP") || tCode.contains("TRANS") || tName.contains("TRANSPORT") || tName.contains("DÉPLACEMENT") || tName.contains("DEPLACEMENT");
            boolean isLogement = tCode.contains("LOG") || tCode.contains("MAISON") || tName.contains("LOGEMENT");

            if (Boolean.TRUE.equals(employee.getVehiculeFourni()) && isTransport) {
                indemnite.setMontant(0.0);
                indemnite.setActif(false);
            } else if (Boolean.TRUE.equals(employee.getLogementFourni()) && isLogement) {
                indemnite.setMontant(0.0);
                indemnite.setActif(false);
            } else {
                indemnite.setMontant(valueOrZero(parametrage.getTaux()));
                if (indemnite.getActif() == null) {
                    indemnite.setActif(true);
                } else if (isTransport && !Boolean.TRUE.equals(employee.getVehiculeFourni()) && (indemnite.getMontant() == null || indemnite.getMontant() == 0.0)) {
                    indemnite.setMontant(valueOrZero(parametrage.getTaux()));
                    indemnite.setActif(true);
                } else if (isLogement && !Boolean.TRUE.equals(employee.getLogementFourni()) && (indemnite.getMontant() == null || indemnite.getMontant() == 0.0)) {
                    indemnite.setMontant(valueOrZero(parametrage.getTaux()));
                    indemnite.setActif(true);
                }
            }
            current.add(indemniteRepository.save(indemnite));
        }

        // Exemptions reference indemnities, so obsolete children must be removed first.
        for (IndemniteEmploye obsolete : existing.values()) {
            exonerationRepository.deleteByIndemniteEmployeId(obsolete.getId());
        }
        exonerationRepository.flush();
        indemniteRepository.deleteAll(existing.values());
        indemniteRepository.flush();

        double totalIndemnites = current.stream()
                .filter(i -> !Boolean.FALSE.equals(i.getActif()))
                .mapToDouble(i -> valueOrZero(i.getMontant())).sum();
        if (employee.getGrilleSalariale() != null) {
            SituationSalariale situation = situationRepository.findByEmployeeId(employee.getId())
                    .orElseGet(SituationSalariale::new);
            situation.setEmployee(employee);
            situation.setGrilleSalariale(employee.getGrilleSalariale());
            situation.setCategorie(employee.getCategorieObj());
            situation.setEchelon(employee.getEchelonObj());
            situation.setGrade(employee.getGradeObj());
            double base = valueOrZero(employee.getGrilleSalariale().getSalaireBase());
            Double surSalaire = employee.getSurSalaire() != null ? employee.getSurSalaire() : (dto != null ? dto.getSurSalaire() : 0.0);
            if (surSalaire != null && surSalaire < 0.0) {
                surSalaire = 0.0;
            }
            situation.setSalaireBase(base);
            situation.setSurSalaire(surSalaire);
            situation.setTotalIndemnites(totalIndemnites);
            situation.setSalaireBrut(base + (surSalaire != null ? surSalaire : 0.0) + totalIndemnites);
            situationRepository.save(situation);
        } else {
            situationRepository.deleteByEmployeeId(employee.getId());
        }

        for (IndemniteEmploye indemnite : current) {
            if (Boolean.FALSE.equals(indemnite.getActif()) || valueOrZero(indemnite.getMontant()) == 0.0) {
                exonerationRepository.deleteByIndemniteEmployeId(indemnite.getId());
                continue;
            }
            TypeIndemnite type = indemnite.getTypeIndemnite();
            ExonerationEmploye exoneration = exonerationRepository.findByIndemniteEmployeId(indemnite.getId())
                    .orElseGet(ExonerationEmploye::new);
            double taux = valueOrZero(type.getTauxExoneration());
            double plafond = valueOrZero(type.getPlafondExoneration());
            exoneration.setEmployee(employee);
            exoneration.setTypeIndemnite(type);
            exoneration.setIndemniteEmploye(indemnite);
            exoneration.setLibelle(type.getName());
            exoneration.setTauxExonere(taux);
            exoneration.setPlafondExonere(plafond);
            exoneration.setMontant(calculateExoneration(indemnite.getMontant(), taux, plafond));
            exonerationRepository.save(exoneration);
        }

        // ─── Synchronisation automatique des membres de famille pour charges IUTS ──
        if (dto != null && (dto.getConjoint() != null || dto.getEnfants() != null)) {
            familleRepository.deleteByEmployeeId(employee.getId());
            familleRepository.flush();

            if (dto.getConjoint() != null) {
                try {
                    java.util.Map<String, Object> conj = objectMapper.convertValue(dto.getConjoint(), new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>() {});
                    String nom = (String) conj.getOrDefault("nom", "");
                    String prenom = (String) conj.getOrDefault("prenom", "");
                    boolean travail = Boolean.TRUE.equals(conj.get("travail"));
                    if ((nom != null && !nom.isBlank()) || (prenom != null && !prenom.isBlank())) {
                        FamilleEmploye f = new FamilleEmploye();
                        f.setEmployee(employee);
                        f.setNom(nom != null && !nom.isBlank() ? nom : "Conjoint");
                        f.setPrenom(prenom != null && !prenom.isBlank() ? prenom : "");
                        f.setLienParente(LienParente.CONJOINT);
                        f.setDateNaissance(parseLocalDate(conj.get("dateNaissance")));
                        f.setEstCharge(!travail);
                        f.setStatut("Actif");
                        familleRepository.save(f);
                    }
                } catch (Exception ignored) {}
            }

            if (dto.getEnfants() != null) {
                try {
                    java.util.List<java.util.Map<String, Object>> enfantsList = objectMapper.convertValue(dto.getEnfants(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<java.util.Map<String, Object>>>() {});
                    if (enfantsList != null) {
                        for (java.util.Map<String, Object> enf : enfantsList) {
                            String nom = (String) enf.getOrDefault("nom", "");
                            if (nom != null && !nom.isBlank()) {
                                FamilleEmploye f = new FamilleEmploye();
                                f.setEmployee(employee);
                                f.setNom(nom);
                                f.setPrenom((String) enf.getOrDefault("prenom", ""));
                                f.setLienParente(LienParente.ENFANT);
                                f.setDateNaissance(parseLocalDate(enf.get("dateNaissance")));
                                f.setEstCharge(true);
                                f.setStatut("Actif");
                                familleRepository.save(f);
                            }
                        }
                    }
                } catch (Exception ignored) {}
            }
            familleRepository.flush();
        }

        informationCalculService.recalculate(employee);
    }

    private static java.time.LocalDate parseLocalDate(Object val) {
        if (val == null) return null;
        String s = val.toString().trim();
        if (s.isEmpty()) return null;
        try {
            return java.time.LocalDate.parse(s.substring(0, Math.min(s.length(), 10)));
        } catch (Exception e) {
            return null;
        }
    }

    static double calculateExoneration(Double montant, Double taux, Double plafond) {
        double calculated = valueOrZero(montant) * valueOrZero(taux) / 100.0;
        return valueOrZero(plafond) > 0 ? Math.min(calculated, plafond) : calculated;
    }

    @Transactional(readOnly = true)
    public List<FamilleEmployeDto> getFamille(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return familleRepository.findByEmployeeIdOrderByNomAscPrenomAsc(employee.getId())
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public FamilleEmployeDto createFamille(String idOrMatricule, FamilleEmployeDto dto) {
        Employee employee = resolveEmployee(idOrMatricule);
        FamilleEmploye entity = new FamilleEmploye();
        entity.setEmployee(employee);
        copyFamille(dto, entity);
        FamilleEmploye saved = familleRepository.save(entity);
        informationCalculService.recalculate(employee);
        return toDto(saved);
    }

    @Transactional
    public FamilleEmployeDto updateFamille(String idOrMatricule, Long membreId, FamilleEmployeDto dto) {
        Employee employee = resolveEmployee(idOrMatricule);
        FamilleEmploye entity = familleRepository.findById(membreId)
                .filter(membre -> membre.getEmployee().getId().equals(employee.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Membre de famille non trouvé: " + membreId));
        copyFamille(dto, entity);
        FamilleEmploye saved = familleRepository.save(entity);
        informationCalculService.recalculate(employee);
        return toDto(saved);
    }

    @Transactional
    public void deleteFamille(String idOrMatricule, Long membreId) {
        Employee employee = resolveEmployee(idOrMatricule);
        FamilleEmploye entity = familleRepository.findById(membreId)
                .filter(membre -> membre.getEmployee().getId().equals(employee.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Membre de famille non trouvé: " + membreId));
        familleRepository.delete(entity);
        familleRepository.flush();
        informationCalculService.recalculate(employee);
    }

    @Transactional
    public InformationSalarialeDto getInformation(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return informationCalculService.toDto(informationCalculService.recalculate(employee));
    }

    @Transactional
    public InformationSalarialeDto putInformation(String idOrMatricule, InformationSalarialeDto dto) {
        Employee employee = resolveEmployee(idOrMatricule);
        upsertInformation(employee, dto.getModePaiement(), dto.getBanque(), dto.getIban(), dto.getIntituleCompte());
        return informationCalculService.toDto(informationCalculService.recalculate(employee));
    }

    @Transactional
    public InformationSalarialeDto recalculateInformation(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return informationCalculService.toDto(informationCalculService.recalculate(employee));
    }

    @Transactional(readOnly = true)
    public InformationSalarialeDto simulateSalary(String idOrMatricule, Double customSalaireBase, Double customSurSalaire) {
        Employee employee = resolveEmployee(idOrMatricule);
        return informationCalculService.simulate(employee, customSalaireBase, customSurSalaire);
    }

    @Transactional(readOnly = true)
    public SituationSalarialeDto getSituation(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return situationRepository.findByEmployeeId(employee.getId()).map(this::toDto)
                .orElseGet(() -> {
                    SituationSalarialeDto dto = new SituationSalarialeDto();
                    dto.setEmployeeId(employee.getId());
                    return dto;
                });
    }

    @Transactional(readOnly = true)
    public List<IndemniteEmployeDto> getIndemnites(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return indemniteRepository.findByEmployeeId(employee.getId()).stream().map(this::toDto).toList();
    }

    @Transactional
    public IndemniteEmployeDto toggleIndemnite(String idOrMatricule, Long indemniteId) {
        Employee employee = resolveEmployee(idOrMatricule);
        IndemniteEmploye indemnite = indemniteRepository.findById(indemniteId)
                .orElseThrow(() -> new ResourceNotFoundException("Indemnité non trouvée : " + indemniteId));

        if (!indemnite.getEmployee().getId().equals(employee.getId())) {
            throw new IllegalArgumentException("Cette indemnité n'appartient pas à cet employé");
        }

        boolean nouveauStatut = Boolean.FALSE.equals(indemnite.getActif()) ? true : false;
        indemnite.setActif(nouveauStatut);
        IndemniteEmploye saved = indemniteRepository.save(indemnite);

        // Mettre à jour l'exonération correspondante
        if (Boolean.FALSE.equals(saved.getActif()) || valueOrZero(saved.getMontant()) == 0.0) {
            exonerationRepository.deleteByIndemniteEmployeId(saved.getId());
        } else {
            TypeIndemnite type = saved.getTypeIndemnite();
            if (type != null) {
                ExonerationEmploye exoneration = exonerationRepository.findByIndemniteEmployeId(saved.getId())
                        .orElseGet(ExonerationEmploye::new);
                double taux = valueOrZero(type.getTauxExoneration());
                double plafond = valueOrZero(type.getPlafondExoneration());
                exoneration.setEmployee(employee);
                exoneration.setTypeIndemnite(type);
                exoneration.setIndemniteEmploye(saved);
                exoneration.setLibelle(type.getName());
                exoneration.setTauxExonere(taux);
                exoneration.setPlafondExonere(plafond);
                exoneration.setMontant(calculateExoneration(saved.getMontant(), taux, plafond));
                exonerationRepository.save(exoneration);
            }
        }

        recalculateSituationIndemnites(employee.getId());

        return toDto(saved);
    }

    @Transactional
    public void deleteIndemnite(String idOrMatricule, Long indemniteId) {
        Employee employee = resolveEmployee(idOrMatricule);
        IndemniteEmploye indemnite = indemniteRepository.findById(indemniteId)
                .orElseThrow(() -> new ResourceNotFoundException("Indemnité non trouvée : " + indemniteId));

        if (!indemnite.getEmployee().getId().equals(employee.getId())) {
            throw new IllegalArgumentException("Cette indemnité n'appartient pas à cet employé");
        }

        exonerationRepository.deleteByIndemniteEmployeId(indemniteId);
        indemniteRepository.delete(indemnite);
        recalculateSituationIndemnites(employee.getId());
    }

    @Transactional
    public void recalculateSituationIndemnites(Long employeeId) {
        List<IndemniteEmploye> allIndem = indemniteRepository.findByEmployeeId(employeeId);
        double totalIndemnites = allIndem.stream()
                .filter(i -> !Boolean.FALSE.equals(i.getActif()))
                .mapToDouble(i -> valueOrZero(i.getMontant())).sum();

        situationRepository.findByEmployeeId(employeeId).ifPresent(situation -> {
            situation.setTotalIndemnites(totalIndemnites);
            double base = valueOrZero(situation.getSalaireBase());
            double sur = valueOrZero(situation.getSurSalaire());
            situation.setSalaireBrut(base + sur + totalIndemnites);
            situationRepository.save(situation);
        });
    }

    @Transactional(readOnly = true)
    public List<ExonerationEmployeDto> getExonerations(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        return exonerationRepository.findByEmployeeId(employee.getId()).stream().map(this::toDto).toList();
    }

    @Transactional
    public void deleteForEmployee(Long employeeId) {
        bulletinRepository.deleteByEmployeeId(employeeId);
        bulletinRepository.flush();
        avoirRepository.deleteByEmployeeId(employeeId);
        avoirRepository.flush();
        precompteRepository.deleteByEmployeeId(employeeId);
        precompteRepository.flush();
        exonerationRepository.deleteByEmployeeId(employeeId);
        exonerationRepository.flush();
        indemniteRepository.deleteByEmployeeId(employeeId);
        indemniteRepository.flush();
        situationRepository.deleteByEmployeeId(employeeId);
        informationRepository.findByEmployeeId(employeeId)
                .ifPresent(information -> informationRetenueRepository.deleteByInformationSalarialeId(information.getId()));
        informationRepository.deleteByEmployeeId(employeeId);
        familleRepository.deleteByEmployeeId(employeeId);
    }

    private InformationSalariale upsertInformation(Employee employee, String modePaiement, String banque,
                                                     String iban, String intituleCompte) {
        InformationSalariale entity = informationRepository.findByEmployeeId(employee.getId())
                .orElseGet(InformationSalariale::new);
        entity.setEmployee(employee);
        if (modePaiement != null) entity.setModePaiement(modePaiement);
        if (banque != null) entity.setBanque(banque);
        if (iban != null) entity.setIban(iban);
        if (intituleCompte != null) entity.setIntituleCompte(intituleCompte);
        return informationRepository.save(entity);
    }

    private Employee resolveEmployee(String value) {
        try {
            return employeeRepository.findById(Long.parseLong(value))
                    .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé: " + value));
        } catch (NumberFormatException e) {
            return employeeRepository.findByMatricule(value)
                    .orElseThrow(() -> new ResourceNotFoundException("Employé non trouvé: " + value));
        }
    }

    private FamilleEmployeDto toDto(FamilleEmploye e) {
        return new FamilleEmployeDto(e.getId(), e.getEmployee().getId(), e.getNom(), e.getPrenom(),
                e.getDateNaissance(), e.getLienParente(), e.getEstCharge(), e.getStatut());
    }

    private void copyFamille(FamilleEmployeDto dto, FamilleEmploye entity) {
        if (dto.getNom() == null || dto.getNom().isBlank()) {
            throw new IllegalArgumentException("Le nom est obligatoire");
        }
        if (dto.getPrenom() == null || dto.getPrenom().isBlank()) {
            throw new IllegalArgumentException("Le prénom est obligatoire");
        }
        if (dto.getLienParente() == null) {
            throw new IllegalArgumentException("Le lien de parenté est obligatoire");
        }
        entity.setNom(dto.getNom().trim());
        entity.setPrenom(dto.getPrenom().trim());
        entity.setDateNaissance(dto.getDateNaissance());
        entity.setLienParente(dto.getLienParente());
        entity.setEstCharge(Boolean.TRUE.equals(dto.getEstCharge()));
        entity.setStatut(dto.getStatut());
    }

    private SituationSalarialeDto toDto(SituationSalariale e) {
        return new SituationSalarialeDto(e.getId(), e.getEmployee().getId(), idOf(e.getGrilleSalariale()),
                e.getGrilleSalariale() == null ? null : e.getGrilleSalariale().getCode(), idOf(e.getCategorie()),
                label(e.getCategorie()), idOf(e.getEchelon()), label(e.getEchelon()), idOf(e.getGrade()),
                label(e.getGrade()), e.getSalaireBase(), e.getSurSalaire(), e.getTotalIndemnites(), e.getSalaireBrut());
    }

    private IndemniteEmployeDto toDto(IndemniteEmploye e) {
        return new IndemniteEmployeDto(e.getId(), e.getTypeIndemnite().getId(), e.getTypeIndemnite().getCode(),
                e.getTypeIndemnite().getName(), e.getEmployee().getId(), idOf(e.getParametrageIndemnite()), e.getMontant(), e.getActif());
    }

    private ExonerationEmployeDto toDto(ExonerationEmploye e) {
        return new ExonerationEmployeDto(e.getId(), e.getTypeIndemnite().getId(), e.getTypeIndemnite().getCode(),
                e.getTypeIndemnite().getName(), e.getEmployee().getId(), idOf(e.getIndemniteEmploye()), e.getMontant(),
                e.getTauxExonere(), e.getPlafondExonere());
    }

    /**
     * Résolution dynamique des indemnités selon la convention BPBF (3 tableaux officiels) :
     * - Tableau 2 : Si l'employé a une Fonction Nominative (Directeur, Responsable, Chef de service, Chef d'agence)
     *               -> TABLEAU 2 SEULEMENT, SANS CUMUL avec le Tableau 1 (même s'il a un grade).
     * - Tableau 1 : Si pas de fonction de nomination -> Indemnités statutaires du Grade (Logement, Transport, Sujétion).
     * - Tableau 3 : Si l'employé a un Emploi spécifique (Caissier, Cash point, Chauffeur, etc.)
     *               -> TABLEAU 3 CUMULÉ au TABLEAU 1 (ceux du grade).
     */
    private List<ParametrageIndemnite> resolveApplicableIndemnites(Employee employee, Long fonctionId, Long emploiId, Long gradeId, Long categorieId) {
        List<ParametrageIndemnite> applicable = new ArrayList<>();

        // RÈGLE 1 (Tableau 2) : Fonction Nominative exclusive
        List<ParametrageIndemnite> nominationIndemnites = fonctionId != null
                ? parametrageRepository.findNominationByFonction(fonctionId)
                : Collections.emptyList();

        if (!nominationIndemnites.isEmpty()) {
            applicable.addAll(nominationIndemnites);
            return applicable;
        }

        // RÈGLE 2 (Tableau 1) : Indemnités Statutaires du Grade
        List<ParametrageIndemnite> statutaires = parametrageRepository.findStatutairesByGradeAndCategorie(gradeId, categorieId);
        if (statutaires.isEmpty() && (gradeId != null || categorieId != null || employee != null)) {
            // Fallback textuel sur grade/catégorie
            String catCode = (employee != null && employee.getCategorieObj() != null && employee.getCategorieObj().getCode() != null)
                    ? employee.getCategorieObj().getCode().toUpperCase(Locale.ROOT) : "";
            List<ParametrageIndemnite> all = parametrageRepository.findAll();
            for (ParametrageIndemnite p : all) {
                if (!Boolean.TRUE.equals(p.getActif()) || p.getTypeIndemniteObj() == null) continue;
                if ("ORDINAIRE".equalsIgnoreCase(p.getRegleType())) {
                    if (p.getCode() != null && catCode.length() > 0 && p.getCode().toUpperCase(Locale.ROOT).contains(catCode)) {
                        statutaires.add(p);
                    }
                }
            }
        }
        applicable.addAll(deduplicateStatutaires(statutaires));

        // RÈGLE 3 (Tableau 3) : Primes Spécifiques d'Emploi cumulées au Grade
        List<ParametrageIndemnite> specifiques = new ArrayList<>();
        if (emploiId != null || fonctionId != null) {
            specifiques = parametrageRepository.findSpecifiqueByEmploiOrFonction(emploiId, fonctionId);
        }
        if (specifiques.isEmpty() && employee != null) {
            String empNom = (employee.getEmploi() != null && employee.getEmploi().getName() != null)
                    ? employee.getEmploi().getName().toUpperCase(Locale.ROOT) : "";
            String fctNom = (employee.getFonction() != null && employee.getFonction().getName() != null)
                    ? employee.getFonction().getName().toUpperCase(Locale.ROOT) : "";
            if (empNom.contains("CASH POINT") || fctNom.contains("CASH POINT") || empNom.contains("CASHPOINT") || fctNom.contains("CASHPOINT")) {
                List<ParametrageIndemnite> all = parametrageRepository.findAll();
                for (ParametrageIndemnite p : all) {
                    if (!Boolean.TRUE.equals(p.getActif()) || p.getTypeIndemniteObj() == null) continue;
                    if ("SPECIFIQUE".equalsIgnoreCase(p.getRegleType()) && p.getCode() != null && p.getCode().contains("GCP")) {
                        specifiques.add(p);
                    }
                }
            }
        }
        applicable.addAll(specifiques);

        return applicable;
    }

    private List<ParametrageIndemnite> deduplicateStatutaires(List<ParametrageIndemnite> list) {
        if (list == null || list.isEmpty()) return Collections.emptyList();
        Map<Long, ParametrageIndemnite> map = new LinkedHashMap<>();
        for (ParametrageIndemnite p : list) {
            if (p.getTypeIndemniteObj() == null || p.getTypeIndemniteObj().getId() == null) continue;
            Long typeId = p.getTypeIndemniteObj().getId();
            ParametrageIndemnite existing = map.get(typeId);
            if (existing == null) {
                map.put(typeId, p);
            } else {
                // Règle spécifique à la catégorie prioritaire sur la règle globale de grade
                if (existing.getCategorieObj() == null && p.getCategorieObj() != null) {
                    map.put(typeId, p);
                }
            }
        }
        return new ArrayList<>(map.values());
    }

    @Transactional
    public void syncAllEmployees() {
        for (Employee emp : employeeRepository.findAll()) {
            try {
                sync(emp, null);
            } catch (Exception ignored) {}
        }
    }

    private static Long idOf(Object entity) {
        if (entity == null) return null;
        if (entity instanceof Fonction e) return e.getId();
        if (entity instanceof Emploi e) return e.getId();
        if (entity instanceof Grade e) return e.getId();
        if (entity instanceof Categorie e) return e.getId();
        if (entity instanceof Echelon e) return e.getId();
        if (entity instanceof GrilleSalariale e) return e.getId();
        if (entity instanceof ParametrageIndemnite e) return e.getId();
        if (entity instanceof IndemniteEmploye e) return e.getId();
        return null;
    }

    private static String label(Categorie e) { return e == null ? null : (e.getLibelle() != null ? e.getLibelle() : e.getCode()); }
    private static String label(Echelon e) { return e == null ? null : (e.getLibelle() != null ? e.getLibelle() : e.getCode()); }
    private static String label(Grade e) { return e == null ? null : (e.getLibelle() != null ? e.getLibelle() : e.getCode()); }
    private static double valueOrZero(Double value) { return value == null ? 0.0 : value; }
}
