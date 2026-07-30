import { Component, OnInit } from '@angular/core';

export interface ParametragePaieRule {
  id?: number;
  code: string;
  libelle: string;
  type: string;       // Part Agent (Salariale), Part Employeur (Patronale), Retenue Fiscale, etc.
  taux: number;       // Taux (%)
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
            Référentiel des retenues scindées ligne par ligne (Part Agent / Part Employeur, type et taux %)
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
            Liste des Retenues sur Salaire (Dissociées ligne par ligne : Type & Taux)
          </h3>
          <span style="font-size: 12px; color: #64748b;">
            {{ rules.length }} règle(s) de retenue configurée(s)
          </span>
        </div>

        <div style="overflow-x: auto; width: 100%;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 900px;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #334155; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                <th style="padding: 14px 18px; width: 120px;">Code</th>
                <th style="padding: 14px 18px; min-width: 220px;">Libellé de la Retenue</th>
                <th style="padding: 14px 18px; width: 220px; color: #0060B3;">Type de Part / Nature</th>
                <th style="padding: 14px 18px; text-align: center; background: #e0f2fe; color: #0369a1; width: 130px;">Taux (%)</th>
                <th style="padding: 14px 18px;">Description</th>
                <th style="padding: 14px 18px; text-align: center; width: 90px;">Statut</th>
                <th style="padding: 14px 18px; text-align: right; width: 100px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of rules" style="border-bottom: 1px solid #e2e8f0; font-size: 14px; background: #ffffff; transition: background 0.15s;" class="data-row">
                <!-- Code -->
                <td style="padding: 14px 18px;">
                  <span style="font-weight: 700; color: #0060B3; background: #e0f2fe; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 13px; display: inline-block; white-space: nowrap;">
                    {{ item.code }}
                  </span>
                </td>

                <!-- Libellé -->
                <td style="padding: 14px 18px; font-weight: 700; color: #0f172a;">
                  {{ item.libelle }}
                </td>

                <!-- Type -->
                <td style="padding: 14px 18px;">
                  <span [style.background]="getTypeBadgeStyle(item.type).bg"
                        [style.color]="getTypeBadgeStyle(item.type).color"
                        [style.borderColor]="getTypeBadgeStyle(item.type).border"
                        style="font-weight: 700; font-size: 12px; padding: 4px 12px; border-radius: 12px; display: inline-block; white-space: nowrap; border: 1px solid;">
                    {{ item.type || 'Part Agent' }}
                  </span>
                </td>

                <!-- Taux -->
                <td style="padding: 14px 18px; text-align: center; background: #f0f9ff;">
                  <span style="background: #0288D1; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-weight: 800; font-size: 13px; display: inline-block; white-space: nowrap;">
                    {{ (item.taux !== undefined ? item.taux : 0) | number:'1.1-2' }} %
                  </span>
                </td>

                <!-- Description -->
                <td style="padding: 14px 18px; color: #64748b; font-size: 13px;">
                  {{ item.description || '—' }}
                </td>

                <!-- Statut -->
                <td style="padding: 14px 18px; text-align: center;">
                  <span (click)="toggleStatut(item)" style="cursor: pointer; display: inline-block; white-space: nowrap;" [title]="item.actif ? 'Cliquer pour désactiver' : 'Cliquer pour activer'">
                    <span *ngIf="item.actif" style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700;">Actif</span>
                    <span *ngIf="!item.actif" style="background: #f3f4f6; color: #6b7280; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Inactif</span>
                  </span>
                </td>

                <!-- Actions -->
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
        <div style="background: #fff; width: 100%; max-width: 520px; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
            <h3 style="margin: 0; color: #0060B3; font-size: 18px; font-weight: 700;">
              {{ modeEdition ? 'Modifier le Paramétrage de Retenue' : 'Nouveau Paramétrage de Retenue' }}
            </h3>
            <button mat-icon-button (click)="fermerFormulaire()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <!-- Code : MASQUÉ lors de la création / VISIBLE lors de l'édition -->
            <div *ngIf="modeEdition" style="background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 12px; font-weight: 600; color: #64748b;">Code de référence généré :</span>
              <span style="font-weight: 800; color: #0060B3; font-family: monospace; font-size: 14px; background: #e0f2fe; padding: 3px 10px; border-radius: 4px;">
                {{ formRule.code }}
              </span>
            </div>

