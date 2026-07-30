import { Component, OnInit } from '@angular/core';

export interface CotisationItem {
  id: number;
  code: string;
  nom: string;
  typeOrganisme: string;
  partEmploye: number;
  partEmployeur: number;
  assiette: string;
  actif: boolean;
  isEditing?: boolean;
}

export interface TrancheIuts {
  min: number;
  max: number | null;
  taux: number;
}

@Component({
  selector: 'app-cotisations-paie',
  template: `
    <div class="cotisations-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h2>Paramétrage des Cotisations Sociales & Fiscalité (CNSS, CRRAE-UMOA, IUTS, TPA)</h2>
          <p class="subtitle">Gestion des taux de cotisations salariales, patronales et régimes de retraite complémentaires du secteur bancaire.</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" class="btn-add" (click)="openAddModal()">
            <mat-icon>add</mat-icon> Nouvelle Cotisation
          </button>
          <button mat-raised-button color="accent" class="btn-save" (click)="sauvegarderTout()">
            <mat-icon>save</mat-icon> Enregistrer les Taux
          </button>
        </div>
      </div>

      <!-- Toast Notification -->
      <div class="alert-success" *ngIf="showSuccess">
        <mat-icon style="margin-right: 8px;">check_circle</mat-icon>
        {{ successMessage }}
      </div>

      <!-- Main Grid Cards -->
      <div class="cards-grid">
        <!-- 1. Tableau des Cotisations Sociales & Patronales -->
        <mat-card class="config-card">
          <div class="card-title">
            <mat-icon style="color: #004080;">account_balance</mat-icon>
            <h3>Taux des Organismes de Cotisation & Retraite (CNSS & CRRAE-UMOA)</h3>
          </div>
          
          <table class="cotisations-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Cotisation / Organisme</th>
                <th>Part Salariale (%)</th>
                <th>Part Patronale (%)</th>
                <th>Assiette de Calcul</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of cotisations">
                <td><span class="badge-code">{{ item.code }}</span></td>
                <td>
                  <strong>{{ item.nom }}</strong>
                  <div style="font-size: 11px; color: #64748b;">{{ item.typeOrganisme }}</div>
                </td>
                <td>
                  <input type="number" step="0.1" [(ngModel)]="item.partEmploye" class="rate-input" [disabled]="!item.isEditing"> %
                </td>
                <td>
                  <input type="number" step="0.1" [(ngModel)]="item.partEmployeur" class="rate-input" [disabled]="!item.isEditing"> %
                </td>
                <td>
                  <select [(ngModel)]="item.assiette" class="select-input" [disabled]="!item.isEditing">
                    <option value="Salaire brut imposable">Salaire brut imposable</option>
                    <option value="Salaire de base">Salaire de base</option>
                    <option value="Masse salariale brute">Masse salariale brute</option>
                    <option value="Plafond CNSS">Plafond CNSS (600 000 FCFA)</option>
                  </select>
                </td>
                <td>
                  <span class="status-chip" [class.active]="item.actif" (click)="toggleStatus(item)">
                    {{ item.actif ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td>
                  <button mat-icon-button color="primary" *ngIf="!item.isEditing" (click)="item.isEditing = true" title="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" *ngIf="item.isEditing" (click)="item.isEditing = false" title="Valider">
                    <mat-icon>check</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="supprimer(item.id)" title="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </mat-card>

        <!-- 2. Barème Progressif IUTS & Abattements -->
        <mat-card class="config-card">
          <div class="card-title">
            <mat-icon style="color: #c62828;">request_quote</mat-icon>
            <h3>Barème Progressif de l'IUTS & Abattements pour Charges Familiales</h3>
          </div>

          <p style="font-size: 13px; color: #475569; margin-bottom: 16px;">
            L'IUTS est calculé par tranches sur le revenu net imposable après abattement forfaitaire professionnel.
          </p>

          <div class="iuts-settings-row">
            <div class="setting-item">
              <label>Abattement Forfaitaire Pro (%) :</label>
              <input type="number" [(ngModel)]="abattementPro" class="setting-input"> %
            </div>
            <div class="setting-item">
              <label>Réduction 1ère personne à charge :</label>
              <input type="number" [(ngModel)]="reductionCharge1" class="setting-input"> %
            </div>
            <div class="setting-item">
              <label>Réduction 2ème personne :</label>
              <input type="number" [(ngModel)]="reductionCharge2" class="setting-input"> %
            </div>
            <div class="setting-item">
              <label>Plafond Réduction Charges :</label>
              <input type="number" [(ngModel)]="maxReductionCharge" class="setting-input"> %
            </div>
          </div>

          <h4 style="margin-top: 20px; font-size: 14px; color: #1e293b;">Tranches de l'IUTS (Grille Légale)</h4>
          <table class="iuts-table">
            <thead>
              <tr>
                <th>Tranche de Salaire Imposable (FCFA)</th>
                <th>Taux d'imposition (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of tranchesIuts">
                <td>
                  <span *ngIf="t.max !== null">De {{ t.min | number }} FCFA à {{ t.max | number }} FCFA</span>
                  <span *ngIf="t.max === null">Plus de {{ t.min | number }} FCFA</span>
                </td>
                <td>
                  <input type="number" [(ngModel)]="t.taux" class="rate-input"> %
                </td>
              </tr>
            </tbody>
          </table>
        </mat-card>
      </div>

      <!-- Add New Cotisation Modal -->
      <div class="modal-backdrop" *ngIf="showAddModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Nouveau Paramétrage de Cotisation</h3>
            <button mat-icon-button (click)="closeAddModal()"><mat-icon>close</mat-icon></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Code Cotisation :</label>
              <input type="text" [(ngModel)]="newCotisation.code" placeholder="Ex: CRRAE-01, MUT-01" class="modal-input">
            </div>
            <div class="form-group">
              <label>Nom de la Cotisation / Organisme :</label>
              <input type="text" [(ngModel)]="newCotisation.nom" placeholder="Ex: Retraite Complémentaire CRRAE-UMOA" class="modal-input">
            </div>
            <div class="form-group">
              <label>Type d'Organisme :</label>
              <input type="text" [(ngModel)]="newCotisation.typeOrganisme" placeholder="Ex: Caisse Régionale UMOA" class="modal-input">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Part Salariale (%) :</label>
                <input type="number" step="0.1" [(ngModel)]="newCotisation.partEmploye" class="modal-input">
              </div>
              <div class="form-group">
                <label>Part Patronale (%) :</label>
                <input type="number" step="0.1" [(ngModel)]="newCotisation.partEmployeur" class="modal-input">
              </div>
            </div>
            <div class="form-group">
              <label>Assiette de Calcul :</label>
              <select [(ngModel)]="newCotisation.assiette" class="modal-input">
                <option value="Salaire brut imposable">Salaire brut imposable</option>
                <option value="Salaire de base">Salaire de base</option>
                <option value="Masse salariale brute">Masse salariale brute</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button mat-button (click)="closeAddModal()">Annuler</button>
            <button mat-raised-button color="primary" (click)="ajouterCotisation()">Ajouter la Cotisation</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cotisations-container {
      padding: 24px;
      max-width: 1300px;
      margin: 0 auto;
      font-family: 'Segoe UI', Roboto, sans-serif;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      background: white;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .page-header h2 {
      margin: 0;
      color: #004080;
      font-size: 20px;
      font-weight: 700;
    }
    .subtitle {
      margin: 4px 0 0 0;
      color: #64748b;
      font-size: 13px;
    }
    .header-actions {
      display: flex;
      gap: 12px;
    }
    .btn-add {
      background: #2563eb !important;
      color: white !important;
    }
    .btn-save {
      background: #059669 !important;
      color: white !important;
    }
    .alert-success {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .config-card {
      border-radius: 12px !important;
      padding: 24px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04) !important;
    }
    .card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .card-title h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }
    .cotisations-table, .iuts-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 8px;
    }
    .cotisations-table th, .iuts-table th {
      background: #f8fafc;
      color: #334155;
      font-weight: 700;
      text-align: left;
      padding: 12px;
      border-bottom: 2px solid #e2e8f0;
    }
    .cotisations-table td, .iuts-table td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .badge-code {
      background: #eff6ff;
      color: #1d4ed8;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 11px;
    }
    .rate-input {
      width: 70px;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-weight: 700;
      color: #0f172a;
      text-align: right;
    }
    .rate-input:disabled {
      background: #f8fafc;
      border-color: transparent;
    }
    .select-input {
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 12px;
    }
    .select-input:disabled {
      background: transparent;
      border-color: transparent;
    }
    .status-chip {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      background: #f1f5f9;
      color: #64748b;
    }
    .status-chip.active {
      background: #dcfce7;
      color: #166534;
    }
    .iuts-settings-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      background: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    .setting-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .setting-item label {
      font-size: 12px;
      color: #475569;
      font-weight: 600;
    }
    .setting-input {
      width: 80px;
      padding: 6px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-weight: 700;
    }

    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-card {
      background: white;
      width: 480px;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .modal-header h3 {
      margin: 0;
      color: #1e293b;
      font-size: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
    }
    .form-group label {
      font-size: 12px;
      font-weight: 600;
      color: #475569;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .modal-input {
      padding: 8px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 13px;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }
  `],
  standalone: false
})
export class CotisationsPaieComponent implements OnInit {
  showSuccess = false;
  successMessage = '';
  showAddModal = false;

