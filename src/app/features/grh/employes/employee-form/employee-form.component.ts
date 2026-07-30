import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  standalone: false
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;
  empId?: string;

  readonly sexes = [
    { value: 'M', label: 'Masculin' },
    { value: 'F', label: 'Féminin' }
  ];

  readonly villes = [
    'Ouagadougou',
    'Bobo-Dioulasso',
    'Koudougou',
    'Banfora',
    'Manga',
    'Fada N\'Gourma',
    'Ouahigouya',
    'Dédougou',
    'Kaya',
    'Tenkodogo',
    'Autre...'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.empId;

    this.form = this.fb.group({
      nom:           ['', Validators.required],
      prenom:        ['', Validators.required],
      nomJeuneFille: [''],
      sexe:          ['M'],
      dateNaissance: [''],
      lieuNaissance: ['Ouagadougou'],
      nationalite:   ['Burkinabè'],
      numeroCNI:     [''],
      adresse:       [''],
      ville:         ['Ouagadougou'],
      codePostal:    [''],
      pays:          ['Burkina Faso'],
      telephone:     ['']
    });

    if (this.isEdit && this.empId) {
      this.employeeService.getById(this.empId).subscribe(emp => {
        if (emp) {
          this.form.patchValue({
            nom:           emp.nom,
            prenom:        emp.prenom,
            nomJeuneFille: emp.nomJeuneFille || '',
            sexe:          emp.sexe || 'M',
            dateNaissance: emp.dateNaissance || '',
            lieuNaissance: emp.lieuNaissance || 'Ouagadougou',
            nationalite:   emp.nationalite || 'Burkinabè',
            numeroCNI:     emp.numeroCNI || '',
            adresse:       emp.adresse || '',
            ville:         emp.ville || 'Ouagadougou',
            codePostal:    emp.codePostal || '',
            pays:          emp.pays || 'Burkina Faso',
            telephone:     emp.telephone || ''
          });
        }
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.value;

    let dob = val.dateNaissance;
    if (dob instanceof Date) {
      const year = dob.getFullYear();
      const month = String(dob.getMonth() + 1).padStart(2, '0');
      const day = String(dob.getDate()).padStart(2, '0');
      dob = `${year}-${month}-${day}`;
    }

    if (this.isEdit && this.empId) {
      this.employeeService.update(this.empId, {
        nom:           val.nom,
        prenom:        val.prenom,
        nomJeuneFille: val.nomJeuneFille,
        sexe:          val.sexe,
        dateNaissance: dob,
        lieuNaissance: val.lieuNaissance,
        nationalite:   val.nationalite,
        numeroCNI:     val.numeroCNI,
        adresse:       val.adresse,
        ville:         val.ville,
        codePostal:    val.codePostal,
        pays:          val.pays,
        telephone:     val.telephone
      }).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/grh/employes', this.empId, 'infos-pro']);
        },
        error: () => this.saving = false
      });
    } else {
      const newMatricule = this.employeeService.generateMatricule();
      const emailGenerated = `${(val.prenom || '').toLowerCase().trim().replace(/\s+/g, '.')}.${(val.nom || '').toLowerCase().trim().replace(/\s+/g, '.')}@bpbf.bf`;
      
      const data: Partial<Employee> = {
        matricule: newMatricule,
        nom: val.nom,
        prenom: val.prenom,
        nomJeuneFille: val.nomJeuneFille,
        sexe: val.sexe || 'M',
        dateNaissance: dob || '',
        lieuNaissance: val.lieuNaissance || 'Ouagadougou',
        nationalite: val.nationalite || 'Burkinabè',
        numeroCNI: val.numeroCNI || '',
        adresse: val.adresse || '',
        ville: val.ville || 'Ouagadougou',
        codePostal: val.codePostal || '',
        pays: val.pays || 'Burkina Faso',
        telephone: val.telephone || '',
        email: emailGenerated,
        emailPro: emailGenerated,
        poste: '',
        service: '',
        direction: '',
        statut: 'Actif',
        typeContrat: 'CDI',
        categoriePro: 'C1',
        grade: 'GROUPE I',
        echelon: 'E1',
        salaireBase: 95945,
        primeLogement: 25000,
        primeTransport: 25000,
        autresIndemnites: [],
        documents: [],
        evaluations: [],
        enfants: [],
        personnesCharge: [],
        dateEmbauche: new Date().toISOString().split('T')[0]
      };

      this.employeeService.create(data as any).subscribe({
        next: (created) => {
          this.saving = false;
          // Redirection vers le formulaire Informations professionnelles en mode création
          this.router.navigate(['/grh/employes', created.id, 'infos-pro'], { queryParams: { mode: 'creation' } });
        },
        error: () => this.saving = false
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
