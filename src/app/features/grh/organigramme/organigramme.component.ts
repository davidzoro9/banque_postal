import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DbRefService, RefItem } from '../../donnees-base/services/db-ref.service';
import { EmployeeService } from '../employes/services/employee.service';
import { Employee } from '../employes/models/employee.model';

export interface OrgNode {
  id?: string;
  code?: string;
  title: string;
  subtitle?: string;
  type: 'CA' | 'COMITE' | 'DG' | 'DGA' | 'SECRETARIAT' | 'DIR_CONTROLE' | 'DIRECTION' | 'DEPARTEMENT' | 'SERVICE';
  categoryLabel: string;
  icon: string;
  description?: string;
  functionalLink?: string;
  hierarchicalLink?: string;
  services?: RefItem[];
  colorTheme?: string;
}

@Component({
  selector: 'app-organigramme',
  templateUrl: './organigramme.component.html',
  styleUrls: ['./organigramme.component.scss'],
  standalone: false
})
export class OrganigrammeComponent implements OnInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;

  // Données réelles provenant de PostgreSQL
  directions: RefItem[] = [];
  departements: RefItem[] = [];
  services: RefItem[] = [];
  employees: Employee[] = [];

  // État de chargement et affichage
  isLoading = true;
  activeView: 'chart' | 'table' = 'chart';
  searchTerm = '';
  zoomLevel = 1;
  isFullScreen = false;

  // Nœud sélectionné pour le volet de détail (Drawer)
  selectedNode: OrgNode | null = null;
  selectedNodeEmployees: Employee[] = [];

  constructor(
    private dbRefService: DbRefService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;

    // Chargement parallèle des référentiels et des employés
    this.dbRefService.getItems('direction').subscribe({
      next: (dirs) => {
        this.directions = dirs || [];
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete()
    });

    this.dbRefService.getItems('departement').subscribe({
      next: (deps) => {
        this.departements = deps || [];
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete()
    });

    this.dbRefService.getItems('service').subscribe({
      next: (srvs) => {
        this.services = srvs || [];
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete()
    });

    this.employeeService.getAll().subscribe({
      next: (emps) => {
        this.employees = emps || [];
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete()
    });
  }

  private loadCounter = 0;
  private checkLoadingComplete(): void {
    this.loadCounter++;
    if (this.loadCounter >= 4) {
      this.isLoading = false;
    }
  }

  // ─── RÉCUPÉRATION DYNAMIQUE DES SERVICES POUR UNE DIRECTION ───────────────
  getServicesForDirection(dir: RefItem): RefItem[] {
    const dirId = dir.id ? String(dir.id) : '';
    const dirCode = (dir.code || '').trim().toUpperCase();
    const dirLibelle = (dir.libelle || dir.name || '').trim().toLowerCase();

    return this.services.filter(s => {
      // 1. Lien direct par ID
      if (s.directionId && dirId && String(s.directionId) === dirId) {
        return true;
      }
      // 2. Lien par libellé de direction
      if (s.directionLibelle && s.directionLibelle.trim().toLowerCase() === dirLibelle) {
        return true;
      }
      // 3. Mapping officiel BPBF par code de secours
      const sCode = (s.code || '').toUpperCase();
      if (dirCode === 'DIR_ENTREPRISES' && (sCode.includes('PME') || sCode.includes('GRANDES') || sCode.includes('INSTITUT'))) return true;
      if (dirCode === 'DIR_RESEAU' && (sCode.includes('AGENCE') || sCode.includes('CASH') || sCode.includes('MONETIQUE'))) return true;
      if (dirCode === 'DIR_ENGAGEMENTS' && (sCode.includes('ENGAG') || sCode.includes('CREDIT') || sCode.includes('PRECONTENTIEUX'))) return true;
      if (dirCode === 'DIR_OPERATIONS' && (sCode.includes('DOMESTIQUE') || sCode.includes('INTERNAT') || sCode.includes('OPS'))) return true;
      if (dirCode === 'DIR_JURIDIQUE' && (sCode.includes('JURIDIQUE') || sCode.includes('RECOUVREMENT') || sCode.includes('GOUV'))) return true;
      if (dirCode === 'DIR_DSI' && (sCode.includes('BD') || sCode.includes('SYSTEME') || sCode.includes('SUPPORT') || sCode.includes('APP'))) return true;
      if (dirCode === 'DIR_DAMG' && (sCode.includes('MOYEN') || sCode.includes('CAPITAL') || sCode.includes('HUMAIN') || sCode.includes('SEC'))) return true;
      if (dirCode === 'DIR_DFC' && (sCode.includes('COMPTA') || sCode.includes('CTRL') || sCode.includes('GESTION') || sCode.includes('FISC'))) return true;

      return false;
    });
  }

  getEmployeeRole(emp: Employee): string {
    if (!emp) return 'Collaborateur';
    const anyEmp = emp as any;
    if (typeof emp.fonction === 'string' && emp.fonction.trim()) return emp.fonction;
    if (anyEmp.fonctionLibelle) return anyEmp.fonctionLibelle;
    if (anyEmp.fonction?.name) return anyEmp.fonction.name;
    if (anyEmp.fonction?.libelle) return anyEmp.fonction.libelle;
    if (emp.poste && emp.poste.trim()) return emp.poste;
    if (anyEmp.emploiLibelle) return anyEmp.emploiLibelle;
    if (anyEmp.emploi?.name) return anyEmp.emploi.name;
    return 'Collaborateur';
  }

  // ─── RÉCUPÉRATION DES EMPLOYÉS AFFECTÉS À UNE UNITÉ ────────────────────────
  getEmployeesForUnit(
    unitType: OrgNode['type'],
    unitName: string,
    unitCode?: string,
    unitId?: string
  ): Employee[] {
    const nameLower = (unitName || '').toLowerCase().trim();
    const codeUpper = (unitCode || '').toUpperCase().trim();

    return this.employees.filter(e => {
      const anyEmp = e as any;

      // 1. DG
      if (unitType === 'DG') {
        const fn = this.getEmployeeRole(e).toLowerCase();
        return (fn.includes('directeur général') && !fn.includes('adjoint')) || fn === 'dg';
      }

      // 2. DGA
      if (unitType === 'DGA') {
        const fn = this.getEmployeeRole(e).toLowerCase();
        return fn.includes('directeur général adjoint') || fn.includes('dga');
      }

      // 3. Secrétariat de Direction
      if (unitType === 'SECRETARIAT') {
        const srv = (e.service || anyEmp.serviceLibelle || anyEmp.service?.name || '').toLowerCase();
        const fn = this.getEmployeeRole(e).toLowerCase();
        return srv.includes('secrétariat') || fn.includes('secrétaire');
      }

      // 4. Direction
      if (unitType === 'DIRECTION' || unitType === 'DIR_CONTROLE') {
        const dirName = (e.direction || anyEmp.directionLibelle || anyEmp.direction?.name || '').toLowerCase();
        const dirCode = (anyEmp.directionCode || anyEmp.direction?.code || '').toUpperCase();
        const dirId = String(e.directionId || anyEmp.direction?.id || '');
        if (unitId && dirId === unitId) return true;
        if (codeUpper && dirCode === codeUpper) return true;
        return dirName.includes(nameLower) || nameLower.includes(dirName);
      }

      // 5. Département
      if (unitType === 'DEPARTEMENT') {
        const depName = (e.departement || anyEmp.departmentLibelle || anyEmp.department?.name || '').toLowerCase();
        const depCode = (anyEmp.departmentCode || anyEmp.department?.code || '').toUpperCase();
        const depId = String(e.departmentId || anyEmp.department?.id || '');
        if (unitId && depId === unitId) return true;
        if (codeUpper && depCode === codeUpper) return true;
        return depName.includes(nameLower) || nameLower.includes(depName);
      }

      // 6. Service
      if (unitType === 'SERVICE') {
        const srvName = (e.service || anyEmp.serviceLibelle || anyEmp.service?.name || '').toLowerCase();
        const srvCode = (anyEmp.serviceCode || anyEmp.service?.code || '').toUpperCase();
        const srvId = String(e.serviceId || anyEmp.service?.id || '');
        if (unitId && srvId === unitId) return true;
        if (codeUpper && srvCode === codeUpper) return true;
        return srvName.includes(nameLower) || nameLower.includes(srvName);
      }

      return false;
    });
  }

  // ─── OUVERTURE DU TIROIR LATÉRAL (DRAWER) ─────────────────────────────────
  openNodeDetails(node: OrgNode): void {
    this.selectedNode = node;
    this.selectedNodeEmployees = this.getEmployeesForUnit(
      node.type,
      node.title,
      node.code,
      node.id
    );
  }

  closeDrawer(): void {
    this.selectedNode = null;
    this.selectedNodeEmployees = [];
  }

  navigateToEmployee(emp: Employee): void {
    if (emp && emp.id) {
      this.router.navigate(['/grh/employes', emp.id]);
    }
  }

  // ─── CONTRÔLES DE ZOOM ET PLEIN ÉCRAN ─────────────────────────────────────
  zoomIn(): void {
    if (this.zoomLevel < 1.6) {
      this.zoomLevel = Math.round((this.zoomLevel + 0.1) * 10) / 10;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel = Math.round((this.zoomLevel - 0.1) * 10) / 10;
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
  }

  toggleFullScreen(): void {
    this.isFullScreen = !this.isFullScreen;
  }

  printChart(): void {
    window.print();
  }

  // ─── FILTRAGE ET RECHERCHE ────────────────────────────────────────────────
  isSearchMatch(text: string): boolean {
    if (!this.searchTerm || !text) return false;
    return text.toLowerCase().includes(this.searchTerm.toLowerCase().trim());
  }

  // Helpers pour les noms des 10 colonnes officielles
  getDirectionByPattern(pattern: string): RefItem {
    const match = this.directions.find(d =>
      (d.code || '').toLowerCase().includes(pattern.toLowerCase()) ||
      (d.libelle || d.name || '').toLowerCase().includes(pattern.toLowerCase())
    );
    return match || {
      code: pattern.toUpperCase(),
      libelle: pattern,
      description: '',
      actif: true
    };
  }

  getDepartmentByPattern(pattern: string): RefItem {
    const match = this.departements.find(d =>
      (d.code || '').toLowerCase().includes(pattern.toLowerCase()) ||
      (d.libelle || d.name || '').toLowerCase().includes(pattern.toLowerCase())
    );
    return match || {
      code: pattern.toUpperCase(),
      libelle: pattern,
      description: '',
      actif: true
    };
  }
}
