import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { AbsenceService } from '../services/absence.service';
import { AuthService } from '../../../../core/services/auth.service';

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
    private moduleNav: ModuleNavService,
    private absenceService: AbsenceService,
    private authService: AuthService
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

    const val = this.form.value;
    const user = this.authService.currentUser;
    const empName = user ? `${user.prenom} ${user.nom}` : 'Collaborateur';

    const typeMap: Record<string, string> = {
      'justifiee': 'Absence justifiée',
      'injustifiee': 'Absence injustifiée',
      'retard': 'Retard',
      'maladie': 'Maladie',
      'accident': 'Accident de travail',
      'autre': 'Autre'
    };

    const typeStr = typeMap[val.typeAbsence] || val.typeAbsence;
    const dureeStr = `${val.duree} ${val.unite === 'jours' ? 'jour(s)' : 'heure(s)'}`;

    const absenceData = {
      employe: empName,
      type: typeStr,
      date: val.dateAbsence,
      duree: dureeStr,
      motif: val.motif,
      statut: (val.typeAbsence === 'injustifiee' ? 'Injustifiée' : 'En attente') as 'Justifiée' | 'Injustifiée' | 'En attente'
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
