package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.BulletinDto;
import com.bpbf.sirh_backend.dtos.BulletinLineDto;
import com.bpbf.sirh_backend.entities.*;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BulletinService {

    private static final BigDecimal CENT = new BigDecimal("100");

    private final BulletinRepository bulletinRepository;
    private final BulletinLineRepository bulletinLineRepository;
    private final SessionPaieRepository sessionPaieRepository;
    private final EmployeeRepository employeeRepository;
    private final SituationSalarialeRepository situationRepository;
    private final IndemniteEmployeRepository indemniteRepository;
    private final ExonerationEmployeRepository exonerationRepository;
    private final FamilleEmployeRepository familleRepository;
    private final RetenueRepository retenueRepository;
    private final PrecompteEmployeRepository precompteRepository;
    private final AvoirEmployeRepository avoirRepository;
    private final AvoirRepository avoirVariableRepository;
    private final PrecompteRepository precompteVariableRepository;
    private final TropPercuRepository tropPercuRepository;
    private final ContratRepository contratRepository;

    @Transactional
    public List<BulletinDto> generateBulletinsForSession(Long sessionPaieId) {
        SessionPaie session = sessionPaieRepository.findById(sessionPaieId)
                .orElseThrow(() -> new RuntimeException("Session de paie non trouvée: #" + sessionPaieId));

        List<Employee> employees = employeeRepository.findAll();
        List<Bulletin> createdBulletins = new ArrayList<>();

        BigDecimal totalBrut = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalRetenues = BigDecimal.ZERO;
        BigDecimal totalCotisPatronales = BigDecimal.ZERO;

        for (Employee emp : employees) {
            // Check if bulletin already exists for this session & employee, if so remove/regenerate
            bulletinRepository.findBySessionPaieIdAndEmployeeId(session.getId(), emp.getId())
                    .ifPresent(existing -> {
                        bulletinRepository.delete(existing);
                        bulletinRepository.flush();
                    });

            Bulletin bulletin = computeAndSaveBulletin(session, emp);
            createdBulletins.add(bulletin);

            if (bulletin.getSalaireBrut() != null) totalBrut = totalBrut.add(bulletin.getSalaireBrut());
            if (bulletin.getSalaireNet() != null) totalNet = totalNet.add(bulletin.getSalaireNet());
            if (bulletin.getTotalRetenues() != null) totalRetenues = totalRetenues.add(bulletin.getTotalRetenues());
            if (bulletin.getTotalCotisationsPatronales() != null) totalCotisPatronales = totalCotisPatronales.add(bulletin.getTotalCotisationsPatronales());
        }

        session.setNombreEmployes(createdBulletins.size());
        session.setTotalBrut(totalBrut.setScale(2, RoundingMode.HALF_UP));
        session.setTotalNet(totalNet.setScale(2, RoundingMode.HALF_UP));
        session.setTotalRetenues(totalRetenues.setScale(2, RoundingMode.HALF_UP));
        session.setTotalCotisationsPatronales(totalCotisPatronales.setScale(2, RoundingMode.HALF_UP));
        session.setTotalMasseSalariale(totalBrut.add(totalCotisPatronales).setScale(2, RoundingMode.HALF_UP));
        session.setStatut("GENERE");
        sessionPaieRepository.save(session);

        return createdBulletins.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public Bulletin computeAndSaveBulletin(SessionPaie session, Employee emp) {
        SituationSalariale situation = situationRepository.findByEmployeeId(emp.getId()).orElse(null);
        BigDecimal salaireBase = BigDecimal.ZERO;
        if (situation != null && situation.getSalaireBase() != null && situation.getSalaireBase() > 0) {
            salaireBase = money(new BigDecimal(situation.getSalaireBase()));
        } else if (situation != null && situation.getGrilleSalariale() != null && situation.getGrilleSalariale().getBasicSalary() != null) {
            salaireBase = money(situation.getGrilleSalariale().getBasicSalary());
        } else if (emp.getGrilleSalariale() != null && emp.getGrilleSalariale().getBasicSalary() != null) {
            salaireBase = money(emp.getGrilleSalariale().getBasicSalary());
        }

        boolean isGratif = isGratification(session != null ? session.getTypeSession() : null);
        if (isGratif) {
            BulletinLine gratLine = new BulletinLine();
            gratLine.setCode("GRAT_ANN");
            gratLine.setLibelle("Gratification Annuelle (13ème Mois)");
            gratLine.setTypeLigne("GAIN");
            gratLine.setBaseCalcul(salaireBase);
            gratLine.setTaux(new BigDecimal("100.00"));
            gratLine.setMontant(salaireBase);
            gratLine.setOrdre(1);

            List<BulletinLine> lines = new ArrayList<>();
            lines.add(gratLine);

            Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
            Grade grade = emp.getGradeObj();

            String codeBulletin = String.format("BLT-%s-%s-%04d",
                    session.getMois() != null ? session.getMois() : "M",
                    session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear(),
                    emp.getId());

            Bulletin bulletin = new Bulletin();
            bulletin.setCode(codeBulletin);
            bulletin.setEmployee(emp);
            bulletin.setSessionPaie(session);
            bulletin.setGrade(grade);
            bulletin.setContrat(contrat);
            bulletin.setTypeSession("GRATIFICATION");
            bulletin.setScheduledWorkingDays(new BigDecimal("30.00"));
            bulletin.setWorkedDays(new BigDecimal("30.00"));
            bulletin.setSalaireBase(salaireBase);
            bulletin.setTotalIndemnites(BigDecimal.ZERO);
            bulletin.setTotalAvoirs(BigDecimal.ZERO);
            bulletin.setSalaireBrut(salaireBase);
            bulletin.setTotalExonerations(BigDecimal.ZERO);
            bulletin.setAbattementForfaitaire(BigDecimal.ZERO);
            bulletin.setBaseImposable(BigDecimal.ZERO);
            bulletin.setCotisationCnss(BigDecimal.ZERO);
            bulletin.setImpotIutsSansCharge(BigDecimal.ZERO);
            bulletin.setReductionIutsCharge(BigDecimal.ZERO);
            bulletin.setImpotIuts(BigDecimal.ZERO);
            bulletin.setTotalRetenuesSociales(BigDecimal.ZERO);
            bulletin.setTotalPrecomptes(BigDecimal.ZERO);
            bulletin.setTotalRetenues(BigDecimal.ZERO);
            bulletin.setTotalCotisationsPatronales(BigDecimal.ZERO);
            bulletin.setSalaireNet(salaireBase); // LE NET DEVIENT LE BRUT !
            bulletin.setStatut("GENERE");
            bulletin.setDateCalcul(LocalDateTime.now());

            bulletin = bulletinRepository.save(bulletin);

            gratLine.setBulletin(bulletin);
            bulletinLineRepository.save(gratLine);

            bulletin.setLines(lines);
            return bulletin;
        }

        // Indemnités
        List<IndemniteEmploye> indemnites = indemniteRepository.findByEmployeeId(emp.getId()).stream()
                .filter(row -> !Boolean.FALSE.equals(row.getActif()))
                .toList();

        BigDecimal totalIndemnites = indemnites.stream()
                .map(row -> money(row.getMontant()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Avoirs (Gains périodiques / rappels échelonnés / Primes variables)
        List<AvoirEmploye> avoirs = avoirRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        BigDecimal totalAvoirs = avoirs.stream()
                .map(AvoirEmploye::getMontantMensuel)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Avoirs créés via le module Variables Paie
        List<Avoir> avoirsVariables = avoirVariableRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        for (Avoir av : avoirsVariables) {
            if (av.getAmount() != null && av.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal m = av.getAmount();
                if (av.getEcheance() != null && av.getEcheance() > 1 && av.getMontantRestant() != null) {
                    m = av.getAmount().divide(new BigDecimal(av.getEcheance()), 0, RoundingMode.HALF_UP);
                }
                if (av.getMontantRestant() != null && av.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                    m = m.min(av.getMontantRestant());
                }
                totalAvoirs = totalAvoirs.add(m);
            }
        }

        BigDecimal remunerationBrute = money(salaireBase.add(totalIndemnites).add(totalAvoirs));

        // Exonérations fiscales
        BigDecimal totalExonerations = exonerationRepository.findByEmployeeId(emp.getId()).stream()
                .map(row -> money(row.getMontant()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Abattement forfaitaire
        Categorie cat = situation != null ? situation.getCategorie() : null;
        if (cat == null && situation != null && situation.getGrilleSalariale() != null) {
            cat = situation.getGrilleSalariale().getCategorieObj();
        }
        if (cat == null && emp.getCategorieObj() != null) {
            cat = emp.getCategorieObj();
        }
        BigDecimal tauxAbattement = (cat == null || cat.getTauxAbattement() == null) ? BigDecimal.ZERO : money(cat.getTauxAbattement());
        BigDecimal abattementForfaitaire = calculatePercentage(salaireBase, tauxAbattement);
        BigDecimal baseImposable = money(remunerationBrute.subtract(totalExonerations).subtract(abattementForfaitaire).max(BigDecimal.ZERO));

        // Retenues sociales / Cotisations
        List<Retenue> applicableRetenues = findApplicableRetenues(emp);
        BigDecimal totalRetenuesSociales = BigDecimal.ZERO;
        BigDecimal totalCotisationsPatronales = BigDecimal.ZERO;
        BigDecimal cotisationCnss = BigDecimal.ZERO;

        List<BulletinLine> lines = new ArrayList<>();
        int ordre = 1;

        // Ligne Salaire de Base
        BulletinLine salBaseLine = new BulletinLine();
        salBaseLine.setCode("SAL_BASE");
        salBaseLine.setLibelle("Salaire de Base");
        salBaseLine.setTypeLigne("GAIN");
        salBaseLine.setBaseCalcul(salaireBase);
        salBaseLine.setTaux(new BigDecimal("100.00"));
        salBaseLine.setMontant(salaireBase);
        salBaseLine.setOrdre(ordre++);
        lines.add(salBaseLine);

        // Lignes Indemnités
        for (IndemniteEmploye ind : indemnites) {
            BulletinLine indLine = new BulletinLine();
            indLine.setCode(ind.getTypeIndemnite() != null ? ind.getTypeIndemnite().getCode() : "INDEMNITE");
            indLine.setLibelle(ind.getLibelle() != null ? ind.getLibelle() : "Indemnité");
            indLine.setTypeLigne("GAIN");
            indLine.setBaseCalcul(salaireBase);
            indLine.setMontant(money(ind.getMontant()));
            indLine.setOrdre(ordre++);
            lines.add(indLine);
        }

        // Lignes Avoirs
        for (AvoirEmploye av : avoirs) {
            BulletinLine avLine = new BulletinLine();
            avLine.setRubriquePaie(av.getRubriquePaie());
            avLine.setCode("AVOIR_" + av.getId());
            avLine.setLibelle(av.getLibelle() + " (Échéance " + (av.getEcheancesTotal() - av.getEcheancesRestantes() + 1) + "/" + av.getEcheancesTotal() + ")");
            avLine.setTypeLigne("GAIN");
            avLine.setBaseCalcul(av.getMontantInitial());
            avLine.setMontant(av.getMontantMensuel());
            avLine.setOrdre(ordre++);
            lines.add(avLine);
        }

        for (Avoir av : avoirsVariables) {
            if (av.getAmount() != null && av.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal m = av.getAmount();
                if (av.getEcheance() != null && av.getEcheance() > 1 && av.getMontantRestant() != null) {
                    m = av.getAmount().divide(new BigDecimal(av.getEcheance()), 0, RoundingMode.HALF_UP);
                }
                if (av.getMontantRestant() != null && av.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                    m = m.min(av.getMontantRestant());
                }
                BulletinLine avLine = new BulletinLine();
                avLine.setCode(av.getSalaryElement() != null ? av.getSalaryElement().getCode() : "AVOIR_" + av.getId());
                avLine.setLibelle(av.getSalaryElement() != null ? av.getSalaryElement().getName() : "Avoir Collaborateur");
                avLine.setTypeLigne("GAIN");
                avLine.setBaseCalcul(av.getAmount());
                avLine.setTaux(new BigDecimal("100.00"));
                avLine.setMontant(m);
                avLine.setOrdre(ordre++);
                lines.add(avLine);
            }
        }

        // Lignes Retenues Sociales & Patronales
        for (Retenue ret : applicableRetenues) {
            if (ret == null || isIuts(ret)) continue;

            BigDecimal base = resolveBase(ret.getBaseCalcul(), salaireBase, remunerationBrute, baseImposable);
            BigDecimal taux = money(ret.getTaux());
            BigDecimal montant = calculatePercentage(base, taux);
            boolean employeur = isEmployeur(ret);

            if (ret.getCode() != null && ret.getCode().toUpperCase(Locale.ROOT).contains("CNSS") && !employeur) {
                cotisationCnss = cotisationCnss.add(montant);
            }

            BulletinLine retLine = new BulletinLine();
            retLine.setCode(ret.getCode() != null ? ret.getCode() : "RETENUE");
            retLine.setLibelle(ret.getLibelle() != null ? ret.getLibelle() : "Retenue");
            retLine.setBaseCalcul(base);
            retLine.setTaux(taux);

            if (employeur) {
                totalCotisationsPatronales = totalCotisationsPatronales.add(montant);
                // Les charges patronales sont enregistrées au niveau du bulletin pour la comptabilité mais n'apparaissent pas dans les lignes de retenue du salarié
            } else {
                totalRetenuesSociales = totalRetenuesSociales.add(montant);
                retLine.setTypeLigne("RETENUE_SOCIALE");
                retLine.setMontant(montant);
                retLine.setOrdre(ordre++);
                lines.add(retLine);
            }
        }

        // IUTS avec charges de famille
        int nbCharges = Math.toIntExact(familleRepository.countByEmployeeIdAndEstChargeTrue(emp.getId()));
        BigDecimal iutsSansCharge = calculateIuts(baseImposable);
        BigDecimal tauxReduction = reductionRate(nbCharges);
        BigDecimal reductionIuts = money(iutsSansCharge.multiply(tauxReduction).divide(CENT, 8, RoundingMode.HALF_UP));
        BigDecimal impotIuts = money(iutsSansCharge.subtract(reductionIuts).max(BigDecimal.ZERO));

        if (impotIuts.compareTo(BigDecimal.ZERO) > 0) {
            BulletinLine iutsLine = new BulletinLine();
            iutsLine.setCode("IUTS");
            iutsLine.setLibelle("Impôt Unique sur Traitements et Salaires (IUTS)");
            iutsLine.setTypeLigne("IMPOT");
            iutsLine.setBaseCalcul(baseImposable);
            iutsLine.setTaux(tauxReduction);
            iutsLine.setMontant(impotIuts);
            iutsLine.setOrdre(ordre++);
            lines.add(iutsLine);
        }

        // Précomptes (Retenues sur salaire, prêts, avances)
        List<PrecompteEmploye> precomptes = precompteRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        BigDecimal totalPrecomptes = BigDecimal.ZERO;
        for (PrecompteEmploye prec : precomptes) {
            BigDecimal mPrelev = prec.getMontantMensuel().min(prec.getMontantRestant());
            totalPrecomptes = totalPrecomptes.add(mPrelev);

            BulletinLine precLine = new BulletinLine();
            precLine.setRubriquePaie(prec.getRubriquePaie());
            precLine.setCode("PREC_" + prec.getId());
            precLine.setLibelle(prec.getLibelle() + " (Échéance " + (prec.getEcheancesTotal() - prec.getEcheancesRestantes() + 1) + "/" + prec.getEcheancesTotal() + ")");
            precLine.setTypeLigne("PRECOMPTE");
            precLine.setBaseCalcul(prec.getMontantInitial());
            precLine.setMontant(mPrelev);
            precLine.setOrdre(ordre++);
            lines.add(precLine);
        }

        List<Precompte> precomptesVariables = precompteVariableRepository.findByEmployeeIdAndStatut(emp.getId(), "EN_COURS");
        if (precomptesVariables.isEmpty()) {
            precomptesVariables = precompteVariableRepository.findByEmployeeIdAndStatut(emp.getId(), "ACTIF");
        }
        for (Precompte prec : precomptesVariables) {
            if (prec.getAmount() != null && prec.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal m = prec.getAmount();
                if (prec.getEcheance() != null && prec.getEcheance() > 1) {
                    m = prec.getAmount().divide(new BigDecimal(prec.getEcheance()), 0, RoundingMode.HALF_UP);
                }
                if (prec.getMontantRestant() != null && prec.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
                    m = m.min(prec.getMontantRestant());
                }
                totalPrecomptes = totalPrecomptes.add(m);

                BulletinLine precLine = new BulletinLine();
                precLine.setCode(prec.getSalaryElement() != null ? prec.getSalaryElement().getCode() : "PREC_" + prec.getId());
                precLine.setLibelle(prec.getSalaryElement() != null ? prec.getSalaryElement().getName() : "Précompte / Retenue");
                precLine.setTypeLigne("PRECOMPTE");
                precLine.setBaseCalcul(prec.getAmount());
                precLine.setTaux(new BigDecimal("100.00"));
                precLine.setMontant(m);
                precLine.setOrdre(ordre++);
                lines.add(precLine);
            }
        }

        // Trop-perçus (Retenue spontanée en 1 seule fois déduite directement du salaire Net)
        List<TropPercu> tropPercus = tropPercuRepository.findByEmployeeIdAndStatut(emp.getId(), "EN_ATTENTE");
        for (TropPercu tp : tropPercus) {
            if (isTropPercuForSession(tp, session) && tp.getAmount() != null && tp.getAmount().compareTo(BigDecimal.ZERO) > 0) {
                totalPrecomptes = totalPrecomptes.add(tp.getAmount());

                BulletinLine tpLine = new BulletinLine();
                tpLine.setCode(tp.getSalaryElement() != null ? tp.getSalaryElement().getCode() : "RET_TROP_PERCU");
                String libelle = "Retenue Trop-perçu";
                if (tp.getMoisOrigine() != null && !tp.getMoisOrigine().isBlank()) {
                    libelle += " (" + tp.getMoisOrigine() + ")";
                }
                if (tp.getMotif() != null && !tp.getMotif().isBlank()) {
                    libelle += " - " + tp.getMotif();
                }
                tpLine.setLibelle(libelle);
                tpLine.setTypeLigne("RETENUE");
                tpLine.setBaseCalcul(tp.getAmount());
                tpLine.setTaux(new BigDecimal("100.00"));
                tpLine.setMontant(tp.getAmount());
                tpLine.setOrdre(ordre++);
                lines.add(tpLine);
            }
        }

        BigDecimal totalRetenues = money(totalRetenuesSociales.add(impotIuts).add(totalPrecomptes));
        BigDecimal salaireNet = money(remunerationBrute.subtract(totalRetenues).max(BigDecimal.ZERO));

        Contrat contrat = contratRepository.findFirstByEmployeeIdOrderByIdDesc(emp.getId()).orElse(null);
        Grade grade = emp.getGradeObj();

        String codeBulletin = String.format("BLT-%s-%s-%04d",
                session.getMois() != null ? session.getMois() : "M",
                session.getAnnee() != null ? session.getAnnee() : LocalDate.now().getYear(),
                emp.getId());

        Bulletin bulletin = new Bulletin();
        bulletin.setCode(codeBulletin);
        bulletin.setEmployee(emp);
        bulletin.setSessionPaie(session);
        bulletin.setGrade(grade);
        bulletin.setContrat(contrat);
        bulletin.setTypeSession(session.getTypeSession());
        bulletin.setScheduledWorkingDays(new BigDecimal("30.00"));
        bulletin.setWorkedDays(new BigDecimal("30.00"));
        bulletin.setSalaireBase(salaireBase);
        bulletin.setTotalIndemnites(totalIndemnites);
        bulletin.setTotalAvoirs(totalAvoirs);
        bulletin.setSalaireBrut(remunerationBrute);
        bulletin.setTotalExonerations(totalExonerations);
        bulletin.setAbattementForfaitaire(abattementForfaitaire);
        bulletin.setBaseImposable(baseImposable);
        bulletin.setCotisationCnss(cotisationCnss);
        bulletin.setImpotIutsSansCharge(iutsSansCharge);
        bulletin.setReductionIutsCharge(reductionIuts);
        bulletin.setImpotIuts(impotIuts);
        bulletin.setTotalRetenuesSociales(totalRetenuesSociales);
        bulletin.setTotalPrecomptes(totalPrecomptes);
        bulletin.setTotalRetenues(totalRetenues);
        bulletin.setTotalCotisationsPatronales(totalCotisationsPatronales);
        bulletin.setSalaireNet(salaireNet);
        bulletin.setStatut("GENERE");
        bulletin.setDateCalcul(LocalDateTime.now());

        bulletin = bulletinRepository.save(bulletin);

        for (BulletinLine line : lines) {
            line.setBulletin(bulletin);
            bulletinLineRepository.save(line);
        }

        bulletin.setLines(lines);
        return bulletin;
    }

    @Transactional(readOnly = true)
    public List<BulletinDto> getBulletinsBySession(Long sessionPaieId) {
        return bulletinRepository.findBySessionPaieId(sessionPaieId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BulletinDto> getBulletinsByEmployee(Long employeeId) {
        return bulletinRepository.findByEmployeeIdOrderByDateCalculDesc(employeeId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BulletinDto getBulletinById(Long id) {
        Bulletin b = bulletinRepository.findByIdWithLines(id)
                .or(() -> bulletinRepository.findById(id))
                .orElseThrow(() -> new RuntimeException("Bulletin non trouvé: #" + id));
        return toDto(b);
    }

    @Transactional
    public void validateSession(Long sessionPaieId) {
        SessionPaie session = sessionPaieRepository.findById(sessionPaieId)
                .orElseThrow(() -> new RuntimeException("Session non trouvée: #" + sessionPaieId));

        List<Bulletin> bulletins = bulletinRepository.findBySessionPaieId(sessionPaieId);
        for (Bulletin b : bulletins) {
            b.setStatut("VALIDE");
            b.setDateValidation(LocalDateTime.now());
            bulletinRepository.save(b);

            // Mettre à jour les précomptes de l'employé
            List<PrecompteEmploye> precomptes = precompteRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "ACTIF");
            for (PrecompteEmploye p : precomptes) {
                BigDecimal m = p.getMontantMensuel().min(p.getMontantRestant());
                BigDecimal newRestant = p.getMontantRestant().subtract(m).max(BigDecimal.ZERO);
                p.setMontantRestant(newRestant);
                p.setEcheancesRestantes(Math.max(0, (p.getEcheancesRestantes() != null ? p.getEcheancesRestantes() : 1) - 1));
                if (newRestant.compareTo(BigDecimal.ZERO) <= 0 || (p.getEcheancesRestantes() != null && p.getEcheancesRestantes() <= 0)) {
                    p.setStatut("SOLDE");
                }
                precompteRepository.save(p);
            }

            List<Precompte> precomptesVar = precompteVariableRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "EN_COURS");
            if (precomptesVar.isEmpty()) {
                precomptesVar = precompteVariableRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "ACTIF");
            }
            for (Precompte p : precomptesVar) {
                BigDecimal m = p.getAmount();
                if (p.getEcheance() != null && p.getEcheance() > 1) {
                    m = p.getAmount().divide(new BigDecimal(p.getEcheance()), 0, RoundingMode.HALF_UP);
                }
                BigDecimal restant = p.getMontantRestant() != null ? p.getMontantRestant() : p.getAmount();
                BigDecimal newRestant = restant.subtract(m).max(BigDecimal.ZERO);
                p.setMontantRestant(newRestant);
                p.setEcheance(Math.max(0, (p.getEcheance() != null ? p.getEcheance() : 1) - 1));
                if (newRestant.compareTo(BigDecimal.ZERO) <= 0 || (p.getEcheance() != null && p.getEcheance() <= 0)) {
                    p.setStatut("SOLDE");
                }
                precompteVariableRepository.save(p);
            }

            // Mettre à jour les avoirs de l'employé
            List<AvoirEmploye> avoirs = avoirRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "ACTIF");
            for (AvoirEmploye a : avoirs) {
                BigDecimal m = a.getMontantMensuel().min(a.getMontantRestant());
                BigDecimal newRestant = a.getMontantRestant().subtract(m).max(BigDecimal.ZERO);
                a.setMontantRestant(newRestant);
                a.setEcheancesRestantes(Math.max(0, (a.getEcheancesRestantes() != null ? a.getEcheancesRestantes() : 1) - 1));
                if (newRestant.compareTo(BigDecimal.ZERO) <= 0 || (a.getEcheancesRestantes() != null && a.getEcheancesRestantes() <= 0)) {
                    a.setStatut("SOLDE");
                }
                avoirRepository.save(a);
            }

            List<Avoir> avoirsVar = avoirVariableRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "ACTIF");
            for (Avoir a : avoirsVar) {
                BigDecimal m = a.getAmount();
                if (a.getEcheance() != null && a.getEcheance() > 1 && a.getMontantRestant() != null) {
                    m = a.getAmount().divide(new BigDecimal(a.getEcheance()), 0, RoundingMode.HALF_UP);
                }
                BigDecimal restant = a.getMontantRestant() != null ? a.getMontantRestant() : a.getAmount();
                BigDecimal newRestant = restant.subtract(m).max(BigDecimal.ZERO);
                a.setMontantRestant(newRestant);
                a.setEcheance(Math.max(0, (a.getEcheance() != null ? a.getEcheance() : 1) - 1));
                if (newRestant.compareTo(BigDecimal.ZERO) <= 0 || (a.getEcheance() != null && a.getEcheance() <= 0)) {
                    a.setStatut("SOLDE");
                }
                avoirVariableRepository.save(a);
            }

            // Mettre à jour les trop-perçus appliqués sur ce bulletin (en 1 seule fois)
            List<TropPercu> tropPercus = tropPercuRepository.findByEmployeeIdAndStatut(b.getEmployee().getId(), "EN_ATTENTE");
            for (TropPercu tp : tropPercus) {
                if (isTropPercuForSession(tp, session)) {
                    tp.setStatut("APPLIQUE");
                    tropPercuRepository.save(tp);
                }
            }
        }

        session.setStatut("VALIDE");
        session.setDateValidation(LocalDateTime.now());
        sessionPaieRepository.save(session);
    }

    @Transactional(readOnly = true)
    public List<BulletinDto> getAllBulletins() {
        return bulletinRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BulletinDto saveIndividualBulletin(BulletinDto dto) {
        return createOrUpdateBulletin(dto);
    }

    @Transactional
    public BulletinDto createOrUpdateBulletin(BulletinDto dto) {
        if (dto.getEmployeeId() == null) {
            throw new IllegalArgumentException("L'identifiant de l'agent est requis pour créer un bulletin.");
        }

        Employee emp = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Agent introuvable avec ID: " + dto.getEmployeeId()));

        SessionPaie session = null;
        if (dto.getSessionPaieId() != null) {
            session = sessionPaieRepository.findById(dto.getSessionPaieId()).orElse(null);
        }

        if (session == null) {
            LocalDate now = LocalDate.now();
            String mois = String.format("%02d", now.getMonthValue());
            int annee = now.getYear();
            session = sessionPaieRepository.findByMoisAndAnnee(mois, annee).orElse(null);
            if (session == null) {
                session = sessionPaieRepository.findTopByOrderByAnneeDescMoisDesc().orElse(null);
            }
        }


        String code = dto.getCode();
        if (code == null || code.isBlank()) {
            code = String.format("SLIP/%s-%s", LocalDate.now(), emp.getMatricule() != null ? emp.getMatricule() : "EMP");
        }

        if (isGratification(dto.getTypeSession())) {
            BigDecimal base = dto.getSalaireBase() != null && dto.getSalaireBase().compareTo(BigDecimal.ZERO) > 0
                    ? dto.getSalaireBase()
                    : (dto.getSalaireBrut() != null ? dto.getSalaireBrut() : BigDecimal.ZERO);
            if (base.compareTo(BigDecimal.ZERO) <= 0) {
                SituationSalariale situation = situationRepository.findByEmployeeId(emp.getId()).orElse(null);
                if (situation != null && situation.getSalaireBase() != null) {
                    base = money(new BigDecimal(situation.getSalaireBase()));
                }
            }

            Bulletin b = new Bulletin();
            b.setCode(code);
            b.setEmployee(emp);
            b.setSessionPaie(session);
            b.setTypeSession("GRATIFICATION");
            b.setDateFrom(dto.getDateFrom() != null ? dto.getDateFrom() : LocalDate.now().withDayOfMonth(1));
            b.setDateTo(dto.getDateTo() != null ? dto.getDateTo() : LocalDate.now());
            b.setScheduledWorkingDays(dto.getScheduledWorkingDays() != null ? dto.getScheduledWorkingDays() : new BigDecimal("30.00"));
            b.setWorkedDays(dto.getWorkedDays() != null ? dto.getWorkedDays() : new BigDecimal("30.00"));
            b.setSalaireBase(base);
            b.setTotalIndemnites(BigDecimal.ZERO);
            b.setTotalAvoirs(BigDecimal.ZERO);
            b.setSalaireBrut(base);
            b.setTotalExonerations(BigDecimal.ZERO);
            b.setAbattementForfaitaire(BigDecimal.ZERO);
            b.setBaseImposable(BigDecimal.ZERO);
            b.setCotisationCnss(BigDecimal.ZERO);
            b.setImpotIuts(BigDecimal.ZERO);
            b.setTotalRetenuesSociales(BigDecimal.ZERO);
            b.setTotalPrecomptes(BigDecimal.ZERO);
            b.setTotalRetenues(BigDecimal.ZERO);
            b.setTotalCotisationsPatronales(BigDecimal.ZERO);
            b.setSalaireNet(base); // LE NET DEVIENT LE BRUT !
            b.setStatut(dto.getStatut() != null ? dto.getStatut() : "VALIDE");
            b.setDateCalcul(dto.getDateCalcul() != null ? dto.getDateCalcul() : LocalDateTime.now());
            b.setLines(new ArrayList<>());

            BulletinLine line = new BulletinLine();
            line.setCode("GRAT_ANN");
            line.setLibelle("Gratification Annuelle (13ème Mois)");
            line.setTypeLigne("GAIN");
            line.setBaseCalcul(base);
            line.setTaux(new BigDecimal("100.00"));
            line.setMontant(base);
            line.setOrdre(1);
            b.addLine(line);

            Bulletin saved = bulletinRepository.save(b);
            return toDto(saved);
        }

        Bulletin b = new Bulletin();
        b.setCode(code);
        b.setEmployee(emp);
        b.setSessionPaie(session);
        b.setTypeSession(dto.getTypeSession() != null ? dto.getTypeSession() : "PAIE_NORMALE");
        b.setDateFrom(dto.getDateFrom() != null ? dto.getDateFrom() : LocalDate.now().withDayOfMonth(1));
        b.setDateTo(dto.getDateTo() != null ? dto.getDateTo() : LocalDate.now());
        b.setScheduledWorkingDays(dto.getScheduledWorkingDays() != null ? dto.getScheduledWorkingDays() : new BigDecimal("30.00"));
        b.setWorkedDays(dto.getWorkedDays() != null ? dto.getWorkedDays() : new BigDecimal("30.00"));
        b.setSalaireBase(dto.getSalaireBase());
        b.setTotalIndemnites(dto.getTotalIndemnites());
        b.setTotalAvoirs(dto.getTotalAvoirs());
        b.setSalaireBrut(dto.getSalaireBrut());
        b.setTotalExonerations(dto.getTotalExonerations());
        b.setAbattementForfaitaire(dto.getAbattementForfaitaire());
        b.setBaseImposable(dto.getBaseImposable());
        b.setCotisationCnss(dto.getCotisationCnss());
        b.setImpotIuts(dto.getImpotIuts());
        b.setTotalRetenuesSociales(dto.getTotalRetenuesSociales());
        b.setTotalPrecomptes(dto.getTotalPrecomptes());
        b.setTotalRetenues(dto.getTotalRetenues());
        b.setTotalCotisationsPatronales(dto.getTotalCotisationsPatronales());
        b.setSalaireNet(dto.getSalaireNet());
        b.setStatut(dto.getStatut() != null ? dto.getStatut() : "VALIDE");
        b.setDateCalcul(dto.getDateCalcul() != null ? dto.getDateCalcul() : LocalDateTime.now());
        b.setLines(new ArrayList<>());

        if (dto.getLines() != null) {
            int ordre = 1;
            for (BulletinLineDto l : dto.getLines()) {
                String libelle = l.getLibelle() != null ? l.getLibelle() : (l.getName() != null ? l.getName() : "Ligne Bulletin");
                String typeLigne = l.getTypeLigne() != null ? l.getTypeLigne() : (l.getCategory() != null ? l.getCategory() : "GAIN");
                BigDecimal taux = l.getTaux() != null ? l.getTaux() : (l.getRate() != null ? BigDecimal.valueOf(l.getRate()) : null);
                BigDecimal montant = l.getMontant() != null ? l.getMontant() : (l.getAmount() != null ? BigDecimal.valueOf(Math.abs(l.getAmount())) : BigDecimal.ZERO);

                BulletinLine line = new BulletinLine();
                line.setCode(l.getCode() != null ? l.getCode() : "LINE");
                line.setLibelle(libelle);
                line.setTypeLigne(typeLigne);
                line.setBaseCalcul(l.getBaseCalcul());
                line.setTaux(taux);
                line.setMontant(montant);
                line.setPartPatronale(l.getPartPatronale());
                line.setOrdre(l.getOrdre() != null ? l.getOrdre() : ordre++);
                b.addLine(line);
            }
        }

        Bulletin saved = bulletinRepository.save(b);

        // Mettre à jour les trop-perçus appliqués sur ce bulletin individuel
        List<TropPercu> tropPercus = tropPercuRepository.findByEmployeeIdAndStatut(emp.getId(), "EN_ATTENTE");
        for (TropPercu tp : tropPercus) {
            boolean matches = false;
            if (session != null && isTropPercuForSession(tp, session)) {
                matches = true;
            } else if (isTropPercuForDates(tp, b.getDateFrom(), b.getDateTo())) {
                matches = true;
            }
            if (matches) {
                tp.setStatut("APPLIQUE");
                tropPercuRepository.save(tp);
            }
        }

        return toDto(saved);
    }

    @Transactional
    public BulletinDto updateBulletin(Long id, BulletinDto dto) {
        Bulletin b = bulletinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bulletin introuvable avec ID: " + id));

        if (dto.getWorkedDays() != null) b.setWorkedDays(dto.getWorkedDays());
        if (dto.getScheduledWorkingDays() != null) b.setScheduledWorkingDays(dto.getScheduledWorkingDays());
        if (dto.getSalaireBase() != null) b.setSalaireBase(dto.getSalaireBase());
        if (dto.getTotalIndemnites() != null) b.setTotalIndemnites(dto.getTotalIndemnites());
        if (dto.getTotalAvoirs() != null) b.setTotalAvoirs(dto.getTotalAvoirs());
        if (dto.getSalaireBrut() != null) b.setSalaireBrut(dto.getSalaireBrut());
        if (dto.getBaseImposable() != null) b.setBaseImposable(dto.getBaseImposable());
        if (dto.getCotisationCnss() != null) b.setCotisationCnss(dto.getCotisationCnss());
        if (dto.getImpotIuts() != null) b.setImpotIuts(dto.getImpotIuts());
        if (dto.getTotalRetenues() != null) b.setTotalRetenues(dto.getTotalRetenues());
        if (dto.getTotalPrecomptes() != null) b.setTotalPrecomptes(dto.getTotalPrecomptes());
        if (dto.getTotalCotisationsPatronales() != null) b.setTotalCotisationsPatronales(dto.getTotalCotisationsPatronales());
        if (dto.getSalaireNet() != null) b.setSalaireNet(dto.getSalaireNet());
        if (dto.getStatut() != null) b.setStatut(dto.getStatut());

        if (dto.getLines() != null && !dto.getLines().isEmpty()) {
            bulletinLineRepository.deleteByBulletinId(b.getId());
            bulletinLineRepository.flush();

            int ordre = 1;
            List<BulletinLine> newLines = new ArrayList<>();
            for (BulletinLineDto l : dto.getLines()) {
                String libelle = l.getLibelle() != null ? l.getLibelle() : (l.getName() != null ? l.getName() : "Ligne Bulletin");
                String typeLigne = l.getTypeLigne() != null ? l.getTypeLigne() : (l.getCategory() != null ? l.getCategory() : "GAIN");
                BigDecimal taux = l.getTaux() != null ? l.getTaux() : (l.getRate() != null ? BigDecimal.valueOf(l.getRate()) : null);
                BigDecimal montant = l.getMontant() != null ? l.getMontant() : (l.getAmount() != null ? BigDecimal.valueOf(Math.abs(l.getAmount())) : BigDecimal.ZERO);

                BulletinLine line = new BulletinLine();
                line.setBulletin(b);
                line.setCode(l.getCode() != null ? l.getCode() : "LINE");
                line.setLibelle(libelle);
                line.setTypeLigne(typeLigne);
                line.setBaseCalcul(l.getBaseCalcul());
                line.setTaux(taux);
                line.setMontant(montant);
                line.setPartPatronale(l.getPartPatronale());
                line.setOrdre(l.getOrdre() != null ? l.getOrdre() : ordre++);
                newLines.add(bulletinLineRepository.save(line));
            }
            b.setLines(newLines);
        }

        Bulletin saved = bulletinRepository.save(b);
        return toDto(saved);
    }

    @Transactional
    public void deleteBulletin(Long id) {
        bulletinRepository.deleteById(id);
    }

    public BulletinDto toDto(Bulletin b) {
        String empName = b.getEmployee() != null
                ? (b.getEmployee().getPrenom() != null ? b.getEmployee().getPrenom() + " " + b.getEmployee().getNom() : b.getEmployee().getName())
                : null;
        String matricule = b.getEmployee() != null ? b.getEmployee().getMatricule() : null;
        String fonctionStr = (b.getEmployee() != null && b.getEmployee().getFonction() != null)
                ? b.getEmployee().getFonction().getName()
                : null;
        String gradeStr = b.getGrade() != null ? b.getGrade().getLibelle() : null;

        List<BulletinLineDto> lineDtos = new ArrayList<>();
        if (b.getLines() != null) {
            for (BulletinLine l : b.getLines()) {
                BulletinLineDto ld = new BulletinLineDto();
                ld.setId(l.getId());
                ld.setBulletinId(b.getId());
                ld.setRubriquePaieId(l.getRubriquePaie() != null ? l.getRubriquePaie().getId() : null);
                ld.setCode(l.getCode());
                ld.setLibelle(l.getLibelle());
                ld.setTypeLigne(l.getTypeLigne());
                ld.setBaseCalcul(l.getBaseCalcul());
                ld.setTaux(l.getTaux());
                ld.setMontant(l.getMontant());
                ld.setPartPatronale(l.getPartPatronale());
                ld.setOrdre(l.getOrdre());
                lineDtos.add(ld);
            }
        }

        BulletinDto dto = new BulletinDto();
        dto.setId(b.getId());
        dto.setCode(b.getCode());
        dto.setEmployeeId(b.getEmployee() != null ? b.getEmployee().getId() : null);
        dto.setEmployeeName(empName);
        dto.setMatricule(matricule);
        dto.setFonction(fonctionStr);
        dto.setSessionPaieId(b.getSessionPaie() != null ? b.getSessionPaie().getId() : null);
        dto.setSessionPaieCode(b.getSessionPaie() != null ? b.getSessionPaie().getCodeSession() : null);
        dto.setSessionPeriode(b.getSessionPaie() != null ? b.getSessionPaie().getPeriode() : null);
        dto.setGradeId(b.getGrade() != null ? b.getGrade().getId() : null);
        dto.setGradeLibelle(gradeStr);
        dto.setContratId(b.getContrat() != null ? b.getContrat().getId() : null);
        dto.setTypeSession(b.getTypeSession());
        dto.setDateFrom(b.getDateFrom());
        dto.setDateTo(b.getDateTo());
        dto.setScheduledWorkingDays(b.getScheduledWorkingDays());
        dto.setWorkedDays(b.getWorkedDays());
        dto.setSalaireBase(b.getSalaireBase());
        dto.setTotalIndemnites(b.getTotalIndemnites());
        dto.setTotalAvoirs(b.getTotalAvoirs());
        dto.setSalaireBrut(b.getSalaireBrut());
        dto.setTotalExonerations(b.getTotalExonerations());
        dto.setAbattementForfaitaire(b.getAbattementForfaitaire());
        dto.setBaseImposable(b.getBaseImposable());
        dto.setCotisationCnss(b.getCotisationCnss());
        dto.setImpotIutsSansCharge(b.getImpotIutsSansCharge());
        dto.setReductionIutsCharge(b.getReductionIutsCharge());
        dto.setImpotIuts(b.getImpotIuts());
        dto.setTotalRetenuesSociales(b.getTotalRetenuesSociales());
        dto.setTotalPrecomptes(b.getTotalPrecomptes());
        dto.setTotalRetenues(b.getTotalRetenues());
        dto.setTotalCotisationsPatronales(b.getTotalCotisationsPatronales());
        dto.setSalaireNet(b.getSalaireNet());
        dto.setStatut(b.getStatut());
        dto.setDateCalcul(b.getDateCalcul());
        dto.setDateValidation(b.getDateValidation());
        dto.setLines(lineDtos);
        return dto;
    }

    private List<Retenue> findApplicableRetenues(Employee employee) {
        return employee.getRegimeSecuriteSocial() == null
                ? retenueRepository.findGeneralRetenues()
                : retenueRepository.findApplicable(employee.getRegimeSecuriteSocial().getId());
    }

    private static BigDecimal resolveBase(BaseCalculRetenue base, BigDecimal salaireBase,
                                          BigDecimal remunerationBrute, BigDecimal baseImposable) {
        if (base == BaseCalculRetenue.SALAIRE_BASE) return salaireBase;
        if (base == BaseCalculRetenue.BASE_IMPOSABLE) return baseImposable;
        return remunerationBrute;
    }

    private boolean isEmployeur(Retenue retenue) {
        if (retenue == null) return false;
        String typeVal = "";
        if (retenue.getTypeRetenue() != null) {
            typeVal = (retenue.getTypeRetenue().getCode() == null ? "" : retenue.getTypeRetenue().getCode()) + " "
                    + (retenue.getTypeRetenue().getLibelle() == null ? "" : retenue.getTypeRetenue().getLibelle());
        }
        String full = (typeVal + " " + (retenue.getCode() != null ? retenue.getCode() : "") + " "
                + (retenue.getLibelle() != null ? retenue.getLibelle() : "")).toUpperCase(Locale.ROOT);
        return full.contains("EMPLOYEUR") || full.contains("PATRON");
    }

    private static boolean isIuts(Retenue retenue) {
        return retenue.getCode() != null && retenue.getCode().toUpperCase(Locale.ROOT).contains("IUTS");
    }

    private static BigDecimal calculateIuts(BigDecimal base) {
        BigDecimal result;
        if (base.compareTo(new BigDecimal("250000")) > 0) {
            result = new BigDecimal("39430").add(base.subtract(new BigDecimal("250000")).multiply(new BigDecimal("0.25")));
        } else if (base.compareTo(new BigDecimal("170000")) > 0) {
            result = new BigDecimal("24200").add(base.subtract(new BigDecimal("170000")).multiply(new BigDecimal("0.23")));
        } else if (base.compareTo(new BigDecimal("120000")) > 0) {
            result = new BigDecimal("13700").add(base.subtract(new BigDecimal("120000")).multiply(new BigDecimal("0.21")));
        } else if (base.compareTo(new BigDecimal("80000")) > 0) {
            result = new BigDecimal("6500").add(base.subtract(new BigDecimal("80000")).multiply(new BigDecimal("0.18")));
        } else if (base.compareTo(new BigDecimal("50000")) > 0) {
            result = new BigDecimal("2000").add(base.subtract(new BigDecimal("50000")).multiply(new BigDecimal("0.15")));
        } else if (base.compareTo(new BigDecimal("30000")) > 0) {
            result = base.subtract(new BigDecimal("30000")).multiply(new BigDecimal("0.10"));
        } else {
            result = BigDecimal.ZERO;
        }
        return money(result);
    }

    private static BigDecimal reductionRate(int charges) {
        if (charges == 1) return new BigDecimal("8.00");
        if (charges == 2) return new BigDecimal("10.00");
        if (charges == 3) return new BigDecimal("12.00");
        if (charges >= 4) return new BigDecimal("14.00");
        return BigDecimal.ZERO;
    }

    private static BigDecimal calculatePercentage(BigDecimal base, BigDecimal rate) {
        return money(base.multiply(rate).divide(CENT, 8, RoundingMode.HALF_UP));
    }

    private static BigDecimal money(Double value) {
        return value == null ? zero() : money(BigDecimal.valueOf(value));
    }

    private static BigDecimal money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal zero() {
        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }

    private boolean isTropPercuForSession(TropPercu tp, SessionPaie session) {
        if (tp == null || tp.getMoisApplication() == null || session == null) return false;
        String app = tp.getMoisApplication().trim();
        String sMois = session.getMois() != null ? session.getMois().trim() : "";
        Integer sAnnee = session.getAnnee();
        String sPeriode = session.getPeriode() != null ? session.getPeriode().trim() : "";

        if (app.equalsIgnoreCase(sPeriode)) return true;

        try {
            int mNum = Integer.parseInt(sMois);
            String fmt = String.format("%02d/%d", mNum, sAnnee);
            if (app.equalsIgnoreCase(fmt)) return true;
        } catch (Exception ignored) {}

        if (sAnnee != null && app.contains(String.valueOf(sAnnee))) {
            if (app.contains(sMois)) return true;
        }
        return false;
    }

    private boolean isTropPercuForDates(TropPercu tp, LocalDate dateFrom, LocalDate dateTo) {
        if (tp == null || tp.getMoisApplication() == null) return false;
        String app = tp.getMoisApplication().trim();
        if (dateFrom != null) {
            String m1 = String.format("%02d/%d", dateFrom.getMonthValue(), dateFrom.getYear());
            String m2 = String.format("%d-%02d", dateFrom.getYear(), dateFrom.getMonthValue());
            if (app.equalsIgnoreCase(m1) || app.equalsIgnoreCase(m2)) return true;
            if (app.contains(String.format("%02d", dateFrom.getMonthValue())) && app.contains(String.valueOf(dateFrom.getYear()))) return true;
        }
        if (dateTo != null) {
            String m1 = String.format("%02d/%d", dateTo.getMonthValue(), dateTo.getYear());
            String m2 = String.format("%d-%02d", dateTo.getYear(), dateTo.getMonthValue());
            if (app.equalsIgnoreCase(m1) || app.equalsIgnoreCase(m2)) return true;
            if (app.contains(String.format("%02d", dateTo.getMonthValue())) && app.contains(String.valueOf(dateTo.getYear()))) return true;
        }
        return false;
    }

    private static boolean isGratification(String typeSession) {
        if (typeSession == null) return false;
        String t = typeSession.trim().toUpperCase(Locale.ROOT);
        return t.contains("GRATIF") || t.contains("TREIZIEME") || t.contains("13");
    }
}