            <div *ngIf="!modeEdition" style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 10px 14px; border-radius: 8px; font-size: 12px; color: #0369a1; display: flex; align-items: center; gap: 8px;">
              <mat-icon style="font-size: 18px; width: 18px; height: 18px; color: #0060B3;">auto_awesome</mat-icon>
              <span>Le code de référence sera <strong>généré automatiquement</strong> dès l'enregistrement.</span>
            </div>

            <!-- Libellé de la retenue -->
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Libellé de la retenue *</label>
              <input
                type="text"
                [(ngModel)]="formRule.libelle"
                placeholder="Ex: Cotisation Sociale CNSS (Part Agent)"
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;"
              >
            </div>

            <!-- Type & Taux -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Type de part / Nature *</label>
                <select
                  [(ngModel)]="formRule.type"
                  style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #fff;"
                >
                  <option value="Part Agent (Salariale)">Part Agent (Salariale)</option>
                  <option value="Part Employeur (Patronale)">Part Employeur (Patronale)</option>
                  <option value="Retenue Fiscale (Agent)">Retenue Fiscale (Agent)</option>
                  <option value="Taxe Patronale (Employeur)">Taxe Patronale (Employeur)</option>
                  <option value="Cotisation Mutuelle & Santé">Cotisation Mutuelle & Santé</option>
                  <option value="Remboursement Prêt & Avance">Remboursement Prêt & Avance</option>
                  <option value="Cotisation Syndicale">Cotisation Syndicale</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 13px; font-weight: 700; color: #0288D1; margin-bottom: 4px;">Taux (%) *</label>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    [(ngModel)]="formRule.taux"
                    placeholder="5.5"
                    style="width: 100%; padding: 9px; border: 1px solid #0288D1; border-radius: 8px; font-size: 14px; font-weight: 800; color: #0288D1;"
                  >
                  <span style="font-weight: 800; color: #0288D1;">%</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Description / Remarques</label>
              <textarea
                [(ngModel)]="formRule.description"
                rows="3"
                placeholder="Description détaillée de cette part de retenue..."
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit;"
              ></textarea>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" id="chkRuleActif" [(ngModel)]="formRule.actif" style="width: 18px; height: 18px; cursor: pointer;">
              <label for="chkRuleActif" style="font-size: 14px; font-weight: 600; color: #1e293b; cursor: pointer;">Actif (Pris en compte lors du calcul de la paie)</label>
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
  afficherFormulaire: boolean = false;
  modeEdition: boolean = false;
  formRule: ParametragePaieRule = this.getEmptyRule();

  ngOnInit(): void {
    this.chargerRules();
  }

