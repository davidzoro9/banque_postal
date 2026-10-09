import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimulationService } from '../services/simulation.service';
import { DbRefService, RefItem } from '../../donnees-base/services/db-ref.service';
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

  // Données de la Grille Salariale de Paramètres Généraux
  salaireBaseAffiche = 203834;
  grillesParametresGeneraux: RefItem[] = [];
  categoriesParametresGeneraux: RefItem[] = [];
  echelonsParametresGeneraux: RefItem[] = [];
  private subscriptions: Subscription = new Subscription();

  // Résultat du calcul
  resultat: SimulationResult | null = null;
  enChargement = false;
  messageErreur = '';

  // Options de classification
  categories: CategorieOption[] = [
    { code: '1', libelle: '1ère Catégorie (Agents d\'exécution)', groupe: 'GROUPE I' },
    { code: '2', libelle: '2ème Catégorie (Agents d\'exécution)', groupe: 'GROUPE I' },
    { code: '3', libelle: '3ème Catégorie (Employés)', groupe: 'GROUPE I' },
    { code: '4', libelle: '4ème Catégorie (Employés qualifiés)', groupe: 'GROUPE I' },
    { code: '5', libelle: '5ème Catégorie (Employés qualifiés)', groupe: 'GROUPE I' },
    { code: '6', libelle: '6ème Catégorie (Employés très qualifiés)', groupe: 'GROUPE I' },
    { code: '7', libelle: '7ème Catégorie (Employés très qualifiés)', groupe: 'GROUPE I' },
    { code: 'I', libelle: 'Classe I (Agents de Maîtrise)', groupe: 'GROUPE II' },
    { code: 'II', libelle: 'Classe II (Maîtrise & Cadres Moyens)', groupe: 'GROUPE II' },
    { code: 'III', libelle: 'Classe III (Maîtrise & Cadres Moyens)', groupe: 'GROUPE II' },
    { code: 'IV', libelle: 'Classe IV (Cadres Moyens confirmés)', groupe: 'GROUPE II' },
    { code: 'V', libelle: 'Classe V (Cadres)', groupe: 'GROUPE III' },
    { code: 'VI', libelle: 'Classe VI (Cadres Supérieurs)', groupe: 'GROUPE III' },
    { code: 'VII', libelle: 'Classe VII (Cadres Supérieurs)', groupe: 'GROUPE III' },
    { code: 'VIII', libelle: 'Classe VIII (Cadres Dirigeants)', groupe: 'GROUPE III' }
  ];

  echelons = Array.from({ length: 15 }, (_, i) => i + 1);

  constructor(
    private simulationService: SimulationService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.chargerReferences();
    this.actualiserIndemnitesConventionnelles();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  chargerReferences(): void {
    this.chargementRefs = true;

    // 1. Chargement de la grille salariale enregistrée dans les Paramètres Généraux
    const subGrille = this.dbRefService.getItems('grille-salariale').subscribe({
      next: (items) => {
        this.grillesParametresGeneraux = items || [];
        this.majSalaireBase();
      },
      error: (e) => console.warn('Erreur chargement grilles Paramètres Généraux:', e)
    });
    this.subscriptions.add(subGrille);

    // 2. Écoute dynamique de toute modification dans Paramètres Généraux
    const subChanges = this.dbRefService.refChanges$.subscribe((change) => {
      if (change.type === 'grille-salariale') {
        this.dbRefService.getItems('grille-salariale').subscribe((items) => {
          this.grillesParametresGeneraux = items || [];
          this.majSalaireBase();
        });
      }
    });
    this.subscriptions.add(subChanges);

    // 3. Emplois et Fonctions
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

    // 4. Chargement dynamique des Catégories et Échelons depuis la base de données
    const subCat = this.dbRefService.getItems('categorie').subscribe({
      next: (items) => {
        if (items && items.length > 0) {
          this.categories = items.map(c => ({
            code: c.code,
            libelle: c.libelle || c.name || `Catégorie ${c.code}`,
            groupe: c.description || (['1', '2', '3', '4', '5', '6', '7'].includes(c.code) ? 'GROUPE I' : (['I', 'II', 'III', 'IV'].includes(c.code) ? 'GROUPE II' : 'GROUPE III'))
          }));
        }
      },
      error: (e) => console.warn('Erreur chargement categories DB:', e)
    });
    this.subscriptions.add(subCat);

    const subEch = this.dbRefService.getItems('echelon').subscribe({
      next: (items) => {
        if (items && items.length > 0) {
          const parsed = items.map(e => Number(e.code) || Number(e.libelle)).filter(n => !isNaN(n) && n > 0);
          if (parsed.length > 0) {
            this.echelons = Array.from(new Set(parsed)).sort((a, b) => a - b);
          }
        }
      },
      error: (e) => console.warn('Erreur chargement echelons DB:', e)
    });
    this.subscriptions.add(subEch);
  }

  /**
   * Interroge le backend (PostgreSQL + Convention BPBF) pour déduire automatiquement
   * toutes les indemnités statutaires et de poste applicables.
   */
  actualiserIndemnitesConventionnelles(): void {
    this.chargementIndemnites = true;
    this.indemnitesModifieesManuellement = false;

    const req: SimulationRequest = {
      mode: this.mode,
      categorieCode: this.selectedCategorie,
      echelonCode: String(this.selectedEchelon),
      gradeCode: this.selectedGrade,
      emploiId: this.selectedEmploiId ? Number(this.selectedEmploiId) : undefined,
      emploiNom: this.getNomEmploiSelectionne(),
      fonctionId: this.selectedFonctionId ? Number(this.selectedFonctionId) : undefined,
      fonctionNom: this.getNomFonctionSelectionnee(),
      vehiculeFourni: this.vehiculeFourni,
      logementFourni: this.logementFourni
    };

    this.simulationService.getIndemnitesAuto(req).subscribe({
      next: (res: SimulationIndemnitesAuto) => {
        if (res) {
          this.indemniteLogement = res.indemniteLogement || 0;
          this.indemniteTransport = res.indemniteTransport || 0;
          this.indemniteFonction = res.indemniteFonction || 0;
          this.indemniteCaisse = res.indemniteCaisse || 0;
          this.indemniteSujetion = res.indemniteSujetion || 0;
          this.indemniteCashPoint = res.indemniteCashPoint || 0;
          this.autresIndemnites = res.autresIndemnites || 0;
          this.indemnitesDetails = res.details || [];
        }
        this.chargementIndemnites = false;
        this.lancerSimulation();
      },
      error: (err) => {
        console.warn('Erreur récupération indemnités auto:', err);
        this.chargementIndemnites = false;
        this.lancerSimulation();
      }
    });
  }

  onEmploiChange(): void {
    this.actualiserIndemnitesConventionnelles();
  }

  onFonctionChange(): void {
    const f = this.fonctions.find(item => Number(item.id) === Number(this.selectedFonctionId));
    if (f && f.name) {
      const u = f.name.toUpperCase();
      if (u.includes('DIRECTEUR GÉNÉRAL')) {
        this.selectedCategorie = 'VIII';
        this.selectedGrade = 'GROUPE III';
        this.majSalaireBase();
      } else if (u.includes('DIRECTEUR')) {
        this.selectedCategorie = 'VI';
        this.selectedGrade = 'GROUPE III';
        this.majSalaireBase();
      } else if (u.includes("CHEF D'AGENCE")) {
        this.selectedCategorie = 'IV';
        this.selectedGrade = 'GROUPE II';
        this.majSalaireBase();
      }
    }
    this.actualiserIndemnitesConventionnelles();
  }

  onAvantageChange(): void {
    this.actualiserIndemnitesConventionnelles();
  }

  onClassificationChange(): void {
    const catObj = this.categories.find(c => c.code === this.selectedCategorie);
    if (catObj) {
      this.selectedGrade = catObj.groupe;
    }
    this.majSalaireBase();
    this.actualiserIndemnitesConventionnelles();
  }

  onIndemniteManuelleChange(): void {
    this.indemnitesModifieesManuellement = true;
    this.lancerSimulation();
  }

  reinitialiserIndemnites(): void {
    this.actualiserIndemnitesConventionnelles();
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
    const rawCat = (this.selectedCategorie || '').trim().toUpperCase();
    const echNum = Number(this.selectedEchelon || 1);

    // Mappage conventionnel standard
    const romanToCl: Record<string, string> = {
      '1': 'C1', '2': 'C2', '3': 'C3', '4': 'C4', '5': 'C5', '6': 'C6', '7': 'C7',
      'I': 'CL1', 'II': 'CL2', 'III': 'CL3', 'IV': 'CL4',
      'V': 'CL5', 'VI': 'CL6', 'VII': 'CL7', 'VIII': 'CL8'
    };
    const targetCl = romanToCl[rawCat] || rawCat;
    const targetGrade = `${targetCl}E${String(echNum).padStart(2, '0')}`;

    let matchTrouve: RefItem | undefined;

    // 1. Recherche directe dans la Grille Salariale de Paramètres Généraux
    if (this.grillesParametresGeneraux && this.grillesParametresGeneraux.length > 0) {
      matchTrouve = this.grillesParametresGeneraux.find(g => {
        // A. Match par gradeCode complet (ex: "CL2E02")
        const gCode = (g.code || g.grade || g.libelle || '').toUpperCase().trim();
        if (gCode === targetGrade) return true;

        // B. Vérification du numéro d'échelon
        const gEchNum = Number(String(g.echellon || g.echelonCode || g.echelonLibelle || '').replace(/\D+/g, ''));
        if (gEchNum !== echNum) return false;

        // C. Vérification de la catégorie
        const gCat = (g.categorie || g.categorieCode || '').toUpperCase().trim();
        const gLib = (g.categorieLibelle || '').toUpperCase().trim();

        if (gCat === targetCl || gCat === rawCat) return true;
        if (gCode.startsWith(targetCl)) return true;

        if (rawCat === 'II' && (gLib.includes('CLASSE II') || gCat.includes('CL2'))) return true;
        if (rawCat === 'I' && (gLib.includes('CLASSE I') && !gLib.includes('CLASSE II') && !gLib.includes('CLASSE III') && !gLib.includes('CLASSE IV'))) return true;
        if (rawCat === 'III' && gLib.includes('CLASSE III')) return true;
        if (rawCat === 'IV' && gLib.includes('CLASSE IV')) return true;
        if (rawCat === 'V' && (gLib.includes('CLASSE V') && !gLib.includes('CLASSE VI') && !gLib.includes('CLASSE VII') && !gLib.includes('CLASSE VIII'))) return true;
        if (rawCat === 'VI' && gLib.includes('CLASSE VI')) return true;
        if (rawCat === 'VII' && gLib.includes('CLASSE VII')) return true;
        if (rawCat === 'VIII' && gLib.includes('CLASSE VIII')) return true;

        // Catégories 1 à 7
        if (['1','2','3','4','5','6','7'].includes(rawCat)) {
          if (gLib.includes(rawCat + 'ÈRE') || gLib.includes(rawCat + 'ÈME') || gCat === 'C' + rawCat) return true;
        }

        return false;
      });
    }

    if (matchTrouve && matchTrouve.montant != null && matchTrouve.montant > 0) {
      this.salaireBaseAffiche = Number(matchTrouve.montant);
      this.selectedCategorieId = matchTrouve.categorieId ? Number(matchTrouve.categorieId) : undefined;
      this.selectedEchelonId = matchTrouve.echelonId ? Number(matchTrouve.echelonId) : undefined;
      this.selectedGradeId = matchTrouve.gradeId ? Number(matchTrouve.gradeId) : undefined;
      return;
    }

    // 2. Appel de confirmation direct par l'API REST lookup si pas encore présent dans le cache
    this.simulationService.lookupGrille(rawCat, echNum).subscribe({
      next: (g) => {
        if (g && (g.basicSalary || g.salaireBase)) {
          const val = Number(g.basicSalary || g.salaireBase);
          if (val > 0) {
            this.salaireBaseAffiche = val;
            if (g.categorieId) this.selectedCategorieId = Number(g.categorieId);
            if (g.echelonId) this.selectedEchelonId = Number(g.echelonId);
            if (g.gradeId) this.selectedGradeId = Number(g.gradeId);
          }
        }
      },
      error: () => {}
    });
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
    this.messageErreur = '';

    const req: SimulationRequest = {
      mode: this.mode,
      categorieId: this.selectedCategorieId,
      categorieCode: this.selectedCategorie,
      echelonId: this.selectedEchelonId,
      echelonCode: String(this.selectedEchelon),
      gradeId: this.selectedGradeId,
      gradeCode: this.selectedGrade,
      salaireBaseManuel: this.salaireBaseAffiche,
      nombrePersonnesCharge: this.nombrePersonnesCharge,
      netCibleSouhaite: this.mode === 'NET_VERS_SURSALAIRE' ? (this.netCibleSouhaite || 0) : undefined,
      surSalairePropose: this.mode === 'SURSALAIRE_VERS_NET' ? (this.surSalairePropose || 0) : undefined,
      indemniteLogement: this.indemniteLogement || 0,
      indemniteTransport: this.indemniteTransport || 0,
      indemniteFonction: this.indemniteFonction || 0,
      indemniteCaisse: this.indemniteCaisse || 0,
      indemniteSujetion: this.indemniteSujetion || 0,
      indemniteCashPoint: this.indemniteCashPoint || 0,
      autresIndemnites: this.autresIndemnites || 0,
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
        if (res && res.salaireBase) {
          this.salaireBaseAffiche = res.salaireBase;
        }
        this.enChargement = false;
      },
      error: (err) => {
        console.error('Erreur simulation:', err);
        this.messageErreur = err?.error?.message || 'Impossible de calculer la simulation. Vérifiez les paramètres de calcul.';
        this.enChargement = false;
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
