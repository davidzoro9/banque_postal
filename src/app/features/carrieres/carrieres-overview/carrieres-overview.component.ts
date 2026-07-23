import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../core/models/app-module.model';

@Component({
  selector: 'app-carrieres-overview',
  templateUrl: './carrieres-overview.component.html',
  styleUrls: ['./carrieres-overview.component.scss'],
  standalone: false
})
export class CarrieresOverviewComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'carrieres')!;

  kpis = [
    { label: 'Compétences référencées', value: '186', icon: 'psychology',              color: '#0060B3', sub: 'Référentiel actif' },
    { label: 'Formations planifiées',   value: '14',  icon: 'school',                  color: '#0060B3', sub: 'Ce semestre' },
    { label: 'Entretiens annuels',      value: '67%', icon: 'star_rate',               color: '#1B3A6B', sub: 'Complétés' },
    { label: 'Mobilités internes',      value: '5',   icon: 'transfer_within_a_station', color: '#FFC700', sub: 'En cours' }
  ];

  quickActions = [
    { label: 'Référentiel',      icon: 'menu_book',                route: '/carrieres/competences/referentiel',   color: '#0060B3' },
    { label: 'Plan de formation',icon: 'event_note',               route: '/carrieres/formations/plan',           color: '#0060B3' },
    { label: 'Entretiens annuels',icon: 'forum',                   route: '/carrieres/evaluations/entretiens',    color: '#1B3A6B' },
    { label: 'Mobilité',         icon: 'transfer_within_a_station',route: '/carrieres/mobilite',                  color: '#FFC700' }
  ];

  upcomingFormations = [
    { titre: 'Leadership & Management',   date: '15/06/2026', participants: 12, statut: 'Confirmée' },
    { titre: 'Angular Avancé',            date: '22/06/2026', participants: 8,  statut: 'Confirmée' },
    { titre: 'Communication efficace',    date: '05/07/2026', participants: 15, statut: 'Planifiée' },
    { titre: 'Gestion de projet Agile',   date: '12/07/2026', participants: 10, statut: 'Planifiée' }
  ];

  constructor(public moduleNav: ModuleNavService, private router: Router) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}

