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
    return [...this.groupe1Classifications, ...this.groupe2Classifications, ...this.groupe3Classifications];
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
      taux:            [0, [Validators.min(0)]],
      tauxExoneration: [0, [Validators.min(0), Validators.max(100)]],
      plafondExoneration: [0, [Validators.min(0)]],
      tauxAbattement:  [25, [Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.route.data.subscribe(data => {
      this.title  = data['title']  ?? '';
      this.icon   = data['icon']   ?? 'list';
      this.type   = data['type']   ?? '';
      if (this.type === 'grille-salariale') {
        this.displayedColumns = ['categorie', 'echellon', 'montant', 'actif', 'actions'];
      } else if (this.type === 'param-indemnite') {
        this.displayedColumns = ['code', 'typeIndemnite', 'fonction', 'grade', 'categorie', 'taux', 'actif', 'actions'];
      } else if (this.type === 'param-retraite') {
        this.displayedColumns = ['code', 'libelle', 'taux', 'description', 'actif', 'actions'];
      } else if (this.type === 'type-indemnite') {
        this.displayedColumns = ['code', 'libelle', 'tauxExoneration', 'plafondExoneration', 'description', 'actif', 'actions'];
      } else if (this.type === 'type-retenue-emploi') {
        this.displayedColumns = ['code', 'libelle', 'typeRetenue', 'taux', 'description', 'actif', 'actions'];
      } else if (this.type === 'categorie') {
        this.displayedColumns = ['code', 'libelle', 'tauxAbattement', 'actif', 'actions'];
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
    if (this.groupe1Classifications.includes(cat)) return 'GROUPE I';
    if (this.groupe2Classifications.includes(cat)) return 'GROUPE II';
    if (this.groupe3Classifications.includes(cat)) return 'GROUPE III';
    return row.grade || row.libelle || row.echelle || 'GROUPE I';
  }

  loadData(): void {
    if (this.type === 'grille-salariale') {
      const stored = localStorage.getItem('ref_grille-salariale');
      if (stored) {
        try {
          this.dataSource.data = JSON.parse(stored);
          return;
        } catch(e) {}
      }
      this.dbRefService.getItems(this.type).subscribe(items => {
        this.dataSource.data = items;
      });
    } else {
      this.dbRefService.getItems(this.type).subscribe(items => {
        this.dataSource.data = items;
      });
    }
  }

  loadHierarchyData(): void {
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
      montant: 0, departementId: null, directionId: null, echelle: '', echellon: '',
      typeIndemnite: '', typeRetenue: 'Part Agent', fonction: '', grade: '', categorie: '', taux: 0,
      tauxExoneration: 0, plafondExoneration: 0, tauxAbattement: 25
    });
    this.setupValidators();
    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '560px' });
  }

  openEditDialog(item: RefItem): void {
    this.isEditing = true;
    this.editingItem = item;

    const defaultAbattement = item.tauxAbattement ?? (['V', 'VI', 'VII', 'VIII'].includes(item.code) ? 20 : 25);

    if (this.type === 'grille-salariale') {
      const catVal = item.categorie || item.code || '';
      const gradeVal = item.grade || (this.groupe1Classifications.includes(catVal) ? 'GROUPE I' : (this.groupe2Classifications.includes(catVal) ? 'GROUPE II' : 'GROUPE III'));

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
        typeRetenue:   'Part Agent',
        fonction:      '',
        grade:         gradeVal,
        categorie:     catVal,
        taux:          0,
        tauxAbattement: defaultAbattement
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
        typeRetenue:   'Part Agent',
        fonction:      item.fonction || '',
        grade:         item.grade || '',
        categorie:     item.categorie || '',
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
        tauxAbattement:  defaultAbattement
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
        plafondExoneration: v.plafondExoneration !== undefined && v.plafondExoneration !== null ? Number(v.plafondExoneration) : undefined
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
