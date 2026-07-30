import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-db-overview',
  templateUrl: './db-overview.component.html',
  styleUrls: ['./db-overview.component.scss'],
  standalone: false
})
export class DbOverviewComponent {

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
      title: 'Paramétrage des Indemnités',
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
    },
    {
      title: 'Rubriques de Paie & Barèmes',
      badge: 'Paie & Fiscalité',
      icon: 'calculate',
      color: '#7b1fa2',
      description: 'Paramétrage des rubriques de paie, barèmes IUTS, retenues et modes de paiement.',
      route: '/donnees-base/paie/rubrique'
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
