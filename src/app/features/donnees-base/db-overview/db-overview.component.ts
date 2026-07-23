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
    { label: 'Entités & Structure',     value: '18', icon: 'domain',            color: '#CC8800', sub: 'Services & Agences' },
    { label: 'Grilles & Indemnités',   value: '14', icon: 'table_chart',        color: '#0060B3', sub: 'Grilles salariales' },
    { label: 'Types de Retenues',       value: '7',  icon: 'money_off',          color: '#0288D1', sub: 'Cotisations & Impôts' },
    { label: 'Règles de Paie',          value: '4',  icon: 'tune',               color: '#163059', sub: '% Employeur & % Agent' }
  ];

  quickActions = [
    { label: 'Départements',        icon: 'domain',        route: '/donnees-base/admin/departement',      color: '#CC8800' },
    { label: 'Grille Salariale',    icon: 'table_chart',   route: '/donnees-base/admin/grille-salariale', color: '#0060B3' },
    { label: 'Types de Retenues',   icon: 'money_off',     route: '/paie/types-retenues',                 color: '#0288D1' },
    { label: 'Taux & Cotisations',  icon: 'tune',          route: '/paie/parametrage',                    color: '#163059' }
  ];

  configuration = [
    { section: 'Gestion Administrative',   items: '19 tables',icon: 'corporate_fare',        color: '#CC8800', desc: 'Emplois, fonctions, départements, agences, catégories, grades, échelons, compétences', route: '/donnees-base/admin/departement' },
    { section: 'Salaires & Indemnités',    items: '5 grilles',icon: 'table_chart',          color: '#0060B3', desc: 'Grilles salariales, indemnités, types de contrats', route: '/donnees-base/admin/grille-salariale' },
    { section: 'Paramétrage Paie & Retenues',items: '7 règles', icon: 'tune',               color: '#163059', desc: 'Taux % Part Employeur, Part Agent, barèmes et retenues', route: '/paie/parametrage' }
  ];

  constructor(public moduleNav: ModuleNavService, private router: Router) {}

  ngOnInit(): void {
    const isParam = this.router.url.includes('/parametrage');
    const targetModule = APP_MODULES.find(m => m.id === (isParam ? 'parametrage' : 'donnees-base'));
    if (targetModule) {
      this.module = targetModule;
      this.moduleNav.selectModule(this.module);
    }
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
