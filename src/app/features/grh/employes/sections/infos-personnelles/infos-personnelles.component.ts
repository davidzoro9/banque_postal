import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-infos-personnelles',
  templateUrl: './infos-personnelles.component.html',
  styleUrls: ['./infos-personnelles.component.scss'],
  standalone: false
})
export class InfosPersonnellesComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';

  readonly sexes = [{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nom:           [''],
      prenom:        [''],
      nomJeuneFille: [''],
      sexe:          ['M'],
      dateNaissance: [''],
      lieuNaissance: [''],
      nationalite:   [''],
      numeroCNI:     [''],
      adresse:       [''],
      ville:         [''],
      codePostal:    [''],
      pays:          [''],
      telephone:     [''],
      email:         ['', [Validators.email]]
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      nom: e.nom, prenom: e.prenom, nomJeuneFille: e.nomJeuneFille || '',
      sexe: e.sexe, dateNaissance: e.dateNaissance, lieuNaissance: e.lieuNaissance,
      nationalite: e.nationalite, numeroCNI: e.numeroCNI,
      adresse: e.adresse, ville: e.ville, codePostal: e.codePostal,
      pays: e.pays, telephone: e.telephone, email: e.email
    });
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom[0] || '')}${(this.employee.nom[0] || '')}`.toUpperCase();
  }

  save(next?: string): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;
    this.employeeService.update(this.empId, {
      nom: v.nom, prenom: v.prenom, nomJeuneFille: v.nomJeuneFille,
      sexe: v.sexe, dateNaissance: v.dateNaissance, lieuNaissance: v.lieuNaissance,
      nationalite: v.nationalite, numeroCNI: v.numeroCNI,
      adresse: v.adresse, ville: v.ville, codePostal: v.codePostal,
      pays: v.pays, telephone: v.telephone, email: v.email
    }).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goToFamille(): void { this.router.navigate(['/grh/employes', this.empId, 'famille']); }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
