import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Employee, StatutEmploye } from '../../models/employee.model';

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
  isEditing = false;
  isCreationMode = false;
  empId = '';
  
  services$!: Observable<RefItem[]>;
  directions$!: Observable<RefItem[]>;
  departements$!: Observable<RefItem[]>;
  fonctions$!: Observable<RefItem[]>;

  readonly statuts: StatutEmploye[] = ['Actif', 'Inactif', 'Suspendu', "Période d'essai", 'Congé maladie', 'Détaché'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.isCreationMode = this.route.snapshot.queryParamMap.get('mode') === 'creation';
    this.isEditing = this.isCreationMode;

    this.services$ = this.dbRefService.getItems('service');
    this.directions$ = this.dbRefService.getItems('direction');
    this.departements$ = this.dbRefService.getItems('departement');
    this.fonctions$ = this.dbRefService.getItems('fonction');

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
      if (!this.isCreationMode) {
        this.form.disable();
      }
    });
  }

  enableEdit(): void {
    this.isEditing = true;
    this.form.enable();
  }

  cancelEdit(): void {
    if (this.employee) {
      this.patch(this.employee);
    }
    this.form.disable();
    this.isEditing = false;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      poste:        [''],
      service:      [''],
      direction:    [''],
      departement:  [''],
      statut:       ['Actif'],
      dateEmbauche: ['']
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      poste: e.poste, service: e.service, direction: e.direction, departement: e.departement,
      statut: e.statut, dateEmbauche: e.dateEmbauche
    });
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(next?: string): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.getRawValue();
    this.employeeService.update(this.empId, {
      poste: v.poste, service: v.service, direction: v.direction, departement: v.departement,
      statut: v.statut, dateEmbauche: v.dateEmbauche
    }).subscribe(() => {
      this.saving = false;
      if (this.isCreationMode && next) {
        this.router.navigate(['/grh/employes', this.empId, next], { queryParams: { mode: 'creation' } });
      } else {
        this.isEditing = false;
        this.form.disable();
        this.router.navigate(['/grh/employes', this.empId]);
      }
    });
  }

  goToContrats(): void { this.router.navigate(['/grh/contrats']); }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
