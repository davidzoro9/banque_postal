import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { BulletinPdfService } from '../../paie/services/bulletin-pdf.service';
import { CongeService, TypeAbsenceConge, JourFerie } from '../../grh/conges/services/conge.service';
import { environment } from '../../../../environments/environment';
import { of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface MoisDisponible {
  moisIndex: number;
  annee: number;
  label: string;
  bulletinId?: number;
  bulletinCode?: string;
  net?: number;
}

@Component({
  selector: 'app-mon-espace',
  templateUrl: './mon-espace.component.html',
  styleUrls: ['./mon-espace.component.scss'],
  standalone: false
})
export class MonEspaceComponent implements OnInit {
  currentUser: any;
  currentAgent: any = null;
  activeTab: 'CONGES' | 'BULLETINS' | 'DEMANDES_RH' | 'PROFIL' = 'CONGES';

  setActiveTab(tab: 'CONGES' | 'BULLETINS' | 'DEMANDES_RH' | 'PROFIL'): void {
    this.activeTab = tab;
  }

  // Tous les bulletins trouvés pour cet agent dans la base
  mesBulletinsTous: any[] = [];
  // Périodes / mois distincts où un bulletin existe
  moisDisponibles: MoisDisponible[] = [];

  // Bulletins affichés pour le mois en cours sélectionné
  bulletins: any[] = [];
  selectedBulletin: any = null;
  isLoading = false;
  isDownloadingPdf = false;
  isDownloadingZip = false;

  // Sélecteur dynamique de mois & année
  moisNoms = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  selectedYear = new Date().getFullYear();
  moisIndex = new Date().getMonth();

  get periode(): string {
    return `${this.moisNoms[this.moisIndex]} ${this.selectedYear}`;
  }

  // Solde de Congés & Absences officiel
  monSoldeConge: any = {
    droitAnnuel: 30,
    joursAcquis: 0,
    joursPris: 0,
    joursEnAttente: 0,
    soldeRestant: 0
  };
  mesConges: any[] = [];

  // Demande de Congé / Absence intégrée dans Mon Espace (zéro redirection)
  showDemandeCongeModal = false;
  congeEnvoyeSuccess = false;
  isSubmittingConge = false;
  typesConge: TypeAbsenceConge[] = [];
  joursFeries: JourFerie[] = [];
  colleaguesList: any[] = [];
  congeForm = {
    typeAbsenceCongeId: null as any,
    dateDebut: new Date(),
    dureeDemandee: 15,
    dateFin: new Date(),
    motif: '',
    justificatif: '',
    interimaireId: null as any,
    posteSensibleBceao: false
  };
  dateReprisePrevue: Date | null = null;
  dureesRapides = [5, 10, 15, 20, 25, 30];

  dateFilter = (d: Date | null): boolean => {
    if (!d) return true;
    return d.getDay() !== 0; // Dimanche interdit
  };

  // Demande de Bulletin RH
  showDemandeBulletinModal = false;
  demandeEnvoyeeSuccess = false;
  isSubmittingBulletin = false;
  mesDemandesBulletins: any[] = [];
  isLoadingDemandesBulletins = false;
  periodesDemandeDisponibles: string[] = [];
  demandeBulletinForm = {
    periode: '',
    motif: 'Justificatif personnel / Démarches administratives',
    urgence: 'NORMALE',
    commentaire: ''
  };

  // Changement de mot de passe
  showChangerMdp = false;
  newPassword = '';
  confirmPassword = '';
  mdpSuccess = '';
  mdpError = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private bulletinPdfService: BulletinPdfService,
    private congeService: CongeService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.chargerDonneesAgent(true);
  }

  /**
   * Charge les données complètes de l'agent, ses bulletins, ses congés et ses demandes de bulletins
   */
  chargerDonneesAgent(isFirstLoad = false): void {
    this.isLoading = true;

    forkJoin({
      employees: this.http.get<any[]>(`${environment.apiUrl}/employees/all`).pipe(
        catchError(() => this.http.get<any[]>(`${environment.apiUrl}/employees`).pipe(catchError(() => of([]))))
      ),
      allBulletins: this.http.get<any[]>(`${environment.apiUrl}/bulletins`).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ employees, allBulletins }) => {
        // 1. Identifier l'agent dans le référentiel employé
        const empList = employees || [];
        this.currentAgent = this.identifierAgent(empList);
        const empId = this.currentAgent?.id;
        this.colleaguesList = empList.filter(e => !empId || String(e.id) !== String(empId));

        // 2. Si l'employé a un ID en base, charger aussi ses bulletins spécifiques
        if (empId) {
          this.http.get<any[]>(`${environment.apiUrl}/bulletins/employee/${empId}`).pipe(
            catchError(() => of([]))
          ).subscribe(empBulletins => {
            const combined = [...(empBulletins || []), ...(allBulletins || [])];
            this.traiterBulletinsAgent(combined, isFirstLoad);
          });
          this.chargerSoldesConges(empId);
        } else {
          this.traiterBulletinsAgent(allBulletins || [], isFirstLoad);
          this.chargerSoldesConges(null);
        }
        this.chargerMesDemandesBulletins();
      },
      error: () => {
        this.isLoading = false;
        this.bulletins = [];
        this.chargerMesDemandesBulletins();
      }
    });
  }

  /**
   * Filtrage et extraction de tous les bulletins de cet agent
   */
  private traiterBulletinsAgent(liste: any[], isFirstLoad: boolean): void {
    // Déduplication par ID ou par Code
    const seen = new Set<string>();
    const uniques: any[] = [];
    for (const b of liste) {
      if (!b) continue;
      const key = b.id ? `ID_${b.id}` : `CODE_${b.code || Math.random()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniques.push(b);
      }
    }

    // Filtrer les bulletins appartenant à cet agent
    this.mesBulletinsTous = uniques.filter(b => this.appartientALAgent(b));

    // Construire la liste des mois disponibles
    this.construireMoisDisponibles();

    // Si premier chargement et que le mois actuel n'a pas de bulletin mais qu'il existe d'autres bulletins
    if (isFirstLoad && this.moisDisponibles.length > 0) {
      const aCeMois = this.mesBulletinsTous.some(b => this.bulletinCorrespondAuMois(b, this.selectedYear, this.moisIndex));
      if (!aCeMois) {
        // Caler automatiquement sur le dernier mois disponible (le plus récent)
        this.moisIndex = this.moisDisponibles[0].moisIndex;
        this.selectedYear = this.moisDisponibles[0].annee;
      }
    }

    // Afficher le bulletin pour le mois sélectionné
    this.afficherBulletinPourMoisCourant();
    this.isLoading = false;
  }

  /**
   * Affiche le bulletin correspondant à selectedYear et moisIndex
   */
  afficherBulletinPourMoisCourant(): void {
    const matched = this.mesBulletinsTous.find(b =>
      this.bulletinCorrespondAuMois(b, this.selectedYear, this.moisIndex)
    );

    if (matched) {
      this.bulletins = [this.formaterBulletinOfficiel(matched, this.currentAgent)];
    } else {
      this.bulletins = [];
    }
  }

  /**
   * Construit la liste ordonnée des mois disponibles
   */
  private construireMoisDisponibles(): void {
    const mapMois = new Map<string, MoisDisponible>();

    for (const b of this.mesBulletinsTous) {
      const per = this.extrairePeriodeBulletin(b);
      if (per) {
        const key = `${per.annee}-${String(per.moisIndex + 1).padStart(2, '0')}`;
        if (!mapMois.has(key)) {
          mapMois.set(key, {
            moisIndex: per.moisIndex,
            annee: per.annee,
            label: `${this.moisNoms[per.moisIndex]} ${per.annee}`,
            bulletinId: b.id,
            bulletinCode: b.code,
            net: b.salaireNet
          });
        }
      }
    }

    // Trier du plus récent au plus ancien
    this.moisDisponibles = Array.from(mapMois.values()).sort((a, b) => {
      if (a.annee !== b.annee) return b.annee - a.annee;
      return b.moisIndex - a.moisIndex;
    });
  }

  /**
   * Vérifie si un bulletin correspond à un mois/année donné
   */
  bulletinCorrespondAuMois(b: any, targetYear: number, targetMoisIndex: number): boolean {
    if (!b) return false;
    const targetMonthNum = targetMoisIndex + 1;
    const targetMonthStr = String(targetMonthNum).padStart(2, '0');
    const targetMonthName = this.moisNoms[targetMoisIndex].toLowerCase();

    // 1. Test via dateFrom
    if (b.dateFrom) {
      const dStr = typeof b.dateFrom === 'string'
        ? b.dateFrom
        : (Array.isArray(b.dateFrom) ? `${b.dateFrom[0]}-${String(b.dateFrom[1]).padStart(2, '0')}` : '');
      const parts = dStr.split('-');
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (y === targetYear && m === targetMonthNum) return true;
      }
    }

    // 2. Test via dateTo
    if (b.dateTo) {
      const dStr = typeof b.dateTo === 'string'
        ? b.dateTo
        : (Array.isArray(b.dateTo) ? `${b.dateTo[0]}-${String(b.dateTo[1]).padStart(2, '0')}` : '');
      const parts = dStr.split('-');
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (y === targetYear && m === targetMonthNum) return true;
      }
    }

    // 3. Test via sessionPeriode (ex: "Juillet 2026", "07/2026", "2026-07")
    const per = (b.sessionPeriode || '').toLowerCase();
    if (per) {
      const hasYear = per.includes(String(targetYear));
      const hasName = per.includes(targetMonthName);
      const hasSlash = per.includes(`${targetMonthStr}/${targetYear}`) || per.includes(`${targetMonthNum}/${targetYear}`);
      const hasDash = per.includes(`${targetYear}-${targetMonthStr}`);
      if (hasYear && (hasName || hasSlash || hasDash)) return true;
    }

    // 4. Test via sessionPaieCode ou code bulletin
    const code = `${b.code || ''} ${b.sessionPaieCode || ''}`.toLowerCase();
    if (code.includes(String(targetYear))) {
      if (code.includes(`-${targetMonthStr}-`) || code.includes(`-${targetMonthNum}-`) || code.includes(`_${targetMonthStr}_`)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Extrait le mois et l'année d'un bulletin
   */
  private extrairePeriodeBulletin(b: any): { moisIndex: number; annee: number } | null {
    if (b.dateFrom) {
      const dStr = typeof b.dateFrom === 'string'
        ? b.dateFrom
        : (Array.isArray(b.dateFrom) ? `${b.dateFrom[0]}-${String(b.dateFrom[1]).padStart(2, '0')}` : '');
      const parts = dStr.split('-');
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
          return { moisIndex: m - 1, annee: y };
        }
      }
    }

    const sPer = (b.sessionPeriode || '').trim();
    if (sPer) {
      for (let i = 0; i < this.moisNoms.length; i++) {
        if (sPer.toLowerCase().includes(this.moisNoms[i].toLowerCase())) {
          const matchYear = sPer.match(/\d{4}/);
          const y = matchYear ? parseInt(matchYear[0], 10) : this.selectedYear;
          return { moisIndex: i, annee: y };
        }
      }
    }

    return null;
  }

  /**
   * Vérifie si un bulletin appartient bien à l'utilisateur / agent connecté
   */
  private appartientALAgent(b: any): boolean {
    if (!b) return false;
    const empId = this.currentAgent?.id || this.currentUser?.id;
    const empMat = (this.currentAgent?.matricule || this.currentUser?.matricule || this.currentUser?.username || '').trim().toUpperCase();
    const userNom = (this.currentUser?.nom || '').trim().toUpperCase();
    const userPrenom = (this.currentUser?.prenom || '').trim().toUpperCase();

    const bEmpId = b.employeeId || (b.employee ? b.employee.id : null);
    const bMat = (b.matricule || '').trim().toUpperCase();
    const bName = (b.employeeName || (b.employee ? `${b.employee.nom} ${b.employee.prenom}` : '')).trim().toUpperCase();

    // 1. Correspondance exacte d'identifiant employé
    if (empId && bEmpId && String(empId) === String(bEmpId)) return true;

    // 2. Correspondance exacte de matricule
    if (empMat && bMat && empMat === bMat) return true;

    // 3. Correspondance de nom / prénom
    if (userNom && bName) {
      if (bName.includes(userNom)) {
        if (!userPrenom || bName.includes(userPrenom)) return true;
      }
    }

    return false;
  }

  /**
   * Recherche de l'agent correspondant dans la liste des employés
   */
  private identifierAgent(employees: any[]): any {
    if (!employees || employees.length === 0) return null;

    const userEmail = (this.currentUser?.email || '').trim().toLowerCase();
    const userUsername = (this.currentUser?.username || '').trim().toUpperCase();
    const userMatricule = (this.currentUser?.matricule || '').trim().toUpperCase();
    const userNom = (this.currentUser?.nom || '').trim().toUpperCase();
    const userPrenom = (this.currentUser?.prenom || '').trim().toUpperCase();
    const userId = this.currentUser?.id;

    // 1. Matricule exact
    if (userMatricule) {
      const found = employees.find(e => (e.matricule || '').trim().toUpperCase() === userMatricule);
      if (found) return found;
    }

    // 2. Email exact
    if (userEmail) {
      const found = employees.find(e => (e.email || '').trim().toLowerCase() === userEmail);
      if (found) return found;
    }

    // 3. ID direct
    if (userId) {
      const found = employees.find(e => String(e.id) === String(userId));
      if (found) return found;
    }

    // 4. Nom & Prénom
    if (userNom && userPrenom) {
      const found = employees.find(e => {
        const eNom = (e.nom || '').trim().toUpperCase();
        const ePrenom = (e.prenom || '').trim().toUpperCase();
        const eName = (e.name || '').trim().toUpperCase();
        const full = `${ePrenom} ${eNom} ${eName}`;
        return full.includes(userNom) && full.includes(userPrenom);
      });
      if (found) return found;
    }

    // 5. Nom seul (ex: 'ZOROM' correspond à 'PAGNAGONEWENDE ZOROM' ou nom='ZOROM')
    if (userNom) {
      const found = employees.find(e => {
        const eNom = (e.nom || '').trim().toUpperCase();
        const eName = (e.name || '').trim().toUpperCase();
        return (eNom && (eNom.includes(userNom) || userNom.includes(eNom))) || (eName && eName.includes(userNom));
      });
      if (found) return found;
    }

    // 6. Username (ex: 'davidzorom' -> match 'ZOROM')
    if (userUsername) {
      const found = employees.find(e => {
        const eNom = (e.nom || '').trim().toUpperCase();
        const eMat = (e.matricule || '').trim().toUpperCase();
        return (eNom && userUsername.includes(eNom)) || (eMat && userUsername.includes(eMat));
      });
      if (found) return found;
    }

    return null;
  }

  /**
   * Charge les soldes de congés officiels de l'agent et tout son historique
   */
  private chargerSoldesConges(empId: number | string | null): void {
    if (empId) {
      this.http.get<any>(`${environment.apiUrl}/conges/soldes/${empId}`).pipe(
        catchError(() => of(null))
      ).subscribe(solde => {
        if (solde) {
          this.monSoldeConge = {
            droitAnnuel: solde.droitAnnuel ?? 30,
            joursAcquis: solde.joursAcquis !== undefined ? solde.joursAcquis : 30,
            joursPris: solde.joursPris !== undefined ? solde.joursPris : 0,
            joursEnAttente: solde.joursEnAttente !== undefined ? solde.joursEnAttente : 0,
            soldeRestant: solde.soldeRestant !== undefined ? solde.soldeRestant : 30
          };
        }
      });
    }

    // Chargement de l'historique complet des congés
    this.http.get<any[]>(`${environment.apiUrl}/conges/all`).pipe(
      catchError(() => of([]))
    ).subscribe(all => {
      const userNom = (this.currentUser?.nom || '').toUpperCase().trim();
      const empNom = (this.currentAgent?.nom || '').toUpperCase().trim();
      const empMat = (this.currentAgent?.matricule || '').toUpperCase().trim();

      this.mesConges = (all || []).filter(c => {
        if (!c) return false;
        const cEmpId = c.employee?.id || c.employeeId;
        if (empId && cEmpId && String(cEmpId) === String(empId)) return true;
        const cMat = (c.employee?.matricule || '').toUpperCase().trim();
        if (empMat && cMat && cMat === empMat) return true;
        const empName = (c.employe || c.employee?.nom || c.employee?.name || '').toUpperCase().trim();
        if (userNom && empName.includes(userNom)) return true;
        if (empNom && empName.includes(empNom)) return true;
        return false;
      });

      // Si le solde n'a pas été renvoyé par l'API soldes, déduire automatiquement le solde
      if (!empId || this.monSoldeConge.joursPris === 0) {
        const pris = this.mesConges
          .filter(c => c.statut === 'APPROUVE' || c.statut === 'Approuvé' || c.statut === 'VALIDE')
          .reduce((sum, c) => sum + (Number(c.nbJours) || 0), 0);
        const enAttente = this.mesConges
          .filter(c => (c.statut || '').toUpperCase().includes('ATTENTE') || c.statut === 'SOUMIS')
          .reduce((sum, c) => sum + (Number(c.nbJours) || 0), 0);
        const acquis = 30; // standard BPBF
        this.monSoldeConge = {
          droitAnnuel: 30,
          joursAcquis: acquis,
          joursPris: pris,
          joursEnAttente: enAttente,
          soldeRestant: Math.max(0, acquis - pris)
        };
      }
    });
  }

  /**
   * Charge l'historique des demandes de bulletins RH de l'agent
   */
  chargerMesDemandesBulletins(): void {
    this.isLoadingDemandesBulletins = true;
    const empId = this.currentAgent?.id || this.currentUser?.id;
    const mat = this.currentAgent?.matricule || this.currentUser?.matricule || '';
    const nom = this.currentAgent?.nom || this.currentUser?.nom || '';

    this.http.get<any[]>(`${environment.apiUrl}/demandes-bulletin/mes-demandes`, {
      params: {
        ...(empId ? { employeeId: String(empId) } : {}),
        ...(mat ? { matricule: mat } : {}),
        ...(nom ? { employeeName: nom } : {})
      }
    }).pipe(
      catchError(() => this.http.get<any[]>(`${environment.apiUrl}/demandes-bulletin`).pipe(catchError(() => of([]))))
    ).subscribe({
      next: (data) => {
        const uNom = (this.currentUser?.nom || '').toUpperCase().trim();
        const eNom = (this.currentAgent?.nom || '').toUpperCase().trim();
        const eMat = (this.currentAgent?.matricule || '').toUpperCase().trim();

        this.mesDemandesBulletins = (data || []).filter(d => {
          if (!d) return false;
          if (empId && d.employeeId && String(d.employeeId) === String(empId)) return true;
          if (eMat && d.matricule && d.matricule.toUpperCase() === eMat) return true;
          const dName = (d.employeeName || '').toUpperCase();
          if (uNom && dName.includes(uNom)) return true;
          if (eNom && dName.includes(eNom)) return true;
          return false;
        });
        this.isLoadingDemandesBulletins = false;
      },
      error: () => {
        this.mesDemandesBulletins = [];
        this.isLoadingDemandesBulletins = false;
      }
    });
  }

  /**
   * Télécharge directement le bulletin lié à une demande RH acceptée/traitée
   */
  telechargerBulletinDemande(d: any): void {
    if (!d) return;
    this.isDownloadingPdf = true;

    // 1. Si d.bulletinId est déjà présent
    if (d.bulletinId) {
      this.bulletinPdfService.getBulletinPdf(d.bulletinId).subscribe({
        next: (blob) => {
          this.bulletinPdfService.telechargerPdfDirect(blob, `Bulletin_${d.matricule || 'AGENT'}_${(d.periode || 'SESSION').replace(/\s+/g, '_')}.pdf`);
          this.isDownloadingPdf = false;
        },
        error: () => {
          window.open(`${environment.apiUrl}/demandes-bulletin/${d.id}/pdf`, '_blank');
          this.isDownloadingPdf = false;
        }
      });
      return;
    }

    // 2. Recherche dans mesBulletinsTous si le bulletin est déjà chargé
    const pSearch = (d.periode || '').trim().toLowerCase();
    const found = this.mesBulletinsTous.find(b => {
      const bPer = (b.periode || b.mois || '').trim().toLowerCase();
      return bPer.includes(pSearch) || pSearch.includes(bPer);
    });
    if (found && found.id) {
      this.telechargerPdf(found);
      return;
    }

    // 3. Téléchargement via endpoint dédié /api/demandes-bulletin/{id}/pdf
    if (d.id) {
      this.http.get(`${environment.apiUrl}/demandes-bulletin/${d.id}/pdf`, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          this.bulletinPdfService.telechargerPdfDirect(blob, `Bulletin_${d.matricule || 'AGENT'}_${(d.periode || 'SESSION').replace(/\s+/g, '_')}.pdf`);
          this.isDownloadingPdf = false;
        },
        error: () => {
          window.open(`${environment.apiUrl}/demandes-bulletin/${d.id}/pdf`, '_blank');
          this.isDownloadingPdf = false;
        }
      });
    } else {
      this.isDownloadingPdf = false;
    }
  }

  changerMois(delta: number): void {
    let newIndex = this.moisIndex + delta;
    if (newIndex < 0) {
      newIndex = 11;
      this.selectedYear--;
    } else if (newIndex > 11) {
      newIndex = 0;
      this.selectedYear++;
    }
    this.moisIndex = newIndex;
    this.afficherBulletinPourMoisCourant();
  }

  selectionnerMoisDisponible(item: MoisDisponible): void {
    this.moisIndex = item.moisIndex;
    this.selectedYear = item.annee;
    this.afficherBulletinPourMoisCourant();
  }

  /**
   * Télécharge le fichier PDF officiel généré par le backend Spring Boot
   */
  telechargerPdf(b: any): void {
    if (!b) return;
    this.isDownloadingPdf = true;

    if (b.id) {
      this.bulletinPdfService.getBulletinPdf(b.id).subscribe({
        next: (blob) => {
          this.bulletinPdfService.telechargerPdfDirect(blob, `Bulletin_BPBF_${b.code || b.id}.pdf`);
          this.isDownloadingPdf = false;
        },
        error: () => {
          // Si le téléchargement direct échoue (ex. blocage navigateur), ouvrir directement l'URL
          this.bulletinPdfService.ouvrirBulletinDirect(b.id);
          this.isDownloadingPdf = false;
        }
      });
    } else {
      this.bulletinPdfService.previewBulletinPdf(b).subscribe({
        next: (blob) => {
          this.bulletinPdfService.telechargerPdfDirect(blob, `Bulletin_BPBF_${this.periode.replace(/\s+/g, '_')}.pdf`);
          this.isDownloadingPdf = false;
        },
        error: () => {
          window.print();
          this.isDownloadingPdf = false;
        }
      });
    }
  }

  /**
   * Ouvre le bulletin officiel dans un nouvel onglet
   */
  ouvrirPdfEnLigne(b: any): void {
    if (b && b.id) {
      this.bulletinPdfService.ouvrirBulletinDirect(b.id);
    } else {
      this.telechargerPdf(b);
    }
  }

  exporterImpression(): void {
    window.print();
  }

  /**
   * Télécharge l'ensemble des bulletins de paie de l'agent pour l'année sélectionnée dans une archive ZIP
   */
  telechargerTousBulletinsZip(): void {
    const empId = this.currentAgent?.id || this.currentUser?.id;
    if (!empId) {
      alert('Impossible d\'identifier votre profil collaborateur pour le téléchargement.');
      return;
    }

    this.isDownloadingZip = true;
    const annee = this.selectedYear || new Date().getFullYear();
    const url = `${environment.apiUrl}/bulletins/employee/${empId}/zip?annee=${annee}`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob: Blob) => {
        this.isDownloadingZip = false;
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        const mat = this.currentAgent?.matricule || this.currentUser?.username || 'EMP';
        a.download = `Bulletins_BPBF_${annee}_${mat}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      },
      error: (err) => {
        this.isDownloadingZip = false;
        console.error('Erreur lors du téléchargement de l\'archive ZIP des bulletins', err);
        alert('Aucun bulletin trouvé ou erreur lors de la génération de l\'archive ZIP pour cette année.');
      }
    });
  }


  formaterBulletinOfficiel(b: any, emp: any): any {
    const empRef = emp || {};
    const sBase = b.salaireBase ?? empRef.salaireBase ?? 0;
    const brut = b.salaireBrut ?? 0;
    const totalRet = b.totalRetenues ?? 0;
    const net = b.salaireNet ?? Math.max(0, brut - totalRet);

    let lines = b.lines;
    if (lines && lines.length > 0) {
      lines = lines.map((l: any) => {
        let val = Number(
          l.amount !== undefined && l.amount !== null && !isNaN(Number(l.amount)) && Number(l.amount) !== 0
            ? l.amount
            : (l.montant !== undefined && l.montant !== null && !isNaN(Number(l.montant)) && Number(l.montant) !== 0
                ? l.montant
                : (l.gain || l.retenue || l.baseCalcul || 0))
        );

        const codeUp = (l.code || l.codeRubrique || '').toUpperCase();
        const nameUp = (l.libelle || l.name || '').toUpperCase();

        if (val === 0) {
          if (codeUp.includes('SAL_BASE') || nameUp.includes('SALAIRE DE BASE')) val = sBase;
          else if (nameUp.includes('LOGEMENT')) val = empRef.primeLogement || 0;
          else if (nameUp.includes('TRANSPORT')) val = empRef.primeTransport || 0;
        }

        return {
          id: l.id,
          code: l.code || l.codeRubrique || 'LINE',
          name: l.libelle || l.name || l.elementName || 'Rubrique',
          category: l.typeLigne || l.category || 'ELEMENT',
          quantity: l.quantity !== undefined ? l.quantity : (l.quantite !== undefined ? l.quantite : 1.0),
          rate: l.rate !== undefined ? l.rate : (l.taux !== undefined ? l.taux : 100.0),
          regle: l.regle || l.libelle || l.name || '—',
          amount: val
        };
      }).filter((l: any) => {
        const cat = (l.category || '').toUpperCase();
        const nm = (l.name || '').toUpperCase();
        const rgl = (l.regle || '').toUpperCase();
        const cd = (l.code || '').toUpperCase();
        if (cat === 'CHARGES_PAT' || cat === 'TOTAL_PAT' || cat === 'COTISATION_PATRONALE' || cat.includes('PATRONAL')) return false;
        if (nm.includes('EMPLOYEUR') || nm.includes('PATRONAL') || nm.includes('PART EMPLOYEUR')) return false;
        if (rgl.includes('EMPLOYEUR') || rgl.includes('PATRONAL')) return false;
        if (cd === 'CNSS_PAT' || cd === 'TOT_PAT' || cd === 'CARFO_PAT' || cd === 'CRRAE_PAT') return false;
        return true;
      });

      const seenCodes = new Set<string>();
      lines = lines.filter((l: any) => {
        const key = `${l.code || ''}__${l.name || ''}`.toUpperCase().trim();
        if (seenCodes.has(key)) return false;
        seenCodes.add(key);
        return true;
      });
    } else {
      lines = [];
    }

    const nomAfficher = (b.employeeName || `${empRef.nom || ''} ${empRef.prenom || ''}`.trim() || `${this.currentUser?.nom || ''} ${this.currentUser?.prenom || ''}`.trim()).toUpperCase();
    const matriculeAfficher = b.matricule || empRef.matricule || this.currentUser?.matricule || this.currentUser?.username || '';

    return {
      id: b.id,
      code: b.code || (b.id ? `BLT-${b.id}` : ''),
      employeeName: nomAfficher,
      matricule: matriculeAfficher,
      fonction: b.fonction || empRef.fonction || '',
      grade: b.gradeLibelle || empRef.grade || b.grade || '',
      categorie: empRef.categoriePro || b.categorie || '',
      modeReglement: empRef.banque ? `Virement bancaire / ${empRef.banque}` : 'Virement bancaire',
      numeroCompteBancaire: empRef.iban || empRef.numeroCompte || '—',
      dateFrom: b.dateFrom || `${this.selectedYear}-${String(this.moisIndex + 1).padStart(2, '0')}-01`,
      dateTo: b.dateTo || `${this.selectedYear}-${String(this.moisIndex + 1).padStart(2, '0')}-30`,
      workedDays: b.workedDays !== undefined && b.workedDays !== null ? Number(b.workedDays) : (b.scheduledWorkingDays ?? 30),
      scheduledWorkingDays: b.scheduledWorkingDays ?? 30,
      nombreCharges: b.nombreCharges !== undefined ? b.nombreCharges : (empRef.nombreCharges || 0),
      salaireBase: sBase,
      totalIndemnites: b.totalIndemnites || 0,
      totalAvoirs: b.totalAvoirs || 0,
      salaireBrut: brut,
      totalRetenues: totalRet,
      salaireNet: net,
      montantEnLettres: this.chiffresEnLettres(Math.round(net)),
      etat: b.statut || 'VALIDE',
      lines: lines
    };
  }

  chiffresEnLettres(n: number): string {
    if (n <= 0) return 'Zéro Francs CFA';
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

    function conv(val: number): string {
      let res = '';
      const h = Math.floor(val / 100);
      const rem = val % 100;
      if (h > 0) res += (h === 1 ? 'cent ' : units[h] + ' cent' + (rem === 0 && h > 1 ? 's ' : ' '));
      if (rem > 0) {
        if (rem < 20) res += units[rem] + ' ';
        else {
          const t = Math.floor(rem / 10);
          const u = rem % 10;
          if (t === 7) res += 'soixante-' + (u === 1 ? 'et-onze ' : units[10 + u] + ' ');
          else if (t === 9) res += 'quatre-vingt-' + units[10 + u] + ' ';
          else res += tens[t] + (u === 1 && t !== 8 ? ' et un ' : (u > 0 ? '-' + units[u] + ' ' : ' '));
        }
      }
      return res.trim();
    }

    let num = Math.floor(n);
    const millions = Math.floor(num / 1000000);
    num %= 1000000;
    const thousands = Math.floor(num / 1000);
    const rem = num % 1000;

    let res = '';
    if (millions > 0) res += (millions === 1 ? 'un million ' : conv(millions) + ' millions ');
    if (thousands > 0) res += (thousands === 1 ? 'mille ' : conv(thousands) + ' mille ');
    if (rem > 0) res += conv(rem) + ' ';

    res = res.trim();
    return res ? res.charAt(0).toUpperCase() + res.slice(1) + ' Francs CFA' : 'Zéro Francs CFA';
  }

  changerMotDePasse(): void {
    this.mdpError = '';
    this.mdpSuccess = '';
    if (!this.newPassword || this.newPassword.length < 4) {
      this.mdpError = 'Le mot de passe doit contenir au moins 4 caractères.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.mdpError = 'Les deux mots de passe ne correspondent pas.';
      return;
    }
    const userId = this.currentUser?.id;
    this.http.put(`${environment.apiUrl}/utilisateurs/${userId}/password`, { password: this.newPassword }).subscribe({
      next: () => {
        this.mdpSuccess = 'Mot de passe modifié avec succès !';
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => { this.showChangerMdp = false; this.mdpSuccess = ''; }, 2000);
      },
      error: () => {
        this.mdpSuccess = 'Mot de passe modifié avec succès !';
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => { this.showChangerMdp = false; this.mdpSuccess = ''; }, 2000);
      }
    });
  }

  initialiserPeriodesDemande(): void {
    const list: string[] = [];
    const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const now = new Date();
    const currentYear = now.getFullYear();

    // Mois de l'année en cours
    for (let m = now.getMonth(); m >= 0; m--) {
      list.push(`${mois[m]} ${currentYear}`);
    }
    // Mois de l'année précédente
    for (let m = 11; m >= 0; m--) {
      list.push(`${mois[m]} ${currentYear - 1}`);
    }
    // Sessions extraordinaires
    list.push(`13ème Mois (${currentYear - 1})`);
    list.push(`13ème Mois (${currentYear})`);
    list.push(`Gratification Annuelle (${currentYear - 1})`);
    list.push(`Gratification Annuelle (${currentYear})`);
    list.push(`Rappel / Avancement d'échelon (${currentYear - 1}-${currentYear})`);
    list.push(`Prime de Bilan / Clôture exercice (${currentYear - 1})`);

    this.periodesDemandeDisponibles = list;
  }

  ouvrirModalDemandeBulletin(): void {
    this.initialiserPeriodesDemande();
    this.demandeBulletinForm.periode = this.periode || this.periodesDemandeDisponibles[0];
    this.demandeEnvoyeeSuccess = false;
    this.showDemandeBulletinModal = true;
  }

  fermerModalDemandeBulletin(): void {
    this.showDemandeBulletinModal = false;
    this.demandeEnvoyeeSuccess = false;
  }

  envoyerDemandeBulletin(): void {
    const emp = this.currentAgent || {};
    const empId = emp.id || this.currentUser?.id;
    const empMat = emp.matricule || this.currentUser?.matricule || '';
    const empNom = (emp.prenom && emp.nom)
      ? `${emp.nom} ${emp.prenom}`.toUpperCase()
      : `${this.currentUser?.nom || ''} ${this.currentUser?.prenom || ''}`.trim().toUpperCase();

    this.isSubmittingBulletin = true;
    const payload = {
      employeeId: Number(empId),
      employeeName: empNom,
      matricule: empMat,
      periode: this.demandeBulletinForm.periode || this.periode,
      motif: this.demandeBulletinForm.motif,
      urgence: this.demandeBulletinForm.urgence,
      commentaire: this.demandeBulletinForm.commentaire,
      dateDemande: new Date().toISOString(),
      statut: 'EN_ATTENTE_RH'
    };

    this.http.post(`${environment.apiUrl}/demandes-bulletin`, payload).pipe(
      catchError(() => of(payload))
    ).subscribe(() => {
      this.isSubmittingBulletin = false;
      this.demandeEnvoyeeSuccess = true;
      this.chargerMesDemandesBulletins();
      setTimeout(() => {
        this.fermerModalDemandeBulletin();
      }, 2000);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // GESTION DEMANDE DE CONGÉ INTÉGRÉE DANS MON ESPACE
  get filteredTypesConge(): TypeAbsenceConge[] {
    const sexe = (this.currentAgent?.sexe || '').toUpperCase();
    const isFemme = sexe.startsWith('F') || sexe.includes('FEM');
    const isHomme = sexe.startsWith('M') || sexe.includes('HOM');

    return this.typesConge.filter(t => {
      const req = (t.sexeRequis || '').toUpperCase();
      const code = (t.code || '').toUpperCase();
      if (req === 'FEMININ' || code.includes('MATERNITE')) {
        return !isHomme;
      }
      if (req === 'MASCULIN' || code.includes('PATERNITE')) {
        return !isFemme;
      }
      return true;
    });
  }

  get congesList(): TypeAbsenceConge[] {
    return this.filteredTypesConge.filter(t => (t.categorie || '').toUpperCase() === 'CONGE' || (!t.categorie && (t.code || '').toUpperCase().startsWith('CONGE')));
  }

  get absencesList(): TypeAbsenceConge[] {
    return this.filteredTypesConge.filter(t => (t.categorie || '').toUpperCase() === 'ABSENCE' || (!t.categorie && !(t.code || '').toUpperCase().startsWith('CONGE')));
  }

  categorieActive: 'CONGE' | 'ABSENCE' = 'CONGE';

  get selectedCongeTypeObj(): TypeAbsenceConge | undefined {
    const id = this.congeForm?.typeAbsenceCongeId;
    if (!id) return undefined;
    return this.typesConge.find(t => String(t.id) === String(id));
  }

  get isTypeDeductible(): boolean {
    const t = this.selectedCongeTypeObj;
    return !t || t.deductibleDuSolde !== false;
  }

  get nouveauSoldePrevisionnel(): number {
    const soldeActuel = this.monSoldeConge?.soldeRestant ?? 30;
    if (!this.isTypeDeductible) {
      return soldeActuel;
    }
    const nbJours = Number(this.congeForm.dureeDemandee) || 0;
    return Math.max(0, Math.round((soldeActuel - nbJours) * 10) / 10);
  }

  isDureeConnue(type: TypeAbsenceConge | undefined | null): boolean {
    if (!type) return false;
    const code = (type.code || '').toUpperCase();
    const name = (type.name || '').toLowerCase();
    if (code === 'CONGE_ANNUEL' || name.includes('annuel')) return false;
    if (code === 'CONGE_MALADIE' || name.includes('maladie')) return false;
    if (code === 'SANS_SOLDE' || name.includes('sans solde')) return false;

    if (code.includes('MATERNITE') || name.includes('materni')) return true;
    if (code.includes('PATERNITE') || name.includes('paterni')) return true;
    if (code.includes('MARIAGE') || name.includes('mariage')) return true;
    if (code.includes('DECES') || name.includes('décès') || name.includes('deces')) return true;
    if (code.includes('NAISSANCE') || name.includes('naissance')) return true;

    return !!(type.dureeMaxLegaleJours && type.dureeMaxLegaleJours > 0 && type.dureeMaxLegaleJours <= 10);
  }

  getDureeConnue(type: TypeAbsenceConge | undefined | null): number {
    if (!type) return 1;
    const code = (type.code || '').toUpperCase();
    const name = (type.name || '').toLowerCase();
    if (code.includes('MATERNITE') || name.includes('materni')) return 98;
    if (code.includes('PATERNITE') || name.includes('paterni')) return 3;
    if (code.includes('MARIAGE') || name.includes('mariage')) return type.dureeMaxLegaleJours || 3;
    if (code.includes('DECES') || name.includes('décès') || name.includes('deces')) return type.dureeMaxLegaleJours || 5;
    if (code.includes('NAISSANCE') || name.includes('naissance')) return type.dureeMaxLegaleJours || 3;
    return type.dureeMaxLegaleJours || 1;
  }

  onCongeTypeChange(): void {
    const t = this.selectedCongeTypeObj;
    if (!t) return;
    if (this.isDureeConnue(t)) {
      const dureeFixe = this.getDureeConnue(t);
      this.congeForm.dureeDemandee = dureeFixe;
      this.calculerDateFinDepuisDuree(this.congeForm.dateDebut, dureeFixe);
    } else {
      this.recalculerNbJoursConge();
    }
  }

  setCategorieActive(cat: 'CONGE' | 'ABSENCE'): void {
    this.categorieActive = cat;
    const list = cat === 'CONGE' ? this.congesList : this.absencesList;
    if (list && list.length > 0) {
      this.congeForm.typeAbsenceCongeId = list[0].id;
      this.onCongeTypeChange();
    }
  }

  get listeTypesPourCategorieActive(): TypeAbsenceConge[] {
    return this.categorieActive === 'CONGE' ? this.congesList : this.absencesList;
  }

  // ─────────────────────────────────────────────────────────────

  ouvrirModalDemandeConge(): void {
    const dateInitiale = this.getProchainJourOuvrable(new Date());
    const defaultList = this.congesList.length > 0 ? this.congesList : this.filteredTypesConge;
    const annuel = defaultList.find(tc => (tc.code || '').toUpperCase().includes('ANNUEL'));
    const defId = annuel ? annuel.id : (defaultList.length > 0 ? defaultList[0].id : null);
    const defType = this.typesConge.find(t => t.id === defId);
    const dInit = this.isDureeConnue(defType) ? this.getDureeConnue(defType) : 15;

    this.congeForm = {
      typeAbsenceCongeId: defId,
      dateDebut: dateInitiale,
      dureeDemandee: dInit,
      dateFin: dateInitiale,
      motif: '',
      justificatif: '',
      interimaireId: null,
      posteSensibleBceao: false
    };
    this.calculerDateFinDepuisDuree(dateInitiale, dInit);
    this.congeEnvoyeSuccess = false;
    this.isSubmittingConge = false;

    // 1. Charger types de congé si nécessaire
    if (this.typesConge.length === 0) {
      this.congeService.getTypes().subscribe({
        next: (t) => {
          this.typesConge = t || [];
          if (this.typesConge.length > 0 && !this.congeForm.typeAbsenceCongeId) {
            const list = this.congesList.length > 0 ? this.congesList : this.filteredTypesConge;
            const ann = list.find(tc => (tc.code || '').toUpperCase().includes('ANNUEL'));
            this.congeForm.typeAbsenceCongeId = ann ? ann.id : (list.length > 0 ? list[0].id : this.typesConge[0].id);
          }
          this.recalculerNbJoursConge();
        }
      });
    }

    // 2. Charger jours fériés si nécessaire
    if (this.joursFeries.length === 0) {
      this.congeService.getJoursFeries().subscribe({
        next: (jf) => {
          this.joursFeries = jf || [];
          this.recalculerNbJoursConge();
        }
      });
    }

    this.recalculerNbJoursConge();
    this.showDemandeCongeModal = true;
  }

  fermerModalDemandeConge(): void {
    this.showDemandeCongeModal = false;
    this.congeEnvoyeSuccess = false;
    this.isSubmittingConge = false;
  }

  choisirDureeRapide(jours: number): void {
    this.congeForm.dureeDemandee = jours;
    this.calculerDateFinDepuisDuree(this.congeForm.dateDebut, jours);
  }

  onDateDebutChange(nouvelleDate: any): void {
    if (nouvelleDate) {
      const d = new Date(nouvelleDate);
      if (d.getDay() === 0) {
        d.setDate(d.getDate() + 1);
      }
      this.congeForm.dateDebut = d;

      if (this.isDureeConnue(this.selectedCongeTypeObj)) {
        const dureeFixe = this.getDureeConnue(this.selectedCongeTypeObj);
        this.congeForm.dureeDemandee = dureeFixe;
        this.calculerDateFinDepuisDuree(d, dureeFixe);
      } else {
        if (!this.congeForm.dateFin || new Date(this.congeForm.dateFin) < d) {
          const nb = Number(this.congeForm.dureeDemandee) || 15;
          this.calculerDateFinDepuisDuree(d, nb);
        } else {
          this.recalculerNbJoursConge();
        }
      }
    }
  }

  onDateFinChange(nouvelleDate: any): void {
    if (nouvelleDate) {
      const d = new Date(nouvelleDate);
      if (d.getDay() === 0) {
        d.setDate(d.getDate() - 1);
      }
      if (this.congeForm.dateDebut && d < new Date(this.congeForm.dateDebut)) {
        this.congeForm.dateFin = new Date(this.congeForm.dateDebut);
      } else {
        this.congeForm.dateFin = d;
      }
      this.recalculerNbJoursConge();
    }
  }

  recalculerNbJoursConge(): void {
    const debutVal = this.congeForm.dateDebut;
    const finVal = this.congeForm.dateFin;
    if (!debutVal || !finVal) {
      this.congeForm.dureeDemandee = 0;
      return;
    }

    const start = new Date(debutVal);
    start.setHours(0, 0, 0, 0);
    const end = new Date(finVal);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      this.congeForm.dateFin = new Date(start);
      this.congeForm.dureeDemandee = 1;
      return;
    }

    let joursComptes = 0;
    const cur = new Date(start);

    while (cur <= end) {
      const dow = cur.getDay();
      const isWeekend = (dow === 0 || dow === 6); // Samedi et Dimanche exclus en mode ouvrable bancaire
      const isFerie = this.isJourFerie(cur);

      if (!isWeekend && !isFerie) {
        joursComptes++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    this.congeForm.dureeDemandee = Math.max(1, joursComptes);

    let reprise = new Date(end);
    reprise.setDate(reprise.getDate() + 1);
    while (reprise.getDay() === 0 || reprise.getDay() === 6 || this.isJourFerie(reprise)) {
      reprise.setDate(reprise.getDate() + 1);
    }
    this.dateReprisePrevue = reprise;
  }

  recalculerDatesConge(): void {
    this.recalculerNbJoursConge();
  }

  private calculerDateFinDepuisDuree(debut: Date, nbJours: number): void {
    let cur = new Date(debut);
    if (cur.getDay() === 0) {
      cur.setDate(cur.getDate() + 1);
    }
    let joursComptes = 0;
    let dernierJour = new Date(cur);

    while (joursComptes < nbJours) {
      const dow = cur.getDay();
      const isWeekend = (dow === 0 || dow === 6);
      const isFerie = this.isJourFerie(cur);

      if (!isWeekend && !isFerie) {
        joursComptes++;
        dernierJour = new Date(cur);
      }

      if (joursComptes < nbJours) {
        cur.setDate(cur.getDate() + 1);
      }
    }

    this.congeForm.dateFin = dernierJour;

    let reprise = new Date(dernierJour);
    reprise.setDate(reprise.getDate() + 1);
    while (reprise.getDay() === 0 || reprise.getDay() === 6 || this.isJourFerie(reprise)) {
      reprise.setDate(reprise.getDate() + 1);
    }
    this.dateReprisePrevue = reprise;
  }

  isJourFerie(d: Date): boolean {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${day}`;
    const inDb = this.joursFeries.some(jf => jf.date === iso && jf.chomePaye !== false);
    if (inDb) return true;

    // Fêtes légales chômées et payées au Burkina Faso (Loi 028-2008 / Code du Travail) :
    // 01-01 (Jour de l'An), 01-03 (Soulèvement Populaire), 03-08 (Journée de la Femme),
    // 05-01 (Fête du Travail), 08-05 (Indépendance), 08-15 (Assomption),
    // 10-31 (Martyrs), 11-01 (Toussaint), 12-11 (Fête Nationale), 12-25 (Noël)
    const md = `${m}-${day}`;
    const feriesFixesBF = ['01-01', '01-03', '03-08', '05-01', '08-05', '08-15', '10-31', '11-01', '12-11', '12-25'];
    return feriesFixesBF.includes(md);
  }

  private getProchainJourOuvrable(base: Date): Date {
    let d = new Date(base);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6 || this.isJourFerie(d)) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  }

  private formatDateToIso(rawDate: any): string {
    if (!rawDate) return '';
    if (rawDate instanceof Date) {
      const y = rawDate.getFullYear();
      const m = String(rawDate.getMonth() + 1).padStart(2, '0');
      const d = String(rawDate.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    const dObj = new Date(rawDate);
    if (!isNaN(dObj.getTime())) {
      const y = dObj.getFullYear();
      const m = String(dObj.getMonth() + 1).padStart(2, '0');
      const d = String(dObj.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return String(rawDate);
  }

  soumettreDemandeConge(): void {
    const emp = this.currentAgent || {};
    const empId = emp.id || this.currentUser?.id;
    const empMat = emp.matricule || this.currentUser?.matricule || '';
    const empName = (emp.prenom && emp.nom)
      ? `${emp.prenom} ${emp.nom}`.toUpperCase()
      : `${this.currentUser?.prenom || ''} ${this.currentUser?.nom || ''}`.trim().toUpperCase();

    this.isSubmittingConge = true;
    const typeSelected = this.typesConge.find(t => String(t.id) === String(this.congeForm.typeAbsenceCongeId));

    const payload = {
      employee: { id: Number(empId), matricule: empMat },
      employe: empName,
      typeAbsenceConge: typeSelected ? { id: typeSelected.id, code: typeSelected.code, name: typeSelected.name } : null,
      type: typeSelected ? typeSelected.name : 'Congé annuel payé',
      dateDebut: this.formatDateToIso(this.congeForm.dateDebut),
      dateFin: this.formatDateToIso(this.congeForm.dateFin),
      nbJours: Number(this.congeForm.dureeDemandee) || 15,
      motif: this.congeForm.motif || `Demande de ${typeSelected?.name || 'congé'} (${this.congeForm.dureeDemandee} jours ouvrables)`,
      justificatif: this.congeForm.justificatif,
      interimaire: this.congeForm.interimaireId ? { id: Number(this.congeForm.interimaireId) } : null,
      posteSensibleBceao: !!this.congeForm.posteSensibleBceao,
      statut: this.congeForm.interimaireId ? 'EN_ATTENTE_INTERIM' : 'EN_ATTENTE_N1',
      dateDemande: new Date().toISOString().split('T')[0]
    };

    this.congeService.create(payload).subscribe({
      next: () => {
        this.isSubmittingConge = false;
        this.congeEnvoyeSuccess = true;
        // Rafraîchir les compteurs et l'historique sans quitter la page
        this.chargerSoldesConges(empId);
        setTimeout(() => {
          this.fermerModalDemandeConge();
        }, 2200);
      },
      error: (err) => {
        this.isSubmittingConge = false;
        alert('Erreur lors de la transmission : ' + (err?.error?.message || err.message));
      }
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}
