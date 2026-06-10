import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-exonerations',
  templateUrl: './exonerations.component.html',
  styleUrls: ['./exonerations.component.scss'],
  standalone: false
})
export class ExonerationsComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';
  newAvantage = '';

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
      exonerationsFiscales:  this.fb.array([]),
      exonerationsSociales:  this.fb.array([]),
      avantagesParticuliers: this.fb.array([])
    });
  }

  private patch(e: Employee): void {
    e.exonerationsFiscales.forEach(x => this.fiscales.push(this.fb.group({
      libelle: [x.libelle, Validators.required], montant: [x.montant, [Validators.required, Validators.min(0)]]
    })));
    e.exonerationsSociales.forEach(x => this.sociales.push(this.fb.group({
      libelle: [x.libelle, Validators.required], montant: [x.montant, [Validators.required, Validators.min(0)]]
    })));
    e.avantagesParticuliers.forEach(av => this.avantages.push(this.fb.control(av, Validators.required)));
  }

  get fiscales(): FormArray  { return this.form.get('exonerationsFiscales') as FormArray; }
  get sociales(): FormArray  { return this.form.get('exonerationsSociales') as FormArray; }
  get avantages(): FormArray { return this.form.get('avantagesParticuliers') as FormArray; }

  addFiscale(): void {
    this.fiscales.push(this.fb.group({ libelle: ['', Validators.required], montant: [0, [Validators.required, Validators.min(0)]] }));
  }
  removeFiscale(i: number): void { this.fiscales.removeAt(i); }

  addSociale(): void {
    this.sociales.push(this.fb.group({ libelle: ['', Validators.required], montant: [0, [Validators.required, Validators.min(0)]] }));
  }
  removeSociale(i: number): void { this.sociales.removeAt(i); }

  addAvantage(): void {
    const v = this.newAvantage.trim();
    if (!v) return;
    this.avantages.push(this.fb.control(v, Validators.required));
    this.newAvantage = '';
  }
  removeAvantage(i: number): void { this.avantages.removeAt(i); }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom[0] || '')}${(this.employee.nom[0] || '')}`.toUpperCase();
  }

  save(next?: string): void {
    this.saving = true;
    const v = this.form.value;
    this.employeeService.update(this.empId, {
      exonerationsFiscales:  v.exonerationsFiscales,
      exonerationsSociales:  v.exonerationsSociales,
      avantagesParticuliers: v.avantagesParticuliers
    }).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
