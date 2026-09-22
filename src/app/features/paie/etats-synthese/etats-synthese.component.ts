import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EtatSyntheseService, EtatSyntheseWrapper, EtatSyntheseFilter, EtatSyntheseConfig } from '../services/etat-synthese.service';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-etats-synthese',
  templateUrl: './etats-synthese.component.html',
  styleUrls: ['./etats-synthese.component.scss'],
  standalone: false
})
export class EtatsSyntheseComponent implements OnInit {
  isLoading = false;
  isLoadingConfigs = false;
  isExporting = false;

  // Données PostgreSQL réelles (AUCUNE donnée en dur)
  etatsConfigs: EtatSyntheseConfig[] = [];
  selectedEtat: string = 'LIVRE_PAIE';

  // Filtres
  sessions: any[] = [];
  selectedSessionId: number | null = null;
  directions: any[] = [];
  selectedDirectionId: number | null = null;
  banques: string[] = ['TOUTES'];
  selectedBanque: string = 'TOUTES';
  searchTerm: string = '';

  // Données de l'état en cours
  etatData: EtatSyntheseWrapper | null = null;

  // Modal de Création / Modification d'un État
  isFormModalOpen = false;
  isSaving = false;
  isEditing = false;
  formError = '';
  formSuccess = '';

  configForm: Partial<EtatSyntheseConfig> = {
    code: '',
    libelle: '',
    categorie: 'Personnalisé',
    description: '',
    icon: 'assessment',
    ordre: 1,
    actif: true,
    filtreType: 'ALL'
  };

  availableIcons: string[] = [
    'assessment', 'menu_book', 'badge', 'payments', 'account_balance',
    'security', 'receipt_long', 'credit_card_off', 'flag', 'shield',
    'groups', 'people', 'pie_chart', 'rule', 'trending_up', 'savings', 'calculate',
    'health_and_safety', 'price_check', 'domain'
  ];

  availableCategories: string[] = [
    'Paie Globale', 'Salaires', 'Analytique', 'Bancaire', 'Charges Sociales',
    'Fiscalité', 'Retenues', 'Cotisations Légales', 'Assurance & Santé',
    'Rubriques & Primes', 'Audit & Contrôle', 'Personnalisé'
  ];

