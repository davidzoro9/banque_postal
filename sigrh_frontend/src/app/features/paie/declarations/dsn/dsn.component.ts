import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dsn',
  template: `
    <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <h2 style="color: #0060B3; margin-bottom: 16px;">Déclarations Sociales Mensuelles (CNSS / Impôts)</h2>
      <mat-card style="border-radius: 12px; padding: 20px;">
        <p style="color: #64748b; font-size: 14px;">Téléchargement et télé-déclaration des états nominatifs de cotisations sociales.</p>
        <button mat-raised-button color="primary" style="margin-top: 12px;" onclick="alert('Export état nominatif CNSS généré avec succès !')">
          <mat-icon style="margin-right: 6px;">download</mat-icon> Générer l'État Nominatif CNSS (Excel/TXT)
        </button>
      </mat-card>
    </div>
  `,
  standalone: false
})
export class DsnComponent implements OnInit {
  ngOnInit(): void {}
}

