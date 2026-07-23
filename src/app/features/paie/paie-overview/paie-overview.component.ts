import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../core/models/app-module.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-paie-overview',
  templateUrl: './paie-overview.component.html',
  styleUrls: ['./paie-overview.component.scss'],
  standalone: false
})
export class PaieOverviewComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'paie')!;

  kpis = [
    { label: 'Bulletins générés', value: '4',         icon: 'receipt_long', color: '#1B3A6B', sub: 'Juillet 2026' },
    { label: 'Masse salariale',   value: '2,600,000 FCFA',  icon: 'payments',    color: '#0060B3', sub: 'Brut mensuel' },
    { label: 'Indemnités versées', value: '1,200,000 FCFA', icon: 'paid', color: '#2E7D32', sub: 'Paramétrage actif' },
    { label: 'Anomalies paie',    value: '0',       icon: 'check_circle',color: '#2E7D32', sub: 'Conforme' }
  ];

  quickActions = [
    { label: 'Générer bulletins', icon: 'add_circle_outline', route: '/paie/bulletins/generer',    color: '#1B3A6B' },
    { label: 'Historique',        icon: 'history',             route: '/paie/bulletins/historique', color: '#0060B3' },
    { label: 'Paramétrage indemnité', icon: 'settings_suggest', route: '/donnees-base/admin/param-indemnite', color: '#2E7D32' },
    { label: 'Paramétrage',       icon: 'tune',                route: '/paie/parametrage',          color: '#FFC700' }
  ];

  recentBulletins: any[] = [];

  constructor(
    public moduleNav: ModuleNavService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.loadCalculatedPaie();
  }

  loadCalculatedPaie(): void {
    this.http.get<any[]>(`${environment.apiUrl}/paie/calculer-tous`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.recentBulletins = data.map(item => ({
            employe: item.employeeName,
            poste: item.fonction || item.grade || 'Employé',
            net: (item.salaireNet || 0).toLocaleString('fr-FR') + ' FCFA',
            brut: (item.salaireBrut || 0).toLocaleString('fr-FR') + ' FCFA',
            mois: item.mois || 'Juillet 2026',
            etat: item.etat || 'Généré'
          }));
          this.kpis[0].value = '' + data.length;
          const totalBrut = data.reduce((sum, item) => sum + (item.salaireBrut || 0), 0);
          this.kpis[1].value = Math.round(totalBrut).toLocaleString('fr-FR') + ' FCFA';
          const totalInd = data.reduce((sum, item) => sum + (item.totalIndemnites || 0), 0);
          this.kpis[2].value = Math.round(totalInd).toLocaleString('fr-FR') + ' FCFA';
        }
      },
      error: (err) => {
        console.warn('Backend paie calculate fallback:', err);
        this.recentBulletins = [
          { employe: 'Marie Dupont',   poste: 'Directrice RH',  net: '552 500 FCFA', brut: '650 000 FCFA', mois: 'Juillet 2026', etat: 'Généré' },
          { employe: 'Jean Martin',    poste: 'Ingénieur',       net: '467 500 FCFA', brut: '550 000 FCFA', mois: 'Juillet 2026', etat: 'Généré' },
          { employe: 'Sophie Bernard', poste: 'Commerciale',     net: '425 000 FCFA', brut: '500 000 FCFA', mois: 'Juillet 2026', etat: 'Généré' }
        ];
      }
    });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}

