package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.DashboardStatsDto;
import com.bpbf.sirh_backend.entities.SessionPaie;
import com.bpbf.sirh_backend.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardStatsServiceImpl implements DashboardStatsService {

    private final EmployeeRepository employeeRepository;
    private final CongeRepository congeRepository;
    private final AbsenceRepository absenceRepository;
    private final ContratRepository contratRepository;
    private final EmploiRepository emploiRepository;
    private final DirectionRepository directionRepository;
    private final DepartmentRepository departmentRepository;
    private final GrilleSalarialeRepository grilleSalarialeRepository;
    private final EchelonRepository echelonRepository;
    private final TypeIndemniteRepository typeIndemniteRepository;
    private final TypeContratRepository typeContratRepository;
    private final RoleProfilRepository roleProfilRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ActionPermissionRepository actionPermissionRepository;
    private final RubriquePaieRepository rubriquePaieRepository;
    private final BulletinRepository bulletinRepository;
    private final SessionPaieRepository sessionPaieRepository;

    @Override
    public DashboardStatsDto.GrhStats getGrhStats() {
        long totalEmp = employeeRepository.count();
        long activeEmp = employeeRepository.countActiveEmployees();
        long pendingConges = congeRepository.countPendingConges();
        long totalConges = congeRepository.count();
        long totalAbsences = absenceRepository.count();
        long activeContrats = contratRepository.countContratsActifs();
        long expiringContrats = contratRepository.countContratsEnAttente();

        return DashboardStatsDto.GrhStats.builder()
                .totalAgents(totalEmp)
                .agentsActifs(activeEmp)
                .demandesCongeEnAttente(pendingConges)
                .totalConges(totalConges)
                .absencesSignalees(totalAbsences)
                .contratsActifs(activeContrats)
                .contratsARenouveler(expiringContrats)
                .build();
    }

    @Override
    public DashboardStatsDto.DonneesBaseStats getDonneesBaseStats() {
        long emplois = emploiRepository.count();
        long directions = directionRepository.count();
        long departments = departmentRepository.count();
        long grilles = grilleSalarialeRepository.count();
        long echelons = echelonRepository.count();
        long indemnites = typeIndemniteRepository.count();
        long typesContrats = typeContratRepository.count();

        return DashboardStatsDto.DonneesBaseStats.builder()
                .emploisCount(emplois)
                .directionsCount(directions)
                .departmentsCount(departments)
                .directionsEtDeptsCount(directions + departments)
                .grillesCount(grilles)
                .echelonsCount(echelons)
                .indemnitesCount(indemnites)
                .typesContratsCount(typesContrats)
                .build();
    }

    @Override
    public DashboardStatsDto.ProfilsStats getProfilsStats() {
        long roles = roleProfilRepository.count();
        long users = utilisateurRepository.count();
        long activeUsers = utilisateurRepository.countByActifTrue();
        long permissions = actionPermissionRepository.count();

        return DashboardStatsDto.ProfilsStats.builder()
                .rolesCount(roles)
                .usersCount(users)
                .activeUsers(activeUsers)
                .permissionsCount(permissions)
                .manualsCount(6L)
                .build();
    }

    @Override
    public DashboardStatsDto.PaieStats getPaieStats() {
        long totalActive = employeeRepository.countActiveEmployees();
        long rubriques = rubriquePaieRepository.count();
        long sessions = sessionPaieRepository.count();

        long bulletinsTraites = 0;
        SessionPaie activeSession = sessionPaieRepository.findTopByOrderByDateCreationDesc().orElse(null);
        if (activeSession != null) {
            bulletinsTraites = bulletinRepository.countBySessionPaieId(activeSession.getId());
        } else {
            bulletinsTraites = bulletinRepository.count();
        }

        long bulletinsATraiter = Math.max(0, totalActive - bulletinsTraites);

        return DashboardStatsDto.PaieStats.builder()
                .bulletinsTraites(bulletinsTraites)
                .bulletinsATraiter(bulletinsATraiter)
                .totalAgents(totalActive)
                .rubriquesCount(rubriques)
                .sessionsCount(sessions)
                .build();
    }

    @Override
    public DashboardStatsDto.GlobalStats getGlobalStats() {
        return DashboardStatsDto.GlobalStats.builder()
                .grh(getGrhStats())
                .donneesBase(getDonneesBaseStats())
                .profils(getProfilsStats())
                .paie(getPaieStats())
                .build();
    }
}
