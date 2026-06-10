import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-indemnites',
  templateUrl: './indemnites.component.html',
  styleUrls: ['./indemnites.component.scss'],
  standalone: false
})
export class IndemnitesComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';

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
      primeLogement:      [0, [Validators.required, Validators.min(0)]],
      primeTransport:     [0, [Validators.required, Validators.min(0)]],
      primeResponsabilite:[0, [Validators.required, Validators.min(0)]],
      autresIndemnites:   this.fb.array([])
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      primeLogement:       e.primeLogement,
      primeTransport:      e.primeTransport,
      primeResponsabilite: e.primeResponsabilite
    });
    e.autresIndemnites.forEach(item => this.autres.push(this.fb.group({
      libelle: [item.libelle, Validators.required],
      montant: [item.montant, [Validators.required, Validators.min(0)]]
    })));
  }

  get autres(): FormArray { return this.form.get('autresIndemnites') as FormArray; }
  addAutre(): void {
    this.autres.push(this.fb.group({
      libelle: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(0)]]
    }));
  }
  removeAutre(i: number): void { this.autres.removeAt(i); }

  get totalIndemnites(): number {
    const v = this.form.value;
    const autresTotal = (v.autresIndemnites as {montant: number}[]).reduce((s, i) => s + (+i.montant || 0), 0);
    return (+v.primeLogement || 0) + (+v.primeTransport || 0) + (+v.primeResponsabilite || 0) + autresTotal;
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
      primeLogement:       +v.primeLogement,
      primeTransport:      +v.primeTransport,
      primeResponsabilite: +v.primeResponsabilite,
      autresIndemnites:    v.autresIndemnites
    }).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
