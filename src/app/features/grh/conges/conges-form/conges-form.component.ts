import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { CongeService } from '../services/conge.service';
import { AuthService } from '../../../../core/services/auth.service';

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
    { value: 'Congé annuel',      label: 'Congé annuel' },
    { value: 'Congé maladie',     label: 'Congé maladie' },
    { value: 'Congé maternité',   label: 'Congé maternité' },
    { value: 'Congé paternité',   label: 'Congé paternité' },
    { value: 'Congé sans solde',  label: 'Congé sans solde' },
    { value: 'Congé exceptionnel',label: 'Congé exceptionnel' },
    { value: 'Autre',             label: 'Autre' }
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
    private moduleNav: ModuleNavService,
    private congeService: CongeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.form = this.fb.group({
      typeConge:  ['Congé annuel', Validators.required],
      dateDebut:  ['', Validators.required],
      dateFin:    ['', Validators.required],
      motif:      [''],
      justificatif: ['']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    
    const val = this.form.value;
    const user = this.authService.currentUser;
    const empName = user ? `${user.prenom} ${user.nom}` : 'Collaborateur';

    const congeData = {
      employe: empName,
      type: val.typeConge,
      dateDebut: val.dateDebut,
      dateFin: val.dateFin,
      nbJours: this.nbJours,
      statut: 'En attente' as const
    };

    this.congeService.create(congeData).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/grh/conges']);
      },
      error: (err) => {
        this.saving = false;
        alert(err.message || 'Une erreur est survenue lors de la soumission de la demande.');
      }
    });
  }

  cancel(): void { this.router.navigate(['/grh/conges']); }
}
