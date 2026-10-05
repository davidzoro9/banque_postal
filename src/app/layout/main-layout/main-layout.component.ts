import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModuleNavService } from '../../core/services/module-nav.service';
import { AppModule } from '../../core/models/app-module.model';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: false
})
export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('leftSidenav') leftSidenav!: MatSidenav;
  @ViewChild('rightSidenav') rightSidenav!: MatSidenav;

  private destroy$ = new Subject<void>();
  private closeTimer: any = null;
  private isMouseInDrawer = false;

  constructor(
    public moduleNav: ModuleNavService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Activer le module GRH par défaut si aucun module n'est sélectionné
    if (!this.moduleNav.activeModule) {
      const grh = this.moduleNav.modules.find(m => m.id === 'grh');
      if (grh) this.moduleNav.selectModule(grh);
    }

    this.moduleNav.drawerOpen$.pipe(takeUntil(this.destroy$)).subscribe(open => {
      if (this.leftSidenav) {
        open ? this.leftSidenav.open() : this.leftSidenav.close();
      }
    });

    this.moduleNav.sidebarOpen$.pipe(takeUntil(this.destroy$)).subscribe(open => {
      if (this.rightSidenav) {
        open ? this.rightSidenav.open() : this.rightSidenav.close();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.leftSidenav) {
      this.moduleNav.drawerOpen ? this.leftSidenav.open() : this.leftSidenav.close();
    }
  }

  ngOnDestroy(): void {
    this.cancelAutoClose();
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectModule(mod: AppModule): void {
    this.moduleNav.selectModule(mod);
    this.moduleNav.openDrawer();
    this.router.navigate([mod.route]);
  }

  onDrawerMouseEnter(): void {
    this.isMouseInDrawer = true;
    this.cancelAutoClose();
  }

  onDrawerMouseLeave(): void {
    this.isMouseInDrawer = false;
  }

  onContentMouseEnter(): void {
    if (this.moduleNav.drawerOpen && !this.isMouseInDrawer) {
      this.triggerAutoClose();
    }
  }

  onContentMouseMove(event: MouseEvent): void {
    if (this.moduleNav.drawerOpen) {
      // Si la souris est pointée au centre / dans la zone de contenu (au-delà du panneau)
      if (!this.isMouseInDrawer && event.clientX > 250) {
        this.triggerAutoClose();
      }
    } else {
      // Si le panneau est fermé et que la souris quitte le centre vers la gauche
      if (event.clientX <= 35) {
        this.openDrawerImmediate();
      }
    }
  }

  onContentMouseLeave(event: MouseEvent): void {
    // Si la souris quitte le contenu vers le bord gauche
    if (event.clientX <= 35) {
      this.openDrawerImmediate();
    }
  }

  openDrawerImmediate(): void {
    this.cancelAutoClose();
    this.isMouseInDrawer = true;
    if (!this.moduleNav.drawerOpen) {
      this.moduleNav.openDrawer();
    }
  }

  private triggerAutoClose(): void {
    if (this.closeTimer) return;
    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      if (this.moduleNav.drawerOpen && !this.isMouseInDrawer) {
        this.moduleNav.closeDrawer();
      }
    }, 150);
  }

  private cancelAutoClose(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}
