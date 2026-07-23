import { Component, OnInit } from '@angular/core';

export interface ParametragePaieRule {
  id?: number;
  code: string;
  libelle: string;
  partEmployeurPct: number;  // Taux Part Employeur (Patronale %)
  partAgentPct: number;      // Taux Part Agent / Salariale (%)
  assietteCalcul: 'SALAIRE_BASE' | 'SALAIRE_BRUT' | 'BRUT_IMPOSABLE' | 'MONTANT_FIXE';
  plafondMensuel?: number;   // Plafond mensuel en FCFA (0 si non plafonné)
  actif: boolean;
  description?: string;
}

@Component({
  selector: 'app-parametrage-paie',
  template: `
    <div style="padding: 24px; width: 100%; box-sizing: border-box; font-family: 'Segoe UI', sans-serif;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="color: #0060B3; margin: 0; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
            <mat-icon style="color: #0060B3;">tune</mat-icon>
            Paramétrage des Retenues sur Salaire
          </h2>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">
            Définition des retenues applicables avec le taux de chaque type (Part Employeur et Part Agent)
          </p>
        </div>
        <button mat-raised-button (click)="ouvrirFormulaire()" style="background: #0060B3; color: #ffffff; border-radius: 8px; font-weight: 600; padding: 0 22px; height: 42px;">
          <mat-icon style="margin-right: 6px; color: #ffffff;">add_circle</mat-icon> Nouvelle Retenue
        </button>
      </div>

      <!-- Main Retenues Table -->
      <mat-card style="border-radius: 12px; padding: 0; overflow: hidden; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 32px; width: 100%;">
        <div style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #0060B3;">
            Liste des Retenues (Code, Libellé, Taux Part Employeur, Taux Part Agent, Description)
          </h3>
          <span style="font-size: 12px; color: #64748b;">
            Déduction automatique selon les taux configurés
          </span>
        </div>

        <div style="overflow-x: auto; width: 100%;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 800px;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #334155; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                <th style="padding: 14px 18px; width: 120px;">Code</th>
                <th style="padding: 14px 18px; min-width: 200px;">Libellé de la Retenue</th>
                <th style="padding: 14px 18px; text-align: center; background: #e0f2fe; color: #0369a1; width: 180px;">Taux Part Employeur (%)</th>
                <th style="padding: 14px 18px; text-align: center; background: #f3e8ff; color: #6b21a8; width: 180px;">Taux Part Agent (%)</th>
                <th style="padding: 14px 18px;">Description</th>
                <th style="padding: 14px 18px; text-align: center; width: 100px;">Statut</th>
                <th style="padding: 14px 18px; text-align: right; width: 100px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of rules" style="border-bottom: 1px solid #f1f5f9; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
                <td style="padding: 14px 18px;">
                  <span style="font-weight: 700; color: #0060B3; background: #e0f2fe; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 13px; display: inline-block; white-space: nowrap;">
                    {{ item.code }}
                  </span>
                </td>
                <td style="padding: 14px 18px; font-weight: 700; color: #0f172a;">
                  {{ item.libelle }}
                </td>

                <!-- Taux Part Employeur (%) -->
                <td style="padding: 14px 18px; text-align: center; background: #f0f9ff;">
                  <span style="background: #0288D1; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block; white-space: nowrap;">
                    {{ item.partEmployeurPct | number:'1.1-2' }} %
                  </span>
                </td>

                <!-- Taux Part Agent (%) -->
                <td style="padding: 14px 18px; text-align: center; background: #faf5ff;">
                  <span style="background: #7B1FA2; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-block; white-space: nowrap;">
                    {{ item.partAgentPct | number:'1.1-2' }} %
                  </span>
                </td>

                <td style="padding: 14px 18px; color: #64748b; font-size: 13px;">
                  {{ item.description || '—' }}
                </td>

                <td style="padding: 14px 18px; text-align: center;">
                  <span (click)="toggleStatut(item)" style="cursor: pointer; display: inline-block; white-space: nowrap;" [title]="item.actif ? 'Cliquer pour désactiver' : 'Cliquer pour activer'">
                    <span *ngIf="item.actif" style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700;">Actif</span>
                    <span *ngIf="!item.actif" style="background: #f3f4f6; color: #6b7280; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Inactif</span>
                  </span>
                </td>

                <td style="padding: 14px 18px; text-align: right; white-space: nowrap;">
                  <button mat-icon-button color="primary" (click)="editerRule(item)" title="Modifier">
                    <mat-icon style="font-size: 20px;">edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="supprimerRule(item)" title="Supprimer">
                    <mat-icon style="font-size: 20px;">delete</mat-icon>
                  </button>
                </td>
              </tr>

              <tr *ngIf="rules.length === 0">
                <td colspan="7" style="padding: 32px; text-align: center; color: #94a3b8;">
                  Aucune retenue configurée. Cliquer sur "Nouvelle Retenue".
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </mat-card>

      <!-- Modal Form Overlay -->
      <div *ngIf="afficherFormulaire" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
        <div style="background: #fff; width: 100%; max-width: 540px; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
            <h3 style="margin: 0; color: #0060B3; font-size: 18px; font-weight: 700;">
              {{ modeEdition ? 'Modifier la Retenue' : 'Nouvelle Retenue' }}
            </h3>
            <button mat-icon-button (click)="fermerFormulaire()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <!-- Code -->
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Code de la retenue *</label>
              <input
                type="text"
                [(ngModel)]="formRule.code"
                placeholder="Ex: RET-CNSS, RET-CRRAE, RET-IUTS..."
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; text-transform: uppercase;"
              >
            </div>

            <!-- Libellé -->
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Libellé de la retenue *</label>
              <input
                type="text"
                [(ngModel)]="formRule.libelle"
                placeholder="Ex: Cotisation Sociale CNSS"
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;"
              >
            </div>

            <!-- Taux Inputs: Taux Part Employeur (%) & Taux Part Agent (%) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 700; color: #0288D1; margin-bottom: 4px;">Taux Part Employeur (%) *</label>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    [(ngModel)]="formRule.partEmployeurPct"
                    placeholder="Ex: 16.0"
                    style="width: 100%; padding: 10px; border: 1px solid #0288D1; border-radius: 8px; font-size: 15px; font-weight: 700; color: #0288D1;"
                  >
                  <span style="font-weight: 700; color: #0288D1;">%</span>
                </div>
              </div>

              <div>
                <label style="display: block; font-size: 13px; font-weight: 700; color: #7B1FA2; margin-bottom: 4px;">Taux Part Agent (%) *</label>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    [(ngModel)]="formRule.partAgentPct"
                    placeholder="Ex: 5.5"
                    style="width: 100%; padding: 10px; border: 1px solid #7B1FA2; border-radius: 8px; font-size: 15px; font-weight: 700; color: #7B1FA2;"
                  >
                  <span style="font-weight: 700; color: #7B1FA2;">%</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Description</label>
              <textarea
                [(ngModel)]="formRule.description"
                rows="3"
                placeholder="Description détaillée de la retenue..."
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit;"
              ></textarea>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" id="chkRuleActif" [(ngModel)]="formRule.actif" style="width: 18px; height: 18px; cursor: pointer;">
              <label for="chkRuleActif" style="font-size: 14px; font-weight: 600; color: #1e293b; cursor: pointer;">Actif (Appliqué lors du calcul de la paie)</label>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <button mat-button (click)="fermerFormulaire()">Annuler</button>
            <button mat-raised-button color="primary" (click)="sauvegarderRule()" style="background: #0060B3; font-weight: 600;">
              <mat-icon style="margin-right: 6px;">save</mat-icon> Enregistrer la Retenue
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: false
})
export class ParametragePaieComponent implements OnInit {
  rules: ParametragePaieRule[] = [];
  salaireSimul: number = 500000;

  afficherFormulaire: boolean = false;
  modeEdition: boolean = false;

  formRule: ParametragePaieRule = this.getEmptyRule();

  ngOnInit(): void {
    this.chargerRules();
  }

  chargerRules(): void {
    const saved = localStorage.getItem('sigrh_retenues_v3');
    if (saved) {
      try {
        this.rules = JSON.parse(saved);
        return;
      } catch (e) {}
    }

    // Default rules with Code, Libellé, Taux Part Employeur, Taux Part Agent, Description
    this.rules = [
      {
        id: 1,
        code: 'RET-CNSS',
        libelle: 'Cotisation Sociale CNSS',
        partEmployeurPct: 16.0,
        partAgentPct: 5.5,
        assietteCalcul: 'SALAIRE_BRUT',
        plafondMensuel: 600000,
        actif: true,
        description: 'Sécurité sociale obligatoire (Part patronale 16%, Part salariale 5.5%, Plafond 600 000 FCFA)'
      },
      {
        id: 2,
        code: 'RET-CRRAE',
        libelle: 'Retraite Complémentaire CRRAE-UMOA',
        partEmployeurPct: 10.0,
        partAgentPct: 6.0,
        assietteCalcul: 'SALAIRE_BRUT',
        plafondMensuel: 0,
        actif: true,
        description: 'Régime de retraite complémentaire bancaire UMOA (Part patronale 10%, Part agent 6%)'
      },
      {
        id: 3,
        code: 'RET-IUTS',
        libelle: 'Impôt Unique sur Traitements (IUTS)',
        partEmployeurPct: 0.0,
        partAgentPct: 10.0,
        assietteCalcul: 'BRUT_IMPOSABLE',
        plafondMensuel: 0,
        actif: true,
        description: 'Impôt direct retenu à la source selon le barème progressif fiscal'
      },
      {
        id: 4,
        code: 'RET-ASSUR',
        libelle: 'Assurance Maladie Groupe',
        partEmployeurPct: 50.0,
        partAgentPct: 50.0,
        assietteCalcul: 'MONTANT_FIXE',
        plafondMensuel: 0,
        actif: true,
        description: 'Couverture santé groupe entreprise (Prise en charge 50% employeur, 50% agent)'
      },
      {
        id: 5,
        code: 'RET-MUTUELLE',
        libelle: 'Mutuelle de Santé Interne',
        partEmployeurPct: 0.0,
        partAgentPct: 2.0,
        assietteCalcul: 'SALAIRE_BASE',
        plafondMensuel: 0,
        actif: true,
        description: 'Cotisation mutuelle du personnel (2% du salaire de base prélevé sur l\'agent)'
      }
    ];

    this.sauvegarderLocal();
  }

  sauvegarderLocal(): void {
    localStorage.setItem('sigrh_retenues_v3', JSON.stringify(this.rules));
  }

  getTotalPartEmployeur(): number {
    return this.rules.filter(r => r.actif).reduce((acc, curr) => acc + (curr.partEmployeurPct || 0), 0);
  }

  getTotalPartAgent(): number {
    return this.rules.filter(r => r.actif).reduce((acc, curr) => acc + (curr.partAgentPct || 0), 0);
  }

  simulerChargeEmployeur(salaireBrut: number): number {
    return this.rules.filter(r => r.actif).reduce((acc, r) => acc + this.calculMontantPartEmployeur(r, salaireBrut), 0);
  }

  calculMontantPartEmployeur(rule: ParametragePaieRule, base: number): number {
    let assiette = base;
    if (rule.plafondMensuel && rule.plafondMensuel > 0 && base > rule.plafondMensuel) {
      assiette = rule.plafondMensuel;
    }
    return (assiette * (rule.partEmployeurPct || 0)) / 100;
  }

  calculMontantPartAgent(rule: ParametragePaieRule, base: number): number {
    let assiette = base;
    if (rule.plafondMensuel && rule.plafondMensuel > 0 && base > rule.plafondMensuel) {
      assiette = rule.plafondMensuel;
    }
    return (assiette * (rule.partAgentPct || 0)) / 100;
  }

  ouvrirFormulaire(): void {
    this.modeEdition = false;
    this.formRule = this.getEmptyRule();
    this.afficherFormulaire = true;
  }

  editerRule(item: ParametragePaieRule): void {
    this.modeEdition = true;
    this.formRule = { ...item };
    this.afficherFormulaire = true;
  }

  fermerFormulaire(): void {
    this.afficherFormulaire = false;
  }

  sauvegarderRule(): void {
    if (!this.formRule.code || !this.formRule.libelle) {
      alert('Veuillez renseigner le code et le libellé de la retenue.');
      return;
    }

    if (this.modeEdition) {
      const idx = this.rules.findIndex(r => r.id === this.formRule.id);
      if (idx !== -1) {
        this.rules[idx] = { ...this.formRule };
      }
    } else {
      this.formRule.id = Date.now();
      this.rules.unshift({ ...this.formRule });
    }

    this.sauvegarderLocal();
    this.fermerFormulaire();
  }

  supprimerRule(item: ParametragePaieRule): void {
    if (confirm(`Voulez-vous vraiment supprimer la retenue "${item.libelle}" ?`)) {
      this.rules = this.rules.filter(r => r.id !== item.id);
      this.sauvegarderLocal();
    }
  }

  toggleStatut(item: ParametragePaieRule): void {
    item.actif = !item.actif;
    this.sauvegarderLocal();
  }

  private getEmptyRule(): ParametragePaieRule {
    return {
      code: '',
      libelle: '',
      partEmployeurPct: 0,
      partAgentPct: 0,
      assietteCalcul: 'SALAIRE_BRUT',
      plafondMensuel: 0,
      actif: true,
      description: ''
    };
  }
}
