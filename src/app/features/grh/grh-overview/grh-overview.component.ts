import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grh-overview',
  templateUrl: './grh-overview.component.html',
  styleUrls: ['./grh-overview.component.scss'],
  standalone: false
})
export class GrhOverviewComponent {

  sections = [
    {
      title: 'Gestion des Agents',
      badge: '148 actifs',
      icon: 'group',
      color: '#0288d1',
      description: 'Annuaire complet, fiches individuelles, identité, postes et réversion CNSS/CARFO.',
      route: '/grh/employes'
    },
    {
      title: 'Congés & Absences',
      badge: '12 demandes',
      icon: 'event_available',
      color: '#2e7d32',
      description: 'Suivi des soldes de congé, calendrier des présences, validation des demandes et absences.',
      route: '/grh/conges'
    },
    {
      title: 'Suivi des Contrats',
      badge: '8 en attente',
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

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
