import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { EmployeeService } from '../../../grh/employes/services/employee.service';
import { Employee } from '../../../grh/employes/models/employee.model';
import { calculateOfficialIUTS, computeEmployeeFamilyCharges } from '../../../../core/utils/iuts-calculator.utils';
import { DbRefService } from '../../../donnees-base/services/db-ref.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { numberToFrenchWords } from '../bulletin-individuel/bulletin-individuel.component';

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
  vueActive: 'LISTE_SESSIONS' | 'DETAIL_SESSION' = 'LISTE_SESSIONS';
  listeSessions: any[] = [];
  currentSession: any = null;
  showCreateSessionModal: boolean = false;
  newSessionForm = {
    mois: String(new Date().getMonth() + 1).padStart(2, '0'),
    annee: new Date().getFullYear(),
    periode: `${['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][new Date().getMonth()]} ${new Date().getFullYear()}`,
    typeSession: 'PAIE_NORMALE',
    codeSession: `SESS-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  };

  isCalculating = false;
  bulletins: any[] = [];
  selectedBulletin: any = null;

  // Modification des variables du bulletin par lot
  showEditVariablesModal = false;
  selectedBulletinForEdit: any = null;
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
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.chargerToutesLesSessions();
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
    this.sessionType = (session.typeSession === 'GRATIFICATION' || session.typeSession === 'EXTRAORDINAIRE') ? 'EXTRAORDINAIRE' : 'ORDINAIRE';
    
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
        if (savedBulletins && savedBulletins.length > 0) {
          this.bulletins = savedBulletins.map(b => this.adapterBulletinFromBackend(b));
          this.isCalculating = false;
        } else {
          // Lancer le calcul dynamique pour les agents actifs de la session
          this.lancerCalculPaie();
        }
      });
    } else {
      this.lancerCalculPaie();
    }
  }

  ouvrirModalCreerSession(): void {
    const nextMonth = this.moisIndex + 1 <= 12 ? this.moisIndex + 1 : 1;
    const mmStr = String(nextMonth).padStart(2, '0');
    this.newSessionForm = {
      mois: mmStr,
      annee: this.selectedYear,
      periode: this.moisListe[nextMonth - 1] || `${this.moisNoms[nextMonth - 1]} ${this.selectedYear}`,
      typeSession: 'PAIE_NORMALE',
      codeSession: `SESS-${this.selectedYear}-${mmStr}`
    };
    this.showCreateSessionModal = true;
  }

  fermerModalCreerSession(): void {
    this.showCreateSessionModal = false;
  }

  onAnneeSelectChange(event: any): void {
    const y = parseInt(event.target.value, 10);
    this.newSessionForm.annee = y;
    const mIdx = parseInt(this.newSessionForm.mois, 10) - 1;
    this.newSessionForm.periode = `${this.moisNoms[mIdx] || ''} ${y}`;
    this.newSessionForm.codeSession = `SESS-${y}-${this.newSessionForm.mois}`;
  }

  onMoisSelectChange(event: any): void {
    const m = event.target.value;
    const mIdx = parseInt(m, 10) - 1;
    this.newSessionForm.mois = m;
    this.newSessionForm.periode = `${this.moisNoms[mIdx] || ''} ${this.newSessionForm.annee}`;
    this.newSessionForm.codeSession = `SESS-${this.newSessionForm.annee}-${m}`;
  }

  soumettreCreerSession(): void {
    const payload = {
      codeSession: this.newSessionForm.codeSession,
      mois: this.newSessionForm.mois,
      annee: this.newSessionForm.annee,
      periode: this.newSessionForm.periode,
      typeSession: this.newSessionForm.typeSession,
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
        this.chargerToutesLesSessions();
      }
    });
  }

  lancerGenerationSession(): void {
    if (!this.currentSession || !this.currentSession.id) {
      this.lancerCalculPaie();
      return;
    }
    this.isCalculating = true;
    this.http.post<any[]>(`${environment.apiUrl}/paie/sessions/${this.currentSession.id}/generer`, {}).pipe(
      catchError(err => {
        alert('Erreur lors de la génération: ' + (err?.error?.message || err.message));
        return of([]);
      })
    ).subscribe(bulletins => {
      if (bulletins && bulletins.length > 0) {
        this.bulletins = bulletins.map(b => this.adapterBulletinFromBackend(b));
        this.currentSession.statut = 'GENERE';
      } else {
        this.genererBulletinsDepuisEmployees();
      }
      this.isCalculating = false;
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

  private adapterBulletinFromBackend(b: any): any {
    let copy = JSON.parse(JSON.stringify(b));
    copy.mois = this.periode;
    copy.etat = b.statut || (this.currentSession ? this.currentSession.statut : 'GENERE');

    const sBase = copy.salaireBase || 0;
    copy.salaireBase = sBase;

    const isGratif = (this.currentSession?.typeSession || '').toUpperCase().includes('GRATIF') ||
                     (copy.typeSession || '').toUpperCase().includes('GRATIF');
    if (isGratif) {
      copy.salaireBase = sBase;
      copy.totalIndemnites = 0;
      copy.indemnitesDetails = [];
      copy.totalAvoirs = 0;
      copy.salaireBrut = sBase;
      copy.abattementForfaitaire = 0;
      copy.exoFiscalesIndemnites = 0;
      copy.baseImposable = 0;
      copy.cotisationCnssAgent = 0;
      copy.cotisationCarfoAgent = 0;
      copy.cotisationCrraeAgent = 0;
      copy.cotisationCNSS = 0;
      copy.impotIUTS = 0;
      copy.retenueFSP = 0;
      copy.avanceSurSolde = 0;
      copy.precompteAvance = 0;
      copy.totalPrecomptes = 0;
      copy.totalRetenues = 0;
      copy.partPatronaleCnss = 0;
      copy.partPatronaleCarfo = 0;
      copy.partPatronaleCrrae = 0;
      copy.totalRetenuesPatronales = 0;
      copy.salaireNet = sBase; // LE NET DEVIENT LE BRUT !
      copy.salaireNetM1 = sBase;
      copy.ecartNet = 0;
      return copy;
    }

    let indList = b.lines ? b.lines.filter((l: any) => (l.typeLigne === 'GAIN' || l.category === 'GAIN') && l.code !== 'SAL_BASE') : [];
    if (indList.length > 0) {
      indList = indList.map((i: any) => ({
        typeIndemnite: i.name || i.libelle || i.typeIndemnite || 'INDEMNITE',
        code: i.code || '200',
        montant: i.amount !== undefined ? i.amount : (i.montant || 0)
      }));
    } else if (b.indemnitesDetails && b.indemnitesDetails.length > 0) {
      indList = b.indemnitesDetails;
    } else {
      indList = [];
    }
    copy.indemnitesDetails = indList;
    const totIndem = copy.totalIndemnites !== undefined ? copy.totalIndemnites : indList.reduce((sum: number, item: any) => sum + item.montant, 0);
    copy.totalIndemnites = totIndem;

    const brut = copy.salaireBrut !== undefined ? copy.salaireBrut : (sBase + totIndem);
    copy.salaireBrut = brut;

    const abattement = Math.round(sBase * 0.20);
    const exoFiscales = Math.round(totIndem * 0.20);
    const baseImposable = Math.max(0, brut - abattement - exoFiscales);
    copy.abattementForfaitaire = abattement;
    copy.exoFiscalesIndemnites = exoFiscales;
    copy.baseImposable = baseImposable;

    const isCarfo = (copy.regimeSecuriteSocialCode || copy.regimeSecuriteSocialLibelle || '').toUpperCase().includes('CARFO');
    const cotisCnss = !isCarfo ? Math.round(brut * 0.055) : 0;
    const cotisCarfo = isCarfo ? Math.round(sBase * 0.08) : 0;
    const cotisCrrae = Math.round(sBase * 0.03);
    const impotIuts = Math.round(baseImposable * 0.12);
    const netPreFsp = Math.max(0, brut - (cotisCnss || cotisCarfo) - cotisCrrae - impotIuts);
    const fsp = netPreFsp >= 100000 ? Math.round(netPreFsp * 0.01) : 0;
    const avance = copy.totalPrecomptes !== undefined ? copy.totalPrecomptes : (copy.precompteAvance || copy.avanceSurSolde || 0);

    copy.cotisationCnssAgent = cotisCnss;
    copy.cotisationCarfoAgent = cotisCarfo;
    copy.cotisationCrraeAgent = cotisCrrae;
    copy.impotIUTS = impotIuts;
    copy.retenueFSP = fsp;
    copy.avanceSurSolde = avance;
    copy.precompteAvance = avance;
    copy.totalPrecomptes = avance;

    const totalRetenues = (cotisCnss || cotisCarfo) + cotisCrrae + impotIuts + fsp + avance;
    copy.totalRetenues = totalRetenues;

    const patCnss = !isCarfo ? Math.round(brut * 0.16) : 0;
    const patCarfo = isCarfo ? Math.round(sBase * 0.14) : 0;
    const patCrrae = Math.round(sBase * 0.06);
    copy.partPatronaleCnss = patCnss;
    copy.partPatronaleCarfo = patCarfo;
    copy.partPatronaleCrrae = patCrrae;
    copy.totalRetenuesPatronales = (isCarfo ? patCarfo : patCnss) + patCrrae;

    const net = brut - totalRetenues;
    copy.salaireNet = net;

    let prevNet = net * 0.98;
    copy.salaireNetM1 = Math.round(prevNet);
    copy.ecartNet = Math.round(net - prevNet);
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
    this.lancerCalculPaie();
  }

  changerSession(type: 'ORDINAIRE' | 'EXTRAORDINAIRE'): void {
    this.sessionType = type;
    this.lancerCalculPaie();
  }

  ouvrirModalModifierVariables(b: any): void {
    this.selectedBulletinForEdit = b;
    const empId = b.employeeId || b.employee?.id;

    const initialPrecompte = b.totalPrecomptes !== undefined ? b.totalPrecomptes : (b.precompteAvance || b.avanceSurSolde || 0);
    const initialAvoir = b.totalAvoirs !== undefined ? b.totalAvoirs : (b.primeExceptionnelle || 0);

    this.editVariablesForm = {
      workedDays: b.joursPresents !== undefined ? b.joursPresents : (b.workedDays !== undefined ? b.workedDays : 30),
      scheduledWorkingDays: b.scheduledWorkingDays || 30,
      primeExceptionnelle: initialAvoir,
      precompteAvance: initialPrecompte,
      nombreHeuresSup: b.nombreHeuresSup || (b.heuresSup ? Math.round(b.heuresSup / this.getTauxHoraire()) : 0),
      heuresSup: b.heuresSup || 0,
      motifAjustement: b.motifAjustement || ''
    };

    // Chargement dynamique des précomptes actifs (calcul de la mensualité par échéancier)
    if (empId && initialPrecompte === 0) {
      this.http.get<any[]>(`${environment.apiUrl}/precomptes`).pipe(
        catchError(() => of([]))
      ).subscribe((precomptes: any[]) => {
        let list = precomptes || [];
        if (list.length === 0) {
          const stored = localStorage.getItem('bpbf_precomptes_storage');
          if (stored) {
            try { list = JSON.parse(stored); } catch (e) {}
          }
        }

        const agentPrecomptes = list.filter((p: any) =>
          String(p.employeeId) === String(empId) ||
          (p.matricule && b.matricule && p.matricule.trim() === b.matricule.trim()) ||
          (p.employeeName && b.employeeName && p.employeeName.toLowerCase().includes(b.employeeName.toLowerCase()))
        );

        if (agentPrecomptes.length > 0) {
          const totMensuel = agentPrecomptes.reduce((sum: number, p: any) => {
            if (p.statut && p.statut === 'SOLDE') return sum;
            let m = 0;
            if (p.montantMensuel && p.montantMensuel > 0) {
              m = p.montantMensuel;
            } else if (p.amount && p.amount > 0) {
              const ech = p.echeance || p.echeancesTotal || 1;
              m = Math.round(p.amount / ech);
            } else if (p.montant && p.montant > 0) {
              m = p.montant;
            }
            return sum + m;
          }, 0);

          if (totMensuel > 0) {
            this.editVariablesForm.precompteAvance = totMensuel;
          }
        }
      });
    }

    this.showEditVariablesModal = true;
  }

  getTauxHoraire(): number {
    const base = this.selectedBulletinForEdit?.salaireBaseOriginal || this.selectedBulletinForEdit?.salaireBase || 0;
    return base > 0 ? Math.round(base / 173.333) : 0;
  }

  getMontantHeuresSup(): number {
    const nb = Number(this.editVariablesForm?.nombreHeuresSup) || 0;
    return Math.round(this.getTauxHoraire() * nb);
  }

  fermerModalModifierVariables(): void {
    this.showEditVariablesModal = false;
    this.selectedBulletinForEdit = null;
  }

  sauvegarderVariablesEtRecalculer(): void {
    if (!this.selectedBulletinForEdit) return;

    const b = this.selectedBulletinForEdit;
    const workedDays = Number(this.editVariablesForm.workedDays) || 30;
    const scheduledDays = Number(this.editVariablesForm.scheduledWorkingDays) || 30;
    const ratio = Math.max(0, Math.min(1, workedDays / scheduledDays));

    // Sauvegarder les valeurs de base initiales si pas encore fait
    if (b.salaireBaseOriginal === undefined) {
      b.salaireBaseOriginal = b.salaireBase;
    }
    if (b.totalIndemnitesOriginal === undefined) {
      b.totalIndemnitesOriginal = b.totalIndemnites;
    }

    b.joursPresents = workedDays;
    b.workedDays = workedDays;
    b.scheduledWorkingDays = scheduledDays;
    b.quantitePresence = Number(ratio.toFixed(2));
    b.tauxPresence = Number((ratio * 100).toFixed(2));
    b.primeExceptionnelle = Number(this.editVariablesForm.primeExceptionnelle) || 0;
    b.totalAvoirs = b.primeExceptionnelle;
    b.precompteAvance = Number(this.editVariablesForm.precompteAvance) || 0;
    b.totalPrecomptes = b.precompteAvance;
    b.nombreHeuresSup = Number(this.editVariablesForm.nombreHeuresSup) || 0;
    b.heuresSup = this.getMontantHeuresSup();
    b.motifAjustement = this.editVariablesForm.motifAjustement;

    // Recalcul du salaire de base et indemnités
    b.salaireBase = Math.round(b.salaireBaseOriginal * ratio);

    const isGratifSession = (this.currentSession?.typeSession || '').toUpperCase().includes('GRATIF') ||
                            (b.typeSession || '').toUpperCase().includes('GRATIF');

    if (isGratifSession) {
      b.totalIndemnites = 0;
      b.primeExceptionnelle = 0;
      b.totalAvoirs = 0;
      b.heuresSup = 0;
      b.nombreHeuresSup = 0;
      b.cotisationCNSS = 0;
      b.cotisationCnssAgent = 0;
      b.cotisationCarfoAgent = 0;
      b.cotisationCrraeAgent = 0;
      b.abattementForfaitaire = 0;
      b.baseImposable = 0;
      b.impotIUTS = 0;
      b.retenueFSP = 0;
      b.precompteAvance = 0;
      b.totalPrecomptes = 0;
      b.totalRetenues = 0;
      b.salaireBrut = b.salaireBase;
      b.salaireNet = b.salaireBase; // LE NET DEVIENT LE BRUT !
    } else {
      b.totalIndemnites = Math.round(b.totalIndemnitesOriginal * ratio) + b.primeExceptionnelle;
      b.salaireBrut = b.salaireBase + b.totalIndemnites + b.heuresSup;

      // Cotisations sociales : régime CNSS par défaut pour la banque
      const isCarfo = (b.regimeSecuriteSocialCode || b.regimeSecuriteSocialLibelle || '').toUpperCase().includes('CARFO');
      b.cotisationCNSS = !isCarfo ? Math.round(b.salaireBrut * 0.055) : 0;
      b.cotisationCnssAgent = b.cotisationCNSS;
      b.cotisationCarfoAgent = isCarfo ? Math.round(b.salaireBase * 0.08) : 0;
      b.cotisationCrraeAgent = Math.round(b.salaireBase * 0.03);

      // Retenues et impôt IUTS
      b.abattementForfaitaire = Math.round(b.salaireBase * 0.20);
      b.baseImposable = Math.max(0, b.salaireBrut - b.abattementForfaitaire);
      const netPreFsp = Math.max(0, b.salaireBrut - (b.cotisationCnssAgent || b.cotisationCarfoAgent) - b.cotisationCrraeAgent - (b.impotIUTS || 0));
      b.retenueFSP = netPreFsp >= 100000 ? Math.round(netPreFsp * 0.01) : 0;
      
      // Déduction stricte de TOUTES les retenues incluant le précompte / avance
      b.totalRetenues = (b.cotisationCnssAgent || b.cotisationCarfoAgent) + b.cotisationCrraeAgent + (b.impotIUTS || 0) + b.retenueFSP + (b.precompteAvance || 0);
      b.salaireNet = b.salaireBrut - b.totalRetenues;
    }

    // Mettre à jour l'écart comparatif
    if (b.salaireNetM1) {
      b.ecartNet = b.salaireNet - b.salaireNetM1;
    }

    // Persistance automatique en backend PostgreSQL (Création ou Mise à jour)
    const payload = {
      employeeId: b.employeeId || b.employee?.id,
      sessionPaieId: this.currentSession?.id,
      code: b.code || `BUL-${b.matricule || 'EMP'}`,
      typeSession: this.sessionType || 'ORDINAIRE',
      dateFrom: b.dateFrom,
      dateTo: b.dateTo,
      workedDays: b.workedDays,
      scheduledWorkingDays: b.scheduledWorkingDays,
      salaireBase: b.salaireBase,
      totalIndemnites: b.totalIndemnites,
      totalAvoirs: b.totalAvoirs,
      salaireBrut: b.salaireBrut,
      baseImposable: b.baseImposable,
      cotisationCnss: b.cotisationCNSS,
      impotIuts: b.impotIUTS,
      totalPrecomptes: b.totalPrecomptes,
      totalRetenues: b.totalRetenues,
      totalCotisationsPatronales: b.totalRetenuesPatronales || b.partPatronaleCnss,
      salaireNet: b.salaireNet,
      statut: b.etat || 'VALIDE',
      lines: [
        { code: 'SAL_BASE', libelle: 'SALAIRE DE BASE', name: 'SALAIRE DE BASE', typeLigne: 'GAIN', montant: b.salaireBase, ordre: 1 },
        ...(b.heuresSup > 0 ? [{ code: 'H_SUP', libelle: `HEURES SUPPLÉMENTAIRES (${b.nombreHeuresSup}H)`, name: `HEURES SUPPLÉMENTAIRES (${b.nombreHeuresSup}H)`, typeLigne: 'GAIN', montant: b.heuresSup, ordre: 2 }] : []),
        ...(b.totalIndemnites > 0 ? [{ code: 'INDEMNITES', libelle: 'INDEMNITÉS TOTALES', name: 'INDEMNITÉS TOTALES', typeLigne: 'GAIN', montant: b.totalIndemnites, ordre: 3 }] : []),
        { code: 'CNSS_SAL', libelle: 'RETENUE CNSS AGENT (5.5%)', name: 'RETENUE CNSS AGENT (5.5%)', typeLigne: 'RETENUE', montant: b.cotisationCNSS, ordre: 4 },
        { code: 'IUTS', libelle: 'IMPÔT SUR SALAIRE IUTS', name: 'IMPÔT SUR SALAIRE IUTS', typeLigne: 'RETENUE', montant: b.impotIUTS || 0, ordre: 5 },
        ...(b.totalPrecomptes > 0 ? [{ code: 'PRECOMPTE', libelle: 'PRÉCOMPTES & AVANCES SUR SALAIRE', name: 'PRÉCOMPTES & AVANCES SUR SALAIRE', typeLigne: 'PRECOMPTE', montant: b.totalPrecomptes, ordre: 6 }] : []),
        { code: 'NET_PAYE', libelle: 'NET A PAYER', name: 'NET A PAYER', typeLigne: 'NET', montant: b.salaireNet, ordre: 7 }
      ]
    };

    if (b.id) {
      this.http.put<any>(`${environment.apiUrl}/bulletins/${b.id}`, payload).subscribe({
        next: (res) => {
          if (res && res.id) b.id = res.id;
        },
        error: () => {}
      });
    } else {
      this.http.post<any>(`${environment.apiUrl}/bulletins`, payload).subscribe({
        next: (res) => {
          if (res && res.id) b.id = res.id;
        },
        error: () => {}
      });
    }

    // Sauvegarde de l'état ajusté dans le cache local
    try {
      const cacheKey = `bpbf_ajustements_${this.periode}`;
      const existing = JSON.parse(localStorage.getItem(cacheKey) || '{}');
      existing[b.matricule || b.employeeId] = {
        workedDays: b.workedDays,
        scheduledWorkingDays: b.scheduledWorkingDays,
        primeExceptionnelle: b.primeExceptionnelle,
        precompteAvance: b.precompteAvance,
        totalPrecomptes: b.totalPrecomptes,
        nombreHeuresSup: b.nombreHeuresSup,
        heuresSup: b.heuresSup,
        motifAjustement: b.motifAjustement,
        salaireBase: b.salaireBase,
        totalIndemnites: b.totalIndemnites,
        salaireBrut: b.salaireBrut,
        totalRetenues: b.totalRetenues,
        salaireNet: b.salaireNet
      };
      localStorage.setItem(cacheKey, JSON.stringify(existing));
    } catch (e) {}

    this.fermerModalModifierVariables();
  }

  toggleModeComparatif(): void {
    this.modeComparatifMminus1 = !this.modeComparatifMminus1;
  }

  lancerCalculPaie(): void {
    this.isCalculating = true;
    this.genererBulletinsDepuisEmployees();
  }

  private genererBulletinsDepuisEmployees(employeeList?: Employee[]): void {
    if (employeeList && employeeList.length > 0) {
      this.buildBulletins(employeeList);
      return;
    }

    this.employeeService.getAll().subscribe(employees => {
      const list = (employees && employees.length > 0) ? employees : [];
      this.buildBulletins(list);
    });
  }

  private buildBulletins(employees: Employee[]): void {
    if (employees.length === 0) {
      this.bulletins = [];
      this.isCalculating = false;
      return;
    }

    forkJoin({
      infoDtos: forkJoin(employees.map(emp => 
        this.employeeService.getSalaryInformation(String(emp.id)).pipe(
          catchError(() => of(null))
        )
      )),
      familles: forkJoin(employees.map(emp => 
        this.employeeService.getFamily(String(emp.id)).pipe(
          catchError(() => of(undefined))
        )
      )),
      allAvoirs: this.http.get<any[]>(`${environment.apiUrl}/avoirs`).pipe(
        catchError(() => of([]))
      ),
      allPrecomptes: this.http.get<any[]>(`${environment.apiUrl}/precomptes`).pipe(
        catchError(() => of([]))
      )
    }).subscribe(({ infoDtos, familles, allAvoirs, allPrecomptes }) => {
      const calculated = employees.map((emp, index) => {
        return this.mapBulletinFromInfoDtoOrEmployee(
          emp,
          infoDtos[index],
          familles[index],
          allAvoirs || [],
          allPrecomptes || []
        );
      });
      this.bulletins = this.adapterBulletinsSelonSession(calculated);
      this.isCalculating = false;
    });
  }

  private parseEmployeeHireDate(dateStr?: string): Date | null {
    if (!dateStr) return null;
    const str = String(dateStr).trim();
    if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 3) {
        const p1 = parseInt(parts[0], 10);
        const p2 = parseInt(parts[1], 10);
        const p3 = parseInt(parts[2], 10);
        if (p1 > 12) {
          // DD/MM/YYYY
          return new Date(p3, p2 - 1, p1);
        } else if (p2 > 12) {
          // MM/DD/YYYY
          return new Date(p3, p1 - 1, p2);
        } else {
          // Default MM/DD/YYYY (e.g. 8/25/2026 from datepicker)
          return new Date(p3, p1 - 1, p2);
        }
      }
    } else if (str.includes('-')) {
      const parts = str.split('-');
      if (parts.length === 3) {
        const p1 = parseInt(parts[0], 10);
        const p2 = parseInt(parts[1], 10);
        const p3 = parseInt(parts[2], 10);
        if (p1 > 1000) {
          return new Date(p1, p2 - 1, p3);
        } else {
          return new Date(p3, p2 - 1, p1);
        }
      }
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  private mapBulletinFromInfoDtoOrEmployee(emp: Employee, infoDto: any, famille?: any, allAvoirs: any[] = [], allPrecomptes: any[] = []): any {
    const payMonth = this.moisIndex; // 0-indexed (6 = Juillet, 7 = Août, etc.)
    const payYear = 2026;
    const daysInMonthCal = new Date(payYear, payMonth + 1, 0).getDate();
    const mmStr = String(payMonth + 1).padStart(2, '0');
    const startPeriodStr = `01/${mmStr}/${payYear}`;
    const endPeriodStr = `${daysInMonthCal}/${mmStr}/${payYear}`;

    // Calcul du Prorata Temporis basé sur la date de prise de fonction / embauche
    const hireDate = this.parseEmployeeHireDate(emp.dateEmbauche);
    let ratioPresence = 1.0;
    let isProrata = false;
    let joursPresents = 30;

    if (hireDate) {
      const hYear = hireDate.getFullYear();
      const hMonth = hireDate.getMonth();
      const hDay = hireDate.getDate();

      if (hYear === payYear && hMonth === payMonth) {
        // Embauché pendant le mois de paie en cours !
        const joursReels = Math.max(1, daysInMonthCal - hDay + 1);
        joursPresents = Math.min(30, joursReels);
        ratioPresence = Math.min(1, Math.max(0, joursPresents / 30));
        isProrata = true;
      } else if (hireDate > new Date(payYear, payMonth, daysInMonthCal)) {
        // Embauché dans un mois futur
        ratioPresence = 0;
        joursPresents = 0;
        isProrata = true;
      } else {
        // Déjà en poste
        ratioPresence = 1.0;
        joursPresents = 30;
        isProrata = false;
      }
    }

    const quantitePresence = Number(ratioPresence.toFixed(2));
    const tauxPresence = Number((ratioPresence * 100).toFixed(2));

    const sBaseMensuel = (infoDto && infoDto.salaireBase && Number(infoDto.salaireBase) > 0)
      ? Number(infoDto.salaireBase)
      : (emp.salaireBase || 0);

    const sBase = Math.round(sBaseMensuel * ratioPresence);

    let rawIndemnitesMensuelles = (infoDto && infoDto.indemnites && infoDto.indemnites.length > 0)
      ? infoDto.indemnites.map((i: any) => ({
          typeIndemnite: (i.libelle || i.typeIndemniteCode || 'INDEMNITE').toUpperCase(),
          code: i.typeIndemniteCode || i.code || '',
          montantMensuel: Number(i.montant) || 0
        }))
      : [];

    if (rawIndemnitesMensuelles.length === 0) {
      if (emp.primeLogement && emp.primeLogement > 0) {
        rawIndemnitesMensuelles.push({ typeIndemnite: 'INDEMNITE DE LOGEMENT', code: '200', montantMensuel: emp.primeLogement });
      }
      if (emp.primeTransport && emp.primeTransport > 0) {
        rawIndemnitesMensuelles.push({ typeIndemnite: 'INDEMNITE DE TRANSPORT / ASTREINTE', code: '210', montantMensuel: emp.primeTransport });
      }
      if (emp.primeResponsabilite && emp.primeResponsabilite > 0) {
        rawIndemnitesMensuelles.push({ typeIndemnite: 'INDEMNITE DE RESPONSABILITE / CAISSE', code: '230', montantMensuel: emp.primeResponsabilite });
      }
      if (emp.autresIndemnites && emp.autresIndemnites.length > 0) {
        emp.autresIndemnites.forEach((ai, idx) => {
          if (ai.montant > 0) rawIndemnitesMensuelles.push({ typeIndemnite: (ai.libelle || 'INDEMNITE').toUpperCase(), code: `29${idx + 1}`, montantMensuel: ai.montant });
        });
      }
    }

    const rawIndemnites = rawIndemnitesMensuelles.map((i: any) => ({
      typeIndemnite: i.typeIndemnite,
      code: i.code,
      montant: Math.round(i.montantMensuel * ratioPresence)
    }));

    // Récupération des avoirs de l'agent enregistrés dans la table des Avoirs
    const empAvoirs = (allAvoirs || []).filter((a: any) =>
      String(a.employeeId) === String(emp.id) ||
      (a.matricule && emp.matricule && a.matricule.trim() === emp.matricule.trim()) ||
      (a.employeeName && emp.nom && a.employeeName.toLowerCase().includes(emp.nom.toLowerCase()))
    );
    const avoirsDetails = empAvoirs.filter((a: any) => a.statut !== 'SOLDE').map((a: any) => {
      let m = a.montantMensuel || a.amountMensuel || 0;
      if (!m && a.amount) m = Math.round(a.amount / (a.echeance || a.echeancesTotal || 1));
      if (!m && a.montant) m = a.montant;
      return {
        id: a.id,
        code: a.salaryElementCode || `AVOIR_${a.id}`,
        name: (a.salaryElementName || a.libelle || a.name || 'AVOIR & PRIME DU MOIS').toUpperCase(),
        montant: m,
        regle: a.salaryElementName || a.libelle || 'AVOIR & PRIME PERIODIQUE'
      };
    });
    const totalAvoirs = avoirsDetails.reduce((sum: number, a: any) => sum + a.montant, 0);

    // Récupération des précomptes de l'agent enregistrés dans la table des Précomptes
    const empPrecomptes = (allPrecomptes || []).filter((p: any) =>
      String(p.employeeId) === String(emp.id) ||
      (p.matricule && emp.matricule && p.matricule.trim() === emp.matricule.trim()) ||
      (p.employeeName && emp.nom && p.employeeName.toLowerCase().includes(emp.nom.toLowerCase()))
    );
    const precomptesDetails = empPrecomptes.filter((p: any) => p.statut !== 'SOLDE').map((p: any) => {
      let m = p.montantMensuel || p.amountMensuel || 0;
      if (!m && p.amount) m = Math.round(p.amount / (p.echeance || p.echeancesTotal || 1));
      if (!m && p.montant) m = p.montant;
      return {
        id: p.id,
        code: p.salaryElementCode || `PREC_${p.id}`,
        name: (p.salaryElementName || p.libelle || p.name || 'PRÉCOMPTE / RETENUE').toUpperCase(),
        montant: m,
        regle: p.salaryElementName || p.libelle || 'DÉDUCTION MENSUELLE'
      };
    });
    const totalPrecomptes = precomptesDetails.reduce((sum: number, p: any) => sum + p.montant, 0);

    const totIndem = rawIndemnites.reduce((acc: number, item: any) => acc + item.montant, 0);
    const brut = sBase + totIndem + totalAvoirs;

    const pecParams = this.dbRefService ? this.dbRefService.getParamPriseEnCharge() : undefined;
    const nCharges = computeEmployeeFamilyCharges(emp, pecParams, 20, 4, famille);
    const computedGrade = this.computeGradeCode(emp);

    const calc = calculateOfficialIUTS(sBase, rawIndemnites.map((i: any) => ({ libelle: i.typeIndemnite, montant: i.montant })), {
      vehiculeFourni: emp.vehiculeFourni,
      logementFourni: emp.logementFourni,
      nombreChargesFamille: nCharges,
      inclureFSP: true,
      inclureCRRAE: true
    });

    const abattementForfaitaire = calc.abattementForfaitaire || Math.round(sBase * 0.20);
    const exoFiscalesIndemnites = (calc.totalExonerations && calc.totalExonerations > abattementForfaitaire)
      ? (calc.totalExonerations - abattementForfaitaire)
      : Math.round(totIndem * 0.20);
    const baseImposable = calc.baseImposable || Math.max(0, brut - abattementForfaitaire - exoFiscalesIndemnites);

    // Retenues salariales Agent : CNSS par défaut pour la banque, ou CARFO si agent public
    const isCarfo = (emp.regimeSecuriteSocialCode || emp.regimeSecuriteSocialLibelle || '').toUpperCase().includes('CARFO');
    const cotisationCarfoAgent = isCarfo ? Math.round(sBase * 0.08) : 0;
    const cotisationCnssAgent = !isCarfo ? Math.round(brut * 0.055) : 0;
    const cotisationCrraeAgent = Math.round(sBase * 0.03);
    const impotIUTS = calc.iutsNet || 0;

    // FSP légal : 1% sur le salaire net d'impôt (si >= 100 000 FCFA)
    const netAvantFsp = Math.max(0, brut - (cotisationCarfoAgent || cotisationCnssAgent) - cotisationCrraeAgent - impotIUTS);
    const retenueFSP = calc.fondsSoutienPat !== undefined && calc.fondsSoutienPat !== 0
      ? calc.fondsSoutienPat
      : (netAvantFsp >= 100000 ? Math.round(netAvantFsp * 0.01) : 0);

    const avanceSurSolde = totalPrecomptes;
    const totalRetenuesAgent = (cotisationCarfoAgent || cotisationCnssAgent) + cotisationCrraeAgent + impotIUTS + retenueFSP + avanceSurSolde;

    // Retenues patronales Employeur : régime pertinent uniquement
    const partPatronaleCarfo = isCarfo ? Math.round(sBase * 0.14) : 0;
    const partPatronaleCnss = !isCarfo ? Math.round(brut * 0.16) : 0;
    const partPatronaleCrrae = Math.round(sBase * 0.06);
    const totalRetenuesPatronales = (isCarfo ? partPatronaleCarfo : partPatronaleCnss) + partPatronaleCrrae;

    const salaireNet = brut - totalRetenuesAgent;

    const b: any = {
      employeeId: emp.id,
      employeeName: `${emp.nom || ''} ${emp.prenom || ''}`.trim().toUpperCase() || 'AGENT',
      matricule: emp.matricule || 'EMP-001',
      fonction: emp.fonction || emp.poste || emp.service || 'Agent',
      grade: computedGrade,
      categorie: emp.categoriePro || 'CLASSE I',
      dateEmbauche: emp.dateEmbauche,
      isProrata,
      joursPresents,
      quantitePresence,
      tauxPresence,
      periodeTexte: `${startPeriodStr} - ${endPeriodStr} (${this.periode})`,
      moisCode: mmStr,
      anneeCode: String(payYear),
      mois: this.periode,
      salaireBase: sBase,
      salaireBaseMensuel: sBaseMensuel,
      totalIndemnites: totIndem,
      totalAvoirs: totalAvoirs,
      primeExceptionnelle: totalAvoirs,
      avoirsDetails: avoirsDetails,
      precomptesDetails: precomptesDetails,
      totalPrecomptes: totalPrecomptes,
      precompteAvance: totalPrecomptes,
      avanceSurSolde: totalPrecomptes,
      salaireBrut: brut,
      indemnitesDetails: rawIndemnites,
      abattementForfaitaire,
      exoFiscalesIndemnites,
      baseImposable,
      cotisationCarfoAgent,
      cotisationCnssAgent,
      cotisationCrraeAgent,
      impotIUTS,
      retenueFSP,
      totalRetenues: totalRetenuesAgent,
      partPatronaleCarfo,
      partPatronaleCnss,
      partPatronaleCrrae,
      totalRetenuesPatronales,
      salaireNet,
      nombreCharges: nCharges,
      banque: (infoDto && infoDto.banque) || emp.banque || 'BANQUE POSTALE DU BURKINA FASO - BPBF',
      iban: (infoDto && infoDto.iban) || emp.iban || '—',
      modePaiement: (infoDto && infoDto.modePaiement) || emp.modePaiement || 'Virement bancaire'
    };

    // Restaurer les ajustements de variables et heures supplémentaires sauvegardés
    try {
      const cacheKey = `bpbf_ajustements_${this.periode}`;
      const savedMap = JSON.parse(localStorage.getItem(cacheKey) || '{}');
      const saved = savedMap[emp.matricule || emp.id];
      if (saved) {
        if (saved.workedDays !== undefined) b.joursPresents = saved.workedDays;
        if (saved.scheduledWorkingDays !== undefined) b.scheduledWorkingDays = saved.scheduledWorkingDays;
        if (saved.primeExceptionnelle !== undefined) b.primeExceptionnelle = saved.primeExceptionnelle;
        if (saved.totalAvoirs !== undefined) b.totalAvoirs = saved.totalAvoirs;
        if (saved.precompteAvance !== undefined) b.precompteAvance = saved.precompteAvance;
        if (saved.totalPrecomptes !== undefined) b.totalPrecomptes = saved.totalPrecomptes;
        if (saved.nombreHeuresSup !== undefined) b.nombreHeuresSup = saved.nombreHeuresSup;
        if (saved.heuresSup !== undefined) b.heuresSup = saved.heuresSup;
        if (saved.motifAjustement !== undefined) b.motifAjustement = saved.motifAjustement;
        if (saved.salaireBase !== undefined) b.salaireBase = saved.salaireBase;
        if (saved.totalIndemnites !== undefined) b.totalIndemnites = saved.totalIndemnites;
        if (saved.salaireBrut !== undefined) b.salaireBrut = saved.salaireBrut;
        if (saved.totalRetenues !== undefined) b.totalRetenues = saved.totalRetenues;
        if (saved.salaireNet !== undefined) b.salaireNet = saved.salaireNet;
      }
    } catch (e) {}

    return b;
  }

  private computeGradeCode(emp: any): string {
    const rawGrade = emp.grade;
    const rawCat = emp.categoriePro || emp.categorie;
    const rawEch = emp.echelon;

    if (rawGrade && /^(C|CL|HC)\d*(E\d+|EX)$/i.test(rawGrade.trim())) {
      return rawGrade.trim().toUpperCase();
    }

    let g = (rawGrade || '').trim();
    let c = (rawCat || '').trim();
    let e = (rawEch || '').trim();

    if (g.includes('Échelon') || g.includes('Echelon') || g.includes('ECHELON') || g.includes('echelon')) {
      const parts = g.split(/(?=Échelon|Echelon|ECHELON|echelon)/i);
      if (parts.length >= 2) {
        if (!c) c = parts[0].trim();
        if (!e) e = parts[1].trim();
      }
    }

    let catCode = '';
    const cUpper = (c || g).toUpperCase();
    if (cUpper.includes('HORS') || cUpper.startsWith('HC')) {
      catCode = 'HC';
    } else if (cUpper.includes('CLASSE') || cUpper.startsWith('CL')) {
      const m = cUpper.match(/\d+|I{1,3}|IV|V|VI{1,3}|VIII/);
      if (m) {
        const romanToNum: Record<string, string> = { 'I': '1', 'II': '2', 'III': '3', 'IV': '4', 'V': '5', 'VI': '6', 'VII': '7', 'VIII': '8' };
        const num = romanToNum[m[0]] || m[0];
        catCode = `CL${num}`;
      } else {
        catCode = 'CL1';
      }
    } else {
      const num = cUpper.replace(/[^0-9]/g, '');
      catCode = num ? `C${num}` : 'C1';
    }

    let echCode = '';
    const eUpper = (e || g).toUpperCase();
    if (eUpper.includes('EXCEPT') || eUpper.endsWith('EX')) {
      echCode = 'EX';
    } else {
      const m = eUpper.replace(/[^0-9]/g, '');
      if (m) {
        const num = parseInt(m, 10);
        echCode = num < 10 ? `E0${num}` : `E${num}`;
      } else {
        echCode = 'E01';
      }
    }

    return `${catCode}${echCode}`;
  }

  private buildBulletinFromEmployee(emp: Employee, famille?: Array<{ estCharge?: boolean }>): any {
    const sBase = emp.salaireBase || 0;
    let pLog = emp.primeLogement || 0;
    let pTrans = emp.primeTransport || 0;
    let pResp = emp.primeResponsabilite || 0;

    const indemnitesList: Array<{ libelle: string; code: string; montant: number }> = [];
    if (pLog > 0) {
      indemnitesList.push({ libelle: 'INDEMNITE DE LOGEMENT', code: 'x_indem_loge', montant: pLog });
    }
    if (pTrans > 0) {
      indemnitesList.push({ libelle: 'INDEMNITE DE TRANSPORT / ASTREINTE', code: 'x_indem_astr', montant: pTrans });
    }
    if (pResp > 0) {
      indemnitesList.push({ libelle: 'INDEMNITE DE RESPONSABILITE', code: 'x_indem_finance', montant: pResp });
    }

    if (emp.autresIndemnites && emp.autresIndemnites.length > 0) {
      emp.autresIndemnites.forEach((ai, idx) => {
        if (ai.montant > 0) indemnitesList.push({ libelle: (ai.libelle || 'INDEMNITE').toUpperCase(), code: `x_indem_${idx + 1}`, montant: ai.montant });
      });
    }

    const pecParams = this.dbRefService ? this.dbRefService.getParamPriseEnCharge() : undefined;
    const nCharges = computeEmployeeFamilyCharges(emp, pecParams, 20, 4, famille);
    const computedGrade = this.computeGradeCode(emp);

    const calc = calculateOfficialIUTS(sBase, indemnitesList, {
      vehiculeFourni: emp.vehiculeFourni,
      logementFourni: emp.logementFourni,
      nombreChargesFamille: nCharges,
      inclureFSP: true,
      inclureCRRAE: true
    });

    const partPatronaleCnss = Math.round(calc.remunerationTotale * 0.16);
    const autresRetenues = (calc.fondsSoutienPat || 0) + (calc.crrae || 0);

    return {
      employeeId: emp.id,
      employeeName: `${emp.nom || ''} ${emp.prenom || ''}`.trim().toUpperCase() || 'AGENT',
      matricule: emp.matricule || 'EMP-001',
      fonction: emp.fonction || emp.poste || emp.service || 'Agent',
      grade: computedGrade,
      categorie: emp.categoriePro || 'CLASSE I',
      salaireBase: calc.salaireBase,
      totalIndemnites: calc.totalIndemnites,
      salaireBrut: calc.remunerationTotale,
      cotisationCNSS: calc.cotisationCNSS,
      partPatronaleCnss,
      baseImposable: calc.baseImposable,
      nombreCharges: nCharges,
      impotIUTS: calc.iutsNet,
      salaireNetBrut: Math.max(0, calc.remunerationTotale - calc.cotisationCNSS - calc.iutsNet),
      autresRetenues,
      totalRetenues: calc.totalRetenues,
      salaireNet: calc.salaireNet,
      indemnitesDetails: indemnitesList.map(i => ({ typeIndemnite: i.libelle, code: i.code, montant: i.montant }))
    };
  }

  private adapterBulletinsSelonSession(list: any[]): any[] {
    return list.map(b => {
      let copy = JSON.parse(JSON.stringify(b));
      copy.mois = this.periode;
      copy.sessionType = this.sessionType;

      let baseSal = copy.salaireBase || 150000;

      if ((this.currentSession?.typeSession || '').toUpperCase().includes('GRATIF')) {
        copy.indemnitesDetails = [];
        copy.totalIndemnites = 0;
        copy.totalAvoirs = 0;
        copy.salaireBrut = baseSal;
        copy.cotisationCNSS = 0;
        copy.partPatronaleCnss = 0;
        copy.baseImposable = 0;
        copy.impotIUTS = 0;
        copy.salaireNetBrut = baseSal;
        copy.autresRetenues = 0;
        copy.totalRetenues = 0;
        copy.salaireNet = baseSal; // LE NET DEVIENT LE BRUT !
        copy.etat = (this.currentSession && this.currentSession.statut) ? this.currentSession.statut : 'GENERE';
        copy.dateValidation = null;
        copy.salaireNetM1 = baseSal;
        copy.ecartNet = 0;
        return copy;
      }

      let indemnites: Array<{typeIndemnite: string; montant: number}> = copy.indemnitesDetails || [];

      // Recalcul avec le barème officiel IUTS
      const indList = indemnites.map(i => ({ libelle: i.typeIndemnite, montant: i.montant }));
      const calc = calculateOfficialIUTS(baseSal, indList, {
        nombreChargesFamille: copy.nombreCharges || 0,
        inclureFSP: true,
        inclureCRRAE: true
      });

      copy.indemnitesDetails = indemnites;
      copy.totalIndemnites = calc.totalIndemnites;
      copy.salaireBrut = calc.remunerationTotale;
      copy.cotisationCNSS = calc.cotisationCNSS;
      copy.partPatronaleCnss = Math.round(calc.remunerationTotale * 0.16);
      copy.baseImposable = calc.baseImposable;
      copy.impotIUTS = calc.iutsNet;
      copy.salaireNetBrut = Math.max(0, calc.remunerationTotale - calc.cotisationCNSS - calc.iutsNet);
      copy.autresRetenues = (calc.fondsSoutienPat || 0) + (calc.crrae || 0);
      copy.totalRetenues = calc.totalRetenues;
      copy.salaireNet = calc.salaireNet;

      // État initial
      copy.etat = (this.currentSession && this.currentSession.statut) ? this.currentSession.statut : 'GENERE';
      copy.dateValidation = null;

      // Calcul comparatif M-1 vs M
      let prevNet = copy.salaireNet * (this.sessionType === 'ORDINAIRE' ? 0.98 : 0.5);
      copy.salaireNetM1 = Math.round(prevNet);
      copy.ecartNet = Math.round(copy.salaireNet - prevNet);

      return copy;
    });
  }

  validerBulletin(b: any): void {
    if (this.sessionCloturee) return;
    b.etat = 'VALIDE';
    b.dateValidation = new Date().toLocaleString('fr-FR');
  }

  refuserBulletin(b: any): void {
    if (this.sessionCloturee) return;
    b.etat = 'GENERE';
    b.dateValidation = null;
  }

  voirDetails(b: any): void {
    let target = b;
    if (!b.cotisationCnssAgent || b.cotisationCnssAgent === 0) {
      target = this.adapterBulletinFromBackend(b);
    }
    this.selectedBulletin = this.enrichSelectedBulletinLines(target);
  }

  fermerModal(): void {
    this.selectedBulletin = null;
  }

  enrichSelectedBulletinLines(b: any): any {
    if (!b) return b;

    const sBase = b.salaireBase || 0;
    const isGratif = (b.typeSession || this.currentSession?.typeSession || '').toUpperCase().includes('GRATIF');
    if (isGratif) {
      return {
        ...b,
        salaireBase: sBase,
        totalIndemnites: 0,
        totalAvoirs: 0,
        salaireBrut: sBase,
        cotisationCNSS: 0,
        cotisationCnssAgent: 0,
        cotisationCarfoAgent: 0,
        cotisationCrraeAgent: 0,
        impotIUTS: 0,
        retenueFSP: 0,
        totalPrecomptes: 0,
        precompteAvance: 0,
        totalRetenues: 0,
        salaireNet: sBase, // LE NET DEVIENT LE BRUT !
        lines: [
          { name: 'GRATIFICATION ANNUELLE (13ÈME MOIS)', gain: sBase }
        ]
      };
    }

    const brut = b.salaireBrut !== undefined ? b.salaireBrut : (sBase + (b.totalIndemnites || 0));

    // Avoirs lines
    const lines: Array<{ name: string; gain?: number; retenue?: number }> = [];
    lines.push({ name: 'SALAIRE DE BASE', gain: sBase });

    if (b.indemnitesDetails && b.indemnitesDetails.length > 0) {
      b.indemnitesDetails.forEach((ind: any) => {
        if (ind.montant > 0) {
          lines.push({
            name: (ind.typeIndemnite || ind.libelle || 'INDEMNITÉ').toUpperCase(),
            gain: ind.montant
          });
        }
      });
    }

    if (b.avoirsDetails && b.avoirsDetails.length > 0) {
      b.avoirsDetails.forEach((av: any) => {
        if (av.montant > 0) {
          lines.push({
            name: (av.name || av.libelle || 'AVOIR & PRIME DU MOIS').toUpperCase(),
            gain: av.montant
          });
        }
      });
    } else if ((b.totalAvoirs || b.primeExceptionnelle || 0) > 0) {
      lines.push({
        name: 'AVOIRS & PRIMES DU MOIS',
        gain: b.totalAvoirs || b.primeExceptionnelle
      });
    }

    // Retenues lines: Un seul régime obligatoire (CARFO OU CNSS, jamais les deux à la fois !)
    const isCarfo = (b.regimeSecuriteSocialCode || b.regimeSecuriteSocialLibelle || b.regime || '').toUpperCase().includes('CARFO');

    if (isCarfo && b.cotisationCarfoAgent && b.cotisationCarfoAgent > 0) {
      lines.push({
        name: 'COTISATION PENSION RETRAITE CARFO (PART AGENT)',
        retenue: b.cotisationCarfoAgent
      });
    } else {
      const cnssVal = b.cotisationCnssAgent || b.cotisationCNSS || Math.round(brut * 0.055);
      if (cnssVal > 0) {
        lines.push({
          name: 'RETENUE SÉCURITÉ SOCIALE CNSS (PART AGENT)',
          retenue: cnssVal
        });
      }
    }

    const crraeVal = b.cotisationCrraeAgent !== undefined ? b.cotisationCrraeAgent : Math.round(sBase * 0.03);
    if (crraeVal > 0) {
      lines.push({
        name: 'COTISATION RETRAITE COMPLÉMENTAIRE CRRAE',
        retenue: crraeVal
      });
    }

    const iutsVal = b.impotIUTS || b.impotIuts || 0;
    if (iutsVal > 0) {
      const chargeText = b.nombreCharges > 0 ? ` (${b.nombreCharges} CHARGE[S])` : '';
      lines.push({
        name: `IUTS DU MOIS${chargeText}`,
        retenue: iutsVal
      });
    }

    // FSP légal : 1% sur le salaire net d'impôt (si >= 100 000 FCFA)
    const sumRetPreFsp = lines.reduce((sum, l) => sum + (l.retenue || 0), 0);
    const netPreFsp = Math.max(0, brut - sumRetPreFsp);
    let fspVal = (netPreFsp >= 100000) ? Math.round(netPreFsp * 0.01) : 0;
    if (b.retenueFSP !== undefined && b.retenueFSP > 0 && Math.abs(b.retenueFSP - fspVal) < 100) {
      fspVal = b.retenueFSP;
    }
    b.retenueFSP = fspVal;
    if (fspVal > 0) {
      lines.push({
        name: 'RETENUE FONDS DE SOUTIEN PATRIOTIQUE (FSP)',
        retenue: fspVal
      });
    }

    // Précomptes & Avances
    if (b.precomptesDetails && b.precomptesDetails.length > 0) {
      b.precomptesDetails.forEach((pr: any) => {
        if (pr.montant > 0) {
          lines.push({
            name: (pr.name || pr.libelle || 'PRÉCOMPTE / RETENUE').toUpperCase(),
            retenue: pr.montant
          });
        }
      });
    } else {
      const totPrec = b.totalPrecomptes || b.avanceSurSolde || b.precompteAvance || 0;
      if (totPrec > 0) {
        lines.push({
          name: 'PRÉCOMPTES & AVANCES SUR SALAIRE',
          retenue: totPrec
        });
      }
    }

    b.lines = lines;

    // SYNCHRONISATION ABSOLUE : Le total des avoirs et le total des retenues sont TOUJOURS la somme exacte des lignes
    const totGains = lines.reduce((acc, l) => acc + (l.gain || 0), 0);
    const totRets = lines.reduce((acc, l) => acc + (l.retenue || 0), 0);

    b.salaireBrut = totGains;
    b.totalRetenues = totRets;
    b.salaireNet = totGains - totRets;

    // Charges Patronales : uniquement le régime pertinent
    if (isCarfo) {
      b.partPatronaleCarfo = Math.round(sBase * 0.14);
      b.partPatronaleCnss = 0;
    } else {
      b.partPatronaleCnss = Math.round(brut * 0.16);
      b.partPatronaleCarfo = 0;
    }
    b.partPatronaleCrrae = Math.round(sBase * 0.06);
    b.totalRetenuesPatronales = (isCarfo ? b.partPatronaleCarfo : b.partPatronaleCnss) + b.partPatronaleCrrae;

    // Montant en toutes lettres
    b.montantEnLettres = numberToFrenchWords(Math.round(b.salaireNet || 0));

    // Mode de règlement et compte
    b.modeReglement = b.modePaiement || 'Virement bancaire / BPBF';
    b.numeroCompteBancaire = b.iban || (b.employee ? b.employee.iban : '—');
    b.code = b.code || `SLIP/${b.anneeCode || '2026'}/${b.moisCode || '08'}-${b.matricule || '001'}`;

    return b;
  }

  imprimerBulletin(bulletin?: any): void {
    const raw = bulletin || this.selectedBulletin;
    if (!raw) return;
    const enriched = this.enrichSelectedBulletinLines(raw);

    const printWin = window.open('', '_blank', 'width=1000,height=1200');
    if (!printWin) {
      alert('Veuillez autoriser les fenêtres pop-up pour imprimer le bulletin.');
      return;
    }

    const fmt = (n: number | undefined) => {
      if (n === undefined || n === null) return '0';
      return Math.round(n).toLocaleString('fr-FR');
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Bulletin de Paie - ${enriched.employeeName}</title>
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 11px; }
          .header-box { display: flex; justify-content: space-between; border-bottom: 2px solid #0060B3; padding-bottom: 8px; margin-bottom: 10px; }
          .brand-logo { font-size: 18px; font-weight: 800; color: #0060B3; }
          .sub-brand { font-size: 10px; color: #64748b; }
          .doc-title { text-align: right; }
          .doc-title h1 { font-size: 16px; margin: 0; }
          .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 10.5px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          .table-lines { border: 1.5px solid #000; margin-bottom: 0; }
          .table-lines th { background: #e5e7eb; color: #000; border: 1px solid #000; padding: 6px 10px; font-weight: 700; font-size: 11px; text-transform: uppercase; }
          .table-lines td { border: 1px solid #000; padding: 5px 10px; font-size: 11px; }
          .table-recap { border: 1.5px solid #000; border-top: none; margin-top: -1px; margin-bottom: 12px; }
          .table-recap th { background: #e5e7eb; color: #000; border: 1px solid #000; padding: 5px 8px; font-size: 10.5px; font-weight: 700; text-align: center; }
          .table-recap td { border: 1px solid #000; padding: 5px 8px; font-size: 11px; }
          .cell-blank { border: none !important; background: transparent !important; }
          .right { text-align: right; }
          .bold { font-weight: 700; }
          .net-hdr { background: #cbd5e1 !important; font-weight: 800; text-align: right !important; }
          .net-val { font-size: 13px; font-weight: 900; color: #000; }
          .in-words { margin-top: 10px; padding: 8px; background: #f8fafc; border-left: 3px solid #0060B3; font-style: italic; }
          .footer-sign { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 25px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div>
            <div class="brand-logo">BANQUE POSTALE DU BURKINA FASO</div>
            <div class="sub-brand">01 BP 600 Ouagadougou 01 - N° IFU : 00012345Z - N° CNSS : 45892-A</div>
          </div>
          <div class="doc-title">
            <h1>BULLETIN DE PAIE</h1>
            <div style="color: #0060B3; font-weight: 700;">Réf : ${enriched.code}</div>
            <div style="font-size: 10px; color: #64748b;">Période : ${enriched.periodeTexte || enriched.mois || this.periode}</div>
          </div>
        </div>

        <div class="grid-info">
          <div>
            <div class="info-row"><span>Salarié :</span> <strong>${enriched.employeeName}</strong></div>
            <div class="info-row"><span>Matricule :</span> <strong>${enriched.matricule}</strong></div>
            <div class="info-row"><span>Fonction :</span> <strong>${enriched.fonction}</strong></div>
          </div>
          <div>
            <div class="info-row"><span>Compte Bancaire :</span> <strong>${enriched.numeroCompteBancaire}</strong></div>
            <div class="info-row"><span>Règlement :</span> <strong>${enriched.modeReglement}</strong></div>
            <div class="info-row"><span>Charges Famille :</span> <strong>${enriched.nombreCharges || 0} charge(s)</strong></div>
          </div>
        </div>

        <table class="table-lines" style="table-layout: fixed; width: 100%;">
          <colgroup>
            <col style="width: 32%;">
            <col style="width: 26%;">
            <col style="width: 21%;">
            <col style="width: 21%;">
          </colgroup>
          <thead>
            <tr>
              <th colspan="2" style="text-align: left;">ÉLÉMENTS DE PAIE</th>
              <th style="text-align: right;">AVOIRS</th>
              <th style="text-align: right;">RETENUES</th>
            </tr>
          </thead>
          <tbody>
            ${(enriched.lines || []).map((l: any) => `
              <tr>
                <td colspan="2" style="font-weight: 600;">${l.name}</td>
                <td class="right">${l.gain ? fmt(l.gain) : ''}</td>
                <td class="right">${l.retenue ? fmt(l.retenue) : ''}</td>
              </tr>
            `).join('')}
            <!-- Ligne 1 recap : Headers -->
            <tr style="background: #dcdcdc;">
              <th style="border: 1px solid #000; padding: 5px 8px; font-size: 10.5px; text-align: center;">MODE DE PAIEMENT</th>
              <th style="border: 1px solid #000; padding: 5px 8px; font-size: 10.5px; text-align: center;">BASE IMPOSABLE</th>
              <th style="border: 1px solid #000; padding: 5px 8px; font-size: 10.5px; text-align: center;">TOTAL DES AVOIRS</th>
              <th style="border: 1px solid #000; padding: 5px 8px; font-size: 10.5px; text-align: center;">TOTAL DES RETENUES</th>
            </tr>
            <!-- Ligne 1 recap : Valeurs -->
            <tr>
              <td style="border: 1px solid #000;">${enriched.modeReglement || 'Virement'}</td>
              <td class="right" style="border: 1px solid #000;">${fmt(enriched.baseImposable)}</td>
              <td class="right bold" style="border: 1px solid #000;">${fmt(enriched.salaireBrut)}</td>
              <td class="right bold" style="border: 1px solid #000;">${fmt(enriched.totalRetenues)}</td>
            </tr>
            <!-- Ligne 2 recap : Headers -->
            <tr style="background: #dcdcdc;">
              <td class="cell-blank" style="border: none;"></td>
              <th style="border: 1px solid #000; padding: 5px 8px; font-size: 10.5px; text-align: center;">RAP PART PATRONAL</th>
              <th style="border: 1px solid #000; padding: 5px 8px; font-size: 10.5px; text-align: center;">PART PATRONALE</th>
              <th class="net-hdr" style="border: 1px solid #000; padding: 5px 8px; font-size: 10.5px;">NET A PAYER</th>
            </tr>
            <!-- Ligne 2 recap : Valeurs -->
            <tr>
              <td class="cell-blank" style="border: none;"></td>
              <td class="right" style="border: 1px solid #000;"></td>
              <td class="right bold" style="border: 1px solid #000;">${fmt(enriched.totalRetenuesPatronales || enriched.partPatronaleCnss || 0)}</td>
              <td class="right net-val" style="border: 1px solid #000;">${fmt(enriched.salaireNet)}</td>
            </tr>
          </tbody>
        </table>

        <div class="in-words">
          <strong>Net à Payer en toutes lettres :</strong> ${enriched.montantEnLettres}
        </div>

        <div class="footer-sign">
          <div>Direction Générale (BPBF)</div>
          <div>Signature du Salarié</div>
        </div>

        <script>
          window.onload = function() { setTimeout(() => window.print(), 300); }
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  }

  imprimerRegistrePaie(): void {
    if (!this.bulletins || this.bulletins.length === 0) {
      alert('Aucun bulletin disponible pour générer le registre de paie.');
      return;
    }

    const printWin = window.open('', '_blank', 'width=1200,height=900');
    if (!printWin) {
      alert('Veuillez autoriser les fenêtres pop-up pour imprimer le registre de paie.');
      return;
    }

    const formatMoney = (n: number) => {
      const val = Math.round(n || 0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const isBrouillon = !this.sessionEstValidee && !this.sessionCloturee;

    // Totaux généraux
    const totBase = this.bulletins.reduce((s, b) => s + (b.salaireBase || 0), 0);
    const totIndem = this.bulletins.reduce((s, b) => s + (b.totalIndemnites || 0), 0);
    const totBrut = this.bulletins.reduce((s, b) => s + (b.salaireBrut || (b.salaireBase + b.totalIndemnites)), 0);
    const totCnssAgent = this.bulletins.reduce((s, b) => s + (b.cotisationCNSS || b.cotisationCnssAgent || 0), 0);
    const totCnssPatronale = this.bulletins.reduce((s, b) => s + (b.chargesPatronales || b.cotisationCnssPatronale || 0), 0);
    const totBaseImposable = this.bulletins.reduce((s, b) => s + (b.baseImposable || 0), 0);
    const totIuts = this.bulletins.reduce((s, b) => s + (b.impotIUTS || b.iuts || 0), 0);
    const totNet = this.bulletins.reduce((s, b) => s + (b.salaireNet || 0), 0);
    const totRetenues = this.bulletins.reduce((s, b) => s + (b.totalPrecomptes || b.totalRetenuesDiverses || 0), 0);
    const totTotalRetenues = this.bulletins.reduce((s, b) => s + (b.totalRetenues || ((b.cotisationCNSS || 0) + (b.impotIUTS || 0) + (b.totalPrecomptes || 0))), 0);
    const totNetAPayer = this.bulletins.reduce((s, b) => s + (b.netAPayer || 0), 0);

    const rowsHtml = this.bulletins.map((b, idx) => {
      const matricule = b.matricule || `000${idx + 1}`;
      const nomPrenoms = b.employeeName || (b.nom && b.prenom ? `${b.nom} ${b.prenom}` : 'Collaborateur');
      const grade = b.grade || b.echelon || b.categorie || 'C1E01';
      const salBase = b.salaireBase || 0;
      const indemPrimes = b.totalIndemnites || 0;
      const totalBrut = b.salaireBrut || (salBase + indemPrimes);
      const assVieillesse = b.cotisationCNSS || b.cotisationCnssAgent || 0;
      const partPatronale = b.chargesPatronales || b.cotisationCnssPatronale || 0;
      const baseImposable = b.baseImposable || 0;
      const chrg = b.chargesFamille || b.nombreCharges || 0;
      const iuts = b.impotIUTS || b.iuts || 0;
      const salNet = b.salaireNet || (totalBrut - assVieillesse - iuts);
      const retenues = b.totalPrecomptes || b.totalRetenuesDiverses || 0;
      const totalRet = b.totalRetenues || (assVieillesse + iuts + retenues);
      const netAPayer = b.netAPayer || (totalBrut - totalRet);

      return `
        <tr>
          <td style="text-align: center; font-family: monospace;">${matricule}</td>
          <td style="font-weight: 600; text-align: left; padding-left: 6px;">${nomPrenoms}</td>
          <td style="text-align: center; font-family: monospace;">${grade}</td>
          <td style="text-align: right; font-family: monospace;">${formatMoney(salBase)}</td>
          <td style="text-align: right; font-family: monospace;">${formatMoney(indemPrimes)}</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700;">${formatMoney(totalBrut)}</td>
          <td style="text-align: right; font-family: monospace;">${formatMoney(assVieillesse)}</td>
          <td style="text-align: right; font-family: monospace;">${formatMoney(partPatronale)}</td>
          <td style="text-align: right; font-family: monospace;">${formatMoney(baseImposable)}</td>
          <td style="text-align: center; font-weight: 700;">${chrg > 0 ? chrg : ''}</td>
          <td style="text-align: right; font-family: monospace;">${formatMoney(iuts)}</td>
          <td style="text-align: right; font-family: monospace; font-weight: 600;">${formatMoney(salNet)}</td>
          <td style="text-align: right; font-family: monospace;">${retenues > 0 ? formatMoney(retenues) : ''}</td>
          <td style="text-align: right; font-family: monospace; font-weight: 600;">${formatMoney(totalRet)}</td>
          <td style="text-align: right; font-family: monospace; font-weight: 800; background: #f8fafc;">${formatMoney(netAPayer)}</td>
          <td style="text-align: center; color: #64748b; font-size: 10px;">${idx + 1}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>REGISTRE DE PAIE - ${this.periode}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 8mm 8mm 8mm 8mm;
          }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 4px;
            font-size: 10px;
          }
          .header-table {
            width: 100%;
            margin-bottom: 8px;
            border-collapse: collapse;
          }
          .company-info {
            font-size: 10.5px;
            font-weight: 700;
            color: #000000;
          }
          .brouillon-stamp {
            color: #dc2626;
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 2px;
            border: 2px solid #dc2626;
            padding: 2px 10px;
            display: inline-block;
            transform: rotate(-5deg);
          }
          .doc-title {
            text-align: center;
            font-size: 16px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #000000;
          }
          .period-info {
            text-align: right;
            font-size: 11px;
            font-weight: 700;
          }
          .registre-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5px;
          }
          .registre-table th {
            border: 1px solid #334155;
            background: #f1f5f9;
            padding: 5px 3px;
            font-size: 9px;
            text-align: center;
            font-weight: 700;
            color: #0f172a;
          }
          .registre-table td {
            border: 1px solid #cbd5e1;
            padding: 4px 3px;
            vertical-align: middle;
          }
          .registre-table tr:nth-child(even) {
            background: #fafafa;
          }
          .total-row td {
            border-top: 2px solid #000000 !important;
            border-bottom: 2px solid #000000 !important;
            background: #e2e8f0 !important;
            font-weight: 800 !important;
            font-size: 9.5px;
            padding: 6px 3px;
          }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td style="width: 25%; vertical-align: top;">
              <div class="company-info">BANQUE DES PRETS DU BURKINA FASO (BPBF)</div>
              <div style="font-size: 9px; color: #475569;">02 BP 5299 Ouagadougou 02</div>
            </td>
            <td style="width: 20%; text-align: center; vertical-align: middle;">
              ${isBrouillon ? '<div class="brouillon-stamp">BROUILLON</div>' : '<div style="color: #059669; font-weight: 800; font-size: 13px; border: 2px solid #059669; padding: 2px 8px; display: inline-block;">SESSION VALIDÉE</div>'}
            </td>
            <td style="width: 30%; text-align: center; vertical-align: middle;">
              <div class="doc-title">REGISTRE DE PAIE</div>
            </td>
            <td style="width: 25%; vertical-align: top;" class="period-info">
              <div>PERIODE : ${this.periode.toUpperCase()}</div>
              <div>[ ${this.sessionType || 'ORDINAIRE'} ]</div>
              <div style="font-size: 9.5px; color: #475569; font-weight: normal;">Page 1 sur 1</div>
            </td>
          </tr>
        </table>

        <table class="registre-table">
          <thead>
            <tr>
              <th style="width: 45px;">Matricule</th>
              <th style="width: 140px;">Nom et Prénoms</th>
              <th style="width: 45px;">Grade</th>
              <th style="width: 65px;">Salaire<br>de base</th>
              <th style="width: 65px;">Indemnités<br>et primes</th>
              <th style="width: 70px;">Total brut</th>
              <th style="width: 60px;">Assurance<br>vieillesse</th>
              <th style="width: 60px;">Part<br>patronale</th>
              <th style="width: 65px;">Base<br>imposable</th>
              <th style="width: 30px;">Chrg</th>
              <th style="width: 55px;">IUTS</th>
              <th style="width: 65px;">Salaire<br>net</th>
              <th style="width: 55px;">Retenues</th>
              <th style="width: 65px;">Total<br>retenues</th>
              <th style="width: 70px;">Net à<br>payer</th>
              <th style="width: 20px;">N°</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
            <tr class="total-row">
              <td colspan="3" style="text-align: center;">TOTAUX GÉNÉRAUX (${this.bulletins.length} salariés)</td>
              <td style="text-align: right; font-family: monospace;">${formatMoney(totBase)}</td>
              <td style="text-align: right; font-family: monospace;">${formatMoney(totIndem)}</td>
              <td style="text-align: right; font-family: monospace;">${formatMoney(totBrut)}</td>
              <td style="text-align: right; font-family: monospace;">${formatMoney(totCnssAgent)}</td>
              <td style="text-align: right; font-family: monospace;">${formatMoney(totCnssPatronale)}</td>
              <td style="text-align: right; font-family: monospace;">${formatMoney(totBaseImposable)}</td>
              <td style="text-align: center;">—</td>
              <td style="text-align: right; font-family: monospace;">${formatMoney(totIuts)}</td>
              <td style="text-align: right; font-family: monospace;">${formatMoney(totNet)}</td>
              <td style="text-align: right; font-family: monospace;">${formatMoney(totRetenues)}</td>
              <td style="text-align: right; font-family: monospace;">${formatMoney(totTotalRetenues)}</td>
              <td style="text-align: right; font-family: monospace; font-size: 10.5px;">${formatMoney(totNetAPayer)}</td>
              <td style="text-align: center;">—</td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; margin-top: 18px; font-size: 10px; font-weight: 700;">
          <div style="text-align: center; width: 220px; border-top: 1px dashed #000; padding-top: 4px;">
            Le Gestionnaire de Paie
          </div>
          <div style="text-align: center; width: 220px; border-top: 1px dashed #000; padding-top: 4px;">
            Le Chef de Département RH
          </div>
          <div style="text-align: center; width: 220px; border-top: 1px dashed #000; padding-top: 4px;">
            La Direction Générale
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  }
}
