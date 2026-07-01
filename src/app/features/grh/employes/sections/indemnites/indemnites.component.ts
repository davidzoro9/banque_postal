import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-indemnites',
  templateUrl: './indemnites.component.html',
  styleUrls: ['./indemnites.component.scss'],
  standalone: false
})
export class IndemnitesComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';
  indemnites$!: Observable<RefItem[]>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  typesList: RefItem[] = [];

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.indemnites$ = this.dbRefService.getItems('type-indemnite');
    
    this.dbRefService.getItems('type-indemnite').subscribe(list => {
      this.typesList = list;
    });

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      autresIndemnites:   this.fb.array([])
    });
  }

  private patch(e: Employee): void {
    if (e.autresIndemnites && e.autresIndemnites.length > 0) {
      e.autresIndemnites.forEach(item => this.autres.push(this.fb.group({
        code:    [item.code || ''],
        libelle: [item.libelle || ''],
        montant: [item.montant || 0]
      })));
    }
  }

  get autres(): FormArray { return this.form.get('autresIndemnites') as FormArray; }
  
  addAutre(): void {
    this.autres.push(this.fb.group({
      code:    [''],
      libelle: [''],
      montant: [0]
    }));
  }

  onTypeChange(index: number, code: string): void {
    const matched = this.typesList.find(t => t.code === code);
    if (matched) {
      this.autres.at(index).patchValue({
        libelle: matched.libelle
      });
    }
  }

  removeAutre(i: number): void { this.autres.removeAt(i); }

  get totalIndemnites(): number {
    const v = this.form.value;
    return (v.autresIndemnites as {montant: number}[]).reduce((s, i) => s + (+i.montant || 0), 0);
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
      autresIndemnites:    v.autresIndemnites
    }).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
