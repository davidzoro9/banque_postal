import { Component, OnInit } from '@angular/core';
import { RetenueDto, RetenueService } from '../services/retenue.service';
import { TypeRetenue, TypeRetenueService } from '../services/type-retenue.service';

export interface ParametragePaieRule {
  id?: number;
  code: string;
  libelle: string;
  type: string;
  typeRetenueId?: number;
  taux: number;
  actif: boolean;
  description?: string;
  baseCalcul?: string;
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
            Référentiel officiel connecté à la base PostgreSQL (Part Agent / Part Employeur, type et taux %)
          </p>
        </div>
        <button mat-raised-button (click)="ouvrirFormulaire()" style="background: #0060B3; color: #ffffff; border-radius: 8px; font-weight: 600; padding: 0 22px; height: 42px;">
          <mat-icon style="margin-right: 6px; color: #ffffff;">add_circle</mat-icon> Nouvelle Retenue
        </button>
      </div>

      <!-- Notifications -->
      <div *ngIf="notificationMsg" style="margin-bottom: 16px; padding: 12px 18px; border-radius: 8px; background: #dcfce7; border: 1px solid #bbf7d0; color: #166534; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <mat-icon style="font-size: 20px; width: 20px; height: 20px;">check_circle</mat-icon>
        {{ notificationMsg }}
      </div>
      <div *ngIf="errorMsg" style="margin-bottom: 16px; padding: 12px 18px; border-radius: 8px; background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <mat-icon style="font-size: 20px; width: 20px; height: 20px;">error</mat-icon>
        {{ errorMsg }}
      </div>

      <!-- Main Retenues Table -->
      <mat-card style="border-radius: 12px; padding: 0; overflow: hidden; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 32px; width: 100%;">
        <div style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #0060B3;">
            Liste des Retenues sur Salaire (Données PostgreSQL en temps réel)
          </h3>
          <span style="font-size: 12px; color: #64748b;">
            {{ rules.length }} règle(s) de retenue configurée(s)
          </span>
        </div>

        <div *ngIf="loading" style="padding: 40px; text-align: center; color: #0060B3;">
          <mat-spinner diameter="40" style="margin: 0 auto 12px;"></mat-spinner>
          <div>Chargement des retenues depuis la base PostgreSQL...</div>
        </div>

        <div *ngIf="!loading" style="overflow-x: auto; width: 100%;">
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
                  Aucune retenue trouvée dans la base PostgreSQL. Cliquer sur "Nouvelle Retenue" pour en créer une.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </mat-card>

      <!-- Modal Form Overlay -->
      <div *ngIf="afficherFormulaire" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 99999; display: flex; align-items: center; justify-content: center;">
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
            <!-- Code -->
            <div *ngIf="modeEdition" style="background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 12px; font-weight: 600; color: #64748b;">Code de référence :</span>
              <span style="font-weight: 800; color: #0060B3; font-family: monospace; font-size: 14px; background: #e0f2fe; padding: 3px 10px; border-radius: 4px;">
                {{ formRule.code }}
              </span>
            </div>

            <div *ngIf="!modeEdition">
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Code de la retenue *</label>
              <input
                type="text"
                [(ngModel)]="formRule.code"
                placeholder="Ex: RET-015, CNSS_PART_SAL..."
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;"
              >
            </div>

            <!-- Libellé de la retenue -->
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Libellé de la retenue *</label>
              <input
                type="text"
                [(ngModel)]="formRule.libelle"
                placeholder="Ex: Cotisation Sociale CNSS (Part Agent)"
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;"
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
                  <option *ngFor="let t of typesList" [value]="t.libelle">{{ t.libelle }}</option>
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
                    style="width: 100%; padding: 9px; border: 1px solid #0288D1; border-radius: 8px; font-size: 14px; font-weight: 800; color: #0288D1; box-sizing: border-box;"
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
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; box-sizing: border-box;"
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
  typesList: TypeRetenue[] = [];
  loading: boolean = false;
  notificationMsg: string = '';
  errorMsg: string = '';

  afficherFormulaire: boolean = false;
  modeEdition: boolean = false;
  formRule: ParametragePaieRule = this.getEmptyRule();

