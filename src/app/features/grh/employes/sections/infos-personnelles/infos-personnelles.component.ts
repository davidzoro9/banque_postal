import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
      nom:           ['', Validators.required],
      prenom:        ['', Validators.required],
      nomJeuneFille: [''],
      sexe:          ['M', Validators.required],
      dateNaissance: ['', Validators.required],
      lieuNaissance: ['', Validators.required],
      nationalite:   ['', Validators.required],
      numeroCNI:     ['', Validators.required],
      adresse:       ['', Validators.required],
      ville:         ['', Validators.required],
      codePostal:    [''],
      pays:          ['', Validators.required],
      telephone:     ['', Validators.required],
      email:         ['', [Validators.required, Validators.email]],
      contactsUrgence: this.fb.array([])
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
    e.contactsUrgence.forEach(c => this.contacts.push(this.fb.group({
      nom: [c.nom, Validators.required], prenom: [c.prenom, Validators.required],
      lien: [c.lien, Validators.required], telephone: [c.telephone, Validators.required]
    })));
    if (this.contacts.length === 0) this.addContact();
  }

  get contacts(): FormArray { return this.form.get('contactsUrgence') as FormArray; }
  addContact(): void {
    this.contacts.push(this.fb.group({
      nom: ['', Validators.required], prenom: ['', Validators.required],
      lien: ['', Validators.required], telephone: ['', Validators.required]
    }));
  }
  removeContact(i: number): void { if (this.contacts.length > 1) this.contacts.removeAt(i); }

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
      pays: v.pays, telephone: v.telephone, email: v.email,
      contactsUrgence: v.contactsUrgence
    }).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
