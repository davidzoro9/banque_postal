import { Component, OnInit } from '@angular/core';

export interface ParametragePaieRule {
  id?: number;
  typeRetenueCode: string;
  typeRetenueLibelle: string;
  categorie: string;
  partEmployeurPct: number;  // % Part Employeur (Patronale)
  partAgentPct: number;      // % Part Agent / Employé (Salariale)
  assietteCalcul: 'SALAIRE_BASE' | 'SALAIRE_BRUT' | 'BRUT_IMPOSABLE' | 'MONTANT_FIXE';
  plafondMensuel?: number;   // Plafond mensuel en FCFA (0 si non plafonné)
  actif: boolean;
  notes?: string;
}

@Component({
  selector: 'app-parametrage-paie',
  template: `
    <div style="padding: 24px; max-width: 1200px; margin: 0 auto; font-family: 'Segoe UI', sans-serif;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="color: #0060B3; margin: 0; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
            <mat-icon style="color: #0060B3;">tune</mat-icon>
            Paramétrage des Taux & Cotisations de Paie
          </h2>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">
            Configuration des taux de cotisations et retenues (% Part Employeur & % Part Agent / Employé)
          </p>
        </div>
        <button mat-raised-button color="primary" (click)="ouvrirFormulaire()" style="background: #0060B3; border-radius: 8px; font-weight: 600; padding: 0 20px;">
          <mat-icon style="margin-right: 6px;">add_circle</mat-icon> Configurer un Taux de Retenue
        </button>
      </div>

      <!-- Summary KPI Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <mat-card style="border-radius: 12px; border-left: 5px solid #0060B3; padding: 16px; background: #fff;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Règles Configurées</div>
          <div style="font-size: 26px; font-weight: 700; color: #0060B3; margin-top: 4px;">{{ rules.length }}</div>
          <div style="font-size: 12px; color: #0060B3; margin-top: 2px;">Cotisations & Prélèvements actifs</div>
        </mat-card>

        <mat-card style="border-radius: 12px; border-left: 5px solid #0288D1; padding: 16px; background: #fff;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Total Taux Patronal</div>
          <div style="font-size: 26px; font-weight: 700; color: #0288D1; margin-top: 4px;">{{ getTotalPartEmployeur() | number:'1.1-2' }} %</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Charge globale entreprise</div>
        </mat-card>

        <mat-card style="border-radius: 12px; border-left: 5px solid #7B1FA2; padding: 16px; background: #fff;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Total Taux Salarial</div>
          <div style="font-size: 26px; font-weight: 700; color: #7B1FA2; margin-top: 4px;">{{ getTotalPartAgent() | number:'1.1-2' }} %</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Retenues directes agent</div>
        </mat-card>

        <mat-card style="border-radius: 12px; border-left: 5px solid #2E7D32; padding: 16px; background: #fff;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Simulation Rapide</div>
          <div style="font-size: 18px; font-weight: 700; color: #2E7D32; margin-top: 4px;">{{ simulerChargeEmployeur(500000) | number:'1.0-0' }} FCFA</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Charges patronales pour 500k Brut</div>
        </mat-card>
      </div>

      <!-- Main Rules Table -->
      <mat-card style="border-radius: 12px; padding: 0; overflow: hidden; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 32px;">
        <div style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #0060B3;">
            Tableau des Paramétrages de Cotisations et Retenues (% Part Employeur / % Part Agent)
          </h3>
          <span style="font-size: 12px; color: #64748b;">
            Appel direct des types de retenues enregistrés
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #334155; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
              <th style="padding: 14px 18px;">Type de Retenue</th>
              <th style="padding: 14px 18px;">Catégorie</th>
              <th style="padding: 14px 18px; text-align: center; background: #e0f2fe; color: #0369a1;">% Part Employeur</th>
              <th style="padding: 14px 18px; text-align: center; background: #f3e8ff; color: #6b21a8;">% Part Agent / Employé</th>
              <th style="padding: 14px 18px;">Assiette de Calcul</th>
              <th style="padding: 14px 18px;">Plafond Mensuel</th>
              <th style="padding: 14px 18px; text-align: center;">Statut</th>
              <th style="padding: 14px 18px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of rules" style="border-bottom: 1px solid #f1f5f9; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
              <td style="padding: 14px 18px;">
                <div style="font-weight: 700; color: #0f172a;">{{ item.typeRetenueLibelle }}</div>
                <div style="font-size: 12px; color: #64748b; font-family: monospace;">{{ item.typeRetenueCode }}</div>
              </td>
              <td style="padding: 14px 18px;">
                <span [ngStyle]="getCategorieBadgeStyle(item.categorie)">
                  {{ item.categorie }}
                </span>
              </td>

              <!-- % Part Employeur -->
              <td style="padding: 14px 18px; text-align: center; background: #f0f9ff;">
                <span style="background: #0288D1; color: #fff; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">
                  {{ item.partEmployeurPct | number:'1.1-2' }} %
                </span>
              </td>

              <!-- % Part Agent / Employé -->
              <td style="padding: 14px 18px; text-align: center; background: #faf5ff;">
                <span style="background: #7B1FA2; color: #fff; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">
                  {{ item.partAgentPct | number:'1.1-2' }} %
                </span>
              </td>

              <td style="padding: 14px 18px; color: #334155; font-size: 13px;">
                <span style="font-weight: 600; color: #475569;">{{ getLibelleAssiette(item.assietteCalcul) }}</span>
              </td>

              <td style="padding: 14px 18px; color: #334155; font-size: 13px;">
                <span *ngIf="item.plafondMensuel && item.plafondMensuel > 0" style="font-weight: 600; color: #0060B3;">
                  {{ item.plafondMensuel | number:'1.0-0' }} FCFA
                </span>
                <span *ngIf="!item.plafondMensuel || item.plafondMensuel === 0" style="color: #94a3b8; font-style: italic;">
                  Non plafonné
                </span>
              </td>

              <td style="padding: 14px 18px; text-align: center;">
                <span (click)="toggleStatut(item)" style="cursor: pointer;" [title]="item.actif ? 'Cliquer pour désactiver' : 'Cliquer pour activer'">
                  <span *ngIf="item.actif" style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 700;">Actif</span>
                  <span *ngIf="!item.actif" style="background: #f3f4f6; color: #6b7280; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">Inactif</span>
                </span>
              </td>

              <td style="padding: 14px 18px; text-align: right;">
                <button mat-icon-button color="primary" (click)="editerRule(item)" title="Modifier">
                  <mat-icon style="font-size: 20px;">edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="supprimerRule(item)" title="Supprimer">
                  <mat-icon style="font-size: 20px;">delete</mat-icon>
                </button>
              </td>
            </tr>

            <tr *ngIf="rules.length === 0">
              <td colspan="8" style="padding: 32px; text-align: center; color: #94a3b8;">
                Aucun paramétrage de retenue configuré. Cliquer sur "Configurer un Taux de Retenue".
              </td>
            </tr>
          </tbody>
        </table>
      </mat-card>

      <!-- Live Simulator Component Card -->
      <mat-card style="border-radius: 12px; padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%); border: 1px solid #cbd5e1;">
        <h3 style="margin: 0 0 12px 0; color: #0060B3; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <mat-icon style="color: #0060B3;">calculate</mat-icon>
          Simulateur de Déduction en Direct
        </h3>

        <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
          <label style="font-weight: 600; color: #334155; font-size: 14px;">Salaire Brut de Test (FCFA) :</label>
          <input
            type="number"
            [(ngModel)]="salaireSimul"
            step="10000"
            style="padding: 8px 14px; border: 1px solid #0060B3; border-radius: 8px; font-weight: 700; font-size: 15px; color: #0060B3; width: 180px;"
          >
          <span style="font-size: 13px; color: #64748b;">(Modifiez le salaire pour tester le calcul automatique des cotisations)</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background: #e2e8f0; color: #334155; font-size: 12px; text-transform: uppercase;">
              <th style="padding: 10px 14px;">Retenue</th>
              <th style="padding: 10px 14px; text-align: center;">% Part Employeur</th>
              <th style="padding: 10px 14px; text-align: right; color: #0288D1;">Montant Employeur (FCFA)</th>
              <th style="padding: 10px 14px; text-align: center;">% Part Agent</th>
              <th style="padding: 10px 14px; text-align: right; color: #7B1FA2;">Montant Agent (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of rules" style="border-bottom: 1px solid #f1f5f9; font-size: 13px;">
              <td style="padding: 10px 14px; font-weight: 600; color: #1e293b;">{{ r.typeRetenueLibelle }}</td>
              <td style="padding: 10px 14px; text-align: center; font-weight: 600; color: #0288D1;">{{ r.partEmployeurPct }} %</td>
              <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #0288D1;">
                {{ calculMontantPartEmployeur(r, salaireSimul) | number:'1.0-0' }} FCFA
              </td>
              <td style="padding: 10px 14px; text-align: center; font-weight: 600; color: #7B1FA2;">{{ r.partAgentPct }} %</td>
              <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #7B1FA2;">
                {{ calculMontantPartAgent(r, salaireSimul) | number:'1.0-0' }} FCFA
              </td>
            </tr>
          </tbody>
        </table>
      </mat-card>

      <!-- Modal Form Overlay -->
      <div *ngIf="afficherFormulaire" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
        <div style="background: #fff; width: 100%; max-width: 580px; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
            <h3 style="margin: 0; color: #0060B3; font-size: 18px; font-weight: 700;">
              {{ modeEdition ? 'Modifier le Paramétrage de Retenue' : 'Nouveau Paramétrage de Retenue' }}
            </h3>
            <button mat-icon-button (click)="fermerFormulaire()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <!-- Selection / Call of Type de Retenue -->
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Sélectionner le Type de Retenue *</label>
              <select
                [(ngModel)]="formRule.typeRetenueCode"
                (change)="onTypeRetenueChange()"
                style="width: 100%; padding: 10px; border: 1px solid #0060B3; border-radius: 8px; font-size: 14px; background: #f0f9ff; font-weight: 600; color: #0060B3;"
              >
                <option value="" disabled>-- Choisir un type de retenue enregistré --</option>
                <option *ngFor="let t of availableTypes" [value]="t.code">
                  {{ t.code }} - {{ t.libelle }} ({{ t.categorie }})
                </option>
              </select>
            </div>

            <!-- Taux Inputs: Part Employeur (%) & Part Agent (%) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 700; color: #0288D1; margin-bottom: 4px;">% Part Employeur (Patronale) *</label>
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
                <label style="display: block; font-size: 13px; font-weight: 700; color: #7B1FA2; margin-bottom: 4px;">% Part Agent / Employé (Salariale) *</label>
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

            <!-- Assiette de calcul & Plafond -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Assiette de calcul *</label>
                <select
                  [(ngModel)]="formRule.assietteCalcul"
                  style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: #fff;"
                >
                  <option value="SALAIRE_BASE">Salaire de Base</option>
                  <option value="SALAIRE_BRUT">Salaire Brut Total</option>
                  <option value="BRUT_IMPOSABLE">Salaire Brut Imposable</option>
                  <option value="MONTANT_FIXE">Montant Fixe Forfaitaire</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Plafond mensuel (FCFA)</label>
                <input
                  type="number"
                  step="10000"
                  [(ngModel)]="formRule.plafondMensuel"
                  placeholder="0 pour illimité"
                  style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;"
                >
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Notes / Justificatif légal</label>
              <input
                type="text"
                [(ngModel)]="formRule.notes"
                placeholder="Ex: Taux réglementaire CNSS Burkina Faso Code du Travail"
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;"
              >
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" id="chkRuleActif" [(ngModel)]="formRule.actif" style="width: 18px; height: 18px; cursor: pointer;">
              <label for="chkRuleActif" style="font-size: 14px; font-weight: 600; color: #1e293b; cursor: pointer;">Actif (Appliqué lors du calcul des bulletins de paie)</label>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <button mat-button (click)="fermerFormulaire()">Annuler</button>
            <button mat-raised-button color="primary" (click)="sauvegarderRule()" style="background: #0060B3; font-weight: 600;">
              <mat-icon style="margin-right: 6px;">save</mat-icon> Enregistrer le Paramétrage
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
  availableTypes: any[] = [];
  salaireSimul: number = 500000;

  afficherFormulaire: boolean = false;
  modeEdition: boolean = false;

  formRule: ParametragePaieRule = this.getEmptyRule();

  ngOnInit(): void {
    this.chargerAvailableTypes();
    this.chargerRules();
  }

  chargerAvailableTypes(): void {
    const saved = localStorage.getItem('sigrh_types_retenues');
    if (saved) {
      try {
        this.availableTypes = JSON.parse(saved);
        return;
      } catch (e) {}
    }

    // Default registered types
    this.availableTypes = [
      { code: 'RET-CNSS',      libelle: 'Cotisation Sociale CNSS',          categorie: 'Sociale' },
      { code: 'RET-IUTS',      libelle: 'Impôt Unique sur Traitements (IUTS)', categorie: 'Fiscale' },
      { code: 'RET-ASSUR',     libelle: 'Assurance Maladie Groupe',         categorie: 'Assurance' },
      { code: 'RET-MUTUELLE',  libelle: 'Mutuelle de Santé Interne',        categorie: 'Assurance' },
      { code: 'RET-PRET',      libelle: 'Remboursement Prêt Équipement/Auto',categorie: 'Remboursement' },
      { code: 'RET-AVANCE',    libelle: 'Avance sur Salaire / Acompte',     categorie: 'Remboursement' },
      { code: 'RET-CR',        libelle: 'Cotisation Retraite Complémentaire',categorie: 'Sociale' }
    ];
  }

  chargerRules(): void {
    const saved = localStorage.getItem('sigrh_parametrage_paie_rules');
    if (saved) {
      try {
        this.rules = JSON.parse(saved);
        return;
      } catch (e) {}
    }

    // Initial default rules with Part Employeur (%) and Part Agent (%)
    this.rules = [
      {
        id: 1,
        typeRetenueCode: 'RET-CNSS',
        typeRetenueLibelle: 'Cotisation Sociale CNSS',
        categorie: 'Sociale',
        partEmployeurPct: 16.0,
        partAgentPct: 5.5,
        assietteCalcul: 'SALAIRE_BRUT',
        plafondMensuel: 600000,
        actif: true,
        notes: 'Plafond mensuel 600 000 FCFA selon code CNSS Burkina'
      },
      {
        id: 2,
        typeRetenueCode: 'RET-IUTS',
        typeRetenueLibelle: 'Impôt Unique sur Traitements (IUTS)',
        categorie: 'Fiscale',
        partEmployeurPct: 0.0,
        partAgentPct: 10.0,
        assietteCalcul: 'BRUT_IMPOSABLE',
        plafondMensuel: 0,
        actif: true,
        notes: 'Barème progressif fiscal'
      },
      {
        id: 3,
        typeRetenueCode: 'RET-ASSUR',
        typeRetenueLibelle: 'Assurance Maladie Groupe',
        categorie: 'Assurance',
        partEmployeurPct: 50.0,
        partAgentPct: 50.0,
        assietteCalcul: 'MONTANT_FIXE',
        plafondMensuel: 0,
        actif: true,
        notes: 'Partage 50/50 entre employeur et agent'
      },
      {
        id: 4,
        typeRetenueCode: 'RET-MUTUELLE',
        typeRetenueLibelle: 'Mutuelle de Santé Interne',
        categorie: 'Assurance',
        partEmployeurPct: 0.0,
        partAgentPct: 2.0,
        assietteCalcul: 'SALAIRE_BASE',
        plafondMensuel: 0,
        actif: true,
        notes: 'Cotisation mutuelle agent 2%'
      }
    ];

    this.sauvegarderLocal();
  }

  sauvegarderLocal(): void {
    localStorage.setItem('sigrh_parametrage_paie_rules', JSON.stringify(this.rules));
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

  getLibelleAssiette(code: string): string {
    switch (code) {
      case 'SALAIRE_BASE': return 'Salaire de Base';
      case 'SALAIRE_BRUT': return 'Salaire Brut Total';
      case 'BRUT_IMPOSABLE': return 'Brut Imposable';
      case 'MONTANT_FIXE': return 'Montant Fixe';
      default: return code;
    }
  }

  getCategorieBadgeStyle(cat: string) {
    switch (cat) {
      case 'Sociale':
        return { background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', 'border-radius': '12px', 'font-size': '12px', 'font-weight': '700' };
      case 'Fiscale':
        return { background: '#ffe4e6', color: '#be123c', padding: '4px 10px', 'border-radius': '12px', 'font-size': '12px', 'font-weight': '700' };
      case 'Assurance':
        return { background: '#dcfce7', color: '#15803d', padding: '4px 10px', 'border-radius': '12px', 'font-size': '12px', 'font-weight': '700' };
      case 'Remboursement':
        return { background: '#ffedd5', color: '#c2410c', padding: '4px 10px', 'border-radius': '12px', 'font-size': '12px', 'font-weight': '700' };
      default:
        return { background: '#f1f5f9', color: '#475569', padding: '4px 10px', 'border-radius': '12px', 'font-size': '12px', 'font-weight': '700' };
    }
  }

  onTypeRetenueChange(): void {
    const found = this.availableTypes.find(t => t.code === this.formRule.typeRetenueCode);
    if (found) {
      this.formRule.typeRetenueLibelle = found.libelle;
      this.formRule.categorie = found.categorie || 'Sociale';
    }
  }

  ouvrirFormulaire(): void {
    this.chargerAvailableTypes();
    this.modeEdition = false;
    this.formRule = this.getEmptyRule();
    this.afficherFormulaire = true;
  }

  editerRule(item: ParametragePaieRule): void {
    this.chargerAvailableTypes();
    this.modeEdition = true;
    this.formRule = { ...item };
    this.afficherFormulaire = true;
  }

  fermerFormulaire(): void {
    this.afficherFormulaire = false;
  }

  sauvegarderRule(): void {
    if (!this.formRule.typeRetenueCode) {
      alert('Veuillez sélectionner un type de retenue.');
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
    if (confirm(`Voulez-vous vraiment supprimer le paramétrage pour "${item.typeRetenueLibelle}" ?`)) {
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
      typeRetenueCode: '',
      typeRetenueLibelle: '',
      categorie: 'Sociale',
      partEmployeurPct: 0,
      partAgentPct: 0,
      assietteCalcul: 'SALAIRE_BRUT',
      plafondMensuel: 0,
      actif: true,
      notes: ''
    };
  }
}

