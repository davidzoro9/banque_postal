import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../core/services/module-nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false
})
export class SidebarComponent {
  constructor(
    public moduleNav: ModuleNavService,
    public router: Router
  ) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  close(): void {
    this.moduleNav.toggleSidebar();
  }
}
