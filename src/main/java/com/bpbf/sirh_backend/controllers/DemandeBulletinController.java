package com.bpbf.sirh_backend.controllers;

import com.bpbf.sirh_backend.dtos.BulletinDto;
import com.bpbf.sirh_backend.entities.Bulletin;
import com.bpbf.sirh_backend.entities.DemandeBulletin;
import com.bpbf.sirh_backend.entities.Employee;
import com.bpbf.sirh_backend.entities.SessionPaie;
import com.bpbf.sirh_backend.repositories.BulletinRepository;
import com.bpbf.sirh_backend.repositories.DemandeBulletinRepository;
import com.bpbf.sirh_backend.repositories.EmployeeRepository;
import com.bpbf.sirh_backend.repositories.SessionPaieRepository;
import com.bpbf.sirh_backend.services.BulletinPdfService;
import com.bpbf.sirh_backend.services.BulletinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/demandes-bulletin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class DemandeBulletinController {

    private final DemandeBulletinRepository demandeBulletinRepository;
    private final SessionPaieRepository sessionPaieRepository;
    private final BulletinRepository bulletinRepository;
    private final BulletinService bulletinService;
    private final BulletinPdfService bulletinPdfService;
    private final EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<List<DemandeBulletin>> getAll() {
        return ResponseEntity.ok(demandeBulletinRepository.findAllByOrderByDateDemandeDesc());
    }

    @GetMapping("/mes-demandes")
    public ResponseEntity<List<DemandeBulletin>> getMesDemandes(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) String matricule,
            @RequestParam(required = false) String employeeName) {
        List<DemandeBulletin> all = demandeBulletinRepository.findAllByOrderByDateDemandeDesc();

        // Auto-associer et générer le bulletin pour les demandes acceptées qui n'ont pas encore de bulletin
        for (DemandeBulletin d : all) {
            if (isStatutAccepte(d.getStatut()) && d.getBulletinId() == null) {
                genererEtAssocierBulletin(d);
                demandeBulletinRepository.save(d);
            }
        }

        if (employeeId == null && (matricule == null || matricule.isBlank()) && (employeeName == null || employeeName.isBlank())) {
            return ResponseEntity.ok(all);
        }
        final String mNorm = matricule != null ? matricule.trim().toUpperCase(Locale.ROOT) : "";
        final String nNorm = employeeName != null ? employeeName.trim().toUpperCase(Locale.ROOT) : "";

        List<DemandeBulletin> filtered = all.stream().filter(d -> {
            if (employeeId != null && d.getEmployeeId() != null && d.getEmployeeId().equals(employeeId)) {
                return true;
            }
            if (!mNorm.isEmpty() && d.getMatricule() != null && d.getMatricule().trim().toUpperCase(Locale.ROOT).equals(mNorm)) {
                return true;
            }
            if (!nNorm.isEmpty() && d.getEmployeeName() != null && d.getEmployeeName().trim().toUpperCase(Locale.ROOT).contains(nNorm)) {
                return true;
            }
            return false;
        }).toList();

        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<DemandeBulletin>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(demandeBulletinRepository.findByEmployeeIdOrderByDateDemandeDesc(employeeId));
    }

    @PostMapping
    public ResponseEntity<DemandeBulletin> create(@RequestBody DemandeBulletin payload) {
        if (payload.getDateDemande() == null) {
            payload.setDateDemande(LocalDateTime.now());
        }
        if (payload.getStatut() == null || payload.getStatut().isBlank()) {
            payload.setStatut("EN_ATTENTE_RH");
        }
        DemandeBulletin saved = demandeBulletinRepository.save(payload);
        return ResponseEntity.ok(saved);
    }

    @PutMapping({"/{id}", "/{id}/traiter"})
    public ResponseEntity<DemandeBulletin> traiter(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        DemandeBulletin demande = demandeBulletinRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande non trouvée : " + id));

        String statut = body != null && body.get("statut") != null ? body.get("statut") : "TRAITEE";
        String traitePar = body != null && body.get("traitePar") != null ? body.get("traitePar") : "GESTIONNAIRE_PAIE";

        demande.setStatut(statut);
        demande.setTraitePar(traitePar);
        demande.setDateTraitement(LocalDateTime.now());

        // Si la demande est acceptée / traitée : création automatique de la session extraordinaire et du bulletin
        if (isStatutAccepte(statut)) {
            genererEtAssocierBulletin(demande);
        }

        return ResponseEntity.ok(demandeBulletinRepository.save(demande));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> telechargerPdfBulletinDemande(@PathVariable Long id) {
        DemandeBulletin demande = demandeBulletinRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande non trouvée : " + id));

        // S'assurer que le bulletin et la session extraordinaire existent
        if (demande.getBulletinId() == null) {
            genererEtAssocierBulletin(demande);
            demande = demandeBulletinRepository.save(demande);
        }

        if (demande.getBulletinId() == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] pdfBytes = bulletinPdfService.generateBulletinPdf(demande.getBulletinId());
        String filename = String.format("Bulletin_%s_%s.pdf",
                demande.getMatricule() != null ? demande.getMatricule() : "AGENT",
                demande.getPeriode() != null ? demande.getPeriode().replace(" ", "_") : "SESSION");

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    private boolean isStatutAccepte(String statut) {
        if (statut == null) return false;
        String s = statut.trim().toUpperCase(Locale.ROOT);
        return s.equals("TRAITEE") || s.equals("ACCEPTEE") || s.equals("DISPONIBLE") || s.equals("VALIDE") || s.equals("VALIDEE");
    }

    private void genererEtAssocierBulletin(DemandeBulletin demande) {
        associerBulletinExistant(demande);
    }

    private void associerBulletinExistant(DemandeBulletin demande) {
        try {
            Long empId = demande.getEmployeeId();
            if (empId == null && demande.getMatricule() != null && !demande.getMatricule().isBlank()) {
                Optional<Employee> empOpt = employeeRepository.findByMatriculeIgnoreCase(demande.getMatricule().trim());
                if (empOpt.isPresent()) {
                    empId = empOpt.get().getId();
                    demande.setEmployeeId(empId);
                }
            }
            if (empId == null) {
                log.warn("Impossible d'associer un bulletin sans identifiant employé pour la demande #{}", demande.getId());
                return;
            }

            int[] ma = parseMoisAnnee(demande.getPeriode());
            int mois = ma[0];
            int annee = ma[1];
            String moisStr = String.format("%02d", mois);

            // RÈGLE V3 : Chercher parmi les vrais bulletins officiels existants de l'agent
            List<Bulletin> bulletinsEmp = bulletinRepository.findByEmployeeIdOrderByDateCalculDesc(empId);
            Bulletin bulletinTrouve = null;

            // 1. Recherche par session associée
            for (Bulletin b : bulletinsEmp) {
                SessionPaie s = b.getSessionPaie();
                if (s != null && s.getAnnee() != null && s.getAnnee() == annee) {
                    if (s.getMois() != null && (s.getMois().equals(moisStr) || s.getMois().equals(String.valueOf(mois)))) {
                        bulletinTrouve = b;
                        break;
                    }
                }
            }

            // 2. Recherche par date de début du bulletin si la session n'est pas explicite
            if (bulletinTrouve == null) {
                for (Bulletin b : bulletinsEmp) {
                    if (b.getDateFrom() != null && b.getDateFrom().getYear() == annee && b.getDateFrom().getMonthValue() == mois) {
                        bulletinTrouve = b;
                        break;
                    }
                }
            }

            if (bulletinTrouve != null) {
                demande.setBulletinId(bulletinTrouve.getId());
                if (bulletinTrouve.getSessionPaie() != null) {
                    demande.setSessionId(bulletinTrouve.getSessionPaie().getId());
                }
                log.info("Bulletin réel #{} associé à la demande #{} pour l'agent #{} (période {}/{})",
                        bulletinTrouve.getId(), demande.getId(), empId, moisStr, annee);
            } else {
                log.info("Aucun bulletin officiel trouvé pour l'employé #{} pour la période {} ({}/{})",
                        empId, demande.getPeriode(), moisStr, annee);
            }
        } catch (Exception e) {
            log.error("Erreur lors de la recherche du bulletin pour la demande #{}: {}", demande.getId(), e.getMessage(), e);
        }
    }

    private int[] parseMoisAnnee(String periode) {
        int mois = LocalDate.now().getMonthValue();
        int annee = LocalDate.now().getYear();
        if (periode == null || periode.isBlank()) {
            return new int[]{mois, annee};
        }
        String p = Normalizer.normalize(periode.trim().toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");

        if (p.matches("\\d{4}-\\d{2}")) {
            String[] parts = p.split("-");
            return new int[]{Integer.parseInt(parts[1]), Integer.parseInt(parts[0])};
        }
        if (p.matches("\\d{2}/\\d{4}")) {
            String[] parts = p.split("/");
            return new int[]{Integer.parseInt(parts[0]), Integer.parseInt(parts[1])};
        }

        String[] moisNoms = {"janv", "fevr", "mars", "avr", "mai", "juin", "juil", "aout", "sept", "oct", "nov", "dec"};
        for (int i = 0; i < moisNoms.length; i++) {
            if (p.contains(moisNoms[i])) {
                mois = i + 1;
                break;
            }
        }

        Matcher m = Pattern.compile("\\b(20\\d{2})\\b").matcher(p);
        if (m.find()) {
            annee = Integer.parseInt(m.group(1));
        }
        return new int[]{mois, annee};
    }
}
