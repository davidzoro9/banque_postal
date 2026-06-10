import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../core/models/app-module.model';

@Component({
  selector: 'app-paie-overview',
  templateUrl: './paie-overview.component.html',
  styleUrls: ['./paie-overview.component.scss'],
  standalone: false
})
export class PaieOverviewComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'paie')!;

  kpis = [
    { label: 'Bulletins générés', value: '248',   icon: 'receipt_long', color: '#1B3A6B', sub: 'Juin 2026' },
    { label: 'Masse salariale',   value: '412K€',  icon: 'payments',    color: '#163059', sub: 'Brut mensuel' },
    { label: 'DSN transmises',    value: '3',       icon: 'send',        color: '#1565C0', sub: 'Ce trimestre' },
    { label: 'Anomalies paie',    value: '2',       icon: 'warning',     color: '#E53935', sub: 'À corriger' }
  ];

  quickActions = [
    { label: 'Générer bulletins', icon: 'add_circle_outline', route: '/paie/bulletins/generer',    color: '#1B3A6B' },
    { label: 'Historique',        icon: 'history',             route: '/paie/bulletins/historique', color: '#163059' },
    { label: 'DSN',               icon: 'description',         route: '/paie/declarations/dsn',     color: '#1565C0' },
    { label: 'Paramétrage',       icon: 'tune',                route: '/paie/parametrage',          color: '#FFB300' }
  ];

  recentBulletins = [
    { employe: 'Marie Dupont',   poste: 'Directrice RH',  net: '4 850 €', brut: '6 200 €', mois: 'Juin 2026', etat: 'Généré' },
    { employe: 'Jean Martin',    poste: 'Ingénieur',       net: '3 600 €', brut: '4 680 €', mois: 'Juin 2026', etat: 'Généré' },
    { employe: 'Sophie Bernard', poste: 'Commerciale',     net: '3 100 €', brut: '4 030 €', mois: 'Juin 2026', etat: 'Envoyé' },
    { employe: 'Pierre Durand',  poste: 'Comptable',       net: '2 900 €', brut: '3 770 €', mois: 'Juin 2026', etat: 'Envoyé' }
  ];

  constructor(public moduleNav: ModuleNavService, private router: Router) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
