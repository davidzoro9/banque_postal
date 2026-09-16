import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardStatsService } from '../../../core/services/dashboard-stats.service';
import { PaieDashboardStats } from '../../../core/models/dashboard-stats.model';

@Component({
  selector: 'app-paie-overview',
  templateUrl: './paie-overview.component.html',
  styleUrls: ['./paie-overview.component.scss'],
  standalone: false
})
export class PaieOverviewComponent implements OnInit {
  stats: PaieDashboardStats | null = null;
  bulletinsTraites = 0;
  bulletinsATraiter = 0;
  totalAgents = 0;
  loadingStats = true;
  hasError = false;

  sections = [
    {
      title: 'Génération des Bulletins',
      badge: 'Mois en cours',
      icon: 'add_circle_outline',
      color: '#00875A',
      description: 'Calcul et génération automatisés des bulletins de paie, primes, indemnités et cotisations.',
      route: '/paie/bulletins/generer'
    },
    {
      title: 'Historique des Bulletins',
      badge: 'Archives',
      icon: 'history',
      color: '#0288d1',
      description: 'Consultation, téléchargement PDF et réimpression des bulletins de paie calculés.',
      route: '/paie/bulletins/historique'
    },
    {
      title: 'Rubriques & Cotisations',
      badge: 'Rubriques & Cotisations',
      icon: 'calculate',
      color: '#f57c00',
      description: 'Paramétrage des rubriques de gain, retenues fiscales (IUTS) et cotisations sociales (CNSS/CARFO).',
      route: '/paie/elements/rubriques'
    },
    {
      title: 'Retenues sur Salaire',
      badge: 'Retenues & Avances',
      icon: 'money_off',
      color: '#7b1fa2',
      description: 'Gestion des avances, acomptes, remboursements et retenues attribués aux agents.',
      route: '/donnees-base/admin/type-retenue-employe'
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
    this.loadingStats = true;
    this.hasError = false;
    this.statsService.getPaieStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.bulletinsTraites = res.bulletinsTraites;
        this.bulletinsATraiter = res.bulletinsATraiter;
        this.totalAgents = res.totalAgents;
        this.sections[2].badge = `${res.rubriquesCount} rubriques actives`;
        this.loadingStats = false;
      },
      error: (err) => {
        console.error('Erreur chargement statistiques Paie:', err);
        this.hasError = true;
        this.loadingStats = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
