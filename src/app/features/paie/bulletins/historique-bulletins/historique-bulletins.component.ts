import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-historique-bulletins',
  template: `
    <div style="padding: 20px; max-width: 1400px; margin: 0 auto;">
      <div class="page-header" style="background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px 24px; color: var(--on-surface); display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; box-shadow: var(--shadow-card); flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="background: rgba(2, 132, 199, 0.12); color: #0284c7; padding: 12px; border-radius: 12px; display: flex; border: 1px solid rgba(2, 132, 199, 0.25);">
            <mat-icon style="font-size: 28px; width: 28px; height: 28px;">history_edu</mat-icon>
          </div>
          <div>
            <h2 style="color: var(--on-surface); margin: 0 0 4px 0; font-size: 20px; font-weight: 800;">Historique & Registre des Sessions de Paie</h2>
            <p style="color: var(--on-surface-3); font-size: 13px; margin: 0;">Consultation, traçabilité et gestion des sessions de paie enregistrées en base PostgreSQL.</p>
          </div>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button mat-raised-button color="accent" (click)="allerVersCreation()" style="background: #0284c7; color: white; font-weight: 700; border-radius: 8px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);">
            <mat-icon style="margin-right: 4px;">add_circle</mat-icon> Nouvelle Session
          </button>
          <button mat-stroked-button (click)="chargerSessions()" style="color: var(--on-surface); border-color: var(--border); border-radius: 8px;">
            <mat-icon style="margin-right: 4px;">refresh</mat-icon> Actualiser
          </button>
        </div>
      </div>

      <div style="background: var(--surface); border-radius: 14px; border: 1px solid var(--border); padding: 20px; box-shadow: var(--shadow-card); overflow: hidden;">
        @if (isLoading) {
          <div style="text-align: center; padding: 40px;">
            <mat-spinner diameter="36" style="margin: 0 auto 12px;"></mat-spinner>
            <span style="color: var(--on-surface-3);">Chargement des sessions de paie...</span>
          </div>
        } @else if (sessions.length === 0) {
          <div style="text-align: center; padding: 50px 20px; color: var(--on-surface-3);">
            <mat-icon style="font-size: 48px; width: 48px; height: 48px; color: var(--border); margin-bottom: 8px;">folder_open</mat-icon>
            <p style="font-size: 15px; margin-top: 8px; color: var(--on-surface-2);">Aucune session de paie enregistrée pour le moment.</p>
            <button mat-raised-button color="primary" (click)="allerVersCreation()" style="margin-top: 12px; font-weight: 700; background: #0284c7; color: white; border-radius: 8px;">
              Créer la première session
            </button>
          </div>
        } @else {
          <div style="overflow-x: auto; width: 100%;">
            <table style="width: 100%; min-width: 900px; border-collapse: collapse;">
              <thead>
                <tr style="background: var(--surface-variant); border-bottom: 2px solid var(--border); font-weight: 700; text-align: left; font-size: 11px; color: var(--on-surface-2); letter-spacing: 0.5px; text-transform: uppercase;">
                  <th style="padding: 14px 16px;">Code Session</th>
                  <th style="padding: 14px 16px;">Période</th>
                  <th style="padding: 14px 16px;">Type</th>
                  <th style="padding: 14px 16px;">Effectif</th>
                  <th style="padding: 14px 16px; text-align: right;">Total Brut</th>
                  <th style="padding: 14px 16px; text-align: right;">Total Net</th>
                  <th style="padding: 14px 16px; text-align: center;">Statut</th>
                  <th style="padding: 14px 16px; text-align: center;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (s of sessions; track s.id) {
                  <tr style="border-bottom: 1px solid var(--border); font-size: 13px; color: var(--on-surface); transition: background 0.15s;">
                    <td style="padding: 13px 16px; font-weight: 700; color: #0284c7; font-family: monospace;">{{ s.codeSession }}</td>
                    <td style="padding: 13px 16px; font-weight: 600; font-family: monospace; color: var(--on-surface);">{{ s.periode || (s.mois + '/' + s.annee) }}</td>
                    <td style="padding: 13px 16px;">
                      <span style="background: rgba(2, 132, 199, 0.1); color: #0284c7; border: 1px solid rgba(2, 132, 199, 0.25); padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">
                        {{ s.typeSession || 'PAIE_NORMALE' }}
                      </span>
                    </td>
                    <td style="padding: 13px 16px; color: var(--on-surface-2);">{{ s.nombreEmployes || '-' }} agents</td>
                    <td style="padding: 13px 16px; text-align: right; font-weight: 700; font-family: monospace; color: var(--on-surface);">
                      {{ (s.totalBrut | number:'1.0-0') || '0' }}
                    </td>
                    <td style="padding: 13px 16px; text-align: right; font-weight: 900; color: #16a34a; font-family: monospace;">
                      {{ (s.totalNet | number:'1.0-0') || '0' }}
                    </td>
                    <td style="padding: 13px 16px; text-align: center;">
                      @if (s.statut === 'CLOTURE') {
                        <span style="background: rgba(148, 163, 184, 0.15); color: #64748b; border: 1px solid rgba(148, 163, 184, 0.3); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 800;">Clôturé</span>
                      } @else if (s.statut === 'VALIDE') {
                        <span style="background: rgba(74, 222, 128, 0.15); color: #16a34a; border: 1px solid rgba(74, 222, 128, 0.3); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 800;">Validé</span>
                      } @else if (s.statut === 'GENERE') {
                        <span style="background: rgba(2, 132, 199, 0.12); color: #0284c7; border: 1px solid rgba(2, 132, 199, 0.3); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 800;">Généré</span>
                      } @else {
                        <span style="background: rgba(251, 191, 36, 0.15); color: #d97706; border: 1px solid rgba(251, 191, 36, 0.3); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 800;">Brouillon</span>
                      }
                    </td>
                    <td style="padding: 13px 16px; text-align: center;">
                      <button mat-stroked-button (click)="ouvrirSession(s)" style="font-size: 12px; border-radius: 6px; color: var(--on-surface); border-color: var(--border);">
                        <mat-icon style="font-size: 16px; width: 16px; height: 16px; margin-right: 2px;">visibility</mat-icon> Ouvrir
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  standalone: false
})
export class HistoriqueBulletinsComponent implements OnInit {
  sessions: any[] = [];
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerSessions();
  }

  chargerSessions(): void {
    this.isLoading = true;
    this.http.get<any[]>(`${environment.apiUrl}/paie/sessions`).pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      this.sessions = data || [];
      this.isLoading = false;
    });
  }

  allerVersCreation(): void {
    this.router.navigate(['/paie/bulletins/generer']);
  }

  ouvrirSession(session: any): void {
    this.router.navigate(['/paie/bulletins/generer']);
  }
}
