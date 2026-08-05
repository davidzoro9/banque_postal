import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { calculateOfficialIUTS } from '../../../../../core/utils/iuts-calculator.utils';

export interface IndemniteDetailItem {
  libelle: string;
  montant: number;
}

export interface SalaryCalcDetails {
  salaireBase: number;
  indemnitesList: IndemniteDetailItem[];
  totalIndemnite: number;
  remunerationBrut: number;
  montantCnss: number;
  fondsSoutienPat: number;
  partPatronaleCnss: number;
  crrae: number;
  salaireBrutImposable: number;
  abattementForfaitaire: number;
  totalExoneration: number;
  baseImposable: number;
  iuts0Charge: number;
  montantCharge: number;
  iutsAvecCharge: number;
  mutuel: number;
  totalRetenue: number;
  remunerationTotale: number;
  netAPayer: number;
}

@Component({
  selector: 'app-salaire',
  templateUrl: './salaire.component.html',
  styleUrls: ['./salaire.component.scss'],
  standalone: false
})
export class SalaireComponent implements OnInit {
  employee?: Employee;
  empId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
    });
  }

  get calc(): SalaryCalcDetails {
    const e = this.employee;
    if (!e) {
      return {
        salaireBase: 0, indemnitesList: [], totalIndemnite: 0, remunerationBrut: 0,
        montantCnss: 0, fondsSoutienPat: 0, partPatronaleCnss: 0, crrae: 0,
        salaireBrutImposable: 0, abattementForfaitaire: 0, totalExoneration: 0,
        baseImposable: 0, iuts0Charge: 0, montantCharge: 0, iutsAvecCharge: 0,
        mutuel: 0, totalRetenue: 0, remunerationTotale: 0, netAPayer: 0
      };
    }

    const base = e.salaireBase || 304282;

    const list: IndemniteDetailItem[] = [];
    if (e.primeLogement && e.primeLogement > 0) {
      list.push({ libelle: 'Indemnité de Logement', montant: e.primeLogement });
    }
    if (e.primeTransport && e.primeTransport > 0) {
      list.push({ libelle: 'Indemnité de Transport', montant: e.primeTransport });
    }
    if (e.primeResponsabilite && e.primeResponsabilite > 0) {
      list.push({ libelle: 'Indemnité de Responsabilité', montant: e.primeResponsabilite });
    }
    if (e.autresIndemnites && e.autresIndemnites.length > 0) {
      e.autresIndemnites.forEach(item => {
        if (item.montant > 0) {
          list.push({ libelle: item.libelle, montant: item.montant || 0 });
        }
      });
    }

    if (list.length === 0) {
      list.push({ libelle: 'Indemnité de Logement', montant: 50000 });
      list.push({ libelle: 'Indemnité de Transport', montant: 25000 });
      list.push({ libelle: 'Indemnité de Responsabilité', montant: 20000 });
    }

    const nCharges = (e.enfants?.length || 0) + (e.conjoint ? 1 : 0);

    const official = calculateOfficialIUTS(base, list, {
      vehiculeFourni: e.vehiculeFourni,
      logementFourni: e.logementFourni,
      nombreChargesFamille: nCharges,
      inclureFSP: true,
      inclureCRRAE: true
    });

    const partPatronaleCnss = Math.round(official.remunerationTotale * 0.16);
    const mutuel = 0;

    return {
      salaireBase: official.salaireBase,
      indemnitesList: list,
      totalIndemnite: official.totalIndemnites,
      remunerationBrut: official.remunerationTotale,
      montantCnss: official.cotisationCNSS,
      fondsSoutienPat: official.fondsSoutienPat,
      partPatronaleCnss,
      crrae: official.crrae,
      salaireBrutImposable: official.salaireBrut,
      abattementForfaitaire: official.abattementForfaitaire,
      totalExoneration: official.totalExonerations,
      baseImposable: official.baseImposable,
      iuts0Charge: official.iutsBrut,
      montantCharge: official.reductionFamilleMontant,
      iutsAvecCharge: official.iutsNet,
      mutuel,
      totalRetenue: official.totalRetenues,
      remunerationTotale: official.remunerationTotale,
      netAPayer: official.salaireNet
    };
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
