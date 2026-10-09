import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EtatSyntheseService } from '../../services/etat-synthese.service';

@Component({
  selector: 'app-dsn',
  template: `
    <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <h2 style="color: #0060B3; margin-bottom: 8px; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <mat-icon style="color: #0060B3;">security</mat-icon>
        Déclarations Sociales Mensuelles (CNSS / Cotisations)
      </h2>
      <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">
        Génération et export officiel des bordereaux déclaratifs et états nominatifs de cotisations sociales CNSS.
      </p>

      <mat-card style="border-radius: 12px; padding: 24px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #0f172a; font-weight: 600;">
          Bordereau Déclaratif des Cotisations CNSS
        </h3>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">
          Exportez le relevé officiel consolidé des cotisations sociales (Part Salariale 5,5 % plafonnée à 800 000 FCFA, Part Patronale et Prestations Familiales / Risques Professionnels) pour transmission à la Caisse Nationale de Sécurité Sociale.
        </p>

        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <button mat-raised-button
                  color="primary"
                  [disabled]="isExporting"
                  (click)="telechargerEtatCnss('excel')"
                  style="background: #0060B3; font-weight: 600; padding: 0 20px; height: 42px;">
            <mat-icon style="margin-right: 6px;">table_view</mat-icon>
            {{ isExporting ? 'Génération en cours...' : 'Télécharger Bordereau CNSS (Excel)' }}
          </button>

          <button mat-stroked-button
                  color="primary"
                  [disabled]="isExporting"
                  (click)="telechargerEtatCnss('pdf')"
                  style="font-weight: 600; padding: 0 20px; height: 42px;">
            <mat-icon style="margin-right: 6px;">picture_as_pdf</mat-icon>
            Télécharger Bordereau CNSS (PDF)
          </button>

          <button mat-button
                  (click)="naviguerVersEtats()"
                  style="color: #0288D1; font-weight: 600; padding: 0 16px; height: 42px;">
            <mat-icon style="margin-right: 6px;">visibility</mat-icon>
            Consulter dans les États de Synthèse
          </button>
        </div>
      </mat-card>
    </div>
  `,
  standalone: false
})
export class DsnComponent {
  isExporting = false;

  constructor(
    private etatSyntheseService: EtatSyntheseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  telechargerEtatCnss(format: 'excel' | 'pdf'): void {
    this.isExporting = true;
    const filter = { typeEtat: 'ETAT_CNSS' };
    const request$ = format === 'excel'
      ? this.etatSyntheseService.downloadExcel(filter)
      : this.etatSyntheseService.downloadPdf(filter);

    request$.subscribe({
      next: (blob) => {
        const ext = format === 'excel' ? 'xlsx' : 'pdf';
        const filename = `bordereau-declaratif-cnss.${ext}`;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 30000);

        this.isExporting = false;
        this.snackBar.open(`Bordereau CNSS (${format.toUpperCase()}) exporté avec succès`, 'Fermer', {
          duration: 3500,
          panelClass: ['snackbar-success']
        });
      },
      error: (err) => {
        this.isExporting = false;
        console.error('Erreur lors de la génération du bordereau CNSS:', err);
        this.snackBar.open('Erreur lors de la génération du document CNSS depuis le serveur', 'Fermer', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  naviguerVersEtats(): void {
    this.router.navigate(['/paie/etats-synthese', 'cnss']);
  }
}
