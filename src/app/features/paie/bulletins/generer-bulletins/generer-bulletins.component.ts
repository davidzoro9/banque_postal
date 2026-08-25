import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { EmployeeService } from '../../../grh/employes/services/employee.service';
import { Employee } from '../../../grh/employes/models/employee.model';
import { calculateOfficialIUTS, computeEmployeeFamilyCharges } from '../../../../core/utils/iuts-calculator.utils';
import { DbRefService } from '../../../donnees-base/services/db-ref.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-generer-bulletins',
  templateUrl: './generer-bulletins.component.html',
  styleUrls: ['./generer-bulletins.component.scss'],
  standalone: false
})
export class GenererBulletinsComponent implements OnInit {
  moisListe = [
    'Janvier 2026', 'Février 2026', 'Mars 2026', 'Avril 2026',
    'Mai 2026', 'Juin 2026', 'Juillet 2026', 'Août 2026',
    'Septembre 2026', 'Octobre 2026', 'Novembre 2026', 'Décembre 2026'
  ];
  moisIndex = 6; // Juillet 2026
  periode = 'Juillet 2026';
  
  sessionType: 'ORDINAIRE' | 'EXTRAORDINAIRE' = 'ORDINAIRE';
  modeComparatifMminus1 = false;

  // === WORKFLOW DE VALIDATION ===
  // GENERE -> EN_ATTENTE_VALIDATION -> VALIDE -> CLOTURE
  etatSession: 'OUVERTE' | 'CLOTUREE' = 'OUVERTE';
  
  isCalculating = false;
  bulletins: any[] = [];
  selectedBulletin: any = null;

  get nbrGeneres(): number { return this.bulletins.filter(b => b.etat === 'GENERE').length; }
  get nbrValides(): number { return this.bulletins.filter(b => b.etat === 'VALIDE').length; }
  get tousValides(): boolean { return this.bulletins.length > 0 && this.bulletins.every(b => b.etat === 'VALIDE' || b.etat === 'CLOTURE'); }
  get sessionCloturee(): boolean { return this.etatSession === 'CLOTUREE'; }

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.lancerCalculPaie();

    // S'abonner aux mises à jour automatiques des employés (ex: ajout enfant, conjoint, changement salaire)
    this.employeeService.employees$.subscribe(list => {
      if (list && list.length > 0) {
        this.genererBulletinsDepuisEmployees(list);
      }
    });

