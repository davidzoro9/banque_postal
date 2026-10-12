import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimulationService } from '../services/simulation.service';
import { IndemniteDetail, SimulationIndemnitesAuto, SimulationMode, SimulationRequest, SimulationResult } from '../models/simulation.model';

interface CategorieOption {
  code: string;
  libelle: string;
  groupe: string;
}

@Component({
  selector: 'app-calculatrice-simulation',
  templateUrl: './calculatrice-simulation.component.html',
  styleUrls: ['./calculatrice-simulation.component.scss'],
  standalone: false
})
export class CalculatriceSimulationComponent implements OnInit, OnDestroy {

  mode: SimulationMode = 'NET_VERS_SURSALAIRE';

  // Sélections de classification
  selectedCategorie = 'II';
  selectedEchelon = 1;
  selectedGrade = 'GROUPE II';
  selectedCategorieId?: number;
  selectedEchelonId?: number;
  selectedGradeId?: number;
  nombrePersonnesCharge = 0;

  // Poste (Emploi) & Fonction à assurer
  emplois: { id: number; code: string; name: string }[] = [];
  fonctions: { id: number; code: string; name: string; typeNomination?: string }[] = [];
  selectedEmploiId: number | null = null;
  selectedFonctionId: number | null = null;
  vehiculeFourni = false;
  logementFourni = false;
  chargementRefs = false;

  // Montants saisis
  netCibleSouhaite: number | null = 350000;
  surSalairePropose: number | null = 50000;

  // Indemnités conventionnelles & de poste
  afficherIndemnites = true;
  modeEditionIndemnites = false;
  indemniteLogement: number = 0;
  indemniteTransport: number = 0;
  indemniteFonction: number = 0;
  indemniteCaisse: number = 0;
  indemniteSujetion: number = 0;
  indemniteCashPoint: number = 0;
  autresIndemnites: number = 0;
  indemnitesDetails: IndemniteDetail[] = [];
  chargementIndemnites = false;
  indemnitesModifieesManuellement = false;

  // Salaire de base et classifications (100% connectés à PostgreSQL)
  salaireBaseAffiche = 203834;
  chargementSalaireBase = false;
  private subscriptions: Subscription = new Subscription();

  // Résultat du calcul
  resultat: SimulationResult | null = null;
  enChargement = false;
  messageErreur = '';

  // Classifications chargées dynamiquement depuis la base de données PostgreSQL
  categories: CategorieOption[] = [];
  echelons: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  constructor(
    private simulationService: SimulationService
  ) {}

