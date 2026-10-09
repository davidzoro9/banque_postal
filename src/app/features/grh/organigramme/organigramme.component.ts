import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DbRefService, RefItem } from '../../donnees-base/services/db-ref.service';
import { EmployeeService } from '../employes/services/employee.service';
import { Employee } from '../employes/models/employee.model';
import { environment } from '../../../../environments/environment';

export interface OrgTreeNode {
  id: string;
  title: string;
  subtitle: string;
  code?: string;
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
  type: 'EXECUTIVE' | 'DIRECTION' | 'DEPARTEMENT' | 'SERVICE' | 'COMITE' | 'EMPLOYEE';
  customClass?: string; // 'bpbf-ca', 'bpbf-comite', 'bpbf-dg', 'bpbf-dga', 'bpbf-secretariat', 'bpbf-audit', 'bpbf-dir', 'bpbf-dep', 'bpbf-srv'
  isManager: boolean;
  directReportsCount: number;
  totalSubordinatesCount: number;
  expanded: boolean;
  isSearchMatch?: boolean;
  parentId?: string | null;
  parentName?: string | null;
  functionalParentName?: string | null; // Ex: 'Lien fonctionnel avec Comité Audit'
  directeurId?: string | null;
  directeurLibelle?: string | null;
  directeurMatricule?: string | null;
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
  activeTab: 'bpbf' | 'managerial' | 'directory' = 'bpbf';
  searchTerm = '';
  zoomLevel = 0.95;
  isFullScreen = false;

  // Arbres hiérarchiques
  bpbfChartTree: OrgTreeNode[] = [];
  managerialTree: OrgTreeNode[] = [];
  unassignedEmployees: Employee[] = [];

  // Nœuds dédiés pour l'agencement institutionnel officiel BPBF
  caNode: OrgTreeNode | null = null;
  comiteNodes: OrgTreeNode[] = [];
  dgNode: OrgTreeNode | null = null;
  auditDirNode: OrgTreeNode | null = null;
  risquesDirNode: OrgTreeNode | null = null;
  secDirNode: OrgTreeNode | null = null;
  dgaNode: OrgTreeNode | null = null;
  dgaChildren: OrgTreeNode[] = [];

  // Volet latéral de détails (Drawer)
  selectedNode: OrgTreeNode | null = null;
  selectedNodeEmployees: Employee[] = [];

  // ─── MODAL 1 : NOMMER / CHANGER LE DIRECTEUR ──────────────────────────
  isDirectorModalOpen = false;
  directorTargetNode: OrgTreeNode | null = null;
  selectedDirectorEmployeeId: string | null = null;
  syncEmployeesLeaveSupervisor = true;
  directorSearchQuery = '';
  isSavingDirector = false;
  directorSuccessMsg = '';

  // ─── MODAL 2 : AJOUTER UN BLOC STRUCTUREL ─────────────────────────────
  isAddBlockModalOpen = false;
  newBlockType: 'direction' | 'departement' | 'service' | 'comite' = 'direction';
  newBlockCode = '';
  newBlockName = '';
  newBlockDescription = '';
  newBlockParentId: string | null = null;
  newBlockDirectorId: string | null = null;
  isSavingNewBlock = false;
  addBlockError = '';

  // ─── MODAL 3 : ÉDITER UN BLOC STRUCTUREL ──────────────────────────────
  isEditBlockModalOpen = false;
  editTargetNode: OrgTreeNode | null = null;
  editBlockCode = '';
  editBlockName = '';
  editBlockDescription = '';
  editBlockParentId: string | null = null;
  isSavingEditBlock = false;
  editBlockError = '';

  // ─── MODAL 4 : RATTACHEMENT EMPLOYÉ (STYLE ODOO) ──────────────────────
  isReassignModalOpen = false;
  reassignTarget: Employee | null = null;
  reassignSupervisorId: string | null = null;
  reassignDirectionId: string | null = null;
  reassignDepartmentId: string | null = null;
  reassignServiceId: string | null = null;
  supervisorSearchQuery = '';
  isSavingReassign = false;
  reassignSuccessMsg = '';

  // ─── MODAL 5 : RATTACHER UN AGENT SOUS UN RESPONSABLE ────────────────
  isAttachModalOpen = false;
  attachTargetManager: Employee | null = null;
  attachEmployeeId: string | null = null;
  isSavingAttach = false;

  constructor(
    private dbRefService: DbRefService,
    private employeeService: EmployeeService,
    private http: HttpClient,
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

  rebuildTrees(): void {
    this.buildBpbfOrganigrammeTree();
    this.buildManagerialTree();
    this.applySearchFilter();
    setTimeout(() => {
      this.centerViewport();
    }, 150);
  }

  // ─── AIDES AFFICHAGE & ÉQUIPE ──────────────────────────────────────────
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
    if (r.includes('directeur général') || r.includes('directrice générale') || r.includes('pca')) return '#002b66';
    if (r.includes('adjoint') || r.includes('dga')) return '#003380';
    if (r.includes('directeur') || r.includes('directrice')) return '#1e40af';
    if (r.includes('chef') || r.includes('responsable')) return '#0284c7';
    if (level <= 1) return '#002b66';
    if (level === 2) return '#0284c7';
    return '#475569';
  }

  // Trouve l'employé désigné comme directeur
  findEmployeeById(id?: string | number | null): Employee | undefined {
    if (id == null || id === '') return undefined;
    return this.employees.find(e => String(e.id) === String(id));
  }

