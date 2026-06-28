import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, ModePaiement } from '../../models/employee.model';

import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Observable } from 'rxjs';

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
  empId = '';
  modesPaiement$!: Observable<RefItem[]>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.modesPaiement$ = this.dbRefService.getItems('mode-paiement');
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
    });
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
    this.form.patchValue({
      salaireBase:  e.salaireBase,
      salaireBrut:  e.salaireBrut,
      modePaiement: e.modePaiement,
      banque:       e.banque || '',
      iban:         e.iban || ''
    });
  }

  get showBancaire(): boolean {
    return this.form.get('modePaiement')?.value === 'Virement bancaire';
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom[0] || '')}${(this.employee.nom[0] || '')}`.toUpperCase();
  }

  save(next?: string): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;
    this.employeeService.update(this.empId, {
      salaireBase:  +v.salaireBase,
      salaireBrut:  +v.salaireBrut,
      modePaiement: v.modePaiement,
      banque:       v.banque,
      iban:         v.iban
    }).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
