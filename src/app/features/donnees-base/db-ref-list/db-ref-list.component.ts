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
import { EmployeeService } from '../../grh/employes/services/employee.service';

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
  agences:        RefItem[] = [];   // pour Direction et Département
  directeursList: { libelle: string; description?: string }[] = []; // pour Directeur de Département / Direction
  categoriesList: string[]  = ['1', '2', '3', '4', '5', '6', '7', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  typesRetenueList: string[] = [
    'Part Agent',
    'Part Employeur',
    'Cotisation Sociale (CNSS/CARFO)',
    'Retraite Complémentaire (CRRAE)',
    'Retenue Fiscale (IUTS/TPA)',
    'Assurance Groupe & Santé',
    'Mutuelle Interne (MUPER)',
    'Remboursement Prêt & Avance',
    'Cotisation Syndicale'
  ];

  categories = ['1', '2', '3', '4', '5', '6', '7', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  echelons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // Grille salariale - listes par groupe (utilisant les codes officiels C1..C7, CL1..CL8)
  groupe1Classifications = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'];
  groupe2Classifications = ['CL1', 'CL2', 'CL3', 'CL4'];
  groupe3Classifications = ['CL5', 'CL6', 'CL7', 'CL8'];
  echelonsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  get allClassifications(): string[] {
    return [...this.groupe1Classifications, ...this.groupe2Classifications, ...this.groupe3Classifications, 'CL9', 'CL10'];
  }

  paramGroupesList: RefItem[] = [];
  availableCategoriesForSelectedGroup: string[] = [];

  getGroupKey(str: string): string {
    if (!str) return '';
    const s = str.trim().toUpperCase();
    if (/\bGROUPE\s+IV\b|\bGRP-4\b/i.test(s)) return 'GRP-4';
    if (/\bGROUPE\s+III\b|\bGRP-3\b/i.test(s)) return 'GRP-3';
    if (/\bGROUPE\s+II\b|\bGRP-2\b/i.test(s)) return 'GRP-2';
    if (/\bGROUPE\s+I\b|\bGRP-1\b/i.test(s)) return 'GRP-1';
    return '';
  }

  getCategoriesForGroupe(groupeName: string): string[] {
    if (!groupeName) return [];
    const targetKey = this.getGroupKey(groupeName);
    if (!targetKey) return [];

    // 1. Chercher dans paramGroupesList configuré par l'utilisateur
    const found = this.paramGroupesList.find(p => {
      const pKey = this.getGroupKey(p.grade || p.libelle || p.code || '');
      return pKey === targetKey;
    });
    if (found && Array.isArray(found.categories) && found.categories.length > 0) {
      return found.categories;
    }

    // 2. Fallback par défaut si non trouvé dans paramGroupesList
    if (targetKey === 'GRP-4') return ['CL9', 'CL10'];
    if (targetKey === 'GRP-3') return this.groupe3Classifications; // ['CL5', 'CL6', 'CL7', 'CL8']
    if (targetKey === 'GRP-2') return this.groupe2Classifications; // ['CL1', 'CL2', 'CL3', 'CL4']
    if (targetKey === 'GRP-1') return this.groupe1Classifications; // ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7']

    return [];
  }

  onGrilleGroupeChange(groupeName: string): void {
    this.availableCategoriesForSelectedGroup = this.getCategoriesForGroupe(groupeName);
    const defaultCat = this.availableCategoriesForSelectedGroup.length > 0 ? this.availableCategoriesForSelectedGroup[0] : 'C1';
    this.formGroup.patchValue({
      grade: groupeName,
      libelle: groupeName,
      categorie: defaultCat,
      code: defaultCat
    });
  }

  onIndemniteGroupeChange(groupeName: string): void {
    if (!groupeName) {
      this.availableCategoriesForSelectedGroup = [];
      this.formGroup.patchValue({ categories: [], categorie: '' });
      return;
    }
    this.availableCategoriesForSelectedGroup = this.getCategoriesForGroupe(groupeName);
    const autoChecked = [...this.availableCategoriesForSelectedGroup];
    this.formGroup.patchValue({
      categories: autoChecked,
      categorie: autoChecked.join(', ')
    });
  }

  onGrilleCatChange(cat: string): void {
    let groupe = 'GROUPE I';
    if (this.groupe3Classifications.includes(cat) || cat.startsWith('CL5') || cat.startsWith('CL6') || cat.startsWith('CL7') || cat.startsWith('CL8')) {
      groupe = 'GROUPE III';
    } else if (this.groupe2Classifications.includes(cat) || cat.startsWith('CL1') || cat.startsWith('CL2') || cat.startsWith('CL3') || cat.startsWith('CL4')) {
      groupe = 'GROUPE II';
    } else {
      groupe = 'GROUPE I';
    }
    this.formGroup.patchValue({
      grade: groupe,
      libelle: groupe,
      code: cat,
      categorie: cat
    });
  }

  getSalaryItem(classification: string, echelon: number): RefItem | undefined {
    const classUpper = (classification || '').trim().toUpperCase();
    const echCode = `E${echelon}`;
    return this.dataSource.data.find(item => {
      const itemCat = (item.categorie || item.code || '').trim().toUpperCase();
      const itemEch = String(item.echellon || '').trim().toUpperCase();
      const matchCat = itemCat === classUpper ||
        (classUpper === 'C1' && (itemCat === '1' || itemCat === '1ÈRE CATEGORIE' || itemCat === '1ERE CATEGORIE')) ||
        (classUpper === 'C2' && (itemCat === '2' || itemCat === '2ÈME CATEGORIE' || itemCat === '2EME CATEGORIE')) ||
        (classUpper === 'C3' && (itemCat === '3' || itemCat === '3ÈME CATEGORIE' || itemCat === '3EME CATEGORIE')) ||
        (classUpper === 'C4' && (itemCat === '4' || itemCat === '4ÈME CATEGORIE' || itemCat === '4EME CATEGORIE')) ||
        (classUpper === 'C5' && (itemCat === '5' || itemCat === '5ÈME CATEGORIE' || itemCat === '5EME CATEGORIE')) ||
        (classUpper === 'C6' && (itemCat === '6' || itemCat === '6ÈME CATEGORIE' || itemCat === '6EME CATEGORIE')) ||
        (classUpper === 'C7' && (itemCat === '7' || itemCat === '7ÈME CATEGORIE' || itemCat === '7EME CATEGORIE')) ||
        (classUpper === 'CL1' && (itemCat === 'I' || itemCat === 'CLASSE I')) ||
        (classUpper === 'CL2' && (itemCat === 'II' || itemCat === 'CLASSE II')) ||
        (classUpper === 'CL3' && (itemCat === 'III' || itemCat === 'CLASSE III')) ||
        (classUpper === 'CL4' && (itemCat === 'IV' || itemCat === 'CLASSE IV')) ||
        (classUpper === 'CL5' && (itemCat === 'V' || itemCat === 'CLASSE V')) ||
        (classUpper === 'CL6' && (itemCat === 'VI' || itemCat === 'CLASSE VI')) ||
        (classUpper === 'CL7' && (itemCat === 'VII' || itemCat === 'CLASSE VII')) ||
        (classUpper === 'CL8' && (itemCat === 'VIII' || itemCat === 'CLASSE VIII'));

      const matchEch = itemEch === echCode || itemEch === String(echelon) || itemEch === `ÉCHELON ${echelon}` || itemEch === `ECHELON ${echelon}`;
      return matchCat && matchEch;
    });
  }

  getSalary(classification: string, echelon: number): number | null {
    const item = this.getSalaryItem(classification, echelon);
    return item ? (item.montant ?? null) : null;
  }

  getSalaryFormatted(classification: string, echelon: number): string {
    const val = this.getSalary(classification, echelon);
    return val !== null ? this.formatMontant(val) : '-';
  }

  getCatCodeDisplay(raw: string): string {
    if (!raw) return '-';
    const s = raw.trim().toUpperCase();
    if (s.startsWith('C') || s.startsWith('CL')) return s;
    if (s === '1' || s.includes('1ÈRE') || s.includes('1ERE')) return 'C1';
    if (s === '2' || s.includes('2ÈME') || s.includes('2EME')) return 'C2';
    if (s === '3' || s.includes('3ÈME') || s.includes('3EME')) return 'C3';
    if (s === '4' || s.includes('4ÈME') || s.includes('4EME')) return 'C4';
    if (s === '5' || s.includes('5ÈME') || s.includes('5EME')) return 'C5';
    if (s === '6' || s.includes('6ÈME') || s.includes('6EME')) return 'C6';
    if (s === '7' || s.includes('7ÈME') || s.includes('7EME')) return 'C7';
    if (s === 'I' || s === 'CLASSE I') return 'CL1';
    if (s === 'II' || s === 'CLASSE II') return 'CL2';
    if (s === 'III' || s === 'CLASSE III') return 'CL3';
    if (s === 'IV' || s === 'CLASSE IV') return 'CL4';
    if (s === 'V' || s === 'CLASSE V') return 'CL5';
    if (s === 'VI' || s === 'CLASSE VI') return 'CL6';
    if (s === 'VII' || s === 'CLASSE VII') return 'CL7';
    if (s === 'VIII' || s === 'CLASSE VIII') return 'CL8';
    return s;
  }

  getEchelonCodeDisplay(raw: any): string {
    if (!raw) return 'E01';
    const str = String(raw).trim().toUpperCase();
    if (str.startsWith('E') && !str.startsWith('ECH')) {
      const num = parseInt(str.substring(1), 10);
      if (!isNaN(num)) {
        return num < 10 ? `E0${num}` : `E${num}`;
      }
      return str;
    }
    const numStr = str.replace(/[^0-9]/g, '');
    if (numStr) {
      const num = parseInt(numStr, 10);
      return num < 10 ? `E0${num}` : `E${num}`;
    }
    return str;
  }

  getGradeConcat(row: any): string {
    if (!row) return '-';
    const cat = this.getCatCodeDisplay(row.categorie || row.code);
    const ech = this.getEchelonCodeDisplay(row.echellon);
    return `${cat}${ech}`;
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
    const groupe = this.groupe1Classifications.includes(classification) ? 'GROUPE I' :
                   (this.groupe2Classifications.includes(classification) ? 'GROUPE II' : 'GROUPE III');
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
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      code:          ['', [Validators.maxLength(25)]],
      libelle:       ['', [Validators.maxLength(150)]],
      description:   [''],
      actif:         [true],
      montant:       [0, [Validators.min(0)]],
      agenceId:      [null],
      departementId: [null],
      directionId:   [null],
      echelle:       [''],
      echellon:      [''],
      typeIndemnite: [''],
      typeRetenue:   ['Part Agent'],
      fonction:      [''],
      grade:         [''],
      categorie:       [''],
      categories:      [[]],
      taux:            [0, [Validators.min(0)]],
      tauxExoneration: [0, [Validators.min(0), Validators.max(100)]],
      plafondExoneration: [0, [Validators.min(0)]],
      tauxAbattement:  [25, [Validators.min(0), Validators.max(100)]],
      typeNomination:  ['NON_NOMMEE']
    });
  }

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.route.data.subscribe(data => {
      this.title  = data['title']  ?? '';
      this.icon   = data['icon']   ?? 'list';
      this.type   = data['type']   ?? '';
      if (this.type === 'grille-salariale') {
        this.displayedColumns = ['gradeConcat', 'categorie', 'echellon', 'montant', 'actif', 'actions'];
      } else if (this.type === 'param-indemnite') {
        this.displayedColumns = ['code', 'typeIndemnite', 'fonction', 'grade', 'categorie', 'taux', 'actif', 'actions'];
      } else if (this.type === 'param-retraite') {
        this.displayedColumns = ['grade', 'taux', 'description', 'actif', 'actions'];
      } else if (this.type === 'param-prise-en-charge') {
        this.displayedColumns = ['code', 'libelle', 'taux', 'description', 'actif', 'actions'];
      } else if (this.type === 'type-indemnite') {
        this.displayedColumns = ['code', 'libelle', 'tauxExoneration', 'plafondExoneration', 'description', 'actif', 'actions'];
      } else if (this.type === 'type-retenue-emploi') {
        this.displayedColumns = ['code', 'libelle', 'typeRetenue', 'taux', 'description', 'actif', 'actions'];
      } else if (this.type === 'grade') {
        this.displayedColumns = ['libelle', 'description', 'actif', 'actions'];
      } else if (this.type === 'param-groupe') {
        this.displayedColumns = ['grade', 'categories', 'description', 'actif', 'actions'];
      } else if (this.type === 'categorie') {
        this.displayedColumns = ['code', 'libelle', 'tauxAbattement', 'actif', 'actions'];
      } else if (this.type === 'fonction') {
        this.displayedColumns = ['code', 'libelle', 'typeNomination', 'description', 'actif', 'actions'];
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
    this.dataSource.sortingDataAccessor = (item: RefItem, property: string) => {
      if (property === 'gradeConcat') return this.getGradeConcat(item);
      if (property === 'categorie') return this.getCatCodeDisplay(item.categorie || item.code);
      if (property === 'echellon') return this.getEchelonCodeDisplay(item.echellon);
      return (item as any)[property];
    };
    this.dataSource.filterPredicate = (data: RefItem, filter: string) => {
      const searchStr = (Object.values(data).join(' ') + ' ' + this.getGradeConcat(data)).toLowerCase();
      return searchStr.includes(filter);
    };
  }

  getGradeName(row: RefItem): string {
    const cat = row.categorie || row.code || '';
    if (this.groupe1Classifications.includes(cat)) return 'GROUPE I';
    if (this.groupe2Classifications.includes(cat)) return 'GROUPE II';
    if (this.groupe3Classifications.includes(cat)) return 'GROUPE III';
    return row.grade || row.libelle || row.echelle || 'GROUPE I';
  }

  loadData(): void {
    this.dbRefService.getItems$(this.type).subscribe(items => {
      if (this.type === 'param-indemnite') {
        (items || []).forEach(item => {
          if (!item.categories || item.categories.length === 0 || !item.categories.some(c => c.startsWith('C') || c.startsWith('CL'))) {
            const cats = this.getCategoriesForGroupe(item.grade || '');
            if (cats.length > 0) {
              item.categories = [...cats];
              item.categorie = cats.join(', ');
            }
          }
        });
      }
      this.dataSource.data = items || [];
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
    });
  }

  loadHierarchyData(): void {
    this.dbRefService.getItems('grade').subscribe(items => this.grades = items);
    if (this.type === 'direction' || this.type === 'departement') {
      this.dbRefService.getItems('agence').subscribe(items => this.agences = items);
      this.employeeService.getAll().subscribe((emps: any[]) => {
        const list: { libelle: string; description?: string }[] = [];
        const set = new Set<string>();
        (emps || []).forEach((emp: any) => {
          const name = `${emp.prenom} ${emp.nom}`.trim();
          if (name && !set.has(name)) {
            set.add(name);
            list.push({ libelle: name, description: emp.poste || emp.matricule });
          }
        });
        const defaults = [
          { libelle: 'Abdoulaye SAWADOGO', description: 'Directeur Général' },
          { libelle: 'Mariam OUEDRAOGO', description: 'Directrice RH' },
          { libelle: 'Yacouba KABORE', description: 'Directeur Opérations' },
          { libelle: 'Jean ZONGO', description: 'Directeur Monétique' },
          { libelle: 'Aminata TRAORE', description: 'Chef Service Paie' }
        ];
        defaults.forEach(d => {
          if (!set.has(d.libelle)) {
            set.add(d.libelle);
            list.push(d);
          }
        });
        this.directeursList = list;
      });
    } else {
      this.agences = [];
      this.directeursList = [];
    }
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
      this.dbRefService.getItems('param-groupe').subscribe(items => this.paramGroupesList = items);
    } else {
      this.grades = [];
      this.paramGroupesList = [];
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

  private setupValidators(): void {
    this.formGroup.get('code')?.clearValidators();
    this.formGroup.get('code')?.setValidators([Validators.maxLength(25)]);
    this.formGroup.get('code')?.updateValueAndValidity();

    this.formGroup.get('libelle')?.clearValidators();
    this.formGroup.get('typeIndemnite')?.clearValidators();
    this.formGroup.get('typeRetenue')?.clearValidators();
    this.formGroup.get('categorie')?.clearValidators();
    this.formGroup.get('echellon')?.clearValidators();

    if (this.type === 'param-indemnite') {
      this.formGroup.get('typeIndemnite')?.setValidators([Validators.required]);
    } else if (this.type === 'type-retenue-emploi') {
      this.formGroup.get('typeRetenue')?.setValidators([Validators.required]);
    } else if (this.type === 'grille-salariale') {
      this.formGroup.get('categorie')?.setValidators([Validators.required]);
      this.formGroup.get('echellon')?.setValidators([Validators.required]);
    } else {
      this.formGroup.get('libelle')?.setValidators([Validators.maxLength(150)]);
    }

    this.formGroup.get('libelle')?.updateValueAndValidity();
    this.formGroup.get('typeIndemnite')?.updateValueAndValidity();
    this.formGroup.get('typeRetenue')?.updateValueAndValidity();
    this.formGroup.get('categorie')?.updateValueAndValidity();
    this.formGroup.get('echellon')?.updateValueAndValidity();
  }

  openAddDialog(): void {
    this.isEditing = false;
    this.editingItem = null;
    this.formGroup.reset({
      code: '', libelle: '', description: '', actif: true,
      montant: 0, departementId: null, directionId: null, echelle: '', echellon: this.type === 'grille-salariale' ? '1' : '',
      typeIndemnite: '', typeRetenue: 'Part Agent', fonction: '', grade: this.type === 'grille-salariale' ? 'GROUPE I' : '', categorie: this.type === 'grille-salariale' ? 'C1' : '', taux: 0,
      tauxExoneration: 0, plafondExoneration: 0, tauxAbattement: 25
    });
    if (this.type === 'grille-salariale') {
      const initialGroupe = this.grades.length > 0 ? (this.grades[0].libelle || this.grades[0].code) : 'GROUPE I';
      this.availableCategoriesForSelectedGroup = this.getCategoriesForGroupe(initialGroupe);
      const initialCat = this.availableCategoriesForSelectedGroup.length > 0 ? this.availableCategoriesForSelectedGroup[0] : 'C1';
      this.formGroup.patchValue({
        grade: initialGroupe,
        libelle: initialGroupe,
        categorie: initialCat,
        code: initialCat,
        echellon: '1'
      });
    } else if (this.type === 'param-indemnite') {
      this.availableCategoriesForSelectedGroup = [];
    }
    this.setupValidators();
    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '560px' });
  }

  openEditDialog(item: RefItem): void {
    this.isEditing = true;
    this.editingItem = item;

    const defaultAbattement = item.tauxAbattement ?? (['V', 'VI', 'VII', 'VIII'].includes(item.code) ? 20 : 25);

    if (this.type === 'grille-salariale') {
      const catVal = item.categorie || item.code || 'C1';
      const gradeVal = item.grade || (this.groupe3Classifications.includes(catVal) ? 'GROUPE III' : (this.groupe2Classifications.includes(catVal) ? 'GROUPE II' : 'GROUPE I'));

      this.availableCategoriesForSelectedGroup = this.getCategoriesForGroupe(gradeVal);

      this.formGroup.reset({
        code:          catVal,
        libelle:       gradeVal,
        description:   item.description || `${gradeVal} (${catVal}) - Échelon ${item.echellon || 1}`,
        actif:         item.actif ?? true,
        montant:       item.montant ?? 0,
        departementId: item.departementId ?? null,
        directionId:   item.directionId   ?? null,
        echelle:       gradeVal,
        echellon:      String(item.echellon || '1'),
        typeIndemnite: '',
        typeRetenue:   'Part Agent',
        fonction:      '',
        grade:         gradeVal,
        categorie:     catVal,
        taux:          0,
        tauxAbattement: defaultAbattement
      });
    } else if (this.type === 'param-indemnite') {
      const gradeVal = item.grade || '';
      this.availableCategoriesForSelectedGroup = gradeVal ? this.getCategoriesForGroupe(gradeVal) : [];
      const itemCats = Array.isArray(item.categories) && item.categories.length > 0
        ? item.categories
        : (item.categorie ? item.categorie.split(',').map(c => c.trim()) : (gradeVal ? [...this.availableCategoriesForSelectedGroup] : []));

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
        typeRetenue:   'Part Agent',
        fonction:      item.fonction || '',
        grade:         gradeVal,
        categorie:     itemCats.join(', '),
        categories:    itemCats,
        taux:          item.taux ?? item.montant ?? 0,
        tauxExoneration: item.tauxExoneration ?? 0,
        plafondExoneration: item.plafondExoneration ?? 0,
        tauxAbattement:  defaultAbattement
      });
    } else if (this.type === 'type-retenue-emploi') {
      this.formGroup.reset({
        code:          item.code || '',
        libelle:       item.libelle || '',
        description:   item.description || '',
        actif:         item.actif ?? true,
        montant:       item.montant ?? 0,
        departementId: null,
        directionId:   null,
        echelle:       '',
        echellon:      '',
        typeIndemnite: '',
        typeRetenue:   item.typeRetenue || 'Part Agent',
        fonction:      item.fonction || '',
        grade:         item.grade || '',
        categorie:     item.categorie || '',
        taux:          item.taux ?? 0,
        tauxExoneration: 0,
        plafondExoneration: 0,
      });
    } else if (this.type === 'grade') {
      this.formGroup.reset({
        code:          item.code || item.libelle || '',
        libelle:       item.libelle || item.code || '',
        description:   item.description || '',
        actif:         item.actif ?? true,
        montant:       0,
        departementId: null,
        directionId:   null,
        echelle:       '',
        echellon:      '',
        typeIndemnite: '',
        typeRetenue:   'Part Agent',
        fonction:      '',
        grade:         item.libelle || '',
        categorie:     '',
        categories:    [],
        taux:          0,
        tauxExoneration: 0,
        plafondExoneration: 0,
        tauxAbattement:  defaultAbattement
      });
    } else if (this.type === 'param-groupe') {
      this.formGroup.reset({
        code:          item.code || '',
        libelle:       item.grade || item.libelle || '',
        description:   item.description || '',
        actif:         item.actif ?? true,
        montant:       0,
        departementId: null,
        directionId:   null,
        echelle:       '',
        echellon:      '',
        typeIndemnite: '',
        typeRetenue:   'Part Agent',
        fonction:      '',
        grade:         item.grade || item.libelle || '',
        categorie:     '',
        categories:    item.categories || [],
        taux:          0,
        tauxExoneration: 0,
        plafondExoneration: 0,
        tauxAbattement:  defaultAbattement
      });
    } else if (this.type === 'param-retraite') {
      this.formGroup.reset({
        code:          item.code || '',
        libelle:       item.libelle || item.grade || 'GROUPE I',
        description:   item.description || '',
        actif:         item.actif ?? true,
        montant:       item.taux ?? item.montant ?? 60,
        departementId: null,
        directionId:   null,
        echelle:       '',
        echellon:      '',
        typeIndemnite: '',
        typeRetenue:   'Part Agent',
        fonction:      '',
        grade:         item.libelle || item.grade || 'GROUPE I',
        categorie:     '',
        taux:          item.taux ?? item.montant ?? 60,
        tauxExoneration: 0,
        plafondExoneration: 0,
        tauxAbattement:  25
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
        typeRetenue:   item.typeRetenue || 'Part Agent',
        fonction:      '',
        grade:         '',
        categorie:     '',
        taux:          0,
        tauxExoneration: item.tauxExoneration ?? 0,
        plafondExoneration: item.plafondExoneration ?? 0,
        tauxAbattement:  defaultAbattement,
        typeNomination:  item.typeNomination || 'NON_NOMMEE'
      });
    }

    this.setupValidators();
    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '560px' });
  }

  onSubmit(): void {
    const v = this.formGroup.getRawValue();

    let item: RefItem;

    if (this.type === 'grille-salariale') {
      const catCode = v.categorie || v.code || this.editingItem?.code || '1';
      const gradeVal = v.grade || v.libelle || (this.groupe1Classifications.includes(catCode) ? 'GROUPE I' : (this.groupe2Classifications.includes(catCode) ? 'GROUPE II' : 'GROUPE III'));
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
      const selectedCats = Array.isArray(v.categories) && v.categories.length > 0
        ? v.categories
        : (v.categorie ? v.categorie.split(',').map((c: string) => c.trim()) : []);
      const catDisplay = selectedCats.join(', ');
      item = {
        id:            this.editingItem?.id,
        code:          v.code || this.editingItem?.code || `PI-${Date.now()}`,
        libelle:       v.typeIndemnite || v.libelle || 'Indemnité',
        description:   `Fonction: ${v.fonction || '-'}, Grade: ${v.grade || '-'}, Cat: ${catDisplay || '-'}`,
        actif:         v.actif ?? true,
        montant:       Number(v.taux ?? v.montant ?? 0),
        typeIndemnite: v.typeIndemnite || v.libelle || '',
        fonction:      v.fonction || '',
        grade:         v.grade || '',
        categorie:     catDisplay,
        categories:    selectedCats,
        taux:          Number(v.taux ?? v.montant ?? 0)
      };
    } else if (this.type === 'grade') {
      const gName = v.libelle || v.code || 'GROUPE I';
      item = {
        id:            this.editingItem?.id,
        code:          gName,
        libelle:       gName,
        description:   v.description || '',
        actif:         v.actif ?? true
      };
    } else if (this.type === 'param-groupe') {
      const grp = v.grade || v.libelle || 'GROUPE I';
      item = {
        id:            this.editingItem?.id,
        code:          v.code || `PG-${grp.replace(/\s+/g, '-')}`,
        grade:         grp,
        libelle:       grp,
        description:   v.description || '',
        actif:         v.actif ?? true,
        categories:    Array.isArray(v.categories) ? v.categories : []
      };
    } else if (this.type === 'param-retraite') {
      const grp = v.libelle || v.grade || 'GROUPE I';
      const ageVal = Number(v.taux ?? v.montant ?? 60);
      const codeVal = v.code || `RET-${grp.replace(/\s+/g, '-')}`;
      item = {
        id:            this.editingItem?.id,
        code:          codeVal,
        libelle:       grp,
        description:   v.description || `${grp} : ${ageVal} ans`,
        actif:         v.actif ?? true,
        taux:          ageVal,
        montant:       ageVal,
        grade:         grp
      };
    } else if (this.type === 'type-retenue-emploi') {
      item = {
        id:            this.editingItem?.id,
        code:          v.code || this.editingItem?.code || `RET-${Date.now()}`,
        libelle:       v.libelle || 'Retenue',
        description:   v.description || '',
        actif:         v.actif ?? true,
        typeRetenue:   v.typeRetenue || 'Part Agent',
        taux:          Number(v.taux ?? 0)
      };
    } else {
      const pfx = (this.type || 'REF').replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
      const generatedCode = v.code && v.code.trim() ? v.code.trim() : `${pfx}-${String(Date.now()).slice(-5)}`;
      const libelleVal = v.libelle && v.libelle.trim() ? v.libelle.trim() : (this.editingItem?.libelle || generatedCode);
      item = {
        id:            this.editingItem?.id,
        code:          generatedCode,
        libelle:       libelleVal,
        description:   v.description || '',
        actif:         v.actif ?? true,
        montant:       v.montant ? Number(v.montant) : undefined,
        departementId: v.departementId || undefined,
        directionId:   v.directionId   || undefined,
        tauxAbattement: v.tauxAbattement !== undefined && v.tauxAbattement !== null ? Number(v.tauxAbattement) : undefined,
        tauxExoneration: v.tauxExoneration !== undefined && v.tauxExoneration !== null ? Number(v.tauxExoneration) : undefined,
        plafondExoneration: v.plafondExoneration !== undefined && v.plafondExoneration !== null ? Number(v.plafondExoneration) : undefined,
        typeNomination: this.type === 'fonction' ? (v.typeNomination || 'NON_NOMMEE') : undefined
      };
    }

    const targetCode = this.editingItem?.code || item.code;

    if (this.isEditing && this.editingItem) {
      this.dbRefService.updateItem(this.type, targetCode, item).subscribe({
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
    const msg = `Attention - Conflit potentiel :\n\nL'élément "${item.libelle}" (${item.code}) risque d'être déjà utilisé dans l'application.\n\nIl est vivement recommandé de le DÉSACTIVER plutôt que de le supprimer pour éviter toute rupture de données.\n\nVoulez-vous quand même supprimer cet élément ?`;
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
      const msg = `Attention - Conflit d'utilisation :\n\nL'élément "${item.libelle}" (${item.code}) va être désactivé.\n\nUne fois désactivé, il n'apparaîtra plus dans les sélecteurs pour les nouvelles créations. Les enregistrements existants conserveront cette donnée.\n\nConfirmez-vous la désactivation ?`;
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