  // ─── 1. ARBRE OFFICIEL BPBF (FIDÈLE AU SCHÉMA) ──────────────────────────
  buildBpbfOrganigrammeTree(): void {
    const allEmps = this.employees;
    const allDirs = this.directions;
    const allDeps = this.departements;
    const allSrvs = this.services;

    // Helper pour trouver les employés affectés à une unité
    const getAgentsCount = (type: 'DIRECTION' | 'DEPARTEMENT' | 'SERVICE', unit: RefItem): number => {
      const uId = unit.id ? String(unit.id) : '';
      const uCode = (unit.code || '').trim().toUpperCase();
      const uLib = (unit.libelle || unit.name || '').trim().toLowerCase();
      return allEmps.filter(e => {
        const anyEmp = e as any;
        if (type === 'DIRECTION') {
          const eDirId = String(e.directionId || anyEmp.direction?.id || '');
          const eDirCode = (anyEmp.directionCode || anyEmp.direction?.code || '').toUpperCase();
          const eDirName = (e.direction || anyEmp.directionLibelle || anyEmp.direction?.name || '').toLowerCase();
          if (uId && eDirId === uId) return true;
          if (uCode && eDirCode === uCode) return true;
          return uLib && (eDirName.includes(uLib) || uLib.includes(eDirName));
        } else if (type === 'DEPARTEMENT') {
          const eDepId = String(e.departmentId || anyEmp.department?.id || '');
          const eDepCode = (anyEmp.departmentCode || anyEmp.department?.code || '').toUpperCase();
          const eDepName = (e.departement || anyEmp.departmentLibelle || anyEmp.department?.name || '').toLowerCase();
          if (uId && eDepId === uId) return true;
          if (uCode && eDepCode === uCode) return true;
          return uLib && (eDepName.includes(uLib) || uLib.includes(eDepName));
        } else {
          const eSrvId = String(e.serviceId || anyEmp.service?.id || '');
          const eSrvCode = (anyEmp.serviceCode || anyEmp.service?.code || '').toUpperCase();
          const eSrvName = (e.service || anyEmp.serviceLibelle || anyEmp.service?.name || '').toLowerCase();
          if (uId && eSrvId === uId) return true;
          if (uCode && eSrvCode === uCode) return true;
          return uLib && (eSrvName.includes(uLib) || uLib.includes(eSrvName));
        }
      }).length;
    };

    // Helper pour créer un OrgTreeNode de service
    const createServiceNode = (srv: RefItem, parentName: string, parentId: string): OrgTreeNode => {
      const empCount = getAgentsCount('SERVICE', srv);
      const dirEmp = this.findEmployeeById(srv.directeurId);
      const dirLib = dirEmp ? `${dirEmp.nom} ${dirEmp.prenom}` : srv.directeurLibelle;

      return {
        id: `srv-${srv.id || srv.code}`,
        title: srv.libelle || srv.name || srv.code,
        subtitle: dirLib ? `Chef: ${dirLib}` : `Service (${srv.code})`,
        code: srv.code,
        badgeLabel: `${empCount} agent(s)`,
        badgeClass: 'badge-service',
        avatarInitials: (srv.code || 'SRV').substring(0, 3).toUpperCase(),
        avatarColor: '#0284c7',
        level: 4,
        type: 'SERVICE',
        customClass: 'bpbf-srv',
        isManager: !!srv.directeurId,
        directReportsCount: empCount,
        totalSubordinatesCount: empCount,
        expanded: true,
        parentId: parentId,
        parentName: parentName,
        directeurId: srv.directeurId,
        directeurLibelle: dirLib,
        directeurMatricule: dirEmp?.matricule,
        data: srv,
        children: []
      };
    };

    // Helper pour créer un OrgTreeNode de direction opérationnelle
    // Helper pour créer un OrgTreeNode de direction opérationnelle
    const createDirectionNode = (
      dir: RefItem,
      parentName: string,
      parentId: string,
      expectedServices: { code: string; title: string }[] = []
    ): OrgTreeNode => {
      const dirId = dir.id ? String(dir.id) : '';
      const dirCode = (dir.code || '').trim().toUpperCase();

      const matchedServiceNodes: OrgTreeNode[] = [];
      const handledSrvIds = new Set<string>();

      // 1. Pour chaque service officiel attendu, chercher dans la base ou instancier la référence officielle
      expectedServices.forEach(exp => {
        const found = allSrvs.find(s => {
          if (s.directionId && dirId && String(s.directionId) === dirId) {
            const sc = (s.code || '').toUpperCase();
            const sl = (s.libelle || s.name || '').toLowerCase();
            const targetWord = exp.title.toLowerCase().replace('service des ', '').replace('service de ', '').replace('service ', '').trim();
            if (sc === exp.code || sl.includes(targetWord) || targetWord.includes(sl)) return true;
          }
          const sc = (s.code || '').toUpperCase();
          const sl = (s.libelle || s.name || '').toLowerCase();
          const targetWord = exp.title.toLowerCase().replace('service des ', '').replace('service de ', '').replace('service ', '').trim();
          return sc === exp.code || sl.includes(targetWord) || (targetWord.length > 4 && targetWord.includes(sl));
        });

        if (found) {
          if (found.id) handledSrvIds.add(String(found.id));
          matchedServiceNodes.push(createServiceNode(found, dir.libelle || dir.name || dir.code, `dir-${dir.id || dir.code}`));
        } else {
          // Entité de service officielle BPBF prête à être administrée et persistée
          const srvRef: RefItem = {
            id: undefined,
            code: exp.code,
            libelle: exp.title,
            name: exp.title,
            description: `Service officiel rattaché à ${dir.libelle || dir.name}`,
            actif: true,
            directionId: dir.id ? String(dir.id) : undefined
          };
          matchedServiceNodes.push(createServiceNode(srvRef, dir.libelle || dir.name || dir.code, `dir-${dir.id || dir.code}`));
        }
      });

      // 2. Ajouter également tout autre service personnalisé créé en base pour cette direction
      allSrvs.forEach(s => {
        const sId = s.id ? String(s.id) : '';
        if (sId && handledSrvIds.has(sId)) return;
        if (s.directionId && dirId && String(s.directionId) === dirId) {
          handledSrvIds.add(sId);
          matchedServiceNodes.push(createServiceNode(s, dir.libelle || dir.name || dir.code, `dir-${dir.id || dir.code}`));
        }
      });

      const empCount = getAgentsCount('DIRECTION', dir);
      const dirEmp = this.findEmployeeById(dir.directeurId);
      const dirLib = dirEmp ? `${dirEmp.nom} ${dirEmp.prenom}` : dir.directeurLibelle;

      return {
        id: `dir-${dir.id || dir.code}`,
        title: dir.libelle || dir.name || dir.code,
        subtitle: dirLib ? `Directeur : ${dirLib}` : `Direction Métier (${dir.code})`,
        code: dir.code,
        badgeLabel: `${empCount} agent(s)`,
        badgeClass: 'badge-dept',
        avatarInitials: (dir.code || 'DIR').substring(0, 3).toUpperCase(),
        avatarColor: '#002b66',
        level: 3,
        type: 'DIRECTION',
        customClass: 'bpbf-dir',
        isManager: true,
        directReportsCount: matchedServiceNodes.length,
        totalSubordinatesCount: empCount,
        expanded: true,
        parentId: parentId,
        parentName: parentName,
        directeurId: dir.directeurId,
        directeurLibelle: dirLib,
        directeurMatricule: dirEmp?.matricule,
        data: dir,
        children: matchedServiceNodes
      };
    };

    // Helper pour créer un OrgTreeNode de département
    const createDepartmentNode = (dep: RefItem, parentName: string, parentId: string): OrgTreeNode => {
      const depId = dep.id ? String(dep.id) : '';
      const relatedServices = allSrvs.filter(s => s.departementId && depId && String(s.departementId) === depId);
      const srvNodes = relatedServices.map(s => createServiceNode(s, dep.libelle || dep.name || dep.code, `dep-${dep.id || dep.code}`));
      const empCount = getAgentsCount('DEPARTEMENT', dep);
      const dirEmp = this.findEmployeeById(dep.directeurId);
      const dirLib = dirEmp ? `${dirEmp.nom} ${dirEmp.prenom}` : dep.directeurLibelle;

      return {
        id: `dep-${dep.id || dep.code}`,
        title: dep.libelle || dep.name || dep.code,
        subtitle: dirLib ? `Responsable : ${dirLib}` : `Département (${dep.code})`,
        code: dep.code,
        badgeLabel: `${empCount} agent(s)`,
        badgeClass: 'badge-dept',
        avatarInitials: (dep.code || 'DEP').substring(0, 3).toUpperCase(),
        avatarColor: '#475569',
        level: 3,
        type: 'DEPARTEMENT',
        customClass: 'bpbf-dep',
        isManager: true,
        directReportsCount: srvNodes.length,
        totalSubordinatesCount: empCount,
        expanded: true,
        parentId: parentId,
        parentName: parentName,
        directeurId: dep.directeurId,
        directeurLibelle: dirLib,
        directeurMatricule: dirEmp?.matricule,
        data: dep,
        children: srvNodes
      };
    };

    // ── NIVEAU 0 : CONSEIL D'ADMINISTRATION (CA) ──
    const caDir = allDirs.find(d => d.code === 'DIR_CA') || {
      id: undefined,
      code: 'DIR_CA',
      libelle: "Conseil d'Administration (CA)",
      name: "Conseil d'Administration (CA)",
      description: 'Organe souverain de gouvernance',
      actif: true
    };
    const caEmp = this.findEmployeeById(caDir.directeurId);
    const caDirecteur = caEmp ? `${caEmp.nom} ${caEmp.prenom}` : caDir.directeurLibelle;

    // ── 3 COMITÉS SPÉCIALISÉS SOUS LE CA (Comité Risques, Comité Audit, Comité supérieur de crédit) ──
    const comRisquesRef = allDirs.find(d => d.code === 'COM_RISQUES') || {
      id: undefined, code: 'COM_RISQUES', libelle: 'Comité Risques', name: 'Comité Risques', description: 'Comité Risques auprès du CA', actif: true
    };
    const comAuditRef = allDirs.find(d => d.code === 'COM_AUDIT') || {
      id: undefined, code: 'COM_AUDIT', libelle: 'Comité Audit', name: 'Comité Audit', description: 'Comité Audit auprès du CA', actif: true
    };
    const comCreditRef = allDirs.find(d => d.code === 'COM_CREDIT') || {
      id: undefined, code: 'COM_CREDIT', libelle: 'Comité supérieur de crédit', name: 'Comité supérieur de crédit', description: 'Comité Crédit auprès du CA', actif: true
    };

    const createComiteNode = (com: RefItem): OrgTreeNode => {
      const cEmp = this.findEmployeeById(com.directeurId);
      const cLib = cEmp ? `${cEmp.nom} ${cEmp.prenom}` : com.directeurLibelle;
      return {
        id: `com-${com.id || com.code}`,
        title: com.libelle || com.name || com.code,
        subtitle: cLib ? `Président(e): ${cLib}` : 'Comité Spécialisé du CA',
        code: com.code,
        badgeLabel: 'Comité CA',
        badgeClass: 'badge-comite',
        avatarInitials: (com.code || 'COM').substring(0, 3).toUpperCase(),
        avatarColor: '#d97706',
        level: 1,
        type: 'COMITE',
        customClass: 'bpbf-comite',
        isManager: false,
        directReportsCount: 0,
        totalSubordinatesCount: 0,
        expanded: false,
        parentId: `dir-${caDir.id || caDir.code}`,
        parentName: "Conseil d'Administration (CA)",
        directeurId: com.directeurId,
        directeurLibelle: cLib,
        directeurMatricule: cEmp?.matricule,
        data: com,
        children: []
      };
    };

    const comiteNodes: OrgTreeNode[] = [
      createComiteNode(comRisquesRef),
      createComiteNode(comAuditRef),
      createComiteNode(comCreditRef)
    ];

    // ── NIVEAU 1 : DIRECTEUR GÉNÉRAL (DG) ──
    const dgDir = allDirs.find(d => d.code === 'DIR-001' || d.code === 'DIR_DG') || {
      id: undefined, code: 'DIR-001', libelle: 'Directeur Général (DG)', name: 'Directeur Général (DG)', description: 'Direction Générale', actif: true
    };
    const dgEmp = this.findEmployeeById(dgDir.directeurId);
    const dgDirecteur = dgEmp ? `${dgEmp.nom} ${dgEmp.prenom}` : dgDir.directeurLibelle;

    // ── Rattachés au DG : Audit Interne, Risque & Conformité, Secrétariat de Direction, DGA ──
    const auditDir: RefItem = allDirs.find(d => d.code === 'DIR_AUDIT') || {
      id: undefined, code: 'DIR_AUDIT', libelle: 'Direction Audit Interne', name: 'Direction Audit Interne', description: '', actif: true
    };
    const auditEmp = this.findEmployeeById(auditDir.directeurId);
    const auditDirNode: OrgTreeNode = {
      id: `dir-${auditDir.id || auditDir.code}`,
      title: auditDir.libelle || auditDir.name || 'Direction Audit Interne',
      subtitle: auditEmp ? `Directeur : ${auditEmp.nom} ${auditEmp.prenom}` : (auditDir.directeurLibelle ? `Directeur : ${auditDir.directeurLibelle}` : 'Audit Interne'),
      code: auditDir.code,
      badgeLabel: 'Lien fonctionnel Comité Audit',
      badgeClass: 'badge-functional',
      avatarInitials: 'DAI',
      avatarColor: '#475569',
      level: 2,
      type: 'DIRECTION',
      customClass: 'bpbf-audit',
      isManager: false,
      directReportsCount: getAgentsCount('DIRECTION', auditDir),
      totalSubordinatesCount: getAgentsCount('DIRECTION', auditDir),
      expanded: false,
      parentId: `dir-${dgDir.id || dgDir.code}`,
      parentName: 'Directeur Général (DG)',
      functionalParentName: 'Comité Audit',
      directeurId: auditDir.directeurId,
      directeurLibelle: auditEmp ? `${auditEmp.nom} ${auditEmp.prenom}` : auditDir.directeurLibelle,
      directeurMatricule: auditEmp?.matricule,
      data: auditDir,
      children: []
    };

    const risquesDir: RefItem = allDirs.find(d => d.code === 'DIR_RISQUES') || {
      id: undefined, code: 'DIR_RISQUES', libelle: 'Direction Risque et conformité', name: 'Direction Risque et conformité', description: '', actif: true
    };
    const risquesEmp = this.findEmployeeById(risquesDir.directeurId);
    const risquesDirNode: OrgTreeNode = {
      id: `dir-${risquesDir.id || risquesDir.code}`,
      title: risquesDir.libelle || risquesDir.name || 'Direction Risque et conformité',
      subtitle: risquesEmp ? `Directeur : ${risquesEmp.nom} ${risquesEmp.prenom}` : (risquesDir.directeurLibelle ? `Directeur : ${risquesDir.directeurLibelle}` : 'Risques & Conformité'),
      code: risquesDir.code,
      badgeLabel: 'Lien fonctionnel Comité Risques',
      badgeClass: 'badge-functional',
      avatarInitials: 'DRC',
      avatarColor: '#475569',
      level: 2,
      type: 'DIRECTION',
      customClass: 'bpbf-risques',
      isManager: false,
      directReportsCount: getAgentsCount('DIRECTION', risquesDir),
      totalSubordinatesCount: getAgentsCount('DIRECTION', risquesDir),
      expanded: false,
      parentId: `dir-${dgDir.id || dgDir.code}`,
      parentName: 'Directeur Général (DG)',
      functionalParentName: 'Comité Risques',
      directeurId: risquesDir.directeurId,
      directeurLibelle: risquesEmp ? `${risquesEmp.nom} ${risquesEmp.prenom}` : risquesDir.directeurLibelle,
      directeurMatricule: risquesEmp?.matricule,
      data: risquesDir,
      children: []
    };

    const secDir: RefItem = allDirs.find(d => d.code === 'SEC_DIR') || {
      id: undefined, code: 'SEC_DIR', libelle: 'Secrétariat de Direction', name: 'Secrétariat de Direction', description: '', actif: true
    };
    const secEmp = this.findEmployeeById(secDir.directeurId);
    const secDirNode: OrgTreeNode = {
      id: `dir-${secDir.id || secDir.code}`,
      title: secDir.libelle || secDir.name || 'Secrétariat de Direction',
      subtitle: secEmp ? `Responsable : ${secEmp.nom} ${secEmp.prenom}` : (secDir.directeurLibelle ? `Responsable : ${secDir.directeurLibelle}` : 'Secrétariat DG'),
      code: secDir.code,
      badgeLabel: 'Secrétariat DG',
      badgeClass: 'badge-secretariat',
      avatarInitials: 'SEC',
      avatarColor: '#166534',
      level: 2,
      type: 'DIRECTION',
      customClass: 'bpbf-secretariat',
      isManager: false,
      directReportsCount: getAgentsCount('DIRECTION', secDir),
      totalSubordinatesCount: getAgentsCount('DIRECTION', secDir),
      expanded: false,
      parentId: `dir-${dgDir.id || dgDir.code}`,
      parentName: 'Directeur Général (DG)',
      directeurId: secDir.directeurId,
      directeurLibelle: secEmp ? `${secEmp.nom} ${secEmp.prenom}` : secDir.directeurLibelle,
      directeurMatricule: secEmp?.matricule,
      data: secDir,
      children: []
    };

    // ── NIVEAU 2 : DIRECTEUR GÉNÉRAL ADJOINT (DGA) ──
    const dgaDir: RefItem = allDirs.find(d => d.code === 'DIR_DGA') || {
      id: undefined, code: 'DIR_DGA', libelle: 'Directeur Général Adjoint (DGA)', name: 'Directeur Général Adjoint (DGA)', description: '', actif: true
    };
    const dgaEmp = this.findEmployeeById(dgaDir.directeurId);
    const dgaDirecteur = dgaEmp ? `${dgaEmp.nom} ${dgaEmp.prenom}` : dgaDir.directeurLibelle;

    // ── NIVEAU 3 : LES 10 BLOCS OPÉRATIONNELS SOUS LE DGA (8 DIRECTIONS + 2 DÉPARTEMENTS) ──
    const dgaChildren: OrgTreeNode[] = [];

    // 1. Direction des Entreprises et institutionnels
    const dirEntreprises = allDirs.find(d => d.code === 'DIR_ENTREPRISES' || (d.libelle && d.libelle.toLowerCase().includes('entreprises'))) || {
      id: undefined, code: 'DIR_ENTREPRISES', libelle: 'Direction des Entreprises et institutionnels', name: 'Direction des Entreprises et institutionnels', description: '', actif: true
    };
    dgaChildren.push(createDirectionNode(dirEntreprises, 'DGA', `dir-${dgaDir.id || dgaDir.code}`, [
      { code: 'SRV_PME', title: 'Service PME/PMI' },
      { code: 'SRV_GRANDES_ENT', title: 'Service Grandes entreprises' },
      { code: 'SRV_INSTITUTIONNELS', title: 'Service Institutionnels' }
    ]));

    // 2. Département Marketing, commercial et communication
    const depMarketing = allDeps.find(d => d.code === 'DEP_MARKETING' || (d.libelle && d.libelle.toLowerCase().includes('marketing'))) || {
      id: undefined, code: 'DEP_MARKETING', libelle: 'Département Marketing, commercial et communication', name: 'Département Marketing, commercial et communication', description: '', actif: true
    };
    dgaChildren.push(createDepartmentNode(depMarketing, 'DGA', `dir-${dgaDir.id || dgaDir.code}`));

    // 3. Direction Réseau
    const dirReseau = allDirs.find(d => d.code === 'DIR_RESEAU' || (d.libelle && d.libelle.toLowerCase().includes('réseau')) || (d.libelle && d.libelle.toLowerCase().includes('reseau'))) || {
      id: undefined, code: 'DIR_RESEAU', libelle: 'Direction Réseau', name: 'Direction Réseau', description: '', actif: true
    };
    dgaChildren.push(createDirectionNode(dirReseau, 'DGA', `dir-${dgaDir.id || dgaDir.code}`, [
      { code: 'SRV_AGENCE', title: 'Service Agence' },
      { code: 'SRV_CASH_POINT', title: 'Service Cash Point' },
      { code: 'SRV_MONETIQUE', title: 'Service Monétique et digital' }
    ]));

    // 4. Direction des Engagements
    const dirEngag = allDirs.find(d => d.code === 'DIR_ENGAGEMENTS' || (d.libelle && d.libelle.toLowerCase().includes('engagements'))) || {
      id: undefined, code: 'DIR_ENGAGEMENTS', libelle: 'Direction des Engagements', name: 'Direction des Engagements', description: '', actif: true
    };
    dgaChildren.push(createDirectionNode(dirEngag, 'DGA', `dir-${dgaDir.id || dgaDir.code}`, [
      { code: 'SRV_SUIVI_ENGAG', title: 'Service Suivi des Engagements' },
      { code: 'SRV_ANALYSE_CREDIT', title: 'Service Analyse et administration de crédits' },
      { code: 'SRV_PRECONTENTIEUX', title: 'Service Précontentieux' }
    ]));

    // 5. Direction des Opérations bancaires
    const dirOps = allDirs.find(d => d.code === 'DIR_OPERATIONS' || (d.libelle && d.libelle.toLowerCase().includes('opérations')) || (d.libelle && d.libelle.toLowerCase().includes('operations'))) || {
      id: undefined, code: 'DIR_OPERATIONS', libelle: 'Direction des Opérations bancaires', name: 'Direction des Opérations bancaires', description: '', actif: true
    };
    dgaChildren.push(createDirectionNode(dirOps, 'DGA', `dir-${dgaDir.id || dgaDir.code}`, [
      { code: 'SRV_OPS_DOMESTIQUES', title: 'Service des Opérations domestiques' },
      { code: 'SRV_OPS_INTERNAT', title: 'Service des Opérations à l\'international' }
    ]));

    // 6. Direction Affaires juridiques & contentieux
    const dirJuridique = allDirs.find(d => d.code === 'DIR_JURIDIQUE' || (d.libelle && d.libelle.toLowerCase().includes('juridique'))) || {
      id: undefined, code: 'DIR_JURIDIQUE', libelle: 'Direction Affaires juridiques & contentieux', name: 'Direction Affaires juridiques & contentieux', description: '', actif: true
    };
    dgaChildren.push(createDirectionNode(dirJuridique, 'DGA', `dir-${dgaDir.id || dgaDir.code}`, [
      { code: 'SRV_JURIDIQUE_GOUV', title: 'Service Affaires juridiques & Gouvernance' },
      { code: 'SRV_RECOUVREMENT', title: 'Service Recouvrement' }
    ]));

    // 7. Département Trésorerie
    const depTresor = allDeps.find(d => d.code === 'DEP_TRESORERIE' || (d.libelle && d.libelle.toLowerCase().includes('trésorerie')) || (d.libelle && d.libelle.toLowerCase().includes('tresorerie'))) || {
      id: undefined, code: 'DEP_TRESORERIE', libelle: 'Département Trésorerie', name: 'Département Trésorerie', description: '', actif: true
    };
    dgaChildren.push(createDepartmentNode(depTresor, 'DGA', `dir-${dgaDir.id || dgaDir.code}`));

    // 8. Direction des Systèmes d'informations
    const dirDsi = allDirs.find(d => d.code === 'DIR_DSI' || (d.libelle && d.libelle.toLowerCase().includes('systèmes')) || (d.libelle && d.libelle.toLowerCase().includes('systemes'))) || {
      id: undefined, code: 'DIR_DSI', libelle: "Direction des Systèmes d'informations", name: "Direction des Systèmes d'informations", description: '', actif: true
    };
    dgaChildren.push(createDirectionNode(dirDsi, 'DGA', `dir-${dgaDir.id || dgaDir.code}`, [
      { code: 'SRV_BDD_APPS', title: 'Service Base de données et applications' },
      { code: 'SRV_SYS_RESEAUX', title: 'Service Systèmes et réseaux' },
      { code: 'SRV_SUPPORTS', title: 'Service Supports' }
    ]));

    // 9. Direction Administration et Moyens Généraux
    const dirDamg = allDirs.find(d => d.code === 'DIR_DAMG' || (d.libelle && d.libelle.toLowerCase().includes('moyens généraux')) || (d.libelle && d.libelle.toLowerCase().includes('moyens generaux'))) || {
      id: undefined, code: 'DIR_DAMG', libelle: 'Direction Administration et Moyens Généraux', name: 'Direction Administration et Moyens Généraux', description: '', actif: true
    };
    dgaChildren.push(createDirectionNode(dirDamg, 'DGA', `dir-${dgaDir.id || dgaDir.code}`, [
      { code: 'SRV_MOYENS_SEC', title: 'Service Moyens généraux et Sécurité' },
      { code: 'SRV_CAPITAL_HUMAIN', title: 'Service Capital Humain' }
    ]));

    // 10. Direction Financière et comptable
    const dirDfc = allDirs.find(d => d.code === 'DIR_DFC' || (d.libelle && d.libelle.toLowerCase().includes('financière')) || (d.libelle && d.libelle.toLowerCase().includes('financiere'))) || {
      id: undefined, code: 'DIR_DFC', libelle: 'Direction Financière et comptable', name: 'Direction Financière et comptable', description: '', actif: true
    };
    dgaChildren.push(createDirectionNode(dirDfc, 'DGA', `dir-${dgaDir.id || dgaDir.code}`, [
      { code: 'SRV_COMPTA_FISC', title: 'Service Comptabilité et fiscalité' },
      { code: 'SRV_CTRL_GESTION', title: 'Service Contrôle de gestion' }
    ]));

    // Ajouter également toute autre direction ou département personnalisé créé par l'utilisateur
    const knownCodes = new Set([
      'DIR_CA', 'COM_RISQUES', 'COM_AUDIT', 'COM_CREDIT', 'DIR-001', 'DIR_DG', 'DIR_AUDIT', 'DIR_RISQUES',
      'SEC_DIR', 'DIR_DGA', 'DIR_ENTREPRISES', 'DIR_RESEAU', 'DIR_ENGAGEMENTS', 'DIR_OPERATIONS',
      'DIR_JURIDIQUE', 'DIR_DSI', 'DIR_DAMG', 'DIR_DFC', 'DEP_MARKETING', 'DEP_TRESORERIE'
    ]);

    allDirs.forEach(d => {
      if (!knownCodes.has(d.code)) {
        dgaChildren.push(createDirectionNode(d, 'DGA', `dir-${dgaDir.id || dgaDir.code}`));
      }
    });

    allDeps.forEach(dep => {
      if (!knownCodes.has(dep.code)) {
        dgaChildren.push(createDepartmentNode(dep, 'DGA', `dir-${dgaDir.id || dgaDir.code}`));
      }
    });

    // Nœud DGA
    const dgaNode: OrgTreeNode = {
      id: `dir-${dgaDir.id || dgaDir.code}`,
      title: dgaDir.libelle || dgaDir.name || 'Directeur Général Adjoint (DGA)',
      subtitle: dgaDirecteur ? `DGA : ${dgaDirecteur}` : 'Direction Générale Adjointe',
      code: dgaDir.code,
      badgeLabel: `${dgaChildren.length} direction(s) / dép.`,
      badgeClass: 'badge-executive',
      avatarInitials: 'DGA',
      avatarColor: '#002b66',
      level: 2,
      type: 'EXECUTIVE',
      customClass: 'bpbf-dga',
      isManager: true,
      directReportsCount: dgaChildren.length,
      totalSubordinatesCount: allEmps.length,
      expanded: true,
      parentId: `dir-${dgDir.id || dgDir.code}`,
      parentName: 'Directeur Général (DG)',
      directeurId: dgaDir.directeurId,
      directeurLibelle: dgaDirecteur,
      directeurMatricule: dgaEmp?.matricule,
      data: dgaDir,
      children: dgaChildren
    };

    // Nœud DG : contient Audit, Risques, Secrétariat, et DGA
    const dgChildren: OrgTreeNode[] = [auditDirNode, risquesDirNode, secDirNode, dgaNode];

    const dgNode: OrgTreeNode = {
      id: `dir-${dgDir.id || dgDir.code}`,
      title: dgDir.libelle || dgDir.name || 'Directeur Général (DG)',
      subtitle: dgDirecteur ? `DG : ${dgDirecteur}` : 'Direction Générale BPBF',
      code: dgDir.code,
      badgeLabel: `${allEmps.length} collaborateurs`,
      badgeClass: 'badge-executive',
      avatarInitials: 'DG',
      avatarColor: '#002b66',
      level: 1,
      type: 'EXECUTIVE',
      customClass: 'bpbf-dg',
      isManager: true,
      directReportsCount: dgChildren.length,
      totalSubordinatesCount: allEmps.length,
      expanded: true,
      parentId: `dir-${caDir.id || caDir.code}`,
      parentName: "Conseil d'Administration (CA)",
      directeurId: dgDir.directeurId,
      directeurLibelle: dgDirecteur,
      directeurMatricule: dgEmp?.matricule,
      data: dgDir,
      children: dgChildren
    };

    // Nœud CA (Racine suprême) : contient les 3 Comités + le DG
    const caChildren: OrgTreeNode[] = [...comiteNodes, dgNode];

    const caNode: OrgTreeNode = {
      id: `dir-${caDir.id || caDir.code}`,
      title: caDir.libelle || caDir.name || "Conseil d'Administration (CA)",
      subtitle: caDirecteur ? `Président(e) : ${caDirecteur}` : 'Gouvernance Suprême BPBF',
      code: caDir.code,
      badgeLabel: 'Organe de Gouvernance',
      badgeClass: 'badge-executive',
      avatarInitials: 'CA',
      avatarColor: '#001a40',
      level: 0,
      type: 'EXECUTIVE',
      customClass: 'bpbf-ca',
      isManager: true,
      directReportsCount: caChildren.length,
      totalSubordinatesCount: allEmps.length,
      expanded: true,
      parentId: null,
      directeurId: caDir.directeurId,
      directeurLibelle: caDirecteur,
      directeurMatricule: caEmp?.matricule,
      data: caDir,
      children: caChildren
    };

    this.caNode = caNode;
    this.comiteNodes = comiteNodes;
    this.dgNode = dgNode;
    this.auditDirNode = auditDirNode;
    this.risquesDirNode = risquesDirNode;
    this.secDirNode = secDirNode;
    this.dgaNode = dgaNode;
    this.dgaChildren = dgaChildren;
    this.bpbfChartTree = [caNode];
  }

