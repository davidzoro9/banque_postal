import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EmployeeExemption } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-exonerations',
  templateUrl: './exonerations.component.html',
  styleUrls: ['./exonerations.component.scss'],
  standalone: false
})
export class ExonerationsComponent implements OnInit {
  employee?: Employee;
  exonerations: EmployeeExemption[] = [];
  empId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e?.id) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.employeeService.getEmployeeExemptions(this.empId).subscribe({
        next: rows => this.exonerations = rows || [],
        error: () => this.exonerations = []
      });
    });
  }

  get totalExonerations(): number {
    return this.exonerations.reduce((total, row) => total + (Number(row.montant) || 0), 0);
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${this.employee.prenom?.[0] || ''}${this.employee.nom?.[0] || ''}`.toUpperCase() || '??';
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
