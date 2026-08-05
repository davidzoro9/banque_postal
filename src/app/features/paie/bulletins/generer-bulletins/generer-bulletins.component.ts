import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { EmployeeService } from '../../../grh/employes/services/employee.service';
import { Employee } from '../../../grh/employes/models/employee.model';
import { calculateOfficialIUTS, computeEmployeeFamilyCharges } from '../../../../core/utils/iuts-calculator.utils';
import { DbRefService } from '../../../donnees-base/services/db-ref.service';

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
      const calculated = employeeList.map(emp => this.buildBulletinFromEmployee(emp));
      this.bulletins = this.adapterBulletinsSelonSession(calculated);
      this.restaurerSessionState();
      this.isCalculating = false;
      return;
    }

    this.employeeService.getAll().subscribe(employees => {
      const list = (employees && employees.length > 0) ? employees : [];
      const calculated = list.map(emp => this.buildBulletinFromEmployee(emp));
      this.bulletins = this.adapterBulletinsSelonSession(calculated);
      this.restaurerSessionState();
      this.isCalculating = false;
    });
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

  private buildBulletinFromEmployee(emp: Employee): any {
    const sBase = emp.salaireBase || 150000;
    const pLog = emp.primeLogement || 0;
    const pTrans = emp.primeTransport || 0;
    const pResp = emp.primeResponsabilite || 0;

    const indemnitesList: Array<{ libelle: string; montant: number }> = [];
    if (pLog > 0) indemnitesList.push({ libelle: 'Indemnité de Logement', montant: pLog });
    if (pTrans > 0) indemnitesList.push({ libelle: 'Indemnité de Transport', montant: pTrans });
    if (pResp > 0) indemnitesList.push({ libelle: 'Indemnité de Responsabilité', montant: pResp });

    if (emp.autresIndemnites && emp.autresIndemnites.length > 0) {
      emp.autresIndemnites.forEach(ai => {
        if (ai.montant > 0) indemnitesList.push({ libelle: ai.libelle, montant: ai.montant });
      });
    }

    const pecParams = this.dbRefService ? this.dbRefService.getParamPriseEnCharge() : undefined;
    const nCharges = computeEmployeeFamilyCharges(emp, pecParams);
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
      matricule: emp.matricule,
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
      indemnitesDetails: indemnitesList.map(i => ({ typeIndemnite: i.libelle, montant: i.montant }))
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
