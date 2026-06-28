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
  empId = '';
  
  services$!: Observable<RefItem[]>;
  directions$!: Observable<RefItem[]>;
  contrats$!: Observable<RefItem[]>;
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
    this.services$ = this.dbRefService.getItems('service');
    this.directions$ = this.dbRefService.getItems('direction');
    this.contrats$ = this.dbRefService.getItems('type-contrat');
    this.departements$ = this.dbRefService.getItems('departement');
    this.fonctions$ = this.dbRefService.getItems('fonction');

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      poste:        [''],
      service:      [''],
      direction:    [''],
      departement:  [''],
      typeContrat:  ['CDI'],
      dateEmbauche: [''],
      statut:       ['Actif']
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      poste: e.poste, service: e.service, direction: e.direction, departement: e.departement,
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
      poste: v.poste, service: v.service, direction: v.direction, departement: v.departement,
      typeContrat: v.typeContrat, dateEmbauche: v.dateEmbauche, statut: v.statut
    }).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
