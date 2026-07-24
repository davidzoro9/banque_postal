import { Component, OnInit } from '@angular/core';

export interface ParametragePaieRule {
  id?: number;
  code: string;
  libelle: string;
  partEmployeurType?: string; // Type Ligne 1 (ex: Part Employeur)
  partEmployeurPct: number;  // Taux Ligne 1 (%)
  partAgentType?: string;     // Type Ligne 2 (ex: Part Agent)
  partAgentPct: number;      // Taux Ligne 2 (%)
  taux?: number;
  type?: string;
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
            Chaque retenue contient 2 sous-lignes associant chacune son type et son taux (%)
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
            Liste des Retenues sur Salaire (2 sous-lignes par retenue : Type & Taux)
          </h3>
          <span style="font-size: 12px; color: #64748b;">
            Affichage détaillé avec sous-lignes Part Employeur et Part Agent
          </span>
        </div>

        <div style="overflow-x: auto; width: 100%;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 900px;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #334155; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                <th style="padding: 14px 18px; width: 120px;">Code</th>
                <th style="padding: 14px 18px; min-width: 180px;">Libellé de la Retenue</th>
                <th style="padding: 14px 18px; width: 220px; color: #0060B3;">Type de Retenue (Sous-ligne)</th>
                <th style="padding: 14px 18px; text-align: center; background: #e0f2fe; color: #0369a1; width: 150px;">Taux (%)</th>
                <th style="padding: 14px 18px;">Description</th>
                <th style="padding: 14px 18px; text-align: center; width: 90px;">Statut</th>
                <th style="padding: 14px 18px; text-align: right; width: 90px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngFor="let item of rules">
                <!-- Ligne 1 : Part Employeur -->
                <tr style="border-bottom: 1px dashed #cbd5e1; font-size: 14px; background: #ffffff;">
                  <td rowspan="2" style="padding: 14px 18px; vertical-align: top; border-bottom: 2px solid #cbd5e1;">
                    <span style="font-weight: 700; color: #0060B3; background: #e0f2fe; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 13px; display: inline-block; white-space: nowrap;">
                      {{ item.code }}
                    </span>
                  </td>
                  <td rowspan="2" style="padding: 14px 18px; font-weight: 700; color: #0f172a; vertical-align: top; border-bottom: 2px solid #cbd5e1;">
                    {{ item.libelle }}
                  </td>

                  <!-- Sub-row 1 Type -->
                  <td style="padding: 10px 18px;">
                    <span style="background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 12px; padding: 4px 12px; border-radius: 12px; display: inline-block; white-space: nowrap; border: 1px solid #bae6fd;">
                      {{ item.partEmployeurType || 'Part Employeur' }}
                    </span>
                  </td>

                  <!-- Sub-row 1 Taux -->
                  <td style="padding: 10px 18px; text-align: center; background: #f0f9ff;">
                    <span style="background: #0288D1; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-weight: 800; font-size: 13px; display: inline-block; white-space: nowrap;">
                      {{ (item.partEmployeurPct !== undefined ? item.partEmployeurPct : 0) | number:'1.1-2' }} %
                    </span>
                  </td>

                  <td rowspan="2" style="padding: 14px 18px; color: #64748b; font-size: 13px; vertical-align: top; border-bottom: 2px solid #cbd5e1;">
                    {{ item.description || '—' }}
                  </td>

                  <td rowspan="2" style="padding: 14px 18px; text-align: center; vertical-align: top; border-bottom: 2px solid #cbd5e1;">
                    <span (click)="toggleStatut(item)" style="cursor: pointer; display: inline-block; white-space: nowrap;" [title]="item.actif ? 'Cliquer pour désactiver' : 'Cliquer pour activer'">
                      <span *ngIf="item.actif" style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700;">Actif</span>
                      <span *ngIf="!item.actif" style="background: #f3f4f6; color: #6b7280; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Inactif</span>
                    </span>
                  </td>

                  <td rowspan="2" style="padding: 14px 18px; text-align: right; white-space: nowrap; vertical-align: top; border-bottom: 2px solid #cbd5e1;">
                    <button mat-icon-button color="primary" (click)="editerRule(item)" title="Modifier les 2 lignes">
                      <mat-icon style="font-size: 20px;">edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="supprimerRule(item)" title="Supprimer la retenue">
                      <mat-icon style="font-size: 20px;">delete</mat-icon>
                    </button>
                  </td>
                </tr>

