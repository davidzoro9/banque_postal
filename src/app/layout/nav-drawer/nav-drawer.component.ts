import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ModuleNavService } from '../../core/services/module-nav.service';
import { AppModule } from '../../core/models/app-module.model';
import { MenuItem } from '../../core/models/menu-item.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-nav-drawer',
  templateUrl: './nav-drawer.component.html',
  styleUrls: ['./nav-drawer.component.scss'],
  standalone: false
})
export class NavDrawerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  activeModule: AppModule | null = null;
  menuItems: MenuItem[] = [];
  expandedItems = new Set<string>();
  currentEmpId: string | null = null;
  private lastEmpId: string = 'EMP-001';

  constructor(
    public moduleNav: ModuleNavService,
    public router: Router,
    private authService: AuthService
  ) {}

  get isEmployeeSelected(): boolean {
    return !!this.currentEmpId;
  }

  private isItemPermitted(id: string): boolean {
    switch (id) {
      case 'donnees-base':
      case 'gestion-admin':
      case 'paie-section':
        return this.authService.hasPermission('DB_VIEW');
      case 'grille-salariale':
        return this.authService.hasPermission('DB_GRILLE_EDIT');
      case 'type-indemnite':
      case 'param-indemnite':
        return this.authService.hasPermission('DB_INDEMNITE_EDIT');
      case 'emploi':
      case 'fonction':
      case 'agence':
      case 'departement':
      case 'direction':
      case 'service':
        return this.authService.hasPermission('DB_REF_EDIT');
      case 'employes':
      case 'liste-employes':
      case 'fiche-employe':
        return this.authService.hasPermission('EMP_VIEW');
      case 'paie':
      case 'bulletins':
      case 'historique':
        return this.authService.hasPermission('PAIE_VIEW');
      case 'generer':
        return this.authService.hasPermission('PAIE_GENERATE');
      case 'valider':
        return this.authService.hasPermission('PAIE_VALIDATE');
      case 'cloture':
        return this.authService.hasPermission('PAIE_CLOTURE');
      case 'profils':
      case 'securite-droits':
        return this.authService.hasPermission('PROFIL_EDIT') || this.authService.hasPermission('USER_MANAGE');
      case 'utilisateurs':
        return this.authService.hasPermission('USER_MANAGE');
      case 'habilitations':
      case 'profils-roles':
        return this.authService.hasPermission('PROFIL_EDIT');
      case 'manuel-utilisateur':
        return this.authService.hasPermission('MANUAL_VIEW');
      default:
        return true;
    }
  }

  ngOnInit(): void {
    this.moduleNav.activeModule$.pipe(takeUntil(this.destroy$)).subscribe(mod => {
      const isSameModule = this.activeModule?.id === mod?.id;
      this.activeModule = mod;
      
      const rawItems = this.moduleNav.getMenuForActiveModule();
      this.menuItems = rawItems
        .filter(item => this.isItemPermitted(item.id))
        .map(item => {
          if (!item.children) return item;
          const filteredChildren = item.children.filter(child => this.isItemPermitted(child.id));
          return { ...item, children: filteredChildren };
        })
        .filter(item => !item.children || item.children.length > 0);

      if (!isSameModule) {
        this.expandedItems.clear();
        this.expandedItems.add('employes');
      }
    });

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((e: any) => {
      const empId = this.extractEmpId(e.urlAfterRedirects || e.url);
      this.currentEmpId = empId;
      if (empId) {
        this.lastEmpId = empId;
        this.expandedItems.add('employes');
      }
    });

    const initEmpId = this.extractEmpId(this.router.url);
    this.currentEmpId = initEmpId;
    if (initEmpId) {
      this.lastEmpId = initEmpId;
      this.expandedItems.add('employes');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private extractEmpId(url: string): string | null {
    const match = url.match(/\/grh\/employes\/([^\/\?]+)/);
    if (!match) return null;
    const id = match[1];
    return (id === 'nouveau' || id === 'modifier') ? null : id;
  }

  resolveRoute(route: string | undefined): string | undefined {
    if (!route) return undefined;
    if (route.includes('__emp__')) {
      const empId = this.currentEmpId || this.lastEmpId || 'EMP-001';
      const cleanPath = route.replace('__emp__/', '').replace('__emp__', '');
      return `/grh/employes/${empId}/${cleanPath}`;
    }
    return route;
  }

  isFicheItem(item: MenuItem): boolean {
    return !!(item.route?.includes('__emp__'));
  }

  selectModule(mod: AppModule): void {
    this.moduleNav.selectModule(mod);
    this.router.navigate([mod.route]);
  }

  navigateToOverview(): void {
    if (this.activeModule) {
      this.router.navigate([this.activeModule.route]);
    }
  }

  toggleItem(item: MenuItem): void {
    if (this.expandedItems.has(item.id)) {
      this.expandedItems.delete(item.id);
    } else {
      this.expandedItems.add(item.id);
    }
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItems.has(item.id);
  }

  navigate(route: string | undefined): void {
    if (route) this.router.navigate([route]);
  }

  navigateChild(route: string | undefined): void {
    if (!route) return;
    const target = this.resolveRoute(route);
    if (target) {
      this.router.navigateByUrl(target);
    }
  }

  navigateFiche(route: string | undefined): void {
    const resolved = this.resolveRoute(route);
    if (resolved) this.router.navigateByUrl(resolved);
  }

  isActiveRoute(route: string | undefined): boolean {
    if (!route) return false;
    const resolved = this.resolveRoute(route) || route;
    return this.router.isActive(resolved, {
      paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored'
    });
  }
}