  // ─── 2. ARBRE MANAGÉRIAL (STYLE ODOO TREE) ──────────────────────────────
  buildManagerialTree(): void {
    const allEmps = [...this.employees];
    const empMap = new Map<string, Employee>();
    allEmps.forEach(e => empMap.set(String(e.id), e));

    const roots: Employee[] = [];
    const unassigned: Employee[] = [];

    const dgCandidate = allEmps.find(e => {
      const fn = this.getEmployeeRole(e).toLowerCase();
      return (fn.includes('directeur général') && !fn.includes('adjoint')) || fn === 'dg';
    });

    allEmps.forEach(e => {
      const supId = e.superviseurId ? String(e.superviseurId).trim() : null;
      if (!supId) {
        if (dgCandidate && String(e.id) === String(dgCandidate.id)) {
          roots.push(e);
        } else if (!dgCandidate && (this.getEmployeeRole(e).toLowerCase().includes('directeur') || !roots.length)) {
          roots.push(e);
        } else {
          unassigned.push(e);
        }
      } else {
        if (!empMap.has(supId)) {
          unassigned.push(e);
        }
      }
    });

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

    const visited = new Set<string>();
    const buildNode = (emp: Employee, level: number): OrgTreeNode => {
      const empId = String(emp.id);
      visited.add(empId);

      const role = this.getEmployeeRole(emp);
      const isExecutive = role.toLowerCase().includes('directeur général') || role.toLowerCase().includes('pca');

      const directSubs = allEmps.filter(e => {
        const sId = e.superviseurId ? String(e.superviseurId).trim() : null;
        return sId === empId && !visited.has(String(e.id));
      });

      const childrenNodes = directSubs.map(sub => buildNode(sub, level + 1));
      const totalSubordinates = childrenNodes.reduce((acc, c) => acc + 1 + c.totalSubordinatesCount, 0);

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
        expanded: level <= 1,
        parentId: emp.superviseurId ? String(emp.superviseurId) : null,
        parentName,
        data: emp,
        children: childrenNodes
      };
    };

