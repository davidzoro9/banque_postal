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

  // Grille salariale - listes par grade
  groupe1Classifications = [
    '1ÈRE CATEGORIE', '2ÈME CATEGORIE', '3ÈME CATEGORIE', '4ÈME CATEGORIE',
    '5ÈME CATEGORIE', '6ÈME CATEGORIE', '7ÈME CATEGORIE'
  ];
  groupe2Classifications = [
    'CLASSE I', 'CLASSE II', 'CLASSE III', 'CLASSE IV'
  ];
  groupe3Classifications = [
    'CLASSE V', 'CLASSE VI', 'CLASSE VII', 'CLASSE VIII'
  ];
  echelonsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  get allClassifications(): string[] {
    return [...this.groupe1Classifications, ...this.groupe2Classifications, ...this.groupe3Classifications];
  }

  getSalaryItem(classification: string, echelon: number): RefItem | undefined {
    return this.dataSource.data.find(
      item => (item.categorie === classification || item.code === classification)
           && (item.echellon === String(echelon))
    );
  }

  getSalary(classification: string, echelon: number): number | null {
    const item = this.getSalaryItem(classification, echelon);
    return item ? (item.montant ?? null) : null;
  }

  getSalaryFormatted(classification: string, echelon: number): string {
    const val = this.getSalary(classification, echelon);
    return val !== null ? this.formatMontant(val) : '-';
  }

  formatMontant(value: number): string {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value).replace(/\s/g, ' ');
  }

  deleteCellEntry(classification: string, echelon: number): void {
    const item = this.getSalaryItem(classification, echelon);
    if (!item) return;
    const msg = `Supprimer le salaire de ${classification} - Échelon ${echelon} ?\n\nCette action est irréversible.`;
    if (confirm(msg)) {
      this.dbRefService.deleteItem(this.type, item.code + '_' + echelon).subscribe({
        next: (items) => { this.dataSource.data = items; },
        error: () => {
          // Si l'API échoue, on supprime localement
          this.dataSource.data = this.dataSource.data.filter(
            i => !((i.categorie === classification || i.code === classification)
                && i.echellon === String(echelon))
          );
        }
      });
    }
  }

  openCellEdit(classification: string, echelon: number): void {
    let item = this.getSalaryItem(classification, echelon);
    const groupe = this.groupe1Classifications.includes(classification) ? 'GRADE I' :
                   (this.groupe2Classifications.includes(classification) ? 'GRADE II' : 'GRADE III');
    if (!item) {
      item = {
        code: classification,
        libelle: groupe,
        grade: groupe,
        categorie: classification,
        echelle: groupe,
        echellon: String(echelon),
        description: `${groupe} (${classification}) - Échelon ${echelon}`,
        montant: 0,
        actif: true
      };
    } else {
      item = {
        ...item,
        code: classification,
        categorie: classification,
        grade: item.grade || item.libelle || groupe,
        echellon: String(echelon)
      };
    }
    this.openEditDialog(item);
  }

  viewMode: 'list' | 'matrix' = 'list';

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
        this.displayedColumns = ['grade', 'categorie', 'echellon', 'montant', 'actif', 'actions'];
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

  getGradeName(row: RefItem): string {
    const cat = row.categorie || row.code || '';
    if (this.groupe1Classifications.includes(cat)) return 'GRADE I';
    if (this.groupe2Classifications.includes(cat)) return 'GRADE II';
    if (this.groupe3Classifications.includes(cat)) return 'GRADE III';
    return row.grade || row.libelle || row.echelle || 'GRADE I';
  }

  loadData(): void {
    if (this.type === 'grille-salariale') {
      const stored = localStorage.getItem('ref_grille-salariale');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!Array.isArray(parsed) || parsed.length !== 225) {
            localStorage.removeItem('ref_grille-salariale');
          }
        } catch (e) {
          localStorage.removeItem('ref_grille-salariale');
        }
      }
    }
    this.dbRefService.getItems(this.type).subscribe({
      next: (items) => {
        this.dataSource.data = items;
        if (this.type === 'grille-salariale' && this.paginator) {
          this.paginator.pageSize = 250;
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

    if (this.type === 'grille-salariale') {
      const catVal = item.categorie || item.code || '';
      const gradeVal = item.grade || (this.groupe1Classifications.includes(catVal) ? 'GRADE I' : (this.groupe2Classifications.includes(catVal) ? 'GRADE II' : 'GRADE III'));

      this.formGroup.reset({
        code:          catVal,
        libelle:       gradeVal,
        description:   item.description,
        actif:         item.actif,
        montant:       item.montant ?? 0,
        departementId: item.departementId ?? null,
        directionId:   item.directionId   ?? null,
        echelle:       gradeVal,
        echellon:      item.echellon || '',
        typeIndemnite: '',
        fonction:      '',
        grade:         gradeVal,
        categorie:     catVal,
        taux:          0
      });
    } else if (this.type === 'param-indemnite') {
      this.formGroup.reset({
        code:          item.code || '',
        libelle:       item.typeIndemnite || item.libelle || '',
        description:   item.description || '',
        actif:         item.actif ?? true,
        montant:       item.montant ?? 0,
        departementId: null,
        directionId:   null,
        echelle:       '',
        echellon:      '',
        typeIndemnite: item.typeIndemnite || item.libelle || '',
        fonction:      item.fonction || '',
        grade:         item.grade || '',
        categorie:     item.categorie || '',
        taux:          item.taux ?? item.montant ?? 0
      });
    } else {
      this.formGroup.reset({
        code:          item.code || '',
        libelle:       item.libelle || '',
        description:   item.description || '',
        actif:         item.actif ?? true,
        montant:       item.montant ?? 0,
        departementId: item.departementId ?? null,
        directionId:   item.directionId   ?? null,
        echelle:       item.echelle || '',
        echellon:      item.echellon || '',
        typeIndemnite: '',
        fonction:      '',
        grade:         '',
        categorie:     '',
        taux:          0
      });
    }

    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '560px' });
  }

  onSubmit(): void {
    const v = this.formGroup.getRawValue();

    let item: RefItem;

    if (this.type === 'grille-salariale') {
      const catCode = v.categorie || v.code || this.editingItem?.code || '';
      const gradeVal = v.grade || v.libelle || 'GRADE I';
      item = {
        id:            this.editingItem?.id,
        code:          catCode,
        libelle:       gradeVal,
        description:   `${gradeVal} (${catCode}) - Échelon ${v.echellon || 1}`,
        actif:         v.actif ?? true,
        montant:       Number(v.montant ?? v.taux ?? 0),
        echelle:       gradeVal,
        echellon:      v.echellon ? String(v.echellon) : (this.editingItem?.echellon ? String(this.editingItem.echellon) : '1'),
        grade:         gradeVal,
        categorie:     catCode
      };
    } else if (this.type === 'param-indemnite') {
      item = {
        id:            this.editingItem?.id,
        code:          v.code || this.editingItem?.code || `PI-${Date.now()}`,
        libelle:       v.typeIndemnite || v.libelle || 'Indemnité',
        description:   `Fonction: ${v.fonction || '-'}, Grade: ${v.grade || '-'}, Cat: ${v.categorie || '-'}`,
        actif:         v.actif ?? true,
        montant:       Number(v.taux ?? v.montant ?? 0),
        typeIndemnite: v.typeIndemnite || v.libelle || '',
        fonction:      v.fonction || '',
        grade:         v.grade || '',
        categorie:     v.categorie || '',
        taux:          Number(v.taux ?? v.montant ?? 0)
      };
    } else {
      if (!v.code || !v.libelle) {
        alert('Le code et le libellé sont obligatoires.');
        return;
      }
      item = {
        id:            this.editingItem?.id,
        code:          v.code,
        libelle:       v.libelle,
        description:   v.description || '',
        actif:         v.actif ?? true,
        montant:       v.montant ? Number(v.montant) : undefined,
        departementId: v.departementId || undefined,
        directionId:   v.directionId   || undefined
      };
    }

    if (this.isEditing && this.editingItem) {
      this.dbRefService.updateItem(this.type, this.editingItem.code, item).subscribe({
        next: (items) => {
          this.dataSource.data = items;
          if (this.type === 'grille-salariale' && this.paginator) {
            this.paginator.pageSize = 250;
          }
          this.dialogRef.close();
        },
        error: (err)  => { alert(err.message || 'Erreur lors de la modification.'); }
      });
    } else {
      this.dbRefService.addItem(this.type, item).subscribe({
        next: (items) => {
          this.dataSource.data = items;
          if (this.type === 'grille-salariale' && this.paginator) {
            this.paginator.pageSize = 250;
          }
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
