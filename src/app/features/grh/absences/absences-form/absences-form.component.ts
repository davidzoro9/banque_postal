import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { AbsenceService } from '../services/absence.service';
import { AuthService } from '../../../../core/services/auth.service';

import { DbRefService, RefItem } from '../../../donnees-base/services/db-ref.service';
import { Observable, combineLatest, startWith, map } from 'rxjs';
import { EmployeeService } from '../../employes/services/employee.service';
import { Employee } from '../../employes/models/employee.model';

@Component({
  selector: 'app-absences-form',
  templateUrl: './absences-form.component.html',
  styleUrls: ['./absences-form.component.scss'],
  standalone: false
})
export class AbsencesFormComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'grh')!;
  form!: FormGroup;
  saving = false;
  typesAbsence$!: Observable<RefItem[]>;
  employees$!: Observable<Employee[]>;
  filteredEmployees$!: Observable<Employee[]>;

  readonly unitesDuree = [
    { value: 'heures', label: 'Heure(s)' },
    { value: 'jours',  label: 'Jour(s)' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private moduleNav: ModuleNavService,
    private absenceService: AbsenceService,
    private authService: AuthService,
    private dbRefService: DbRefService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.typesAbsence$ = this.dbRefService.getItems('type-conge');
    this.employees$ = this.employeeService.getAll();
    this.form = this.fb.group({
      employeSearch: [''],
      employe:       [''],
      typeAbsence:   [''],
      dateAbsence:   [''],
      duree:         [1],
      unite:         ['jours'],
      motif:         [''],
      justificatif:  ['']
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
    const user = this.authService.currentUser;
    const empName = val.employe || (user ? `${user.prenom} ${user.nom}` : 'Collaborateur');

    let dt = val.dateAbsence;
    if (dt instanceof Date) {
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      dt = `${year}-${month}-${day}`;
    }

    const dureeStr = `${val.duree || 0} ${val.unite === 'jours' ? 'jour(s)' : 'heure(s)'}`;

    const absenceData = {
      employe: empName,
      type: val.typeAbsence || '',
      date: dt || '',
      duree: dureeStr,
      motif: val.motif || '',
      statut: ((val.typeAbsence || '').toLowerCase().includes('injustif') ? 'Injustifiée' : 'En attente') as 'Justifiée' | 'Injustifiée' | 'En attente'
    };

    this.absenceService.create(absenceData).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/grh/absences']);
      },
      error: (err) => {
        this.saving = false;
        alert(err.message || 'Une erreur est survenue lors de l\'enregistrement.');
      }
    });
  }

  cancel(): void { this.router.navigate(['/grh/absences']); }
}
