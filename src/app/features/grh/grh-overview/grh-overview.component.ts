import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardStatsService } from '../../../core/services/dashboard-stats.service';
import { GrhDashboardStats } from '../../../core/models/dashboard-stats.model';

@Component({
  selector: 'app-grh-overview',
  templateUrl: './grh-overview.component.html',
  styleUrls: ['./grh-overview.component.scss'],
  standalone: false
})
export class GrhOverviewComponent implements OnInit {

  stats: GrhDashboardStats | null = null;
  isLoading = true;
  hasError = false;

  sections = [
    {
      title: 'Gestion des Agents',
      badge: 'Agents actifs',
      icon: 'group',
      color: '#0288d1',
      description: 'Annuaire complet, fiches individuelles, identité, postes et réversion CNSS/CARFO.',
      route: '/grh/employes'
    },
    {
      title: 'Congés & Absences',
      badge: 'Demandes de congé',
      icon: 'event_available',
      color: '#2e7d32',
      description: 'Suivi des soldes de congé, calendrier des présences, validation des demandes et absences.',
      route: '/grh/conges'
    },
    {
      title: 'Suivi des Contrats',
      badge: 'Contrats',
      icon: 'article',
      color: '#f57c00',
      description: 'Gestion des types de contrats (CDI, CDD, Stage) et alertes de renouvellement automatique.',
      route: '/grh/contrats'
    },
    {
      title: 'Organigramme & Structure',
      badge: 'Vue hiérarchique',
      icon: 'account_tree',
      color: '#7b1fa2',
      description: 'Visualisation dynamique de l\'organigramme, raccordement des directions et services.',
      route: '/grh/organigramme'
    }
  ];

  constructor(
    private router: Router,
    private statsService: DashboardStatsService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.hasError = false;
    this.statsService.getGrhStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.isLoading = false;
        this.sections[0].badge = `${res.agentsActifs} actifs`;
        this.sections[1].badge = `${res.demandesCongeEnAttente} en attente`;
        this.sections[2].badge = `${res.contratsARenouveler} à renouveler`;
      },
      error: (err) => {
        console.error('Erreur chargement statistiques GRH:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
