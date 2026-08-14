import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EmployeeSalaryInformation } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-salaire',
  templateUrl: './salaire.component.html',
  styleUrls: ['./salaire.component.scss'],
  standalone: false
})
export class SalaireComponent implements OnInit {
  employee?: Employee;
  information?: EmployeeSalaryInformation;
  empId = '';
  error = '';
  message = '';
  recalculating = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe({
      next: employee => {
        if (!employee?.id) { this.router.navigate(['/grh/employes']); return; }
        this.employee = employee;
        this.loadInformation();
      },
      error: () => this.router.navigate(['/grh/employes'])
    });
  }

  private loadInformation(): void {
    this.employeeService.getSalaryInformation(this.empId).subscribe({
      next: information => this.information = information,
      error: () => this.error = 'Impossible de charger les informations salariales.'
    });
  }

  recalculate(): void {
    if (this.recalculating) return;
    this.recalculating = true;
    this.error = '';
    this.message = '';
    this.employeeService.recalculateSalaryInformation(this.empId).subscribe({
      next: information => {
        this.information = information;
        this.recalculating = false;
        this.message = 'Résumé salarial recalculé et enregistré.';
      },
      error: err => {
        this.recalculating = false;
        this.error = err?.error?.message || 'Impossible de recalculer le résumé salarial.';
      }
    });
  }

  baseLabel(base: string): string {
    if (base === 'SALAIRE_BASE') return 'Salaire de base';
    if (base === 'BASE_IMPOSABLE') return 'Base imposable';
    return 'Rémunération brute';
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${this.employee.prenom?.[0] || ''}${this.employee.nom?.[0] || ''}`.toUpperCase() || '??';
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
