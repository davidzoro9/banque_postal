import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { EmployeeService } from '../../../grh/employes/services/employee.service';
import { Employee } from '../../../grh/employes/models/employee.model';
import { DbRefService } from '../../../donnees-base/services/db-ref.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { numberToFrenchWords } from '../../../../core/utils/french-number.util';
import { BulletinPdfService } from '../../services/bulletin-pdf.service';
import { BulletinService, BulletinDto } from '../../services/bulletin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-generer-bulletins',
  templateUrl: './generer-bulletins.component.html',
  styleUrls: ['./generer-bulletins.component.scss'],
  standalone: false
})
export class GenererBulletinsComponent implements OnInit {
  moisNoms = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  currentYear = new Date().getFullYear();
  selectedYear = new Date().getFullYear();
  anneesDisponibles: number[] = [
    this.currentYear - 3, this.currentYear - 2, this.currentYear - 1,
    this.currentYear, this.currentYear + 1, this.currentYear + 2, this.currentYear + 3
  ];
  moisIndex = new Date().getMonth();
  periode = `${this.moisNoms[new Date().getMonth()]} ${new Date().getFullYear()}`;

  get moisListe(): string[] {
    return this.moisNoms.map(m => `${m} ${this.selectedYear}`);
  }
  
  sessionType: 'ORDINAIRE' | 'EXTRAORDINAIRE' = 'ORDINAIRE';
  modeComparatifMminus1 = false;

  // === GESTION DES SESSIONS & NAVIGATION ===
  vueActive: 'LISTE_SESSIONS' | 'DETAIL_SESSION' | 'SIMULATION' | 'DEMANDES_BULLETINS' = 'LISTE_SESSIONS';
  vuePrecedente: 'LISTE_SESSIONS' | 'DETAIL_SESSION' = 'LISTE_SESSIONS';

  // Demandes de Bulletins reçues depuis Mon Espace
  demandesBulletins: any[] = [];
  isLoadingDemandes = false;
  nbDemandesEnAttente = 0;
  searchDemandeTexte = '';

  basculerVersSimulation(): void {
    if (this.vueActive !== 'SIMULATION') {
      this.vuePrecedente = this.vueActive === 'DEMANDES_BULLETINS' ? 'LISTE_SESSIONS' : this.vueActive;
    }
    this.vueActive = 'SIMULATION';
  }

  basculerVersDemandesBulletins(): void {
    if (this.vueActive !== 'DEMANDES_BULLETINS') {
      this.vuePrecedente = this.vueActive === 'SIMULATION' ? 'LISTE_SESSIONS' : this.vueActive;
    }
    this.vueActive = 'DEMANDES_BULLETINS';
    this.chargerDemandesBulletins();
  }