    // S'abonner aux mises à jour automatiques des données de référence (Grille, Indemnités, Prise en charge)
    this.dbRefService.refChanges$.subscribe(() => {
      this.genererBulletinsDepuisEmployees();
    });
  }

  changerMois(delta: number): void {
    this.moisIndex += delta;
    if (this.moisIndex < 0) this.moisIndex = 0;
    if (this.moisIndex >= this.moisListe.length) this.moisIndex = this.moisListe.length - 1;
    this.periode = this.moisListe[this.moisIndex];
    this.lancerCalculPaie();
  }

  changerSession(type: 'ORDINAIRE' | 'EXTRAORDINAIRE'): void {
    this.sessionType = type;
    this.lancerCalculPaie();
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

    forkJoin(employees.map(emp => 
      this.employeeService.getSalaryInformation(String(emp.id)).pipe(
        catchError(() => of(null))
      )
    )).subscribe(infoDtos => {
      forkJoin(employees.map(emp => this.employeeService.getFamily(String(emp.id)).pipe(
        catchError(() => of(undefined))
      ))).subscribe(familles => {
        const calculated = employees.map((emp, index) => {
          return this.mapBulletinFromInfoDtoOrEmployee(emp, infoDtos[index], familles[index]);
        });
        this.bulletins = this.adapterBulletinsSelonSession(calculated);
        this.restaurerSessionState();
        this.isCalculating = false;
      });
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

  private mapBulletinFromInfoDtoOrEmployee(emp: Employee, infoDto: any, famille?: any): any {
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
      : (emp.salaireBase || 95945);

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

    const totIndem = rawIndemnites.reduce((acc: number, item: any) => acc + item.montant, 0);
    const brut = sBase + totIndem;

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

    // Retenues salariales Agent
    const cotisationCarfoAgent = Math.round(sBase * 0.08);
    const cotisationCnssAgent = Math.round(brut * 0.055);
    const cotisationCrraeAgent = Math.round(sBase * 0.03);
    const impotIUTS = calc.iutsNet || 0;
    const retenueFSP = calc.fondsSoutienPat || Math.round(baseImposable * 0.01);
    const avanceSurSolde = 0;
    const totalRetenuesAgent = cotisationCarfoAgent + cotisationCrraeAgent + impotIUTS + retenueFSP + avanceSurSolde;

    // Retenues patronales Employeur
    const partPatronaleCarfo = Math.round(sBase * 0.14);
    const partPatronaleCnss = Math.round(brut * 0.16);
    const partPatronaleCrrae = Math.round(sBase * 0.06);
    const totalRetenuesPatronales = partPatronaleCarfo + partPatronaleCnss + partPatronaleCrrae;

    const salaireNet = brut - totalRetenuesAgent;

    return {
      employeeId: emp.id,
      employeeName: `${emp.nom || ''} ${emp.prenom || ''}`.trim().toUpperCase() || 'COLLABORATEUR',
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
      avanceSurSolde,
      totalRetenues: totalRetenuesAgent,
      partPatronaleCarfo,
      partPatronaleCnss,
      partPatronaleCrrae,
      totalRetenuesPatronales,
      salaireNet,
      nombreCharges: nCharges,
      banque: (infoDto && infoDto.banque) || 'BANQUE POSTALE DU BURKINA FASO - BPBF',
      iban: (infoDto && infoDto.iban) || 'BF056 01001 505511059401',
      modePaiement: (infoDto && infoDto.modePaiement) || 'Virement bancaire'
    };
  }

  private computeGradeCode(emp: any): string {
    if (emp.grade && emp.grade !== 'Grade I' && emp.grade !== 'GRADE I' && emp.grade.includes('E')) {
      return emp.grade;
    }
    let cat = (emp.categoriePro || emp.categorie || 'C1').toUpperCase().trim();
    if (cat.includes('CLASSE VIII') || cat.includes('CL8') || cat === '8') cat = 'CL8';
    else if (cat.includes('CLASSE VII') || cat.includes('CL7') || cat === '7') cat = 'CL7';
    else if (cat.includes('CLASSE VI') || cat.includes('CL6') || cat === '6') cat = 'CL6';
    else if (cat.includes('CLASSE V') || cat.includes('CL5') || cat === '5') cat = 'C5';
    else if (cat.includes('CLASSE IV') || cat.includes('CL4') || cat === '4') cat = 'C4';
    else if (cat.includes('CLASSE III') || cat.includes('CL3') || cat === '3') cat = 'C3';
    else if (cat.includes('CLASSE II') || cat.includes('CL2') || cat === '2') cat = 'CL2';
    else if (cat.includes('CLASSE I') || cat.includes('CL1') || cat === '1') cat = 'CL1';
    else cat = cat.replace('CLASSE ', 'C').replace(/\s+/g, '');

    let ech = (emp.echelon || 'E01').toUpperCase().trim();
    const num = parseInt(ech.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      ech = num < 10 ? `E0${num}` : `E${num}`;
    } else {
      ech = 'E01';
    }

    return `${cat}${ech}`;
  }

  private buildBulletinFromEmployee(emp: Employee, famille?: Array<{ estCharge?: boolean }>): any {
    const sBase = emp.salaireBase || 95945;
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
      employeeName: `${emp.nom || ''} ${emp.prenom || ''}`.trim().toUpperCase() || 'COLLABORATEUR',
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

  private getKey(): string {
    return `paie_session_${this.periode}_${this.sessionType}`;
  }

  private sauvegarderSessionState(): void {
    try {
      const state = {
        etatSession: this.etatSession,
        bulletins: this.bulletins.map(b => ({
          employeeId: b.employeeId,
          etat: b.etat,
          dateValidation: b.dateValidation
        }))
      };
      localStorage.setItem(this.getKey(), JSON.stringify(state));
    } catch (e) {}
  }

  private restaurerSessionState(): void {
    try {
      const saved = localStorage.getItem(this.getKey());
      if (saved) {
        const parsed = JSON.parse(saved);
        this.etatSession = parsed.etatSession || 'OUVERTE';
        if (parsed.bulletins && Array.isArray(parsed.bulletins)) {
          parsed.bulletins.forEach((s: any) => {
            const match = this.bulletins.find(b => String(b.employeeId) === String(s.employeeId));
            if (match) {
              match.etat = s.etat;
              match.dateValidation = s.dateValidation;
            }
          });
        }
      } else {
        this.etatSession = 'OUVERTE';
      }
    } catch (e) {
      this.etatSession = 'OUVERTE';
    }
  }

  private adapterBulletinsSelonSession(list: any[]): any[] {
    return list.map(b => {
      let copy = JSON.parse(JSON.stringify(b));
      copy.mois = this.periode;
      copy.sessionType = this.sessionType;

      let baseSal = copy.salaireBase || 150000;
      let indemnites: Array<{typeIndemnite: string; montant: number}> = copy.indemnitesDetails || [];

      if (this.sessionType === 'EXTRAORDINAIRE') {
        indemnites.push({ typeIndemnite: 'Prime / Gratification Extraordinaire', montant: baseSal });
      }

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

      // État initial : GENERE (non encore validé par le RH)
      copy.etat = 'GENERE';
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
    this.sauvegarderSessionState();
  }

  refuserBulletin(b: any): void {
    if (this.sessionCloturee) return;
    b.etat = 'GENERE'; // Remet en attente pour correction
    b.dateValidation = null;
    this.sauvegarderSessionState();
  }

  cloturerSession(): void {
    if (!this.tousValides) {
      alert('Tous les bulletins doivent être validés avant la clôture de la session.');
      return;
    }
    if (confirm(`Confirmer la clôture définitive de la session de paie ${this.periode} ?\n\nAttention : Cette action est irréversible.`)) {
      this.bulletins.forEach(b => b.etat = 'CLOTURE');
      this.etatSession = 'CLOTUREE';
      this.sauvegarderSessionState();
    }
  }

  voirDetails(b: any): void {
    this.selectedBulletin = b;
  }

  fermerModal(): void {
    this.selectedBulletin = null;
  }

  imprimerBulletin(): void {
    window.print();
  }
}
