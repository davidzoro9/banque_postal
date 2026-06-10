import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee, StatutEmploye, TypeContrat } from '../../models/employee.model';

@Component({
  selector: 'app-infos-pro',
  templateUrl: './infos-pro.component.html',
  styleUrls: ['./infos-pro.component.scss'],
  standalone: false
})
export class InfosProComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';
  services: string[] = [];

  readonly statuts: StatutEmploye[] = ['Actif', 'Inactif', 'Suspendu', "Période d'essai", 'Congé maladie', 'Détaché'];
  readonly contrats: TypeContrat[] = ['CDI', 'CDD', 'Stage', 'Prestation', 'Apprentissage'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.services = this.employeeService.getServices();
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      poste:        ['', Validators.required],
      service:      ['', Validators.required],
      direction:    [''],
      typeContrat:  ['CDI', Validators.required],
      dateEmbauche: ['', Validators.required],
      statut:       ['Actif', Validators.required]
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      poste: e.poste, service: e.service, direction: e.direction,
      typeContrat: e.typeContrat, dateEmbauche: e.dateEmbauche, statut: e.statut
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
      poste: v.poste, service: v.service, direction: v.direction,
      typeContrat: v.typeContrat, dateEmbauche: v.dateEmbauche, statut: v.statut
    }).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
