import { Component, OnInit } from '@angular/core';
import { CompteComptable, RUBRIQUES_PAIE_OPTIONS, RubriqueOption } from '../../models/compte-comptable.model';
import { CompteComptableService } from '../../services/compte-comptable.service';

@Component({
  selector: 'app-comptes-comptables',
  templateUrl: './comptes-comptables.component.html',
  styleUrls: ['./comptes-comptables.component.scss'],
  standalone: false
})
export class ComptesComptablesComponent implements OnInit {
  comptes: CompteComptable[] = [];
  filteredComptes: CompteComptable[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  // Filtres
  searchQuery = '';
  selectedClasse = 'TOUS'; // TOUS, CLASSE_6, CLASSE_4
  selectedStatut = 'TOUS'; // TOUS, ACTIF, INACTIF

  // Formulaire d'édition / création (Modal)
  showModal = false;
  isEditing = false;
  currentCompte: CompteComptable = {
    numeroCompte: '',
    libelle: '',
    classeCompte: 'CLASSE_6',
    sensParDefaut: 'DEBIT',
    typeRubriqueAssociee: 'SALAIRE_BASE',
    codeJournal: 'OD_PAIE',
    description: '',
    actif: true
  };

  rubriqueOptions: RubriqueOption[] = RUBRIQUES_PAIE_OPTIONS;

  constructor(private compteService: CompteComptableService) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.loading = true;
    this.errorMessage = '';
    this.compteService.getAll().subscribe({
      next: (data) => {
        this.comptes = data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement comptes comptables:', err);
        this.errorMessage = 'Impossible de charger les comptes comptables.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let list = [...this.comptes];

    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter(c =>
        c.numeroCompte.toLowerCase().includes(q) ||
        c.libelle.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.typeRubriqueAssociee && c.typeRubriqueAssociee.toLowerCase().includes(q))
      );
    }

    if (this.selectedClasse !== 'TOUS') {
      list = list.filter(c => c.classeCompte === this.selectedClasse);
    }

    if (this.selectedStatut === 'ACTIF') {
      list = list.filter(c => c.actif);
    } else if (this.selectedStatut === 'INACTIF') {
      list = list.filter(c => !c.actif);
    }

    this.filteredComptes = list;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onClasseChange(classe: string): void {
    this.selectedClasse = classe;
    this.applyFilters();
  }

  onStatutChange(statut: string): void {
    this.selectedStatut = statut;
    this.applyFilters();
  }

  // Statistiques
  get totalComptes(): number {
    return this.comptes.length;
  }

  get totalClasse6(): number {
    return this.comptes.filter(c => c.classeCompte === 'CLASSE_6').length;
  }

  get totalClasse4(): number {
    return this.comptes.filter(c => c.classeCompte === 'CLASSE_4').length;
  }

  get totalActifs(): number {
    return this.comptes.filter(c => c.actif).length;
  }

  // Modale
  ouvrirModalCreation(): void {
    this.isEditing = false;
    this.currentCompte = {
      numeroCompte: '',
      libelle: '',
      classeCompte: 'CLASSE_6',
      sensParDefaut: 'DEBIT',
      typeRubriqueAssociee: 'SALAIRE_BASE',
      codeJournal: 'OD_PAIE',
      description: '',
      actif: true
    };
    this.showModal = true;
  }

  ouvrirModalEdition(compte: CompteComptable): void {
    this.isEditing = true;
    this.currentCompte = { ...compte };
    this.showModal = true;
  }

  fermerModal(): void {
    this.showModal = false;
  }

  onRubriqueSelect(): void {
    const selected = this.rubriqueOptions.find(r => r.code === this.currentCompte.typeRubriqueAssociee);
    if (selected) {
      this.currentCompte.sensParDefaut = selected.sensSuggere;
      this.currentCompte.classeCompte = selected.classeSuggeree;
    }
  }

  onNumeroCompteChange(): void {
    const num = (this.currentCompte.numeroCompte || '').trim();
    if (num.startsWith('6')) {
      this.currentCompte.classeCompte = 'CLASSE_6';
      this.currentCompte.sensParDefaut = 'DEBIT';
    } else if (num.startsWith('4')) {
      this.currentCompte.classeCompte = 'CLASSE_4';
      this.currentCompte.sensParDefaut = 'CREDIT';
    }
  }

  enregistrerCompte(): void {
    if (!this.currentCompte.numeroCompte || !this.currentCompte.numeroCompte.trim()) {
      alert('Veuillez renseigner le numéro de compte.');
      return;
    }
    if (!this.currentCompte.libelle || !this.currentCompte.libelle.trim()) {
      alert('Veuillez renseigner le libellé du compte.');
      return;
    }

    if (this.isEditing && this.currentCompte.id) {
      this.compteService.update(this.currentCompte.id, this.currentCompte).subscribe({
        next: (updated) => {
          const idx = this.comptes.findIndex(c => c.id === updated.id);
          if (idx !== -1) {
            this.comptes[idx] = updated;
          }
          this.applyFilters();
          this.showSuccess('Compte comptable mis à jour avec succès.');
          this.fermerModal();
        },
        error: (err) => {
          console.error('Erreur mise à jour compte:', err);
          alert('Erreur lors de la mise à jour du compte.');
        }
      });
    } else {
      this.compteService.create(this.currentCompte).subscribe({
        next: (created) => {
          this.comptes.unshift(created);
          this.applyFilters();
          this.showSuccess('Compte comptable ajouté avec succès.');
          this.fermerModal();
        },
        error: (err) => {
          console.error('Erreur création compte:', err);
          alert('Erreur lors de la création du compte.');
        }
      });
    }
  }

  toggleStatut(compte: CompteComptable, event: Event): void {
    event.stopPropagation();
    if (!compte.id) return;
    this.compteService.toggleStatus(compte.id).subscribe({
      next: (res) => {
        compte.actif = res.actif !== undefined ? res.actif : !compte.actif;
        this.applyFilters();
        this.showSuccess(`Compte ${compte.numeroCompte} ${compte.actif ? 'activé' : 'désactivé'}.`);
      },
      error: (err) => {
        console.error('Erreur toggle statut:', err);
      }
    });
  }

  supprimerCompte(compte: CompteComptable, event: Event): void {
    event.stopPropagation();
    if (!compte.id) return;
    if (!confirm(`Confirmez-vous la suppression du compte ${compte.numeroCompte} - ${compte.libelle} ?`)) {
      return;
    }

    this.compteService.delete(compte.id).subscribe({
      next: () => {
        this.comptes = this.comptes.filter(c => c.id !== compte.id);
        this.applyFilters();
        this.showSuccess(`Compte ${compte.numeroCompte} supprimé.`);
      },
      error: (err) => {
        console.error('Erreur suppression compte:', err);
        alert('Erreur lors de la suppression.');
      }
    });
  }

  getLibelleRubrique(code?: string): string {
    if (!code) return '—';
    const opt = this.rubriqueOptions.find(o => o.code === code);
    return opt ? opt.libelle : code;
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = '';
    }, 3500);
  }
}
