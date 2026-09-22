import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../core/services/module-nav.service';
import { AppModule } from '../../core/models/app-module.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent {
  constructor(
    public moduleNav: ModuleNavService,
    private router: Router
  ) {}

  openModule(mod: AppModule): void {
    this.moduleNav.selectModule(mod);
    this.router.navigate([mod.route]);
  }
}
