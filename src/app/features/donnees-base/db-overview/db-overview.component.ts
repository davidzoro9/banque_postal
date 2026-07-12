import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../core/models/app-module.model';

@Component({
  selector: 'app-db-overview',
  templateUrl: './db-overview.component.html',
  styleUrls: ['./db-overview.component.scss'],
  standalone: false
})
export class DbOverviewComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'donnees-base')!;

  kpis = [
    { label: 'Entités juridiques',      value: '3',  icon: 'business',          color: '#FFB300', sub: 'Actives' },
    { label: 'Départements',            value: '12', icon: 'domain',            color: '#163059', sub: 'Configurés' },
    { label: 'Types de contrats',       value: '8',  icon: 'article',           color: '#1565C0', sub: 'Référencés' },
    { label: 'Calendriers de travail',  value: '4',  icon: 'date_range',        color: '#1B3A6B', sub: 'Actifs' }
  ];

  quickActions = [
    { label: 'Départements',      icon: 'domain',             route: '/donnees-base/admin/departement',  color: '#163059' },
    { label: 'Types de contrats', icon: 'article',            route: '/donnees-base/admin/type-contrat', color: '#1565C0' },
    { label: 'Types de congés',   icon: 'beach_access',        route: '/donnees-base/admin/type-conge',   color: '#1B3A6B' },
    { label: 'Grille salariale',  icon: 'table_chart',         route: '/donnees-base/admin/grille-salariale', color: '#FFB300' }
  ];

  configuration = [
    { section: 'Structure organisationnelle', items: 3,  icon: 'corporate_fare',     color: '#FFB300', desc: 'Entités, départements, services' },
    { section: 'Paramètres RH',               items: 8,  icon: 'manage_accounts',    color: '#1565C0', desc: 'Contrats, catégories, grades' },
    { section: 'Calendriers',                 items: 4,  icon: 'calendar_month',     color: '#1B3A6B', desc: 'Calendriers de travail, jours fériés' },
    { section: 'Configuration système',       items: 12, icon: 'admin_panel_settings',color: '#163059', desc: 'Paramètres globaux de l\'application' }
  ];

  constructor(public moduleNav: ModuleNavService, private router: Router) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
