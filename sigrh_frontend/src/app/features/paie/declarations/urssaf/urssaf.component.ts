import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-urssaf',
  template: `
    <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <h2 style="color: #0060B3; margin-bottom: 16px;">Déclaration Récapitulative des Impôts et Taxes (IUTS / TPA)</h2>
      <mat-card style="border-radius: 12px; padding: 20px;">
        <p style="color: #64748b; font-size: 14px;">Bilan des retenues fiscales prélevées sur les traitements et salaires.</p>
        <button mat-raised-button color="primary" style="margin-top: 12px;" onclick="alert('Déclaration IUTS / TPA générée avec succès !')">
          <mat-icon style="margin-right: 6px;">download</mat-icon> Générer l'État IUTS / TPA (PDF)
        </button>
      </mat-card>
    </div>
  `,
  standalone: false
})
export class UrssafComponent implements OnInit {
  ngOnInit(): void {}
}

