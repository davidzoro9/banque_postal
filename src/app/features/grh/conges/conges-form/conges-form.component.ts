import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';

@Component({
  selector: 'app-conges-form',
  templateUrl: './conges-form.component.html',
  styleUrls: ['./conges-form.component.scss'],
  standalone: false
})
export class CongesFormComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'grh')!;
  form!: FormGroup;
  saving = false;

  readonly typesConge = [
    { value: 'annuel',      label: 'Congé annuel' },
    { value: 'maladie',     label: 'Congé maladie' },
    { value: 'maternite',   label: 'Congé maternité' },
    { value: 'paternite',   label: 'Congé paternité' },
    { value: 'sans-solde',  label: 'Congé sans solde' },
    { value: 'exceptionnel',label: 'Congé exceptionnel' },
    { value: 'autre',       label: 'Autre' }
  ];

  get nbJours(): number {
    const debut = this.form?.get('dateDebut')?.value;
    const fin   = this.form?.get('dateFin')?.value;
    if (!debut || !fin) return 0;
    const d1 = new Date(debut);
    const d2 = new Date(fin);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private moduleNav: ModuleNavService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.form = this.fb.group({
      typeConge:  ['annuel', Validators.required],
      dateDebut:  ['', Validators.required],
      dateFin:    ['', Validators.required],
      motif:      [''],
      justificatif: ['']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.router.navigate(['/grh/conges']);
    }, 800);
  }

  cancel(): void { this.router.navigate(['/grh/conges']); }
}
