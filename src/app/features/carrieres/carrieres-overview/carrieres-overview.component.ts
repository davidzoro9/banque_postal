import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../core/models/app-module.model';
import { CarrieresService, DashboardCarrieresStats, CarriereAvancement, CarriereNotation } from '../services/carrieres.service';

@Component({
  selector: 'app-carrieres-overview',
  templateUrl: './carrieres-overview.component.html',
  styleUrls: ['./carrieres-overview.component.scss'],
  standalone: false
})
export class CarrieresOverviewComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'carrieres')!;

  stats: DashboardCarrieresStats = {
    totalEmployees: 0,
    totalNotations: 0,
    moyenneNotes: 0,
    avancementsProposes: 0,
    avancementsValides: 0,
    totalReclassements: 0
  };

  recentAvancements: CarriereAvancement[] = [];
  recentNotations: CarriereNotation[] = [];
  loading = true;

  constructor(
    public moduleNav: ModuleNavService,
    private router: Router,
    private carrieresService: CarrieresService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.carrieresService.getDashboardStats().subscribe({
      next: (res) => {
        if (res) this.stats = res;
      },
      error: () => {}
    });

    this.carrieresService.fetchAvancements().subscribe({
      next: (res) => {
        this.recentAvancements = (res || []).slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.carrieresService.fetchNotations().subscribe({
      next: (res) => {
        this.recentNotations = (res || []).slice(0, 5);
      },
      error: () => {}
    });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
