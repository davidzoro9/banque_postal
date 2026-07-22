import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  isEdit = false;
  empId?: string;

  readonly statuts = ['Actif', 'En congé', 'Suspendu', 'Retraité'];
  
  services$!: Observable<RefItem[]>;
  directions$!: Observable<RefItem[]>;
  contrats$!: Observable<RefItem[]>;
  departements$!: Observable<RefItem[]>;
  fonctions$!: Observable<RefItem[]>;
  employees$!: Observable<Employee[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private moduleNav: ModuleNavService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    
    this.services$ = this.dbRefService.getItems('service').pipe(map(list => list.filter(i => i.actif !== false)));
    this.directions$ = this.dbRefService.getItems('direction').pipe(map(list => list.filter(i => i.actif !== false)));
    this.contrats$ = this.dbRefService.getItems('type-contrat').pipe(map(list => list.filter(i => i.actif !== false)));
    this.departements$ = this.dbRefService.getItems('departement').pipe(map(list => list.filter(i => i.actif !== false)));
    this.fonctions$ = this.dbRefService.getItems('fonction').pipe(map(list => list.filter(i => i.actif !== false)));
    this.employees$ = this.employeeService.getAll();

    this.empId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.empId;

    this.form = this.fb.group({
      nom:                   ['', Validators.required],
      prenom:                ['', Validators.required],
      matricule:             ['', Validators.required],
      statut:                ['Actif'],
      poste:                 [''],
      service:               [''],
      direction:             [''],
      departement:           [''],
      typeContrat:           ['CDI'],
      dateEmbauche:          [''],
      emailPro:              [''],
      numeroPoste:           [''],
      directeurHierarchique: ['']
    });

    this.employeeService.getAll().subscribe(list => {
      if (!this.isEdit) {
        this.form.patchValue({
          matricule: this.employeeService.generateMatricule()
        });
      }
    });

    this.form.get('departement')?.valueChanges.subscribe(depLibelle => {
      if (depLibelle) {
        this.dbRefService.getItems('departement').subscribe(deps => {
          const matchedDep = deps.find(d => d.libelle === depLibelle);
          if (matchedDep && matchedDep.description) {
            this.form.patchValue({
              directeurHierarchique: matchedDep.description
            });
          }
        });
      }
    });

    if (this.isEdit && this.empId) {
      this.employeeService.getById(this.empId).subscribe(emp => {
        if (emp) {
          this.form.patchValue({
            nom:           emp.nom,
            prenom:        emp.prenom,
            matricule:     emp.matricule,
            statut:        emp.statut,
            poste:         emp.poste,
            service:       emp.service,
            direction:     emp.direction,
            departement:   emp.departement,
            typeContrat:   emp.typeContrat,
            dateEmbauche:  emp.dateEmbauche,
            emailPro:      (emp as any).emailPro || '',
            numeroPoste:   (emp as any).numeroPoste || '',
            directeurHierarchique: (emp as any).directeurHierarchique || ''
          });
        }
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;

    if (this.isEdit && this.empId) {
      this.employeeService.update(this.empId, {
        nom:           v.nom,
        prenom:        v.prenom,
        matricule:     v.matricule,
        statut:        v.statut,
        poste:         v.poste,
        service:       v.service,
        direction:     v.direction,
        departement:   v.departement,
        typeContrat:   v.typeContrat,
        dateEmbauche:  v.dateEmbauche,
        emailPro:      v.emailPro,
        numeroPoste:   v.numeroPoste,
        directeurHierarchique: v.directeurHierarchique
      } as any).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/grh/employes', this.empId]);
        },
        error: (err) => {
          this.saving = false;
          console.error(err);
          alert(err.message || 'Erreur lors de la modification de l\'employé.');
        }
      });
    } else {
      const data: Omit<Employee, 'id'> = {
        matricule:      v.matricule,
        nom:            v.nom,
        prenom:         v.prenom,
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

      // Add our custom properties dynamically to data object
      (data as any).emailPro = v.emailPro;
      (data as any).numeroPoste = v.numeroPoste;
      (data as any).directeurHierarchique = v.directeurHierarchique;

      this.employeeService.create(data).subscribe({
        next: (emp) => {
          this.saving = false;
          this.router.navigate(['/grh/employes', emp.id, 'infos-personnelles']);
        },
        error: (err) => {
          this.saving = false;
          console.error(err);
          alert(err.message || 'Erreur lors de la création de l\'employé. Vérifiez que les champs obligatoires (Nom, Prénom, Matricule) sont valides.');
        }
      });
    }
  }

  cancel(): void {
    if (this.isEdit && this.empId) {
      this.router.navigate(['/grh/employes', this.empId]);
    } else {
      this.router.navigate(['/grh/employes']);
    }
  }
}
