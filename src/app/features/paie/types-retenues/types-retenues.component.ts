import { Component, OnInit } from '@angular/core';

export interface TypeRetenue {
  id?: number;
  code: string;
  libelle: string;
  categorie: 'Sociale' | 'Fiscale' | 'Assurance' | 'Remboursement' | 'Autre';
  obligatoire: boolean;
  imposable: boolean;
  description: string;
  actif: boolean;
}

@Component({
  selector: 'app-types-retenues',
  template: `
    <div style="padding: 24px; max-width: 1200px; margin: 0 auto; font-family: 'Segoe UI', sans-serif;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="color: #163059; margin: 0; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
            <mat-icon style="color: #0060B3;">money_off</mat-icon>
            Types de Retenues sur Salaire
          </h2>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">
            Référentiel des retenues et prélèvements applicables à la paie (Sociales, Fiscales, Assurances, Prêts)
          </p>
        </div>
        <button mat-raised-button color="primary" (click)="ouvrirFormulaire()" style="background: #0060B3; border-radius: 8px; font-weight: 600; padding: 0 20px;">
          <mat-icon style="margin-right: 6px;">add</mat-icon> Nouveau Type de Retenue
        </button>
      </div>

      <!-- Stats Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <mat-card style="border-radius: 12px; border-left: 5px solid #0060B3; padding: 16px; background: #fff;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Total Retenues</div>
          <div style="font-size: 26px; font-weight: 700; color: #163059; margin-top: 4px;">{{ typesRetenues.length }}</div>
          <div style="font-size: 12px; color: #0060B3; margin-top: 2px;">Référentiel configuré</div>
        </mat-card>

        <mat-card style="border-radius: 12px; border-left: 5px solid #1976D2; padding: 16px; background: #fff;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Sociales & Fiscales</div>
          <div style="font-size: 26px; font-weight: 700; color: #1976D2; margin-top: 4px;">{{ getCountCategorie('Sociale') + getCountCategorie('Fiscale') }}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">CNSS, IUTS & Cotisations</div>
        </mat-card>

        <mat-card style="border-radius: 12px; border-left: 5px solid #2E7D32; padding: 16px; background: #fff;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Assurances & Mutuelles</div>
          <div style="font-size: 26px; font-weight: 700; color: #2E7D32; margin-top: 4px;">{{ getCountCategorie('Assurance') }}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Couverture santé & mutuelles</div>
        </mat-card>

        <mat-card style="border-radius: 12px; border-left: 5px solid #E65100; padding: 16px; background: #fff;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Avances & Prêts</div>
          <div style="font-size: 26px; font-weight: 700; color: #E65100; margin-top: 4px;">{{ getCountCategorie('Remboursement') }}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Prélèvements individuels</div>
        </mat-card>
      </div>

      <!-- Filters & Search -->
      <mat-card style="border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; background: #fff;">
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 260px;">
            <input
              type="text"
              placeholder="Rechercher par code ou libellé..."
              [(ngModel)]="searchTerm"
              style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;"
            >
          </div>
          <div style="width: 200px;">
            <select
              [(ngModel)]="selectedCategorie"
              style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: #fff;"
            >
              <option value="TOUS">Toutes les catégories</option>
              <option value="Sociale">Sociale</option>
              <option value="Fiscale">Fiscale</option>
              <option value="Assurance">Assurance</option>
              <option value="Remboursement">Remboursement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>
      </mat-card>

      <!-- Retenues Table -->
      <mat-card style="border-radius: 12px; padding: 0; overflow: hidden; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
              <th style="padding: 14px 18px;">Code</th>
              <th style="padding: 14px 18px;">Libellé de la Retenue</th>
              <th style="padding: 14px 18px;">Catégorie</th>
              <th style="padding: 14px 18px; text-align: center;">Caractère</th>
              <th style="padding: 14px 18px;">Description</th>
              <th style="padding: 14px 18px; text-align: center;">Statut</th>
              <th style="padding: 14px 18px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of getFilteredTypes()" style="border-bottom: 1px solid #f1f5f9; font-size: 14px; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
              <td style="padding: 14px 18px;">
                <span style="font-weight: 700; color: #163059; background: #e2e8f0; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-size: 13px;">
                  {{ item.code }}
                </span>
              </td>
              <td style="padding: 14px 18px; font-weight: 600; color: #0f172a;">
                {{ item.libelle }}
              </td>
              <td style="padding: 14px 18px;">
                <span [ngStyle]="getCategorieBadgeStyle(item.categorie)">
                  {{ item.categorie }}
                </span>
              </td>
              <td style="padding: 14px 18px; text-align: center;">
                <span *ngIf="item.obligatoire" style="background: #fee2e2; color: #991b1b; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 700;">Obligatoire</span>
                <span *ngIf="!item.obligatoire" style="background: #f1f5f9; color: #475569; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">Optionnel</span>
              </td>
              <td style="padding: 14px 18px; color: #64748b; font-size: 13px; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                {{ item.description || '—' }}
              </td>
              <td style="padding: 14px 18px; text-align: center;">
                <span (click)="toggleStatut(item)" style="cursor: pointer;" [title]="item.actif ? 'Cliquer pour désactiver' : 'Cliquer pour activer'">
                  <span *ngIf="item.actif" style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 700;">Actif</span>
                  <span *ngIf="!item.actif" style="background: #f3f4f6; color: #6b7280; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">Inactif</span>
                </span>
              </td>
              <td style="padding: 14px 18px; text-align: right;">
                <button mat-icon-button color="primary" (click)="editerType(item)" title="Modifier">
                  <mat-icon style="font-size: 20px;">edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="supprimerType(item)" title="Supprimer">
                  <mat-icon style="font-size: 20px;">delete</mat-icon>
                </button>
              </td>
            </tr>

            <tr *ngIf="getFilteredTypes().length === 0">
              <td colspan="7" style="padding: 32px; text-align: center; color: #94a3b8;">
                <mat-icon style="font-size: 40px; width: 40px; height: 40px; margin-bottom: 8px;">search_off</mat-icon>
                <div>Aucun type de retenue trouvé correspondant à la recherche.</div>
              </td>
            </tr>
          </tbody>
        </table>
      </mat-card>

      <!-- Modal Form Overlay -->
      <div *ngIf="afficherFormulaire" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
        <div style="background: #fff; width: 100%; max-width: 540px; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
            <h3 style="margin: 0; color: #163059; font-size: 18px; font-weight: 700;">
              {{ modeEdition ? 'Modifier le Type de Retenue' : 'Nouveau Type de Retenue' }}
            </h3>
            <button mat-icon-button (click)="fermerFormulaire()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Code de la retenue *</label>
              <input
                type="text"
                [(ngModel)]="formType.code"
                placeholder="Ex: RET-CNSS, RET-IUTS, RET-ASSUR..."
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; text-transform: uppercase;"
              >
            </div>

            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Libellé de la retenue *</label>
              <input
                type="text"
                [(ngModel)]="formType.libelle"
                placeholder="Ex: Cotisation Sociale CNSS"
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;"
              >
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Catégorie *</label>
                <select
                  [(ngModel)]="formType.categorie"
                  style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: #fff;"
                >
                  <option value="Sociale">Sociale</option>
                  <option value="Fiscale">Fiscale</option>
                  <option value="Assurance">Assurance</option>
                  <option value="Remboursement">Remboursement</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Obligatoire ?</label>
                <select
                  [ngModel]="formType.obligatoire ? 'OUI' : 'NON'"
                  (ngModelChange)="formType.obligatoire = ($event === 'OUI')"
                  style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: #fff;"
                >
                  <option value="OUI">Oui (Obligatoire)</option>
                  <option value="NON">Non (Optionnel)</option>
                </select>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;">Description / Notes</label>
              <textarea
                [(ngModel)]="formType.description"
                rows="2"
                placeholder="Précisions sur cette retenue..."
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit;"
              ></textarea>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <input type="checkbox" id="chkActif" [(ngModel)]="formType.actif" style="width: 18px; height: 18px; cursor: pointer;">
              <label for="chkActif" style="font-size: 14px; font-weight: 600; color: #1e293b; cursor: pointer;">Actif (Disponible dans le paramétrage de paie)</label>
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
  selectedCategorie: string = 'TOUS';

  afficherFormulaire: boolean = false;
  modeEdition: boolean = false;

  formType: TypeRetenue = this.getEmptyForm();

  ngOnInit(): void {
    this.chargerTypesRetenues();
  }

  chargerTypesRetenues(): void {
    const saved = localStorage.getItem('sigrh_types_retenues');
    if (saved) {
      try {
        this.typesRetenues = JSON.parse(saved);
        return;
      } catch (e) {}
    }

    // Default initial standard deduction types
    this.typesRetenues = [
      { id: 1, code: 'RET-CNSS',      libelle: 'Cotisation Sociale CNSS',          categorie: 'Sociale',       obligatoire: true,  imposable: false, description: 'Sécurité sociale obligatoire (Part patronale 16%, Part salariale 5.5%)', actif: true },
      { id: 2, code: 'RET-IUTS',      libelle: 'Impôt Unique sur Traitements (IUTS)', categorie: 'Fiscale',      obligatoire: true,  imposable: false, description: 'Impôt direct retenu à la source selon le barème progressif au Burkina Faso', actif: true },
      { id: 3, code: 'RET-ASSUR',     libelle: 'Assurance Maladie Groupe',         categorie: 'Assurance',     obligatoire: false, imposable: false, description: 'Couverture santé complémentaire entreprise (50% employeur, 50% agent)', actif: true },
      { id: 4, code: 'RET-MUTUELLE',  libelle: 'Mutuelle de Santé Interne',        categorie: 'Assurance',     obligatoire: false, imposable: false, description: 'Cotisation mutuelle du personnel', actif: true },
      { id: 5, code: 'RET-PRET',      libelle: 'Remboursement Prêt Équipement/Auto',categorie: 'Remboursement', obligatoire: false, imposable: false, description: 'Prélèvement mensuel sur salaire pour remboursement de prêt', actif: true },
      { id: 6, code: 'RET-AVANCE',    libelle: 'Avance sur Salaire / Acompte',     categorie: 'Remboursement', obligatoire: false, imposable: false, description: 'Recouvrement des acomptes versés en cours de mois', actif: true },
      { id: 7, code: 'RET-CR',        libelle: 'Cotisation Retraite Complémentaire',categorie: 'Sociale',      obligatoire: false, imposable: false, description: 'Fonds de pension complémentaire cadre', actif: true }
    ];

    this.sauvegarderLocal();
  }

  sauvegarderLocal(): void {
    localStorage.setItem('sigrh_types_retenues', JSON.stringify(this.typesRetenues));
  }

  getFilteredTypes(): TypeRetenue[] {
    return this.typesRetenues.filter(item => {
      const matchSearch = !this.searchTerm ||
        item.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.libelle.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCat = this.selectedCategorie === 'TOUS' || item.categorie === this.selectedCategorie;
      return matchSearch && matchCat;
    });
  }

  getCountCategorie(cat: string): number {
    return this.typesRetenues.filter(t => t.categorie === cat).length;
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
      alert('Veuillez remplir le code et le libellé de la retenue.');
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
      categorie: 'Sociale',
      obligatoire: true,
      imposable: false,
      description: '',
      actif: true
    };
  }
}
