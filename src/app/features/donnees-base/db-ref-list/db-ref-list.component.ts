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

// Component for Reference Data and Salary Grid List View
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
  departements:   RefItem[] = [];   // pour Direction et Service
  directions:     RefItem[] = [];   // pour Service uniquement
  grades:         RefItem[] = [];   // pour Grille salariale et Paramétrage indemnité
  typesIndemnite: RefItem[] = [];   // pour Paramétrage indemnité
  fonctions:      RefItem[] = [];   // pour Paramétrage indemnité
  categoriesList: string[]  = ['Catégorie I', 'Catégorie II', 'Catégorie III', 'Catégorie IV', 'Catégorie V', 'Catégorie VI', 'Catégorie VII', 'Catégorie VIII', 'Catégorie IX'];

  categories = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  echelons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  constructor(
    private route: ActivatedRoute,
    private moduleNav: ModuleNavService,
    private dbRefService: DbRefService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      code:          ['', [Validators.required, Validators.maxLength(25)]],
      libelle:       ['', [Validators.maxLength(150)]],
      description:   [''],
      actif:         [true],
      montant:       [0, [Validators.min(0)]],  // grille salariale (base mensuelle)
      departementId: [null],                     // pour Direction et Service
      directionId:   [null],                     // pour Service uniquement
      echelle:       [''],                       // pour Grille salariale
      echellon:      [''],                       // pour Grille salariale
      typeIndemnite: [''],                       // pour Paramétrage indemnité
      fonction:      [''],                       // pour Paramétrage indemnité
      grade:         [''],                       // pour Paramétrage indemnité
      categorie:     [''],                       // pour Paramétrage indemnité
      taux:          [0, [Validators.min(0)]]    // pour Paramétrage indemnité
    });
  }

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.route.data.subscribe(data => {
      this.title  = data['title']  ?? '';
      this.icon   = data['icon']   ?? 'list';
      this.type   = data['type']   ?? '';
      if (this.type === 'grille-salariale') {
        this.displayedColumns = ['code', 'libelle', 'echelle', 'echellon', 'description', 'montant', 'actions'];
      } else if (this.type === 'param-indemnite') {
        this.displayedColumns = ['code', 'typeIndemnite', 'fonction', 'grade', 'categorie', 'taux', 'actif', 'actions'];
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
    if (this.type === 'grille-salariale' || this.type === 'param-indemnite') {
      this.dbRefService.getItems('grade').subscribe(items => this.grades = items);
    } else {
      this.grades = [];
    }
    if (this.type === 'param-indemnite') {
      this.dbRefService.getItems('type-indemnite').subscribe(items => this.typesIndemnite = items);
      this.dbRefService.getItems('fonction').subscribe(items => this.fonctions = items);
    } else {
      this.typesIndemnite = [];
      this.fonctions = [];
    }
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  openAddDialog(): void {
    this.isEditing = false;
    this.editingItem = null;
    this.formGroup.reset({
      code: '', libelle: '', description: '', actif: true,
      montant: 0, departementId: null, directionId: null, echelle: '', echellon: '',
      typeIndemnite: '', fonction: '', grade: '', categorie: '', taux: 0
    });
    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '560px' });
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
      echellon:      item.echellon || '',
      typeIndemnite: item.typeIndemnite || item.libelle || '',
      fonction:      item.fonction || '',
      grade:         item.grade || '',
      categorie:     item.categorie || '',
      taux:          item.taux ?? item.montant ?? 0
    });
    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '560px' });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;

    const v = this.formGroup.getRawValue();
    const item: RefItem = {
      id:            this.editingItem?.id,
      code:          v.code,
      libelle:       v.typeIndemnite || v.libelle || 'Indemnité',
      description:   v.description || `Fonction: ${v.fonction || '-'}, Grade: ${v.grade || '-'}, Cat: ${v.categorie || '-'}`,
      actif:         v.actif ?? true,
      montant:       v.taux || v.montant || 0,
      departementId: v.departementId || undefined,
      directionId:   v.directionId   || undefined,
      echelle:       v.echelle || undefined,
      echellon:      v.echellon || undefined,
      typeIndemnite: v.typeIndemnite || undefined,
      fonction:      v.fonction || undefined,
      grade:         v.grade || undefined,
      categorie:     v.categorie || undefined,
      taux:          v.taux || v.montant || undefined
    };

    if (this.isEditing && this.editingItem) {
      this.dbRefService.updateItem(this.type, this.editingItem.code, item).subscribe({
        next: (items) => {
          this.dataSource.data = items;
          this.dialogRef.close();
        },
        error: (err)  => { alert(err.message || 'Erreur lors de la modification.'); }
      });
    } else {
      this.dbRefService.addItem(this.type, item).subscribe({
        next: (items) => {
          this.dataSource.data = items;
          this.dialogRef.close();
        },
        error: (err)  => { alert(err.message || 'Erreur lors de la création.'); }
      });
    }
  }

  deleteItem(item: RefItem, event: Event): void {
    event.stopPropagation();
    const msg = `⚠️ Attention - Conflit potentiel :\n\nL'élément "${item.libelle}" (${item.code}) risque d'être déjà utilisé dans l'application.\n\nIl est vivement recommandé de le DÉSACTIVER plutôt que de le supprimer pour éviter toute rupture de données.\n\nVoulez-vous quand même supprimer cet élément ?`;
    if (confirm(msg)) {
      this.dbRefService.deleteItem(this.type, item.code).subscribe({
        next: (items) => {
          this.dataSource.data = items;
        },
        error: (err)  => { alert(err.message || 'Erreur lors de la suppression.'); }
      });
    }
  }

  toggleStatus(item: RefItem, event: Event): void {
    event.stopPropagation();
    if (item.actif) {
      const msg = `⚠️ Attention - Conflit d'utilisation :\n\nL'élément "${item.libelle}" (${item.code}) va être désactivé.\n\nUne fois désactivé, il n'apparaîtra plus dans les sélecteurs pour les nouvelles créations. Les enregistrements existants conserveront cette donnée.\n\nConfirmez-vous la désactivation ?`;
      if (!confirm(msg)) return;
    }
    this.dbRefService.toggleItemStatus(this.type, item.code).subscribe({
      next: (items) => {
        this.dataSource.data = items;
      }
    });
  }

  get totalActifs(): number   { return this.dataSource.data.filter(r => r.actif).length; }
  get totalInactifs(): number { return this.dataSource.data.filter(r => !r.actif).length; }
}
