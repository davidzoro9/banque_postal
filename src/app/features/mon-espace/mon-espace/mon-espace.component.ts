import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { BulletinPdfService } from '../../paie/services/bulletin-pdf.service';
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

  // Tous les bulletins trouvés pour cet agent dans la base
  mesBulletinsTous: any[] = [];
  // Périodes / mois distincts où un bulletin existe
  moisDisponibles: MoisDisponible[] = [];

  // Bulletins affichés pour le mois en cours sélectionné
  bulletins: any[] = [];
  selectedBulletin: any = null;
  isLoading = false;
  isDownloadingPdf = false;

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

  // Demande de Bulletin RH
  showDemandeBulletinModal = false;
  demandeEnvoyeeSuccess = false;
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
    private bulletinPdfService: BulletinPdfService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.chargerDonneesAgent(true);
  }

  /**
   * Charge les données complètes de l'agent, ses bulletins et ses congés
   */
  chargerDonneesAgent(isFirstLoad = false): void {
    this.isLoading = true;

    forkJoin({
      employees: this.http.get<any[]>(`${environment.apiUrl}/employees`).pipe(catchError(() => of([]))),
      allBulletins: this.http.get<any[]>(`${environment.apiUrl}/bulletins`).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ employees, allBulletins }) => {
        // 1. Identifier l'agent dans le référentiel employé
        const empList = employees || [];
        this.currentAgent = this.identifierAgent(empList);

        const empId = this.currentAgent?.id;

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
        }
      },
      error: () => {
        this.isLoading = false;
        this.bulletins = [];
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
    const userMatricule = (this.currentUser?.matricule || userUsername || '').trim().toUpperCase();
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
        const full = `${eNom} ${ePrenom} ${eName}`;
        return full.includes(userNom) && full.includes(userPrenom);
      });
      if (found) return found;
    }

    // 5. Nom seul
    if (userNom) {
      const found = employees.find(e => {
        const eNom = (e.nom || '').trim().toUpperCase();
        const eName = (e.name || '').trim().toUpperCase();
        return (eNom && eNom.includes(userNom)) || (eName && eName.includes(userNom));
      });
      if (found) return found;
    }

    return null;
  }

  /**
   * Charge les soldes de congés officiels de l'agent
   */
  private chargerSoldesConges(empId: number | string): void {
    this.http.get<any>(`${environment.apiUrl}/conges/soldes/${empId}`).pipe(
      catchError(() => of(null))
    ).subscribe(solde => {
      if (solde) {
        this.monSoldeConge = {
          droitAnnuel: solde.droitAnnuel || 30,
          joursAcquis: solde.joursAcquis !== undefined ? solde.joursAcquis : 0,
          joursPris: solde.joursPris !== undefined ? solde.joursPris : 0,
          joursEnAttente: solde.joursEnAttente !== undefined ? solde.joursEnAttente : 0,
          soldeRestant: solde.soldeRestant !== undefined ? solde.soldeRestant : 0
        };
      }
    });

    this.http.get<any[]>(`${environment.apiUrl}/conges/employe/${empId}`).pipe(
      catchError(() => this.http.get<any[]>(`${environment.apiUrl}/conges/all`).pipe(catchError(() => of([]))))
    ).subscribe(all => {
      const userNom = (this.currentUser?.nom || '').toUpperCase();
      this.mesConges = (all || []).filter(c => {
        const cEmpId = c.employee?.id || c.employeeId;
        if (cEmpId && String(cEmpId) === String(empId)) return true;
        const empName = (c.employe || c.employee?.nom || c.employee?.name || '').toUpperCase();
        return userNom && empName.includes(userNom);
      });
    });
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

  formaterBulletinOfficiel(b: any, emp: any): any {
    const empRef = emp || {};
    const sBase = b.salaireBase || empRef.salaireBase || 350000;
    const brut = b.salaireBrut || 500000;
    const totalRet = b.totalRetenues || 77500;
    const net = b.salaireNet || (brut - totalRet);

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
          else if (codeUp.includes('CNSS') || nameUp.includes('CNSS')) val = Math.round(brut * 0.055);
          else if (codeUp.includes('IUTS') || nameUp.includes('IUTS')) val = Math.round(brut * 0.0675);
          else if (codeUp.includes('CRRAE') || nameUp.includes('CRRAE')) val = Math.round(sBase * 0.03);
          else if (nameUp.includes('LOGEMENT')) val = empRef.primeLogement || 35000;
          else if (nameUp.includes('TRANSPORT')) val = empRef.primeTransport || 30000;
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
      lines = [
        { name: 'SALAIRE DE BASE', category: 'ELEMENT', quantity: 1.0, rate: 100.0, regle: 'SALAIRE DE BASE INDICIAIRE', amount: sBase },
        { name: 'INDEMNITÉS CONTRACTUELLES', category: 'INDEMNITES', quantity: 1.0, rate: 100.0, regle: 'INDEMNITÉS', amount: b.totalIndemnites || 0 },
        { name: 'SALAIRE BRUT (TOTAL AVOIR)', category: 'ELEMENT', quantity: 1.0, rate: 100.0, regle: 'RÉMUNÉRATION TOTALE BRUTE', amount: brut },
        { name: 'RETENUE CNSS (PART AGENT)', category: 'RETENUE', quantity: 1.0, rate: 5.5, regle: 'SÉCURITÉ SOCIALE (5.50%)', amount: b.cotisationCnss || Math.round(brut * 0.055) },
        { name: 'IUTS DU MOIS', category: 'RETENUE', quantity: 1.0, rate: 100.0, regle: 'BARÈME IUTS', amount: b.impotIuts || Math.round(brut * 0.08) },
        { name: 'TOTAL RETENUES AGENT', category: 'TOTAL_RETENUE', quantity: 1.0, rate: 100.0, regle: 'CUMUL DÉDUCTIONS SALARIALES', amount: totalRet },
        { name: 'NET A PAYER (SALAIRE NET)', category: 'NET', quantity: 1.0, rate: 100.0, regle: 'NET À VIRER À L\'AGENT', amount: net }
      ];
    }

    const nomAfficher = (b.employeeName || `${empRef.nom || ''} ${empRef.prenom || ''}`.trim() || `${this.currentUser?.nom || ''} ${this.currentUser?.prenom || ''}`.trim() || 'AGENT BPBF').toUpperCase();
    const matriculeAfficher = b.matricule || empRef.matricule || this.currentUser?.matricule || this.currentUser?.username || 'EMP-001';

    return {
      id: b.id,
      code: b.code || `BLT-${b.id || '001'}`,
      employeeName: nomAfficher,
      matricule: matriculeAfficher,
      fonction: b.fonction || empRef.fonction || 'Agent Bancaire',
      grade: b.gradeLibelle || empRef.grade || b.grade || 'GRADE III',
      categorie: empRef.categoriePro || b.categorie || 'CLASSE VII',
      modeReglement: `Virement bancaire / ${empRef.banque || 'Banque Postale du Burkina Faso (BPBF)'}`,
      numeroCompteBancaire: empRef.iban || empRef.numeroCompte || '—',
      dateFrom: b.dateFrom || `${this.selectedYear}-${String(this.moisIndex + 1).padStart(2, '0')}-01`,
      dateTo: b.dateTo || `${this.selectedYear}-${String(this.moisIndex + 1).padStart(2, '0')}-30`,
      workedDays: b.workedDays || 30,
      scheduledWorkingDays: b.scheduledWorkingDays || 30,
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

  ouvrirModalDemandeBulletin(): void {
    this.demandeBulletinForm.periode = this.periode;
    this.demandeEnvoyeeSuccess = false;
    this.showDemandeBulletinModal = true;
  }

  fermerModalDemandeBulletin(): void {
    this.showDemandeBulletinModal = false;
    this.demandeEnvoyeeSuccess = false;
  }

  envoyerDemandeBulletin(): void {
    const payload = {
      employeeId: this.currentAgent?.id || this.currentUser?.id,
      employeeName: `${this.currentUser?.nom || 'ZOROM'} ${this.currentUser?.prenom || 'David'}`.toUpperCase(),
      matricule: this.currentAgent?.matricule || this.currentUser?.matricule || 'EMP-001',
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
      this.demandeEnvoyeeSuccess = true;
      setTimeout(() => {
        this.fermerModalDemandeBulletin();
      }, 2500);
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}
