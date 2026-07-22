import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parametrage-paie',
  template: `
    <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <h2 style="color: #163059; margin-bottom: 16px;">Paramétrage du Module de Paie</h2>
      <mat-card style="border-radius: 12px; padding: 20px;">
        <p style="color: #64748b; font-size: 14px;">Accès rapide aux paramètres de la paie et aux grilles indemnitaires.</p>
        <div style="display: flex; gap: 16px; margin-top: 16px; flex-wrap: wrap;">
          <button mat-raised-button color="primary" style="padding: 10px 20px;" (click)="ouvrirParamIndemnite()">
            <mat-icon style="margin-right: 6px;">settings_suggest</mat-icon> Accéder au Paramétrage d'Indemnité
          </button>
          <button mat-stroked-button color="primary" style="padding: 10px 20px;" (click)="ouvrirGrilleSalariale()">
            <mat-icon style="margin-right: 6px;">table_chart</mat-icon> Accéder à la Grille Salariale
          </button>
        </div>
      </mat-card>
    </div>
  `,
  standalone: false
})
export class ParametragePaieComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {}

  ouvrirParamIndemnite(): void {
    this.router.navigate(['/donnees-base/admin/param-indemnite']);
  }

  ouvrirGrilleSalariale(): void {
    this.router.navigate(['/donnees-base/admin/grille-salariale']);
  }
}
