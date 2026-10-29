import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CompteComptable,
  ClasseComptableOption,
  SensEcritureOption,
  JournalComptableOption,
  RubriqueOption,
  ParametresFormulaireCompte
} from '../../models/compte-comptable.model';
import { CompteComptableService } from '../../services/compte-comptable.service';

export type ComptesTabType = 'comptes' | 'classes' | 'sens' | 'rubriques' | 'journaux';

@Component({
  selector: 'app-comptes-comptables',
  templateUrl: './comptes-comptables.component.html',
  styleUrls: ['./comptes-comptables.component.scss'],
  standalone: false
})
export class ComptesComptablesComponent implements OnInit {
  // Onglet actif
  activeTab: ComptesTabType = 'comptes';

  // Données principales
  comptes: CompteComptable[] = [];
  filteredComptes: CompteComptable[] = [];
  loading = true;
  loadingParametres = false;
  errorMessage = '';
  successMessage = '';

  // Paramètres dynamiques (PostgreSQL / Spring Boot API)
  classesOptions: ClasseComptableOption[] = [];
  sensOptions: SensEcritureOption[] = [];
  journauxOptions: JournalComptableOption[] = [];
  rubriqueOptions: RubriqueOption[] = [];

  // Filtres Plan des Comptes
  searchQuery = '';
  selectedClasse = 'TOUS'; // TOUS, CLASSE_6, CLASSE_4, etc.
  selectedStatut = 'TOUS'; // TOUS, ACTIF, INACTIF

  // 1. Modale Compte Comptable
  showModal = false;
  isEditing = false;
  currentCompte: CompteComptable = {
    numeroCompte: '',
    libelle: '',
    classeCompte: 'CLASSE_6',
    sensParDefaut: 'DEBIT',
    typeRubriqueAssociee: '',
    codeJournal: 'OD_PAIE',
    description: '',
    actif: true
  };

  // 2. Modale Classe Comptable
  showClasseModal = false;
  isEditingClasse = false;
  currentClasse: ClasseComptableOption = {
    code: '',
    numero: '',
    nom: '',
    libelle: '',
    description: '',
    ordre: 1,
    actif: true
  };

  // 3. Modale Sens d'Écriture
  showSensModal = false;
  isEditingSens = false;
  currentSens: SensEcritureOption = {
    code: 'DEBIT',
    libelle: '',
    description: '',
    ordre: 1,
    actif: true
  };

  // 4. Modale Journal Comptable
  showJournalModal = false;
  isEditingJournal = false;
  currentJournal: JournalComptableOption = {
    code: '',
    libelle: '',
    typeJournal: 'OD',
    description: '',
    ordre: 1,
    actif: true
  };

  // 5. Modale Rubrique de Paie
  showRubriqueModal = false;
  isEditingRubrique = false;
  currentRubrique: RubriqueOption = {
    code: '',
    libelle: '',
    sensSuggere: 'DEBIT',
    classeSuggeree: 'CLASSE_6',
    numeroCompteDefaut: '',
    typeRubrique: 'GAIN',
    description: '',
    ordre: 1,
    actif: true
  };

  constructor(
    private compteService: CompteComptableService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.detectTabFromUrl();
    this.loadComptes();
    this.loadParametres();
  }

  detectTabFromUrl(): void {
    const url = this.router.url;
    if (url.includes('/classes')) {
      this.activeTab = 'classes';
    } else if (url.includes('/sens')) {
      this.activeTab = 'sens';
    } else if (url.includes('/rubriques')) {
      this.activeTab = 'rubriques';
    } else if (url.includes('/journaux')) {
      this.activeTab = 'journaux';
    } else {
      this.activeTab = 'comptes';
    }
  }

