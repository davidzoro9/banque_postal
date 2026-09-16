import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardStatsService } from '../../../core/services/dashboard-stats.service';
import { DonneesBaseDashboardStats } from '../../../core/models/dashboard-stats.model';

@Component({
  selector: 'app-db-overview',
  templateUrl: './db-overview.component.html',
  styleUrls: ['./db-overview.component.scss'],
  standalone: false
})
export class DbOverviewComponent implements OnInit {

  stats: DonneesBaseDashboardStats | null = null;
  isLoading = true;
  hasError = false;

  sections = [
    {
      title: 'Structure Organisationnelle',
      badge: 'Emplois, Fonctions...',
      icon: 'business',
      color: '#0288d1',
      description: 'Gestion des emplois, nominations, directions, départements, services, agences et types de contrat.',
      route: '/donnees-base/admin/emploi'
    },
    {
      title: 'Grille Salariale Conventionnelle',
      badge: 'Catégories & Échelons',
      icon: 'table_chart',
      color: '#f57c00',
      description: 'Définition des catégories professionnelles, groupes conventionnels et grilles de salaire de base brut.',
      route: '/donnees-base/admin/grille-salariale'
    },
    {
      title: 'Grille Indemnitaire',
      badge: 'Types & Règles',
      icon: 'paid',
      color: '#2e7d32',
      description: 'Configuration des types d\'indemnités, primes de fonction et règles d\'attribution par poste.',
      route: '/donnees-base/admin/param-indemnite'
    },
    {
      title: 'Paramétrage des Âges de Retraite',
      badge: 'Retraite & Âges légaux',
      icon: 'event_repeat',
      color: '#00897b',
      description: 'Configuration des âges légaux de départ à la retraite (Non-cadres 60 ans, Cadres 65 ans).',
      route: '/donnees-base/admin/param-retraite'
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
    this.statsService.getDonneesBaseStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.isLoading = false;
        if (res.emploisCount !== undefined) {
          this.sections[0].badge = `${res.emploisCount} emplois gérés`;
        }
        if (res.grillesCount !== undefined) {
          this.sections[1].badge = `${res.grillesCount} échelons & grilles`;
        }
        if (res.indemnitesCount !== undefined) {
          this.sections[2].badge = `${res.indemnitesCount} types configurés`;
        }
      },
      error: (err) => {
        console.error('Erreur chargement statistiques Paramètres Généraux:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
