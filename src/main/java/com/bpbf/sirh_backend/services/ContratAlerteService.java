package com.bpbf.sirh_backend.services;

import com.bpbf.sirh_backend.dtos.ContratAlerteDto;
import com.bpbf.sirh_backend.entities.Contrat;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.repositories.ContratRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContratAlerteService {

    private final ContratRepository contratRepository;

    private static final DateTimeFormatter[] DATE_FORMATTERS = new DateTimeFormatter[]{
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd"),
            DateTimeFormatter.ofPattern("dd-MM-yyyy")
    };

    @Transactional(readOnly = true)
    public List<ContratAlerteDto> getAlertesEcheances(Integer delaiJours) {
        int limiteJours = delaiJours != null && delaiJours > 0 ? delaiJours : 60;
        LocalDate today = LocalDate.now();

        List<Contrat> contrats = contratRepository.findAll();
        List<ContratAlerteDto> alertes = new ArrayList<>();

        for (Contrat c : contrats) {
            String dateFinStr = c.getDateFin();
            if (dateFinStr == null || dateFinStr.trim().isEmpty()) {
                continue; // Contrat sans date de fin (ex: CDI)
            }

            String typeNom = c.getTypeContratObj() != null ? c.getTypeContratObj().getName() : "Contrat";
            if (typeNom != null && (typeNom.toUpperCase().contains("CDI") || typeNom.toUpperCase().contains("INDETERMINE"))) {
                continue; // Ne pas alerter pour les CDI
            }

            LocalDate dateFin = parseDate(dateFinStr.trim());
            if (dateFin == null) {
                continue;
            }

            long joursRestants = ChronoUnit.DAYS.between(today, dateFin);

            // Filtrer selon le délai demandé (inclut également les contrats expirés récemment depuis moins de 90 jours)
            if (joursRestants <= limiteJours && joursRestants >= -90) {
                String niveauUrgence;
                String message;

                if (joursRestants < 0) {
                    niveauUrgence = "EXPIRE";
                    message = "Contrat expiré depuis " + Math.abs(joursRestants) + " jour(s). Action RH requise.";
                } else if (joursRestants <= 15) {
                    niveauUrgence = "CRITIQUE";
                    message = "Échéance imminente dans " + joursRestants + " jour(s) (Urgence RH).";
                } else if (joursRestants <= 30) {
                    niveauUrgence = "ATTENTION";
                    message = "Échéance sous 1 mois (" + joursRestants + " jours restants).";
                } else {
                    niveauUrgence = "A_PREVOIR";
                    message = "Échéance sous 2 mois (" + joursRestants + " jours restants).";
                }

                Employee emp = c.getEmployee();
                String mat = emp != null && emp.getMatricule() != null ? emp.getMatricule() : "—";
                String nom = emp != null && emp.getNom() != null ? emp.getNom() : "";
                String prenom = emp != null && emp.getPrenom() != null ? emp.getPrenom() : "";
                String nomComplet = (prenom + " " + nom).trim().toUpperCase();
                String fonction = emp != null && emp.getFonction() != null ? emp.getFonction().getName() : "—";
                String direction = emp != null && emp.getDirection() != null ? (emp.getDirection().getName() != null ? emp.getDirection().getName() : emp.getDirection().getCode()) : "—";


                alertes.add(ContratAlerteDto.builder()
                        .contratId(c.getId())
                        .employeeId(emp != null ? emp.getId() : null)
                        .matricule(mat)
                        .nom(nom)
                        .prenom(prenom)
                        .nomComplet(nomComplet.isEmpty() ? "COLLABORATEUR" : nomComplet)
                        .typeContrat(typeNom)
                        .fonction(fonction)
                        .direction(direction)
                        .dateDebut(c.getDateDebut())
                        .dateFin(dateFinStr)
                        .joursRestants(joursRestants)
                        .niveauUrgence(niveauUrgence)
                        .message(message)
                        .build());
            }
        }

        alertes.sort(Comparator.comparing(ContratAlerteDto::getJoursRestants));
        return alertes;
    }

    private LocalDate parseDate(String text) {
        for (DateTimeFormatter fmt : DATE_FORMATTERS) {
            try {
                return LocalDate.parse(text, fmt);
            } catch (Exception ignored) {}
        }
        return null;
    }
}
