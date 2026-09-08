import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from '../../../grh/employes/services/employee.service';
import { Employee, EmployeeSalaryInformation, EmployeeIndemnity } from '../../../grh/employes/models/employee.model';
import { environment } from '../../../../../environments/environment';
import { calculateOfficialIUTS, computeEmployeeFamilyCharges } from '../../../../core/utils/iuts-calculator.utils';
import { catchError, map } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

export interface BulletinLineModel {
  code: string;
  name: string;
  category: 'ELEMENT' | 'INDEMNITES' | 'DEDUCTION' | 'BI' | 'RETENUE' | 'PRECOMPTE' | 'TOTAL_RETENUE' | 'CHARGES_PAT' | 'TOTAL_PAT' | 'NET' | string;
  quantity: number;
  rate: number;
  regle: string;
  baseCalcul?: number;
  gain?: number;
  retenue?: number;
  patronale?: number;
  amount: number;
}

export function formatStandardGrade(rawGrade?: string, rawCat?: string, rawEch?: string): string {
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

export interface BulletinIndividuelModel {
  id?: number;
  code: string;
  employeeId: number;
  employeeName: string;
  matricule: string;
  fonction: string;
  grade: string;
  categorie: string;
  typeSession: string;
  dateFrom: string;
  dateTo: string;
  scheduledWorkingDays: number;
  workedDays: number;
  salaireBase: number;
  totalIndemnites: number;
  totalAvoirs: number;
  totalPrecomptes?: number;
  precompteAvance?: number;
  primeExceptionnelle?: number;
  salaireBaseOriginal?: number;
  totalIndemnitesOriginal?: number;
  nombreHeuresSup?: number;
  heuresSup?: number;
  salaireBrut: number;
  cotisationCnss: number;
  cotisationCarfo: number;
  cotisationCrrae: number;
  baseImposable: number;
  brutCotisableCnss?: number;
  netImposable?: number;
  nombreCharges: number;
  impotIuts: number;
  retenueFsp: number;
  totalRetenues: number;
  totalCotisationsPatronales: number;
  totalRetenuesPatronales?: number;
  partPatronaleCnss?: number;
  coutTotalEmployeur?: number;
  salaireNet: number;
  montantEnLettres?: string;
  numeroCompteBancaire?: string;
  modeReglement?: string;
  statut: string;
  dateCalcul: string;
  lines: BulletinLineModel[];
}

export function numberToFrenchWords(n: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  if (n <= 0) return 'Zéro Francs CFA';

  function convertGroup(val: number): string {
    let res = '';
    const h = Math.floor(val / 100);
    const rem = val % 100;

    if (h > 0) {
      if (h === 1) res += 'cent ';
      else res += units[h] + ' cent' + (rem === 0 && h > 1 ? 's ' : ' ');
    }

    if (rem > 0) {
      if (rem < 20) {
        res += units[rem] + ' ';
      } else {
        const t = Math.floor(rem / 10);
        const u = rem % 10;
        if (t === 7) {
          res += 'soixante-' + (u === 1 ? 'et-onze ' : units[10 + u] + ' ');
        } else if (t === 9) {
          res += 'quatre-vingt-' + units[10 + u] + ' ';
        } else {
          if (u === 0) res += tens[t] + (t === 8 ? 's ' : ' ');
          else if (u === 1 && t !== 8) res += tens[t] + ' et un ';
          else res += tens[t] + '-' + units[u] + ' ';
        }
      }
    }
    return res.trim();
  }

  let num = Math.floor(n);
  let res = '';

  const millions = Math.floor(num / 1000000);
  num %= 1000000;
  const thousands = Math.floor(num / 1000);
  const remaining = num % 1000;

  if (millions > 0) {
    res += (millions === 1 ? 'un million ' : convertGroup(millions) + ' millions ');
  }
  if (thousands > 0) {
    res += (thousands === 1 ? 'mille ' : convertGroup(thousands) + ' mille ');
  }
  if (remaining > 0) {
    res += convertGroup(remaining) + ' ';
  }

  res = res.trim();
  if (res.length > 0) {
    res = res.charAt(0).toUpperCase() + res.slice(1) + ' Francs CFA';
  }
  return res;
}

@Component({
  selector: 'app-bulletin-individuel',
  templateUrl: './bulletin-individuel.component.html',
  styleUrls: ['./bulletin-individuel.component.scss'],
  standalone: false
})
export class BulletinIndividuelComponent implements OnInit {
  bulletinsList: BulletinIndividuelModel[] = [];
  filteredList: BulletinIndividuelModel[] = [];
  employeesList: Employee[] = [];

  searchQuery: string = '';
  statutFilter: string = '';

  showModal: boolean = false;
  selectedBulletin: BulletinIndividuelModel | null = null;
  agentSearchText: string = '';

  get filteredEmployeesForSelect(): Employee[] {
    if (!this.agentSearchText || !this.agentSearchText.trim()) {
      return this.employeesList;
    }
    const term = this.agentSearchText.trim().toLowerCase();
    return this.employeesList.filter(emp => 
      (emp.matricule && emp.matricule.toLowerCase().includes(term)) ||
      (emp.nom && emp.nom.toLowerCase().includes(term)) ||
      (emp.prenom && emp.prenom.toLowerCase().includes(term)) ||
      (emp.fonction && emp.fonction.toLowerCase().includes(term))
    );
  }

  formModel = {
    employeeId: null as number | null,
    typeSession: 'PAIE_NORMALE',
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    dateTo: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
    scheduledWorkingDays: 30,
    workedDays: 30
  };

  isCalculating: boolean = false;
  previewCalcul: BulletinIndividuelModel | null = null;
  selectedEmpForForm: Employee | null = null;

  empSalaryInfo: EmployeeSalaryInformation | null = null;
  empIndemnitesList: EmployeeIndemnity[] = [];
  empFamilyInfo: any[] = [];
  empAvoirs: any[] = [];
  empPrecomptes: any[] = [];
  empTropPercus: any[] = [];

  // Modal d'ajustement des variables individuelles
  showEditVariablesModal: boolean = false;
  selectedBulletinForEdit: BulletinIndividuelModel | null = null;
  editVariablesForm = {
    workedDays: 30,
    scheduledWorkingDays: 30,
    primeExceptionnelle: 0,
    heuresSup: 0,
    nombreHeuresSup: 0,
    precompteAvance: 0,
    motifAjustement: ''
  };

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadBulletins();
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (emps) => this.employeesList = emps || [],
      error: () => this.employeesList = []
    });
  }

  loadBulletins(): void {
    forkJoin({
      bulletins: this.http.get<any[]>(`${environment.apiUrl}/bulletins`).pipe(catchError(() => of([]))),
      avoirs: this.http.get<any[]>(`${environment.apiUrl}/avoirs`).pipe(catchError(() => of([]))),
      precomptes: this.http.get<any[]>(`${environment.apiUrl}/precomptes`).pipe(catchError(() => of([]))),
      tropPercus: this.http.get<any[]>(`${environment.apiUrl}/trop-percus`).pipe(catchError(() => of([])))
    }).subscribe(({ bulletins, avoirs, precomptes, tropPercus }) => {
      const allAvoirs = avoirs || [];
      const allPrecomptes = precomptes || [];
      const allTropPercus = tropPercus || [];

      if (bulletins && bulletins.length > 0) {
        this.bulletinsList = bulletins.map(b => {
          const empId = b.employeeId || ((b as any).employee ? (b as any).employee.id : 0);
          const empAvoirs = allAvoirs.filter((a: any) => 
            String(a.employeeId) === String(empId) && a.statut !== 'INACTIF' && a.statut !== 'SOLDE'
          );
          const empPrecs = allPrecomptes.filter((p: any) => 
            String(p.employeeId) === String(empId) && p.statut !== 'INACTIF' && p.statut !== 'SOLDE'
          );
          const empTrop = allTropPercus.filter((tp: any) =>
            String(tp.employeeId) === String(empId)
          );
          return this.enrichBulletinData(b, null, empAvoirs, empPrecs, empTrop);
        });
      } else {
        this.bulletinsList = [];
      }
      this.applyFilter();
    });
  }

  enrichBulletinData(b: any, liveSalaryInfo?: EmployeeSalaryInformation | null, empAvoirs?: any[], empPrecs?: any[], empTropPercus?: any[]): BulletinIndividuelModel {
    const empId = b.employeeId || ((b as any).employee ? (b as any).employee.id : 0);
    const emp = this.employeesList.find(e => String(e.id) === String(empId)) || (b as any).employee || null;

    let sBase = liveSalaryInfo?.salaireBase || b.salaireBase || (emp ? emp.salaireBase : null) || 0;
    let lines: BulletinLineModel[] = [];

    const isGratif = (b.typeSession || '').toUpperCase().includes('GRATIF') || 
                     (b.typeSession || '').toUpperCase().includes('13') ||
                     (b.typeSession || '').toUpperCase().includes('TREIZIEME');

    if (isGratif) {
      const montantGratif = sBase;
      const iban = liveSalaryInfo?.iban || (emp && emp.iban) || '—';
      const banque = liveSalaryInfo?.banque || (emp && emp.banque) || 'BPBF';
      const computedGrade = formatStandardGrade(emp ? emp.grade : b.grade, emp ? emp.categoriePro : b.categorie, emp ? emp.echelon : b.echelon);

      lines = [
        {
          code: 'GRAT_ANN',
          name: 'GRATIFICATION ANNUELLE (13ÈME MOIS)',
          category: 'ELEMENT',
          quantity: 1.0,
          rate: 100.0,
          regle: 'GRATIFICATION ANNUELLE CONVENTIONNELLE',
          amount: montantGratif,
          gain: montantGratif
        }
      ];

      return {
        id: b.id,
        code: b.code || b.numeroBulletin || `BLT-${b.id || '001'}`,
        employeeId: Number(empId) || 0,
        employeeName: (emp ? `${emp.nom || ''} ${emp.prenom || ''}`.trim() : (b.employeeName || 'AGENT')).toUpperCase(),
        matricule: (emp ? emp.matricule : (b.matricule || 'EMP-001')),
        fonction: (emp ? emp.fonction : (b.fonction || 'Agent')),
        grade: computedGrade,
        categorie: (emp ? (emp.categoriePro || 'CLASSE I') : (b.categorie || 'CLASSE I')),
        typeSession: 'GRATIFICATION',
        dateFrom: b.dateFrom || '2026-12-01',
        dateTo: b.dateTo || '2026-12-31',
        scheduledWorkingDays: b.scheduledWorkingDays || 30,
        workedDays: b.workedDays || 30,
        salaireBase: montantGratif,
        totalIndemnites: 0,
        totalAvoirs: 0,
        salaireBrut: montantGratif,
        cotisationCnss: 0,
        cotisationCarfo: 0,
        cotisationCrrae: 0,
        baseImposable: 0,
        brutCotisableCnss: 0,
        netImposable: 0,
        nombreCharges: 0,
        impotIuts: 0,
        retenueFsp: 0,
        totalRetenues: 0,
        totalCotisationsPatronales: 0,
        coutTotalEmployeur: montantGratif,
        salaireNet: montantGratif, // LE NET DEVIENT LE BRUT !
        montantEnLettres: numberToFrenchWords(Math.round(montantGratif)),
        numeroCompteBancaire: iban,
        modeReglement: `Virement bancaire / ${banque}`,
        statut: b.statut || 'VALIDE',
        dateCalcul: new Date().toISOString().split('T')[0],
        lines
      };
    }

    // Récupération dynamique et stricte des indemnités configurées pour cet agent
    const indemnitesReelles: Array<{ code: string; name: string; montant: number; regle: string }> = [];

    if (liveSalaryInfo && liveSalaryInfo.indemnites && liveSalaryInfo.indemnites.length > 0) {
      liveSalaryInfo.indemnites.forEach((ind, idx) => {
        if (ind.montant > 0) {
          indemnitesReelles.push({
            code: ind.typeIndemniteCode || `IND_${idx + 1}`,
            name: (ind.libelle || 'INDEMNITE').toUpperCase(),
            montant: ind.montant,
            regle: ind.libelle || 'INDEMNITE'
          });
        }
      });
    } else if (emp) {
      if (emp.primeLogement && emp.primeLogement > 0) {
        indemnitesReelles.push({ code: 'IND_LOGE', name: 'INDEMNITE DE LOGEMENT', montant: emp.primeLogement, regle: 'INDEMNITE DE LOGEMENT' });
      }
      if (emp.primeTransport && emp.primeTransport > 0) {
        indemnitesReelles.push({ code: 'IND_TRANS', name: 'INDEMNITE DE TRANSPORT', montant: emp.primeTransport, regle: 'INDEMNITE DE TRANSPORT' });
      }
      if (emp.primeResponsabilite && emp.primeResponsabilite > 0) {
        indemnitesReelles.push({ code: 'IND_RESP', name: 'INDEMNITE DE RESPONSABILITE', montant: emp.primeResponsabilite, regle: 'INDEMNITE DE RESPONSABILITE' });
      }
      if (emp.autresIndemnites && Array.isArray(emp.autresIndemnites)) {
        emp.autresIndemnites.forEach((ai: any, idx: number) => {
          if (ai.montant > 0) {
            indemnitesReelles.push({
              code: ai.code || `IND_${idx + 1}`,
              name: (ai.libelle || 'INDEMNITE SPECIFIQUE').toUpperCase(),
              montant: ai.montant,
              regle: ai.libelle || 'INDEMNITE SPECIFIQUE'
            });
          }
        });
      }
    }


    // Calcul dynamique des Avoirs actifs
    let totAvoirsActifs = 0;
    const avoirsLines: Array<{ code: string; name: string; montant: number; regle: string }> = [];
    if (empAvoirs && empAvoirs.length > 0) {
      empAvoirs.forEach((a: any) => {
        let m = Number(a.amount) || Number(a.montant) || 0;
        if (a.echeance && a.echeance > 1 && a.montantRestant) {
          m = Math.round(m / a.echeance);
        }
        if (m > 0) {
          totAvoirsActifs += m;
          avoirsLines.push({
            code: a.salaryElementCode || `AVOIR_${a.id || 1}`,
            name: (a.salaryElementName || 'AVOIR & PRIME DU MOIS').toUpperCase(),
            montant: m,
            regle: a.salaryElementName || 'AVOIR & PRIME PERIODIQUE'
          });
        }
      });
    }

    // Calcul dynamique des Précomptes actifs
    let totPrecomptesActifs = 0;
    const precomptesLines: Array<{ code: string; name: string; montant: number; regle: string }> = [];
    if (empPrecs && empPrecs.length > 0) {
      empPrecs.forEach((p: any) => {
        let m = 0;
        if (p.montantMensuel && p.montantMensuel > 0) m = p.montantMensuel;
        else if (p.amount && p.amount > 0) m = Math.round(p.amount / (p.echeance || 1));
        else if (p.montant && p.montant > 0) m = p.montant;
        if (m > 0) {
          totPrecomptesActifs += m;
          precomptesLines.push({
            code: p.salaryElementCode || `PREC_${p.id || 1}`,
            name: (p.salaryElementName || 'PRÉCOMPTE / RETENUE').toUpperCase(),
            montant: m,
            regle: p.salaryElementName || 'PRÉCOMPTE MENSUEL'
          });
        }
      });
    }

    // Calcul dynamique des Trop-perçus actifs
    let totTropPercusActifs = 0;
    const tropPercusLines: Array<{ code: string; name: string; montant: number; regle: string }> = [];
    let moisAnneeBulletin = '';
    let anneeMoisBulletin = '';
    if (b.dateFrom) {
      const parts = String(b.dateFrom).split('-');
      if (parts.length >= 2) {
        moisAnneeBulletin = `${parts[1]}/${parts[0]}`;
        anneeMoisBulletin = `${parts[0]}-${parts[1]}`;
      }
    }

    if (empTropPercus && empTropPercus.length > 0) {
      empTropPercus.forEach((tp: any) => {
        if (tp.statut && tp.statut !== 'EN_ATTENTE' && tp.statut !== 'APPLIQUE') return;
        const app = (tp.moisApplication || '').trim();
        const matches = !moisAnneeBulletin || app === moisAnneeBulletin || app === anneeMoisBulletin ||
                        (b.dateFrom && String(b.dateFrom).includes(app)) || (tp.moisApplication && tp.moisApplication.includes(moisAnneeBulletin));
        if (matches) {
          const amt = Number(tp.amount) || Number(tp.montant) || 0;
          if (amt > 0) {
            totTropPercusActifs += amt;
            const orig = tp.moisOrigine ? ` (${tp.moisOrigine})` : '';
            const motif = tp.motif ? ` - ${tp.motif}` : '';
            tropPercusLines.push({
              code: tp.salaryElementCode || `RET_TROP_PERCU_${tp.id || 1}`,
              name: `RETENUE TROP-PERÇU${orig}${motif}`.toUpperCase(),
              montant: amt,
              regle: tp.motif || 'RÉGULARISATION SPONTANÉE TROP-PERÇU'
            });
          }
        }
      });
    }

    const totAvoirs = (b.totalAvoirs !== undefined && b.totalAvoirs > 0) ? b.totalAvoirs : (totAvoirsActifs > 0 ? totAvoirsActifs : (b.primeExceptionnelle || 0));
    const precompteAvance = (b.totalPrecomptes !== undefined && b.totalPrecomptes > 0) ? b.totalPrecomptes : (totPrecomptesActifs > 0 ? totPrecomptesActifs : (b.precompteAvance || 0));
    const totTropPercu = (b.totalTropPercus !== undefined && b.totalTropPercus > 0) ? b.totalTropPercus : totTropPercusActifs;
    const totIndem = (b.totalIndemnites !== undefined && b.totalIndemnites > 0) ? b.totalIndemnites : (liveSalaryInfo ? liveSalaryInfo.totalIndemnites : indemnitesReelles.reduce((sum, i) => sum + i.montant, 0));

    const brut = sBase + totIndem + totAvoirs;
    const exonIndem = liveSalaryInfo ? (liveSalaryInfo.totalExonerations || 0) : 0;
    const abattement = liveSalaryInfo ? liveSalaryInfo.abattementForfaitaire : Math.round(sBase * 0.25);
    const netImposable = Math.max(0, brut - exonIndem - abattement);

    const nCharges = b.nombreCharges !== undefined ? b.nombreCharges : (emp?.nombreCharges || 0);

    // Retenues
    let cotisCnss = Math.round(brut * 0.055 * 100) / 100;
    let cotisCarfo = 0;
    let cotisCrrae = 0;
    let impotIuts = (liveSalaryInfo ? liveSalaryInfo.iutsAvecCharge : Math.round(netImposable * 0.0675));
    const sumRetPreFsp = cotisCnss + impotIuts;
    const netPreFsp = Math.max(0, brut - sumRetPreFsp);
    let fsp = b.retenueFsp || (liveSalaryInfo ? ((liveSalaryInfo as any).fondsSoutienPat || 0) : 0);
    if (!fsp || fsp === 0 || fsp > (netPreFsp * 0.05)) {
      fsp = netPreFsp >= 100000 ? Math.round(netPreFsp * 0.01) : 0;
    }

    const totalRetenues = cotisCnss + impotIuts + fsp + precompteAvance + totTropPercu;
    const patCnss = Math.round(brut * 0.16 * 100) / 100;
    const totalPatronales = patCnss;
    const net = brut - totalRetenues;

    // Construction exacte du tableau structuré (ou reprise des lignes existantes en base)
    if (b.lines && b.lines.length > 0) {
      lines = b.lines.map((l: any) => {
        let val = Number(l.amount !== undefined && l.amount !== null && !isNaN(Number(l.amount)) && Number(l.amount) !== 0
          ? l.amount
          : (l.montant !== undefined && l.montant !== null && !isNaN(Number(l.montant)) && Number(l.montant) !== 0
              ? l.montant
              : (l.gain || l.retenue || l.baseCalcul || 0)));

        const codeUp = (l.code || l.codeRubrique || '').toUpperCase();
        const nameUp = (l.libelle || l.name || '').toUpperCase();

        if (val === 0) {
          if (codeUp.includes('SAL_BASE') || nameUp.includes('SALAIRE DE BASE')) val = sBase;
          else if (codeUp.includes('CNSS') || nameUp.includes('CNSS')) val = cotisCnss;
          else if (codeUp.includes('IUTS') || nameUp.includes('IUTS')) val = impotIuts;
          else if (codeUp.includes('CRRAE') || nameUp.includes('CRRAE')) val = Math.round(sBase * 0.03);
          else if (nameUp.includes('LOGEMENT')) val = (emp?.primeLogement || 0);
          else if (nameUp.includes('TRANSPORT')) val = (emp?.primeTransport || 0);
        }

        return {
          id: l.id,
          code: l.code || l.codeRubrique || 'LINE',
          name: l.libelle || l.name || l.elementName || 'Rubrique',
          category: l.typeLigne || l.category || 'ELEMENT',
          quantity: l.quantity !== undefined ? l.quantity : (l.quantite !== undefined ? l.quantite : 1.0),
          rate: l.rate !== undefined ? l.rate : (l.taux !== undefined ? l.taux : 100.0),
          regle: l.regle || l.libelle || l.name || '—',
          amount: val,
          gain: (l.typeLigne === 'GAIN' || l.category === 'ELEMENT' || l.category === 'INDEMNITES') ? val : undefined,
          retenue: (l.typeLigne === 'RETENUE' || l.typeLigne === 'RETENUE_SOCIALE' || l.typeLigne === 'PRECOMPTE' || l.category === 'RETENUE' || l.category === 'PRECOMPTE' || l.category === 'IMPOT') ? val : undefined,
          patronale: (l.typeLigne === 'CHARGES_PAT' || l.typeLigne === 'COTISATION_PATRONALE' || l.category === 'CHARGES_PAT') ? (l.partPatronale || val) : undefined
        };
      });

      // Exclure toutes les charges patronales / employeur et les lignes de totaux/fiscales du tableau des lignes
      lines = lines.filter((l: any) => {
        const cat = (l.category || '').toUpperCase();
        const nm = (l.name || '').toUpperCase();
        const rgl = (l.regle || '').toUpperCase();
        const cd = (l.code || '').toUpperCase();
        if (cat === 'CHARGES_PAT' || cat === 'TOTAL_PAT' || cat === 'COTISATION_PATRONALE' || cat.includes('PATRONAL')) return false;
        if (cat === 'TOTAL_RETENUE' || cat === 'NET' || cd === 'NET_PAYE' || cd === 'SAL_BRUT' || cd === 'TOT_RET') return false;
        if (cd === 'EXON_INDEM' || cd === 'ABATT_CAT' || cd === 'BASE_IMP' || cat === 'BI') return false;
        if (nm.includes('EMPLOYEUR') || nm.includes('PATRONAL') || nm.includes('PART EMPLOYEUR')) return false;
        if (nm.includes('TOTAL RETENUE') || nm.includes('SALAIRE BRUT') || nm.includes('NET A PAYER') || nm.includes('BASE IMPOSABLE') || nm.includes('ABATTEMENT') || nm.includes('EXONÉRATION')) return false;
        if (rgl.includes('EMPLOYEUR') || rgl.includes('PATRONAL')) return false;
        if (cd === 'CNSS_PAT' || cd === 'TOT_PAT' || cd === 'CARFO_PAT' || cd === 'CRRAE_PAT') return false;
        return true;
      });

      // Positionner gain vs retenue proprement
      lines.forEach((l: any) => {
        const cat = (l.category || '').toUpperCase();
        const cd = (l.code || '').toUpperCase();
        const nm = (l.name || l.libelle || '').toUpperCase();
        const isRetenue = (
          l.typeLigne === 'RETENUE' || l.typeLigne === 'RETENUE_SOCIALE' || l.typeLigne === 'PRECOMPTE' ||
          cat === 'RETENUE' || cat === 'PRECOMPTE' || cat === 'IMPOT' || cat === 'DEDUCTION' ||
          cd.includes('CNSS') || cd.includes('CARFO') || cd.includes('IUTS') || cd.includes('FSP') || cd.includes('CRRAE') || cd.includes('PREC') || cd.includes('RET') ||
          nm.includes('CNSS') || nm.includes('CARFO') || nm.includes('IUTS') || nm.includes('FSP') || nm.includes('SOUTIEN PATRIOTIQUE') || nm.includes('CRRAE') || nm.includes('PRÉCOMPTE') || nm.includes('PRECOMPTE') || nm.includes('AVANCE') || nm.includes('RETENUE')
        );
        const val = Math.abs(l.amount || 0);
        if (isRetenue) {
          l.retenue = val;
          l.gain = undefined;
        } else {
          l.gain = val;
          l.retenue = undefined;
        }
      });

      // Dédupliquer les lignes si besoin
      const seenCodes = new Set<string>();
      lines = lines.filter((l: any) => {
        const key = ((l.code || '') + '__' + (l.name || '')).toUpperCase().trim();
        if (seenCodes.has(key)) return false;
        seenCodes.add(key);
        return true;
      });
    } else {
      lines = [
        { code: 'SAL_BASE', name: 'SALAIRE DE BASE', category: 'ELEMENT', quantity: 1.0, rate: 100.0, regle: 'SALAIRE DE BASE INDICIAIRE', amount: sBase, gain: sBase },
        ...indemnitesReelles.map(i => ({
          code: i.code,
          name: i.name,
          category: 'INDEMNITES',
          quantity: 1.0,
          rate: 100.0,
          regle: i.regle,
          amount: i.montant,
          gain: i.montant
        })),
        ...(avoirsLines.length > 0 
          ? avoirsLines.map(al => ({ code: al.code, name: al.name, category: 'INDEMNITES', quantity: 1.0, rate: 100.0, regle: al.regle, amount: al.montant, gain: al.montant }))
          : (totAvoirs > 0 ? [{ code: 'AVOIRS', name: 'AVOIRS & PRIMES DU MOIS', category: 'INDEMNITES', quantity: 1.0, rate: 100.0, regle: 'AVOIRS & PRIMES DU MOIS', amount: totAvoirs, gain: totAvoirs }] : [])
        ),
        { code: 'CNSS_SAL', name: 'COTISATION CARFO / CNSS', category: 'RETENUE', quantity: 1.0, rate: 5.5, regle: `SÉCURITÉ SOCIALE AGENT`, amount: cotisCnss, retenue: cotisCnss },
        { code: 'IUTS', name: `IUTS DU MOIS`, category: 'RETENUE', quantity: 1.0, rate: 100.0, regle: `BARÈME IUTS (${nCharges} CHARGE[S])`, amount: impotIuts, retenue: impotIuts },
        ...(fsp > 0 ? [{ code: 'FSP', name: 'RETENUE FONDS DE SOUTIEN PATRIOTIQUE (FSP)', category: 'RETENUE', quantity: 1.0, rate: 1.0, regle: 'FONDS SOUTIEN PATRIOTIQUE', amount: fsp, retenue: fsp }] : []),
        ...(precomptesLines.length > 0 
          ? precomptesLines.map(pl => ({ code: pl.code, name: pl.name, category: 'PRECOMPTE', quantity: 1.0, rate: 100.0, regle: pl.regle, amount: pl.montant, retenue: pl.montant }))
          : (precompteAvance > 0 ? [{ code: 'AVANCE_SAL', name: 'AVANCE SUR SOLDE / PRÉCOMPTE', category: 'PRECOMPTE', quantity: 1.0, rate: 100.0, regle: 'ACOMPTE & AVANCE SUR SALAIRE', amount: precompteAvance, retenue: precompteAvance }] : [])
        ),
        ...tropPercusLines.map(tpl => ({
          code: tpl.code,
          name: tpl.name,
          category: 'RETENUE',
          quantity: 1.0,
          rate: 100.0,
          regle: tpl.regle,
          amount: tpl.montant,
          retenue: tpl.montant
        }))
      ];
    }

    const iban = liveSalaryInfo?.iban || (emp && emp.iban) || '—';
    const banque = liveSalaryInfo?.banque || (emp && emp.banque) || 'BPBF';
    const computedGrade = formatStandardGrade(emp ? emp.grade : b.grade, emp ? emp.categoriePro : b.categorie, emp ? emp.echelon : b.echelon);

    const totGains = lines.reduce((acc: number, l: any) => acc + (l.gain || 0), 0);
    const totRets = lines.reduce((acc: number, l: any) => acc + (l.retenue || 0), 0);
    const netFinal = totGains - totRets;

    return {
      id: b.id,
      code: b.code || b.numeroBulletin || `BLT-${b.id || '001'}`,
      employeeId: Number(empId) || 0,
      employeeName: (emp ? `${emp.nom || ''} ${emp.prenom || ''}`.trim() : (b.employeeName || 'AGENT')).toUpperCase(),
      matricule: (emp ? emp.matricule : (b.matricule || 'EMP-001')),
      fonction: (emp ? emp.fonction : (b.fonction || 'Agent')),
      grade: computedGrade,
      categorie: (emp ? (emp.categoriePro || 'CLASSE I') : (b.categorie || 'CLASSE I')),
      typeSession: b.typeSession || 'PAIE_NORMALE',
      dateFrom: b.dateFrom || (b.dateDebut ? b.dateDebut.split('T')[0] : '2026-08-01'),
      dateTo: b.dateTo || (b.dateFin ? b.dateFin.split('T')[0] : '2026-08-31'),
      scheduledWorkingDays: b.scheduledWorkingDays || b.joursOuvrables || 30,
      workedDays: b.workedDays || b.joursTravailles || 30,
      salaireBase: sBase,
      totalIndemnites: totIndem,
      totalAvoirs: totAvoirs,
      salaireBrut: totGains,
      cotisationCnss: cotisCnss,
      cotisationCarfo: cotisCarfo,
      cotisationCrrae: cotisCrrae,
      baseImposable: netImposable,
      brutCotisableCnss: brut,
      netImposable: netImposable,
      nombreCharges: nCharges,
      impotIuts: impotIuts,
      retenueFsp: fsp,
      totalRetenues: totRets,
      totalCotisationsPatronales: totalPatronales,
      coutTotalEmployeur: totGains + totalPatronales,
      salaireNet: netFinal,
      montantEnLettres: numberToFrenchWords(Math.round(netFinal)),
      numeroCompteBancaire: iban,
      modeReglement: `Virement bancaire / ${banque}`,
      statut: b.statut || 'VALIDE',
      dateCalcul: b.dateCalcul || (b.createdAt ? b.createdAt.split('T')[0] : '2026-08-30'),
      lines: lines
    };
  }

  applyFilter(): void {
    let list = [...this.bulletinsList];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(b =>
        (b.employeeName && b.employeeName.toLowerCase().includes(q)) ||
        (b.matricule && b.matricule.toLowerCase().includes(q)) ||
        (b.code && b.code.toLowerCase().includes(q))
      );
    }
    if (this.statutFilter) {
      list = list.filter(b => b.statut === this.statutFilter);
    }
    this.filteredList = list;
  }

  openCreateModal(): void {
    this.showModal = true;
    this.selectedEmpForForm = null;
    this.formModel.employeeId = null;
    this.agentSearchText = '';
    this.previewCalcul = null;
    this.empSalaryInfo = null;
    this.empIndemnitesList = [];
    this.empFamilyInfo = [];
    this.empAvoirs = [];
    this.empPrecomptes = [];
  }

  closeModal(): void {
    this.showModal = false;
    this.previewCalcul = null;
  }

  onEmployeeSelect(empId: any): void {
    this.selectedEmpForForm = this.employeesList.find(e => String(e.id) === String(empId)) || null;
    if (this.selectedEmpForForm) {
      this.agentSearchText = `${this.selectedEmpForForm.matricule} - ${this.selectedEmpForForm.nom} ${this.selectedEmpForForm.prenom}`;
      this.loadEmpDetails(this.selectedEmpForForm.id);
    }
  }

  loadEmpDetails(empId: string | number): void {
    this.isCalculating = true;
    const idStr = String(empId);

    forkJoin({
      salaryInfo: this.employeeService.getSalaryInformation(idStr).pipe(
        catchError(() => of(null))
      ),
      indemnites: this.employeeService.getEmployeeIndemnities(idStr).pipe(
        catchError(() => of([]))
      ),
      family: this.http.get<any[]>(`${environment.apiUrl}/employees/${idStr}/family`).pipe(
        catchError(() => of([]))
      ),
      avoirs: this.http.get<any[]>(`${environment.apiUrl}/avoirs/employee/${idStr}`).pipe(
        catchError(() => this.http.get<any[]>(`${environment.apiUrl}/avoirs`).pipe(
          map(list => (list || []).filter(a => String(a.employeeId) === idStr)),
          catchError(() => of([]))
        ))
      ),
      precomptes: this.http.get<any[]>(`${environment.apiUrl}/precomptes/employee/${idStr}`).pipe(
        catchError(() => this.http.get<any[]>(`${environment.apiUrl}/precomptes`).pipe(
          map(list => (list || []).filter(p => String(p.employeeId) === idStr)),
          catchError(() => of([]))
        ))
      ),
      tropPercus: this.http.get<any[]>(`${environment.apiUrl}/trop-percus/employee/${idStr}`).pipe(
        catchError(() => this.http.get<any[]>(`${environment.apiUrl}/trop-percus`).pipe(
          map(list => (list || []).filter(tp => String(tp.employeeId) === idStr)),
          catchError(() => of([]))
        ))
      )
    }).subscribe(({ salaryInfo, indemnites, family, avoirs, precomptes, tropPercus }) => {
      this.empSalaryInfo = salaryInfo;
      this.empIndemnitesList = indemnites || [];
      this.empFamilyInfo = family || [];
      this.empAvoirs = avoirs || [];
      this.empPrecomptes = precomptes || [];
      this.empTropPercus = tropPercus || [];

      this.recalculerPreview();
      this.isCalculating = false;
    });
  }

  onFormChange(): void {
    if (this.selectedEmpForForm) {
      this.recalculerPreview();
    }
  }

  recalculerPreview(): void {
    if (!this.selectedEmpForForm) return;

    const emp = this.selectedEmpForForm;
    const ratio = Math.max(0, Math.min(1, this.formModel.workedDays / (this.formModel.scheduledWorkingDays || 30)));

    const totalAvoirsActifs = (this.empAvoirs || [])
      .filter(a => a.statut !== 'INACTIF' && a.statut !== 'SOLDE')
      .reduce((sum, a) => sum + (Number(a.amount) || Number(a.montant) || 0), 0);

    const totalPrecomptesActifs = (this.empPrecomptes || [])
      .filter(p => p.statut !== 'INACTIF' && p.statut !== 'SOLDE')
      .reduce((sum, p) => {
        let m = 0;
        if (p.montantMensuel && p.montantMensuel > 0) m = p.montantMensuel;
        else if (p.amount && p.amount > 0) {
          const ech = p.echeance || 1;
          m = Math.round(p.amount / ech);
        } else if (p.montant && p.montant > 0) m = p.montant;
        return sum + m;
      }, 0);

    // Extraction du mois pour filtrer les trop-perçus
    let moisAnneeSel = '';
    let anneeMoisSel = '';
    if (this.formModel.dateFrom) {
      const parts = String(this.formModel.dateFrom).split('-');
      if (parts.length >= 2) {
        moisAnneeSel = `${parts[1]}/${parts[0]}`; // e.g. "09/2026"
        anneeMoisSel = `${parts[0]}-${parts[1]}`; // e.g. "2026-09"
      }
    }

    const tropPercusActifs = (this.empTropPercus || []).filter(tp => {
      if (tp.statut && tp.statut !== 'EN_ATTENTE') return false;
      const app = (tp.moisApplication || '').trim();
      return !moisAnneeSel || app === moisAnneeSel || app === anneeMoisSel ||
             (this.formModel.dateFrom && String(this.formModel.dateFrom).includes(app));
    });

    const totalTropPercusActifs = tropPercusActifs.reduce((sum, tp) => sum + (Number(tp.amount) || 0), 0);

    // Si on a l'information salariale réelle calculée du backend
    if (this.empSalaryInfo) {
      const bulletinDraft = {
        employeeId: emp.id,
        dateFrom: this.formModel.dateFrom,
        dateTo: this.formModel.dateTo,
        typeSession: this.formModel.typeSession,
        scheduledWorkingDays: this.formModel.scheduledWorkingDays,
        workedDays: this.formModel.workedDays,
        totalAvoirs: totalAvoirsActifs,
        totalPrecomptes: totalPrecomptesActifs,
        totalTropPercus: totalTropPercusActifs
      };
      this.previewCalcul = this.enrichBulletinData(bulletinDraft, this.empSalaryInfo, this.empAvoirs, this.empPrecomptes, this.empTropPercus);
      return;
    }

    if ((this.formModel.typeSession || '').toUpperCase().includes('GRATIF')) {
      const bulletinDraft = {
        employeeId: emp.id,
        dateFrom: this.formModel.dateFrom,
        dateTo: this.formModel.dateTo,
        typeSession: 'GRATIFICATION',
        scheduledWorkingDays: this.formModel.scheduledWorkingDays,
        workedDays: this.formModel.workedDays,
        salaireBase: emp.salaireBase || 0,
        totalAvoirs: 0,
        totalPrecomptes: 0,
        totalTropPercus: 0
      };
      this.previewCalcul = this.enrichBulletinData(bulletinDraft, null, [], [], []);
      return;
    }

    let sBaseFull = emp.salaireBase || 0;
    const sBase = Math.round(sBaseFull * ratio);

    const indemnitesList: Array<{ libelle: string; code: string; montant: number; regle: string }> = [];
    if (this.empIndemnitesList && this.empIndemnitesList.length > 0) {
      this.empIndemnitesList.forEach((ind, idx) => {
        if (ind.montant > 0) {
          indemnitesList.push({
            libelle: (ind.libelle || 'INDEMNITE').toUpperCase(),
            code: ind.typeIndemniteCode || `IND_${idx + 1}`,
            montant: Math.round(ind.montant * ratio),
            regle: ind.libelle || 'INDEMNITE'
          });
        }
      });
    }

    const totIndem = indemnitesList.reduce((sum, i) => sum + i.montant, 0);
    const brut = sBase + totIndem + totalAvoirsActifs;
    const abattement = Math.round(sBase * 0.25);
    const netImposable = Math.max(0, brut - abattement);

    const cotisCnss = Math.round(brut * 0.055 * 100) / 100;
    const impotIuts = Math.round(netImposable * 0.0675 * 100) / 100;
    const fsp = Math.round((netImposable || sBase) * 0.01);
    const totalRetenues = cotisCnss + impotIuts + fsp + totalPrecomptesActifs + totalTropPercusActifs;
    const patCnss = Math.round(brut * 0.16 * 100) / 100;
    const totalPatronales = patCnss;
    const net = brut - totalRetenues;

    const lines: BulletinLineModel[] = [
      { code: 'SAL_BASE', name: 'SALAIRE DE BASE', category: 'ELEMENT', quantity: 1.0, rate: 100.0, regle: 'SALAIRE DE BASE INDICIAIRE', amount: sBase, gain: sBase },
      ...indemnitesList.map(i => ({
        code: i.code,
        name: i.libelle,
        category: 'INDEMNITES',
        quantity: 1.0,
        rate: 100.0,
        regle: i.regle,
        amount: i.montant,
        gain: i.montant
      })),
      ...(totalAvoirsActifs > 0 ? [{ code: 'AVOIRS', name: 'AVOIRS & PRIMES DU MOIS', category: 'INDEMNITES', quantity: 1.0, rate: 100.0, regle: 'AVOIRS & PRIMES DU MOIS', amount: totalAvoirsActifs, gain: totalAvoirsActifs }] : []),
      { code: 'CNSS_SAL', name: 'COTISATION CARFO / CNSS', category: 'RETENUE', quantity: 1.0, rate: 5.5, regle: `SÉCURITÉ SOCIALE AGENT`, amount: cotisCnss, retenue: cotisCnss },
      { code: 'IUTS', name: `IUTS DU MOIS`, category: 'RETENUE', quantity: 1.0, rate: 100.0, regle: `BARÈME IUTS (0 CHARGE[S])`, amount: impotIuts, retenue: impotIuts },
      ...(fsp > 0 ? [{ code: 'FSP', name: 'RETENUE FONDS DE SOUTIEN PATRIOTIQUE (FSP)', category: 'RETENUE', quantity: 1.0, rate: 1.0, regle: 'FONDS SOUTIEN PATRIOTIQUE', amount: fsp, retenue: fsp }] : []),
      ...(totalPrecomptesActifs > 0 ? [{ code: 'PRECOMPTE', name: 'PRÉCOMPTES & AVANCES SUR SALAIRE', category: 'PRECOMPTE', quantity: 1.0, rate: 100.0, regle: 'DÉDUCTION MENSUELLE PRÉCOMPTE', amount: totalPrecomptesActifs, retenue: totalPrecomptesActifs }] : []),
      ...tropPercusActifs.map(tp => ({
        code: tp.salaryElementCode || 'RET_TROP_PERCU',
        name: `RETENUE TROP-PERÇU${tp.moisOrigine ? ` (${tp.moisOrigine})` : ''}${tp.motif ? ` - ${tp.motif}` : ''}`.toUpperCase(),
        category: 'RETENUE',
        quantity: 1.0,
        rate: 100.0,
        regle: tp.motif || 'RÉGULARISATION SPONTANÉE TROP-PERÇU',
        amount: Number(tp.amount) || 0,
        retenue: Number(tp.amount) || 0
      }))
    ];

    const iban = emp.iban || '—';
    const banque = emp.banque || 'BPBF';

    this.previewCalcul = {
      code: `SLIP/2026/08-${emp.matricule || 'EMP'}`,
      employeeId: Number(emp.id) || 0,
      employeeName: `${emp.nom || ''} ${emp.prenom || ''}`.trim().toUpperCase(),
      matricule: emp.matricule || 'EMP-001',
      fonction: emp.fonction || 'Agent',
      grade: emp.grade || 'C1E1',
      categorie: emp.categoriePro || 'CLASSE I',
      typeSession: this.formModel.typeSession,
      dateFrom: this.formModel.dateFrom,
      dateTo: this.formModel.dateTo,
      scheduledWorkingDays: this.formModel.scheduledWorkingDays,
      workedDays: this.formModel.workedDays,
      salaireBase: sBase,
      totalIndemnites: totIndem,
      totalAvoirs: 0,
      salaireBrut: brut,
      cotisationCnss: cotisCnss,
      cotisationCarfo: 0,
      cotisationCrrae: 0,
      baseImposable: netImposable,
      brutCotisableCnss: brut,
      netImposable: netImposable,
      nombreCharges: 0,
      impotIuts: impotIuts,
      retenueFsp: 0,
      totalRetenues: totalRetenues,
      totalCotisationsPatronales: totalPatronales,
      coutTotalEmployeur: brut + totalPatronales,
      salaireNet: net,
      montantEnLettres: numberToFrenchWords(Math.round(net)),
      numeroCompteBancaire: iban,
      modeReglement: `Virement bancaire / ${banque}`,
      statut: 'VALIDE',
      dateCalcul: new Date().toISOString().split('T')[0],
      lines
    };
  }

  isSavingBulletin: boolean = false;

  enregistrerBulletin(): void {
    if (!this.previewCalcul) return;

    this.isSavingBulletin = true;

    const payload = {
      employeeId: this.previewCalcul.employeeId,
      code: this.previewCalcul.code,
      typeSession: this.previewCalcul.typeSession,
      dateFrom: this.previewCalcul.dateFrom,
      dateTo: this.previewCalcul.dateTo,
      scheduledWorkingDays: this.previewCalcul.scheduledWorkingDays,
      workedDays: this.previewCalcul.workedDays,
      salaireBase: this.previewCalcul.salaireBase,
      totalIndemnites: this.previewCalcul.totalIndemnites,
      totalAvoirs: this.previewCalcul.totalAvoirs,
      salaireBrut: this.previewCalcul.salaireBrut,
      baseImposable: this.previewCalcul.baseImposable,
      cotisationCnss: this.previewCalcul.cotisationCnss,
      impotIuts: this.previewCalcul.impotIuts,
      totalRetenues: this.previewCalcul.totalRetenues,
      totalCotisationsPatronales: this.previewCalcul.totalCotisationsPatronales,
      salaireNet: this.previewCalcul.salaireNet,
      statut: this.previewCalcul.statut || 'VALIDE',
      lines: this.previewCalcul.lines.map((l, idx) => ({
        code: l.code,
        libelle: l.name,
        name: l.name,
        typeLigne: l.category,
        category: l.category,
        taux: l.rate,
        rate: l.rate,
        montant: Math.abs(l.amount),
        amount: Math.abs(l.amount),
        ordre: idx + 1
      }))
    };

    this.http.post<any>(`${environment.apiUrl}/bulletins`, payload).subscribe({
      next: () => {
        this.isSavingBulletin = false;
        this.loadBulletins();
        this.closeModal();
      },
      error: () => {
        this.isSavingBulletin = false;
        const nouveau = { ...this.previewCalcul!, id: Date.now() };
        this.bulletinsList.unshift(nouveau);
        this.applyFilter();
        this.closeModal();
      }
    });
  }

  voirBulletin(b: BulletinIndividuelModel): void {
    const empId = b.employeeId;
    if (empId) {
      forkJoin({
        avoirs: this.http.get<any[]>(`${environment.apiUrl}/avoirs/employee/${empId}`).pipe(
          catchError(() => this.http.get<any[]>(`${environment.apiUrl}/avoirs`).pipe(
            map(list => (list || []).filter((a: any) => String(a.employeeId) === String(empId))),
            catchError(() => of([]))
          ))
        ),
        precomptes: this.http.get<any[]>(`${environment.apiUrl}/precomptes/employee/${empId}`).pipe(
          catchError(() => this.http.get<any[]>(`${environment.apiUrl}/precomptes`).pipe(
            map(list => (list || []).filter((p: any) => String(p.employeeId) === String(empId))),
            catchError(() => of([]))
          ))
        ),
        tropPercus: this.http.get<any[]>(`${environment.apiUrl}/trop-percus/employee/${empId}`).pipe(
          catchError(() => this.http.get<any[]>(`${environment.apiUrl}/trop-percus`).pipe(
            map(list => (list || []).filter((tp: any) => String(tp.employeeId) === String(empId))),
            catchError(() => of([]))
          ))
        )
      }).subscribe(({ avoirs, precomptes, tropPercus }) => {
        const empAvoirs = (avoirs || []).filter((a: any) => a.statut !== 'INACTIF' && a.statut !== 'SOLDE');
        const empPrecs = (precomptes || []).filter((p: any) => p.statut !== 'INACTIF' && p.statut !== 'SOLDE');
        this.selectedBulletin = this.enrichBulletinData(b, null, empAvoirs, empPrecs, tropPercus || []);
      });
    } else {
      this.selectedBulletin = this.enrichBulletinData(b, null, [], [], []);
    }
  }

  ouvrirModalModifierVariables(b: BulletinIndividuelModel): void {
    this.selectedBulletinForEdit = b;
    const empId = b.employeeId;

    this.editVariablesForm = {
      workedDays: b.workedDays !== undefined ? b.workedDays : 30,
      scheduledWorkingDays: b.scheduledWorkingDays || 30,
      primeExceptionnelle: b.totalAvoirs || 0,
      heuresSup: 0,
      nombreHeuresSup: 0,
      precompteAvance: b.totalRetenues && b.cotisationCnss ? Math.max(0, b.totalRetenues - b.cotisationCnss - b.impotIuts - b.retenueFsp - b.cotisationCarfo - b.cotisationCrrae) : 0,
      motifAjustement: ''
    };

    // Chargement dynamique des précomptes actifs (calcul de la mensualité par échéancier)
    if (empId && this.editVariablesForm.precompteAvance === 0) {
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
    const base = this.selectedBulletinForEdit?.salaireBase || 55555;
    return Math.round(base / 173.333);
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

    const sBaseInit = b.salaireBaseOriginal !== undefined ? b.salaireBaseOriginal : b.salaireBase;
    b.salaireBaseOriginal = sBaseInit;
    const sBaseNew = Math.round(sBaseInit * ratio);
    
    const totIndemInit = b.totalIndemnitesOriginal !== undefined ? b.totalIndemnitesOriginal : (b.totalIndemnites || 0);
    b.totalIndemnitesOriginal = totIndemInit;
    const totIndemNew = Math.round(totIndemInit * ratio);

    const totAvoirs = b.totalAvoirs !== undefined ? b.totalAvoirs : (b.primeExceptionnelle || 0);
    const precompte = b.totalPrecomptes !== undefined ? b.totalPrecomptes : (b.precompteAvance || 0);
    const hSupMontant = b.heuresSup || 0;

    const brutNew = sBaseNew + totIndemNew + totAvoirs + hSupMontant;
    const abattementNew = Math.round(sBaseNew * 0.25);
    const biNew = Math.max(0, brutNew - abattementNew);

    const cnssNew = Math.round(brutNew * 0.055 * 100) / 100;
    const iutsNew = Math.round(biNew * 0.0675 * 100) / 100;
    const fspNew = Math.round((biNew || sBaseNew) * 0.01);
    const totRetNew = cnssNew + iutsNew + fspNew + precompte;
    const netNew = brutNew - totRetNew;

    b.workedDays = workedDays;
    b.scheduledWorkingDays = scheduledDays;
    b.salaireBase = sBaseNew;
    b.totalIndemnites = totIndemNew;
    b.totalAvoirs = totAvoirs;
    b.primeExceptionnelle = totAvoirs;
    b.totalPrecomptes = precompte;
    b.precompteAvance = precompte;
    b.salaireBrut = brutNew;
    b.baseImposable = biNew;
    b.cotisationCnss = cnssNew;
    b.impotIuts = iutsNew;
    b.retenueFsp = fspNew;
    b.totalRetenues = totRetNew;
    b.salaireNet = netNew;
    b.montantEnLettres = numberToFrenchWords(Math.round(netNew));

    // Reconstruire les lignes 3 colonnes (Avoirs / Retenues uniquement, sans abattements ni totaux dans le corps)
    b.lines = [
      { code: 'SAL_BASE', name: 'SALAIRE DE BASE', category: 'ELEMENT', quantity: 1.0, rate: 100.0, regle: `PRÉSENCE : ${workedDays}/${scheduledDays} JOURS`, amount: sBaseNew, gain: sBaseNew },
      ...(totIndemNew > 0 ? [{ code: 'INDEMNITES', name: 'INDEMNITÉS TOTALES', category: 'INDEMNITES', quantity: 1.0, rate: 100.0, regle: 'INDEMNITÉS CONTRACTUELLES PRORATISÉES', amount: totIndemNew, gain: totIndemNew }] : []),
      ...(totAvoirs > 0 ? [{ code: 'AVOIRS', name: 'AVOIRS & PRIMES EXCEPTIONNELLES', category: 'INDEMNITES', quantity: 1.0, rate: 100.0, regle: 'AVOIRS ACTIFS DE L\'AGENT', amount: totAvoirs, gain: totAvoirs }] : []),
      ...(hSupMontant > 0 ? [{ code: 'H_SUP', name: `HEURES SUPPLÉMENTAIRES (${b.nombreHeuresSup || 0}H)`, category: 'INDEMNITES', quantity: Number(b.nombreHeuresSup || 0), rate: 100.0, regle: 'HEURES SUP MAJORÉES', amount: hSupMontant, gain: hSupMontant }] : []),
      { code: 'CNSS_SAL', name: 'COTISATION CARFO / CNSS', category: 'RETENUE', quantity: 1.0, rate: 5.5, regle: `SÉCURITÉ SOCIALE AGENT (5.50%)`, amount: cnssNew, retenue: cnssNew },
      { code: 'IUTS', name: `IUTS DU MOIS`, category: 'RETENUE', quantity: 1.0, rate: 100.0, regle: `BARÈME IUTS (0 CHARGE[S])`, amount: iutsNew, retenue: iutsNew },
      ...(fspNew > 0 ? [{ code: 'FSP', name: 'RETENUE FONDS DE SOUTIEN PATRIOTIQUE (FSP)', category: 'RETENUE', quantity: 1.0, rate: 1.0, regle: 'FONDS SOUTIEN PATRIOTIQUE', amount: fspNew, retenue: fspNew }] : []),
      ...(precompte > 0 ? [{ code: 'PRECOMPTE', name: 'PRÉCOMPTES & AVANCES SUR SALAIRE', category: 'PRECOMPTE', quantity: 1.0, rate: 100.0, regle: 'DÉDUCTION MENSUELLE PRÉCOMPTE', amount: precompte, retenue: precompte }] : [])
    ];

    // Persistance immédiate dans la base de données backend PostgreSQL
    const payload = {
      employeeId: b.employeeId,
      code: b.code,
      typeSession: b.typeSession || 'PAIE_NORMALE',
      dateFrom: b.dateFrom,
      dateTo: b.dateTo,
      scheduledWorkingDays: b.scheduledWorkingDays,
      workedDays: b.workedDays,
      salaireBase: b.salaireBase,
      totalIndemnites: b.totalIndemnites,
      totalAvoirs: totAvoirs,
      salaireBrut: b.salaireBrut,
      baseImposable: b.baseImposable,
      cotisationCnss: b.cotisationCnss,
      impotIuts: b.impotIuts,
      totalPrecomptes: precompte,
      totalRetenues: b.totalRetenues,
      totalCotisationsPatronales: b.totalCotisationsPatronales,
      salaireNet: b.salaireNet,
      statut: b.statut || 'VALIDE',
      lines: b.lines.map((l, idx) => ({
        code: l.code,
        libelle: l.name,
        name: l.name,
        typeLigne: l.category,
        category: l.category,
        taux: l.rate,
        rate: l.rate,
        montant: Math.abs(l.amount),
        amount: Math.abs(l.amount),
        ordre: idx + 1
      }))
    };

    if (b.id) {
      this.http.put(`${environment.apiUrl}/bulletins/${b.id}`, payload).subscribe({
        next: () => this.loadBulletins(),
        error: () => this.applyFilter()
      });
    } else {
      this.http.post(`${environment.apiUrl}/bulletins`, payload).subscribe({
        next: () => this.loadBulletins(),
        error: () => this.applyFilter()
      });
    }

    this.fermerModalModifierVariables();
  }

  fermerApercu(): void {
    this.selectedBulletin = null;
  }

  imprimerBulletin(b: BulletinIndividuelModel): void {
    const enriched = this.enrichBulletinData(b);
    const printWin = window.open('', '_blank', 'width=1000,height=1200');
    if (!printWin) {
      alert('Veuillez autoriser les fenêtres pop-up pour imprimer.');
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
            <div style="font-size: 10px; color: #64748b;">Période : ${enriched.dateFrom} au ${enriched.dateTo}</div>
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
            <div class="info-row"><span>Charges Famille :</span> <strong>${enriched.nombreCharges} charge(s)</strong></div>
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
            ${enriched.lines.map(l => `
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
              <td class="right" style="border: 1px solid #000;">${fmt(enriched.baseImposable || enriched.netImposable)}</td>
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
              <td class="right bold" style="border: 1px solid #000;">${fmt(enriched.totalCotisationsPatronales || 0)}</td>
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
}
