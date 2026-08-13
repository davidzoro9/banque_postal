import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  Employee,
  EmployeeExemption,
  EmployeeIndemnity,
  EmployeeSalaryInformation,
  EmployeeSalarySituation
} from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

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

const EMPTY_CALC: SalaryCalcDetails = {
  salaireBase: 0, indemnitesList: [], totalIndemnite: 0, remunerationBrut: 0,
  montantCnss: 0, fondsSoutienPat: 0, partPatronaleCnss: 0, crrae: 0,
  salaireBrutImposable: 0, abattementForfaitaire: 0, totalExoneration: 0,
  baseImposable: 0, iuts0Charge: 0, montantCharge: 0, iutsAvecCharge: 0,
  mutuel: 0, totalRetenue: 0, remunerationTotale: 0, netAPayer: 0
};

@Component({
  selector: 'app-salaire',
  templateUrl: './salaire.component.html',
  styleUrls: ['./salaire.component.scss'],
  standalone: false
})
export class SalaireComponent implements OnInit {
  employee?: Employee;
  salaryInformation?: EmployeeSalaryInformation;
  empId = '';
  calc: SalaryCalcDetails = { ...EMPTY_CALC };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e?.id) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      forkJoin({
        information: this.employeeService.getSalaryInformation(this.empId),
        situation: this.employeeService.getSalarySituation(this.empId),
        indemnities: this.employeeService.getEmployeeIndemnities(this.empId),
        exemptions: this.employeeService.getEmployeeExemptions(this.empId)
      }).subscribe(({ information, situation, indemnities, exemptions }) => {
        this.salaryInformation = information;
        this.calc = this.buildViewModel(situation, indemnities || [], exemptions || []);
      });
    });
  }

  private buildViewModel(
    situation: EmployeeSalarySituation,
    indemnities: EmployeeIndemnity[],
    exemptions: EmployeeExemption[]
  ): SalaryCalcDetails {
    const list = indemnities
      .filter(row => row.actif !== false)
      .map(row => ({ libelle: row.libelle || row.typeIndemniteCode || '', montant: Number(row.montant) || 0 }));
    const totalExoneration = exemptions.reduce((total, row) => total + (Number(row.montant) || 0), 0);
    const salaireBrut = Number(situation.salaireBrut) || 0;

    return {
      ...EMPTY_CALC,
      salaireBase: Number(situation.salaireBase) || 0,
      indemnitesList: list,
      totalIndemnite: Number(situation.totalIndemnites) || 0,
      remunerationBrut: salaireBrut,
      salaireBrutImposable: salaireBrut,
      totalExoneration,
      baseImposable: Math.max(0, salaireBrut - totalExoneration),
      remunerationTotale: salaireBrut,
      netAPayer: 0
    };
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${this.employee.prenom?.[0] || ''}${this.employee.nom?.[0] || ''}`.toUpperCase() || '??';
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