    this.managerialTree = roots.map(r => buildNode(r, 0));
    this.unassignedEmployees = unassigned;
  }

  // ─── RECHERCHE & FILTRAGE ──────────────────────────────────────────────
  applySearchFilter(): void {
    const q = (this.searchTerm || '').trim().toLowerCase();
    if (!q) {
      this.resetSearchMatches(this.bpbfChartTree);
      this.resetSearchMatches(this.managerialTree);
      return;
    }

    const markMatches = (nodes: OrgTreeNode[]): boolean => {
      let anyMatch = false;
      for (const node of nodes) {
        const matchTitle = (node.title || '').toLowerCase().includes(q);
        const matchSub = (node.subtitle || '').toLowerCase().includes(q);
        const matchMat = (node.matricule || '').toLowerCase().includes(q);
        const matchUnit = (node.unit || '').toLowerCase().includes(q);
        const matchCode = (node.code || '').toLowerCase().includes(q);
        const selfMatch = matchTitle || matchSub || matchMat || matchUnit || matchCode;

        const childrenMatch = markMatches(node.children);
        node.isSearchMatch = selfMatch;

        if (selfMatch || childrenMatch) {
          node.expanded = true;
          anyMatch = true;
        }
      }
      return anyMatch;
    };

    markMatches(this.bpbfChartTree);
    markMatches(this.managerialTree);
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

  // ─── DÉPLIAGE / REPLIAGE ────────────────────────────────────────────────
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
    if (this.activeTab === 'bpbf') expandRec(this.bpbfChartTree);
    if (this.activeTab === 'managerial') expandRec(this.managerialTree);
  }

  collapseAll(): void {
    const collapseRec = (nodes: OrgTreeNode[], level: number) => {
      nodes.forEach(n => {
        n.expanded = level === 0;
        if (n.children?.length) collapseRec(n.children, level + 1);
      });
    };
    if (this.activeTab === 'bpbf') collapseRec(this.bpbfChartTree, 0);
    if (this.activeTab === 'managerial') collapseRec(this.managerialTree, 0);
  }

  // ─── TIROIR LATÉRAL DE DÉTAILS (DRAWER) ─────────────────────────────────
  openNodeDetails(node: OrgTreeNode): void {
    this.selectedNode = node;
    if (node.type === 'EMPLOYEE' || (node.type === 'EXECUTIVE' && node.data?.nom)) {
      const emp = node.data as Employee;
      if (emp) {
        this.selectedNodeEmployees = this.employees.filter(
          e => e.superviseurId && String(e.superviseurId) === String(emp.id)
        );
      }
    } else {
      // Pour une unité structurelle (Direction, Département, Service, Comité), lister les agents rattachés
      const u = node.data as RefItem;
      if (u) {
        const uId = u.id ? String(u.id) : '';
        const uCode = (u.code || '').toUpperCase();
        this.selectedNodeEmployees = this.employees.filter(e => {
          const anyEmp = e as any;
          if (node.type === 'DIRECTION' || node.type === 'COMITE' || node.type === 'EXECUTIVE') {
            return (uId && String(e.directionId) === uId) || (uCode && anyEmp.directionCode === uCode);
          } else if (node.type === 'DEPARTEMENT') {
            return (uId && String(e.departmentId) === uId) || (uCode && anyEmp.departmentCode === uCode);
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

  // ─── NOMMER / CHANGER LE DIRECTEUR D'UN BLOC ────────────────────────────
  openAssignDirectorModal(node: OrgTreeNode, event?: Event): void {
    if (event) event.stopPropagation();
    this.directorTargetNode = node;
    this.selectedDirectorEmployeeId = node.directeurId ? String(node.directeurId) : null;
    this.syncEmployeesLeaveSupervisor = true;
    this.directorSearchQuery = '';
    this.directorSuccessMsg = '';
    this.isDirectorModalOpen = true;
  }

  closeAssignDirectorModal(): void {
    this.isDirectorModalOpen = false;
    this.directorTargetNode = null;
    this.isSavingDirector = false;
  }

  getFilteredEmployeesForDirector(): Employee[] {
    const q = (this.directorSearchQuery || '').toLowerCase().trim();
    if (!q) return this.employees;
    return this.employees.filter(e => {
      const full = `${e.nom} ${e.prenom} ${e.matricule} ${this.getEmployeeRole(e)} ${e.direction || ''} ${e.service || ''}`.toLowerCase();
      return full.includes(q);
    });
  }

  saveDirectorAssignment(): void {
    if (!this.directorTargetNode || !this.directorTargetNode.data) return;

    this.isSavingDirector = true;
    const node = this.directorTargetNode;
    const item = node.data as RefItem;
    const empId = this.selectedDirectorEmployeeId ? Number(this.selectedDirectorEmployeeId) : null;
    const sync = this.syncEmployeesLeaveSupervisor;

    if (node.type === 'DIRECTION' || node.type === 'COMITE' || node.type === 'EXECUTIVE') {
      const dirId = item.id;
      item.directeurId = empId ? String(empId) : undefined;
      if (dirId) {
        const url = `${environment.apiUrl}/directions/${dirId}/directeur?employeeId=${empId || ''}&syncEmployees=${sync}`;
        this.http.put<any>(url, {}).subscribe({
          next: (updatedDir) => {
            this.handleDirectorSuccess(`Directeur / Responsable nommé avec succès pour "${node.title}".`);
          },
          error: () => {
            // Fallback via DbRefService
            this.dbRefService.updateItem('direction', item.code, item).subscribe({
              next: () => this.handleDirectorSuccess(`Directeur / Responsable mis à jour pour "${node.title}".`),
              error: (err) => {
                console.error('Erreur assignation directeur', err);
                this.isSavingDirector = false;
              }
            });
          }
        });
      } else {
        this.dbRefService.addItem('direction', item).subscribe({
          next: () => this.handleDirectorSuccess(`Directeur / Responsable créé et nommé pour "${node.title}".`),
          error: (err) => {
            console.error('Erreur création direction', err);
            this.isSavingDirector = false;
          }
        });
      }
    } else if (node.type === 'DEPARTEMENT') {
      item.directeurId = empId ? String(empId) : undefined;
      const op = item.id ? this.dbRefService.updateItem('departement', item.code, item) : this.dbRefService.addItem('departement', item);
      op.subscribe({
        next: () => this.handleDirectorSuccess(`Responsable de Département mis à jour pour "${node.title}".`),
        error: (err) => {
          console.error('Erreur assignation directeur département', err);
          this.isSavingDirector = false;
        }
      });
    } else if (node.type === 'SERVICE') {
      item.directeurId = empId ? String(empId) : undefined;
      const op = item.id ? this.dbRefService.updateItem('service', item.code, item) : this.dbRefService.addItem('service', item);
      op.subscribe({
        next: () => this.handleDirectorSuccess(`Chef de Service mis à jour pour "${node.title}".`),
        error: (err) => {
          console.error('Erreur assignation chef de service', err);
          this.isSavingDirector = false;
        }
      });
    }
  }

  private handleDirectorSuccess(msg: string): void {
    this.isSavingDirector = false;
    this.directorSuccessMsg = msg;
    setTimeout(() => {
      this.closeAssignDirectorModal();
      this.loadAllData();
    }, 1200);
  }

  // ─── AJOUTER UN BLOC DYNAMIQUE ──────────────────────────────────────────
  openAddBlockModal(parentNode?: OrgTreeNode, event?: Event): void {
    if (event) event.stopPropagation();
    this.newBlockType = parentNode?.type === 'DIRECTION' ? 'service' : 'direction';
    this.newBlockCode = '';
    this.newBlockName = '';
    this.newBlockDescription = '';
    this.newBlockParentId = parentNode ? parentNode.id.replace('dir-', '').replace('dep-', '') : null;
    this.newBlockDirectorId = null;
    this.addBlockError = '';
    this.isAddBlockModalOpen = true;
  }

  closeAddBlockModal(): void {
    this.isAddBlockModalOpen = false;
    this.isSavingNewBlock = false;
  }

  saveNewBlock(): void {
    const name = (this.newBlockName || '').trim();
    if (!name) {
      this.addBlockError = 'Le nom du bloc est obligatoire.';
      return;
    }

    let code = (this.newBlockCode || '').trim().toUpperCase();
    if (!code) {
      const prefix = this.newBlockType === 'direction' ? 'DIR_' : (this.newBlockType === 'departement' ? 'DEP_' : 'SRV_');
      code = prefix + name.substring(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_' + Math.floor(Math.random() * 900 + 100);
    }

    this.isSavingNewBlock = true;
    this.addBlockError = '';

    const refType = this.newBlockType === 'comite' ? 'direction' : this.newBlockType;
    const newItem: RefItem = {
      code,
      libelle: name,
      name,
      description: this.newBlockDescription,
      actif: true,
      directeurId: this.newBlockDirectorId || undefined
    };

    if (refType === 'direction') {
      if (this.newBlockParentId) newItem.parentDirectionId = this.newBlockParentId;
    } else if (refType === 'service') {
      if (this.newBlockParentId) newItem.directionId = this.newBlockParentId;
    } else if (refType === 'departement') {
      if (this.newBlockParentId) newItem.directionId = this.newBlockParentId;
    }

    this.dbRefService.addItem(refType, newItem).subscribe({
      next: () => {
        this.isSavingNewBlock = false;
        this.closeAddBlockModal();
        this.loadAllData();
      },
      error: (err) => {
        console.error('Erreur ajout bloc', err);
        this.addBlockError = err?.message || "Erreur lors de l'enregistrement dans PostgreSQL.";
        this.isSavingNewBlock = false;
      }
    });
  }

  // ─── ÉDITER UN BLOC STRUCTUREL ──────────────────────────────────────────
  openEditBlockModal(node: OrgTreeNode, event?: Event): void {
    if (event) event.stopPropagation();
    this.editTargetNode = node;
    const item = node.data as RefItem;
    this.editBlockName = node.title;
    this.editBlockCode = node.code || item?.code || '';
    this.editBlockDescription = item?.description || '';
    this.editBlockParentId = node.parentId ? node.parentId.replace('dir-', '').replace('dep-', '') : null;
    this.editBlockError = '';
    this.isEditBlockModalOpen = true;
  }

  closeEditBlockModal(): void {
    this.isEditBlockModalOpen = false;
    this.editTargetNode = null;
    this.isSavingEditBlock = false;
  }

  saveBlockEdit(): void {
    if (!this.editTargetNode || !this.editTargetNode.data) return;

    const name = (this.editBlockName || '').trim();
    if (!name) {
      this.editBlockError = 'Le nom ne peut pas être vide.';
      return;
    }

    this.isSavingEditBlock = true;
    this.editBlockError = '';

    const node = this.editTargetNode;
    const item = { ...node.data } as RefItem;
    item.libelle = name;
    item.name = name;
    if (this.editBlockCode) item.code = this.editBlockCode.trim().toUpperCase();
    item.description = this.editBlockDescription;

    let refType = 'direction';
    if (node.type === 'DEPARTEMENT') refType = 'departement';
    if (node.type === 'SERVICE') refType = 'service';

    this.dbRefService.updateItem(refType, item.code, item).subscribe({
      next: () => {
        this.isSavingEditBlock = false;
        this.closeEditBlockModal();
        this.loadAllData();
      },
      error: (err) => {
        console.error('Erreur modification bloc', err);
        this.editBlockError = err?.message || 'Erreur lors de la modification.';
        this.isSavingEditBlock = false;
      }
    });
  }

  // ─── SUPPRIMER UN BLOC STRUCTUREL ───────────────────────────────────────
  deleteBlock(node: OrgTreeNode, event?: Event): void {
    if (event) event.stopPropagation();
    if (!node.data || !node.data.id) return;

    const confirmMsg = `Êtes-vous certain de vouloir supprimer le bloc "${node.title}" (${node.code}) ?\nCette opération sera répercutée dans PostgreSQL.`;
    if (!confirm(confirmMsg)) return;

    let refType = 'direction';
    if (node.type === 'DEPARTEMENT') refType = 'departement';
    if (node.type === 'SERVICE') refType = 'service';

    this.dbRefService.deleteItem(refType, { id: String(node.data.id), code: node.data.code }).subscribe({
      next: () => {
        if (this.selectedNode?.id === node.id) this.closeDrawer();
        this.loadAllData();
      },
      error: (err) => {
        console.error('Erreur suppression bloc', err);
        alert(`Impossible de supprimer le bloc : ${err?.message || 'Contraintes d\'intégrité (des services ou employés y sont rattachés).'}`);
      }
    });
  }

  // ─── RATTACHEMENT HIÉRARCHIQUE EMPLOYÉ (STYLE ODOO) ──────────────────────
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

  getEligibleSupervisors(): Employee[] {
    if (!this.reassignTarget) return this.employees;
    const targetId = String(this.reassignTarget.id);

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

  // ─── RATTACHER UN AGENT SOUS UN RESPONSABLE ──────────────────────────────
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

  // ─── CONTRÔLES ZOOM, PAN & AFFICHAGE ──────────────────────────────────────
  zoomIn(): void {
    if (this.zoomLevel < 1.6) {
      this.zoomLevel = Math.round((this.zoomLevel + 0.1) * 100) / 100;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.3) {
      this.zoomLevel = Math.round((this.zoomLevel - 0.1) * 100) / 100;
    }
  }

  resetZoom(): void {
    this.zoomLevel = 0.95;
    this.centerViewport();
  }

  fitToScreen(): void {
    if (!this.chartContainer) return;
    const viewport = this.chartContainer.nativeElement;
    const canvas = viewport.querySelector('.tree-canvas') as HTMLElement;
    if (canvas) {
      const treeWidth = canvas.scrollWidth || 2200;
      const viewportWidth = viewport.clientWidth - 40;
      let ratio = viewportWidth / treeWidth;
      ratio = Math.max(0.35, Math.min(1.0, Math.round(ratio * 100) / 100));
      this.zoomLevel = ratio;
      setTimeout(() => {
        this.centerViewport();
      }, 80);
    }
  }

  centerViewport(): void {
    if (this.chartContainer) {
      const el = this.chartContainer.nativeElement;
      el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
    }
  }

  // Glisser-déposer pour naviguer (Pan)
  isPanning = false;
  panStartX = 0;
  panStartY = 0;
  panScrollLeft = 0;
  panScrollTop = 0;
  activeViewport: HTMLElement | null = null;

  onMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return; // Seul le clic gauche active le pan
    const target = event.target as HTMLElement;
    if (target.closest('.bpbf-block-card, .node-card, button, input, select, textarea, .modal-dialog, .unassigned-banner, .bpbf-legend-card')) {
      return;
    }
    const vp = (event.currentTarget as HTMLElement) || this.chartContainer?.nativeElement;
    if (!vp) return;
    this.isPanning = true;
    this.activeViewport = vp;
    this.panStartX = event.pageX;
    this.panStartY = event.pageY;
    this.panScrollLeft = vp.scrollLeft;
    this.panScrollTop = vp.scrollTop;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isPanning || !this.activeViewport) return;
    event.preventDefault();
    const deltaX = event.pageX - this.panStartX;
    const deltaY = event.pageY - this.panStartY;
    this.activeViewport.scrollLeft = this.panScrollLeft - deltaX;
    this.activeViewport.scrollTop = this.panScrollTop - deltaY;
  }

  onMouseUp(): void {
    this.isPanning = false;
    this.activeViewport = null;
  }

  onWheel(event: WheelEvent): void {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    }
  }

  toggleFullScreen(): void {
    this.isFullScreen = !this.isFullScreen;
  }

  printChart(): void {
    window.print();
  }
}