  switchTab(tab: ComptesTabType): void {
    this.activeTab = tab;
    const target = tab === 'comptes' ? '/paie/comptes-comptables' : `/paie/comptes-comptables/${tab}`;
    this.router.navigateByUrl(target);
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
        this.errorMessage = 'Impossible de charger les comptes comptables depuis le serveur.';
        this.loading = false;
      }
    });
  }

  loadParametres(): void {
    this.loadingParametres = true;
    this.compteService.getParametresFormulaire().subscribe({
      next: (params: ParametresFormulaireCompte) => {
        this.classesOptions = params.classes || [];
        this.sensOptions = params.sens || [];
        this.journauxOptions = params.journaux || [];
        this.rubriqueOptions = params.rubriques || [];
        this.loadingParametres = false;
      },
      error: (err) => {
        console.error('Erreur chargement paramètres formulaire comptable:', err);
        this.loadingParametres = false;
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

  // Statistiques dynamiques
  get totalComptes(): number {
    return this.comptes.length;
  }

  get totalClasse6(): number {
    return this.comptes.filter(c => c.classeCompte === 'CLASSE_6' || c.classeCompte === '6').length;
  }

  get totalClasse4(): number {
    return this.comptes.filter(c => c.classeCompte === 'CLASSE_4' || c.classeCompte === '4').length;
  }

  get totalActifs(): number {
    return this.comptes.filter(c => c.actif).length;
  }

  // =========================================================================
  // 1. GESTION DES COMPTES COMPTABLES
  // =========================================================================

  ouvrirModalCreation(): void {
    this.isEditing = false;
    const defaultClasse = this.classesOptions.length > 0 ? this.classesOptions[0].code : 'CLASSE_6';
    const defaultSens = this.sensOptions.length > 0 ? this.sensOptions[0].code : 'DEBIT';
    const defaultJournal = this.journauxOptions.length > 0 ? this.journauxOptions[0].code : 'OD_PAIE';
    const defaultRubrique = this.rubriqueOptions.length > 0 ? this.rubriqueOptions[0].code : '';

    this.currentCompte = {
      numeroCompte: '',
      libelle: '',
      classeCompte: defaultClasse,
      sensParDefaut: defaultSens,
      typeRubriqueAssociee: defaultRubrique,
      codeJournal: defaultJournal,
      description: '',
      actif: true
    };

    if (defaultRubrique) {
      this.onRubriqueSelect();
    }

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
      if (selected.sensSuggere) {
        this.currentCompte.sensParDefaut = selected.sensSuggere;
      }
      if (selected.classeSuggeree) {
        this.currentCompte.classeCompte = selected.classeSuggeree;
      }
      if (!this.isEditing) {
        if (selected.numeroCompteDefaut && (!this.currentCompte.numeroCompte || this.currentCompte.numeroCompte.trim() === '')) {
          this.currentCompte.numeroCompte = selected.numeroCompteDefaut;
        }
        if (selected.libelle && (!this.currentCompte.libelle || this.currentCompte.libelle.trim() === '')) {
          this.currentCompte.libelle = selected.libelle;
        }
        if (selected.description && (!this.currentCompte.description || this.currentCompte.description.trim() === '')) {
          this.currentCompte.description = selected.description;
        }
      }
    }
  }

  onNumeroCompteChange(): void {
    const num = (this.currentCompte.numeroCompte || '').trim();
    if (num.length > 0) {
      const firstChar = num.charAt(0);
      const matched = this.classesOptions.find(c => c.numero === firstChar || c.code === `CLASSE_${firstChar}`);
      if (matched) {
        this.currentCompte.classeCompte = matched.code;
      }
      if (firstChar === '6') {
        this.currentCompte.sensParDefaut = 'DEBIT';
      } else if (firstChar === '4') {
        this.currentCompte.sensParDefaut = 'CREDIT';
      }
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

  // =========================================================================
  // 2. GESTION DES CLASSES COMPTABLES (Numéro et Nom de classe)
  // =========================================================================

  getClasseNumero(cl?: ClasseComptableOption): string {
    if (!cl) return '';
    if (cl.numero && cl.numero.trim()) return cl.numero.trim();
    if (cl.code) return cl.code.replace('CLASSE_', '').trim();
    if (cl.libelle) {
      const match = cl.libelle.match(/Classe\s+(\d+)/i);
      if (match) return match[1];
    }
    return '';
  }

  getClasseNom(cl?: ClasseComptableOption): string {
    if (!cl) return '';
    if (cl.nom && cl.nom.trim()) return cl.nom.trim();
    if (cl.libelle) {
      if (cl.libelle.includes('—')) {
        const part = cl.libelle.split('—')[1]?.trim();
        if (part) return part;
      } else if (cl.libelle.includes('-')) {
        const part = cl.libelle.split('-')[1]?.trim();
        if (part) return part;
      }
    }
    return cl.libelle || cl.code || '';
  }

  ouvrirModalClasse(classe?: ClasseComptableOption): void {
    if (classe) {
      this.isEditingClasse = true;
      const num = this.getClasseNumero(classe);
      const nom = this.getClasseNom(classe);
      this.currentClasse = {
        ...classe,
        numero: num,
        nom: nom
      };
    } else {
      this.isEditingClasse = false;
      this.currentClasse = {
        code: '',
        numero: '',
        nom: '',
        libelle: '',
        description: '',
        ordre: this.classesOptions.length + 1,
        actif: true
      };
    }
    this.showClasseModal = true;
  }

  fermerModalClasse(): void {
    this.showClasseModal = false;
  }

  enregistrerClasse(): void {
    if (!this.currentClasse.numero || !this.currentClasse.numero.trim()) {
      alert('Veuillez renseigner le numéro de la classe (ex: 6, 4, 1...).');
      return;
    }
    if (!this.currentClasse.nom || !this.currentClasse.nom.trim()) {
      alert('Veuillez renseigner le nom de la classe (ex: Charges de personnel).');
      return;
    }

    if (!this.currentClasse.code || !this.currentClasse.code.trim()) {
      this.currentClasse.code = 'CLASSE_' + this.currentClasse.numero.trim();
    }
    this.currentClasse.libelle = `Classe ${this.currentClasse.numero.trim()} — ${this.currentClasse.nom.trim()}`;

    this.compteService.saveClasse(this.currentClasse).subscribe({
      next: (saved) => {
        const idx = this.classesOptions.findIndex(c => c.id === saved.id || c.code === saved.code);
        if (idx !== -1) {
          this.classesOptions[idx] = saved;
        } else {
          this.classesOptions.push(saved);
        }
        this.showSuccess(`Classe ${saved.numero} enregistrée avec succès.`);
        this.fermerModalClasse();
        this.loadParametres();
      },
      error: (err) => {
        console.error('Erreur enregistrement classe:', err);
        alert('Erreur lors de l\'enregistrement de la classe comptable.');
      }
    });
  }

  toggleStatutClasse(c: ClasseComptableOption, event: Event): void {
    event.stopPropagation();
    if (!c.id) return;
    this.compteService.toggleClasseStatus(c.id).subscribe({
      next: (res) => {
        c.actif = res.actif;
        this.showSuccess(`Classe ${c.numero} ${c.actif ? 'activée' : 'désactivée'}.`);
      },
      error: (err) => console.error('Erreur toggle statut classe:', err)
    });
  }

  supprimerClasse(c: ClasseComptableOption, event: Event): void {
    event.stopPropagation();
    if (!c.id) return;
    if (!confirm(`Confirmez-vous la suppression de la Classe ${c.numero} (${c.nom}) ?`)) return;

    this.compteService.deleteClasse(c.id).subscribe({
      next: () => {
        this.classesOptions = this.classesOptions.filter(item => item.id !== c.id);
        this.showSuccess(`Classe ${c.numero} supprimée.`);
        this.loadParametres();
      },
      error: (err) => {
        console.error('Erreur suppression classe:', err);
        alert('Impossible de supprimer cette classe car elle peut être utilisée par des comptes comptables.');
      }
    });
  }

  // =========================================================================
  // 3. GESTION DES SENS D'ÉCRITURE (DÉBIT / CRÉDIT)
  // =========================================================================

  ouvrirModalSens(sens?: SensEcritureOption): void {
    if (sens) {
      this.isEditingSens = true;
      this.currentSens = { ...sens };
    } else {
      this.isEditingSens = false;
      this.currentSens = {
        code: '',
        libelle: '',
        description: '',
        ordre: this.sensOptions.length + 1,
        actif: true
      };
    }
    this.showSensModal = true;
  }

  fermerModalSens(): void {
    this.showSensModal = false;
  }

  enregistrerSens(): void {
    if (!this.currentSens.code || !this.currentSens.code.trim()) {
      alert('Veuillez renseigner le code du sens comptable (ex: DEBIT, CREDIT).');
      return;
    }
    if (!this.currentSens.libelle || !this.currentSens.libelle.trim()) {
      alert('Veuillez renseigner le libellé du sens comptable.');
      return;
    }

    this.compteService.saveSens(this.currentSens).subscribe({
      next: (saved) => {
        const idx = this.sensOptions.findIndex(s => s.id === saved.id || s.code === saved.code);
        if (idx !== -1) {
          this.sensOptions[idx] = saved;
        } else {
          this.sensOptions.push(saved);
        }
        this.showSuccess(`Sens ${saved.code} enregistré avec succès.`);
        this.fermerModalSens();
        this.loadParametres();
      },
      error: (err) => {
        console.error('Erreur enregistrement sens:', err);
        alert('Erreur lors de l\'enregistrement du sens comptable.');
      }
    });
  }

  toggleStatutSens(s: SensEcritureOption, event: Event): void {
    event.stopPropagation();
    if (!s.id) return;
    this.compteService.toggleSensStatus(s.id).subscribe({
      next: (res) => {
        s.actif = res.actif;
        this.showSuccess(`Sens ${s.code} ${s.actif ? 'activé' : 'désactivé'}.`);
      },
      error: (err) => console.error('Erreur toggle sens:', err)
    });
  }

  supprimerSens(s: SensEcritureOption, event: Event): void {
    event.stopPropagation();
    if (!s.id) return;
    if (!confirm(`Confirmez-vous la suppression du sens ${s.code} ?`)) return;

    this.compteService.deleteSens(s.id).subscribe({
      next: () => {
        this.sensOptions = this.sensOptions.filter(item => item.id !== s.id);
        this.showSuccess(`Sens ${s.code} supprimé.`);
        this.loadParametres();
      },
      error: (err) => {
        console.error('Erreur suppression sens:', err);
        alert('Impossible de supprimer ce sens.');
      }
    });
  }

  // =========================================================================
  // 4. GESTION DES CODES JOURNAUX OD
  // =========================================================================

  ouvrirModalJournal(j?: JournalComptableOption): void {
    if (j) {
      this.isEditingJournal = true;
      this.currentJournal = { ...j };
    } else {
      this.isEditingJournal = false;
      this.currentJournal = {
        code: '',
        libelle: '',
        typeJournal: 'OD',
        description: '',
        ordre: this.journauxOptions.length + 1,
        actif: true
      };
    }
    this.showJournalModal = true;
  }

  fermerModalJournal(): void {
    this.showJournalModal = false;
  }

  enregistrerJournal(): void {
    if (!this.currentJournal.code || !this.currentJournal.code.trim()) {
      alert('Veuillez renseigner le code du journal (ex: OD_PAIE, BQ_PAIE).');
      return;
    }
    if (!this.currentJournal.libelle || !this.currentJournal.libelle.trim()) {
      alert('Veuillez renseigner le libellé du journal.');
      return;
    }

    this.compteService.saveJournal(this.currentJournal).subscribe({
      next: (saved) => {
        const idx = this.journauxOptions.findIndex(item => item.id === saved.id || item.code === saved.code);
        if (idx !== -1) {
          this.journauxOptions[idx] = saved;
        } else {
          this.journauxOptions.push(saved);
        }
        this.showSuccess(`Journal ${saved.code} enregistré avec succès.`);
        this.fermerModalJournal();
        this.loadParametres();
      },
      error: (err) => {
        console.error('Erreur enregistrement journal:', err);
        alert('Erreur lors de l\'enregistrement du journal.');
      }
    });
  }

  toggleStatutJournal(j: JournalComptableOption, event: Event): void {
    event.stopPropagation();
    if (!j.id) return;
    this.compteService.toggleJournalStatus(j.id).subscribe({
      next: (res) => {
        j.actif = res.actif;
        this.showSuccess(`Journal ${j.code} ${j.actif ? 'activé' : 'désactivé'}.`);
      },
      error: (err) => console.error('Erreur toggle journal:', err)
    });
  }

  supprimerJournal(j: JournalComptableOption, event: Event): void {
    event.stopPropagation();
    if (!j.id) return;
    if (!confirm(`Confirmez-vous la suppression du journal ${j.code} ?`)) return;

    this.compteService.deleteJournal(j.id).subscribe({
      next: () => {
        this.journauxOptions = this.journauxOptions.filter(item => item.id !== j.id);
        this.showSuccess(`Journal ${j.code} supprimé.`);
        this.loadParametres();
      },
      error: (err) => {
        console.error('Erreur suppression journal:', err);
        alert('Impossible de supprimer ce journal.');
      }
    });
  }

  // =========================================================================
  // 5. GESTION DES RUBRIQUES DE PAIE AFFECTÉES
  // =========================================================================

  ouvrirModalRubrique(r?: RubriqueOption): void {
    if (r) {
      this.isEditingRubrique = true;
      this.currentRubrique = { ...r };
    } else {
      this.isEditingRubrique = false;
      this.currentRubrique = {
        code: '',
        libelle: '',
        sensSuggere: 'DEBIT',
        classeSuggeree: this.classesOptions.length > 0 ? this.classesOptions[0].code : 'CLASSE_6',
        numeroCompteDefaut: '',
        typeRubrique: 'GAIN',
        description: '',
        ordre: this.rubriqueOptions.length + 1,
        actif: true
      };
    }
    this.showRubriqueModal = true;
  }

  fermerModalRubrique(): void {
    this.showRubriqueModal = false;
  }

  enregistrerRubrique(): void {
    if (!this.currentRubrique.code || !this.currentRubrique.code.trim()) {
      alert('Veuillez renseigner le code de la rubrique (ex: SALAIRE_BASE).');
      return;
    }
    if (!this.currentRubrique.libelle || !this.currentRubrique.libelle.trim()) {
      alert('Veuillez renseigner le libellé de la rubrique.');
      return;
    }

    this.compteService.saveRubrique(this.currentRubrique).subscribe({
      next: (saved) => {
        const idx = this.rubriqueOptions.findIndex(item => item.id === saved.id || item.code === saved.code);
        if (idx !== -1) {
          this.rubriqueOptions[idx] = saved;
        } else {
          this.rubriqueOptions.push(saved);
        }
        this.showSuccess(`Rubrique ${saved.libelle} enregistrée avec succès.`);
        this.fermerModalRubrique();
        this.loadParametres();
      },
      error: (err) => {
        console.error('Erreur enregistrement rubrique:', err);
        alert('Erreur lors de l\'enregistrement de la rubrique de paie.');
      }
    });
  }

  toggleStatutRubrique(r: RubriqueOption, event: Event): void {
    event.stopPropagation();
    if (!r.id) return;
    this.compteService.toggleRubriqueStatus(r.id).subscribe({
      next: (res) => {
        r.actif = res.actif;
        this.showSuccess(`Rubrique ${r.code} ${r.actif ? 'activée' : 'désactivée'}.`);
      },
      error: (err) => console.error('Erreur toggle rubrique:', err)
    });
  }

  supprimerRubrique(r: RubriqueOption, event: Event): void {
    event.stopPropagation();
    if (!r.id) return;
    if (!confirm(`Confirmez-vous la suppression de la rubrique ${r.libelle} ?`)) return;

    this.compteService.deleteRubrique(r.id).subscribe({
      next: () => {
        this.rubriqueOptions = this.rubriqueOptions.filter(item => item.id !== r.id);
        this.showSuccess(`Rubrique ${r.code} supprimée.`);
        this.loadParametres();
      },
      error: (err) => {
        console.error('Erreur suppression rubrique:', err);
        alert('Impossible de supprimer cette rubrique.');
      }
    });
  }

  // =========================================================================
  // LIBELLÉS & FORMATAGES
  // =========================================================================

  getLibelleRubrique(code?: string): string {
    if (!code) return '—';
    const opt = this.rubriqueOptions.find(o => o.code === code);
    return opt ? opt.libelle : code;
  }

  getLibelleClasse(code?: string): string {
    if (!code) return '—';
    const opt = this.classesOptions.find(c => c.code === code || c.numero === code);
    if (opt) {
      return opt.numero && opt.nom ? `Classe ${opt.numero} — ${opt.nom}` : opt.libelle;
    }
    return code === 'CLASSE_6' ? 'Classe 6 — Charges de personnel' : (code === 'CLASSE_4' ? 'Classe 4 — Comptes de tiers / Dettes' : code);
  }

  getLibelleSens(code?: string): string {
    if (!code) return '—';
    const opt = this.sensOptions.find(s => s.code === code);
    return opt ? opt.libelle : code;
  }

  getLibelleJournal(code?: string): string {
    if (!code) return '—';
    const opt = this.journauxOptions.find(j => j.code === code);
    return opt ? opt.libelle : code;
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = '';
    }, 3500);
  }
}
