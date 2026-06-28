import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss'],
  standalone: false
})
export class CategorieComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';
  
  categories$!: Observable<RefItem[]>;
  echelons$!: Observable<RefItem[]>;
  grades$!: Observable<RefItem[]>;

  readonly niveaux = ['Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4', 'Niveau 5'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    
    this.categories$ = this.dbRefService.getItems('categorie');
    this.echelons$ = this.dbRefService.getItems('echelon');
    this.grades$ = this.dbRefService.getItems('grade');

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      categoriePro: [''],
      echelon:      [''],
      grade:        [''],
      niveau:       ['']
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      categoriePro: e.categoriePro,
      echelon:      e.echelon,
      grade:        e.grade,
      niveau:       e.niveau
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
      categoriePro: v.categoriePro,
      echelon:      v.echelon,
      grade:        v.grade,
      niveau:       v.niveau
    }).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
