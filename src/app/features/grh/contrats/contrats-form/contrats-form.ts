import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { ContratService, Contrat } from '../services/contrat.service';
import { EmployeeService } from '../../employes/services/employee.service';
import { Employee } from '../../employes/models/employee.model';
import { DbRefService, RefItem } from '../../../donnees-base/services/db-ref.service';
import { Observable, combineLatest } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-contrats-form',
  templateUrl: './contrats-form.html',
  styleUrls: ['./contrats-form.scss'],
  standalone: false
})
export class ContratsForm implements OnInit {
  module = APP_MODULES.find(m => m.id === 'grh')!;
  form!: FormGroup;
  saving = false;

  employees$!: Observable<Employee[]>;
  filteredEmployees$!: Observable<Employee[]>;
  contrats$!: Observable<RefItem[]>;
  services$!: Observable<RefItem[]>;
  readonly statuts = ['Actif', 'À renouveler', 'Expiré'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private moduleNav: ModuleNavService,
    private contratService: ContratService,
    private dbRefService: DbRefService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.employees$ = this.employeeService.getAll();
    this.contrats$ = this.dbRefService.getItems('type-contrat').pipe(map(list => list.filter(i => i.actif !== false)));
    this.services$ = this.dbRefService.getItems('service').pipe(map(list => list.filter(i => i.actif !== false)));

    this.form = this.fb.group({
      employeSearch: [''],
      employe:   [''],
      type:      ['CDI'],
      dateDebut: [''],
      dateFin:   [''],
      service:   [''],
      statut:    ['Actif']
    });

    this.filteredEmployees$ = combineLatest([
      this.employees$,
      this.form.get('employeSearch')!.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([emps, term]) => {
        const t = (term || '').toLowerCase().trim();
        if (!t) return emps;
        return emps.filter(e =>
          (e.prenom || '').toLowerCase().includes(t) ||
          (e.nom || '').toLowerCase().includes(t) ||
          (e.matricule || '').toLowerCase().includes(t)
        );
      })
    );
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const val = this.form.value;

    let start = val.dateDebut;
    if (start instanceof Date) {
      const year = start.getFullYear();
      const month = String(start.getMonth() + 1).padStart(2, '0');
      const day = String(start.getDate()).padStart(2, '0');
      start = `${year}-${month}-${day}`;
    }

    let end = val.dateFin;
    if (end instanceof Date) {
      const year = end.getFullYear();
      const month = String(end.getMonth() + 1).padStart(2, '0');
      const day = String(end.getDate()).padStart(2, '0');
      end = `${year}-${month}-${day}`;
    }

    const contratData: Omit<Contrat, 'id'> = {
      employe: val.employe || '',
      type: val.type || '',
      dateDebut: start || '',
      dateFin: end || '',
      service: val.service || '',
      statut: val.statut || 'Actif'
    };

    this.contratService.create(contratData).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/grh/contrats']);
      },
      error: (err) => {
        this.saving = false;
        alert(err.message || 'Une erreur est survenue lors de l\'enregistrement.');
      }
    });
  }

  cancel(): void { this.router.navigate(['/grh/contrats']); }
}