                <!-- Ligne 2 : Part Agent -->
                <tr style="border-bottom: 2px solid #cbd5e1; font-size: 14px; background: #fafafa;">
                  <!-- Sub-row 2 Type -->
                  <td style="padding: 10px 18px;">
                    <span style="background: #f3e8ff; color: #6b21a8; font-weight: 700; font-size: 12px; padding: 4px 12px; border-radius: 12px; display: inline-block; white-space: nowrap; border: 1px solid #e9d5ff;">
                      {{ item.partAgentType || 'Part Agent' }}
                    </span>
                  </td>

                  <!-- Sub-row 2 Taux -->
                  <td style="padding: 10px 18px; text-align: center; background: #faf5ff;">
                    <span style="background: #7B1FA2; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-weight: 800; font-size: 13px; display: inline-block; white-space: nowrap;">
                      {{ (item.partAgentPct !== undefined ? item.partAgentPct : item.taux || 0) | number:'1.1-2' }} %
                    </span>
                  </td>
                </tr>
              </ng-container>

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
        <div style="background: #fff; width: 100%; max-width: 580px; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
            <h3 style="margin: 0; color: #0060B3; font-size: 18px; font-weight: 700;">
              {{ modeEdition ? 'Modifier la Retenue (2 Lignes)' : 'Nouvelle Retenue (2 Lignes)' }}
            </h3>
            <button mat-icon-button (click)="fermerFormulaire()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <!-- Code & Libellé -->
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Code *</label>
                <input
                  type="text"
                  [(ngModel)]="formRule.code"
                  placeholder="Ex: RET-CNSS"
                  style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; text-transform: uppercase;"
                >
              </div>

              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Libellé de la retenue *</label>
                <input
                  type="text"
                  [(ngModel)]="formRule.libelle"
                  placeholder="Ex: Cotisation Sociale CNSS"
                  style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;"
                >
              </div>
            </div>

            <!-- Subdivision : Ligne 1 (Part Employeur) -->
            <div style="background: #f0f9ff; padding: 14px; border-radius: 12px; border: 1.5px solid #bae6fd;">
              <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: #0369a1; display: flex; align-items: center; gap: 6px;">
                🔹 Ligne 1 : Type et Taux (Part Employeur)
              </h4>
              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; align-items: center;">
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 600; color: #0369a1; margin-bottom: 4px;">Type (Ligne 1) *</label>
                  <select
                    [(ngModel)]="formRule.partEmployeurType"
                    style="width: 100%; padding: 8px 10px; border: 1px solid #0288D1; border-radius: 6px; font-size: 13px; background: #fff;"
                  >
                    <option *ngFor="let t of typesOptions" [value]="t.libelle">{{ t.libelle }}</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #0288D1; margin-bottom: 4px;">Taux (%) *</label>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      [(ngModel)]="formRule.partEmployeurPct"
                      placeholder="16.0"
                      style="width: 100%; padding: 8px; border: 1px solid #0288D1; border-radius: 6px; font-size: 14px; font-weight: 800; color: #0288D1;"
                    >
                    <span style="font-weight: 800; color: #0288D1;">%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Subdivision : Ligne 2 (Part Agent) -->
            <div style="background: #faf5ff; padding: 14px; border-radius: 12px; border: 1.5px solid #e9d5ff;">
              <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: #6b21a8; display: flex; align-items: center; gap: 6px;">
                🟣 Ligne 2 : Type et Taux (Part Agent)
              </h4>
              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px; align-items: center;">
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 600; color: #6b21a8; margin-bottom: 4px;">Type (Ligne 2) *</label>
                  <select
                    [(ngModel)]="formRule.partAgentType"
                    style="width: 100%; padding: 8px 10px; border: 1px solid #7B1FA2; border-radius: 6px; font-size: 13px; background: #fff;"
                  >
                    <option *ngFor="let t of typesOptions" [value]="t.libelle">{{ t.libelle }}</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #7B1FA2; margin-bottom: 4px;">Taux (%) *</label>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      [(ngModel)]="formRule.partAgentPct"
                      placeholder="5.5"
                      style="width: 100%; padding: 8px; border: 1px solid #7B1FA2; border-radius: 6px; font-size: 14px; font-weight: 800; color: #7B1FA2;"
                    >
                    <span style="font-weight: 800; color: #7B1FA2;">%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Description / Remarques</label>
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
  typesOptions = [
    { code: 'TR-PATRONALE', libelle: 'Part Employeur' },
    { code: 'TR-SALARIALE', libelle: 'Part Agent' },
    { code: 'TR-SOCIALE',   libelle: 'Cotisation Sociale (CNSS/CARFO)' },
    { code: 'TR-FISCALE',   libelle: 'Retenue Fiscale (IUTS/TPA)' },
    { code: 'TR-ASSURANCE', libelle: 'Assurance & Mutuelle Santé' },
    { code: 'TR-PRET',      libelle: 'Remboursement Prêt & Avance' }
  ];

