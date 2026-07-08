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
      membresFamille: this.fb.array([])
    });
  }

  private patch(e: Employee): void {
    // 1. Charge Conjoint
    if (e.conjoint && (e.conjoint.nom || e.conjoint.prenom)) {
      this.membresFamille.push(this.fb.group({
        nom:    [e.conjoint.nom],
        prenom: [e.conjoint.prenom],
        lien:   ['Conjoint']
      }));
    }

    // 2. Charge Enfants
    if (e.enfants && e.enfants.length > 0) {
      e.enfants.forEach(enf => {
        this.membresFamille.push(this.fb.group({
          nom:    [enf.nom],
          prenom: [enf.prenom],
          lien:   ['Enfant']
        }));
      });
    }

    // 3. Charge Personnes à charge
    if (e.personnesCharge && e.personnesCharge.length > 0) {
      e.personnesCharge.forEach(p => {
        this.membresFamille.push(this.fb.group({
          nom:    [p.nom],
          prenom: [p.prenom],
          lien:   [p.lien || 'Autre']
        }));
      });
    }
  }

  get membresFamille(): FormArray {
    return this.form.get('membresFamille') as FormArray;
  }

  addMembre(): void {
    this.membresFamille.push(this.fb.group({
      nom:    [''],
      prenom: [''],
      lien:   ['Enfant']
    }));
  }

  removeMembre(i: number): void {
    this.membresFamille.removeAt(i);
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(next?: string): void {
    this.saving = true;
    const v = this.form.value;

    const list: any[] = v.membresFamille || [];
    let conjoint: any = null;
    const enfants: any[] = [];
    const personnesCharge: any[] = [];

    list.forEach(m => {
      if (m.lien === 'Conjoint') {
        conjoint = { nom: m.nom, prenom: m.prenom };
      } else if (m.lien === 'Enfant') {
        enfants.push({ nom: m.nom, prenom: m.prenom, dateNaissance: '', sexe: 'M' });
      } else {
        personnesCharge.push({ nom: m.nom, prenom: m.prenom, lien: m.lien });
      }
    });

    const payload: Partial<Employee> = {
      conjoint: conjoint || undefined,
      enfants: enfants,
      personnesCharge: personnesCharge
    };

    this.employeeService.update(this.empId, payload).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
