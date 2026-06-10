import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
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
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('leftSidenav') leftSidenav!: MatSidenav;
  @ViewChild('rightSidenav') rightSidenav!: MatSidenav;

  private destroy$ = new Subject<void>();

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectModule(mod: AppModule): void {
    this.moduleNav.selectModule(mod);
    this.router.navigate([mod.route]);
  }
}