  afficherFormulaire: boolean = false;
  modeEdition: boolean = false;

  formRule: ParametragePaieRule = this.getEmptyRule();

  ngOnInit(): void {
    this.chargerTypesOptions();
    this.chargerRules();
  }

  chargerTypesOptions(): void {
    const savedTypes = localStorage.getItem('sigrh_types_retenues_v2');
    if (savedTypes) {
      try {
        const parsed = JSON.parse(savedTypes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.typesOptions = parsed.map((t: any) => ({ code: t.code, libelle: t.libelle }));
        }
      } catch (e) {}
    }
  }

  chargerRules(): void {
    const saved = localStorage.getItem('sigrh_retenues_v7');
    if (saved) {
      try {
        this.rules = JSON.parse(saved);
        return;
      } catch (e) {}
    }

    // Retenues avec 2 sous-lignes distinctes (Type & Taux)
    this.rules = [
      {
        id: 1,
        code: 'RET-CNSS',
        libelle: 'Cotisation Sociale CNSS',
        partEmployeurType: 'Part Employeur',
        partEmployeurPct: 16.0,
        partAgentType: 'Part Agent',
        partAgentPct: 5.5,
        actif: true,
        description: 'Sécurité sociale obligatoire (Plafond 600 000 FCFA)'
      },
      {
        id: 2,
        code: 'RET-CRRAE',
        libelle: 'Retraite Complémentaire CRRAE-UMOA',
        partEmployeurType: 'Part Employeur',
        partEmployeurPct: 10.0,
        partAgentType: 'Part Agent',
        partAgentPct: 6.0,
        actif: true,
        description: 'Régime de retraite complémentaire bancaire UMOA'
      },
      {
        id: 3,
        code: 'RET-IUTS',
        libelle: 'Impôt Unique sur Traitements (IUTS)',
        partEmployeurType: 'Part Employeur (Exonéré)',
        partEmployeurPct: 0.0,
        partAgentType: 'Part Agent (Retenue Fiscale)',
        partAgentPct: 10.0,
        actif: true,
        description: 'Impôt direct retenu à la source selon le barème progressif'
      },
      {
        id: 4,
        code: 'RET-ASSUR',
        libelle: 'Assurance Maladie Groupe',
        partEmployeurType: 'Part Employeur (50%)',
        partEmployeurPct: 50.0,
        partAgentType: 'Part Agent (50%)',
        partAgentPct: 50.0,
        actif: true,
        description: 'Couverture santé groupe entreprise'
      },
      {
        id: 5,
        code: 'RET-MUTUELLE',
        libelle: 'Mutuelle de Santé Interne',
        partEmployeurType: 'Part Employeur',
        partEmployeurPct: 0.0,
        partAgentType: 'Part Agent (Mutuelle)',
        partAgentPct: 2.0,
        actif: true,
        description: 'Cotisation mutuelle du personnel (2% du salaire de base)'
      }
    ];

    this.sauvegarderLocal();
  }

  sauvegarderLocal(): void {
    localStorage.setItem('sigrh_retenues_v7', JSON.stringify(this.rules));
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
      partEmployeurType: 'Part Employeur',
      partEmployeurPct: 0,
      partAgentType: 'Part Agent',
      partAgentPct: 0,
      actif: true,
      description: ''
    };
  }
}
