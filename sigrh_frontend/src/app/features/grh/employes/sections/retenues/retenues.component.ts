import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-retenues',
  templateUrl: './retenues.component.html',
  styleUrls: ['./retenues.component.scss'],
  standalone: false
})
export class RetenuesComponent implements OnInit {
  employee?: Employee;
  empId = '';
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.form = this.fb.group({
      organismeRetraite: ['CNSS']
    });
  }

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.form.patchValue({
        organismeRetraite: e.organismeRetraite || 'CNSS'
      });
    });
  }

  get selectedOrganisme(): 'CARFO' | 'CNSS' {
    return (this.employee?.organismeRetraite as 'CARFO' | 'CNSS') || 'CNSS';
  }

  get montantBase(): number {
    return this.employee?.salaireBase || 0;
  }

  get montantBrut(): number {
    return this.employee?.salaireBrut || 0;
  }

  get retenueRetraite(): { libelle: string; montant: number; baseStr: string; tauxStr: string } {
    if (this.selectedOrganisme === 'CARFO') {
      return {
        libelle: 'Retenue CARFO (Caisse Autonome de Retraite des Fonctionnaires)',
        montant: Math.round(this.montantBase * 0.08),
        baseStr: `${new Intl.NumberFormat('fr-FR').format(this.montantBase)} (Salaire de base)`,
        tauxStr: '8.00 %'
      };
    } else {
      return {
        libelle: 'Cotisation Sociale CNSS (Part Agent - Caisse Nationale)',
        montant: Math.round(this.montantBrut * 0.055),
        baseStr: `${new Intl.NumberFormat('fr-FR').format(this.montantBrut)} (Salaire Brut)`,
        tauxStr: '5.50 %'
      };
    }
  }

  get totalRetenues(): number {
    return this.retenueRetraite.montant;
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  navTo(tabRoute: string): void {
    this.router.navigate(['/grh/employes', this.empId, tabRoute]);
  }

  save(nextRoute?: string): void {
    if (!this.employee) return;
    if (nextRoute) {
      this.router.navigate(['/grh/employes', this.empId, nextRoute]);
    } else {
      this.router.navigate(['/grh/employes', this.empId]);
    }
  }

  goBack(): void {
    this.router.navigate(['/grh/employes', this.empId]);
  }
}
