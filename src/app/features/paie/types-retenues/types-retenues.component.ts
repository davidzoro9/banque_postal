import { Component, OnInit } from '@angular/core';
import { TypeRetenue, TypeRetenueService } from '../services/type-retenue.service';

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
            Référentiel officiel connecté à la base PostgreSQL (Part Employeur, Part Agent, Prélèvements sociaux, fiscaux, assurances...)
          </p>
        </div>
        <button mat-raised-button (click)="ouvrirFormulaire()" style="background: #0060B3; color: #ffffff; border-radius: 8px; font-weight: 600; padding: 0 22px; height: 42px;">
          <mat-icon style="margin-right: 6px; color: #ffffff;">add</mat-icon> Nouveau Type de Retenue
        </button>
      </div>

      <!-- Notification Message -->
      <div *ngIf="notificationMsg" style="margin-bottom: 16px; padding: 12px 18px; border-radius: 8px; background: #dcfce7; border: 1px solid #bbf7d0; color: #166534; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <mat-icon style="font-size: 20px; width: 20px; height: 20px;">check_circle</mat-icon>
        {{ notificationMsg }}
      </div>
      <div *ngIf="errorMsg" style="margin-bottom: 16px; padding: 12px 18px; border-radius: 8px; background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        <mat-icon style="font-size: 20px; width: 20px; height: 20px;">error</mat-icon>
        {{ errorMsg }}
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

      <!-- Table Card -->
      <mat-card style="border-radius: 12px; padding: 0; overflow: hidden; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); width: 100%;">
        <div *ngIf="loading" style="padding: 40px; text-align: center; color: #0060B3;">
          <mat-spinner diameter="40" style="margin: 0 auto 12px;"></mat-spinner>
          <div>Chargement des types de retenue depuis PostgreSQL...</div>
        </div>

        <div *ngIf="!loading" style="overflow-x: auto; width: 100%;">
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
              <tr *ngFor="let item of getFilteredTypes()" class="data-row" style="border-bottom: 1px solid #e2e8f0; font-size: 14px; transition: background 0.2s;">
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
                  <div>Aucun type de retenue trouvé dans la base de données.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </mat-card>

      <!-- Modal Form Overlay -->
      <div *ngIf="afficherFormulaire" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 99999; display: flex; align-items: center; justify-content: center;">
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
            <div *ngIf="modeEdition" style="background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 12px; font-weight: 600; color: #64748b;">Code de référence :</span>
              <span style="font-weight: 800; color: #0060B3; font-family: monospace; font-size: 14px; background: #e0f2fe; padding: 3px 10px; border-radius: 4px;">
                {{ formType.code }}
              </span>
            </div>

            <div *ngIf="!modeEdition">
              <label style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">Code</label>
              <input
                type="text"
                [(ngModel)]="formType.code"
                placeholder="Ex: PART_AGENT, RET_FISCALE..."
                style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;"
              >
            </div>

            <div>
              <label style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">Libellé du Type *</label>
              <input
                type="text"
                [(ngModel)]="formType.libelle"
                placeholder="Ex: Part Agent (Salariale)"
                style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;"
              >
            </div>

            <div>
              <label style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">Description détaillée</label>
              <textarea
                [(ngModel)]="formType.description"
                rows="3"
                placeholder="Préciser l'usage et les conditions réglementaires..."
                style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; resize: vertical; box-sizing: border-box;"
              ></textarea>
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
  loading: boolean = false;
  notificationMsg: string = '';
  errorMsg: string = '';

  afficherFormulaire: boolean = false;
  modeEdition: boolean = false;
  formType: TypeRetenue = this.getEmptyForm();

  constructor(private typeRetenueService: TypeRetenueService) {}

  ngOnInit(): void {
    this.chargerTypesRetenues();
  }

  chargerTypesRetenues(): void {
    this.loading = true;
    this.errorMsg = '';
    this.typeRetenueService.getAll().subscribe({
      next: (data) => {
        this.typesRetenues = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API type-retenue:', err);
        this.errorMsg = 'Impossible de charger les types de retenue depuis le serveur.';
        this.loading = false;
      }
    });
  }

  getFilteredTypes(): TypeRetenue[] {
    return this.typesRetenues.filter(item => {
      return !this.searchTerm ||
        (item.code && item.code.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (item.libelle && item.libelle.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
    });
  }

  ouvrirFormulaire(): void {
    this.modeEdition = false;
    this.formType = this.getEmptyForm();
    const nextNum = this.typesRetenues.length + 1;
    this.formType.code = `TR-${String(nextNum).padStart(3, '0')}`;
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
    if (!this.formType.libelle || !this.formType.libelle.trim()) {
      alert('Veuillez renseigner le libellé du type de retenue.');
      return;
    }

    if (this.modeEdition && this.formType.id) {
      this.typeRetenueService.update(Number(this.formType.id), this.formType).subscribe({
        next: () => {
          this.notify('Type de retenue mis à jour avec succès');
          this.chargerTypesRetenues();
          this.fermerFormulaire();
        },
        error: (err) => {
          console.error('Erreur update type-retenue:', err);
          alert('Erreur lors de la mise à jour.');
        }
      });
    } else {
      this.typeRetenueService.create(this.formType).subscribe({
        next: () => {
          this.notify('Nouveau type de retenue enregistré avec succès');
          this.chargerTypesRetenues();
          this.fermerFormulaire();
        },
        error: (err) => {
          console.error('Erreur create type-retenue:', err);
          alert('Erreur lors de la création.');
        }
      });
    }
  }

  supprimerType(item: TypeRetenue): void {
    if (confirm(`Voulez-vous vraiment supprimer le type de retenue "${item.libelle}" (${item.code}) ?`)) {
      this.typeRetenueService.delete(Number(item.id)).subscribe({
        next: () => {
          this.notify('Type de retenue supprimé');
          this.chargerTypesRetenues();
        },
        error: (err) => {
          console.error('Erreur delete type-retenue:', err);
          alert('Erreur lors de la suppression.');
        }
      });
    }
  }

  toggleStatut(item: TypeRetenue): void {
    const updated = { ...item, actif: !item.actif };
    this.typeRetenueService.update(Number(item.id), updated).subscribe({
      next: () => this.chargerTypesRetenues(),
      error: (err) => console.error('Erreur toggle statut:', err)
    });
  }

  private notify(msg: string): void {
    this.notificationMsg = msg;
    setTimeout(() => this.notificationMsg = '', 4000);
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
