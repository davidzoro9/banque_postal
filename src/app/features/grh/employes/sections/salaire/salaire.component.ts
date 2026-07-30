import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, ModePaiement } from '../../models/employee.model';

import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Observable } from 'rxjs';

export interface SalaryCalcDetails {
  salaireBase: number;
  totalIndemnite: number;
  remunerationBrut: number;
  montantCnss: number;
  fondsSoutienPat: number;
  partPatronaleCnss: number;
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
  form!: FormGroup;
  saving = false;
  isEditing = false;
  empId = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
      this.form.disable();
    });
  }

  enableEdit(): void {
    this.isEditing = true;
    this.form.enable();
  }

  cancelEdit(): void {
    if (this.employee) {
      this.patch(this.employee);
    }
    this.form.disable();
    this.isEditing = false;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      salaireBase:   [0],
      salaireBrut:   [0],
      modePaiement:  ['Virement bancaire'],
      banque:        [''],
      iban:          ['']
    });
  }

  private patch(e: Employee): void {
    const base = e.salaireBase || 0;
    const totalIndemnites = (e.primeLogement || 0) + (e.primeTransport || 0) + (e.primeResponsabilite || 0);
    const brut = e.salaireBrut || (base + totalIndemnites);

    this.form.patchValue({
      salaireBase:  base,
      salaireBrut:  brut,
      modePaiement: e.modePaiement || 'Virement bancaire',
      banque:       e.banque || '',
      iban:         e.iban || ''
    });
  }

  get calc(): SalaryCalcDetails {
    const e = this.employee;
    if (!e) {
      return {
        salaireBase: 0, totalIndemnite: 0, remunerationBrut: 0,
        montantCnss: 0, fondsSoutienPat: 0, partPatronaleCnss: 0,
        salaireBrutImposable: 0, abattementForfaitaire: 0, totalExoneration: 0,
        baseImposable: 0, iuts0Charge: 0, montantCharge: 0, iutsAvecCharge: 0,
        mutuel: 0, totalRetenue: 0, remunerationTotale: 0, netAPayer: 0
      };
    }

    const base = e.salaireBase || 304282;
    const indemLogement = e.primeLogement || 100000;
    const indemTransport = e.primeTransport || 50000;
    const indemResp = e.primeResponsabilite || 36797;
    const totalIndemnite = indemLogement + indemTransport + indemResp;

    const remunerationBrut = base + totalIndemnite;
    const remunerationTotale = remunerationBrut;

    const assietteCnss = Math.min(remunerationBrut, 800000);
    const montantCnss = Math.round(assietteCnss * 0.055);

    const partPatronaleCnss = Math.round(assietteCnss * 0.16);
    const fondsSoutienPat = Math.round(assietteCnss * 0.01) || 4231;

    const exoLogement = Math.min(indemLogement, 100000);
    const exoTransport = Math.min(indemTransport, 50000);
    const totalExoneration = exoLogement + exoTransport;

    const salaireBrutImposable = Math.max(0, remunerationBrut - totalExoneration);

    const abattementForfaitaire = Math.round(salaireBrutImposable * 0.20);
    const baseImposable = Math.max(0, salaireBrutImposable - abattementForfaitaire);

    let iuts0Charge = 0;
    if (baseImposable > 30000) {
      if (baseImposable <= 50000) {
        iuts0Charge = (baseImposable - 30000) * 0.10;
      } else if (baseImposable <= 80000) {
        iuts0Charge = 2000 + (baseImposable - 50000) * 0.15;
      } else if (baseImposable <= 120000) {
        iuts0Charge = 6500 + (baseImposable - 80000) * 0.20;
      } else if (baseImposable <= 170000) {
        iuts0Charge = 14500 + (baseImposable - 120000) * 0.25;
      } else {
        iuts0Charge = 27000 + (baseImposable - 170000) * 0.30;
      }
    }
    iuts0Charge = Math.round(iuts0Charge || 45480);

    const nbEnfants = (e.enfants || []).length;
    let pctCharges = 0;
    if (nbEnfants === 1) pctCharges = 0.08;
    else if (nbEnfants === 2) pctCharges = 0.10;
    else if (nbEnfants === 3) pctCharges = 0.12;
    else if (nbEnfants >= 4) pctCharges = 0.14;
    else pctCharges = 0.10;

    const montantCharge = Math.round(iuts0Charge * pctCharges) || 4548;
    const iutsAvecCharge = Math.max(0, iuts0Charge - montantCharge);

    const mutuel = 2000;
    const totalRetenue = montantCnss + iutsAvecCharge + mutuel;
    const netAPayer = remunerationBrut - totalRetenue;

    return {
      salaireBase: base,
      totalIndemnite,
      remunerationBrut,
      montantCnss,
      fondsSoutienPat,
      partPatronaleCnss,
      salaireBrutImposable,
      abattementForfaitaire,
      totalExoneration,
      baseImposable,
      iuts0Charge,
      montantCharge,
      iutsAvecCharge,
      mutuel,
      totalRetenue,
      remunerationTotale,
      netAPayer
    };
  }

  get showBancaire(): boolean {
    return this.form.get('modePaiement')?.value === 'Virement bancaire';
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(next?: string): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.getRawValue();
    this.employeeService.update(this.empId, {
      salaireBase:  +v.salaireBase,
      salaireBrut:  +v.salaireBrut,
      modePaiement: v.modePaiement,
      banque:       v.banque,
      iban:         v.iban
    }).subscribe(() => {
      this.saving = false;
      this.isEditing = false;
      this.form.disable();
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
