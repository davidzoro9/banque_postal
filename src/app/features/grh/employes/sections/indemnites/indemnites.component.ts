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
  savingAvantage = false;
  toastMessage = '';
  togglingIndemniteId: number | string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe({
      next: e => {
        if (!e?.id) { this.router.navigate(['/grh/employes']); return; }
        this.employee = e;
        this.loadIndemnities();
      },
      error: () => this.router.navigate(['/grh/employes'])
    });
  }

  loadIndemnities(): void {
    this.employeeService.getEmployeeIndemnities(this.empId).subscribe({
      next: rows => this.indemnites = rows || [],
      error: () => this.indemnites = []
    });
  }

  get totalIndemnites(): number {
    return this.indemnites
      .filter(row => row.actif !== false)
      .reduce((total, row) => total + (Number(row.montant) || 0), 0);
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${this.employee.prenom?.[0] || ''}${this.employee.nom?.[0] || ''}`.toUpperCase() || '??';
  }

  toggleVehicule(): void {
    if (!this.employee || this.savingAvantage) return;
    this.savingAvantage = true;
    const vehiculeFourni = !this.employee.vehiculeFourni;
    this.employeeService.updateAvantages(this.empId, { vehiculeFourni }).subscribe({
      next: updated => {
        this.employee = updated;
        this.savingAvantage = false;
        this.showToast(vehiculeFourni
          ? 'Véhicule de fonction attribué : indemnité transport déduite automatiquement.'
          : 'Véhicule de fonction retiré : indemnité transport réactivée.');
        this.loadIndemnities();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du véhicule:', err);
        this.savingAvantage = false;
        this.showToast('Erreur lors de la mise à jour du véhicule.');
      }
    });
  }

  toggleLogement(): void {
    if (!this.employee || this.savingAvantage) return;
    this.savingAvantage = true;
    const logementFourni = !this.employee.logementFourni;
    this.employeeService.updateAvantages(this.empId, { logementFourni }).subscribe({
      next: updated => {
        this.employee = updated;
        this.savingAvantage = false;
        this.showToast(logementFourni
          ? 'Logement de fonction attribué : indemnité logement déduite automatiquement.'
          : 'Logement de fonction retiré : indemnité logement réactivée.');
        this.loadIndemnities();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du logement:', err);
        this.savingAvantage = false;
        this.showToast('Erreur lors de la mise à jour du logement.');
      }
    });
  }

  toggleIndemnite(item: EmployeeIndemnity): void {
    if (this.togglingIndemniteId) return;
    this.togglingIndemniteId = item.id;
    this.employeeService.toggleIndemnite(this.empId, item.id).subscribe({
      next: updated => {
        item.actif = updated.actif;
        this.togglingIndemniteId = null;
        const msg = updated.actif !== false
          ? `Indemnité « ${item.libelle} » réactivée avec succès.`
          : `Indemnité « ${item.libelle} » retirée avec succès.`;
        this.showToast(msg);
        this.loadIndemnities();
        this.employeeService.getById(this.empId).subscribe(e => { if (e) this.employee = e; });
      },
      error: (err) => {
        console.error('Erreur bascule indemnité:', err);
        this.togglingIndemniteId = null;
        this.showToast('Erreur lors de la modification de l\'indemnité.');
      }
    });
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    this.avantageSaved = true;
    setTimeout(() => this.avantageSaved = false, 4000);
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
