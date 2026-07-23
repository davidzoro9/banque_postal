import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../core/models/app-module.model';

@Component({
  selector: 'app-grh-overview',
  templateUrl: './grh-overview.component.html',
  styleUrls: ['./grh-overview.component.scss'],
  standalone: false
})
export class GrhOverviewComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'grh')!;

  kpis = [
    { label: 'Effectif total',          value: '248', icon: 'badge',          color: '#0060B3', sub: '+3 ce mois' },
    { label: 'Congés en attente',       value: '12',  icon: 'event_available', color: '#FFC700', sub: 'À valider' },
    { label: 'Contrats à renouveler',   value: '3',   icon: 'autorenew',      color: '#E53935', sub: 'Dans 30 jours' }
  ];

  quickActions = [
    { label: 'Nouvel employé',  icon: 'person_add',     route: '/grh/employes/nouveau', color: '#0060B3' },
    { label: 'Valider congés',  icon: 'event_available', route: '/grh/conges',           color: '#FFC700' },
    { label: 'Organigramme',    icon: 'account_tree',    route: '/grh/organigramme',     color: '#0060B3' }
  ];

  recentEmployees = [
    { nom: 'Sophie Martin', poste: 'Analyste financier', dept: 'Finance', date: '03/06/2026', status: 'CDI' },
    { nom: 'Thomas Bernard', poste: 'Développeur Full Stack', dept: 'IT', date: '01/06/2026', status: 'CDI' },
    { nom: 'Claire Dubois', poste: 'Chargée RH', dept: 'RH', date: '27/05/2026', status: 'CDD' },
    { nom: 'Marc Leroy', poste: 'Commercial', dept: 'Ventes', date: '20/05/2026', status: 'CDI' }
  ];

  constructor(public moduleNav: ModuleNavService, private router: Router) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}