  chargerDemandesBulletins(): void {
    this.isLoadingDemandes = true;
    this.http.get<any[]>(`${environment.apiUrl}/demandes-bulletin`).pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      this.demandesBulletins = data || [];
      this.nbDemandesEnAttente = this.demandesBulletins.filter(d => (d.statut || '').toUpperCase().includes('EN_ATTENTE')).length;
      this.isLoadingDemandes = false;
    });
  }

  traiterDemande(demande: any, nouveauStatut: 'TRAITEE' | 'REJETEE'): void {
    if (!demande || !demande.id) return;
    this.http.put(`${environment.apiUrl}/demandes-bulletin/${demande.id}/traiter`, {
      statut: nouveauStatut,
      traitePar: 'GESTIONNAIRE_PAIE'
    }).subscribe({
      next: () => {
        demande.statut = nouveauStatut;
        demande.dateTraitement = new Date().toISOString();
        this.nbDemandesEnAttente = this.demandesBulletins.filter(d => (d.statut || '').toUpperCase().includes('EN_ATTENTE')).length;
      },
      error: () => {
        demande.statut = nouveauStatut;
        this.nbDemandesEnAttente = this.demandesBulletins.filter(d => (d.statut || '').toUpperCase().includes('EN_ATTENTE')).length;
      }
    });
  }

  get demandesFiltrees(): any[] {
    if (!this.searchDemandeTexte) return this.demandesBulletins;
    const q = this.searchDemandeTexte.toUpperCase().trim();
    return this.demandesBulletins.filter(d =>
      (d.employeeName || '').toUpperCase().includes(q) ||
      (d.matricule || '').toUpperCase().includes(q) ||
      (d.periode || '').toUpperCase().includes(q) ||
      (d.motif || '').toUpperCase().includes(q)
    );
  }

  retourAuxSessions(): void {
    this.vueActive = this.vuePrecedente || 'LISTE_SESSIONS';
  }

  listeSessions: any[] = [];
  currentSession: any = null;
  showCreateSessionModal: boolean = false;
  newSessionForm = {
    mois: String(new Date().getMonth() + 1).padStart(2, '0'),
    annee: new Date().getFullYear(),
    name: '',
    periode: `${['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][new Date().getMonth()]} ${new Date().getFullYear()}`,
    typeSession: 'ORDINAIRE',
    natureExtraordinaire: '13EME_MOIS' as '13EME_MOIS' | '14EME_MOIS' | 'CONGE_PAYE' | 'STC' | 'INDEMNITE_RETRAITE' | 'DIFFERENTIEL_MATERNITE',
    codeSession: `SESS-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    modeCible: 'TOUS' as 'TOUS' | 'SELECTION'
  };

  // Recherche et sélection dans le modal de création
  searchNewSessionEmployee: string = '';
  employesSelectionnesIdsForNewSession: { [id: string]: boolean } = {};

  // Sélection des agents pour la session (Création / Recalcul)
  showSelectionEmployesModal = false;
  modeGenerationSession: 'TOUS' | 'SELECTION' = 'TOUS';
  get modeGenerationExtraordinaire(): 'TOUS' | 'SELECTION' { return this.modeGenerationSession; }
  set modeGenerationExtraordinaire(val: 'TOUS' | 'SELECTION') { this.modeGenerationSession = val; }
  searchSelectionEmployee: string = '';
  filtreStatutModal: 'TOUS' | 'NON_CALCULE' | 'DEJA_CALCULE' = 'TOUS';
  tousLesEmployes: Employee[] = [];
  employesMaterniteEligibles: Employee[] = [];
  isLoadingMaterniteEligibles = false;
  employesSelectionnesIds: { [id: string]: boolean } = {};

  // Justification de l'écart comparatif
  showJustificationModal = false;
  selectedBulletinForJustification: any = null;
  justificationTexte: string = '';

  isCalculating = false;
  bulletins: any[] = [];
  selectedBulletin: any = null;

  // Modification des variables du bulletin par lot
  showEditVariablesModal = false;
  selectedBulletinForEdit: any = null;
  editableLines: any[] = [];
  modalSalaireBrut = 0;
  modalTotalRetenues = 0;
  modalSalaireNet = 0;
  modalBaseImposable = 0;
  modalCotisationCnss = 0;
  modalImpotIuts = 0;
  modalCotisationCrrae = 0;
  modalCotisationSolidarite = 0;
  editVariablesForm: {
    workedDays: number;
    scheduledWorkingDays: number;
    primeExceptionnelle: number;
    precompteAvance: number;
    nombreHeuresSup: number;
    heuresSup: number;
    motifAjustement: string;
  } = {
    workedDays: 30,
    scheduledWorkingDays: 30,
    primeExceptionnelle: 0,
    precompteAvance: 0,
    nombreHeuresSup: 0,
    heuresSup: 0,
    motifAjustement: ''
  };

  get nbrGeneres(): number { return this.bulletins.filter(b => b.etat === 'GENERE').length; }
  get nbrValides(): number { return this.bulletins.filter(b => b.etat === 'VALIDE' || b.etat === 'CLOTURE').length; }
  get tousValides(): boolean { return this.sessionEstValidee || this.sessionCloturee || (this.bulletins.length > 0 && this.bulletins.every(b => b.etat === 'VALIDE' || b.etat === 'CLOTURE')); }
  get sessionStatut(): string { return this.currentSession ? (this.currentSession.statut || 'BROUILLON') : 'BROUILLON'; }
  get sessionEstBrouillon(): boolean { return this.sessionStatut === 'BROUILLON'; }
  get sessionEstGeneree(): boolean { return this.sessionStatut === 'GENERE'; }
  get sessionEstValidee(): boolean { return this.sessionStatut === 'VALIDE'; }
  get sessionCloturee(): boolean { return this.sessionStatut === 'CLOTURE'; }
  get isSessionMaternite(): boolean {
    const s = this.currentSession;
    if (!s) return false;
    const n = (s.natureSession || s.name || s.codeSession || '').toUpperCase();
    return n.includes('MATERNITE') || n.includes('MAT');
  }

  get totalMasseSalarialeBrute(): number {
    return this.bulletins.reduce((acc, b) => acc + (b.salaireBrut || 0), 0);
  }
  get totalMasseSalarialeNette(): number {
    return this.bulletins.reduce((acc, b) => acc + (b.salaireNet || 0), 0);
  }
  get totalSalaireBase(): number {
    return this.bulletins.reduce((acc, b) => acc + (b.salaireBase || 0), 0);
  }
  get totalIndemnitesGlobal(): number {
    return this.bulletins.reduce((acc, b) => acc + (b.totalIndemnites || 0), 0);
  }
  get totalCotisationsSociales(): number {
    return this.bulletins.reduce((acc, b) => acc + (b.cotisationCNSS || 0) + (b.cotisationCarfoAgent || 0) + (b.cotisationCrraeAgent || 0), 0);
  }
  get totalImpotsRetenus(): number {
    return this.bulletins.reduce((acc, b) => acc + (b.impotIUTS || 0) + (b.retenueFSP || 0), 0);
  }
  get totalRetenuesGlobal(): number {
    return this.bulletins.reduce((acc, b) => acc + (b.totalRetenues || 0), 0);
  }

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService,
    private bulletinPdfService: BulletinPdfService,
    private bulletinService: BulletinService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.chargerToutesLesSessions();
    this.chargerDemandesBulletins();
  }

  chargerToutesLesSessions(): void {
    this.http.get<any[]>(`${environment.apiUrl}/paie/sessions`).pipe(
      catchError(() => of([]))
    ).subscribe(sessions => {
      this.listeSessions = sessions || [];
    });
  }

  retourListeSessions(): void {
    this.vueActive = 'LISTE_SESSIONS';
    this.currentSession = null;
    this.chargerToutesLesSessions();
  }

  selectionnerSession(session: any): void {
    this.currentSession = session;
    this.vueActive = 'DETAIL_SESSION';
    this.periode = session.periode || `${session.mois}/${session.annee}`;
    this.sessionType = session.typeSession === 'EXTRAORDINAIRE' ? 'EXTRAORDINAIRE' : 'ORDINAIRE';
    
    // Déterminer l'index du mois
    const mNum = parseInt(session.mois, 10);
    if (!isNaN(mNum) && mNum >= 1 && mNum <= 12) {
      this.moisIndex = mNum - 1;
    }

    // Charger les bulletins enregistrés en base pour cette session
    if (session.id) {
      this.isCalculating = true;
      this.http.get<any[]>(`${environment.apiUrl}/paie/sessions/${session.id}/bulletins`).pipe(
        catchError(() => of([]))
      ).subscribe(savedBulletins => {
        this.bulletins = (savedBulletins || []).map(b => this.adapterBulletinFromBackend(b));
        this.isCalculating = false;
      });
    } else {
      this.bulletins = [];
      this.isCalculating = false;
    }
  }

  ouvrirModalCreerSession(): void {
    const defaultMois = String(this.moisIndex + 1).padStart(2, '0');
    this.newSessionForm = {
      mois: defaultMois,
      annee: this.selectedYear,
      name: '',
      typeSession: 'ORDINAIRE',
      natureExtraordinaire: '13EME_MOIS' as '13EME_MOIS' | '14EME_MOIS' | 'CONGE_PAYE' | 'STC' | 'INDEMNITE_RETRAITE',
      periode: '',
      codeSession: '',
      modeCible: 'TOUS'
    };
    this.searchNewSessionEmployee = '';
    this.chargerEmployesPourSelection();
    this.actualiserCodeSession();
    this.showCreateSessionModal = true;
  }

  fermerModalCreerSession(): void {
    this.showCreateSessionModal = false;
  }

  get isCreationSessionMaternite(): boolean {
    return this.newSessionForm.typeSession === 'EXTRAORDINAIRE' && this.newSessionForm.natureExtraordinaire === 'DIFFERENTIEL_MATERNITE';
  }

  get poolEmployesNouvelleSession(): Employee[] {
    return this.isCreationSessionMaternite ? this.employesMaterniteEligibles : this.tousLesEmployes;
  }

  get poolEmployesRecalculSession(): Employee[] {
    return this.isSessionMaternite ? this.employesMaterniteEligibles : this.tousLesEmployes;
  }

  chargerFemmesMaterniteEligibles(callback?: () => void): void {
    const mois = this.newSessionForm.mois || String(this.moisIndex + 1).padStart(2, '0');
    const annee = this.newSessionForm.annee || this.selectedYear;
    this.isLoadingMaterniteEligibles = true;
    this.http.get<Employee[]>(`${environment.apiUrl}/paie/sessions/maternite-eligibles?mois=${mois}&annee=${annee}`).pipe(
      catchError(() => of([]))
    ).subscribe(femmes => {
      this.employesMaterniteEligibles = femmes || [];
      this.isLoadingMaterniteEligibles = false;
      this.employesSelectionnesIdsForNewSession = {};
      this.employesMaterniteEligibles.forEach(e => {
        if (e.id) this.employesSelectionnesIdsForNewSession[String(e.id)] = true;
      });
      if (callback) callback();
    });
  }

  chargerFemmesMaternitePourSessionCourante(callback?: () => void): void {
    if (!this.currentSession) return;
    const mois = this.currentSession.mois || String(this.moisIndex + 1).padStart(2, '0');
    const annee = this.currentSession.annee || this.selectedYear;
    this.isLoadingMaterniteEligibles = true;
    this.http.get<Employee[]>(`${environment.apiUrl}/paie/sessions/maternite-eligibles?mois=${mois}&annee=${annee}`).pipe(
      catchError(() => of([]))
    ).subscribe(femmes => {
      this.employesMaterniteEligibles = femmes || [];
      this.isLoadingMaterniteEligibles = false;
      this.employesSelectionnesIds = {};
      this.employesMaterniteEligibles.forEach(e => {
        if (e.id) this.employesSelectionnesIds[String(e.id)] = true;
      });
      if (callback) callback();
    });
  }

  get employesFiltresPourNouvelleSession(): Employee[] {
    const list = this.poolEmployesNouvelleSession;
    if (!this.searchNewSessionEmployee || !this.searchNewSessionEmployee.trim()) {
      return list;
    }
    const q = this.searchNewSessionEmployee.toLowerCase().trim();
    return list.filter(e =>
      (e.matricule && e.matricule.toLowerCase().includes(q)) ||
      (e.nom && e.nom.toLowerCase().includes(q)) ||
      (e.prenom && e.prenom.toLowerCase().includes(q)) ||
      ((e.nom || '') + ' ' + (e.prenom || '')).toLowerCase().includes(q)
    );
  }

  get nbEmployesSelectionnesNouvelleSession(): number {
    return Object.keys(this.employesSelectionnesIdsForNewSession)
      .filter(k => this.employesSelectionnesIdsForNewSession[k]).length;
  }

  toggleSelectAllNouvelleSession(checked: boolean): void {
    const cible = this.searchNewSessionEmployee ? this.employesFiltresPourNouvelleSession : this.poolEmployesNouvelleSession;
    cible.forEach(e => {
      if (e.id) this.employesSelectionnesIdsForNewSession[String(e.id)] = checked;
    });
  }

  cocherTranche50NouvelleSession(): void {
    this.poolEmployesNouvelleSession.forEach(e => {
      if (e.id) this.employesSelectionnesIdsForNewSession[String(e.id)] = false;
    });
    let count = 0;
    for (const emp of this.poolEmployesNouvelleSession) {
      if (emp.id && count < 50) {
        this.employesSelectionnesIdsForNewSession[String(emp.id)] = true;
        count++;
      }
    }
  }

  onNatureExtraordinaireChange(): void {
    const y = Number(this.newSessionForm.annee) || this.selectedYear;
    const m = String(this.newSessionForm.mois || '01').padStart(2, '0');
    const mIdx = Math.max(0, Math.min(11, parseInt(m, 10) - 1));
    const nomMois = this.moisNoms[mIdx] || `Mois ${m}`;

    if (this.newSessionForm.natureExtraordinaire === '13EME_MOIS') {
      this.newSessionForm.name = `13ème Mois ${y}`;
      this.newSessionForm.codeSession = `SESS-13EME-${y}-${m}`;
      this.newSessionForm.modeCible = 'TOUS';
      this.changerModeCibleNouvelleSession('TOUS');
    } else if (this.newSessionForm.natureExtraordinaire === '14EME_MOIS') {
      this.newSessionForm.name = `14ème Mois ${y}`;
      this.newSessionForm.codeSession = `SESS-14EME-${y}-${m}`;
      this.newSessionForm.modeCible = 'TOUS';
      this.changerModeCibleNouvelleSession('TOUS');
    } else if (this.newSessionForm.natureExtraordinaire === 'CONGE_PAYE') {
      this.newSessionForm.name = `Congés Payés — ${nomMois} ${y}`;
      this.newSessionForm.codeSession = `SESS-CP-${y}-${m}`;
      this.newSessionForm.modeCible = 'SELECTION';
      this.changerModeCibleNouvelleSession('SELECTION');
    } else if (this.newSessionForm.natureExtraordinaire === 'INDEMNITE_RETRAITE') {
      this.newSessionForm.name = `Indemnités de Départ à la Retraite — ${y}`;
      this.newSessionForm.codeSession = `SESS-RETR-${y}-${m}`;
      this.newSessionForm.modeCible = 'SELECTION';
      this.changerModeCibleNouvelleSession('SELECTION');
    } else if (this.newSessionForm.natureExtraordinaire === 'DIFFERENTIEL_MATERNITE') {
      this.newSessionForm.name = `Session Congé Maternité — ${nomMois} ${y}`;
      this.newSessionForm.codeSession = `SESS-MAT-${y}-${m}`;
      this.newSessionForm.modeCible = 'TOUS';
      this.chargerFemmesMaterniteEligibles();
    } else {
      this.newSessionForm.name = `Solde de Tout Compte — ${nomMois} ${y}`;
      this.newSessionForm.codeSession = `SESS-STC-${y}-${m}`;
      this.newSessionForm.modeCible = 'SELECTION';
      this.changerModeCibleNouvelleSession('SELECTION');
    }
    this.actualiserCodeSession();
  }

  actualiserCodeSession(): void {
    const y = Number(this.newSessionForm.annee) || this.selectedYear;
    const m = String(this.newSessionForm.mois || '01').padStart(2, '0');
    this.newSessionForm.annee = y;
    this.newSessionForm.mois = m;
    const mIdx = Math.max(0, Math.min(11, parseInt(m, 10) - 1));
    const nomMois = this.moisNoms[mIdx] || `Mois ${m}`;
    const isExtra = this.newSessionForm.typeSession === 'EXTRAORDINAIRE';

    if (isExtra) {
      let prefix = 'STC';
      if (this.newSessionForm.natureExtraordinaire === '13EME_MOIS') {
        prefix = '13EME';
      } else if (this.newSessionForm.natureExtraordinaire === '14EME_MOIS') {
        prefix = '14EME';
      } else if (this.newSessionForm.natureExtraordinaire === 'CONGE_PAYE') {
        prefix = 'CP';
      } else if (this.newSessionForm.natureExtraordinaire === 'INDEMNITE_RETRAITE') {
        prefix = 'RETR';
      } else if (this.newSessionForm.natureExtraordinaire === 'DIFFERENTIEL_MATERNITE') {
        prefix = 'MAT';
      } else {
        prefix = 'STC';
      }
      this.newSessionForm.periode = `${nomMois} ${y}`;
      this.newSessionForm.codeSession = `SESS-${prefix}-${y}-${m}`;
    } else {
      this.newSessionForm.periode = `${nomMois} ${y}`;
      this.newSessionForm.codeSession = `SESS-${y}-${m}`;
    }
  }

  onAnneeSelectChange(event: any): void {
    const val = event?.target ? event.target.value : event;
    this.newSessionForm.annee = parseInt(val, 10);
    this.actualiserCodeSession();
    if (this.isCreationSessionMaternite) {
      this.chargerFemmesMaterniteEligibles();
    }
  }

  onMoisSelectChange(event: any): void {
    const val = event?.target ? event.target.value : event;
    this.newSessionForm.mois = val;
    this.actualiserCodeSession();
    if (this.isCreationSessionMaternite) {
      this.chargerFemmesMaterniteEligibles();
    }
  }

  changerModeCibleNouvelleSession(mode: 'TOUS' | 'SELECTION'): void {
    this.newSessionForm.modeCible = mode;
    if (mode === 'SELECTION') {
      this.employesSelectionnesIdsForNewSession = {};
    } else {
      this.poolEmployesNouvelleSession.forEach(e => {
        if (e.id) this.employesSelectionnesIdsForNewSession[String(e.id)] = true;
      });
    }
  }

  toggleSelectEmployeeForNewSession(empId: any): void {
    if (!empId) return;
    const key = String(empId);
    this.employesSelectionnesIdsForNewSession[key] = !this.employesSelectionnesIdsForNewSession[key];
  }

  isEmployeSelectedForNewSession(empId: any): boolean {
    return !!this.employesSelectionnesIdsForNewSession[String(empId)];
  }

  isEmployeSelectedForGeneration(empId: any): boolean {
    return !!this.employesSelectionnesIds[String(empId)];
  }

  getGradeConcat(emp: Employee): string {
    if (!emp) return '—';

    // 1. Si déjà au format standardisé arabe (ex: CL2E02, C1E01, HCEX)
    let directGrade = (emp.grade || '').trim().toUpperCase();
    if (/^(C|CL|HC)\d*(E\d+|EX)$/i.test(directGrade)) {
      return directGrade;
    }

    // 2. Si le grade direct contient des chiffres romains (ex: CLIIE02 -> CL2E02)
    const romanDirectMatch = directGrade.match(/^CL\s*(VIII|VII|VI|V|IV|III|II|I)\s*(E\d+|EX)?$/i);
    if (romanDirectMatch) {
      const romanMap: Record<string, string> = {
        'VIII': '8', 'VII': '7', 'VI': '6', 'V': '5', 'IV': '4', 'III': '3', 'II': '2', 'I': '1'
      };
      const rNum = romanMap[romanDirectMatch[1].toUpperCase()] || romanDirectMatch[1];
      const echPart = romanDirectMatch[2] ? romanDirectMatch[2].toUpperCase() : '';
      if (echPart) {
        return `CL${rNum}${echPart}`;
      }
      directGrade = `CL${rNum}`;
    }

    // 3. Déterminer le code de la catégorie (ex: 'CLASSE II' -> 'CL2', '1ère CATEGORIE' -> 'C1')
    const rawCat = (emp.categoriePro || (emp as any).categorie || '').trim().toUpperCase();
    const catCode = this.getCatCodeDisplay(rawCat);

    // 4. Déterminer le code de l'échelon (ex: 'Échelon 2' -> 'E02')
    const rawEch = (emp.echelon || '').trim().toUpperCase();
    const echCode = this.getEchelonCodeDisplay(rawEch);

    if (catCode && echCode) {
      return `${catCode}${echCode}`;
    }

    return directGrade || catCode || echCode || '—';
  }

  getCatCodeDisplay(str: string): string {
    if (!str) return '';
    const upper = str.toUpperCase().trim();

    // Classes bancaires (CL1 à CL8) - Tester impérativement de VIII à I pour éviter les faux positifs
    if (upper.includes('CLASSE VIII') || upper === 'VIII' || upper === 'CL8' || upper === 'CLASSE 8' || upper === 'CL VIII') return 'CL8';
    if (upper.includes('CLASSE VII') || upper === 'VII' || upper === 'CL7' || upper === 'CLASSE 7' || upper === 'CL VII') return 'CL7';
    if (upper.includes('CLASSE VI') || upper === 'VI' || upper === 'CL6' || upper === 'CLASSE 6' || upper === 'CL VI') return 'CL6';
    if (upper.includes('CLASSE V') || upper === 'V' || upper === 'CL5' || upper === 'CLASSE 5' || upper === 'CL V') return 'CL5';
    if (upper.includes('CLASSE IV') || upper === 'IV' || upper === 'CL4' || upper === 'CLASSE 4' || upper === 'CL IV') return 'CL4';
    if (upper.includes('CLASSE III') || upper === 'III' || upper === 'CL3' || upper === 'CLASSE 3' || upper === 'CL III') return 'CL3';
    if (upper.includes('CLASSE II') || upper === 'II' || upper === 'CL2' || upper === 'CLASSE 2' || upper === 'CL II') return 'CL2';
    if (upper.includes('CLASSE I') || upper === 'I' || upper === 'CL1' || upper === 'CLASSE 1' || upper === 'CL I') return 'CL1';

    // Catégories d'exécution et maîtrise (C1 à C7)
    if (upper.includes('1ERE') || upper.includes('1ÈRE') || upper.includes('1RE') || upper.includes('CATEGORIE 1') || upper.includes('CAT 1') || upper === '1' || upper === 'C1') return 'C1';
    if (upper.includes('2EME') || upper.includes('2ÈME') || upper.includes('2E') || upper.includes('CATEGORIE 2') || upper.includes('CAT 2') || upper === '2' || upper === 'C2') return 'C2';
    if (upper.includes('3EME') || upper.includes('3ÈME') || upper.includes('3E') || upper.includes('CATEGORIE 3') || upper.includes('CAT 3') || upper === '3' || upper === 'C3') return 'C3';
    if (upper.includes('4EME') || upper.includes('4ÈME') || upper.includes('4E') || upper.includes('CATEGORIE 4') || upper.includes('CAT 4') || upper === '4' || upper === 'C4') return 'C4';
    if (upper.includes('5EME') || upper.includes('5ÈME') || upper.includes('5E') || upper.includes('CATEGORIE 5') || upper.includes('CAT 5') || upper === '5' || upper === 'C5') return 'C5';
    if (upper.includes('6EME') || upper.includes('6ÈME') || upper.includes('6E') || upper.includes('CATEGORIE 6') || upper.includes('CAT 6') || upper === '6' || upper === 'C6') return 'C6';
    if (upper.includes('7EME') || upper.includes('7ÈME') || upper.includes('7E') || upper.includes('CATEGORIE 7') || upper.includes('CAT 7') || upper === '7' || upper === 'C7') return 'C7';

    // Hors Catégorie
    if (upper.includes('HORS') || upper.startsWith('HC')) return 'HC';

    // Regex générique pour attraper CL + chiffre ou chiffre romain
    if (upper.startsWith('CL') || upper.includes('CLASSE')) {
      const romanMap: Record<string, string> = {
        'VIII': '8', 'VII': '7', 'VI': '6', 'V': '5', 'IV': '4', 'III': '3', 'II': '2', 'I': '1'
      };
      const match = upper.match(/VIII|VII|VI|IV|V|III|II|I|\d+/);
      if (match) {
        const val = romanMap[match[0]] || match[0];
        return `CL${val}`;
      }
    }

    if (upper.startsWith('C') && /^C\d+/.test(upper)) {
      return upper.match(/^C\d+/)?.[0] || upper;
    }

    const num = upper.replace(/[^0-9]/g, '');
    if (num) return `C${num}`;

    return upper;
  }

  getEchelonCodeDisplay(str: string): string {
    if (!str) return '';
    const upper = str.toUpperCase().trim();
    if (upper.includes('EXCEPT') || upper.endsWith('EX')) return 'EX';
    if (upper.startsWith('E') && !upper.startsWith('ECH')) {
      const num = parseInt(upper.substring(1), 10);
      if (!isNaN(num)) return num < 10 ? `E0${num}` : `E${num}`;
    }
    const numStr = upper.replace(/[^0-9]/g, '');
    if (numStr) {
      const num = parseInt(numStr, 10);
      return num < 10 ? `E0${num}` : `E${num}`;
    }
    return upper;
  }

  soumettreCreerSession(): void {
    if (this.newSessionForm.typeSession === 'EXTRAORDINAIRE' && (!this.newSessionForm.name || !this.newSessionForm.name.trim())) {
      alert('Le libellé de la session extraordinaire est obligatoire.');
      return;
    }

    if (this.isCreationSessionMaternite && this.employesMaterniteEligibles.length === 0) {
      alert(`Impossible de créer la Session Congé Maternité : aucune collaboratrice n'a de congé de maternité approuvé en cours pour ${this.newSessionForm.periode}.`);
      return;
    }

    let idsPourGeneration: number[] | null = null;
    if (this.newSessionForm.modeCible === 'SELECTION') {
      idsPourGeneration = Object.keys(this.employesSelectionnesIdsForNewSession)
        .filter(k => !!this.employesSelectionnesIdsForNewSession[k])
        .map(k => Number(k))
        .filter(n => !isNaN(n) && n > 0);
      if (idsPourGeneration.length === 0) {
        alert('Veuillez sélectionner au moins un agent pour cette session.');
        return;
      }
    } else if (this.isCreationSessionMaternite) {
      idsPourGeneration = this.employesMaterniteEligibles.map(e => Number(e.id)).filter(n => !isNaN(n) && n > 0);
    }

    const rawName = (this.newSessionForm.name || '').trim();
    const rawCode = (this.newSessionForm.codeSession || '').trim();
    const rawPeriode = (this.newSessionForm.periode || `${this.newSessionForm.mois}/${this.newSessionForm.annee}`).trim();
    const rawType = (this.newSessionForm.typeSession || 'ORDINAIRE').trim();
    const rawNature = this.newSessionForm.typeSession === 'EXTRAORDINAIRE' ? (this.newSessionForm.natureExtraordinaire || '').trim() : null;

    const payload = {
      codeSession: rawCode.length > 50 ? rawCode.substring(0, 50) : rawCode,
      name: rawName.length > 50 ? rawName.substring(0, 50) : rawName,
      mois: this.newSessionForm.mois,
      annee: this.newSessionForm.annee,
      periode: rawPeriode.length > 50 ? rawPeriode.substring(0, 50) : rawPeriode,
      typeSession: rawType.length > 50 ? rawType.substring(0, 50) : rawType,
      natureSession: rawNature ? (rawNature.length > 50 ? rawNature.substring(0, 50) : rawNature) : null,
      statut: 'BROUILLON'
    };

    this.http.post<any>(`${environment.apiUrl}/paie/sessions`, payload).pipe(
      catchError(err => {
        alert('Erreur lors de la création de la session: ' + (err?.error?.message || err.message));
        return of(null);
      })
    ).subscribe(created => {
      if (created) {
        this.fermerModalCreerSession();
        this.currentSession = created;
        this.vueActive = 'DETAIL_SESSION';
        this.periode = created.periode || `${created.mois}/${created.annee}`;
        this.sessionType = created.typeSession === 'EXTRAORDINAIRE' ? 'EXTRAORDINAIRE' : 'ORDINAIRE';
        
        const mNum = parseInt(created.mois, 10);
        if (!isNaN(mNum) && mNum >= 1 && mNum <= 12) {
          this.moisIndex = mNum - 1;
        }

        // Lancement direct de la génération ciblée côté Spring Boot
        this.lancerGenerationSession(idsPourGeneration && idsPourGeneration.length > 0 ? idsPourGeneration : undefined);
      }
    });
  }

  clicBoutonGenerer(): void {
    if (!this.currentSession) return;
    if (this.isSessionMaternite) {
      this.chargerFemmesMaternitePourSessionCourante(() => {
        this.searchSelectionEmployee = '';
        this.modeGenerationSession = 'TOUS';
        this.showSelectionEmployesModal = true;
      });
      return;
    }
    this.chargerEmployesPourSelection();
    this.searchSelectionEmployee = '';
    this.modeGenerationSession = 'TOUS';
    this.showSelectionEmployesModal = true;
  }

  chargerEmployesPourSelection(): void {
    this.employeeService.getAll().subscribe(employees => {
      this.tousLesEmployes = (employees || []).filter(e => e.statut === 'Actif' || !e.statut || (e.statut as any) === 'ACTIF');
      this.employesSelectionnesIds = {};
      this.employesSelectionnesIdsForNewSession = {};
      this.tousLesEmployes.forEach(e => {
        if (e.id) {
          this.employesSelectionnesIds[String(e.id)] = true;
          this.employesSelectionnesIdsForNewSession[String(e.id)] = true;
        }
      });
    });
  }

  isAgentCalculeDansSession(empId: any): boolean {
    if (!empId || !this.bulletins || this.bulletins.length === 0) return false;
    const targetId = Number(empId);
    return this.bulletins.some(b => {
      const bEmpId = Number(b.employeeId || b.employee?.id);
      return bEmpId === targetId;
    });
  }

  get nbAgentsCalculesDansSession(): number {
    if (!this.bulletins) return 0;
    return this.bulletins.length;
  }

  get nbAgentsNonCalculesDansSession(): number {
    return Math.max(0, this.poolEmployesRecalculSession.length - this.nbAgentsCalculesDansSession);
  }

  cocherTranche50(onlyPending: boolean = true): void {
    // Décocher tout d'abord
    this.poolEmployesRecalculSession.forEach(e => {
      if (e.id) this.employesSelectionnesIds[String(e.id)] = false;
    });

    let count = 0;
    for (const emp of this.poolEmployesRecalculSession) {
      if (!emp.id) continue;
      const alreadyDone = this.isAgentCalculeDansSession(emp.id);
      if (!onlyPending || !alreadyDone) {
        this.employesSelectionnesIds[String(emp.id)] = true;
        count++;
        if (count >= 50) break;
      }
    }

    if (count === 0 && onlyPending) {
      this.cocherTranche50(false);
    }
  }

  get employesFiltresPourSelection(): Employee[] {
    let list = this.poolEmployesRecalculSession;
    if (this.filtreStatutModal === 'NON_CALCULE') {
      list = list.filter(e => !this.isAgentCalculeDansSession(e.id));
    } else if (this.filtreStatutModal === 'DEJA_CALCULE') {
      list = list.filter(e => this.isAgentCalculeDansSession(e.id));
    }

    if (!this.searchSelectionEmployee || !this.searchSelectionEmployee.trim()) {
      return list;
    }
    const q = this.searchSelectionEmployee.toLowerCase().trim();
    return list.filter(e =>
      (e.matricule && e.matricule.toLowerCase().includes(q)) ||
      (e.nom && e.nom.toLowerCase().includes(q)) ||
      (e.prenom && e.prenom.toLowerCase().includes(q)) ||
      ((e.nom || '') + ' ' + (e.prenom || '')).toLowerCase().includes(q)
    );
  }

  toggleSelectAllEmployes(checked: boolean): void {
    const cible = (this.searchSelectionEmployee || this.filtreStatutModal !== 'TOUS')
      ? this.employesFiltresPourSelection
      : this.poolEmployesRecalculSession;
    cible.forEach(e => {
      if (e.id) this.employesSelectionnesIds[String(e.id)] = checked;
    });
  }

  get nbEmployesSelectionnes(): number {
    return Object.values(this.employesSelectionnesIds).filter(Boolean).length;
  }

  fermerModalSelectionEmployes(): void {
    this.showSelectionEmployesModal = false;
  }

  changerModeGenerationSession(mode: 'TOUS' | 'SELECTION'): void {
    this.modeGenerationSession = mode;
    if (mode === 'SELECTION') {
      this.employesSelectionnesIds = {};
    } else {
      this.poolEmployesRecalculSession.forEach(e => {
        if (e.id) this.employesSelectionnesIds[String(e.id)] = true;
      });
    }
  }

  toggleSelectEmployeeGeneration(empId: any): void {
    if (!empId) return;
    const key = String(empId);
    this.employesSelectionnesIds[key] = !this.employesSelectionnesIds[key];
  }

  validerGenerationSession(): void {
    if (this.isSessionMaternite && this.employesMaterniteEligibles.length === 0) {
      alert(`Aucune collaboratrice n'a de congé de maternité approuvé en cours pour cette période (${this.periode}).`);
      return;
    }
    let ids: number[] = [];
    if (this.modeGenerationSession === 'SELECTION') {
      ids = Object.keys(this.employesSelectionnesIds)
        .filter(k => !!this.employesSelectionnesIds[k])
        .map(k => Number(k))
        .filter(n => !isNaN(n) && n > 0);
      if (ids.length === 0) {
        alert('Veuillez sélectionner au moins un agent pour cette session de paie.');
        return;
      }
    } else if (this.isSessionMaternite) {
      ids = this.employesMaterniteEligibles.map(e => Number(e.id)).filter(n => !isNaN(n) && n > 0);
    }
    this.showSelectionEmployesModal = false;
    this.lancerGenerationSession(ids.length > 0 ? ids : undefined);
  }

  validerGenerationExtraordinaire(): void {
    this.validerGenerationSession();
  }

  lancerGenerationSession(employeeIds?: number[]): void {
    if (!this.currentSession || !this.currentSession.id) {
      this.bulletins = [];
      this.isCalculating = false;
      return;
    }
    this.isCalculating = true;
    const body = (employeeIds && employeeIds.length > 0) ? employeeIds : null;
    this.http.post<any[]>(`${environment.apiUrl}/paie/sessions/${this.currentSession.id}/generer`, body).subscribe({
      next: (bulletins) => {
        this.bulletins = (bulletins || []).map(b => this.adapterBulletinFromBackend(b));
        if (this.bulletins.length > 0) {
          this.currentSession.statut = 'GENERE';
          this.snackBar.open(`${this.bulletins.length} bulletin(s) généré(s) avec succès pour cette session.`, 'OK', { duration: 4000 });
        } else {
          if (this.isSessionMaternite) {
            this.snackBar.open(`Calcul terminé : Aucune collaboratrice n'a de congé de maternité approuvé sur ${this.periode} (0 éligible).`, 'Compris', { duration: 6000 });
          } else {
            this.snackBar.open(`Calcul terminé : Aucun agent éligible trouvé pour cette session sur ${this.periode}.`, 'OK', { duration: 5000 });
          }
        }
        this.isCalculating = false;
      },
      error: (err) => {
        alert('Erreur lors de la génération: ' + (err?.error?.message || err.message));
        this.isCalculating = false;
      }
    });
  }

  // === GESTION DE LA JUSTIFICATION DES ÉCARTS ===
  ouvrirModalJustification(b: any): void {
    this.selectedBulletinForJustification = b;
    this.justificationTexte = b.justificationEcart || '';
    this.showJustificationModal = true;
  }

  fermerModalJustification(): void {
    this.showJustificationModal = false;
    this.selectedBulletinForJustification = null;
    this.justificationTexte = '';
  }

  sauvegarderJustification(): void {
    if (!this.selectedBulletinForJustification?.id) {
      alert('Impossible d\'enregistrer la justification : identifiant du bulletin manquant.');
      return;
    }
    const bId = this.selectedBulletinForJustification.id;
    const txt = this.justificationTexte;
    this.bulletinService.updateJustification(bId, txt).subscribe({
      next: (updated) => {
        this.selectedBulletinForJustification.justificationEcart = updated.justificationEcart !== undefined ? updated.justificationEcart : txt;
        const found = this.bulletins.find(b => b.id === bId);
        if (found) {
          found.justificationEcart = this.selectedBulletinForJustification.justificationEcart;
        }
        this.fermerModalJustification();
      },
      error: (err) => {
        alert('Erreur lors de la mise à jour de la justification : ' + (err?.error?.message || err.message));
      }
    });
  }

  validerSession(): void {
    if (!this.currentSession || !this.currentSession.id) return;
    if (confirm(`Confirmer la validation de la session de paie ${this.periode} ?\n\nCette action validera les bulletins et appliquera les décomptes d'échéances.`)) {
      this.http.put<any>(`${environment.apiUrl}/paie/sessions/${this.currentSession.id}/valider`, {}).pipe(
        catchError(err => {
          alert('Erreur lors de la validation: ' + (err?.error?.message || err.message));
          return of(null);
        })
      ).subscribe(res => {
        if (this.currentSession) {
          this.currentSession.statut = 'VALIDE';
        }
        this.bulletins.forEach(b => b.etat = 'VALIDE');
      });
    }
  }

  cloturerSession(): void {
    if (!this.currentSession || !this.currentSession.id) return;
    if (confirm(`Confirmer la fermeture / clôture définitive de la session ${this.periode} ?\n\nAttention : La session sera verrouillée en lecture seule.`)) {
      this.http.put<any>(`${environment.apiUrl}/paie/sessions/${this.currentSession.id}/cloturer`, {}).pipe(
        catchError(err => {
          alert('Erreur lors de la clôture: ' + (err?.error?.message || err.message));
          return of(null);
        })
      ).subscribe(res => {
        if (this.currentSession) {
          this.currentSession.statut = 'CLOTURE';
        }
        this.bulletins.forEach(b => b.etat = 'CLOTURE');
      });
    }
  }

  recalculerTousLesBulletins(): void {
    if (confirm("Voulez-vous recalculer TOUS les bulletins existants selon les règles officielles du CGI ?\nCette opération mettra à jour les exonérations d'indemnités, l'IUTS et le net à payer pour toutes les sessions.")) {
      this.isCalculating = true;
      this.bulletinService.recalculerTous().subscribe({
        next: (res) => {
          this.isCalculating = false;
          alert(`${res.length} bulletin(s) recalculé(s) avec succès selon les règles du CGI !`);
          if (this.currentSession && this.currentSession.id) {
            this.selectionnerSession(this.currentSession);
          } else {
            this.chargerToutesLesSessions();
          }
        },
        error: (err) => {
          this.isCalculating = false;
          alert('Erreur lors du recalcul : ' + (err?.error?.message || err.message));
        }
      });
    }
  }

  recalculerBulletinsSession(): void {
    if (!this.currentSession || !this.currentSession.id) return;
    if (confirm(`Voulez-vous recalculer tous les bulletins de la session "${this.periode}" ?\nCette opération mettra à jour chaque bulletin selon les formules officielles du CGI.`)) {
      this.isCalculating = true;
      this.bulletinService.recalculerSession(this.currentSession.id).subscribe({
        next: (res) => {
          this.isCalculating = false;
          this.bulletins = (res || []).map(b => this.adapterBulletinFromBackend(b));
          alert(`${res.length} bulletin(s) de la session recalculé(s) avec succès !`);
        },
        error: (err) => {
          this.isCalculating = false;
          alert('Erreur lors du recalcul de la session : ' + (err?.error?.message || err.message));
        }
      });
    }
  }

  recalculerBulletin(bulletinId: number): void {
    if (!bulletinId) return;
    this.isCalculating = true;
    this.bulletinService.recalculerBulletin(bulletinId).subscribe({
      next: (updated) => {
        this.isCalculating = false;
        const adapted = this.adapterBulletinFromBackend(updated);
        const idx = this.bulletins.findIndex(b => b.id === bulletinId);
        if (idx !== -1) {
          this.bulletins[idx] = adapted;
        }
        alert('Bulletin recalculé avec succès selon les règles du CGI !');
      },
      error: (err) => {
        this.isCalculating = false;
        alert('Erreur lors du recalcul du bulletin : ' + (err?.error?.message || err.message));
      }
    });
  }

  private adapterBulletinFromBackend(b: any): any {
    let copy = JSON.parse(JSON.stringify(b));
    copy.mois = this.periode;
    copy.etat = b.statut || (this.currentSession ? this.currentSession.statut : 'GENERE');

    // Récupération stricte des montants réels calculés et persistés en base par Spring Boot
    copy.salaireBase = b.salaireBase ?? 0;
    copy.surSalaire = b.surSalaire ?? 0;
    copy.totalIndemnites = b.totalIndemnites ?? 0;
    copy.totalAvoirs = b.totalAvoirs ?? 0;
    copy.salaireBrut = b.salaireBrut ?? (copy.salaireBase + copy.surSalaire + copy.totalIndemnites + copy.totalAvoirs);
    copy.totalExonerations = b.totalExonerations ?? 0;
    copy.abattementForfaitaire = b.abattementForfaitaire ?? 0;
    copy.baseImposable = b.baseImposable ?? 0;

    // Cotisations salariales réelles issues de PostgreSQL
    const cotisCnss = b.cotisationCnss != null ? b.cotisationCnss : (b.cotisationCNSS != null ? b.cotisationCNSS : (b.cotisationCnssAgent != null ? b.cotisationCnssAgent : 0));
    copy.cotisationCnss = cotisCnss;
    copy.cotisationCNSS = cotisCnss;
    copy.cotisationCnssAgent = cotisCnss;

    const cotisCarfo = b.cotisationCarfo != null ? b.cotisationCarfo : (b.cotisationCarfoAgent != null ? b.cotisationCarfoAgent : 0);
    copy.cotisationCarfo = cotisCarfo;
    copy.cotisationCarfoAgent = cotisCarfo;

    const cotisCrrae = b.cotisationCrrae != null ? b.cotisationCrrae : (b.cotisationCrraeAgent != null ? b.cotisationCrraeAgent : 0);
    copy.cotisationCrrae = cotisCrrae;
    copy.cotisationCrraeAgent = cotisCrrae;

    const iuts = b.impotIuts != null ? b.impotIuts : (b.impotIUTS != null ? b.impotIUTS : 0);
    copy.impotIuts = iuts;
    copy.impotIUTS = iuts;

    const fsp = b.cotisationSolidarite != null ? b.cotisationSolidarite : (b.retenueFSP != null ? b.retenueFSP : 0);
    copy.cotisationSolidarite = fsp;
    copy.retenueFSP = fsp;

    const precompte = b.totalPrecomptes != null ? b.totalPrecomptes : (b.precompteAvance != null ? b.precompteAvance : (b.avanceSurSolde != null ? b.avanceSurSolde : 0));
    copy.totalPrecomptes = precompte;
    copy.precompteAvance = precompte;
    copy.avanceSurSolde = precompte;

    copy.totalRetenues = b.totalRetenues != null ? b.totalRetenues : (cotisCnss + cotisCarfo + cotisCrrae + iuts + fsp + precompte);
    copy.totalRetenuesPatronales = b.totalCotisationsPatronales != null ? b.totalCotisationsPatronales : (b.totalRetenuesPatronales != null ? b.totalRetenuesPatronales : (b.totalChargesPatronales != null ? b.totalChargesPatronales : 0));
    copy.salaireNet = b.salaireNet != null ? b.salaireNet : (copy.salaireBrut - copy.totalRetenues);

    copy.partsFiscales = b.partsFiscales != null ? b.partsFiscales : (b.nombreCharges != null ? b.nombreCharges : 0);

    let indList = b.lines ? b.lines.filter((l: any) => {
      const cd = (l.code || '').toUpperCase();
      const nm = (l.name || l.libelle || '').toUpperCase();
      return (l.typeLigne === 'GAIN' || l.category === 'GAIN' || l.category === 'INDEMNITES')
        && cd !== 'SAL_BASE' && !nm.includes('SALAIRE DE BASE')
        && cd !== 'SUR_SALAIRE' && !nm.includes('SURSALAIRE');
    }) : [];
    if (indList.length > 0) {
      indList = indList.map((i: any) => ({
        typeIndemnite: i.name || i.libelle || i.typeIndemnite || 'INDEMNITE',
        code: i.code || '200',
        montant: i.amount !== undefined ? i.amount : (i.montant !== undefined ? i.montant : (i.gain || 0)),
        taux: i.taux || i.rate || ''
      }));
    } else if (b.indemnitesDetails && b.indemnitesDetails.length > 0) {
      indList = b.indemnitesDetails;
    } else {
      indList = [];
    }

    copy.indemnitesDetails = indList;

    // Comparatif N vs N-1 réel issu du backend
    if (b.salaireNetPrecedent !== undefined && b.salaireNetPrecedent !== null) {
      copy.salaireNetM1 = b.salaireNetPrecedent;
      copy.ecartNet = b.ecartNet !== undefined ? b.ecartNet : (copy.salaireNet - b.salaireNetPrecedent);
    } else if (b.salaireNetM1 !== undefined && b.salaireNetM1 !== null) {
      copy.salaireNetM1 = b.salaireNetM1;
      copy.ecartNet = b.ecartNet !== undefined ? b.ecartNet : (copy.salaireNet - b.salaireNetM1);
    } else {
      copy.salaireNetM1 = copy.salaireNet;
      copy.ecartNet = 0;
    }

    copy.justificationEcart = b.justificationEcart || '';
    return copy;
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
    this.periode = `${this.moisNoms[this.moisIndex]} ${this.selectedYear}`;
  }

  changerSession(type: 'ORDINAIRE' | 'EXTRAORDINAIRE'): void {
    this.sessionType = type;
  }

  ouvrirModalModifierVariables(b: any): void {
    this.selectedBulletinForEdit = b;
    if (b.lines && b.lines.length > 0) {
      this.initEditableLines(b);
      this.showEditVariablesModal = true;
    } else if (b.id) {
      this.isCalculating = true;
      this.http.get<any>(`${environment.apiUrl}/bulletins/${b.id}`).pipe(
        catchError(err => {
          console.warn('Erreur chargement détails bulletin pour variables:', err);
          return of(b);
        })
      ).subscribe(fullB => {
        this.isCalculating = false;
        this.selectedBulletinForEdit = fullB || b;
        this.initEditableLines(this.selectedBulletinForEdit);
        this.showEditVariablesModal = true;
      });
    } else {
      this.initEditableLines(b);
      this.showEditVariablesModal = true;
    }
  }

  isDayLine(line: any): boolean {
    if (!line) return false;
    const cd = (line.code || '').toUpperCase();
    const nm = (line.name || line.libelle || '').toUpperCase();
    return cd.includes('SAL_BASE') || nm.includes('SALAIRE DE BASE');
  }

  getLineDisplayTaux(line: any): string {
    if (!line) return '—';
    if (this.isDayLine(line)) {
      return (line.tauxOrNb ?? 30) + ' j';
    }
    const cd = (line.code || '').toUpperCase();
    const nm = (line.name || line.libelle || '').toUpperCase();
    if (cd.includes('SUR_SALAIRE') || nm.includes('SUR-SALAIRE') || nm.includes('SURSALAIRE')) {
      return (line.tauxOrNb ?? 30) + ' j';
    }
    if (cd.includes('IUTS') || nm.includes('IUTS')) {
      const parts = this.selectedBulletinForEdit?.partsFiscales || this.selectedBulletinForEdit?.nombreCharges || line.tauxOrNb;
      return parts ? `${parts} part${Number(parts) > 1 ? 's' : ''}` : 'Barème';
    }
    if (cd.includes('CNSS') || nm.includes('CNSS')) {
      return '5.5 %';
    }
    if (cd.includes('CRRAE') || nm.includes('CRRAE')) {
      return '6 %';
    }
    if (cd.includes('SOLIDAR') || nm.includes('SOLIDAR') || cd.includes('FSP')) {
      return '1 %';
    }
    if (cd.includes('CP') || nm.includes('CASH')) {
      return (line.tauxOrNb ?? 30) + ' j';
    }
    if (line.tauxFormatted) {
      return line.tauxFormatted;
    }
    if (line.taux !== undefined && line.taux !== null && Number(line.taux) > 0) {
      return `${line.taux} %`;
    }
    if (line.tauxOrNb !== undefined && line.tauxOrNb !== null && Number(line.tauxOrNb) > 0) {
      const u = line.unit || '%';
      return `${line.tauxOrNb} ${u}`.trim();
    }
    return '—';
  }

  initEditableLines(b: any): void {
    // Sauvegarder les montants originaux certifiés du bulletin pour éviter toute dérive d'arrondi
    b.salaireBaseOriginal = b.salaireBaseOriginal || b.salaireBase;
    b.surSalaireOriginal = b.surSalaireOriginal || b.surSalaire;
    b.salaireBrutOriginal = b.salaireBrutOriginal || b.salaireBrut;
    b.baseImposableOriginal = b.baseImposableOriginal || b.baseImposable;
    b.cotisationCnssOriginal = b.cotisationCnssOriginal || b.cotisationCnss;
    b.cotisationCrraeOriginal = b.cotisationCrraeOriginal || b.cotisationCrrae;
    b.impotIutsOriginal = b.impotIutsOriginal || b.impotIuts;
    b.cotisationSolidariteOriginal = b.cotisationSolidariteOriginal || b.cotisationSolidarite;
    b.totalRetenuesOriginal = b.totalRetenuesOriginal || b.totalRetenues;
    b.salaireNetOriginal = b.salaireNetOriginal || b.salaireNet;

    const enriched = this.enrichSelectedBulletinLines(b);
    const rawLines = enriched?.lines || [];

    const lines = rawLines.map((l: any, idx: number) => {
      const cd = (l.code || '').toUpperCase();
      const nm = (l.name || l.libelle || '').toUpperCase();
      const isGain = l.typeLigne === 'GAIN';

      let unit = '%';
      let fullBase = l.baseCalcul !== undefined && l.baseCalcul !== null && Number(l.baseCalcul) > 0
        ? Number(l.baseCalcul)
        : (isGain ? Number(l.gain || 0) : Number(l.retenue || 0));
      let tauxOrNb: any = null;

      if (cd.includes('SAL_BASE') || nm.includes('SALAIRE DE BASE')) {
        unit = 'j';
        const wDays = b.workedDays !== undefined && b.workedDays !== null ? Number(b.workedDays) : 30;
        tauxOrNb = wDays;
        fullBase = Number(b.salaireBaseOriginal || b.salaireBase || (wDays > 0 ? Math.round((l.gain || 0) * 30 / wDays) : l.gain) || 0);
      } else if (cd.includes('SUR_SALAIRE') || nm.includes('SUR-SALAIRE') || nm.includes('SURSALAIRE')) {
        unit = 'j';
        const wDays = b.workedDays !== undefined && b.workedDays !== null ? Number(b.workedDays) : 30;
        tauxOrNb = wDays;
        fullBase = Number(b.surSalaireOriginal || b.surSalaire || (wDays > 0 ? Math.round((l.gain || 0) * 30 / wDays) : l.gain) || 0);
      } else if (cd.includes('ANC') || nm.includes('ANCIENNET')) {
        unit = '%';
        let tVal = 0;
        if (l.tauxFormatted) {
          const m = String(l.tauxFormatted).match(/(\d+(\.\d+)?)/);
          if (m) tVal = parseFloat(m[1]);
        } else if (l.taux !== undefined && l.taux !== null) {
          tVal = Number(l.taux);
        } else if (b.ancienneteAnnees) {
          tVal = Math.min(25, Number(b.ancienneteAnnees));
        }
        tauxOrNb = tVal;
        fullBase = Number(b.salaireBaseOriginal || b.salaireBase || 0);
      } else if (cd.includes('CNSS') || nm.includes('CNSS')) {
        unit = '%';
        tauxOrNb = 5.5;
        fullBase = Math.min(Number(b.salaireBrutOriginal || b.salaireBrut || 0), 800000);
      } else if (cd.includes('CRRAE') || nm.includes('CRRAE')) {
        unit = '%';
        tauxOrNb = 6;
        fullBase = Number(b.salaireBaseOriginal || b.salaireBase || 0) + Number(b.surSalaireOriginal || b.surSalaire || 0);
      } else if (cd.includes('IUTS') || nm.includes('IUTS')) {
        unit = 'parts';
        tauxOrNb = b.partsFiscales || b.nombreCharges || 2;
        fullBase = Number(b.baseImposableOriginal || b.baseImposable || 0);
      } else if (cd.includes('SOLIDAR') || nm.includes('SOLIDAR') || cd.includes('FSP')) {
        unit = '%';
        tauxOrNb = 1;
        fullBase = Math.max(0, Number(b.salaireBrutOriginal || b.salaireBrut || 0) - Number(b.cotisationCnssOriginal || b.cotisationCnss || 0) - Number(b.impotIutsOriginal || b.impotIuts || 0));
      } else {
        unit = '%';
        let tVal: any = null;
        if (l.tauxFormatted) {
          const m = String(l.tauxFormatted).match(/(\d+(\.\d+)?)/);
          if (m) tVal = parseFloat(m[1]);
        } else if (l.taux !== undefined && l.taux !== null && Number(l.taux) > 0) {
          tVal = Number(l.taux);
        }
        tauxOrNb = tVal;
        // Pour les indemnités (Caisse, Sujétion, Transport, Logement, Cash point...),
        // fullBase doit être le montant nominal de l'indemnité !
        const nominal = Number(
          l.baseCalcul !== undefined && l.baseCalcul !== null && Number(l.baseCalcul) > 0
            ? l.baseCalcul
            : (l.gain !== undefined && l.gain !== null && Number(l.gain) > 0
              ? l.gain
              : (l.montant || 0))
        );
        fullBase = nominal;
      }

      return {
        code: l.code || `LINE_${idx}`,
        name: (l.name || l.libelle || '').replace(/[()]/g, '').trim(),
        typeLigne: l.typeLigne || (isGain ? 'GAIN' : 'RETENUE'),
        baseCalcul: l.baseCalcul !== undefined && l.baseCalcul !== null ? Number(l.baseCalcul) : fullBase,
        fullBase: fullBase,
        tauxOrNb: tauxOrNb,
        unit: unit,
        gain: isGain ? Number(l.gain !== undefined && l.gain !== null ? l.gain : (l.montant || 0)) : null,
        retenue: !isGain ? Number(l.retenue !== undefined && l.retenue !== null ? l.retenue : (l.montant || 0)) : null,
        ordre: l.ordre !== undefined ? l.ordre : (idx + 1),
        tauxFormatted: l.tauxFormatted
      };
    });

    this.editableLines = lines;
    this.recalculerLignesVariables();
  }

  recalculerLignesVariables(): void {
    if (!this.selectedBulletinForEdit?.id || !this.editableLines) return;
    const b = this.selectedBulletinForEdit;

    const salBaseLine = this.editableLines.find(l => (l.code || '').includes('SAL_BASE') || (l.name || '').includes('SALAIRE DE BASE'));
    const surSalLine = this.editableLines.find(l => (l.code || '').includes('SUR_SALAIRE') || (l.name || '').includes('SUR-SALAIRE') || (l.name || '').includes('SURSALAIRE'));

    let workedDays = b.workedDays ?? b.scheduledWorkingDays ?? 30;
    if (salBaseLine && salBaseLine.tauxOrNb !== undefined && salBaseLine.tauxOrNb !== null) {
      workedDays = Number(salBaseLine.tauxOrNb);
      if (isNaN(workedDays) || workedDays < 0) workedDays = 0;
      if (workedDays > 31) workedDays = 31;
      salBaseLine.tauxOrNb = workedDays;
    }
    if (surSalLine) {
      surSalLine.tauxOrNb = workedDays;
    }

    this.isCalculating = true;
    this.bulletinService.recalculerBulletin(Number(b.id), {
      workedDays,
      scheduledWorkingDays: b.scheduledWorkingDays ?? 30
    }).subscribe({
      next: (res) => {
        this.isCalculating = false;
        if (!res) return;
        this.modalSalaireBrut = res.salaireBrut || 0;
        this.modalBaseImposable = (res as any).baseImposable || 0;
        this.modalCotisationCnss = res.cotisationCnssAgent || (res as any).cotisationCnss || 0;
        this.modalImpotIuts = res.impotIUTS || (res as any).impotIuts || 0;
        this.modalCotisationCrrae = res.cotisationCrraeAgent || (res as any).cotisationCrrae || 0;
        this.modalCotisationSolidarite = res.retenueFSP || (res as any).cotisationSolidarite || 0;
        this.modalTotalRetenues = res.totalRetenues || 0;
        this.modalSalaireNet = res.salaireNet || 0;

        if (res.lines && res.lines.length > 0) {
          this.editableLines = res.lines.map((l: any, idx: number) => {
            const isGain = l.typeLigne === 'GAIN' || (l.gain !== null && l.gain !== undefined && Number(l.gain) > 0);
            return {
              id: l.id || idx,
              code: l.code,
              name: (l.libelle || l.name || '').replace(/[()]/g, '').trim(),
              libelle: (l.libelle || l.name || '').replace(/[()]/g, '').trim(),
              typeLigne: l.typeLigne || (isGain ? 'GAIN' : 'RETENUE'),
              baseCalcul: l.baseCalcul,
              tauxOrNb: (l.code && (l.code.includes('SAL_BASE') || l.code.includes('SUR_SALAIRE'))) ? workedDays : (l.tauxSalarial || l.taux || l.rate),
              gain: isGain ? (l.montantSalarial || l.gain || l.montant) : null,
              retenue: !isGain ? (l.montantSalarial || l.retenue || l.montant) : null,
              rate: l.tauxSalarial || l.taux || l.rate,
              ordre: l.ordre || (idx + 1)
            };
          });
        }
      },
      error: (err) => {
        this.isCalculating = false;
        console.warn('Erreur lors du recalcul serveur:', err);
      }
    });
  }

  getTauxHoraire(): number {
    const base = this.selectedBulletinForEdit?.salaireBase || 0;
    return base > 0 ? Math.round(base / 173.333) : 0;
  }

  getMontantHeuresSup(): number {
    const nb = Number(this.editVariablesForm?.nombreHeuresSup) || 0;
    return Math.round(this.getTauxHoraire() * nb);
  }

  fermerModalModifierVariables(): void {
    this.showEditVariablesModal = false;
    this.selectedBulletinForEdit = null;
    this.editableLines = [];
  }

  sauvegarderVariablesEtRecalculer(): void {
    if (!this.selectedBulletinForEdit?.id) return;

    const b = this.selectedBulletinForEdit;
    const salBaseLine = this.editableLines.find(l => (l.code || '').includes('SAL_BASE') || (l.name || '').includes('SALAIRE DE BASE'));
    const workedDays = salBaseLine && salBaseLine.tauxOrNb !== undefined && salBaseLine.tauxOrNb !== null
      ? Number(salBaseLine.tauxOrNb)
      : (b.workedDays ?? b.scheduledWorkingDays ?? 30);

    this.isCalculating = true;

    this.bulletinService.recalculerBulletin(Number(b.id), {
      workedDays,
      scheduledWorkingDays: b.scheduledWorkingDays ?? 30
    }).subscribe({
      next: (savedDto) => {
        this.isCalculating = false;
        if (savedDto) {
          const updatedDto = this.adapterBulletinFromBackend(savedDto);
          const idx = this.bulletins.findIndex(item => String(item.employeeId) === String(b.employeeId) || String(item.id) === String(b.id));
          if (idx >= 0) {
            this.bulletins[idx] = updatedDto;
          } else {
            this.bulletins.push(updatedDto);
          }
          if (this.selectedBulletin && (String(this.selectedBulletin.id) === String(b.id) || String(this.selectedBulletin.employeeId) === String(b.employeeId))) {
            this.selectedBulletin = this.enrichSelectedBulletinLines(updatedDto);
          }
          this.snackBar.open(`Bulletin #${savedDto.id} mis à jour et recalculé avec succès !`, 'OK', { duration: 4000 });
        }
        this.fermerModalModifierVariables();
      },
      error: (err) => {
        this.isCalculating = false;
        this.snackBar.open('Erreur lors de la mise à jour du bulletin: ' + (err?.error?.message || err.message), 'Fermer', { duration: 5000 });
      }
    });
  }

  toggleModeComparatif(): void {
    this.modeComparatifMminus1 = !this.modeComparatifMminus1;
  }

  validerBulletin(b: any): void {
    if (this.sessionCloturee) return;
    b.etat = 'VALIDE';
    b.dateValidation = new Date().toLocaleString('fr-FR');
    if (b.id) {
      this.bulletinService.update(Number(b.id), { statut: 'VALIDE' }).subscribe({
        next: () => this.snackBar.open(`Bulletin #${b.id} validé avec succès.`, 'OK', { duration: 3000 }),
        error: (err) => console.error('Erreur lors de la validation du bulletin:', err)
      });
    }
  }

  refuserBulletin(b: any): void {
    if (this.sessionCloturee) return;
    b.etat = 'GENERE';
    b.dateValidation = null;
    if (b.id) {
      this.bulletinService.update(Number(b.id), { statut: 'GENERE' }).subscribe({
        next: () => this.snackBar.open(`Bulletin #${b.id} réinitialisé à l'état GÉNÉRÉ.`, 'OK', { duration: 3000 }),
        error: (err) => console.error('Erreur lors de la réinitialisation du statut du bulletin:', err)
      });
    }
  }

  voirDetails(b: any): void {
    if (b && b.id) {
      this.isCalculating = true;
      this.http.get<any>(`${environment.apiUrl}/bulletins/${b.id}`).pipe(
        catchError(err => {
          console.warn('Erreur chargement détails bulletin par ID, utilisation des données locales:', err);
          return of(b);
        })
      ).subscribe(fullB => {
        this.isCalculating = false;
        this.selectedBulletin = this.enrichSelectedBulletinLines(fullB || b);
      });
    } else {
      this.selectedBulletin = this.enrichSelectedBulletinLines(b);
    }
  }

  fermerModal(): void {
    this.selectedBulletin = null;
  }

  enrichSelectedBulletinLines(b: any): any {
    if (!b) return b;

    let lines: Array<{ name: string; gain?: number; retenue?: number; baseCalcul?: number; tauxFormatted?: string; code?: string; ordre?: number; typeLigne?: string }> = [];

    if (b.lines && b.lines.length > 0) {
      lines = b.lines.map((l: any) => {
        const cd = (l.code || '').toUpperCase();
        const rawName = (l.libelle || l.name || '').trim();
        const nm = rawName.replace(/[()]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();

        const isRetenue = l.typeLigne === 'RETENUE' || l.typeLigne === 'RETENUE_SOCIALE' || l.typeLigne === 'IMPOT' ||
          l.typeLigne === 'PRECOMPTE' || l.category === 'RETENUE' || l.category === 'PRECOMPTE' ||
          cd.includes('CNSS') || cd.includes('IUTS') || cd.includes('CRRAE') || cd.includes('SOLIDAR') ||
          cd.includes('FSP') || cd.includes('PREC') || cd.includes('AVANCE') || cd.includes('TROP') ||
          nm.includes('RETENUE') || nm.includes('TROP-PER') || nm.includes('TROP_PER') || nm.includes('TROP PER') ||
          (l.retenue !== undefined && l.retenue !== null && l.retenue > 0);

        const isGain = l.gain !== undefined && l.gain !== null ? true : (l.typeLigne === 'GAIN' || l.category === 'GAIN' || l.category === 'INDEMNITES' || !isRetenue);

        const isPatronale = l.typeLigne === 'COTISATION_PATRONALE' || l.typeLigne === 'CHARGE_PATRONALE';
        if (isPatronale) return null;

        const montant = l.montant !== undefined ? l.montant : (l.amount !== undefined ? l.amount : (isGain ? l.gain : l.retenue));
        const gainVal = l.gain !== undefined ? l.gain : (isGain ? montant : undefined);
        const retenueVal = l.retenue !== undefined ? l.retenue : (!isGain ? montant : undefined);

        let tauxStr = '';
        if (cd.includes('SAL_BASE') || cd.includes('SUR_SALAIRE') || nm.includes('SALAIRE DE BASE') || nm.includes('SUR-SALAIRE') || nm.includes('SURSALAIRE')) {
          const days = (l.taux !== undefined && l.taux !== null && Number(l.taux) > 0 && Number(l.taux) <= 31)
            ? l.taux
            : (b.workedDays !== undefined && b.workedDays !== null ? b.workedDays : 30);
          tauxStr = String(days);
        } else if (cd.includes('ICCP') || nm.includes('CONGÉS') || nm.includes('CONGES')) {
          tauxStr = l.taux !== undefined && l.taux !== null ? String(l.taux) : '';
        } else if (cd.includes('CP') || nm.includes('CASH POINT') || nm.includes('CASHPOINT')) {
          tauxStr = (l.taux !== undefined && l.taux !== null && Number(l.taux) > 0 && Number(l.taux) <= 31) ? String(l.taux) : (l.taux !== undefined ? `${l.taux} %` : '');
        } else if (cd.includes('TROP') || cd.includes('PREC') || nm.includes('TROP') || nm.includes('PRECOMPTE')) {
          tauxStr = '';
        } else if (l.tauxFormatted) {
          tauxStr = l.tauxFormatted.replace(/[()]/g, '').trim();
        } else if (l.taux !== undefined && l.taux !== null && l.taux !== '' && Number(l.taux) > 0) {
          if (cd.includes('IUTS') || nm.includes('IUTS')) {
            const tVal = Number(l.taux);
            tauxStr = String(Math.round(tVal));
          } else {
            tauxStr = String(l.taux).includes('%') ? String(l.taux) : `${l.taux} %`;
          }
        }

        const baseVal = l.baseCalcul !== undefined ? l.baseCalcul : (isGain ? montant : undefined);

        return {
          code: l.code,
          name: nm,
          typeLigne: l.typeLigne || (isGain ? 'GAIN' : 'RETENUE'),
          gain: gainVal,
          retenue: retenueVal,
          baseCalcul: baseVal,
          tauxFormatted: tauxStr,
          ordre: l.ordre !== undefined ? l.ordre : undefined
        };
      }).filter((l: any) => l !== null);
    }

    const ancVal = b.primeAnciennete != null ? Number(b.primeAnciennete) : 0;
    if (ancVal > 0 && !lines.some((l: any) => (l.code || '').includes('ANC') || (l.name || '').includes('ANCIENNET'))) {
      lines.push({
        code: 'PRIME_ANC',
        name: "PRIME D'ANCIENNETE",
        typeLigne: 'GAIN',
        gain: ancVal,
        baseCalcul: b.salaireBase || 0,
        tauxFormatted: ''
      });
    }

    lines = lines.filter((l: any) => {
      const g = l.gain != null ? Number(l.gain) : 0;
      const r = l.retenue != null ? Number(l.retenue) : 0;
      const m = l.montant != null ? Number(l.montant) : 0;
      return g > 0 || r > 0 || m > 0;
    });

    const getOrderWeight = (l: any): number => {
      const cd = (l.code || '').toUpperCase();
      const nm = (l.name || l.libelle || '').toUpperCase();

      // 1. Précomptes et trop-perçus TOUJOURS en poids 30
      if (cd.startsWith('PREC') || cd.includes('AVANCE') || cd.includes('TROP') ||
          nm.includes('PRÉCOMPTE') || nm.includes('PRECOMPTE') || nm.includes('AVANCE') ||
          nm.includes('TROP-PER') || nm.includes('TROP_PER') || nm.includes('TROP PER') ||
          l.typeLigne === 'PRECOMPTE' || l.typeLigne === 'RETENUE') {
        return 30;
      }

      // 2. Cotisations sociales et impôts légaux
      if (cd.includes('CNSS') || nm.includes('CNSS')) return 20;
      if (cd.includes('IUTS') || nm.includes('IUTS')) return 21;
      if (cd.includes('CRRAE') || nm.includes('CRRAE')) return 22;
      if (cd.includes('SOLIDAR') || cd.includes('FSP') || nm.includes('SOLIDARITE') || nm.includes('SOLIDARITÉ')) return 23;

      // 3. Salaire de base, sur-salaire et prime d'ancienneté
      if (cd === 'SAL_BASE' || nm === 'SALAIRE DE BASE' || (nm.includes('SALAIRE DE BASE') && !nm.includes('TROP'))) return 1;
      if (cd === 'SUR_SALAIRE' || nm.includes('SURSALAIRE') || nm.includes('SUR-SALAIRE')) return 2;
      if (cd.includes('ANC') || nm.includes('ANCIENNET')) return 3;
      if (cd.includes('CAISSE') || nm.includes('CAISSE')) return 4;
      if (cd.includes('SUJETION') || cd.includes('SUJ') || nm.includes('SUJETION') || nm.includes('SUJÉTION')) return 5;
      if (cd.includes('TRANS') || cd.includes('TRP') || nm.includes('TRANSPORT') || nm.includes('DEPLACEMENT') || nm.includes('DÉPLACEMENT')) return 6;
      if (cd.includes('LOG') || nm.includes('LOGEMENT') || nm.includes('MAISON')) return 7;
      if (cd.includes('CASH') || cd.includes('CP') || nm.includes('CASH POINT') || nm.includes('CASHPOINT') || nm.includes('GUICHET')) return 8;
      if (l.gain !== undefined && l.gain !== null && l.gain > 0) return 10;

      if (l.ordre !== undefined && l.ordre !== null && l.ordre > 0) {
        return l.ordre;
      }
      return 40;
    };

    lines.sort((a, b) => getOrderWeight(a) - getOrderWeight(b));

    const copy = { ...b };
    copy.lines = lines;

    // Respecter rigoureusement les totaux calculés par le backend
    const totGains = lines.reduce((acc, l) => acc + (l.gain || 0), 0);
    const totRets = lines.reduce((acc, l) => acc + (l.retenue || 0), 0);
    copy.salaireBrut = copy.salaireBrut != null ? copy.salaireBrut : totGains;
    copy.totalRetenues = copy.totalRetenues != null ? copy.totalRetenues : totRets;
    copy.salaireNet = copy.salaireNet != null ? copy.salaireNet : (copy.salaireBrut - copy.totalRetenues);

    // Montant en toutes lettres
    copy.montantEnLettres = numberToFrenchWords(Math.round(copy.salaireNet || 0));

    // Mode de règlement et compte
    const emp = copy.employee || this.tousLesEmployes.find(e => String(e.id) === String(copy.employeeId));
    copy.nom = copy.nom || emp?.nom || (copy.employeeName ? copy.employeeName.split(' ')[0] : '—');
    copy.prenom = copy.prenom || emp?.prenom || (copy.employeeName && copy.employeeName.includes(' ') ? copy.employeeName.substring(copy.employeeName.indexOf(' ') + 1) : '—');
    copy.emploi = copy.emploi && copy.emploi !== '—' ? copy.emploi : (emp?.fonction || emp?.poste || copy.fonction || '—');
    copy.dateEmbauche = copy.dateEmbauche && copy.dateEmbauche !== '—' ? copy.dateEmbauche : (emp?.dateEmbauche || '—');
    copy.service = copy.service && copy.service !== '—' ? copy.service : (emp?.service || emp?.departement || emp?.direction || '—');
    copy.numeroCnss = copy.numeroCnss && copy.numeroCnss !== '—' ? copy.numeroCnss : (emp?.numeroCnss || emp?.numeroCNI || '—');
    copy.situationFamiliale = (copy.situationFamiliale || copy.situationMatrimoniale || emp?.situationFamiliale || emp?.situationMatrimoniale || 'Célibataire').replace(/[()]/g, '').trim();
    copy.situationMatrimoniale = copy.situationFamiliale;
    copy.partsFiscales = copy.partsFiscales != null ? copy.partsFiscales : (copy.nombreCharges != null ? copy.nombreCharges : 0);
    copy.classification = copy.classification && copy.classification !== '—' ? copy.classification : (copy.grade || (emp ? this.getGradeConcat(emp) : '—'));
    let genAnc = copy.anciennete != null ? copy.anciennete : (emp?.anciennete != null ? emp.anciennete : (copy.ancienneteAnnees != null ? copy.ancienneteAnnees : 0));
    if (genAnc === 0 && (copy.dateEmbauche || emp?.dateEmbauche)) {
      try {
        const dEmb = new Date(copy.dateEmbauche || emp.dateEmbauche);
        const ref = copy.dateTo ? new Date(copy.dateTo) : new Date();
        genAnc = Math.max(0, ref.getFullYear() - dEmb.getFullYear());
      } catch {}
    }
    copy.anciennete = genAnc;
    copy.ancienneteAnnees = genAnc;
    if (!copy.cotisationCnss && !copy.cotisationCNSS && !copy.cotisationCnssAgent) {
      const cnssLine = lines.find((l: any) => {
        const c = (l.code || '').toUpperCase();
        const nm = (l.name || l.libelle || '').toUpperCase();
        return (c.includes('CNSS') || nm.includes('CNSS')) && !c.includes('PATRON') && !nm.includes('PATRON');
      });
      if (cnssLine) {
        copy.cotisationCnss = cnssLine.retenue || cnssLine.gain || (cnssLine as any).montant || 0;
      } else if (copy.salaireBrut) {
        const baseCnss = Math.min(copy.salaireBrut, 800000);
        copy.cotisationCnss = Math.round(baseCnss * 0.055);
      }
    }
    copy.cumulBrut = (copy.cumulBrutExercice != null && copy.cumulBrutExercice > 0) ? copy.cumulBrutExercice : (copy.cumulBrut != null && copy.cumulBrut > 0 ? copy.cumulBrut : copy.salaireBrut);
    copy.cumulBaseImposable = (copy.cumulBaseImposableExercice != null && copy.cumulBaseImposableExercice > 0) ? copy.cumulBaseImposableExercice : (copy.cumulBaseImposable != null && copy.cumulBaseImposable > 0 ? copy.cumulBaseImposable : copy.baseImposable);
    copy.cumulCnss = (copy.cumulCnssExercice != null && copy.cumulCnssExercice > 0) ? copy.cumulCnssExercice : (copy.cumulCnss != null && copy.cumulCnss > 0 ? copy.cumulCnss : (copy.cotisationCnss || copy.cotisationCNSS || 0));
    copy.cumulIuts = (copy.cumulIutsExercice != null && copy.cumulIutsExercice > 0) ? copy.cumulIutsExercice : (copy.cumulIuts != null && copy.cumulIuts > 0 ? copy.cumulIuts : (copy.impotIuts || copy.impotIUTS || 0));
    copy.cumulCrrae = (copy.cumulCrraeExercice != null && copy.cumulCrraeExercice > 0) ? copy.cumulCrraeExercice : (copy.cumulCrrae != null && copy.cumulCrrae > 0 ? copy.cumulCrrae : (copy.cotisationCrrae || copy.cotisationCrraeAgent || 0));
    copy.banque = (copy.banque || (emp && emp.banque) || 'BANQUE POSTALE').replace(/[()]/g, '').trim();
    if (copy.modeReglement) copy.modeReglement = copy.modeReglement.replace(/[()]/g, '').trim();
    const rawIban = copy.numeroCompteBancaire || emp?.iban;
    copy.numeroCompteBancaire = (rawIban && !rawIban.includes('0000000000') && rawIban !== '08000002501' && rawIban !== '—')
      ? rawIban
      : ((copy.matricule || emp?.matricule) ? `Compte BPBF — ${copy.matricule || emp?.matricule}` : '—');

    if (!copy.dateFrom && this.currentSession) {
      copy.dateFrom = this.currentSession.dateFrom || this.currentSession.dateDebut;
      copy.dateTo = this.currentSession.dateTo || this.currentSession.dateFin;
      if (!copy.dateFrom && this.currentSession.annee && this.currentSession.mois) {
        const y = this.currentSession.annee;
        const m = String(this.currentSession.mois).padStart(2, '0');
        const mNum = parseInt(m, 10);
        const lastDay = new Date(y, mNum, 0).getDate();
        copy.dateFrom = `${y}-${m}-01`;
        copy.dateTo = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;
      }
    }
    copy.periode = copy.periode || copy.sessionPeriode || this.currentSession?.periode || this.periode;
    copy.sessionType = copy.sessionType || copy.typeSession || this.currentSession?.typeSession || this.sessionType || 'ORDINAIRE';

    copy.modeReglement = copy.modePaiement || (emp && emp.modePaiement) || `Virement bancaire / ${copy.banque}`;
    copy.numeroCompteBancaire = copy.numeroCompteBancaire || copy.iban || (emp ? emp.iban : '—');
    copy.code = copy.code || `BLT-${copy.id || '001'}`;

    return copy;
  }

  formatDateFr(dateStr?: string): string {
    if (!dateStr) return '—';
    try {
      const parts = String(dateStr).split('T')[0].split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  }

  formatMoisAnnee(dateStr?: string): string {
    if (!dateStr) return '—';
    try {
      const parts = String(dateStr).split('T')[0].split('-');
      const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      if (parts.length >= 2) {
        const mIdx = parseInt(parts[1], 10) - 1;
        if (mIdx >= 0 && mIdx < 12) {
          return `${mois[mIdx]} ${parts[0]}`;
        }
      }
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return `${mois[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  }

  imprimerBulletin(bulletin?: any): void {
    const raw = bulletin || this.selectedBulletin;
    if (!raw) return;

    if (raw.id) {
      // Ouverture directe via l'URL native du backend (pas de blob URL, pas de blocage Chrome)
      this.bulletinPdfService.ouvrirBulletinDirect(raw.id);
    } else {
      const enriched = this.enrichSelectedBulletinLines(raw);
      const filename = `bulletin-${enriched.matricule || 'paie'}-${(enriched.mois || this.periode || 'mensuel').replace(/\s+/g, '_')}.pdf`;
      this.genererPdfParPreview(enriched, filename);
    }
  }

  private genererPdfParPreview(enriched: any, filename: string): void {
    const dto: any = {
      code: enriched.code,
      employeeId: enriched.employeeId || enriched.employee?.id,
      employeeName: enriched.employeeName || (enriched.nom && enriched.prenom ? `${enriched.prenom} ${enriched.nom}` : undefined),
      employeeNom: enriched.nom,
      employeePrenom: enriched.prenom,
      matricule: enriched.matricule,
      fonction: enriched.emploi || enriched.fonction,
      emploi: enriched.emploi || enriched.fonction,
      gradeLibelle: enriched.classification || enriched.grade,
      classification: enriched.classification || enriched.grade,
      situationFamiliale: enriched.situationFamiliale || enriched.situationMatrimoniale || 'Célibataire',
      situationMatrimoniale: enriched.situationFamiliale || enriched.situationMatrimoniale || 'Célibataire',
      partsFiscales: enriched.partsFiscales,
      nombreCharges: enriched.nombreCharges || 0,
      dateEmbauche: enriched.dateEmbauche,
      service: enriched.service,
      departement: enriched.departement,
      numeroCnss: enriched.numeroCnss,
      numeroCompteBancaire: enriched.numeroCompteBancaire,
      banque: enriched.banque,
      anciennete: enriched.anciennete,
      ancienneteAnnees: enriched.ancienneteAnnees,
      dateFrom: enriched.dateFrom,
      dateTo: enriched.dateTo,
      scheduledWorkingDays: enriched.scheduledWorkingDays ?? 30,
      workedDays: (enriched.joursPresents !== undefined && enriched.joursPresents !== null)
        ? Number(enriched.joursPresents)
        : ((enriched.workedDays !== undefined && enriched.workedDays !== null) ? Number(enriched.workedDays) : 30),
      salaireBase: enriched.salaireBase,
      surSalaire: enriched.surSalaire,
      totalIndemnites: enriched.totalIndemnites,
      totalAvoirs: enriched.totalAvoirs,
      salaireBrut: enriched.salaireBrut,
      baseImposable: enriched.baseImposable,
      cotisationCnss: enriched.cotisationCnss || enriched.cotisationCNSS || enriched.cotisationCnssAgent,
      impotIuts: enriched.impotIuts || enriched.impotIUTS,
      cotisationCrrae: enriched.cotisationCrrae || enriched.cotisationCrraeAgent,
      totalPrecomptes: enriched.totalPrecomptes,
      totalRetenues: enriched.totalRetenues,
      totalCotisationsPatronales: enriched.totalRetenuesPatronales || enriched.partPatronaleCnss,
      salaireNet: enriched.salaireNet,
      cumulBrutExercice: enriched.cumulBrutExercice || enriched.cumulBrut,
      cumulBaseImposableExercice: enriched.cumulBaseImposableExercice || enriched.cumulBaseImposable,
      cumulCnssExercice: enriched.cumulCnssExercice || enriched.cumulCnss,
      cumulIutsExercice: enriched.cumulIutsExercice || enriched.cumulIuts,
      cumulCrraeExercice: enriched.cumulCrraeExercice || enriched.cumulCrrae,
      statut: enriched.statut || enriched.etat || 'GENERE',
      lines: (enriched.lines || []).map((l: any) => ({
        code: l.code || 'LINE',
        libelle: l.name || l.libelle,
        name: l.name || l.libelle,
        typeLigne: l.retenue ? 'RETENUE' : 'GAIN',
        taux: l.rate || (l.taux != null ? l.taux : (l.tauxFormatted ? parseFloat(String(l.tauxFormatted).replace('%', '').trim()) : 100)),
        baseCalcul: l.baseCalcul,
        montant: l.gain || l.retenue || l.amount || 0
      }))
    };

    this.bulletinPdfService.previewBulletinPdf(dto).subscribe({
      next: (blob) => {
        this.bulletinPdfService.ouvrirEtTelechargerPdf(blob, filename);
      },
      error: (err) => {
        alert('Erreur lors de la génération du PDF du bulletin : ' + (err?.message || 'Erreur serveur'));
      }
    });
  }

  imprimerRegistrePaie(): void {
    if (!this.bulletins || this.bulletins.length === 0) {
      alert('Aucun bulletin disponible pour générer le registre de paie.');
      return;
    }

    const filename = `registre-paie-${this.periode.replace(/\s+/g, '_')}.pdf`;

    if (this.currentSession?.id) {
      this.bulletinPdfService.getRegistrePaiePdf(this.currentSession.id).subscribe({
        next: (blob) => {
          this.bulletinPdfService.ouvrirEtTelechargerPdf(blob, filename);
        },
        error: (err) => {
          console.error('Erreur téléchargement registre PDF:', err);
          alert('Erreur lors du téléchargement du registre de paie PDF : ' + (err?.message || 'Vérifiez que la session est bien générée.'));
        }
      });
    } else {
      alert('Veuillez sélectionner ou générer une session pour imprimer son registre de paie officiel en PDF.');
    }
  }
}
