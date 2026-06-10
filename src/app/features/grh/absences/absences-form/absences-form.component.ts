import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';

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

  readonly typesAbsence = [
    { value: 'justifiee',   label: 'Absence justifiée' },
    { value: 'injustifiee', label: 'Absence injustifiée' },
    { value: 'retard',      label: 'Retard' },
    { value: 'maladie',     label: 'Maladie' },
    { value: 'accident',    label: 'Accident de travail' },
    { value: 'autre',       label: 'Autre' }
  ];

  readonly unitesDuree = [
    { value: 'heures', label: 'Heure(s)' },
    { value: 'jours',  label: 'Jour(s)' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private moduleNav: ModuleNavService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.form = this.fb.group({
      typeAbsence:   ['justifiee', Validators.required],
      dateAbsence:   ['', Validators.required],
      duree:         [1, [Validators.required, Validators.min(1)]],
      unite:         ['jours', Validators.required],
      motif:         ['', Validators.required],
      justificatif:  ['']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.router.navigate(['/grh/absences']);
    }, 800);
  }

  cancel(): void { this.router.navigate(['/grh/absences']); }
}
