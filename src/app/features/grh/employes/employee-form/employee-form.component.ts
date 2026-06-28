import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { DbRefService, RefItem } from '../../../donnees-base/services/db-ref.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  standalone: false
})
export class EmployeeFormComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'grh')!;
  form!: FormGroup;
  saving = false;

  readonly statuts = ['Actif', 'En congé', 'Suspendu', 'Retraité'];
  
  services$!: Observable<RefItem[]>;
  directions$!: Observable<RefItem[]>;
  contrats$!: Observable<RefItem[]>;
  departements$!: Observable<RefItem[]>;
  fonctions$!: Observable<RefItem[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private moduleNav: ModuleNavService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    
    this.services$ = this.dbRefService.getItems('service');
    this.directions$ = this.dbRefService.getItems('direction');
    this.contrats$ = this.dbRefService.getItems('type-contrat');
    this.departements$ = this.dbRefService.getItems('departement');
    this.fonctions$ = this.dbRefService.getItems('fonction');

    this.form = this.fb.group({
      nom:           [''],
      prenom:        [''],
      statut:        ['Actif'],
      poste:         [''],
      service:       [''],
      direction:     [''],
      departement:   [''],
      typeContrat:   ['CDI'],
      dateEmbauche:  ['']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;

    const data: Omit<Employee, 'id'> = {
      matricule:      this.employeeService.generateMatricule(),
      nom:            v.nom || '',
      prenom:         v.prenom || '',
      nomJeuneFille:  undefined,
      sexe:           'M',
      dateNaissance:  '',
      lieuNaissance:  '',
      nationalite:    '',
      numeroCNI:      '',
      adresse:        '',
      ville:          '',
      codePostal:     '',
      pays:           '',
      telephone:      '',
      email:          '',
      contactsUrgence: [],
      photo: undefined,
      conjoint: undefined,
      enfants: [],
      personnesCharge: [],
      poste:          v.poste || '',
      service:        v.service || '',
      direction:      v.direction || '',
      departement:    v.departement || '',
      dateEmbauche:   v.dateEmbauche || '',
      statut:         v.statut || 'Actif',
      typeContrat:    v.typeContrat || 'CDI',
      categoriePro: '', echelon: '', grade: '', niveau: '',
      primeLogement: 0, primeTransport: 0, primeResponsabilite: 0,
      autresIndemnites: [], exonerationsFiscales: [], exonerationsSociales: [], avantagesParticuliers: [],
      salaireBase: 0, salaireBrut: 0, modePaiement: 'Virement bancaire',
      documents: [], observations: '', evaluations: [], historiqueActions: []
    };

    this.employeeService.create(data).subscribe({
      next: (emp) => {
        this.saving = false;
        // On redirige vers infos-personnelles (l'étape suivante logicielle)
        this.router.navigate(['/grh/employes', emp.id, 'infos-personnelles']);
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  cancel(): void { this.router.navigate(['/grh/employes']); }
}