  constructor(
    private etatService: EtatSyntheseService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private moduleNav: ModuleNavService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('code');
      if (slug) {
        const resolvedCode = this.resolveCodeFromSlug(slug);
        if (resolvedCode !== this.selectedEtat) {
          this.selectedEtat = resolvedCode;
          if (this.selectedSessionId) {
            this.loadEtatData();
          }
        }
      } else {
        const defaultSlug = this.resolveSlugFromCode(this.selectedEtat || 'LIVRE_PAIE');
        this.router.navigate(['/paie/etats-synthese', defaultSlug], { replaceUrl: true });
      }
    });

    this.route.queryParamMap.subscribe(queryParams => {
      const qType = queryParams.get('type') || queryParams.get('code');
      if (qType) {
        const resolvedCode = this.resolveCodeFromSlug(qType);
        if (resolvedCode !== this.selectedEtat) {
          this.selectedEtat = resolvedCode;
          if (this.selectedSessionId) {
            this.loadEtatData();
          }
        }
      }
    });

    this.loadConfigs();
    this.loadFiltersData();
  }

  // ─── CHARGEMENT DES CONFIGURATIONS D'ÉTATS DEPUIS POSTGRESQL ─────────────
  loadConfigs(): void {
    this.isLoadingConfigs = true;
    this.etatService.getConfigs(false).subscribe({
      next: (configs) => {
        this.etatsConfigs = configs || [];
        this.isLoadingConfigs = false;

        // Synchroniser immédiatement les sous-menus du menu gauche
        this.moduleNav.updateEtatsSyntheseSubmenus(this.etatsConfigs);

        // Si l'URL contient un code d'état, l'activer
        const routeSlug = this.route.snapshot.paramMap.get('code');
        if (routeSlug) {
          this.selectedEtat = this.resolveCodeFromSlug(routeSlug);
        } else {
          const activeOnes = this.activeConfigs;
          if (activeOnes.length > 0) {
            const exists = activeOnes.find(c => c.code === this.selectedEtat);
            if (!exists) {
              this.selectedEtat = activeOnes[0].code;
            }
          }
          this.router.navigate(['/paie/etats-synthese', this.resolveSlugFromCode(this.selectedEtat)], { replaceUrl: true });
        }
        this.loadEtatData();
      },
      error: (err) => {
        console.error('Erreur chargement des configurations d\'états', err);
        this.isLoadingConfigs = false;
      }
    });
  }

  get activeConfigs(): EtatSyntheseConfig[] {
    return this.etatsConfigs.filter(c => c.actif);
  }

  // ─── CHARGEMENT DES FILTRES DEPUIS POSTGRESQL ────────────────────────────
  loadFiltersData(): void {
    // 1. Charger les sessions
    this.http.get<any[]>(`${environment.apiUrl}/paie/sessions`).subscribe({
      next: (res) => {
        this.sessions = res || [];
        if (this.sessions.length > 0) {
          this.selectedSessionId = this.sessions[0].id;
        }
        if (this.selectedEtat) {
          this.loadEtatData();
        }
      },
      error: () => {
        this.http.get<any[]>(`${environment.apiUrl}/bulletin-lots`).subscribe({
          next: (lots) => {
            this.sessions = lots || [];
            if (this.sessions.length > 0) {
              this.selectedSessionId = this.sessions[0].id;
            }
            if (this.selectedEtat) {
              this.loadEtatData();
            }
          },
          error: () => {}
        });
      }
    });

    // 2. Charger les directions
    this.http.get<any[]>(`${environment.apiUrl}/directions`).subscribe({
      next: (dirs) => {
        this.directions = dirs || [];
      },
      error: () => {}
    });

    // 3. Charger les banques réelles depuis PostgreSQL
    this.http.get<any[]>(`${environment.apiUrl}/banques`).subscribe({
      next: (bqs) => {
        if (bqs && bqs.length > 0) {
          const names = bqs.map(b => b.name || b.libelle).filter(Boolean);
          this.banques = ['TOUTES', ...Array.from(new Set(names))];
        }
      },
      error: () => {}
    });
  }

  selectEtat(key: string): void {
    this.selectedEtat = key;
    const slug = this.resolveSlugFromCode(key);
    this.router.navigate(['/paie/etats-synthese', slug]);
  }

  onFilterChange(): void {
    this.loadEtatData();
  }

  loadEtatData(): void {
    if (!this.selectedEtat) return;
    this.isLoading = true;
    const filter: EtatSyntheseFilter = {
      typeEtat: this.selectedEtat,
      sessionPaieId: this.selectedSessionId,
      directionId: this.selectedDirectionId,
      banque: this.selectedBanque
    };

    this.etatService.getEtatSynthese(filter).subscribe({
      next: (res) => {
        this.etatData = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement état de synthèse:', err);
        this.isLoading = false;
      }
    });
  }

  get filteredRows(): any[] {
    if (!this.etatData || !this.etatData.donnees) return [];
    if (!this.searchTerm) return this.etatData.donnees;

    const term = this.searchTerm.toLowerCase().trim();
    return this.etatData.donnees.filter(row => {
      return JSON.stringify(row).toLowerCase().includes(term);
    });
  }

  // ─── FORMULAIRE GESTION D'UN ÉTAT (MODAL CRÉATION / ÉDITION) ─────────────
  openCreateModal(): void {
    this.isEditing = false;
    this.formError = '';
    this.formSuccess = '';
    this.configForm = {
      code: '',
      libelle: '',
      categorie: 'Personnalisé',
      description: '',
      icon: 'assessment',
      ordre: this.etatsConfigs.length + 1,
      actif: true,
      filtreType: 'ALL'
    };
    this.isFormModalOpen = true;
  }

  openEditModal(config: EtatSyntheseConfig, event?: Event): void {
    if (event) event.stopPropagation();
    this.isEditing = true;
    this.formError = '';
    this.formSuccess = '';
    this.configForm = { ...config };
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.formError = '';
    this.formSuccess = '';
  }

  saveConfig(): void {
    if (!this.configForm.libelle || !this.configForm.libelle.trim()) {
      this.formError = 'Le libellé de l\'état est obligatoire.';
      return;
    }

    this.isSaving = true;
    this.formError = '';

    if (this.isEditing && this.configForm.id) {
      // Modification
      this.etatService.updateConfig(this.configForm.id, this.configForm as EtatSyntheseConfig).subscribe({
        next: (saved) => {
          this.isSaving = false;
          this.formSuccess = 'État mis à jour avec succès dans PostgreSQL !';
          const idx = this.etatsConfigs.findIndex(c => c.id === saved.id);
          if (idx !== -1) {
            this.etatsConfigs[idx] = saved;
          }
          this.moduleNav.updateEtatsSyntheseSubmenus(this.etatsConfigs);
          setTimeout(() => {
            this.closeFormModal();
            this.loadEtatData();
          }, 600);
        },
        error: (err) => {
          this.isSaving = false;
          this.formError = err?.error?.message || 'Erreur lors de la mise à jour de l\'état.';
        }
      });
    } else {
      // Création
      if (!this.configForm.code || !this.configForm.code.trim()) {
        // Générer code à partir du libellé
        this.configForm.code = 'ETAT_' + this.configForm.libelle.toUpperCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^A-Z0-9]/g, '_');
      }

      this.etatService.createConfig(this.configForm as EtatSyntheseConfig).subscribe({
        next: (created) => {
          this.isSaving = false;
          this.formSuccess = 'Nouvel état de synthèse créé avec succès !';
          this.etatsConfigs.push(created);
          this.moduleNav.updateEtatsSyntheseSubmenus(this.etatsConfigs);
          setTimeout(() => {
            this.closeFormModal();
            this.selectEtat(created.code);
          }, 600);
        },
        error: (err) => {
          this.isSaving = false;
          this.formError = err?.error?.message || 'Erreur lors de la création de l\'état.';
        }
      });
    }
  }

  toggleConfigActive(config: EtatSyntheseConfig, event?: Event): void {
    if (event) event.stopPropagation();
    if (!config.id) return;
    this.etatService.toggleConfig(config.id).subscribe({
      next: (updated) => {
        config.actif = updated.actif;
        this.moduleNav.updateEtatsSyntheseSubmenus(this.etatsConfigs);
        // Si l'état actuellement affiché vient d'être désactivé, basculer vers un actif
        if (!config.actif && this.selectedEtat === config.code) {
          const firstActive = this.activeConfigs[0];
          if (firstActive) {
            this.selectEtat(firstActive.code);
          }
        }
      },
      error: (err) => console.error('Erreur bascule statut état', err)
    });
  }

  deleteConfig(config: EtatSyntheseConfig, event?: Event): void {
    if (event) event.stopPropagation();
    if (!config.id) return;
    if (config.isSystem) {
      alert('Cet état est un état réglementaire du système et ne peut pas être supprimé. Vous pouvez toutefois le désactiver.');
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'état "${config.libelle}" ?`)) {
      this.etatService.deleteConfig(config.id).subscribe({
        next: () => {
          this.etatsConfigs = this.etatsConfigs.filter(c => c.id !== config.id);
          this.moduleNav.updateEtatsSyntheseSubmenus(this.etatsConfigs);
          if (this.selectedEtat === config.code) {
            this.selectEtat('LIVRE_PAIE');
          }
        },
        error: (err) => alert(err?.error?.message || 'Erreur lors de la suppression de l\'état.')
      });
    }
  }

  deleteFromModal(): void {
    if (!this.configForm.id) return;
    const cfg = this.etatsConfigs.find(c => c.id === this.configForm.id);
    if (!cfg || !cfg.id) return;
    if (cfg.isSystem) {
      alert('Cet état est un état réglementaire du système et ne peut pas être supprimé. Vous pouvez toutefois le désactiver.');
      return;
    }
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'état "${cfg.libelle}" ?`)) {
      this.etatService.deleteConfig(cfg.id!).subscribe({
        next: () => {
          this.closeFormModal();
          this.etatsConfigs = this.etatsConfigs.filter(c => c.id !== cfg.id);
          this.moduleNav.updateEtatsSyntheseSubmenus(this.etatsConfigs);
          if (this.selectedEtat === cfg.code) {
            this.selectEtat('LIVRE_PAIE');
          }
        },
        error: (err) => {
          this.formError = err?.error?.message || 'Erreur lors de la suppression de l\'état.';
        }
      });
    }
  }

  resolveCodeFromSlug(slug: string): string {
    if (!slug) return 'LIVRE_PAIE';
    const clean = slug.toLowerCase().replace(/_/g, '-');
    const SLUG_MAP: Record<string, string> = {
      'livre-paie': 'LIVRE_PAIE',
      'nominatif': 'ETAT_NOMINATIF',
      'etat-nominatif': 'ETAT_NOMINATIF',
      'direction': 'ETAT_SALAIRE',
      'salaire': 'ETAT_SALAIRE',
      'etat-salaire': 'ETAT_SALAIRE',
      'banque': 'ETAT_BANQUE',
      'virements': 'ETAT_BANQUE',
      'etat-banque': 'ETAT_BANQUE',
      'cnss': 'ETAT_CNSS',
      'etat-cnss': 'ETAT_CNSS',
      'iuts': 'ETAT_IUTS',
      'etat-iuts': 'ETAT_IUTS',
      'precompte': 'ETAT_PRECOMPTE',
      'etat-precompte': 'ETAT_PRECOMPTE',
      'fsp': 'ETAT_FSP',
      'etat-fsp': 'ETAT_FSP',
      'mutuelle': 'ETAT_MUTUELLE',
      'etat-mutuelle': 'ETAT_MUTUELLE',
      'type-employe': 'ETAT_TYPE_EMPLOYE',
      'etat-type-employe': 'ETAT_TYPE_EMPLOYE',
      'elements-salaire': 'ETAT_ELEMENT_SALAIRE',
      'etat-elements-salaire': 'ETAT_ELEMENT_SALAIRE',
      'bulletin': 'ETAT_BULLETIN',
      'etat-bulletin': 'ETAT_BULLETIN'
    };
    if (SLUG_MAP[clean]) {
      return SLUG_MAP[clean];
    }
    const directMatch = this.etatsConfigs.find(c =>
      c.code.toLowerCase() === slug.toLowerCase() ||
      c.code.toLowerCase().replace(/_/g, '-') === clean
    );
    return directMatch ? directMatch.code : slug.toUpperCase().replace(/-/g, '_');
  }

  resolveSlugFromCode(code: string): string {
    const CODE_TO_SLUG: Record<string, string> = {
      'LIVRE_PAIE': 'livre-paie',
      'ETAT_NOMINATIF': 'nominatif',
      'ETAT_SALAIRE': 'direction',
      'ETAT_BANQUE': 'banque',
      'ETAT_CNSS': 'cnss',
      'ETAT_IUTS': 'iuts',
      'ETAT_PRECOMPTE': 'precompte',
      'ETAT_FSP': 'fsp',
      'ETAT_MUTUELLE': 'mutuelle',
      'ETAT_TYPE_EMPLOYE': 'type-employe',
      'ETAT_ELEMENT_SALAIRE': 'elements-salaire',
      'ETAT_ELEMENTS_SALAIRE': 'elements-salaire',
      'ETAT_BULLETIN': 'bulletin'
    };
    return CODE_TO_SLUG[code] || code.toLowerCase().replace(/_/g, '-');
  }

  // ─── EXPORTS ─────────────────────────────────────────────────────────────
  exportPdf(): void {
    this.isExporting = true;
    const filter: EtatSyntheseFilter = {
      typeEtat: this.selectedEtat,
      sessionPaieId: this.selectedSessionId,
      directionId: this.selectedDirectionId,
      banque: this.selectedBanque
    };

    this.etatService.downloadPdf(filter).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, `etat-${this.selectedEtat.toLowerCase()}.pdf`);
        this.isExporting = false;
      },
      error: () => {
        this.isExporting = false;
      }
    });
  }

  exportExcel(): void {
    this.isExporting = true;
    const filter: EtatSyntheseFilter = {
      typeEtat: this.selectedEtat,
      sessionPaieId: this.selectedSessionId,
      directionId: this.selectedDirectionId,
      banque: this.selectedBanque
    };

    this.etatService.downloadExcel(filter).subscribe({
      next: (blob) => {
        this.triggerDownload(blob, `etat-${this.selectedEtat.toLowerCase()}.csv`);
        this.isExporting = false;
      },
      error: () => {
        this.isExporting = false;
      }
    });
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  formatFcfa(val: number | null | undefined): string {
    if (val === null || val === undefined) return '0 F';
    return Math.round(val).toLocaleString('fr-FR') + ' F';
  }

  get isCustomEtat(): boolean {
    const builtIn = ['LIVRE_PAIE', 'ETAT_NOMINATIF', 'ETAT_SALAIRE', 'ETAT_BANQUE', 'ETAT_CNSS', 'ETAT_IUTS', 'ETAT_PRECOMPTE', 'ETAT_FSP', 'ETAT_MUTUELLE', 'ETAT_TYPE_EMPLOYE', 'ETAT_ELEMENTS_SALAIRE', 'ETAT_ELEMENT_SALAIRE', 'ETAT_BULLETIN'];
    return !builtIn.includes(this.selectedEtat);
  }

  getSelectedEtatObj(): EtatSyntheseConfig {
    return this.etatsConfigs.find(e => e.code === this.selectedEtat) || {
      code: this.selectedEtat,
      libelle: this.selectedEtat,
      categorie: 'Général',
      actif: true,
      icon: 'assessment'
    };
  }
}
