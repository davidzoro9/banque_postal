import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;

      forkJoin({
        situation: this.employeeService.getSalarySituation(this.empId),
        indemnites: this.employeeService.getEmployeeIndemnities(this.empId)
      }).subscribe({
        next: ({ situation, indemnites }) => {
          this.situationSalarialeData = situation;
          this.indemnites = indemnites || [];
        },
        error: () => {}
      });
    });
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  get summary() {
    const situation = this.situationSalarialeData;
    if (!this.employee || !situation) return null;

    return {
      grade: situation.gradeLibelle || '',
      categorie: situation.categorieLibelle || '',
      echelon: situation.echelonLibelle || '',
      fonction: this.employee.fonction || '',
      salaireBase: situation.salaireBase || 0,
      totalIndemnites: situation.totalIndemnites || 0,
      indemnitesBareme: this.indemnites
        .filter(indemnite => indemnite.actif !== false)
        .map(indemnite => ({
          id: indemnite.id,
          code: indemnite.typeIndemniteCode,
          typeIndemnite: indemnite.libelle,
          libelle: indemnite.libelle,
          fonction: this.employee?.fonction || '',
          taux: Number(indemnite.montant) || 0
        }))
    };
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
