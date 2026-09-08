import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-paie-overview',
  templateUrl: './paie-overview.component.html',
  styleUrls: ['./paie-overview.component.scss'],
  standalone: false
})
export class PaieOverviewComponent implements OnInit {
  bulletinsTraites = 0;
  bulletinsATraiter = 0;
  totalAgents = 0;
  loadingStats = true;

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
      description: 'Gestion des avances, acomptes, remboursements et retenues attribués aux agents.',
      route: '/donnees-base/admin/type-retenue-employe'
    }
  ];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loadingStats = true;
    forkJoin({
      bulletins: this.http.get<any[]>(`${environment.apiUrl}/bulletins`).pipe(catchError(() => of([]))),
      employees: this.http.get<any[]>(`${environment.apiUrl}/employees`).pipe(catchError(() => of([]))),
      sessions: this.http.get<any[]>(`${environment.apiUrl}/paie/sessions`).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ bulletins, employees, sessions }) => {
        const activeEmployees = (employees || []).filter((e: any) => e.statut !== 'Inactif' && e.statut !== 'Détaché');
        this.totalAgents = activeEmployees.length || (employees || []).length || 0;

        const activeSession = sessions && sessions.length > 0 ? sessions[0] : null;
        
        let processed = 0;
        if (activeSession) {
          processed = (bulletins || []).filter((b: any) => String(b.sessionPaieId) === String(activeSession.id)).length;
        } else {
          processed = (bulletins || []).length;
        }

        this.bulletinsTraites = processed;
        this.bulletinsATraiter = Math.max(0, this.totalAgents - this.bulletinsTraites);
        this.loadingStats = false;
      },
      error: () => {
        this.loadingStats = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
