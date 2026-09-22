import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ModuleNavService } from '../../core/services/module-nav.service';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false
})
export class ToolbarComponent {
  constructor(
    public authService: AuthService,
    public moduleNav: ModuleNavService,
    public notifService: NotificationService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  toggleDrawer(): void {
    this.moduleNav.toggleDrawer();
  }

  toggleSidebar(): void {
    this.moduleNav.toggleSidebar();
  }

  goHome(): void {
    this.moduleNav.clearModule();
    this.router.navigate(['/dashboard']);
  }

  goToMonEspace(): void {
    this.router.navigate(['/mon-espace']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
