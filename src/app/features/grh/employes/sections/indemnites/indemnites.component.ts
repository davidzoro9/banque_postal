import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EmployeeIndemnity } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-indemnites',
  templateUrl: './indemnites.component.html',
  styleUrls: ['./indemnites.component.scss'],
  standalone: false
})
export class IndemnitesComponent implements OnInit {
  employee?: Employee;
  indemnites: EmployeeIndemnity[] = [];
  empId = '';
  avantageSaved = false;

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
      this.loadIndemnities();
    });
  }

  private loadIndemnities(): void {
    this.employeeService.getEmployeeIndemnities(this.empId).subscribe({
      next: rows => this.indemnites = (rows || []).filter(row => row.actif !== false),
      error: () => this.indemnites = []
    });
  }

  get totalIndemnites(): number {
    return this.indemnites.reduce((total, row) => total + (Number(row.montant) || 0), 0);
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${this.employee.prenom?.[0] || ''}${this.employee.nom?.[0] || ''}`.toUpperCase() || '??';
  }

  toggleVehicule(): void {
    if (!this.employee) return;
    const vehiculeFourni = !this.employee.vehiculeFourni;
    this.employeeService.update(this.empId, { vehiculeFourni }).subscribe(updated => {
      this.employee = updated;
      this.showAvantageSaved();
      this.loadIndemnities();
    });
  }

  toggleLogement(): void {
    if (!this.employee) return;
    const logementFourni = !this.employee.logementFourni;
    this.employeeService.update(this.empId, { logementFourni }).subscribe(updated => {
      this.employee = updated;
      this.showAvantageSaved();
      this.loadIndemnities();
    });
  }

  private showAvantageSaved(): void {
    this.avantageSaved = true;
    setTimeout(() => this.avantageSaved = false, 3000);
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
