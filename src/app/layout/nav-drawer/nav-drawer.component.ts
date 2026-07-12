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

  constructor(
    public moduleNav: ModuleNavService,
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.moduleNav.activeModule$.pipe(takeUntil(this.destroy$)).subscribe(mod => {
      const isSameModule = this.activeModule?.id === mod?.id;
      this.activeModule = mod;
      
      const rawItems = this.moduleNav.getMenuForActiveModule();
      this.menuItems = rawItems.filter(item => {
        if (item.id === 'parametres-rh') {
          return this.authService.currentUser?.role === 'ADMIN';
        }
        return true;
      });

      if (!isSameModule) {
        // Changement de module : on repart de zéro
        this.expandedItems.clear();
        // Ouvre uniquement la section qui contient la route active
        this.autoExpandActive();
      }
      // Même module : on conserve l'état d'expansion choisi par l'utilisateur
    });

    // Track current employee ID from the URL
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((e: any) => {
      this.currentEmpId = this.extractEmpId(e.urlAfterRedirects || e.url);
      if (this.currentEmpId) {
        this.expandedItems.add('fiche-employe');
      }
    });

    // Also check current URL on init
    this.currentEmpId = this.extractEmpId(this.router.url);
    if (this.currentEmpId) {
      this.expandedItems.add('fiche-employe');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private autoExpandActive(): void {
    const url = this.router.url;
    for (const item of this.menuItems) {
      if (item.children?.some(child => {
        const r = this.resolveRoute(child.route);
        return r && url.startsWith(r);
      })) {
        this.expandedItems.add(item.id);
        return;
      }
    }
    // Aucune route active trouvée : rien n'est ouvert
  }

  private extractEmpId(url: string): string | null {
    const match = url.match(/\/grh\/employes\/([^\/\?]+)/);
    if (!match) return null;
    // Exclude "nouveau" and "modifier" as they are not employee IDs
    const id = match[1];
    return (id === 'nouveau' || id === 'modifier') ? null : id;
  }

  /** Resolve a route: replace __emp__ with current employee ID */
  resolveRoute(route: string | undefined): string | undefined {
    if (!route) return undefined;
    if (route.includes('__emp__')) {
      if (!this.currentEmpId) return undefined;
      return route.replace('__emp__', `/grh/employes/${this.currentEmpId}`);
    }
    return route;
  }

  /** True if this item is a contextual fiche-employe link that requires an ID */
  isFicheItem(item: MenuItem): boolean {
    return !!(item.route?.includes('__emp__'));
  }

  selectModule(mod: AppModule): void {
    this.moduleNav.selectModule(mod);
    this.router.navigate([mod.route]);
  }

  toggleItem(item: MenuItem): void {
    if (this.expandedItems.has(item.id)) {
      this.expandedItems.delete(item.id);
    } else {
      this.expandedItems.clear(); // Ferme tous les autres groupes (accordéon)
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
    if (route.includes('__emp__')) {
      this.navigateFiche(route);
    } else {
      this.router.navigate([route]);
    }
  }

  navigateFiche(route: string | undefined): void {
    const resolved = this.resolveRoute(route);
    if (resolved) this.router.navigate([resolved]);
  }

  isActiveRoute(route: string | undefined): boolean {
    if (!route) return false;
    const resolved = this.resolveRoute(route) || route;
    return this.router.isActive(resolved, {
      paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored'
    });
  }
}
