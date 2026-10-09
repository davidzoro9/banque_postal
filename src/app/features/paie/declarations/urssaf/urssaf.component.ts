import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EtatSyntheseService } from '../../services/etat-synthese.service';

@Component({
  selector: 'app-urssaf',
  template: `
    <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <h2 style="color: #0060B3; margin-bottom: 8px; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <mat-icon style="color: #0060B3;">receipt_long</mat-icon>
        Déclaration Récapitulative des Impôts et Taxes (IUTS / TPA)
      </h2>
      <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">
        Bilan officiel des retenues fiscales et prélèvements légaux sur traitements et salaires.
      </p>

      <mat-card style="border-radius: 12px; padding: 24px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 16px; color: #0f172a; font-weight: 600;">
          État Déclaratif Fiscal IUTS & Taxes sur Salaires
        </h3>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">
          Exportez le relevé officiel détaillant les bases imposables, le barème progressif IUTS avec charges de famille, et le Fonds de Soutien Patriotique (FSP) pour transmission à la Direction Générale des Impôts (DGI).
        </p>

        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <button mat-raised-button
                  color="primary"
                  [disabled]="isExporting"
                  (click)="telechargerEtatIuts('pdf')"
                  style="background: #0060B3; font-weight: 600; padding: 0 20px; height: 42px;">
            <mat-icon style="margin-right: 6px;">picture_as_pdf</mat-icon>
            {{ isExporting ? 'Génération en cours...' : 'Générer l\'État IUTS (PDF)' }}
          </button>

          <button mat-stroked-button
                  color="primary"
                  [disabled]="isExporting"
                  (click)="telechargerEtatIuts('excel')"
                  style="font-weight: 600; padding: 0 20px; height: 42px;">
            <mat-icon style="margin-right: 6px;">table_view</mat-icon>
            Générer l'État IUTS (Excel)
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
export class UrssafComponent {
  isExporting = false;

  constructor(
    private etatSyntheseService: EtatSyntheseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  telechargerEtatIuts(format: 'pdf' | 'excel'): void {
    this.isExporting = true;
    const filter = { typeEtat: 'ETAT_IUTS' };
    const request$ = format === 'pdf'
      ? this.etatSyntheseService.downloadPdf(filter)
      : this.etatSyntheseService.downloadExcel(filter);

    request$.subscribe({
      next: (blob) => {
        const ext = format === 'pdf' ? 'pdf' : 'xlsx';
        const filename = `etat-declaratif-iuts.${ext}`;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 30000);

        this.isExporting = false;
        this.snackBar.open(`État fiscal IUTS (${format.toUpperCase()}) généré avec succès`, 'Fermer', {
          duration: 3500,
          panelClass: ['snackbar-success']
        });
      },
      error: (err) => {
        this.isExporting = false;
        console.error('Erreur lors de la génération de l\'état IUTS:', err);
        this.snackBar.open('Erreur lors de la génération de l\'état IUTS depuis le serveur', 'Fermer', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  naviguerVersEtats(): void {
    this.router.navigate(['/paie/etats-synthese', 'iuts']);
  }
}
