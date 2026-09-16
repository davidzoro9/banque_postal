import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from '../../../grh/employes/services/employee.service';
import { Employee, EmployeeSalaryInformation, EmployeeIndemnity } from '../../../grh/employes/models/employee.model';
import { environment } from '../../../../../environments/environment';
import { calculateOfficialIUTS, computeEmployeeFamilyCharges } from '../../../../core/utils/iuts-calculator.utils';
import { BulletinPdfService } from '../../services/bulletin-pdf.service';
import { catchError, map } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

export interface BulletinLineModel {
  code: string;
  name: string;
  libelle?: string;
  typeLigne?: string;
  category: 'ELEMENT' | 'INDEMNITES' | 'DEDUCTION' | 'BI' | 'RETENUE' | 'PRECOMPTE' | 'TOTAL_RETENUE' | 'CHARGES_PAT' | 'TOTAL_PAT' | 'NET' | string;
  quantity: number;
  rate: number;
  regle: string;
  baseCalcul?: number;
  tauxFormatted?: string;
  gain?: number;
  retenue?: number;
  montant?: number;
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
  sessionPaieId?: number;
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
  banque?: string;
  statut: string;
  dateCalcul: string;
  nom?: string;
  prenom?: string;
  emploi?: string;
  dateEmbauche?: string;
  service?: string;
  numeroCnss?: string;
  situationMatrimoniale?: string;
  situationFamiliale?: string;
  partsFiscales?: number;
  classification?: string;
  anciennete?: number;
  ancienneteAnnees?: number;
  cumulBrut?: number;
  cumulBaseImposable?: number;
  cumulCnss?: number;
  cumulIuts?: number;
  cumulCrrae?: number;
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
    private employeeService: EmployeeService,
    private bulletinPdfService: BulletinPdfService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadBulletins();
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
        code: b.code || b.numeroBulletin || (b.id ? `BLT-${b.id}` : `BLT-${(b.dateFrom ? String(b.dateFrom).substring(0, 7).replace('-', '') : '202609')}-${emp?.matricule || b.matricule || 'EMP'}`),
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
        numeroCompteBancaire: (iban && !iban.includes('0000000000') && iban !== '08000002501' && iban !== '—')
          ? iban
          : ((emp?.matricule || b.matricule) ? `Compte BPBF — ${emp?.matricule || b.matricule}` : '—'),
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

    // Retenues réelles issues de PostgreSQL via Spring Boot
    const sInfo: any = liveSalaryInfo;
    let cotisCnss = b.cotisationCnss != null ? b.cotisationCnss : (b.cotisationCNSS != null ? b.cotisationCNSS : (sInfo?.cotisationCnssAgent != null ? sInfo.cotisationCnssAgent : 0));
    if (cotisCnss === 0 && b.lines && b.lines.length > 0) {
      const cnssL = b.lines.find((l: any) => {
        const c = (l.code || '').toUpperCase();
        const nm = (l.libelle || l.name || '').toUpperCase();
        return (c.includes('CNSS') || nm.includes('CNSS')) && !c.includes('PATRON') && !nm.includes('PATRON');
      });
      if (cnssL) {
        cotisCnss = Math.abs(Number(cnssL.amount || cnssL.montant || cnssL.retenue || 0));
      }
    }
    if (cotisCnss === 0 && brut > 0) {
      const baseCnss = Math.min(brut, 800000);
      cotisCnss = Math.round(baseCnss * 0.055);
    }
    let cotisCarfo = b.cotisationCarfo != null ? b.cotisationCarfo : (b.cotisationCARFO != null ? b.cotisationCARFO : (sInfo?.cotisationCarfoAgent != null ? sInfo.cotisationCarfoAgent : 0));
    let cotisCrrae = b.cotisationCrrae != null ? b.cotisationCrrae : (b.cotisationCRRAE != null ? b.cotisationCRRAE : (sInfo?.cotisationCrraeAgent != null ? sInfo.cotisationCrraeAgent : 0));
    let impotIuts = b.impotIuts != null ? b.impotIuts : (b.impotIUTS != null ? b.impotIUTS : (sInfo?.iutsAvecCharge != null ? sInfo.iutsAvecCharge : 0));
    let fsp = b.cotisationSolidarite != null ? b.cotisationSolidarite : (b.retenueFsp != null ? b.retenueFsp : (b.retenueFSP != null ? b.retenueFSP : (sInfo?.fondsSoutienPat != null ? sInfo.fondsSoutienPat : 0)));

