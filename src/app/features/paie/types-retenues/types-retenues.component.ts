import { Component, OnInit } from '@angular/core';

export interface TypeRetenue {
  id?: number;
  code: string;
  libelle: string;
  description: string;
  actif: boolean;
}

@Component({
  selector: 'app-types-retenues',
  template: `
    <div style="padding: 24px; width: 100%; box-sizing: border-box; font-family: 'Segoe UI', sans-serif;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="color: #0060B3; margin: 0; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
            <mat-icon style="color: #0060B3;">money_off</mat-icon>
            Types de Retenues sur Salaire
          </h2>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">
            Référentiel des types de retenues (Part Employeur, Part Agent, Prélèvements sociaux, fiscaux, assurances...)
          </p>
        </div>
        <button mat-raised-button (click)="ouvrirFormulaire()" style="background: #0060B3; color: #ffffff; border-radius: 8px; font-weight: 600; padding: 0 22px; height: 42px;">
          <mat-icon style="margin-right: 6px; color: #ffffff;">add</mat-icon> Nouveau Type de Retenue
        </button>
      </div>

      <!-- Filters & Search -->
      <mat-card style="border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; background: #fff; width: 100%;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <div style="flex: 1;">
            <input
              type="text"
              placeholder="Rechercher par code, libellé ou description..."
              [(ngModel)]="searchTerm"
              style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;"
            >
          </div>
        </div>
      </mat-card>

      <!-- Table -->
      <mat-card style="border-radius: 12px; padding: 0; overflow: hidden; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); width: 100%;">
        <div style="overflow-x: auto; width: 100%;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 700px;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                <th style="padding: 14px 18px; width: 140px;">Code</th>
                <th style="padding: 14px 18px; min-width: 200px;">Libellé du Type</th>
                <th style="padding: 14px 18px;">Description</th>
                <th style="padding: 14px 18px; text-align: center; width: 100px;">Statut</th>
                <th style="padding: 14px 18px; text-align: right; width: 100px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of getFilteredTypes()" class="data-row" style="border-bottom: 1px solid var(--border); font-size: 14px; transition: background 0.2s;">
                <td style="padding: 14px 18px;">
                  <span style="font-weight: 700; color: #0060B3; background: #e0f2fe; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-size: 13px; display: inline-block; white-space: nowrap;">
                    {{ item.code }}
                  </span>
                </td>
                <td style="padding: 14px 18px; font-weight: 700; color: #0f172a;">
                  {{ item.libelle }}
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
                  <button mat-icon-button color="primary" (click)="editerType(item)" title="Modifier">
                    <mat-icon style="font-size: 20px;">edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="supprimerType(item)" title="Supprimer">
                    <mat-icon style="font-size: 20px;">delete</mat-icon>
                  </button>
                </td>
              </tr>

              <tr *ngIf="getFilteredTypes().length === 0">
                <td colspan="5" style="padding: 32px; text-align: center; color: #94a3b8;">
                  <mat-icon style="font-size: 40px; width: 40px; height: 40px; margin-bottom: 8px;">search_off</mat-icon>
                  <div>Aucun type de retenue trouvé.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </mat-card>

      <!-- Modal Form Overlay -->
      <div *ngIf="afficherFormulaire" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
        <div style="background: #fff; width: 100%; max-width: 500px; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
            <h3 style="margin: 0; color: #0060B3; font-size: 18px; font-weight: 700;">
              {{ modeEdition ? 'Modifier le Type de Retenue' : 'Nouveau Type de Retenue' }}
            </h3>
            <button mat-icon-button (click)="fermerFormulaire()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Code *</label>
              <input
                type="text"
                [(ngModel)]="formType.code"
                placeholder="Ex: TR-PATRONALE, TR-SALARIALE..."
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; text-transform: uppercase;"
              >
            </div>

            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Libellé *</label>
              <input
                type="text"
                [(ngModel)]="formType.libelle"
                placeholder="Ex: Part Employeur, Part Agent, Cotisation Sociale..."
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;"
              >
            </div>

            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Description</label>
              <textarea
                [(ngModel)]="formType.description"
                rows="3"
                placeholder="Description détaillée du type de retenue..."
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit;"
              ></textarea>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <input type="checkbox" id="chkActif" [(ngModel)]="formType.actif" style="width: 18px; height: 18px; cursor: pointer;">
              <label for="chkActif" style="font-size: 14px; font-weight: 600; color: #1e293b; cursor: pointer;">Actif</label>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <button mat-button (click)="fermerFormulaire()">Annuler</button>
            <button mat-raised-button color="primary" (click)="sauvegarderType()" style="background: #0060B3; font-weight: 600;">
              <mat-icon style="margin-right: 6px;">save</mat-icon> Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: false
})
export class TypesRetenuesComponent implements OnInit {
  typesRetenues: TypeRetenue[] = [];
  searchTerm: string = '';

  afficherFormulaire: boolean = false;
  modeEdition: boolean = false;

  formType: TypeRetenue = this.getEmptyForm();

  ngOnInit(): void {
    this.chargerTypesRetenues();
  }

  chargerTypesRetenues(): void {
    const saved = localStorage.getItem('sigrh_types_retenues_v3');
    if (saved) {
      try {
        this.typesRetenues = JSON.parse(saved);
        return;
      } catch (e) {}
    }

    // Reference Types de Retenues sur Salaire
    this.typesRetenues = [
      { id: 1, code: 'TR-PATRONALE', libelle: 'Part Employeur',           description: 'Part de cotisation patronale prise en charge directement par l\'employeur', actif: true },
      { id: 2, code: 'TR-SALARIALE', libelle: 'Part Agent',               description: 'Part de cotisation salariale prélevée à la source sur la paie de l\'agent', actif: true },
      { id: 3, code: 'TR-SOCIALE',   libelle: 'Cotisation Sociale (CNSS/CARFO)', description: 'Sécurité sociale obligatoire et régimes de retraite de base légaux', actif: true },
      { id: 4, code: 'TR-RETRAITE',  libelle: 'Retraite Complémentaire (CRRAE)', description: 'Caisse de retraite complémentaire bancaire UMOA et fonds de pension', actif: true },
      { id: 5, code: 'TR-FISCALE',   libelle: 'Retenue Fiscale (IUTS/TPA)', description: 'Impôt Unique sur Traitements & Salaires et Taxes patronales', actif: true },
      { id: 6, code: 'TR-ASSURANCE', libelle: 'Assurance Groupe & Santé', description: 'Prélèvements pour assurance maladie complémentaire groupe entreprise', actif: true },
      { id: 7, code: 'TR-MUTUELLE',  libelle: 'Mutuelle Interne (MUPER)',  description: 'Cotisation mensuelle d\'entraide et de solidarité du personnel', actif: true },
      { id: 8, code: 'TR-PRET',      libelle: 'Remboursement Prêt & Avance',description: 'Remboursement des prêts équipements, avances et acomptes sur salaire', actif: true },
      { id: 9, code: 'TR-SYNDICAT',  libelle: 'Cotisation Syndicale',      description: 'Cotisation mensuelle d\'adhésion syndicale du personnel', actif: true }
    ];

    this.sauvegarderLocal();
  }

  sauvegarderLocal(): void {
    localStorage.setItem('sigrh_types_retenues_v3', JSON.stringify(this.typesRetenues));
  }

  getFilteredTypes(): TypeRetenue[] {
    return this.typesRetenues.filter(item => {
      return !this.searchTerm ||
        item.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.libelle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
    });
  }

  getCountActifs(): number {
    return this.typesRetenues.filter(t => t.actif).length;
  }

  ouvrirFormulaire(): void {
    this.modeEdition = false;
    this.formType = this.getEmptyForm();
    this.afficherFormulaire = true;
  }

  editerType(item: TypeRetenue): void {
    this.modeEdition = true;
    this.formType = { ...item };
    this.afficherFormulaire = true;
  }

  fermerFormulaire(): void {
    this.afficherFormulaire = false;
  }

  sauvegarderType(): void {
    if (!this.formType.code || !this.formType.libelle) {
      alert('Veuillez remplir le code et le libellé du type de retenue.');
      return;
    }

    if (this.modeEdition) {
      const idx = this.typesRetenues.findIndex(t => t.id === this.formType.id);
      if (idx !== -1) {
        this.typesRetenues[idx] = { ...this.formType };
      }
    } else {
      this.formType.id = Date.now();
      this.typesRetenues.unshift({ ...this.formType });
    }

    this.sauvegarderLocal();
    this.fermerFormulaire();
  }

  supprimerType(item: TypeRetenue): void {
    if (confirm(`Voulez-vous vraiment supprimer le type de retenue "${item.libelle}" ?`)) {
      this.typesRetenues = this.typesRetenues.filter(t => t.id !== item.id);
      this.sauvegarderLocal();
    }
  }

  toggleStatut(item: TypeRetenue): void {
    item.actif = !item.actif;
    this.sauvegarderLocal();
  }

  private getEmptyForm(): TypeRetenue {
    return {
      code: '',
      libelle: '',
      description: '',
      actif: true
    };
  }
}
