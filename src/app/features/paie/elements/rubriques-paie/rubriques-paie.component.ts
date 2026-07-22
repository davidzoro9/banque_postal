import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rubriques-paie',
  template: `
    <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
      <h2 style="color: #163059; margin-bottom: 16px;">Rubriques de Paie</h2>
      <mat-card style="border-radius: 12px; padding: 20px;">
        <p style="color: #64748b; font-size: 14px;">Gestion des éléments de salaire (Gains, Primes, Indemnités, Retenues).</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px;">
          <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; font-weight: 700; text-align: left;">
            <th style="padding: 10px;">Code</th>
            <th style="padding: 10px;">Libellé de la Rubrique</th>
            <th style="padding: 10px;">Type</th>
            <th style="padding: 10px;">Imposable</th>
            <th style="padding: 10px;">Cotisant (CNSS)</th>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px;"><code>R-100</code></td>
            <td style="padding: 10px;"><strong>Salaire de Base</strong></td>
            <td style="padding: 10px;">Gain / Avoir</td>
            <td style="padding: 10px; color: #2e7d32;">Oui</td>
            <td style="padding: 10px; color: #2e7d32;">Oui</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px;"><code>R-200</code></td>
            <td style="padding: 10px;"><strong>Indemnité de Logement</strong></td>
            <td style="padding: 10px;">Indemnité</td>
            <td style="padding: 10px; color: #2e7d32;">Exonéré à 20%</td>
            <td style="padding: 10px; color: #2e7d32;">Oui</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px;"><code>R-201</code></td>
            <td style="padding: 10px;"><strong>Indemnité de Transport</strong></td>
            <td style="padding: 10px;">Indemnité</td>
            <td style="padding: 10px; color: #2e7d32;">Exonéré à 5%</td>
            <td style="padding: 10px; color: #2e7d32;">Oui</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px;"><code>R-500</code></td>
            <td style="padding: 10px;"><strong>Cotisation CNSS (Employé)</strong></td>
            <td style="padding: 10px; color: #c62828;">Retenue Sociale</td>
            <td style="padding: 10px;">Déductible</td>
            <td style="padding: 10px;">-</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px;"><code>R-600</code></td>
            <td style="padding: 10px;"><strong>Retenue Impôt IUTS</strong></td>
            <td style="padding: 10px; color: #c62828;">Retenue Fiscale</td>
            <td style="padding: 10px;">-</td>
            <td style="padding: 10px;">-</td>
          </tr>
        </table>
      </mat-card>
    </div>
  `,
  standalone: false
})
export class RubriquesPaieComponent implements OnInit {
  ngOnInit(): void {}
}
