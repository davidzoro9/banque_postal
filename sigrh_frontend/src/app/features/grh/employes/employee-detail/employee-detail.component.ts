import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, STATUT_COLORS, StatutEmploye } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';

export interface SectionDef {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  route: string;
}

export const EMPLOYEE_SECTIONS: SectionDef[] = [
  { id: 'infos-personnelles', title: 'Informations personnelles', subtitle: 'État civil, coordonnées & éducation', icon: 'person', route: 'infos-personnelles' },
  { id: 'infos-pro', title: 'Informations professionnelles', subtitle: 'Affectation, fonction & statut', icon: 'work', route: 'infos-pro' },
  { id: 'famille', title: 'Famille', subtitle: 'Conjoint, enfants & ayants droit', icon: 'family_restroom', route: 'famille' },
  { id: 'situation-salariale', title: 'Situation salariale', subtitle: 'Catégorie, échelon & barème', icon: 'military_tech', route: 'situation-salariale' },
  { id: 'indemnites', title: 'Indemnités', subtitle: 'Primes & indemnités calculées', icon: 'paid', route: 'indemnites' },
  { id: 'exonerations', title: 'Exonérations', subtitle: 'Exonérations fiscales & sociales', icon: 'receipt_long', route: 'exonerations' },
  // { id: 'retenues', title: 'Retenues', subtitle: 'Cotisations et retenues salariales', icon: 'remove_circle', route: 'retenues' },
  { id: 'salaire', title: 'Informations salariales', subtitle: 'Mode de paiement & compte bancaire', icon: 'account_balance_wallet', route: 'salaire' },
  { id: 'dossier', title: 'Dossier individuel', subtitle: 'Pièces jointes & documents RH', icon: 'folder_open', route: 'dossier' },
  { id: 'notes-rh', title: 'Notes RH', subtitle: 'Évaluations, sanctions & observations', icon: 'note_alt', route: 'notes-rh' }
];

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  standalone: false
})
export class EmployeeDetailComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'grh')!;
  employee: Employee | undefined;
  loading = true;
  readonly sections = EMPLOYEE_SECTIONS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private moduleNav: ModuleNavService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    const id = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(id).subscribe(emp => {
      this.employee = emp;
      this.loading = false;
    });
  }

  navigateTo(sectionRoute: string): void {
    this.router.navigate(['/grh/employes', this.employee!.id, sectionRoute]);
  }

  back(): void { this.router.navigate(['/grh/employes']); }

  getInitials(): string {
    if (!this.employee) return '';
    const p = this.employee.prenom?.[0] || '';
    const n = this.employee.nom?.[0] || '';
    return `${p}${n}`.toUpperCase() || '??';
  }

  getAvatarColor(): string {
    if (!this.employee || !this.employee.nom || !this.employee.prenom) return '#0060B3';
    const c = ['#0060B3','#1B3A6B','#0060B3','#004080','#1B4B9A','#FFC700','#004080','#CC8800'];
    return c[(this.employee.nom.charCodeAt(0) + this.employee.prenom.charCodeAt(0)) % c.length];
  }

  getStatutStyle(statut: StatutEmploye) {
    return STATUT_COLORS[statut] || { background: '#f1f3f4', color: '#5f6368' };
  }
}

