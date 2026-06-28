import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-famille',
  templateUrl: './famille.component.html',
  styleUrls: ['./famille.component.scss'],
  standalone: false
})
export class FamilleComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';
  hasConjoint = false;

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
      conjointNom:        [''],
      conjointPrenom:     [''],
      conjointDateNaiss:  [''],
      conjointProfession: [''],
      enfants:            this.fb.array([]),
      personnesCharge:    this.fb.array([])
    });
  }

  private patch(e: Employee): void {
    if (e.conjoint) {
      this.hasConjoint = true;
      this.form.patchValue({
        conjointNom:        e.conjoint.nom,
        conjointPrenom:     e.conjoint.prenom,
        conjointDateNaiss:  e.conjoint.dateNaissance || '',
        conjointProfession: e.conjoint.profession || ''
      });
    }
    e.enfants.forEach(enf => this.enfants.push(this.fb.group({
      nom:           [enf.nom],
      prenom:        [enf.prenom],
      dateNaissance: [enf.dateNaissance],
      sexe:          [enf.sexe || 'M']
    })));
    e.personnesCharge.forEach(p => this.personnesCharge.push(this.fb.group({
      nom:    [p.nom],
      prenom: [p.prenom],
      lien:   [p.lien]
    })));
  }

  get enfants(): FormArray { return this.form.get('enfants') as FormArray; }
  get personnesCharge(): FormArray { return this.form.get('personnesCharge') as FormArray; }

  addEnfant(): void {
    this.enfants.push(this.fb.group({
      nom: [''], prenom: [''],
      dateNaissance: [''], sexe: ['M']
    }));
  }
  removeEnfant(i: number): void { this.enfants.removeAt(i); }

  addPersonne(): void {
    this.personnesCharge.push(this.fb.group({
      nom: [''], prenom: [''], lien: ['']
    }));
  }
  removePersonne(i: number): void { this.personnesCharge.removeAt(i); }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom[0] || '')}${(this.employee.nom[0] || '')}`.toUpperCase();
  }

  save(next?: string): void {
    this.saving = true;
    const v = this.form.value;
    const payload: Partial<Employee> = {
      enfants: v.enfants,
      personnesCharge: v.personnesCharge,
      conjoint: this.hasConjoint ? {
        nom:           v.conjointNom,
        prenom:        v.conjointPrenom,
        dateNaissance: v.conjointDateNaiss,
        profession:    v.conjointProfession
      } : undefined
    };
    this.employeeService.update(this.empId, payload).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
