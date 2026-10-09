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
      title: 'Simulateur & Calculatrice RH',
      badge: 'Négociation & Embauche',
      icon: 'calculate',
      color: '#003366',
      description: 'Simulation interactive de rémunération : déterminez le sursalaire optimal pour un net cible ou calculez le net prévisionnel.',
      route: '/paie/simulateur'
    },
    {
      title: 'Traitement & Bulletins de Paie',
      badge: 'Sessions & Lots',
      icon: 'receipt_long',
      color: '#00875A',
      description: 'Calcul et génération automatisés des bulletins de paie par session, primes, indemnités et cotisations.',
      route: '/paie/lots'
    },
    {
      title: 'Historique des Bulletins',
      badge: 'Archives',
      icon: 'history',
      color: '#0288d1',
      description: 'Consultation, téléchargement PDF certifié et réimpression des bulletins de paie calculés.',
      route: '/paie/bulletins/historique'
    },
    {
      title: 'Variables de Paie',
      badge: 'Avoirs & Précomptes',
      icon: 'price_change',
      color: '#7b1fa2',
      description: 'Gestion des rappels (avoirs), précomptes multi-échéances et régularisations de trop-perçus.',
      route: '/paie/variables/precomptes'
    },
    {
      title: 'États de Synthèse & Livre de Paie',
      badge: 'Reporting Légal',
      icon: 'analytics',
      color: '#0e7490',
      description: 'Livre de paie officiel, états des cotisations CNSS, récapitulatifs IUTS, virements et billets.',
      route: '/paie/etats-synthese'
    },
    {
      title: 'Paramétrage des Rubriques',
      badge: 'Rubriques & Cotisations',
      icon: 'tune',
      color: '#f57c00',
      description: 'Paramétrage des rubriques de gain, retenues fiscales (IUTS) et cotisations sociales (CNSS/CRRAE).',
      route: '/paie/parametrage/elements'
    },
    {
      title: 'Types de Retenues Salariales',
      badge: 'Retenues',
      icon: 'money_off',
      color: '#c026d3',
      description: 'Configuration des catégories de retenues (prêts, acomptes, cotisations mutuelle, saisies-arrêts).',
      route: '/paie/types-retenues'
    },
    {
      title: 'Comptes Comptables de Paie',
      badge: 'SYSCOHADA & OD',
      icon: 'account_tree',
      color: '#003366',
      description: 'Paramétrage du plan de comptes SYSCOHADA (Classe 6 et Classe 4) pour la génération des écritures d\'OD de paie.',
      route: '/paie/comptes-comptables'
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