  abattementPro = 20;
  reductionCharge1 = 8;
  reductionCharge2 = 10;
  maxReductionCharge = 18;

  defaultCotisations: CotisationItem[] = [
    { id: 1, code: 'CNSS-01', nom: 'CNSS (Régime Général)', typeOrganisme: 'Caisse Nationale de Sécurité Sociale', partEmploye: 5.5, partEmployeur: 16.0, assiette: 'Salaire brut imposable', actif: true },
    { id: 2, code: 'CRRAE-01', nom: 'CRRAE-UMOA (Retraite Complémentaire Bancaire)', typeOrganisme: 'Caisse Régionale de Retraite UMOA', partEmploye: 6.0, partEmployeur: 10.0, assiette: 'Salaire brut imposable', actif: true },
    { id: 3, code: 'CARFO-01', nom: 'CARFO (Fonction Publique)', typeOrganisme: 'Caisse Autonome de Retraite des Fonctionnaires', partEmploye: 8.0, partEmployeur: 14.0, assiette: 'Salaire de base', actif: false },
    { id: 4, code: 'IUTS-01', nom: 'IUTS (Impôt sur Salaires)', typeOrganisme: 'Direction Générale des Impôts', partEmploye: 10.0, partEmployeur: 0.0, assiette: 'Salaire brut imposable', actif: true },
    { id: 5, code: 'TPA-01', nom: 'TPA (Taxe Patronale d\'Apprentissage)', typeOrganisme: 'Trésor Public', partEmploye: 0.0, partEmployeur: 3.0, assiette: 'Masse salariale brute', actif: true },
    { id: 6, code: 'MUT-01', nom: 'Mutuelle Santé Entreprise', typeOrganisme: 'Organisme Complémentaire', partEmploye: 2.0, partEmployeur: 2.0, assiette: 'Salaire de base', actif: true }
  ];