  ngOnInit(): void {
    this.chargerReferences();
    this.lancerSimulation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  determinerGroupe(code?: string, desc?: string, libelle?: string): 'GROUPE I' | 'GROUPE II' | 'GROUPE III' {
    const combined = `${code || ''} ${desc || ''} ${libelle || ''}`.toUpperCase();
    if (
      combined.includes('GROUPE III') ||
      ['V', 'VI', 'VII', 'VIII', 'CL5', 'CL6', 'CL7', 'CL8'].includes((code || '').toUpperCase().trim()) ||
      combined.includes('CLASSE V') ||
      combined.includes('CLASSE VI') ||
      combined.includes('CLASSE VII') ||
      combined.includes('CLASSE VIII')
    ) {
      return 'GROUPE III';
    }
    if (
      combined.includes('GROUPE II') ||
      ['I', 'II', 'III', 'IV', 'CL1', 'CL2', 'CL3', 'CL4'].includes((code || '').toUpperCase().trim()) ||
      combined.includes('CLASSE I') ||
      combined.includes('CLASSE II') ||
      combined.includes('CLASSE III') ||
      combined.includes('CLASSE IV') ||
      combined.includes('MAÎTRISE') ||
      combined.includes('MAITRISE')
    ) {
      return 'GROUPE II';
    }
    return 'GROUPE I';
  }

  normaliserCodeCategorie(code?: string, libelle?: string): string {
    const raw = (code || '').toUpperCase().trim();
    const lib = (libelle || '').toUpperCase().trim();
    const mapRoman: Record<string, string> = {
      'CL1': 'I', 'CLI': 'I', 'CLASSE I': 'I',
      'CL2': 'II', 'CLII': 'II', 'CLASSE II': 'II',
      'CL3': 'III', 'CLIII': 'III', 'CLASSE III': 'III',
      'CL4': 'IV', 'CLIV': 'IV', 'CLASSE IV': 'IV',
      'CL5': 'V', 'CLV': 'V', 'CLASSE V': 'V',
      'CL6': 'VI', 'CLVI': 'VI', 'CLASSE VI': 'VI',
      'CL7': 'VII', 'CLVII': 'VII', 'CLASSE VII': 'VII',
      'CL8': 'VIII', 'CLVIII': 'VIII', 'CLASSE VIII': 'VIII'
    };
    if (mapRoman[raw]) return mapRoman[raw];
    if (lib.includes('CLASSE I') && !lib.includes('CLASSE II') && !lib.includes('CLASSE III') && !lib.includes('CLASSE IV')) return 'I';
    if (lib.includes('CLASSE II')) return 'II';
    if (lib.includes('CLASSE III')) return 'III';
    if (lib.includes('CLASSE IV')) return 'IV';
    if (lib.includes('CLASSE V') && !lib.includes('CLASSE VI') && !lib.includes('CLASSE VII') && !lib.includes('CLASSE VIII')) return 'V';
    if (lib.includes('CLASSE VI')) return 'VI';
    if (lib.includes('CLASSE VII')) return 'VII';
    if (lib.includes('CLASSE VIII')) return 'VIII';
    for (let i = 1; i <= 7; i++) {
      if (raw === String(i) || raw === `CAT-00${i}` || raw === `C${i}` || lib.includes(`${i}ÈRE CATEGORIE`) || lib.includes(`${i}ÈME CATEGORIE`) || lib.includes(`${i}ERE CATEGORIE`) || lib.includes(`${i}EME CATEGORIE`)) {
        return String(i);
      }
    }
    return raw;
  }

  getCategoriesByGroupe(groupe: string): CategorieOption[] {
    if (groupe === 'AUTRES') {
      return (this.categories || []).filter(c => !['GROUPE I', 'GROUPE II', 'GROUPE III'].includes(c.groupe));
    }
    return (this.categories || []).filter(c => c.groupe === groupe);
  }

  compareCategorie = (a: any, b: any): boolean => {
    if (!a || !b) return a === b;
    const aNorm = this.normaliserCodeCategorie(String(a));
    const bNorm = this.normaliserCodeCategorie(String(b));
    return aNorm === bNorm || String(a).toUpperCase().trim() === String(b).toUpperCase().trim();
  };

  compareEchelon = (a: any, b: any): boolean => {
    return Number(a) === Number(b);
  };

  chargerReferences(): void {
    this.chargementRefs = true;

    // 1. Emplois et Fonctions directement depuis le backend PostgreSQL
    const subEmp = this.simulationService.getEmplois().subscribe({
      next: (data) => {
        this.emplois = (data || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        this.chargementRefs = false;
      },
      error: (e) => {
        console.warn('Erreur chargement emplois:', e);
        this.chargementRefs = false;
      }
    });
    this.subscriptions.add(subEmp);

    const subFnc = this.simulationService.getFonctions().subscribe({
      next: (data) => {
        this.fonctions = (data || []).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      },
      error: (e) => console.warn('Erreur chargement fonctions:', e)
    });
    this.subscriptions.add(subFnc);

    // 2. Chargement dynamique des Catégories DIRECTEMENT depuis la table PostgreSQL 'categorie'
    const subCat = this.simulationService.getCategories().subscribe({
      next: (items) => {
        if (items && items.length > 0) {
          this.categories = items.map((item: any) => ({
            code: item.code,
            libelle: item.libelle || `Catégorie ${item.code}`,
            groupe: this.determinerGroupe(item.code, item.description, item.libelle)
          }));

          const existe = this.categories.some(c => c.code === this.selectedCategorie);
          if (!existe && this.categories.length > 0) {
            this.selectedCategorie = this.categories[0].code;
          }
          this.lancerSimulation();
        }
      },
      error: (e) => console.warn('Erreur chargement categories DB:', e)
    });
    this.subscriptions.add(subCat);

    // 3. Chargement dynamique des Échelons DIRECTEMENT depuis la table PostgreSQL 'echelon'
    const subEch = this.simulationService.getEchelons().subscribe({
      next: (items) => {
        if (items && items.length > 0) {
          const parsed = items.map((e: any) => Number(e.code) || Number(e.libelle)).filter((n: number) => !isNaN(n) && n > 0);
          if (parsed.length > 0) {
            this.echelons = Array.from(new Set(parsed)).sort((a: number, b: number) => a - b);
          }
          this.lancerSimulation();
        }
      },
      error: (e) => console.warn('Erreur chargement echelons DB:', e)
    });
    this.subscriptions.add(subEch);
  }

  /**
   * Actualise la simulation en une seule requête atomique.
   */
  actualiserIndemnitesConventionnelles(): void {
    this.lancerSimulation();
  }

  onEmploiChange(): void {
    this.lancerSimulation();
  }

  onFonctionChange(): void {
    const f = this.fonctions.find(item => Number(item.id) === Number(this.selectedFonctionId));
    if (f && f.name) {
      const u = f.name.toUpperCase();
      if (u.includes('DIRECTEUR GÉNÉRAL')) {
        this.selectedCategorie = 'VIII';
        this.selectedGrade = 'GROUPE III';
      } else if (u.includes('DIRECTEUR')) {
        this.selectedCategorie = 'VI';
        this.selectedGrade = 'GROUPE III';
      } else if (u.includes("CHEF D'AGENCE")) {
        this.selectedCategorie = 'IV';
        this.selectedGrade = 'GROUPE II';
      }
    }
    this.lancerSimulation();
  }

  onAvantageChange(): void {
    this.lancerSimulation();
  }

  onClassificationChange(): void {
    const catObj = this.categories.find(c => c.code === this.selectedCategorie);
    if (catObj) {
      this.selectedGrade = catObj.groupe;
    }
    this.selectedEchelonId = undefined;
    this.lancerSimulation();
  }

  onIndemniteManuelleChange(): void {
    this.indemnitesModifieesManuellement = true;
    this.lancerSimulation();
  }

  reinitialiserIndemnites(): void {
    this.indemnitesModifieesManuellement = false;
    this.lancerSimulation();
  }

  getTotalIndemnitesSaisies(): number {
    return (this.indemniteLogement || 0) + (this.indemniteTransport || 0) +
           (this.indemniteFonction || 0) + (this.indemniteCaisse || 0) +
           (this.indemniteSujetion || 0) + (this.indemniteCashPoint || 0) +
           (this.autresIndemnites || 0);
  }

  getNomEmploiSelectionne(): string | undefined {
    return this.emplois.find(e => Number(e.id) === Number(this.selectedEmploiId))?.name;
  }

  getNomFonctionSelectionnee(): string | undefined {
    return this.fonctions.find(f => Number(f.id) === Number(this.selectedFonctionId))?.name;
  }

  changerMode(nouveauMode: SimulationMode): void {
    if (this.mode === nouveauMode) return;
    this.mode = nouveauMode;
    this.lancerSimulation();
  }

  majSalaireBase(): void {
    this.lancerSimulation();
  }

  getTauxReductionCharge(charges: number): number {
    if (charges === 1) return 8;
    if (charges === 2) return 10;
    if (charges === 3) return 12;
    if (charges >= 4) return 14;
    return 0;
  }

  lancerSimulation(): void {
    if (this.mode === 'NET_VERS_SURSALAIRE' && (!this.netCibleSouhaite || this.netCibleSouhaite <= 0)) {
      this.resultat = null;
      this.messageErreur = '';
      this.enChargement = false;
      return;
    }

    this.enChargement = true;
    this.chargementSalaireBase = true;
    this.messageErreur = '';

    const req: SimulationRequest = {
      mode: this.mode,
      categorieId: this.selectedCategorieId,
      categorieCode: this.selectedCategorie,
      echelonId: this.selectedEchelonId,
      echelonCode: String(this.selectedEchelon),
      gradeId: this.selectedGradeId,
      gradeCode: this.selectedGrade,
      salaireBaseManuel: undefined,
      nombrePersonnesCharge: this.nombrePersonnesCharge,
      netCibleSouhaite: this.mode === 'NET_VERS_SURSALAIRE' ? (this.netCibleSouhaite || 0) : undefined,
      surSalairePropose: this.mode === 'SURSALAIRE_VERS_NET' ? (this.surSalairePropose || 0) : undefined,
      indemniteLogement: this.indemnitesModifieesManuellement ? (this.indemniteLogement || 0) : undefined,
      indemniteTransport: this.indemnitesModifieesManuellement ? (this.indemniteTransport || 0) : undefined,
      indemniteFonction: this.indemnitesModifieesManuellement ? (this.indemniteFonction || 0) : undefined,
      indemniteCaisse: this.indemnitesModifieesManuellement ? (this.indemniteCaisse || 0) : undefined,
      indemniteSujetion: this.indemnitesModifieesManuellement ? (this.indemniteSujetion || 0) : undefined,
      indemniteCashPoint: this.indemnitesModifieesManuellement ? (this.indemniteCashPoint || 0) : undefined,
      autresIndemnites: this.indemnitesModifieesManuellement ? (this.autresIndemnites || 0) : undefined,
      emploiId: this.selectedEmploiId ? Number(this.selectedEmploiId) : undefined,
      emploiNom: this.getNomEmploiSelectionne(),
      fonctionId: this.selectedFonctionId ? Number(this.selectedFonctionId) : undefined,
      fonctionNom: this.getNomFonctionSelectionnee(),
      vehiculeFourni: this.vehiculeFourni,
      logementFourni: this.logementFourni
    };

    this.simulationService.simuler(req).subscribe({
      next: (res) => {
        this.resultat = res;
        this.enChargement = false;
        this.chargementSalaireBase = false;
        if (res) {
          if (res.salaireBase != null && res.salaireBase > 0) {
            this.salaireBaseAffiche = res.salaireBase;
          }
          if (!this.indemnitesModifieesManuellement) {
            this.indemniteLogement = res.indemniteLogement || 0;
            this.indemniteTransport = res.indemniteTransport || 0;
            this.indemniteFonction = res.indemniteFonction || 0;
            this.indemniteCaisse = res.indemniteCaisse || 0;
            this.indemniteSujetion = res.indemniteSujetion || 0;
            this.indemniteCashPoint = res.indemniteCashPoint || 0;
            this.autresIndemnites = res.autresIndemnites || 0;
            this.indemnitesDetails = res.detailsIndemnites || [];
          }
        }
      },
      error: (err) => {
        console.error('Erreur simulation:', err);
        this.messageErreur = err?.error?.message || 'Impossible de calculer la simulation. Vérifiez les paramètres de calcul.';
        this.enChargement = false;
        this.chargementSalaireBase = false;
      }
    });
  }

  imprimerFiche(): void {
    window.print();
  }

  formatFcfa(valeur: number | undefined | null): string {
    if (valeur == null) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(valeur).replace(/\s/g, '\u00A0') + ' FCFA';
  }
}
