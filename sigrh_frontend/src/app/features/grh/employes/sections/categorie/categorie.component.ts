import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeIndemnity, EmployeeSalarySituation } from '../../models/employee.model';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss'],
  standalone: false
})
export class CategorieComponent implements OnInit {
  employee?: Employee;
  empId = '';
  situationSalarialeData?: EmployeeSalarySituation;
  indemnites: EmployeeIndemnity[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.isLoading = true;
    this.employeeService.getById(this.empId).subscribe({
      next: e => {
        if (!e) { this.router.navigate(['/grh/employes']); return; }
        this.employee = e;

        forkJoin({
          situation: this.employeeService.getSalarySituation(this.empId).pipe(catchError(() => of(null))),
          indemnites: this.employeeService.getEmployeeIndemnities(this.empId).pipe(catchError(() => of([])))
        }).subscribe({
          next: ({ situation, indemnites }) => {
            this.situationSalarialeData = situation || undefined;
            this.indemnites = indemnites || [];
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  get summary() {
    if (!this.employee) return null;
    const situation = this.situationSalarialeData;

    const grade = situation?.gradeLibelle || this.employee.grade || '';
    const categorie = situation?.categorieLibelle || this.employee.categoriePro || '';
    const echelon = situation?.echelonLibelle || this.employee.echelon || '';
    const salaireBase = situation?.salaireBase ?? this.employee.salaireBase ?? 0;

    const activeIndemnites = (this.indemnites || [])
      .filter(indemnite => indemnite.actif !== false);

    const computedTotalIndemnites = activeIndemnites.reduce((sum, ind) => sum + (Number(ind.montant) || 0), 0);
    const totalIndemnites = (situation?.totalIndemnites && situation.totalIndemnites > 0)
      ? situation.totalIndemnites
      : computedTotalIndemnites;

    return {
      grade,
      categorie,
      echelon,
      fonction: this.employee.fonction || '',
      salaireBase,
      totalIndemnites,
      indemnitesBareme: activeIndemnites.map(indemnite => ({
        id: indemnite.id,
        code: indemnite.typeIndemniteCode,
        typeIndemnite: indemnite.libelle || indemnite.typeIndemniteCode || 'Indemnité',
        libelle: indemnite.libelle,
        fonction: this.employee?.fonction || '',
        taux: Number(indemnite.montant) || 0
      }))
    };
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