  cotisations: CotisationItem[] = [];

  tranchesIuts: TrancheIuts[] = [
    { min: 0, max: 30000, taux: 0 },
    { min: 30001, max: 50000, taux: 2 },
    { min: 50001, max: 80000, taux: 5 },
    { min: 80001, max: 120000, taux: 10 },
    { min: 120001, max: 170000, taux: 15 },
    { min: 170001, max: 250000, taux: 20 },
    { min: 250001, max: null, taux: 25 }
  ];

  newCotisation: Partial<CotisationItem> = {
    code: '', nom: '', typeOrganisme: '', partEmploye: 0, partEmployeur: 0, assiette: 'Salaire brut imposable', actif: true
  };

  ngOnInit(): void {
    const saved = localStorage.getItem('cotisations_paie');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        if (list && list.length > 0) {
          this.cotisations = list;
          return;
        }
      } catch (e) {}
    }
    this.cotisations = [...this.defaultCotisations];
  }

  toggleStatus(item: CotisationItem): void {
    item.actif = !item.actif;
  }

  openAddModal(): void {
    this.newCotisation = { code: '', nom: '', typeOrganisme: '', partEmploye: 0, partEmployeur: 0, assiette: 'Salaire brut imposable', actif: true };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  ajouterCotisation(): void {
    if (!this.newCotisation.nom || !this.newCotisation.code) {
      alert('Veuillez renseigner le nom et le code de la cotisation.');
      return;
    }
    const item: CotisationItem = {
      id: Date.now(),
      code: this.newCotisation.code.toUpperCase(),
      nom: this.newCotisation.nom,
      typeOrganisme: this.newCotisation.typeOrganisme || 'Organisme de paie',
      partEmploye: this.newCotisation.partEmploye || 0,
      partEmployeur: this.newCotisation.partEmployeur || 0,
      assiette: this.newCotisation.assiette || 'Salaire brut imposable',
      actif: true
    };
    this.cotisations.push(item);
    this.closeAddModal();
    this.showNotification('Nouvelle cotisation ajoutée avec succès !');
  }

  supprimer(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette cotisation ?')) {
      this.cotisations = this.cotisations.filter(c => c.id !== id);
      this.showNotification('Cotisation supprimée.');
    }
  }

  sauvegarderTout(): void {
    localStorage.setItem('cotisations_paie', JSON.stringify(this.cotisations));
    this.showNotification('Taux de cotisations et barèmes d\'imposition enregistrés avec succès !');
  }

  private showNotification(msg: string): void {
    this.successMessage = msg;
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 4000);
  }
}

