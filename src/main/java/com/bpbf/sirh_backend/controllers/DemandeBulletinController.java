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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
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
            String msg = String.format("Impossible de générer le bulletin pour la demande #%d : aucun agent trouvé avec le matricule '%s' ou l'ID %s.",
                    demande.getId(),
                    demande.getMatricule() != null ? demande.getMatricule() : "NON_RENSEIGNÉ",
                    demande.getEmployeeId() != null ? demande.getEmployeeId() : "NON_RENSEIGNÉ");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(msg.getBytes(java.nio.charset.StandardCharsets.UTF_8));
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
        try {
            Long empId = demande.getEmployeeId();
            Employee emp = null;
            if (empId != null) {
                emp = employeeRepository.findById(empId).orElse(null);
            }
            if (emp == null && demande.getMatricule() != null && !demande.getMatricule().isBlank()) {
                Optional<Employee> empOpt = employeeRepository.findByMatriculeIgnoreCase(demande.getMatricule().trim());
                if (empOpt.isPresent()) {
                    emp = empOpt.get();
                    empId = emp.getId();
                    demande.setEmployeeId(empId);
                }
            }
            if (emp == null) {
                log.warn("Impossible de générer ou d'associer un bulletin sans employé valide : aucun agent trouvé avec employeeId={} ou matricule='{}' pour la demande #{}",
                        demande.getEmployeeId(), demande.getMatricule(), demande.getId());
                return;
            }

            int[] ma = parseMoisAnnee(demande.getPeriode());
            int mois = ma[0];
            int annee = ma[1];
            String moisStr = String.format("%02d", mois);

            // Détermination précise du type et de la nature de bulletin
            String rawType = demande.getTypeBulletin() != null ? demande.getTypeBulletin().trim().toUpperCase(Locale.ROOT) : "";
            String rawMotif = (demande.getMotif() != null ? demande.getMotif() : "").toUpperCase(Locale.ROOT);
            String rawPeriode = (demande.getPeriode() != null ? demande.getPeriode() : "").toUpperCase(Locale.ROOT);
            String rawAll = rawType + " " + rawMotif + " " + rawPeriode;

            boolean isExtra = false;
            String natureSession = null;

            if (rawAll.contains("14") || rawAll.contains("QUATORZ")) {
                isExtra = true;
                natureSession = "QUATORZIEME_MOIS";
                demande.setTypeBulletin("14EME_MOIS");
            } else if (rawAll.contains("13") || rawAll.contains("TREIZ") || rawAll.contains("GRATIF")) {
                isExtra = true;
                natureSession = "13EME_MOIS";
                demande.setTypeBulletin("13EME_MOIS");
            } else if (rawAll.contains("STC") || rawAll.contains("SOLDE")) {
                isExtra = true;
                natureSession = "STC";
                demande.setTypeBulletin("STC");
            } else if (rawAll.contains("CONGE") || rawAll.contains("CONGÉ")) {
                isExtra = true;
                natureSession = "CONGE_PAYE";
                demande.setTypeBulletin("CONGE_PAYE");
            } else if (rawAll.contains("RETRAITE")) {
                isExtra = true;
                natureSession = "INDEMNITE_RETRAITE";
                demande.setTypeBulletin("INDEMNITE_RETRAITE");
            } else if (rawAll.contains("MATERNITE") || rawAll.contains("MATERNITÉ")) {
                isExtra = true;
                natureSession = "DIFFERENTIEL_MATERNITE";
                demande.setTypeBulletin("DIFFERENTIEL_MATERNITE");
            } else if (rawAll.contains("RAPPEL")) {
                isExtra = true;
                natureSession = "RAPPEL";
                demande.setTypeBulletin("RAPPEL");
            } else {
                demande.setTypeBulletin("ORDINAIRE");
            }

            // 1. Recherche parmi les bulletins existants de l'agent
            List<Bulletin> bulletinsEmp = bulletinRepository.findByEmployeeIdOrderByDateCalculDesc(empId);
            Bulletin bulletinTrouve = null;

            for (Bulletin b : bulletinsEmp) {
                SessionPaie s = b.getSessionPaie();
                if (s != null && s.getAnnee() != null && s.getAnnee() == annee) {
                    int bMois = BulletinService.parseMoisSafe(s.getMois());
                    if (bMois == mois) {
                        if (isExtra) {
                            String sNat = s.getNatureSession() != null ? s.getNatureSession().toUpperCase(Locale.ROOT) : "";
                            String bNat = b.getNatureSession() != null ? b.getNatureSession().toUpperCase(Locale.ROOT) : "";
                            if (sNat.contains(natureSession) || bNat.contains(natureSession) ||
                                (natureSession.equals("13EME_MOIS") && (sNat.contains("TREIZ") || bNat.contains("TREIZ")))) {
                                bulletinTrouve = b;
                                break;
                            }
                        } else {
                            if (!"EXTRAORDINAIRE".equalsIgnoreCase(s.getTypeSession()) && !"EXTRAORDINAIRE".equalsIgnoreCase(b.getTypeSession())) {
                                bulletinTrouve = b;
                                break;
                            }
                        }
                    }
                }
            }

            // Fallback par date
            if (bulletinTrouve == null && !isExtra) {
                for (Bulletin b : bulletinsEmp) {
                    if (b.getDateFrom() != null && b.getDateFrom().getYear() == annee && b.getDateFrom().getMonthValue() == mois) {
                        if (!"EXTRAORDINAIRE".equalsIgnoreCase(b.getTypeSession())) {
                            bulletinTrouve = b;
                            break;
                        }
                    }
                }
            }

            if (bulletinTrouve != null) {
                demande.setBulletinId(bulletinTrouve.getId());
                if (bulletinTrouve.getSessionPaie() != null) {
                    demande.setSessionId(bulletinTrouve.getSessionPaie().getId());
                }
                log.info("Bulletin réel #{} associé à la demande #{} pour l'agent #{} ({})",
                        bulletinTrouve.getId(), demande.getId(), empId, demande.getTypeBulletin());
                return;
            }

            // 2. Aucun bulletin trouvé : Rattachement à la session de paie existante ou création
            String[] moisNoms = {"Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"};
            String nomMois = (mois >= 1 && mois <= 12) ? moisNoms[mois - 1] : ("Mois " + moisStr);
            String periodeStr = nomMois + " " + annee;

            SessionPaie targetSession = null;
            List<SessionPaie> allSessions = sessionPaieRepository.findAll();
            for (SessionPaie s : allSessions) {
                if (Objects.equals(s.getAnnee(), annee) && BulletinService.parseMoisSafe(s.getMois()) == mois) {
                    if (isExtra) {
                        if ("EXTRAORDINAIRE".equalsIgnoreCase(s.getTypeSession())) {
                            String sNat = s.getNatureSession() != null ? s.getNatureSession().toUpperCase(Locale.ROOT) : "";
                            if (sNat.contains(natureSession) || (natureSession.equals("13EME_MOIS") && sNat.contains("TREIZ"))) {
                                targetSession = s;
                                break;
                            }
                        }
                    } else {
                        if (!"EXTRAORDINAIRE".equalsIgnoreCase(s.getTypeSession())) {
                            targetSession = s;
                            break;
                        }
                    }
                }
            }

            // Si la session existe déjà, vérifier s'il existe déjà un bulletin de l'agent
            if (targetSession != null) {
                List<Bulletin> existants = bulletinRepository.findBySessionPaieIdAndEmployeeId(targetSession.getId(), emp.getId());
                if (existants != null && !existants.isEmpty()) {
                    Bulletin existant = existants.get(0);
                    demande.setBulletinId(existant.getId());
                    demande.setSessionId(targetSession.getId());
                    log.info("Bulletin existant #{} déjà présent dans la session #{} ({}) associé directement à la demande #{}",
                            existant.getId(), targetSession.getId(), targetSession.getCodeSession(), demande.getId());
                    return;
                }
            }

            // Si aucune session appropriée n'existe, la créer
            if (targetSession == null) {
                targetSession = new SessionPaie();
                targetSession.setMois(moisStr);
                targetSession.setAnnee(annee);
                targetSession.setTypeSession(isExtra ? "EXTRAORDINAIRE" : "ORDINAIRE");
                targetSession.setNatureSession(isExtra ? natureSession : null);
                targetSession.setStatut("GENERE");
                targetSession.setCreePar("SERVICE_PAIE");
                targetSession.setDateCreation(LocalDateTime.now());
                targetSession.setPeriode(periodeStr);

                LocalDate deb = LocalDate.of(annee, mois, 1);
                LocalDate fin = deb.withDayOfMonth(deb.lengthOfMonth());
                targetSession.setDateFrom(deb);
                targetSession.setDateTo(fin);

                String baseCode = isExtra
                        ? String.format("SESS-%s-%d-%s", natureSession.replace("_MOIS", ""), annee, moisStr)
                        : String.format("SESS-%d-%s", annee, moisStr);

                String finalCode = baseCode;
                int suffix = 1;
                while (sessionPaieRepository.findByCodeSession(finalCode).isPresent()) {
                    finalCode = baseCode + "-" + suffix++;
                }
                targetSession.setCodeSession(finalCode);
                targetSession.setName(isExtra
                        ? ("Session Extraordinaire " + natureSession + " — " + periodeStr)
                        : ("Session Ordinaire — " + periodeStr));

                targetSession = sessionPaieRepository.save(targetSession);
                log.info("Nouvelle session de paie #{} ({}) créée automatiquement pour la demande #{}",
                        targetSession.getId(), targetSession.getCodeSession(), demande.getId());
            }

            // 3. Calculer et enregistrer le bulletin officiel de l'employé dans cette session
            Bulletin nouveauBulletin = bulletinService.computeAndSaveBulletin(targetSession, emp);
            bulletinService.recalculerTotauxSession(targetSession);

            demande.setBulletinId(nouveauBulletin.getId());
            demande.setSessionId(targetSession.getId());

            log.info("Bulletin officiel #{} généré avec succès dans la session #{} ({}) pour la demande #{}",
                    nouveauBulletin.getId(), targetSession.getId(), targetSession.getCodeSession(), demande.getId());

        } catch (Exception e) {
            log.error("Erreur lors de la génération/association du bulletin pour la demande #{}: {}",
                    demande.getId(), e.getMessage(), e);
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
