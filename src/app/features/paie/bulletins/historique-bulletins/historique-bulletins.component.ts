import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historique-bulletins',
  template: `
    <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <h2 style="color: #0060B3; margin-bottom: 16px;">Historique des Bulletins de Paie</h2>
      <mat-card style="border-radius: 12px; padding: 20px;">
        <p style="color: #64748b; font-size: 14px;">Consultation et téléchargement des registres et bulletins des sessions précédentes.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; font-weight: 700; text-align: left;">
            <th style="padding: 10px;">Session / Mois</th>
            <th style="padding: 10px;">Total Bulletins</th>
            <th style="padding: 10px;">Masse Salariale Brut</th>
            <th style="padding: 10px;">Statut</th>
            <th style="padding: 10px; text-align: center;">Actions</th>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px;"><strong>Juillet 2026</strong> (Session courante)</td>
            <td style="padding: 10px;">4</td>
            <td style="padding: 10px; font-weight: 600; color: #0060B3;">2 600 000 FCFA</td>
            <td style="padding: 10px;"><span style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">Validé</span></td>
            <td style="padding: 10px; text-align: center;">
              <button mat-stroked-button color="primary" onclick="window.print()"><mat-icon>print</mat-icon> Imprimer</button>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px;"><strong>Juin 2026</strong></td>
            <td style="padding: 10px;">4</td>
            <td style="padding: 10px; font-weight: 600; color: #0060B3;">2 550 000 FCFA</td>
            <td style="padding: 10px;"><span style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">Clôturé</span></td>
            <td style="padding: 10px; text-align: center;">
              <button mat-stroked-button color="primary" onclick="window.print()"><mat-icon>print</mat-icon> Imprimer</button>
            </td>
          </tr>
        </table>
      </mat-card>
    </div>
  `,
  standalone: false
})
export class HistoriqueBulletinsComponent implements OnInit {
  ngOnInit(): void {}
}

