import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DbRefService, RefItem } from '../../donnees-base/services/db-ref.service';
import { EmployeeService } from '../employes/services/employee.service';
import { Employee } from '../employes/models/employee.model';

export interface OrgTreeNode {
  id: string;
  title: string;
  subtitle: string;
  matricule?: string;
  unit?: string;
  email?: string;
  telephone?: string;
  badgeLabel?: string;
  badgeClass?: string;
  avatarInitials: string;
  avatarColor: string;
  photo?: string;
  level: number;
  type: 'EXECUTIVE' | 'DIRECTION' | 'DEPARTEMENT' | 'SERVICE' | 'EMPLOYEE';
  isManager: boolean;
  directReportsCount: number;
  totalSubordinatesCount: number;
  expanded: boolean;
  isSearchMatch?: boolean;
  parentId?: string | null;
  parentName?: string | null;
  data: any; // Raw Employee or RefItem
  children: OrgTreeNode[];
}

@Component({
  selector: 'app-organigramme',
  templateUrl: './organigramme.component.html',
  styleUrls: ['./organigramme.component.scss'],
  standalone: false
})
export class OrganigrammeComponent implements OnInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;

  // Données PostgreSQL réelles
  directions: RefItem[] = [];
  departements: RefItem[] = [];
  services: RefItem[] = [];
  employees: Employee[] = [];

  // État de chargement et vue active
  isLoading = true;
  activeTab: 'managerial' | 'structural' | 'directory' = 'managerial';
  searchTerm = '';
  zoomLevel = 1.0;
  isFullScreen = false;

  // Arbres hiérarchiques construits dynamiquement
  managerialTree: OrgTreeNode[] = [];
  unassignedEmployees: Employee[] = [];
  structuralTree: OrgTreeNode[] = [];

  // Volet latéral de détails (Drawer)
  selectedNode: OrgTreeNode | null = null;
  selectedNodeEmployees: Employee[] = [];

  // Modal 1 : Modifier le rattachement / supérieur
  isReassignModalOpen = false;
  reassignTarget: Employee | null = null;
  reassignSupervisorId: string | null = null;
  reassignDirectionId: string | null = null;
  reassignDepartmentId: string | null = null;
  reassignServiceId: string | null = null;
  supervisorSearchQuery = '';
  isSavingReassign = false;
  reassignSuccessMsg = '';

  // Modal 2 : Rattacher un collaborateur sous un manager
  isAttachModalOpen = false;
  attachTargetManager: Employee | null = null;
  attachEmployeeId: string | null = null;
  isSavingAttach = false;

  // Modal 3 : Modifier le rattachement d'une unité structurelle
  isUnitModalOpen = false;
  unitTarget: RefItem | null = null;
  unitTargetType: 'service' | 'departement' | 'direction' = 'service';
  unitParentDirectionId: string | null = null;
  unitParentDepartmentId: string | null = null;
  isSavingUnit = false;

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
    let loadedCount = 0;
    const checkDone = () => {
      loadedCount++;
      if (loadedCount >= 4) {
        this.isLoading = false;
        this.rebuildTrees();
      }
    };

    this.dbRefService.getItems('direction').subscribe({
      next: (dirs) => { this.directions = dirs || []; checkDone(); },
      error: () => checkDone()
    });

    this.dbRefService.getItems('departement').subscribe({
      next: (deps) => { this.departements = deps || []; checkDone(); },
      error: () => checkDone()
    });

    this.dbRefService.getItems('service').subscribe({
      next: (srvs) => { this.services = srvs || []; checkDone(); },
      error: () => checkDone()
    });

    this.employeeService.getAll().subscribe({
      next: (emps) => { this.employees = emps || []; checkDone(); },
      error: () => checkDone()
    });
  }

  // ─── RECONSTRUCTION DES ARBRES HIÉRARCHIQUES ─────────────────────────────
  rebuildTrees(): void {
    this.buildManagerialTree();
    this.buildStructuralTree();
    this.applySearchFilter();
  }

  // Helper pour extraire le rôle / fonction propre
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

  getInitials(nom: string, prenom: string): string {
    const n = (nom || '').trim().charAt(0).toUpperCase();
    const p = (prenom || '').trim().charAt(0).toUpperCase();
    return (n + p) || 'BP';
  }

  getAvatarColor(role: string, level: number): string {
    const r = (role || '').toLowerCase();
    if (r.includes('directeur général') || r.includes('directrice générale') || r.includes('pca')) return '#b45309'; // Gold / Bronze royal
    if (r.includes('adjoint') || r.includes('dga')) return '#0f766e'; // Teal
    if (r.includes('directeur') || r.includes('directrice')) return '#002b66'; // Navy BPBF
    if (r.includes('chef') || r.includes('responsable')) return '#0284c7'; // Bleu ciel
    if (level <= 1) return '#002b66';
    if (level === 2) return '#0284c7';
    return '#475569'; // Slate
  }

  // ─── 1. ARBRE MANAGÉRIAL (STYLE ODOO) ────────────────────────────────────
  buildManagerialTree(): void {
    const allEmps = [...this.employees];
    const empMap = new Map<string, Employee>();
    allEmps.forEach(e => empMap.set(String(e.id), e));

    // Déterminer les racines :
    // 1) Employés dont le rôle contient "directeur général" ou "pca"
    // 2) Employés avec superviseurId vide/null ET qui sont considérés comme cadres supérieurs
    // 3) S'il n'y a pas de superviseurId dans toute la base, désigner le DG comme racine et rattacher les directeurs
    const roots: Employee[] = [];
    const unassigned: Employee[] = [];

    // Détecter un DG formel
    const dgCandidate = allEmps.find(e => {
      const fn = this.getEmployeeRole(e).toLowerCase();
      return (fn.includes('directeur général') && !fn.includes('adjoint')) || fn === 'dg';
    });

    allEmps.forEach(e => {
      const supId = e.superviseurId ? String(e.superviseurId).trim() : null;
      if (!supId) {
        // Pas de superviseur direct défini
        if (dgCandidate && String(e.id) === String(dgCandidate.id)) {
          roots.push(e);
        } else if (!dgCandidate && (this.getEmployeeRole(e).toLowerCase().includes('directeur') || !roots.length)) {
          roots.push(e);
        } else {
          unassigned.push(e);
        }
      } else {
        // A un superviseur
        if (!empMap.has(supId)) {
          // Le superviseur référencé n'existe plus ou est hors liste
          unassigned.push(e);
        }
      }
    });

    // Si aucune racine n'a pu être identifiée, prendre le premier ou le DG s'il existe
    if (roots.length === 0) {
      if (dgCandidate) {
        roots.push(dgCandidate);
        const uIdx = unassigned.findIndex(e => String(e.id) === String(dgCandidate.id));
        if (uIdx !== -1) unassigned.splice(uIdx, 1);
      } else if (allEmps.length > 0) {
        roots.push(allEmps[0]);
        const uIdx = unassigned.findIndex(e => String(e.id) === String(allEmps[0].id));
        if (uIdx !== -1) unassigned.splice(uIdx, 1);
      }
    }

    // Construction récursive de l'arbre
    const visited = new Set<string>();
    const buildNode = (emp: Employee, level: number): OrgTreeNode => {
      const empId = String(emp.id);
      visited.add(empId);

      const role = this.getEmployeeRole(emp);
      const isExecutive = role.toLowerCase().includes('directeur général') || role.toLowerCase().includes('pca');

      // Trouver tous les subordonnés directs
      const directSubs = allEmps.filter(e => {
        const sId = e.superviseurId ? String(e.superviseurId).trim() : null;
        return sId === empId && !visited.has(String(e.id));
      });

      const childrenNodes = directSubs.map(sub => buildNode(sub, level + 1));

      // Calcul récursif du nombre total de subordonnés
      const totalSubordinates = childrenNodes.reduce((acc, c) => acc + 1 + c.totalSubordinatesCount, 0);

      // Déduire le parent
      let parentName: string | null = null;
      if (emp.superviseurId && empMap.has(String(emp.superviseurId))) {
        const p = empMap.get(String(emp.superviseurId))!;
        parentName = `${p.nom} ${p.prenom}`;
      }

      return {
        id: empId,
        title: `${emp.nom} ${emp.prenom}`,
        subtitle: role,
        matricule: emp.matricule,
        unit: emp.direction || emp.service || 'Banque Postale du Burkina Faso',
        email: emp.email || emp.emailPro,
        telephone: emp.telephone,
        badgeLabel: isExecutive ? 'Direction Générale' : (emp.direction || 'Collaborateur'),
        badgeClass: isExecutive ? 'badge-executive' : 'badge-dept',
        avatarInitials: this.getInitials(emp.nom, emp.prenom),
        avatarColor: this.getAvatarColor(role, level),
        photo: emp.photo,
        level,
        type: isExecutive ? 'EXECUTIVE' : 'EMPLOYEE',
        isManager: childrenNodes.length > 0,
        directReportsCount: childrenNodes.length,
        totalSubordinatesCount: totalSubordinates,
        expanded: level <= 1, // Déplié par défaut pour la racine et niveau 1
        parentId: emp.superviseurId ? String(emp.superviseurId) : null,
        parentName,
        data: emp,
        children: childrenNodes
      };
    };

    this.managerialTree = roots.map(r => buildNode(r, 0));
    this.unassignedEmployees = unassigned;
  }

  // ─── 2. ARBRE STRUCTUREL (DIRECTIONS / DÉPARTEMENTS / SERVICES) ───────────
  buildStructuralTree(): void {
    const allEmps = this.employees;

    // Calculer les agents pour chaque direction
    const countEmployeesInDirection = (dir: RefItem): number => {
      const dirId = dir.id ? String(dir.id) : '';
      const dirCode = (dir.code || '').trim().toUpperCase();
      const dirLib = (dir.libelle || dir.name || '').trim().toLowerCase();
      return allEmps.filter(e => {
        const anyEmp = e as any;
        const eDirId = String(e.directionId || anyEmp.direction?.id || '');
        const eDirCode = (anyEmp.directionCode || anyEmp.direction?.code || '').toUpperCase();
        const eDirName = (e.direction || anyEmp.directionLibelle || anyEmp.direction?.name || '').toLowerCase();
        if (dirId && eDirId === dirId) return true;
        if (dirCode && eDirCode === dirCode) return true;
        return dirLib && (eDirName.includes(dirLib) || dirLib.includes(eDirName));
      }).length;
    };

    const countEmployeesInService = (srv: RefItem): number => {
      const srvId = srv.id ? String(srv.id) : '';
      const srvCode = (srv.code || '').trim().toUpperCase();
      const srvLib = (srv.libelle || srv.name || '').trim().toLowerCase();
      return allEmps.filter(e => {
        const anyEmp = e as any;
        const eSrvId = String(e.serviceId || anyEmp.service?.id || '');
        const eSrvCode = (anyEmp.serviceCode || anyEmp.service?.code || '').toUpperCase();
        const eSrvName = (e.service || anyEmp.serviceLibelle || anyEmp.service?.name || '').toLowerCase();
        if (srvId && eSrvId === srvId) return true;
        if (srvCode && eSrvCode === srvCode) return true;
        return srvLib && (eSrvName.includes(srvLib) || srvLib.includes(eSrvName));
      }).length;
    };

    // Construire les nœuds de directions
    const dirNodes: OrgTreeNode[] = this.directions.map(dir => {
      // Trouver les services rattachés
      const dirId = dir.id ? String(dir.id) : '';
      const dirCode = (dir.code || '').trim().toUpperCase();

      const relatedServices = this.services.filter(s => {
        if (s.directionId && dirId && String(s.directionId) === dirId) return true;
        const sCode = (s.code || '').toUpperCase();
        if (dirCode === 'DIR_DSI' && (sCode.includes('BD') || sCode.includes('SYS') || sCode.includes('APP'))) return true;
        if (dirCode === 'DIR_RESEAU' && (sCode.includes('AGENCE') || sCode.includes('CASH'))) return true;
        return false;
      });

      const srvNodes: OrgTreeNode[] = relatedServices.map(srv => ({
        id: `srv-${srv.id || srv.code}`,
        title: srv.libelle || srv.name || srv.code,
        subtitle: `Code: ${srv.code}`,
        badgeLabel: 'Service',
        badgeClass: 'badge-service',
        avatarInitials: (srv.code || 'SRV').substring(0, 3).toUpperCase(),
        avatarColor: '#0284c7',
        level: 2,
        type: 'SERVICE',
        isManager: false,
        directReportsCount: countEmployeesInService(srv),
        totalSubordinatesCount: countEmployeesInService(srv),
        expanded: false,
        parentId: `dir-${dir.id || dir.code}`,
        parentName: dir.libelle || dir.name,
        data: srv,
        children: []
      }));

      const empCount = countEmployeesInDirection(dir);

      return {
        id: `dir-${dir.id || dir.code}`,
        title: dir.libelle || dir.name || dir.code,
        subtitle: `Direction Métier (${dir.code})`,
        badgeLabel: `${empCount} agent(s)`,
        badgeClass: 'badge-dept',
        avatarInitials: (dir.code || 'DIR').substring(0, 3).toUpperCase(),
        avatarColor: '#002b66',
        level: 1,
        type: 'DIRECTION',
        isManager: srvNodes.length > 0,
        directReportsCount: srvNodes.length,
        totalSubordinatesCount: empCount,
        expanded: true,
        parentId: 'dg-root',
        parentName: 'Direction Générale (DG)',
        data: dir,
        children: srvNodes
      };
    });

    // Racine institutionnelle : Conseil d'Administration / DG
    const rootNode: OrgTreeNode = {
      id: 'dg-root',
      title: 'Direction Générale (DG)',
      subtitle: 'Banque Postale du Burkina Faso',
      badgeLabel: `${allEmps.length} collaborateurs totaux`,
      badgeClass: 'badge-executive',
      avatarInitials: 'BPBF',
      avatarColor: '#b45309',
      level: 0,
      type: 'EXECUTIVE',
      isManager: true,
      directReportsCount: dirNodes.length,
      totalSubordinatesCount: allEmps.length,
      expanded: true,
      parentId: null,
      data: null,
      children: dirNodes
    };

    this.structuralTree = [rootNode];
  }

  // ─── RECHERCHE & DÉPLIAGE INTELLIGENT ─────────────────────────────────────
  applySearchFilter(): void {
    const q = (this.searchTerm || '').trim().toLowerCase();
    if (!q) {
      this.resetSearchMatches(this.managerialTree);
      this.resetSearchMatches(this.structuralTree);
      return;
    }

    const markMatches = (nodes: OrgTreeNode[]): boolean => {
      let anyMatch = false;
      for (const node of nodes) {
        const matchTitle = (node.title || '').toLowerCase().includes(q);
        const matchSub = (node.subtitle || '').toLowerCase().includes(q);
        const matchMat = (node.matricule || '').toLowerCase().includes(q);
        const matchUnit = (node.unit || '').toLowerCase().includes(q);
        const selfMatch = matchTitle || matchSub || matchMat || matchUnit;

        const childrenMatch = markMatches(node.children);
        node.isSearchMatch = selfMatch;

        if (selfMatch || childrenMatch) {
          node.expanded = true; // Auto-déplier la branche menant à la correspondance !
          anyMatch = true;
        }
      }
      return anyMatch;
    };

    markMatches(this.managerialTree);
    markMatches(this.structuralTree);
  }

  resetSearchMatches(nodes: OrgTreeNode[]): void {
    nodes.forEach(n => {
      n.isSearchMatch = false;
      if (n.children?.length) {
        this.resetSearchMatches(n.children);
      }
    });
  }

  onSearchChange(): void {
    this.applySearchFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applySearchFilter();
  }

  // ─── CONTRÔLES DE DÉPLIAGE / REPLIAGE ─────────────────────────────────────
  toggleNode(node: OrgTreeNode, event?: Event): void {
    if (event) event.stopPropagation();
    node.expanded = !node.expanded;
  }

  expandAll(): void {
    const expandRec = (nodes: OrgTreeNode[]) => {
      nodes.forEach(n => {
        n.expanded = true;
        if (n.children?.length) expandRec(n.children);
      });
    };
    if (this.activeTab === 'managerial') expandRec(this.managerialTree);
    if (this.activeTab === 'structural') expandRec(this.structuralTree);
  }

  collapseAll(): void {
    const collapseRec = (nodes: OrgTreeNode[], level: number) => {
      nodes.forEach(n => {
        n.expanded = level === 0; // Seule la racine reste visible
        if (n.children?.length) collapseRec(n.children, level + 1);
      });
    };
    if (this.activeTab === 'managerial') collapseRec(this.managerialTree, 0);
    if (this.activeTab === 'structural') collapseRec(this.structuralTree, 0);
  }

  // ─── TIROIR LATÉRAL (DRAWER) ─────────────────────────────────────────────
  openNodeDetails(node: OrgTreeNode): void {
    this.selectedNode = node;
    if (node.type === 'EMPLOYEE' || node.type === 'EXECUTIVE') {
      const emp = node.data as Employee;
      if (emp) {
        this.selectedNodeEmployees = this.employees.filter(
          e => e.superviseurId && String(e.superviseurId) === String(emp.id)
        );
      }
    } else {
      // Pour une unité structurelle, lister tous les agents affectés
      const u = node.data as RefItem;
      if (u) {
        const uId = u.id ? String(u.id) : '';
        const uCode = (u.code || '').toUpperCase();
        this.selectedNodeEmployees = this.employees.filter(e => {
          const anyEmp = e as any;
          if (node.type === 'DIRECTION') {
            return (uId && String(e.directionId) === uId) || (uCode && anyEmp.directionCode === uCode);
          }
          return (uId && String(e.serviceId) === uId) || (uCode && anyEmp.serviceCode === uCode);
        });
      }
    }
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

  // ─── MODIFICATION DU RATTACHEMENT (STYLE ODOO) ─────────────────────────────
  openReassignModal(node: OrgTreeNode, event?: Event): void {
    if (event) event.stopPropagation();
    if (node.type !== 'EMPLOYEE' && node.type !== 'EXECUTIVE') return;

    this.reassignTarget = node.data as Employee;
    this.reassignSupervisorId = this.reassignTarget.superviseurId ? String(this.reassignTarget.superviseurId) : null;
    this.reassignDirectionId = this.reassignTarget.directionId ? String(this.reassignTarget.directionId) : null;
    this.reassignDepartmentId = this.reassignTarget.departmentId ? String(this.reassignTarget.departmentId) : null;
    this.reassignServiceId = this.reassignTarget.serviceId ? String(this.reassignTarget.serviceId) : null;
    this.supervisorSearchQuery = '';
    this.reassignSuccessMsg = '';
    this.isReassignModalOpen = true;
  }

  closeReassignModal(): void {
    this.isReassignModalOpen = false;
    this.reassignTarget = null;
    this.isSavingReassign = false;
  }

  // Liste des superviseurs éligibles : exclut l'employé lui-même et ses descendants pour éviter les boucles cycliques
  getEligibleSupervisors(): Employee[] {
    if (!this.reassignTarget) return this.employees;
    const targetId = String(this.reassignTarget.id);

    // Trouver tous les descendants directs et indirects de targetId
    const descendantIds = new Set<string>();
    descendantIds.add(targetId);

    let added = true;
    while (added) {
      added = false;
      this.employees.forEach(e => {
        if (e.superviseurId && descendantIds.has(String(e.superviseurId)) && !descendantIds.has(String(e.id))) {
          descendantIds.add(String(e.id));
          added = true;
        }
      });
    }

    const q = (this.supervisorSearchQuery || '').toLowerCase().trim();
    return this.employees.filter(e => {
      if (descendantIds.has(String(e.id))) return false;
      if (!q) return true;
      const full = `${e.nom} ${e.prenom} ${e.matricule} ${this.getEmployeeRole(e)}`.toLowerCase();
      return full.includes(q);
    });
  }

  saveReassignment(): void {
    if (!this.reassignTarget) return;

    this.isSavingReassign = true;
    const empId = String(this.reassignTarget.id);
    const newSupId = this.reassignSupervisorId ? String(this.reassignSupervisorId) : null;

    this.employeeService.updateSuperviseur(empId, newSupId).subscribe({
      next: (updated) => {
        // Mettre à jour également la direction / service si modifiés
        const updates: Partial<Employee> = {};
        if (this.reassignDirectionId !== undefined) updates.directionId = this.reassignDirectionId || '';
        if (this.reassignDepartmentId !== undefined) updates.departmentId = this.reassignDepartmentId || '';
        if (this.reassignServiceId !== undefined) updates.serviceId = this.reassignServiceId || '';

        if (Object.keys(updates).length > 0) {
          this.employeeService.update(empId, updates).subscribe({
            next: (finalEmp) => {
              this.handleReassignSuccess(finalEmp);
            },
            error: () => {
              this.handleReassignSuccess(updated);
            }
          });
        } else {
          this.handleReassignSuccess(updated);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la modification du superviseur', err);
        this.isSavingReassign = false;
      }
    });
  }

  private handleReassignSuccess(updated: Employee): void {
    this.isSavingReassign = false;
    this.reassignSuccessMsg = 'Rattachement hiérarchique mis à jour avec succès !';
    const idx = this.employees.findIndex(e => String(e.id) === String(updated.id));
    if (idx !== -1) {
      this.employees[idx] = updated;
    }
    this.rebuildTrees();
    setTimeout(() => {
      this.closeReassignModal();
    }, 1000);
  }

  // ─── RATTACHER UN COLLABORATEUR SOUS UN MANAGER ───────────────────────────
  openAttachModal(node: OrgTreeNode, event?: Event): void {
    if (event) event.stopPropagation();
    if (node.type !== 'EMPLOYEE' && node.type !== 'EXECUTIVE') return;

    this.attachTargetManager = node.data as Employee;
    this.attachEmployeeId = null;
    this.isAttachModalOpen = true;
  }

  closeAttachModal(): void {
    this.isAttachModalOpen = false;
    this.attachTargetManager = null;
    this.isSavingAttach = false;
  }

  saveAttachment(): void {
    if (!this.attachTargetManager || !this.attachEmployeeId) return;

    this.isSavingAttach = true;
    const managerId = String(this.attachTargetManager.id);
    const agentId = String(this.attachEmployeeId);

    this.employeeService.updateSuperviseur(agentId, managerId).subscribe({
      next: (updated) => {
        this.isSavingAttach = false;
        const idx = this.employees.findIndex(e => String(e.id) === String(updated.id));
        if (idx !== -1) {
          this.employees[idx] = updated;
        }
        this.rebuildTrees();
        this.closeAttachModal();
      },
      error: (err) => {
        console.error('Erreur lors du rattachement', err);
        this.isSavingAttach = false;
      }
    });
  }

  // ─── CONTRÔLES D'AFFICHAGE & ZOOM ─────────────────────────────────────────
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
    this.zoomLevel = 1.0;
  }

  toggleFullScreen(): void {
    this.isFullScreen = !this.isFullScreen;
  }

  printChart(): void {
    window.print();
  }
}