  chargerRules(): void {
    const saved = localStorage.getItem('sigrh_retenues_v9_scindes');
    if (saved) {
      try {
        this.rules = JSON.parse(saved);
        return;
      } catch (e) {}
    }

    // Référentiel des Retenues sur Salaire DISSOCIÉES ligne par ligne
    this.rules = [
      { id: 1,  code: 'RET-001', libelle: 'Cotisation Sociale CNSS (Part Agent)',             type: 'Part Agent (Salariale)',     taux: 5.5,  actif: true, description: 'Sécurité sociale obligatoire - Part salariale prélevée à la source (Plafond 600 000 FCFA)' },
      { id: 2,  code: 'RET-002', libelle: 'Cotisation Sociale CNSS (Part Employeur)',         type: 'Part Employeur (Patronale)',  taux: 16.0, actif: true, description: 'Sécurité sociale obligatoire - Part patronale prise en charge directement (Plafond 600 000 FCFA)' },
      { id: 3,  code: 'RET-003', libelle: 'Cotisation CARFO (Part Agent)',                    type: 'Part Agent (Salariale)',     taux: 8.0,  actif: true, description: 'Caisse Autonome de Retraite des Fonctionnaires - Part Salariale' },
      { id: 4,  code: 'RET-004', libelle: 'Cotisation CARFO (Part Employeur)',                type: 'Part Employeur (Patronale)',  taux: 14.0, actif: true, description: 'Caisse Autonome de Retraite des Fonctionnaires - Part Patronale' },
      { id: 5,  code: 'RET-005', libelle: 'Retraite Complémentaire CRRAE-UMOA (Part Agent)',   type: 'Part Agent (Salariale)',     taux: 6.0,  actif: true, description: 'Retraite complémentaire bancaire UMOA par répartition avec épargne - Part Agent' },
      { id: 6,  code: 'RET-006', libelle: 'Retraite Complémentaire CRRAE-UMOA (Part Employeur)',type: 'Part Employeur (Patronale)',  taux: 10.0, actif: true, description: 'Retraite complémentaire bancaire UMOA par répartition avec épargne - Part Employeur' },
      { id: 7,  code: 'RET-007', libelle: 'Impôt Unique sur Traitements et Salaires (IUTS)',   type: 'Retenue Fiscale (Agent)',    taux: 10.0, actif: true, description: 'Impôt direct retenu à la source selon le barème progressif officiel (2% à 30%)' },
      { id: 8,  code: 'RET-008', libelle: 'Taxe Patronale sur les Salaires (TPA/TFP)',        type: 'Taxe Patronale (Employeur)', taux: 3.0,  actif: true, description: 'Taxe patronale d\'apprentissage et de formation professionnelle versée au Trésor' },
      { id: 9,  code: 'RET-009', libelle: 'Assurance Maladie Groupe (Part Agent)',            type: 'Part Agent (Salariale)',     taux: 50.0, actif: true, description: 'Couverture santé complémentaire groupe entreprise - Part Agent (50%)' },
      { id: 10, code: 'RET-010', libelle: 'Assurance Maladie Groupe (Part Employeur)',        type: 'Part Employeur (Patronale)',  taux: 50.0, actif: true, description: 'Couverture santé complémentaire groupe entreprise - Part Employeur (50%)' },
      { id: 11, code: 'RET-011', libelle: 'Mutuelle de Santé & Entraide (MUPER)',             type: 'Cotisation Mutuelle & Santé',taux: 2.0,  actif: true, description: 'Cotisation mutuelle d\'entraide interne du personnel (Prêts d\'urgence & solidarité)' },
      { id: 12, code: 'RET-012', libelle: 'Remboursement Prêt Équipement & Véhicule',         type: 'Remboursement Prêt & Avance',taux: 15.0, actif: true, description: 'Mensualité de remboursement de prêt interne équipement ou acquisition véhicule' },
      { id: 13, code: 'RET-013', libelle: 'Remboursement Avance & Acompte sur Salaire',        type: 'Remboursement Prêt & Avance',taux: 10.0, actif: true, description: 'Récupération mensuelle des acomptes et avances sur salaire' },
      { id: 14, code: 'RET-014', libelle: 'Cotisation Syndicale du Personnel',                type: 'Cotisation Syndicale',      taux: 1.0,  actif: true, description: 'Prélèvement d\'adhésion au syndicat des travailleurs' }
    ];

    this.sauvegarderLocal();
  }

  sauvegarderLocal(): void {
    localStorage.setItem('sigrh_retenues_v9_scindes', JSON.stringify(this.rules));
  }

  getTypeBadgeStyle(type?: string): { bg: string; color: string; border: string } {
    const t = (type || '').toLowerCase();
    if (t.includes('employeur') || t.includes('patronale')) {
      return { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
    }
    if (t.includes('fiscale') || t.includes('taxe')) {
      return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
    }
    if (t.includes('mutuelle') || t.includes('santé')) {
      return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
    }
    if (t.includes('prêt') || t.includes('avance')) {
      return { bg: '#ffedf7', color: '#be185d', border: '#fbcfe8' };
    }
    // Default Part Agent
    return { bg: '#f3e8ff', color: '#6b21a8', border: '#e9d5ff' };
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
    if (!this.formRule.libelle) {
      alert('Veuillez renseigner le libellé de la retenue.');
      return;
    }

    if (this.modeEdition) {
      const idx = this.rules.findIndex(r => r.id === this.formRule.id);
      if (idx !== -1) {
        this.rules[idx] = { ...this.formRule };
      }
    } else {
      // Génération automatique du Code lors de la création
      const nextNum = this.rules.length + 1;
      this.formRule.code = `RET-${String(nextNum).padStart(3, '0')}`;
      this.formRule.id = Date.now();
      this.rules.unshift({ ...this.formRule });
    }

    this.sauvegarderLocal();
    this.fermerFormulaire();
  }

  supprimerRule(item: ParametragePaieRule): void {
    if (confirm(`Voulez-vous vraiment supprimer la retenue "${item.libelle}" (${item.code}) ?`)) {
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
      type: 'Part Agent (Salariale)',
      taux: 0,
      actif: true,
      description: ''
    };
  }
}
