import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paie-overview',
  templateUrl: './paie-overview.component.html',
  styleUrls: ['./paie-overview.component.scss'],
  standalone: false
})
export class PaieOverviewComponent {

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
      badge: '14 rubriques',
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
      description: 'Gestion des avances, acomptes, remboursements et retenues attribués aux collaborateurs.',
      route: '/donnees-base/admin/type-retenue-employe'
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