    const totalRetenues = b.totalRetenues != null ? b.totalRetenues : (cotisCnss + cotisCarfo + cotisCrrae + impotIuts + fsp + precompteAvance + totTropPercu);
    const patCnss = b.totalCotisationsPatronales != null ? b.totalCotisationsPatronales : (b.totalRetenuesPatronales || (sInfo?.cotisationCnssPatronale || 0));
    const totalPatronales = patCnss;
    const net = b.salaireNet != null ? b.salaireNet : (brut - totalRetenues);

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
          else if (codeUp.includes('CRRAE') || nameUp.includes('CRRAE')) val = cotisCrrae;
          else if (nameUp.includes('LOGEMENT')) val = (emp?.primeLogement || 0);
          else if (nameUp.includes('TRANSPORT')) val = (emp?.primeTransport || 0);
        }

        let baseVal = l.baseCalcul !== undefined && l.baseCalcul !== null ? l.baseCalcul : (l.base !== undefined ? l.base : undefined);
        let tauxStr = '';
        if (codeUp.includes('SAL_BASE') || nameUp.includes('SALAIRE DE BASE')) {
          baseVal = sBase;
          tauxStr = (b.workedDays || 30) + '';
        } else if (codeUp.includes('SUR_SALAIRE') || nameUp.includes('SURSALAIRE')) {
          baseVal = (emp?.surSalaire || b.surSalaire || 0);
          tauxStr = (b.workedDays || 30) + '';
        } else if (codeUp.includes('CNSS') || nameUp.includes('CNSS')) {
          baseVal = brut;
          tauxStr = '5,5 %';
        } else if (codeUp.includes('CRRAE') || nameUp.includes('CRRAE')) {
          baseVal = Math.round(sBase + (emp?.surSalaire || b.surSalaire || 0));
          tauxStr = '6 %';
        } else if (codeUp.includes('IUTS') || nameUp.includes('IUTS')) {
          baseVal = netImposable;
          tauxStr = String(nCharges ? (nCharges + 1) : 2);
        } else if (codeUp.includes('FSP') || codeUp.includes('SOLIDARITE') || nameUp.includes('SOLIDARITE')) {
          baseVal = netImposable;
          tauxStr = '1 %';
        } else if (l.rate !== undefined && l.rate !== null && Number(l.rate) > 0) {
          tauxStr = l.rate + ' %';
        } else if (l.taux !== undefined && l.taux !== null && Number(l.taux) > 0) {
          tauxStr = l.taux + ' %';
        } else if (l.quantity && l.quantity > 1) {
          tauxStr = l.quantity + '';
        }

        return {
          id: l.id,
          code: l.code || l.codeRubrique || 'LINE',
          name: l.libelle || l.name || l.elementName || 'Rubrique',
          category: l.typeLigne || l.category || 'ELEMENT',
          quantity: l.quantity !== undefined ? l.quantity : (l.quantite !== undefined ? l.quantite : 1.0),
          rate: l.rate !== undefined ? l.rate : (l.taux !== undefined ? l.taux : 100.0),
          tauxFormatted: tauxStr,
          baseCalcul: baseVal,
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

      // Si b.lines ne contenait pas les indemnités conventionnelles de l'agent, les injecter depuis les indemnités réelles ou conventionnelles
      const hasIndemnites = lines.some((l: any) => {
        const nm = (l.name || '').toUpperCase();
        return nm.includes('LOGEMENT') || nm.includes('TRANSPORT') || nm.includes('CAISSE') || nm.includes('SUJETION') || nm.includes('CASH POINT');
      });

      if (!hasIndemnites) {
        // Injecter les indemnités réelles issues de PostgreSQL
        if (indemnitesReelles.length > 0) {
          indemnitesReelles.forEach(i => {
            lines.push({
              code: i.code,
              name: i.name,
              category: 'INDEMNITES',
              quantity: 1.0,
              rate: 100.0,
              tauxFormatted: '',
              baseCalcul: i.montant,
              regle: i.regle,
              amount: i.montant,
              gain: i.montant
            });
          });
        }
      }

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
        { code: 'SAL_BASE', name: 'SALAIRE DE BASE', category: 'ELEMENT', quantity: 1.0, rate: 100.0, tauxFormatted: (b.workedDays || 30) + '', baseCalcul: sBase, regle: 'SALAIRE DE BASE INDICIAIRE', amount: sBase, gain: sBase },
        ...(emp?.surSalaire || b.surSalaire ? [{ code: 'SUR_SALAIRE', name: 'SURSALAIRE', category: 'ELEMENT', quantity: 1.0, rate: 100.0, tauxFormatted: (b.workedDays || 30) + '', baseCalcul: (emp?.surSalaire || b.surSalaire), regle: 'SURSALAIRE', amount: (emp?.surSalaire || b.surSalaire), gain: (emp?.surSalaire || b.surSalaire) }] : []),
        ...indemnitesReelles.map(i => ({
          code: i.code,
          name: i.name,
          category: 'INDEMNITES',
          quantity: 1.0,
          rate: 100.0,
          tauxFormatted: '',
          baseCalcul: i.montant,
          regle: i.regle,
          amount: i.montant,
          gain: i.montant
        })),
        ...(avoirsLines.length > 0 
          ? avoirsLines.map(al => ({ code: al.code, name: al.name, category: 'INDEMNITES', quantity: 1.0, rate: 100.0, tauxFormatted: '', baseCalcul: al.montant, regle: al.regle, amount: al.montant, gain: al.montant }))
          : (totAvoirs > 0 ? [{ code: 'AVOIRS', name: 'AVOIRS & PRIMES DU MOIS', category: 'INDEMNITES', quantity: 1.0, rate: 100.0, tauxFormatted: '', baseCalcul: totAvoirs, regle: 'AVOIRS & PRIMES DU MOIS', amount: totAvoirs, gain: totAvoirs }] : [])
        ),
        { code: 'CNSS_SAL', name: 'COTISATION CNSS', category: 'RETENUE', quantity: 1.0, rate: 5.5, tauxFormatted: '5,5 %', baseCalcul: brut, regle: `SÉCURITÉ SOCIALE AGENT`, amount: cotisCnss, retenue: cotisCnss },
        { code: 'IUTS', name: `RETENUE IUTS`, category: 'RETENUE', quantity: 1.0, rate: 100.0, tauxFormatted: String(nCharges ? nCharges + 1 : 2), baseCalcul: netImposable, regle: `BARÈME IUTS (${nCharges} CHARGE[S])`, amount: impotIuts, retenue: impotIuts },
        { code: 'CRRAE', name: 'COTISATION CRRAE/RCPNC', category: 'RETENUE', quantity: 1.0, rate: 6.0, tauxFormatted: '6 %', baseCalcul: Math.round(sBase + (emp?.surSalaire || b.surSalaire || 0)), regle: 'CRRAE', amount: cotisCrrae, retenue: cotisCrrae },
        ...(fsp > 0 ? [{ code: 'FSP', name: 'RETENUE FONDS DE SOLIDARITE', category: 'RETENUE', quantity: 1.0, rate: 1.0, tauxFormatted: '1 %', baseCalcul: netImposable, regle: 'FONDS SOUTIEN PATRIOTIQUE', amount: fsp, retenue: fsp }] : []),
        ...(precomptesLines.length > 0 
          ? precomptesLines.map(pl => ({ code: pl.code, name: pl.name, category: 'PRECOMPTE', quantity: 1.0, rate: 100.0, tauxFormatted: '', baseCalcul: pl.montant, regle: pl.regle, amount: pl.montant, retenue: pl.montant }))
          : (precompteAvance > 0 ? [{ code: 'AVANCE_SAL', name: 'AVANCE SUR SOLDE / PRÉCOMPTE', category: 'PRECOMPTE', quantity: 1.0, rate: 100.0, tauxFormatted: '', baseCalcul: precompteAvance, regle: 'ACOMPTE & AVANCE SUR SALAIRE', amount: precompteAvance, retenue: precompteAvance }] : [])
        ),
        ...tropPercusLines.map(tpl => ({
          code: tpl.code,
          name: tpl.name,
          category: 'RETENUE',
          quantity: 1.0,
          rate: 100.0,
          tauxFormatted: '',
          baseCalcul: tpl.montant,
          regle: tpl.regle,
          amount: tpl.montant,
          retenue: tpl.montant
        }))
      ];
    }

    // Ordonnancement strict des lignes du bulletin selon la convention BPBF
    const getOrderWeight = (l: any): number => {
      const cd = (l.code || '').toUpperCase();
      const nm = (l.name || '').toUpperCase();
      if (cd.includes('SAL_BASE') || nm.includes('SALAIRE DE BASE')) return 1;
      if (cd.includes('SUR_SALAIRE') || nm.includes('SURSALAIRE')) return 2;
      if (cd.includes('CAISSE') || nm.includes('CAISSE')) return 3;
      if (cd.includes('SUJETION') || cd.includes('SUJ') || nm.includes('SUJETION') || nm.includes('SUJÉTION')) return 4;
      if (cd.includes('TRANS') || cd.includes('TRP') || nm.includes('TRANSPORT') || nm.includes('DEPLACEMENT')) return 5;
      if (cd.includes('LOG') || nm.includes('LOGEMENT') || nm.includes('MAISON')) return 6;
      if (cd.includes('CASH') || cd.includes('CP') || nm.includes('CASH POINT') || nm.includes('CASHPOINT')) return 7;
      if (l.gain !== undefined && l.gain !== null && l.gain > 0) return 8;
      if (cd.includes('CNSS') || nm.includes('CNSS')) return 20;
      if (cd.includes('IUTS') || nm.includes('IUTS')) return 21;
      if (cd.includes('CRRAE') || nm.includes('CRRAE')) return 22;
      if (cd.includes('SOLIDAR') || cd.includes('FSP') || nm.includes('SOLIDARITE') || nm.includes('SOLIDARITÉ')) return 23;
      if (cd.includes('PREC') || cd.includes('AVANCE') || nm.includes('PRÉCOMPTE') || nm.includes('PRECOMPTE') || nm.includes('AVANCE')) return 30;
      return 40;
    };

    lines.sort((a, b) => getOrderWeight(a) - getOrderWeight(b));

    const iban = liveSalaryInfo?.iban || (emp && emp.iban) || '—';
    const banque = liveSalaryInfo?.banque || (emp && emp.banque) || 'BPBF';
    const computedGrade = formatStandardGrade(emp ? emp.grade : b.grade, emp ? emp.categoriePro : b.categorie, emp ? emp.echelon : b.echelon);

    const totGains = lines.reduce((acc: number, l: any) => acc + (l.gain || 0), 0);
    const totRets = lines.reduce((acc: number, l: any) => acc + (l.retenue || 0), 0);
    const netFinal = totGains - totRets;

    return {
      id: b.id,
      code: b.code || b.numeroBulletin || (b.id ? `BLT-${b.id}` : `BLT-${(b.dateFrom ? String(b.dateFrom).substring(0, 7).replace('-', '') : '202609')}-${emp?.matricule || b.matricule || 'EMP'}`),
      employeeId: Number(empId) || 0,
      employeeName: (emp ? `${emp.nom || ''} ${emp.prenom || ''}`.trim() : (b.employeeName || 'AGENT')).toUpperCase(),
      nom: emp?.nom || b.nom || (emp ? emp.nom : (b.employeeName ? b.employeeName.split(' ')[0] : '—')),
      prenom: emp?.prenom || b.prenom || (emp ? emp.prenom : (b.employeeName && b.employeeName.includes(' ') ? b.employeeName.substring(b.employeeName.indexOf(' ') + 1) : '—')),
      emploi: b.emploi && b.emploi !== '—' ? b.emploi : (emp?.fonction || emp?.poste || b.fonction || '—'),
      dateEmbauche: b.dateEmbauche && b.dateEmbauche !== '—' ? b.dateEmbauche : (emp?.dateEmbauche || '—'),
      service: b.service && b.service !== '—' ? b.service : (emp?.service || emp?.departement || emp?.direction || '—'),
      numeroCnss: b.numeroCnss && b.numeroCnss !== '—' ? b.numeroCnss : (emp?.numeroCnss || emp?.numeroCNI || '—'),
      situationFamiliale: b.situationFamiliale || b.situationMatrimoniale || emp?.situationFamiliale || emp?.situationMatrimoniale || 'Célibataire',
      situationMatrimoniale: b.situationFamiliale || b.situationMatrimoniale || emp?.situationFamiliale || emp?.situationMatrimoniale || 'Célibataire',
      partsFiscales: b.partsFiscales || ((b.situationFamiliale || b.situationMatrimoniale || emp?.situationFamiliale || emp?.situationMatrimoniale || '').toUpperCase().includes('MARI') ? (2 + nCharges) : (1 + nCharges)),
      classification: b.classification && b.classification !== '—' ? b.classification : (computedGrade || '—'),
      anciennete: (() => {
        let anc = b.anciennete != null ? b.anciennete : (emp?.anciennete != null ? emp.anciennete : (b.ancienneteAnnees != null ? b.ancienneteAnnees : 0));
        if (anc === 0 && (emp?.dateEmbauche || b.dateEmbauche)) {
          try {
            const dEmb = new Date(emp?.dateEmbauche || b.dateEmbauche);
            const ref = b.dateTo ? new Date(b.dateTo) : new Date();
            anc = Math.max(0, ref.getFullYear() - dEmb.getFullYear());
          } catch {}
        }
        return anc;
      })(),
      cumulBrut: (b.cumulBrutExercice != null && b.cumulBrutExercice > 0) ? b.cumulBrutExercice : (b.cumulBrut != null && b.cumulBrut > 0 ? b.cumulBrut : totGains),
      cumulBaseImposable: (b.cumulBaseImposableExercice != null && b.cumulBaseImposableExercice > 0) ? b.cumulBaseImposableExercice : (b.cumulBaseImposable != null && b.cumulBaseImposable > 0 ? b.cumulBaseImposable : netImposable),
      cumulCnss: (b.cumulCnssExercice != null && b.cumulCnssExercice > 0) ? b.cumulCnssExercice : (b.cumulCnss != null && b.cumulCnss > 0 ? b.cumulCnss : cotisCnss),
      cumulIuts: (b.cumulIutsExercice != null && b.cumulIutsExercice > 0) ? b.cumulIutsExercice : (b.cumulIuts != null && b.cumulIuts > 0 ? b.cumulIuts : impotIuts),
      cumulCrrae: (b.cumulCrraeExercice != null && b.cumulCrraeExercice > 0) ? b.cumulCrraeExercice : (b.cumulCrrae != null && b.cumulCrrae > 0 ? b.cumulCrrae : cotisCrrae),
      matricule: (emp ? emp.matricule : (b.matricule || 'EMP-001')),
      fonction: (emp ? emp.fonction : (b.fonction || 'Agent')),
      grade: computedGrade,
      categorie: (emp ? (emp.categoriePro || 'CLASSE I') : (b.categorie || 'CLASSE I')),
      typeSession: b.typeSession || 'ORDINAIRE',
      dateFrom: b.dateFrom || (b.dateDebut ? b.dateDebut.split('T')[0] : '2026-08-01'),
      dateTo: b.dateTo || (b.dateFin ? b.dateFin.split('T')[0] : '2026-08-31'),
      scheduledWorkingDays: b.scheduledWorkingDays || b.joursOuvrables || 30,
      workedDays: b.workedDays || b.joursTravailles || 30,
      salaireBase: sBase,
      totalIndemnites: totIndem,
      totalAvoirs: totGains,
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
      numeroCompteBancaire: (iban && !iban.includes('0000000000') && iban !== '08000002501' && iban !== '—')
        ? iban
        : ((emp?.matricule || b.matricule) ? `Compte BPBF — ${emp?.matricule || b.matricule}` : '—'),
      banque: banque,
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
      this.recalculerJoursProrata();
      this.loadEmpDetails(this.selectedEmpForForm.id);
    }
  }

  recalculerJoursProrata(): void {
    if (!this.selectedEmpForForm) return;
    const emp = this.selectedEmpForForm;
    this.formModel.scheduledWorkingDays = 30;
    this.formModel.workedDays = 30;

    const debutPeriode = this.formModel.dateFrom ? new Date(this.formModel.dateFrom) : null;
    const finPeriode = this.formModel.dateTo ? new Date(this.formModel.dateTo) : null;

    if (emp.dateEmbauche && debutPeriode) {
      const dEmbauche = new Date(emp.dateEmbauche);
      if (!isNaN(dEmbauche.getTime()) && dEmbauche > debutPeriode) {
        if (finPeriode && dEmbauche > finPeriode) {
          this.formModel.workedDays = 0;
        } else {
          const jourArrivee = dEmbauche.getDate();
          const joursPresents = Math.max(1, Math.min(30, 30 - jourArrivee + 1));
          this.formModel.workedDays = joursPresents;
        }
      }
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
      this.recalculerJoursProrata();
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

    const isGratif = (this.formModel.typeSession || '').toUpperCase().includes('GRATIF');
    const bulletinDraft = {
      employeeId: emp.id,
      dateFrom: this.formModel.dateFrom,
      dateTo: this.formModel.dateTo,
      typeSession: isGratif ? 'GRATIFICATION' : this.formModel.typeSession,
      scheduledWorkingDays: this.formModel.scheduledWorkingDays,
      workedDays: this.formModel.workedDays,
      salaireBase: emp.salaireBase || 0,
      totalAvoirs: isGratif ? 0 : totalAvoirsActifs,
      totalPrecomptes: isGratif ? 0 : totalPrecomptesActifs,
      totalTropPercus: isGratif ? 0 : totalTropPercusActifs
    };
    this.previewCalcul = this.enrichBulletinData(
      bulletinDraft,
      isGratif ? null : this.empSalaryInfo,
      isGratif ? [] : this.empAvoirs,
      isGratif ? [] : this.empPrecomptes,
      isGratif ? [] : this.empTropPercus
    );
  }

  isSavingBulletin: boolean = false;

  enregistrerBulletin(): void {
    if (!this.previewCalcul) return;

    this.isSavingBulletin = true;

    const payload = {
      id: this.previewCalcul.id || undefined,
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
      next: (savedBulletin) => {
        this.isSavingBulletin = false;
        this.loadBulletins();
        this.closeModal();
      },
      error: (err) => {
        this.isSavingBulletin = false;
        const msg = err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || err?.message || 'Erreur inconnue';
        alert(`❌ Erreur lors de l'enregistrement du bulletin : ${msg}`);
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
    const totAvoirs = Number(this.editVariablesForm.primeExceptionnelle) || 0;
    const precompte = Number(this.editVariablesForm.precompteAvance) || 0;

    const payload: any = {
      workedDays,
      scheduledWorkingDays: scheduledDays,
      primeExceptionnelle: totAvoirs,
      totalAvoirs: totAvoirs,
      precompteAvance: precompte,
      totalPrecomptes: precompte,
      nombreHeuresSup: Number(this.editVariablesForm.nombreHeuresSup) || 0,
      motifAjustement: this.editVariablesForm.motifAjustement || ''
    };

    if (b.id) {
      this.http.put(`${environment.apiUrl}/bulletins/${b.id}`, payload).subscribe({
        next: () => {
          if (b.sessionPaieId) {
            this.http.post<any[]>(`${environment.apiUrl}/paie/sessions/${b.sessionPaieId}/generer`, [b.employeeId]).subscribe({
              next: () => this.loadBulletins(),
              error: () => this.loadBulletins()
            });
          } else {
            this.loadBulletins();
          }
        },
        error: () => this.loadBulletins()
      });
    }

    this.fermerModalModifierVariables();
  }

  fermerApercu(): void {
    this.selectedBulletin = null;
  }

  imprimerBulletin(b: BulletinIndividuelModel): void {
    if (b.id) {
      // Ouverture directe via l'URL native du backend (pas de blob URL, pas de blocage Chrome)
      this.bulletinPdfService.ouvrirBulletinDirect(b.id);
    } else {
      const filename = `bulletin-${b.matricule || 'paie'}-${b.dateFrom || 'mensuel'}.pdf`;
      this.genererPdfParPreview(b, filename);
    }
  }

  private genererPdfParPreview(b: BulletinIndividuelModel, filename: string): void {
    const enriched = this.enrichBulletinData(b);
    const dto: any = {
      code: enriched.code,
      employeeName: enriched.employeeName,
      matricule: enriched.matricule,
      fonction: enriched.fonction,
      gradeLibelle: enriched.grade,
      dateFrom: enriched.dateFrom,
      dateTo: enriched.dateTo,
      scheduledWorkingDays: enriched.scheduledWorkingDays,
      workedDays: enriched.workedDays,
      salaireBase: enriched.salaireBase,
      totalIndemnites: enriched.totalIndemnites,
      totalAvoirs: enriched.totalAvoirs,
      salaireBrut: enriched.salaireBrut,
      baseImposable: enriched.baseImposable,
      cotisationCnss: enriched.cotisationCnss,
      impotIuts: enriched.impotIuts,
      totalPrecomptes: enriched.totalPrecomptes,
      totalRetenues: enriched.totalRetenues,
      totalCotisationsPatronales: enriched.totalCotisationsPatronales,
      salaireNet: enriched.salaireNet,
      statut: enriched.statut,
      lines: (enriched.lines || []).map(l => ({
        code: l.code,
        libelle: l.name,
        name: l.name,
        typeLigne: l.retenue ? 'RETENUE' : 'GAIN',
        taux: l.rate,
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
}
