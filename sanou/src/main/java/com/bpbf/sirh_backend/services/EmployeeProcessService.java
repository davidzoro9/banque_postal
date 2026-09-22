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
    private final GrilleSalarialeRepository grilleSalarialeRepository;
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
        List<IndemniteEmploye> existingList = indemniteRepository.findByEmployeeId(employee.getId());
        Map<Long, IndemniteEmploye> existingByParamId = new LinkedHashMap<>();
        Map<Long, IndemniteEmploye> existingByTypeId = new LinkedHashMap<>();
        for (IndemniteEmploye ie : existingList) {
            if (ie.getParametrageIndemnite() != null && ie.getParametrageIndemnite().getId() != null) {
                existingByParamId.put(ie.getParametrageIndemnite().getId(), ie);
            }
            if (ie.getTypeIndemnite() != null && ie.getTypeIndemnite().getId() != null) {
                existingByTypeId.put(ie.getTypeIndemnite().getId(), ie);
            }
        }

        List<IndemniteEmploye> current = new ArrayList<>();
        Set<Long> processedIds = new HashSet<>();
        for (ParametrageIndemnite parametrage : applicable) {
            if (parametrage.getTypeIndemniteObj() == null) continue;
            Long typeId = parametrage.getTypeIndemniteObj().getId();

            IndemniteEmploye indemnite = existingByParamId.get(parametrage.getId());
            if (indemnite == null && typeId != null) {
                indemnite = existingByTypeId.get(typeId);
            }

            if (indemnite == null) {
                indemnite = new IndemniteEmploye();
                indemnite.setEmployee(employee);
                indemnite.setParametrageIndemnite(parametrage);
                indemnite.setActif(true);
            } else {
                indemnite.setParametrageIndemnite(parametrage);
            }

            TypeIndemnite type = parametrage.getTypeIndemniteObj();
            indemnite.setTypeIndemnite(type);
            indemnite.setLibelle(type.getName());

            String tCode = (type.getCode() != null ? type.getCode() : "").toUpperCase();
            String tName = (type.getName() != null ? type.getName() : "").toUpperCase();
            boolean isTransport = tCode.contains("TRP") || tCode.contains("TRANS") || tName.contains("TRANSPORT") || tName.contains("DÉPLACEMENT") || tName.contains("DEPLACEMENT");
            boolean isLogement = tCode.contains("LOG") || tCode.contains("MAISON") || tName.contains("LOGEMENT");

            if (isTransport) {
                indemnite.setMontant(valueOrZero(parametrage.getTaux()));
                if (Boolean.TRUE.equals(employee.getVehiculeFourni())) {
                    indemnite.setActif(false);
                } else {
                    indemnite.setActif(true);
                }
            } else if (isLogement) {
                indemnite.setMontant(valueOrZero(parametrage.getTaux()));
                if (Boolean.TRUE.equals(employee.getLogementFourni())) {
                    indemnite.setActif(false);
                } else {
                    indemnite.setActif(true);
                }
            } else {
                indemnite.setMontant(valueOrZero(parametrage.getTaux()));
                if (indemnite.getActif() == null) {
                    indemnite.setActif(true);
                }
            }

            IndemniteEmploye saved = indemniteRepository.save(indemnite);
            current.add(saved);
            if (saved.getId() != null) {
                processedIds.add(saved.getId());
            }
        }

        // Supprimer uniquement les indemnités obsolètes qui étaient liées à un paramétrage qui ne s'applique plus
        for (IndemniteEmploye obsolete : existingList) {
            if (obsolete.getId() != null && !processedIds.contains(obsolete.getId()) && obsolete.getParametrageIndemnite() != null) {
                exonerationRepository.deleteByIndemniteEmployeId(obsolete.getId());
                indemniteRepository.delete(obsolete);
            }
        }
        exonerationRepository.flush();
        indemniteRepository.flush();

        double totalIndemnites = current.stream()
                .filter(i -> !Boolean.FALSE.equals(i.getActif()))
                .mapToDouble(i -> valueOrZero(i.getMontant())).sum();

        // Résolution de la Grille Salariale si non rattachée directement à l'employé
        GrilleSalariale grille = employee.getGrilleSalariale();
        if (grille == null && employee.getCategorieObj() != null && employee.getEchelonObj() != null) {
            grille = grilleSalarialeRepository.findByCategorieObjIdAndEchelonObjId(
                    employee.getCategorieObj().getId(), employee.getEchelonObj().getId()
            ).orElse(null);
            if (grille != null) {
                employee.setGrilleSalariale(grille);
            }
        }
        if (grille == null && employee.getGradeObj() != null) {
            List<GrilleSalariale> byGrade = grilleSalarialeRepository.findByGradeObjId(employee.getGradeObj().getId());
            if (!byGrade.isEmpty()) {
                grille = byGrade.get(0);
                employee.setGrilleSalariale(grille);
            }
        }

        SituationSalariale situation = situationRepository.findByEmployeeId(employee.getId())
                .orElseGet(SituationSalariale::new);
        situation.setEmployee(employee);
        situation.setGrilleSalariale(grille);
        situation.setCategorie(employee.getCategorieObj() != null ? employee.getCategorieObj() : (grille != null ? grille.getCategorieObj() : null));
        situation.setEchelon(employee.getEchelonObj() != null ? employee.getEchelonObj() : (grille != null ? grille.getEchelonObj() : null));
        situation.setGrade(employee.getGradeObj() != null ? employee.getGradeObj() : (grille != null ? grille.getGradeObj() : null));

        double base = 0.0;
        if (grille != null && grille.getSalaireBase() != null) {
            base = valueOrZero(grille.getSalaireBase());
        } else if (dto != null && dto.getSalaireBase() != null) {
            base = valueOrZero(dto.getSalaireBase());
        }
        Double surSalaire = 0.0;
        if (employee.getSurSalaire() != null) {
            surSalaire = employee.getSurSalaire();
        } else if (dto != null && dto.getSurSalaire() != null) {
            surSalaire = dto.getSurSalaire();
        }
        if (surSalaire < 0.0) {
            surSalaire = 0.0;
        }
        double salBrut = base + (surSalaire != null ? surSalaire : 0.0) + totalIndemnites;
        situation.setSalaireBase(base);
        situation.setSurSalaire(surSalaire);
        situation.setTotalIndemnites(totalIndemnites);
        situation.setSalaireBrut(salBrut);
        situationRepository.save(situation);

        // Brut fiscal = Salaire brut total - CNSS employé (5.5%)
        // C'est la base de référence pour calculer les limites d'exonération (guide ResHum : "Base d'exo")
        double brutTotal = base + (employee.getSurSalaire() != null ? employee.getSurSalaire() : 0.0) + totalIndemnites;
        double cnssAgent = Math.min(brutTotal, 800000.0) * 5.5 / 100.0;
        double brutFiscal = brutTotal - cnssAgent; // Brut après CNSS = base des taux d'exonération

        for (IndemniteEmploye indemnite : current) {
            if (Boolean.FALSE.equals(indemnite.getActif()) || valueOrZero(indemnite.getMontant()) == 0.0) {
                exonerationRepository.deleteByIndemniteEmployeId(indemnite.getId());
                continue;
            }
            TypeIndemnite type = indemnite.getTypeIndemnite();
            if (type == null) continue;
            double taux = valueOrZero(type.getTauxExoneration());
            double plafond = valueOrZero(type.getPlafondExoneration());

            if (taux <= 0.0 && plafond <= 0.0) {
                exonerationRepository.deleteByIndemniteEmployeId(indemnite.getId());
                continue;
            }

            ExonerationEmploye exoneration = exonerationRepository.findByIndemniteEmployeId(indemnite.getId())
                    .orElseGet(ExonerationEmploye::new);
            exoneration.setEmployee(employee);
            exoneration.setTypeIndemnite(type);
            exoneration.setIndemniteEmploye(indemnite);
            exoneration.setLibelle(type.getName());
            exoneration.setTauxExonere(taux);
            exoneration.setPlafondExonere(plafond);
            // Guide ResHum / CGI BF : Exo = MIN(Montant servi, Taux% × Brut fiscal, Plafond)
            // Le taux est appliqué sur le BRUT FISCAL (brut global - CNSS), pas sur le montant de l'indemnité
            double exoAutorisee = calculateExonerationAutorisee(brutFiscal, taux, plafond);
            double exoReelle;
            if (exoneration.getId() != null && exoneration.getMontant() != null && exoneration.getMontant() > 0 && exoneration.getMontant() <= exoAutorisee) {
                exoReelle = exoneration.getMontant();
            } else {
                exoReelle = Math.min(valueOrZero(indemnite.getMontant()), exoAutorisee);
            }
            exoneration.setMontantAutorise(exoAutorisee); // limite théorique affichée dans le tableau
            exoneration.setMontant(exoReelle);            // exonération réellement accordée
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

    /**
     * Calcule le montant d'exonération autorisé (limite théorique) sur la base du brut fiscal.
     * Formule guide ResHum / CGI BF : MIN(taux% × brutFiscal, plafond)
     * C'est la limite maximale accordée AVANT comparaison avec le montant réellement servi.
     */
    static double calculateExonerationAutorisee(double brutFiscal, double taux, double plafond) {
        if (taux <= 0.0 && plafond <= 0.0) return 0.0;
        double premiereLimite = (taux > 0.0) ? (brutFiscal * taux / 100.0) : Double.MAX_VALUE;
        double deuxiemeLimite = (plafond > 0.0) ? plafond : Double.MAX_VALUE;
        return Math.min(premiereLimite, deuxiemeLimite);
    }

    static double calculateExoneration(Double montant, Double taux, Double plafond) {
        return calculateExoneration(montant, null, taux, plafond);
    }

    static double calculateExoneration(Double montant, Double brut, Double taux, Double plafond) {
        double m = valueOrZero(montant);
        if (m <= 0.0) return 0.0;
        double t = valueOrZero(taux);
        double p = valueOrZero(plafond);
        if (t <= 0.0 && p <= 0.0) return 0.0;

        // CGI Burkina Faso — Circulaire d'application ministérielle :
        // Première limite : Taux légal calculé sur le Salaire Brut fiscal (SB = Brut global - CNSS)
        // Deuxième limite : Plafond légal en valeur absolue (FCFA)
        // Exonération autorisée = MIN(Montant servi, Première limite, Deuxième limite)
        double baseRef = (brut != null && brut > 0.0) ? brut : m;
        double premiereLimite = (t > 0.0) ? (baseRef * t / 100.0) : Double.MAX_VALUE;
        double deuxiemeLimite = (p > 0.0) ? p : Double.MAX_VALUE;

        return Math.min(m, Math.min(premiereLimite, deuxiemeLimite));
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
        try {
            sync(employee, null);
        } catch (Exception ignored) {}
        return informationCalculService.toDto(informationCalculService.recalculate(employee));
    }

    @Transactional
    public InformationSalarialeDto simulateSalary(String idOrMatricule, Double customSalaireBase, Double customSurSalaire) {
        return simulateSalary(idOrMatricule, customSalaireBase, customSurSalaire, null);
    }

    @Transactional
    public InformationSalarialeDto simulateSalary(String idOrMatricule, Double customSalaireBase, Double customSurSalaire, Integer customAncienneteReprise) {
        Employee employee = resolveEmployee(idOrMatricule);
        try {
            sync(employee, null);
        } catch (Exception ignored) {}
        return informationCalculService.simulate(employee, customSalaireBase, customSurSalaire, customAncienneteReprise);
    }

    @Transactional
    public SituationSalarialeDto getSituation(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        try {
            sync(employee, null);
        } catch (Exception ignored) {}
        return situationRepository.findByEmployeeId(employee.getId()).map(this::toDto)
                .orElseGet(() -> buildFallbackSituationDto(employee));
    }

    @Transactional
    public List<IndemniteEmployeDto> getIndemnites(String idOrMatricule) {
        Employee employee = resolveEmployee(idOrMatricule);
        try {
            sync(employee, null);
        } catch (Exception ignored) {}
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
        if (nouveauStatut && (indemnite.getMontant() == null || indemnite.getMontant() == 0.0)) {
            if (indemnite.getParametrageIndemnite() != null && indemnite.getParametrageIndemnite().getTaux() != null) {
                indemnite.setMontant(indemnite.getParametrageIndemnite().getTaux());
            }
        }

        TypeIndemnite type = indemnite.getTypeIndemnite();
        if (type != null) {
            String tCode = (type.getCode() != null ? type.getCode() : "").toUpperCase();
            String tName = (type.getName() != null ? type.getName() : "").toUpperCase();
            boolean isTransport = tCode.contains("TRP") || tCode.contains("TRANS") || tName.contains("TRANSPORT") || tName.contains("DÉPLACEMENT") || tName.contains("DEPLACEMENT");
            boolean isLogement = tCode.contains("LOG") || tCode.contains("MAISON") || tName.contains("LOGEMENT");

            if (isTransport) {
                employee.setVehiculeFourni(!nouveauStatut);
                employeeRepository.save(employee);
            }
            if (isLogement) {
                employee.setLogementFourni(!nouveauStatut);
                employeeRepository.save(employee);
            }
        }

        IndemniteEmploye saved = indemniteRepository.save(indemnite);

        // Mettre à jour l'exonération correspondante
        if (Boolean.FALSE.equals(saved.getActif()) || valueOrZero(saved.getMontant()) == 0.0) {
            exonerationRepository.deleteByIndemniteEmployeId(saved.getId());
        } else {
            type = saved.getTypeIndemnite();
            if (type != null) {
                ExonerationEmploye exoneration = exonerationRepository.findByIndemniteEmployeId(saved.getId())
                        .orElseGet(ExonerationEmploye::new);
                double taux = valueOrZero(type.getTauxExoneration());
                double plafond = valueOrZero(type.getPlafondExoneration());
                double brutTotal = valueOrZero(employee.getGrilleSalariale() != null
                        ? employee.getGrilleSalariale().getSalaireBase() : null)
                        + (employee.getSurSalaire() != null ? employee.getSurSalaire() : 0.0)
                        + indemniteRepository.findByEmployeeId(employee.getId()).stream()
                                .filter(i -> !Boolean.FALSE.equals(i.getActif()))
                                .mapToDouble(i -> valueOrZero(i.getMontant())).sum();
                double cnssAgent = Math.min(brutTotal, 800000.0) * 5.5 / 100.0;
                double brutFiscal = brutTotal - cnssAgent;

                double exoAutorisee = calculateExonerationAutorisee(brutFiscal, taux, plafond);
                double exoReelle = Math.min(valueOrZero(saved.getMontant()), exoAutorisee);
                exoneration.setMontantAutorise(exoAutorisee);
                exoneration.setMontant(exoReelle);
                exonerationRepository.save(exoneration);
            }
        }

        recalculateSituationIndemnites(employee.getId());
        informationCalculService.recalculate(employee);

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
        informationCalculService.recalculate(employee);
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
        Employee emp = e.getEmployee();
        GrilleSalariale grille = e.getGrilleSalariale() != null ? e.getGrilleSalariale() : (emp != null ? emp.getGrilleSalariale() : null);
        Categorie cat = e.getCategorie() != null ? e.getCategorie() : (emp != null ? emp.getCategorieObj() : (grille != null ? grille.getCategorieObj() : null));
        Echelon ech = e.getEchelon() != null ? e.getEchelon() : (emp != null ? emp.getEchelonObj() : (grille != null ? grille.getEchelonObj() : null));
        Grade grade = e.getGrade() != null ? e.getGrade() : (emp != null ? emp.getGradeObj() : (grille != null ? grille.getGradeObj() : null));

        Double sb = e.getSalaireBase();
        if ((sb == null || sb == 0.0) && grille != null && grille.getSalaireBase() != null) {
            sb = grille.getSalaireBase();
        }
        Double surSalaire = e.getSurSalaire() != null ? e.getSurSalaire() : (emp != null && emp.getSurSalaire() != null ? emp.getSurSalaire() : 0.0);
        Double totalInd = e.getTotalIndemnites() != null ? e.getTotalIndemnites() : 0.0;
        Double brut = (sb != null ? sb : 0.0) + (surSalaire != null ? surSalaire : 0.0) + totalInd;

        String gradeLib = label(grade);
        if (gradeLib == null && grille != null) {
            gradeLib = grille.getGrade();
        }

        return new SituationSalarialeDto(e.getId(), emp != null ? emp.getId() : null, idOf(grille),
                grille == null ? null : grille.getCode(), idOf(cat),
                label(cat), idOf(ech), label(ech), idOf(grade),
                gradeLib, sb, surSalaire, totalInd, brut);
    }

    private SituationSalarialeDto buildFallbackSituationDto(Employee employee) {
        GrilleSalariale grille = employee.getGrilleSalariale();
        if (grille == null && employee.getCategorieObj() != null && employee.getEchelonObj() != null) {
            grille = grilleSalarialeRepository.findByCategorieObjIdAndEchelonObjId(
                    employee.getCategorieObj().getId(), employee.getEchelonObj().getId()
            ).orElse(null);
        }
        if (grille == null && employee.getGradeObj() != null) {
            List<GrilleSalariale> list = grilleSalarialeRepository.findByGradeObjId(employee.getGradeObj().getId());
            if (!list.isEmpty()) grille = list.get(0);
        }

        Categorie cat = employee.getCategorieObj() != null ? employee.getCategorieObj() : (grille != null ? grille.getCategorieObj() : null);
        Echelon ech = employee.getEchelonObj() != null ? employee.getEchelonObj() : (grille != null ? grille.getEchelonObj() : null);
        Grade grade = employee.getGradeObj() != null ? employee.getGradeObj() : (grille != null ? grille.getGradeObj() : null);

        Double sb = (grille != null && grille.getSalaireBase() != null) ? grille.getSalaireBase() : 0.0;
        Double surSalaire = employee.getSurSalaire() != null ? employee.getSurSalaire() : 0.0;

        double totalInd = indemniteRepository.findByEmployeeId(employee.getId()).stream()
                .filter(i -> !Boolean.FALSE.equals(i.getActif()))
                .mapToDouble(i -> valueOrZero(i.getMontant()))
                .sum();

        Double brut = sb + surSalaire + totalInd;

        String gradeLib = label(grade);
        if (gradeLib == null && grille != null) {
            gradeLib = grille.getGrade();
        }

        return new SituationSalarialeDto(
                null,
                employee.getId(),
                idOf(grille),
                grille == null ? null : grille.getCode(),
                idOf(cat),
                label(cat),
                idOf(ech),
                label(ech),
                idOf(grade),
                gradeLib,
                sb,
                surSalaire,
                totalInd,
                brut
        );
    }

    private IndemniteEmployeDto toDto(IndemniteEmploye e) {
        Long typeId = e.getTypeIndemnite() != null ? e.getTypeIndemnite().getId() : null;
        String typeCode = e.getTypeIndemnite() != null ? e.getTypeIndemnite().getCode() : null;
        String typeName = e.getTypeIndemnite() != null ? e.getTypeIndemnite().getName() : (e.getLibelle() != null ? e.getLibelle() : "Indemnité");
        return new IndemniteEmployeDto(e.getId(), typeId, typeCode,
                typeName, e.getEmployee() != null ? e.getEmployee().getId() : null, idOf(e.getParametrageIndemnite()), e.getMontant(), e.getActif());
    }

    private ExonerationEmployeDto toDto(ExonerationEmploye e) {
        ExonerationEmployeDto dto = new ExonerationEmployeDto();
        dto.setId(e.getId());
        dto.setTypeIndemniteId(e.getTypeIndemnite().getId());
        dto.setTypeIndemniteCode(e.getTypeIndemnite().getCode());
        dto.setLibelle(e.getTypeIndemnite().getName());
        dto.setEmployeeId(e.getEmployee().getId());
        dto.setIndemniteEmployeId(idOf(e.getIndemniteEmploye()));
        dto.setMontant(e.getMontant());
        dto.setMontantAutorise(e.getMontantAutorise()); // limite théorique exposée au frontend
        dto.setTauxExonere(e.getTauxExonere());
        dto.setPlafondExonere(e.getPlafondExonere());
        return dto;
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
        List<ParametrageIndemnite> allActive = parametrageRepository.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getActif()) && p.getTypeIndemniteObj() != null)
                .toList();

        // 1. RÈGLE NOMINATION (Tableau 2) : Si la fonction de l'employé possède des indemnités de nomination configurées en base
        List<ParametrageIndemnite> nominationIndemnites = new ArrayList<>();
        if (fonctionId != null) {
            for (ParametrageIndemnite p : allActive) {
                if ("NOMINATION".equalsIgnoreCase(p.getRegleType())) {
                    if (p.getFonctionObj() != null && p.getFonctionObj().getId().equals(fonctionId)) {
                        nominationIndemnites.add(p);
                    }
                }
            }
        }

        if (!nominationIndemnites.isEmpty()) {
            applicable.addAll(nominationIndemnites);
        } else {
            // 2. RÈGLE STATUTAIRE (Tableau 1) : Indemnités Statutaires du Grade et de la Catégorie
            List<ParametrageIndemnite> statutaires = new ArrayList<>();
            for (ParametrageIndemnite p : allActive) {
                if ("ORDINAIRE".equalsIgnoreCase(p.getRegleType()) || (p.getFonctionObj() == null && p.getEmploiObj() == null)) {
                    boolean matchGrade = (gradeId != null && p.getGradeObj() != null && p.getGradeObj().getId().equals(gradeId));
                    boolean matchCat = (categorieId != null && p.getCategorieObj() != null && p.getCategorieObj().getId().equals(categorieId));

                    if (matchGrade && (p.getCategorieObj() == null || matchCat)) {
                        statutaires.add(p);
                    } else if (matchCat && p.getGradeObj() == null) {
                        statutaires.add(p);
                    }
                }
            }
            applicable.addAll(deduplicateStatutaires(statutaires));
        }

        // 3. RÈGLE SPÉCIFIQUE (Tableau 3) : Primes Spécifiques rattachées au Poste / Emploi ou à la Fonction en base
        String empNom = (employee != null && employee.getEmploi() != null && employee.getEmploi().getName() != null)
                ? normalizeText(employee.getEmploi().getName()) : "";
        String empCode = (employee != null && employee.getEmploi() != null && employee.getEmploi().getCode() != null)
                ? normalizeText(employee.getEmploi().getCode()) : "";
        String fctNom = (employee != null && employee.getFonction() != null && employee.getFonction().getName() != null)
                ? normalizeText(employee.getFonction().getName()) : "";
        String fctCode = (employee != null && employee.getFonction() != null && employee.getFonction().getCode() != null)
                ? normalizeText(employee.getFonction().getCode()) : "";

        List<ParametrageIndemnite> specifiques = new ArrayList<>();
        for (ParametrageIndemnite p : allActive) {
            boolean isSpec = "SPECIFIQUE".equalsIgnoreCase(p.getRegleType()) || p.getEmploiObj() != null ||
                    (p.getFonctionObj() != null && !"NOMINATION".equalsIgnoreCase(p.getRegleType()));

            if (!isSpec) continue;

            boolean matched = false;

            // A. Correspondance par Clé Primaire de l'Emploi (Poste)
            if (p.getEmploiObj() != null) {
                Long pEmpId = p.getEmploiObj().getId();
                String pEmpNom = normalizeText(p.getEmploiObj().getName());
                String pEmpCode = normalizeText(p.getEmploiObj().getCode());

                if (emploiId != null && pEmpId.equals(emploiId)) {
                    matched = true;
                } else if (!pEmpNom.isEmpty() && (pEmpNom.equals(empNom) || pEmpNom.equals(fctNom))) {
                    matched = true;
                } else if (!pEmpCode.isEmpty() && (pEmpCode.equals(empCode) || pEmpCode.equals(fctCode))) {
                    matched = true;
                }
            }

            // B. Correspondance par Clé Primaire de la Fonction
            if (!matched && p.getFonctionObj() != null) {
                Long pFctId = p.getFonctionObj().getId();
                String pFctNom = normalizeText(p.getFonctionObj().getName());
                String pFctCode = normalizeText(p.getFonctionObj().getCode());

                if (fonctionId != null && pFctId.equals(fonctionId)) {
                    matched = true;
                } else if (!pFctNom.isEmpty() && (pFctNom.equals(fctNom) || pFctNom.equals(empNom))) {
                    matched = true;
                } else if (!pFctCode.isEmpty() && (pFctCode.equals(fctCode) || pFctCode.equals(empCode))) {
                    matched = true;
                }
            }

            if (matched) {
                specifiques.add(p);
            }
        }

        // Ajouter toutes les primes spécifiques trouvées (sans doublon de paramétrage)
        for (ParametrageIndemnite spec : specifiques) {
            if (!applicable.contains(spec)) {
                applicable.add(spec);
            }
        }

        return applicable;
    }

    private static String normalizeText(String s) {
        if (s == null) return "";
        return s.trim().toUpperCase(Locale.ROOT).replaceAll("[\\s_-]+", " ");
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

    /**
     * Recalcule les exonérations fiscales de TOUS les employés actifs.
     * À appeler après une modification des taux d'exonération des TypeIndemnite
     * ou après une correction de la formule de calcul.
     *
     * Formule appliquée (CGI Burkina Faso) :
     *   Exonération = MIN(Montant_Indemnité × Taux_Exo%, Plafond_Légal)
     *
     * @return Map avec les statistiques du recalcul
     */
    @Transactional
    public java.util.Map<String, Object> recalculerToutesLesExonerations() {
        List<Employee> employes = employeeRepository.findAll();
        int nbEmployes = 0;
        int nbExonerations = 0;
        int nbErreurs = 0;

        for (Employee emp : employes) {
            try {
                List<IndemniteEmploye> indemnites = indemniteRepository.findByEmployeeId(emp.getId());
                for (IndemniteEmploye indemnite : indemnites) {
                    if (Boolean.FALSE.equals(indemnite.getActif()) || valueOrZero(indemnite.getMontant()) == 0.0) {
                        exonerationRepository.deleteByIndemniteEmployeId(indemnite.getId());
                        continue;
                    }
                    TypeIndemnite type = indemnite.getTypeIndemnite();
                    if (type == null) continue;

                    double taux = valueOrZero(type.getTauxExoneration());
                    double plafond = valueOrZero(type.getPlafondExoneration());

                    if (taux <= 0.0 && plafond <= 0.0) {
                        // Aucune exonération → supprimer l'entrée si elle existe
                        exonerationRepository.deleteByIndemniteEmployeId(indemnite.getId());
                        continue;
                    }

                    ExonerationEmploye exoneration = exonerationRepository
                            .findByIndemniteEmployeId(indemnite.getId())
                            .orElseGet(ExonerationEmploye::new);

                    exoneration.setEmployee(emp);
                    exoneration.setTypeIndemnite(type);
                    exoneration.setIndemniteEmploye(indemnite);
                    exoneration.setLibelle(type.getName());
                    exoneration.setTauxExonere(taux);
                    double brutTotal = valueOrZero(emp.getGrilleSalariale() != null
                            ? emp.getGrilleSalariale().getSalaireBase() : null)
                            + (emp.getSurSalaire() != null ? emp.getSurSalaire() : 0.0)
                            + indemnites.stream().filter(i -> !Boolean.FALSE.equals(i.getActif())).mapToDouble(i -> valueOrZero(i.getMontant())).sum();
                    double cnssAgent = Math.min(brutTotal, 800000.0) * 5.5 / 100.0;
                    double brutFiscal = brutTotal - cnssAgent;

                    double exoAutorisee = calculateExonerationAutorisee(brutFiscal, taux, plafond);
                    double exoReelle = Math.min(valueOrZero(indemnite.getMontant()), exoAutorisee);
                    exoneration.setMontantAutorise(exoAutorisee);
                    exoneration.setMontant(exoReelle);
                    exonerationRepository.save(exoneration);
                    nbExonerations++;
                }

                // Recalculer aussi l'information salariale (base imposable, IUTS, etc.)
                informationCalculService.recalculate(emp);
                nbEmployes++;
            } catch (Exception e) {
                nbErreurs++;
            }
        }

        java.util.Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("statut", nbErreurs == 0 ? "SUCCÈS" : "PARTIEL");
        result.put("employesTraites", nbEmployes);
        result.put("exonerationsRecalculees", nbExonerations);
        result.put("erreurs", nbErreurs);
        result.put("message", "Exonérations recalculées avec la formule corrigée : Montant × Taux% plafonné");
        return result;
    }
}

