import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../core/models/app-module.model';
import { DbRefService, RefItem } from '../services/db-ref.service';

@Component({
  selector: 'app-db-ref-list',
  templateUrl: './db-ref-list.component.html',
  styleUrls: ['./db-ref-list.component.scss'],
  standalone: false
})
export class DbRefListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogTpl') dialogTpl!: TemplateRef<any>;

  module = APP_MODULES.find(m => m.id === 'donnees-base')!;
  title  = '';
  icon   = 'list';
  type   = '';

  displayedColumns = ['code', 'libelle', 'description', 'actif', 'actions'];
  dataSource = new MatTableDataSource<RefItem>([]);
  searchQuery = '';

  formGroup!: FormGroup;
  dialogRef: any;
  isEditing = false;
  editingItem: RefItem | null = null;

  // Listes pour les selects hiérarchiques
  departements: RefItem[] = [];   // pour Direction et Service
  directions:   RefItem[] = [];   // pour Service uniquement

  // --- Gestion spécifique de la grille salariale ---
  activeTab = 'matrix'; // 'matrix' ou 'flat'
  categories = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  echelons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  
  // Contient la correspondance [echelon][catégorie] -> RefItem
  matrixData: Record<number, Record<string, RefItem>> = {};
  horsCategorieList: RefItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private moduleNav: ModuleNavService,
    private dbRefService: DbRefService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      code:          ['', [Validators.required, Validators.maxLength(25)]],
      libelle:       ['', [Validators.required, Validators.maxLength(150)]],
      description:   [''],
      actif:         [true],
      montant:       [0, [Validators.min(0)]],  // grille salariale
      departementId: [null],                     // pour Direction et Service
      directionId:   [null],                     // pour Service uniquement
      echelle:       [''],                       // pour Grille salariale
      echellon:      ['']                        // pour Grille salariale
    });
  }

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.route.data.subscribe(data => {
      this.title  = data['title']  ?? '';
      this.icon   = data['icon']   ?? 'list';
      this.type   = data['type']   ?? '';
      if (this.type === 'grille-salariale') {
        this.displayedColumns = ['code', 'libelle', 'description', 'actif', 'montant', 'actions'];
        this.activeTab = 'matrix';
      } else {
        this.displayedColumns = ['code', 'libelle', 'description', 'actif', 'actions'];
      }
      this.searchQuery = '';
      this.loadHierarchyData();
      this.loadData();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(): void {
    this.dbRefService.getItems(this.type).subscribe({
      next: (items) => {
        this.dataSource.data = items;
        if (this.type === 'grille-salariale') {
          this.updateMatrix();
        }
      },
      error: (err)  => { console.error('Erreur chargement', this.type, err); }
    });
  }

  loadHierarchyData(): void {
    if (this.type === 'direction' || this.type === 'service') {
      this.dbRefService.getItems('departement').subscribe(items => this.departements = items);
    } else {
      this.departements = [];
    }
    if (this.type === 'service') {
      this.dbRefService.getItems('direction').subscribe(items => this.directions = items);
    } else {
      this.directions = [];
    }
  }

  // Organise les données plates en une matrice à deux dimensions [Echelon][Catégorie]
  updateMatrix(): void {
    this.matrixData = {};
    this.horsCategorieList = [];

    this.echelons.forEach(ech => {
      this.matrixData[ech] = {};
    });

    this.dataSource.data.forEach(item => {
      const cat = (item.libelle || '').trim().toUpperCase();
      const echNum = Number(item.echellon);

      if (cat === 'HORS CATEGORIE' || cat === 'HORS CATÉGORIE' || cat === 'HORS CAT' || cat === 'HC') {
        this.horsCategorieList.push(item);
      } else if (!isNaN(echNum) && echNum >= 1 && echNum <= 16) {
        // Associer à la colonne correspondante (I, II, etc.)
        const matchingCat = this.categories.find(c => c === cat);
        if (matchingCat) {
          this.matrixData[echNum][matchingCat] = item;
        } else {
          // Fallback au cas où l'écriture varie (ex: "CAT I" au lieu de "I")
          const cleanCat = cat.replace('CAT', '').trim();
          const fallbackCat = this.categories.find(c => c === cleanCat);
          if (fallbackCat) {
            this.matrixData[echNum][fallbackCat] = item;
          }
        }
      }
    });

    // Trier Hors Catégorie par échelon
    this.horsCategorieList.sort((a, b) => Number(a.echellon) - Number(b.echellon));
  }

  getExperienceRange(echelon: number): string {
    const ranges: Record<number, string> = {
      1: '<= 4 ans',
      2: '5-6 ans',
      3: '7-8 ans',
      4: '9-10 ans',
      5: '11-12 ans',
      6: '13-14 ans',
      7: '15-16 ans',
      8: '17-18 ans',
      9: '19-20 ans',
      10: '21-22 ans',
      11: '23-24 ans',
      12: '25-26 ans',
      13: '27-28 ans',
      14: '29-30 ans',
      15: '31-32 ans',
      16: '33-34 ans'
    };
    return ranges[echelon] || '';
  }

  getHorsCategorieExperienceRange(echelon: number | string | undefined): string {
    if (echelon === undefined || echelon === null) return '';
    const echNum = Number(echelon);
    if (echNum === 5) return 'Inférieure ou égale à 10 ans';
    if (echNum >= 6 && echNum <= 16) {
      const min = 11 + (echNum - 6) * 2;
      const max = min + 1;
      return `${min}-${max} ans`;
    }
    if (echNum === 17) return 'Plus de 32 ans';
    return '';
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  openAddDialog(): void {
    this.isEditing = false;
    this.editingItem = null;
    this.formGroup.reset({
      code: '', libelle: '', description: '', actif: true,
      montant: 0, departementId: null, directionId: null, echelle: '', echellon: ''
    });
    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '520px' });
  }

  // Ouvrir le dialogue prérempli pour une case spécifique de la grille
  openAddCellDialog(echelon: number, category: string): void {
    this.isEditing = false;
    this.editingItem = null;
    const expRange = this.getExperienceRange(echelon);
    
    // Code par défaut, ex: GS-CAT-I-ECH-1
    const defaultCode = `GS-C${category}-E${echelon}`;

    this.formGroup.reset({
      code: defaultCode,
      libelle: category,
      description: expRange,
      actif: true,
      montant: 0,
      departementId: null,
      directionId: null,
      echelle: expRange,
      echellon: String(echelon)
    });
    
    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '520px' });
  }

  // Ouvrir le dialogue prérempli pour le Hors Catégorie
  openAddHorsCatDialog(): void {
    this.isEditing = false;
    this.editingItem = null;
    
    // Proposer l'échelon suivant disponible pour Hors Catégorie
    const maxEch = this.horsCategorieList.length > 0
      ? Math.max(...this.horsCategorieList.map(h => Number(h.echellon) || 0))
      : 4;
    const nextEch = maxEch + 1 > 17 ? 17 : maxEch + 1;
    const expRange = this.getHorsCategorieExperienceRange(nextEch);

    this.formGroup.reset({
      code: `GS-HC-E${nextEch}`,
      libelle: 'Hors Catégorie',
      description: expRange,
      actif: true,
      montant: 0,
      departementId: null,
      directionId: null,
      echelle: expRange,
      echellon: String(nextEch)
    });

    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '520px' });
  }

  openEditDialog(item: RefItem): void {
    this.isEditing = true;
    this.editingItem = item;
    this.formGroup.reset({
      code:          item.code,
      libelle:       item.libelle,
      description:   item.description,
      actif:         item.actif,
      montant:       item.montant ?? 0,
      departementId: item.departementId ?? null,
      directionId:   item.directionId   ?? null,
      echelle:       item.echelle || '',
      echellon:      item.echellon || ''
    });
    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '520px' });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;

    const v = this.formGroup.getRawValue();
    const item: RefItem = {
      id:            this.editingItem?.id,
      code:          v.code,
      libelle:       v.libelle,
      description:   v.description || '',
      actif:         v.actif ?? true,
      montant:       v.montant ?? 0,
      departementId: v.departementId || undefined,
      directionId:   v.directionId   || undefined,
      echelle:       v.echelle || undefined,
      echellon:      v.echellon || undefined
    };

    if (this.isEditing && this.editingItem) {
      this.dbRefService.updateItem(this.type, this.editingItem.code, item).subscribe({
        next: (items) => {
          this.dataSource.data = items;
          if (this.type === 'grille-salariale') this.updateMatrix();
          this.dialogRef.close();
        },
        error: (err)  => { alert(err.message || 'Erreur lors de la modification.'); }
      });
    } else {
      this.dbRefService.addItem(this.type, item).subscribe({
        next: (items) => {
          this.dataSource.data = items;
          if (this.type === 'grille-salariale') this.updateMatrix();
          this.dialogRef.close();
        },
        error: (err)  => { alert(err.message || 'Erreur lors de la création.'); }
      });
    }
  }

  deleteItem(item: RefItem, event: Event): void {
    event.stopPropagation();
    if (confirm(`Voulez-vous vraiment supprimer l'élément "${item.libelle}" ?`)) {
      this.dbRefService.deleteItem(this.type, item.code).subscribe({
        next: (items) => {
          this.dataSource.data = items;
          if (this.type === 'grille-salariale') this.updateMatrix();
        },
        error: (err)  => { alert(err.message || 'Erreur lors de la suppression.'); }
      });
    }
  }

  toggleStatus(item: RefItem, event: Event): void {
    event.stopPropagation();
    this.dbRefService.toggleItemStatus(this.type, item.code).subscribe({
      next: (items) => {
        this.dataSource.data = items;
        if (this.type === 'grille-salariale') this.updateMatrix();
      }
    });
  }

  get totalActifs(): number   { return this.dataSource.data.filter(r => r.actif).length; }
  get totalInactifs(): number { return this.dataSource.data.filter(r => !r.actif).length; }
}
