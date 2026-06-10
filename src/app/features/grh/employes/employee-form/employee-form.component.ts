import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
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

  readonly sexes = [{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private moduleNav: ModuleNavService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.form = this.fb.group({
      nom:           ['', Validators.required],
      prenom:        ['', Validators.required],
      nomJeuneFille: [''],
      sexe:          ['M', Validators.required],
      dateNaissance: ['', Validators.required],
      lieuNaissance: ['', Validators.required],
      nationalite:   ['Burkinabè', Validators.required],
      numeroCNI:     ['', Validators.required],
      adresse:       ['', Validators.required],
      ville:         ['', Validators.required],
      codePostal:    [''],
      pays:          ['Burkina Faso', Validators.required],
      telephone:     ['', Validators.required],
      email:         ['', [Validators.required, Validators.email]],
      contactsUrgence: this.fb.array([this.newContact()])
    });
  }

  newContact(): FormGroup {
    return this.fb.group({
      nom:       ['', Validators.required],
      prenom:    ['', Validators.required],
      lien:      ['', Validators.required],
      telephone: ['', Validators.required]
    });
  }

  get contacts(): FormArray { return this.form.get('contactsUrgence') as FormArray; }
  addContact(): void { this.contacts.push(this.newContact()); }
  removeContact(i: number): void { if (this.contacts.length > 1) this.contacts.removeAt(i); }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;

    const data: Omit<Employee, 'id'> = {
      matricule:      this.employeeService.generateMatricule(),
      nom:            v.nom,
      prenom:         v.prenom,
      nomJeuneFille:  v.nomJeuneFille || undefined,
      sexe:           v.sexe,
      dateNaissance:  v.dateNaissance,
      lieuNaissance:  v.lieuNaissance,
      nationalite:    v.nationalite,
      numeroCNI:      v.numeroCNI,
      adresse:        v.adresse,
      ville:          v.ville,
      codePostal:     v.codePostal,
      pays:           v.pays,
      telephone:      v.telephone,
      email:          v.email,
      contactsUrgence: v.contactsUrgence,
      photo: undefined,
      conjoint: undefined,
      enfants: [],
      personnesCharge: [],
      poste: '', service: '', direction: '', dateEmbauche: '',
      statut: 'Actif', typeContrat: 'CDI',
      categoriePro: '', echelon: '', grade: '', niveau: '',
      primeLogement: 0, primeTransport: 0, primeResponsabilite: 0,
      autresIndemnites: [], exonerationsFiscales: [], exonerationsSociales: [], avantagesParticuliers: [],
      salaireBase: 0, salaireBrut: 0, modePaiement: 'Virement bancaire',
      documents: [], observations: '', evaluations: [], historiqueActions: []
    };

    this.employeeService.create(data).subscribe(emp => {
      this.saving = false;
      this.router.navigate(['/grh/employes', emp.id]);
    });
  }

  cancel(): void { this.router.navigate(['/grh/employes']); }
}