  constructor(
    private retenueService: RetenueService,
    private typeRetenueService: TypeRetenueService
  ) {}

  ngOnInit(): void {
    this.chargerTypes();
    this.chargerRules();
  }

  chargerTypes(): void {
    this.typeRetenueService.getAll().subscribe({
      next: (types) => this.typesList = types || [],
      error: (err) => console.error('Erreur chargement types retenue:', err)
    });
  }

  chargerRules(): void {
    this.loading = true;
    this.errorMsg = '';
    this.retenueService.getAll().subscribe({
      next: (dtos) => {
        this.rules = (dtos || []).map(d => ({
          id: d.id,
          code: d.code,
          libelle: d.libelle,
          type: d.typeRetenueLibelle || 'Part Agent (Salariale)',
          typeRetenueId: d.typeRetenueId,
          taux: d.taux || 0,
          actif: d.actif !== undefined ? d.actif : true,
          description: d.description || '',
          baseCalcul: d.baseCalcul || 'REMUNERATION_BRUTE'
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement retenues API:', err);
        this.errorMsg = 'Impossible de charger les retenues depuis PostgreSQL.';
        this.loading = false;
      }
    });
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
    return { bg: '#f3e8ff', color: '#6b21a8', border: '#e9d5ff' };
  }

  ouvrirFormulaire(): void {
    this.modeEdition = false;
    this.formRule = this.getEmptyRule();
    const nextNum = this.rules.length + 1;
    this.formRule.code = `RET-${String(nextNum).padStart(3, '0')}`;
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
    if (!this.formRule.libelle || !this.formRule.libelle.trim()) {
      alert('Veuillez renseigner le libellé de la retenue.');
      return;
    }

    // Trouver le typeRetenueId correspondant au libellé sélectionné si possible
    let foundTypeId = this.formRule.typeRetenueId;
    if (this.typesList && this.typesList.length > 0) {
      const match = this.typesList.find(t => t.libelle.toLowerCase() === (this.formRule.type || '').toLowerCase());
      if (match && match.id) {
        foundTypeId = match.id;
      }
    }

    const payload: Partial<RetenueDto> = {
      code: this.formRule.code,
      libelle: this.formRule.libelle,
      taux: this.formRule.taux,
      actif: this.formRule.actif,
      description: this.formRule.description,
      typeRetenueId: foundTypeId,
      baseCalcul: this.formRule.baseCalcul || 'REMUNERATION_BRUTE'
    };

    if (this.modeEdition && this.formRule.id) {
      this.retenueService.update(this.formRule.id, payload).subscribe({
        next: () => {
          this.notify('Paramétrage de retenue mis à jour avec succès');
          this.chargerRules();
          this.fermerFormulaire();
        },
        error: (err) => {
          console.error('Erreur update retenue:', err);
          alert('Erreur lors de la mise à jour.');
        }
      });
    } else {
      this.retenueService.create(payload).subscribe({
        next: () => {
          this.notify('Nouvelle retenue enregistrée avec succès dans PostgreSQL');
          this.chargerRules();
          this.fermerFormulaire();
        },
        error: (err) => {
          console.error('Erreur create retenue:', err);
          alert('Erreur lors de la création de la retenue.');
        }
      });
    }
  }

  supprimerRule(item: ParametragePaieRule): void {
    if (confirm(`Voulez-vous vraiment supprimer la retenue "${item.libelle}" (${item.code}) ?`)) {
      if (item.id) {
        this.retenueService.delete(item.id).subscribe({
          next: () => {
            this.notify('Retenue supprimée');
            this.chargerRules();
          },
          error: (err) => {
            console.error('Erreur delete retenue:', err);
            alert('Erreur lors de la suppression.');
          }
        });
      }
    }
  }

  toggleStatut(item: ParametragePaieRule): void {
    if (!item.id) return;
    const updated = { ...item, actif: !item.actif };
    this.retenueService.update(item.id, updated).subscribe({
      next: () => this.chargerRules(),
      error: (err) => console.error('Erreur toggle statut retenue:', err)
    });
  }

  private notify(msg: string): void {
    this.notificationMsg = msg;
    setTimeout(() => this.notificationMsg = '', 4000);
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
