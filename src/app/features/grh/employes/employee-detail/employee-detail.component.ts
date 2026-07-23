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
  isComplete: (e: Employee) => boolean;
}

export const EMPLOYEE_SECTIONS: SectionDef[] = [
  { id: 'infos-personnelles', title: 'Informations personnelles', subtitle: 'État civil, coordonnées, contacts urgence', icon: 'person', route: 'infos-personnelles', isComplete: e => !!(e.nom && e.adresse && e.telephone) },
  { id: 'infos-pro', title: 'Poste & Structure', subtitle: 'Fonction, service, direction, département, statut', icon: 'work', route: 'infos-pro', isComplete: e => !!(e.poste || e.service) },
  { id: 'famille', title: 'Famille', subtitle: 'Conjoint, enfants, personnes à charge', icon: 'family_restroom', route: 'famille', isComplete: _ => true },
  { id: 'categorie', title: 'Catégorie', subtitle: 'Catégorie professionnelle, grade, échelon', icon: 'military_tech', route: 'categorie', isComplete: e => !!(e.categoriePro) },
  { id: 'indemnites', title: 'Indemnités', subtitle: 'Primes de logement, transport, responsabilité', icon: 'paid', route: 'indemnites', isComplete: e => e.primeLogement > 0 || e.primeTransport > 0 || e.autresIndemnites.length > 0 },
  { id: 'exonerations', title: 'Exonérations', subtitle: 'Exonérations fiscales, sociales et avantages', icon: 'receipt_long', route: 'exonerations', isComplete: e => (e.exonerationsFiscales || []).length > 0 || (e.exonerationsSociales || []).length > 0 || (e.avantagesParticuliers || []).length > 0 },
  { id: 'salaire', title: 'Informations sur le salaire', subtitle: 'Salaire de base, brut, compte bancaire', icon: 'account_balance_wallet', route: 'salaire', isComplete: e => e.salaireBase > 0 },
  { id: 'dossier', title: 'Dossier individuel', subtitle: 'Contrats, diplômes, pièces administratives', icon: 'folder_open', route: 'dossier', isComplete: e => e.documents.length > 0 },
  { id: 'notes-rh', title: 'Notes RH', subtitle: 'Observations, évaluations, historique des actions', icon: 'note_alt', route: 'notes-rh', isComplete: e => !!(e.observations) || e.evaluations.length > 0 }
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

  get completedCount(): number {
    if (!this.employee) return 0;
    return this.sections.filter(s => s.isComplete(this.employee!)).length;
  }

  get progressPercent(): number {
    return Math.round((this.completedCount / this.sections.length) * 100);
  }
}

