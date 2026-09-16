import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, switchMap, debounceTime, distinctUntilChanged } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Employee, EmployeeSalaryInformation, StatutEmploye } from '../../models/employee.model';

@Component({
  selector: 'app-infos-pro',
  templateUrl: './infos-pro.component.html',
  styleUrls: ['./infos-pro.component.scss'],
  standalone: false
})
export class InfosProComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  saveError = '';
  saved = false;
  loadError = '';
  isEditing = false;
  isCreationMode = false;
  empId = '';
  salaryInformation?: EmployeeSalaryInformation;
  currentNetSalary: number = 0;
  
  services$!: Observable<RefItem[]>;
  directions$!: Observable<RefItem[]>;
  departements$!: Observable<RefItem[]>;
  agences$!: Observable<RefItem[]>;
  fonctions$!: Observable<RefItem[]>;
  emplois$!: Observable<RefItem[]>;
  banques$!: Observable<RefItem[]>;
  fonctionsList: RefItem[] = [];
  parametragesRetraite: any[] = [];
  grades$!: Observable<RefItem[]>;
  categories$!: Observable<RefItem[]>;
  echelons$!: Observable<RefItem[]>;
  grillesSalariales$!: Observable<RefItem[]>;
  regimesSecuriteSocial$!: Observable<RefItem[]>;
  regimesSecuriteSocial: RefItem[] = [];
  emplois: RefItem[] = [];
  fonctions: RefItem[] = [];
  directions: RefItem[] = [];
  departements: RefItem[] = [];
  services: RefItem[] = [];
  agences: RefItem[] = [];
  banques: RefItem[] = [];

  grades: RefItem[] = [];
  categories: RefItem[] = [];
  echelons: RefItem[] = [];
  grillesSalariales: RefItem[] = [];
  paramGroupes: RefItem[] = [];
  readonly String = String; // pour usage dans le template

  readonly statuts: StatutEmploye[] = ['Actif', 'Inactif', 'Suspendu', "Période d'essai", 'Congé maladie', 'Détaché'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.isCreationMode = this.route.snapshot.queryParamMap.get('mode') === 'creation';
    this.isEditing = this.isCreationMode;

    this.emplois$ = this.dbRefService.getItems('emploi');
    this.services$ = this.dbRefService.getItems('service');
    this.directions$ = this.dbRefService.getItems('direction');
    this.departements$ = this.dbRefService.getItems('departement');
    this.agences$ = this.dbRefService.getItems('agence');
    this.fonctions$ = this.dbRefService.getItems('fonction');
    this.grades$ = this.dbRefService.getItems('grade');
    this.categories$ = this.dbRefService.getItems('categorie');
    this.echelons$ = this.dbRefService.getItems('echelon');
    this.grillesSalariales$ = this.dbRefService.getItems('grille-salariale');
    this.regimesSecuriteSocial$ = this.dbRefService.getItems('regime-securite-social');
    this.banques$ = this.dbRefService.getItems('banque');

    forkJoin({
      emplois: this.emplois$,
      services: this.services$,
      directions: this.directions$,
      departements: this.departements$,
      agences: this.agences$,
      fonctions: this.fonctions$,
      grades: this.grades$,
      categories: this.categories$,
      echelons: this.echelons$,
      grillesSalariales: this.grillesSalariales$,
      regimes: this.regimesSecuriteSocial$,
      banques: this.banques$,
      paramsRetraite: this.dbRefService.getItems('param-retraite'),
      paramGroupes: this.dbRefService.getItems('param-groupe'),
      employee: this.employeeService.getById(this.empId)
    }).subscribe({
      next: (res) => {
        this.emplois = res.emplois || [];
        this.services = res.services || [];
        this.directions = res.directions || [];
        this.departements = res.departements || [];
        this.agences = res.agences || [];
        this.fonctions = res.fonctions || [];
        this.fonctionsList = res.fonctions || [];
        this.grades = res.grades || [];
        this.categories = res.categories || [];
        this.echelons = res.echelons || [];
        this.grillesSalariales = res.grillesSalariales || [];
        this.regimesSecuriteSocial = (res.regimes || []).filter(item => item.actif !== false);
        this.banques = res.banques || [];
        this.parametragesRetraite = (res.paramsRetraite || []).filter(item => item.actif !== false);
        this.paramGroupes = res.paramGroupes || [];

        this.employee = res.employee;
        this.buildForm();
        this.patch(res.employee);

        this.employeeService.getSalaryInformation(this.empId).subscribe({
          next: information => this.patchSalaryInformation(information),
          error: () => {}
        });

        if (!this.isCreationMode) this.form.disable();
      },
      error: err => {
        this.loadError = err?.error?.message || 'Impossible de charger les informations professionnelles.';
      }
    });
  }

  private parseCat(cat: string): string {
    return this.getCatCodeDisplay(cat);
  }

  formatGradeCode(rawGrade?: string, rawCat?: string, rawEch?: string): string {
    const catCode = this.getCatCodeDisplay(rawCat || '');
    const echCode = this.getEchelonCodeDisplay(rawEch || '');
    if (catCode && echCode) {
      return `${catCode}${echCode}`;
    }

    if (rawGrade && /^(C|CL|HC)\d*(E\d+|EX)$/i.test(rawGrade.trim())) {
      return rawGrade.trim().toUpperCase();
    }

    if (rawGrade) {
      const g = rawGrade.trim();
      const parts = g.split(/(?=Échelon|Echelon|ECHELON|echelon|E\d+)/i);
      if (parts.length >= 2) {
        const c = this.getCatCodeDisplay(parts[0]);
        const e = this.getEchelonCodeDisplay(parts[1]);
        if (c && e) return `${c}${e}`;
      }
    }

    return rawGrade || '—';
  }

  enableEdit(): void {
    this.isEditing = true;
    this.form.enable();
    this.form.get('grade')?.disable();
  }

  cancelEdit(): void {
    if (this.employee) {
      this.patch(this.employee);
    }
    if (this.salaryInformation) {
      this.patchSalaryInformation(this.salaryInformation);
    }
    this.form.disable();
    this.isEditing = false;
  }

  get showBancaire(): boolean {
    return this.form.get('modePaiement')?.value === 'Virement bancaire';
  }

  get calculatedRetirementDateStr(): string {
    if (!this.employee?.dateNaissance) return '—';
    const birthDate = new Date(this.employee.dateNaissance);
    if (isNaN(birthDate.getTime())) return '—';

    // 1. Trouver le Groupe de l'employé sélectionné dans le formulaire ou l'objet employé
    const gradeId = this.form?.get('gradeId')?.value || this.employee?.gradeId;
    const gradeObj = this.grades.find(g => String(g.id) === String(gradeId));

    const catId = this.form?.get('categorieId')?.value || this.employee?.categorieId;
    const catObj = this.categories.find(c => String(c.id) === String(catId));

    let groupe = this.getGradeGroupe(gradeObj) || (catObj ? this.getCategoryGroupe(catObj) : '') || 'GROUPE I';

    // 2. Trouver l'âge depuis param-retraite dans Données de base
    let age = groupe === 'GROUPE III' ? 65 : 60;
    const paramRet = this.parametragesRetraite.find(p => {
      const codeOrLib = ((p.code || '') + ' ' + (p.libelle || '') + ' ' + (p.grade || '')).toUpperCase();
      return codeOrLib.includes(groupe);
    });
    if (paramRet && (paramRet.taux || paramRet.ageRetraite || paramRet.montant)) {
      age = Number(paramRet.taux || paramRet.ageRetraite || paramRet.montant);
    }

    // 3. Calculer la date exacte (sans afficher l'âge)
    const retirementYear = birthDate.getFullYear() + age;
    const retirementDate = new Date(birthDate);
    retirementDate.setFullYear(retirementYear);

    const day = String(retirementDate.getDate()).padStart(2, '0');
    const month = String(retirementDate.getMonth() + 1).padStart(2, '0');
    const year = retirementDate.getFullYear();

    return `${day}/${month}/${year}`;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      fonctionId:           [null],
      emploiId:             [null],
      serviceId:            [null],
      agenceId:             [null],
      directionId:          [null],
      departmentId:         [null],

      gradeId:              [null, Validators.required],
      categorieId:          [null, Validators.required],
      echelonId:            [null, Validators.required],
      grilleSalarialeId:    [null, Validators.required],
      poste:                [''],
      fonction:             [''],
      customFonction:       [''],
      service:              [''],
      direction:            [''],
      departement:          [''],
      agence:               [''],
      regimeSecuriteSocialId: [null],
      categoriePro:         [''],
      echelon:              [''],
      grade:                [''],
      statut:               ['Actif'],
      dateEmbauche:         [''],
      modePaiement:         ['Virement bancaire'],
      intituleCompte:       [''],
      banque:               [''],
      iban:                 [''],
      groupeRetraiteId:     [null],
      matricule:            [''],
      numeroCnss:           [''],
      surSalaire:           [0, [Validators.min(0)]]
    });

    this.form.get('surSalaire')?.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(() => {
      this.triggerRecalculateNet();
    });
  }

  private patch(e: Employee): void {
    let cat = this.parseCat(e.categoriePro);
    if (!cat && e.grade) {
      const g = e.grade.trim();
      const eIdx = g.indexOf('E');
      if (eIdx > 0) cat = this.parseCat(g.substring(0, eIdx));
    }
    if (!cat) cat = 'CL5';

    let ech = e.echelon || '';
    if (!ech && e.grade) {
      const g = e.grade.trim();
      const eIdx = g.indexOf('E');
      if (eIdx > 0) ech = g.substring(eIdx);
    }
    if (ech) {
      const num = parseInt(ech.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num)) ech = num < 10 ? `E0${num}` : `E${num}`;
    } else {
      ech = 'E01';
    }
    const computedGrade = `${cat}${ech}`;

    let rawFct: any = e.fonction;
    if (typeof rawFct === 'object' && rawFct !== null) {
      rawFct = rawFct.name || rawFct.libelle || rawFct.code || 'Agent simple';
    }
    let fctValue = String(rawFct || 'Agent simple').trim();
    const upperFct = fctValue.toUpperCase();

    if (!fctValue || fctValue === 'Agent' || upperFct.includes('AGENT SIMPLE')) {
      fctValue = 'Agent simple';
    } else if (this.fonctionsList && this.fonctionsList.length > 0) {
      const targetNorm = fctValue.toLowerCase().replace(/[éèêë]/g, 'e').replace(/[^a-z0-9]/g, '');
      const match = this.fonctionsList.find(f => {
        const nameNorm = (f.libelle || f.name || f.code || '').toLowerCase().replace(/[éèêë]/g, 'e').replace(/[^a-z0-9]/g, '');
        return nameNorm === targetNorm || targetNorm.includes(nameNorm) || nameNorm.includes(targetNorm);
      });
      if (match) {
        fctValue = match.libelle || match.name || match.code || fctValue;
      }
    }

    let resolvedGradeId = e.gradeId != null ? String(e.gradeId) : null;
    let resolvedCatId = e.categorieId != null ? String(e.categorieId) : null;
    let resolvedEchId = e.echelonId != null ? String(e.echelonId) : null;
    let resolvedGridId = e.grilleSalarialeId != null ? String(e.grilleSalarialeId) : null;

    // Auto-détection si les identifiants ne sont pas renseignés
    if (!resolvedCatId && (e.categoriePro || cat)) {
      const catCode = this.getCatCodeDisplay(e.categoriePro || cat);
      const foundCat = this.categories.find(c => this.getCatCodeDisplay(c.code || c.libelle || '') === catCode);
      if (foundCat) resolvedCatId = String(foundCat.id);
    }

    if (!resolvedEchId && (e.echelon || ech)) {
      const echCode = this.getEchelonCodeDisplay(e.echelon || ech);
      const foundEch = this.echelons.find(ec => this.getEchelonCodeDisplay(ec.code || ec.libelle || '') === echCode);
      if (foundEch) resolvedEchId = String(foundEch.id);
    }

    if (resolvedCatId && resolvedEchId && (!resolvedGradeId || !resolvedGridId)) {
      const foundGrid = this.grillesSalariales.find(g =>
        String(g.categorieId) === String(resolvedCatId) && String(g.echelonId) === String(resolvedEchId)
      );
      if (foundGrid) {
        if (!resolvedGridId && foundGrid.id) resolvedGridId = String(foundGrid.id);
        if (!resolvedGradeId && foundGrid.gradeId) resolvedGradeId = String(foundGrid.gradeId);
      }
    }

    // Si gradeId est toujours null mais que la catégorie est identifiée, déduire automatiquement le groupe
    if (!resolvedGradeId && resolvedCatId) {
      const foundCat = this.categories.find(c => String(c.id) === String(resolvedCatId));
      if (foundCat) {
        const grp = this.getCategoryGroupe(foundCat);
        const matchedGrade = this.grades.find(g => this.getGradeGroupe(g) === grp);
        if (matchedGrade && matchedGrade.id) resolvedGradeId = String(matchedGrade.id);
      }
    }

    let resolvedAgenceId = e.agenceId || null;
    if (!resolvedAgenceId && e.agence) {
      const targetAg = (e.agence || '').trim().toLowerCase();
      const foundAg = this.agences.find(a => (a.libelle || a.code || '').trim().toLowerCase() === targetAg);
      if (foundAg) resolvedAgenceId = foundAg.id || null;
    }

    let resolvedDirId = e.directionId || null;
    if (!resolvedDirId && (e.direction || e.departement)) {
      const dirName = (e.direction || e.departement || '').trim().toLowerCase();
      const foundDir = this.directions.find(d => (d.libelle || d.code || '').trim().toLowerCase() === dirName);
      if (foundDir) resolvedDirId = foundDir.id || null;
    }

    let resolvedSrvId = e.serviceId || null;
    if (!resolvedSrvId && e.service) {
      const targetSrv = (e.service || '').trim().toLowerCase();
      const foundSrv = this.services.find(s => (s.libelle || s.code || '').trim().toLowerCase() === targetSrv);
      if (foundSrv) resolvedSrvId = foundSrv.id || null;
    }

    this.form.patchValue({
      poste:            e.poste || '',
      fonction:         fctValue,
      service:          e.service || '',
      direction:        e.direction || e.departement || '',
      departement:      e.departement || e.direction || '',
      agence:           e.agence || '',
      categoriePro:     cat,
      echelon:          ech,
      grade:            computedGrade,
      statut:           e.statut || 'Actif',
      dateEmbauche:     e.dateEmbauche || '',
      modePaiement:     e.modePaiement || 'Virement bancaire',
      intituleCompte:   e.intituleCompte || (e.nom && e.prenom ? `${e.prenom} ${e.nom}` : ''),
      banque:           e.banque || '',
      iban:             e.iban || '',
      groupeRetraiteId: e.groupeRetraiteId || null,
      matricule:        e.matricule || '',
      numeroCnss:       e.numeroCnss || '',
      surSalaire:       e.surSalaire || 0,

      fonctionId: e.fonctionId || null,
      emploiId: e.emploiId || null,
      serviceId: resolvedSrvId,
      agenceId: resolvedAgenceId,
      directionId: resolvedDirId,
      departmentId: e.departmentId || null,
      regimeSecuriteSocialId: e.regimeSecuriteSocialId || null,

      gradeId: resolvedGradeId,
      categorieId: resolvedCatId,
      echelonId: resolvedEchId,
      grilleSalarialeId: resolvedGridId,
    });
  }

  private patchSalaryInformation(information: EmployeeSalaryInformation): void {
    this.salaryInformation = information;
    if (information.salaireNet != null) {
      this.currentNetSalary = information.salaireNet;
    }
    const values: Record<string, any> = {};
    if (information.modePaiement) values['modePaiement'] = information.modePaiement;
    if (information.intituleCompte) values['intituleCompte'] = information.intituleCompte;
    if (information.banque) values['banque'] = information.banque;
    if (information.iban) values['iban'] = information.iban;
    if (information.surSalaire != null) values['surSalaire'] = information.surSalaire;
    this.form.patchValue(values);
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  get selectedFonction(): RefItem | undefined {
    const fonctionId = this.form.get('fonctionId')?.value;

    return this.fonctions.find(
      item => String(item.id) === String(fonctionId)
    );
  }

  get selectedFonctionName(): string {
    return (
      this.selectedFonction?.libelle ||
      this.selectedFonction?.code ||
      ''
    ).toUpperCase();
  }

  get isChefService(): boolean {
    return this.selectedFonctionName.includes('CHEF DE SERVICE');
  }

  get isDirecteurDepartement(): boolean {
    return (
      this.selectedFonctionName.includes('DIRECTEUR DE DEPARTEMENT') ||
      this.selectedFonctionName.includes('RESPONSABLE DE DEPARTEMENT')
    );
  }

  get filteredDirections(): RefItem[] {
    const agenceId = this.form?.get('agenceId')?.value;
    if (!agenceId) {
      return this.directions;
    }

    const selectedAgence = this.agences.find(a => String(a.id) === String(agenceId));

    return this.directions.filter(dir => {
      if (dir.agenceId && String(dir.agenceId) === String(agenceId)) {
        return true;
      }
      if (selectedAgence && dir.agenceLibelle && dir.agenceLibelle.trim().toLowerCase() === selectedAgence.libelle?.trim().toLowerCase()) {
        return true;
      }
      // Si la direction n'a pas d'agence assignée, on ne l'affiche que si aucune agence spécifique n'est filtrée
      return false;
    });
  }

  onAgenceChange(): void {
    const currentDirId = this.form.get('directionId')?.value;
    if (currentDirId) {
      const valid = this.filteredDirections.some(d => String(d.id) === String(currentDirId));
      if (!valid) {
        this.form.get('directionId')?.setValue(null);
        this.form.get('serviceId')?.setValue(null);
      }
    }
  }

  get filteredServices(): RefItem[] {
    const dirId = this.form?.get('directionId')?.value;
    const depId = this.form?.get('departmentId')?.value;

    if (!dirId && !depId) {
      return this.services;
    }

    const selectedDir = this.directions.find(d => String(d.id) === String(dirId));
    const selectedDep = this.departements.find(d => String(d.id) === String(depId));

    return this.services.filter(srv => {
      let matchDir = false;
      if (dirId) {
        matchDir = (srv.directionId != null && String(srv.directionId) === String(dirId)) ||
                   (!!selectedDir && !!srv.directionLibelle && srv.directionLibelle.trim().toLowerCase() === selectedDir.libelle?.trim().toLowerCase());
      }

      let matchDep = false;
      if (depId) {
        matchDep = (srv.departementId != null && String(srv.departementId) === String(depId)) ||
                   (!!selectedDep && !!srv.departementLibelle && srv.departementLibelle.trim().toLowerCase() === selectedDep.libelle?.trim().toLowerCase());
      }

      if (dirId && depId) return matchDir || matchDep;
      if (dirId) return matchDir;
      if (depId) return matchDep;
      return true;
    });
  }

  onDirectionChange(): void {
    const currentServiceId = this.form.get('serviceId')?.value;
    if (currentServiceId) {
      const valid = this.filteredServices.some(s => String(s.id) === String(currentServiceId));
      if (!valid) {
        this.form.get('serviceId')?.setValue(null);
      }
    }
  }

  compareIds(a: any, b: any): boolean {
    if (a == null || b == null) return a === b;
    return String(a) === String(b);
  }

  getGradeGroupe(grade: RefItem | undefined): 'GROUPE I' | 'GROUPE II' | 'GROUPE III' | '' {
    if (!grade) return '';
    const text = ((grade.code || '') + ' ' + (grade.libelle || '')).toUpperCase();
    if (/\bGROUPE\s+III\b|\bGRP-3\b|\bGRP\s*3\b|\bIII\b/i.test(text)) return 'GROUPE III';
    if (/\bGROUPE\s+II\b|\bGRP-2\b|\bGRP\s*2\b|\bII\b/i.test(text)) return 'GROUPE II';
    if (/\bGROUPE\s+I\b|\bGRP-1\b|\bGRP\s*1\b|\bI\b/i.test(text)) return 'GROUPE I';
    return '';
  }

  getCategoryGroupe(cat: RefItem): 'GROUPE I' | 'GROUPE II' | 'GROUPE III' | '' {
    if (!cat) return '';
    const code = (cat.code || '').trim().toUpperCase();
    const lib = (cat.libelle || '').trim().toUpperCase();
    const norm = this.getCatCodeDisplay(lib || code);

    // 1. Détection Groupe III (Classes V à VIII / CL5 à CL8)
    if (['CL5', 'CL6', 'CL7', 'CL8'].includes(norm) ||
        ['V', 'VI', 'VII', 'VIII'].includes(code) ||
        /\bCLASSE\s*(V|VI|VII|VIII|5|6|7|8)\b/i.test(lib)) {
      return 'GROUPE III';
    }

    // 2. Détection Groupe II (Classes I à IV / CL1 à CL4)
    if (['CL1', 'CL2', 'CL3', 'CL4'].includes(norm) ||
        ['I', 'II', 'III', 'IV'].includes(code) ||
        /\bCLASSE\s*(I|II|III|IV|1|2|3|4)\b/i.test(lib)) {
      return 'GROUPE II';
    }

    // 3. Détection Groupe I (Catégories 1 à 7 / C1 à C7)
    if (['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'].includes(norm) ||
        ['1', '2', '3', '4', '5', '6', '7'].includes(code) ||
        /\b(1ÈRE|2ÈME|3ÈME|4ÈME|5ÈME|6ÈME|7ÈME|CATEGORIE)\b/i.test(lib)) {
      return 'GROUPE I';
    }

    return '';
  }

  get availableSalaryCategories(): RefItem[] {
    const gradeId = this.form?.get('gradeId')?.value;

    if (!gradeId) {
      return this.categories;
    }

    const selectedGrade = this.grades.find(g => String(g.id) === String(gradeId));
    const targetGroup = this.getGradeGroupe(selectedGrade);

    // 1. Filtrage prioritaire par nomenclature officielle du Groupe bancaire
    if (targetGroup) {
      const matched = this.categories.filter(c => this.getCategoryGroupe(c) === targetGroup);
      if (matched.length > 0) {
        return matched;
      }
    }

    // 2. Fallback via param_groupe si configuré
    if (this.paramGroupes && this.paramGroupes.length > 0 && targetGroup) {
      const pg = this.paramGroupes.find(p => (p.grade || p.libelle || '').toUpperCase().includes(targetGroup));
      if (pg && pg.categories && pg.categories.length > 0) {
        const allowedCodes = pg.categories.map(c => this.getCatCodeDisplay(c));
        const matched = this.categories.filter(c => allowedCodes.includes(this.getCatCodeDisplay(c.code || c.libelle || '')));
        if (matched.length > 0) return matched;
      }
    }

    // 3. Fallback via liaisons grilles salariales en base
    const allowedCategoryIds = new Set(
      this.grillesSalariales
        .filter(grid => String(grid.gradeId) === String(gradeId))
        .map(grid => String(grid.categorieId))
    );

    if (allowedCategoryIds.size > 0) {
      return this.categories.filter(category =>
        allowedCategoryIds.has(String(category.id))
      );
    }

    return this.categories;
  }

  get availableSalaryEchelons(): RefItem[] {
    const gradeId = this.form?.get('gradeId')?.value;
    const categorieId = this.form?.get('categorieId')?.value;

    if (!gradeId && !categorieId) {
      return this.echelons;
    }

    if (categorieId) {
      const allowedEchelonIds = new Set(
        this.grillesSalariales
          .filter(grid =>
            (!gradeId || !grid.gradeId || String(grid.gradeId) === String(gradeId)) &&
            String(grid.categorieId) === String(categorieId)
          )
          .map(grid => String(grid.echelonId))
      );

      if (allowedEchelonIds.size > 0) {
        return this.echelons.filter(echelon =>
          allowedEchelonIds.has(String(echelon.id))
        );
      }
    }

    return this.echelons;
  }

  getCatCodeDisplay(str: string): string {
    if (!str) return '';
    const upper = str.toUpperCase().trim();

    // 1. Classes bancaires (CL1 à CL8) - Tester impérativement de VIII à I pour éviter les faux positifs de sous-chaîne
    if (upper.includes('CLASSE VIII') || upper === 'VIII' || upper === 'CL8' || upper === 'CLASSE 8' || upper === 'CL VIII') return 'CL8';
    if (upper.includes('CLASSE VII') || upper === 'VII' || upper === 'CL7' || upper === 'CLASSE 7' || upper === 'CL VII') return 'CL7';
    if (upper.includes('CLASSE VI') || upper === 'VI' || upper === 'CL6' || upper === 'CLASSE 6' || upper === 'CL VI') return 'CL6';
    if (upper.includes('CLASSE V') || upper === 'V' || upper === 'CL5' || upper === 'CLASSE 5' || upper === 'CL V') return 'CL5';
    if (upper.includes('CLASSE IV') || upper === 'IV' || upper === 'CL4' || upper === 'CLASSE 4' || upper === 'CL IV') return 'CL4';
    if (upper.includes('CLASSE III') || upper === 'III' || upper === 'CL3' || upper === 'CLASSE 3' || upper === 'CL III') return 'CL3';
    if (upper.includes('CLASSE II') || upper === 'II' || upper === 'CL2' || upper === 'CLASSE 2' || upper === 'CL II') return 'CL2';
    if (upper.includes('CLASSE I') || upper === 'I' || upper === 'CL1' || upper === 'CLASSE 1' || upper === 'CL I') return 'CL1';

    // 2. Catégories d'exécution et maîtrise (C1 à C7)
    if (upper.includes('1ERE') || upper.includes('1ÈRE') || upper.includes('1RE') || upper.includes('CATEGORIE 1') || upper.includes('CAT 1') || upper === '1' || upper === 'C1') return 'C1';
    if (upper.includes('2EME') || upper.includes('2ÈME') || upper.includes('2E') || upper.includes('CATEGORIE 2') || upper.includes('CAT 2') || upper === '2' || upper === 'C2') return 'C2';
    if (upper.includes('3EME') || upper.includes('3ÈME') || upper.includes('3E') || upper.includes('CATEGORIE 3') || upper.includes('CAT 3') || upper === '3' || upper === 'C3') return 'C3';
    if (upper.includes('4EME') || upper.includes('4ÈME') || upper.includes('4E') || upper.includes('CATEGORIE 4') || upper.includes('CAT 4') || upper === '4' || upper === 'C4') return 'C4';
    if (upper.includes('5EME') || upper.includes('5ÈME') || upper.includes('5E') || upper.includes('CATEGORIE 5') || upper.includes('CAT 5') || upper === '5' || upper === 'C5') return 'C5';
    if (upper.includes('6EME') || upper.includes('6ÈME') || upper.includes('6E') || upper.includes('CATEGORIE 6') || upper.includes('CAT 6') || upper === '6' || upper === 'C6') return 'C6';
    if (upper.includes('7EME') || upper.includes('7ÈME') || upper.includes('7E') || upper.includes('CATEGORIE 7') || upper.includes('CAT 7') || upper === '7' || upper === 'C7') return 'C7';

    // 3. Hors Catégorie
    if (upper.includes('HORS') || upper.startsWith('HC')) return 'HC';

    return str;
  }

  getEchelonCodeDisplay(str: string): string {
    if (!str) return '';
    const upper = str.toUpperCase().trim();
    if (upper.includes('EXCEPT') || upper.endsWith('EX')) return 'EX';
    if (upper.startsWith('E') && !upper.startsWith('ECH')) {
      const num = parseInt(upper.substring(1), 10);
      if (!isNaN(num)) return num < 10 ? `E0${num}` : `E${num}`;
    }
    const numStr = str.replace(/[^0-9]/g, '');
    if (numStr) {
      const num = parseInt(numStr, 10);
      return num < 10 ? `E0${num}` : `E${num}`;
    }
    return str;
  }

  get associatedGrade(): string {
    const catId = this.form?.get('categorieId')?.value;
    const echId = this.form?.get('echelonId')?.value;
    const catObj = this.categories.find(c => String(c.id) === String(catId));
    const echObj = this.echelons.find(e => String(e.id) === String(echId));
    const catStr = catObj?.libelle || catObj?.code || this.form?.get('categoriePro')?.value || this.employee?.categoriePro || '';
    const echStr = echObj?.libelle || echObj?.code || this.form?.get('echelon')?.value || this.employee?.echelon || '';

    if (catStr && echStr) {
      const catCode = this.getCatCodeDisplay(catStr);
      const echCode = this.getEchelonCodeDisplay(echStr);
      if (catCode && echCode) {
        return `${catCode}${echCode}`;
      }
    }
    return this.form?.get('grade')?.value || this.employee?.grade || '—';
  }

  formatMontant(value: number): string {
    if (!value && value !== 0) return '0';
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value).replace(/\s/g, ' ');
  }

  onClassificationChange(): void {
    const gradeId = this.form.get('gradeId')?.value;
    const categorieId = this.form.get('categorieId')?.value;
    const echelonId = this.form.get('echelonId')?.value;

    let grid = this.grillesSalariales.find(item =>
      String(item.gradeId) === String(gradeId) &&
      String(item.categorieId) === String(categorieId) &&
      String(item.echelonId) === String(echelonId)
    );

    if (!grid && categorieId && echelonId) {
      grid = this.grillesSalariales.find(item =>
        String(item.categorieId) === String(categorieId) &&
        String(item.echelonId) === String(echelonId)
      );
    }

    const computedGrade = this.associatedGrade !== '—' ? this.associatedGrade : '';

    this.form.patchValue({
      grilleSalarialeId: grid?.id ? String(grid.id) : null,
      grade: computedGrade,
      ...(grid?.montant != null ? { salaireBase: grid.montant } : {})
    });

    this.triggerRecalculateNet();
  }

  onGradeChange(): void {
    const currentCatId = this.form.get('categorieId')?.value;
    const isStillValid = this.availableSalaryCategories.some(c => String(c.id) === String(currentCatId));
    if (!isStillValid) {
      this.form.patchValue({
        categorieId: null,
        echelonId: null,
        grilleSalarialeId: null,
        grade: ''
      });
    } else {
      this.onClassificationChange();
    }
  }

  onCategoryChange(): void {
    const currentEchId = this.form.get('echelonId')?.value;
    const isStillValid = this.availableSalaryEchelons.some(e => String(e.id) === String(currentEchId));
    if (!isStillValid) {
      this.form.patchValue({
        echelonId: null,
        grilleSalarialeId: null,
        grade: ''
      });
    } else {
      this.onClassificationChange();
    }
  }

  get selectedSalaryGrid(): RefItem | undefined {
    const id = this.form.get('grilleSalarialeId')?.value;
    if (id) {
      const found = this.grillesSalariales.find(item => String(item.id) === String(id));
      if (found) return found;
    }

    const catId = this.form.get('categorieId')?.value;
    const echId = this.form.get('echelonId')?.value;
    if (catId && echId) {
      return this.grillesSalariales.find(item =>
        String(item.categorieId) === String(catId) &&
        String(item.echelonId) === String(echId)
      );
    }

    return undefined;
  }

  save(next?: string): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.saveError = '';
    this.saved = false;
    const v = this.form.getRawValue();

    // Résoudre l'âge de retraite depuis le groupe sélectionné
    let ageRetraiteResolu: number | undefined;
    if (v.groupeRetraiteId) {
      const grp = this.parametragesRetraite.find(p => String(p.id) === String(v.groupeRetraiteId));
      if (grp) ageRetraiteResolu = Number(grp.ageRetraite || grp.taux || grp.montant || 60);
    }

    const selectedFonction = this.fonctions.find(item => String(item.id) === String(v.fonctionId));

    const selectedEmploi = this.emplois.find(item => String(item.id) === String(v.emploiId));

    const selectedService = this.services.find(item => String(item.id) === String(v.serviceId));

    const selectedAgence = this.agences.find(item => String(item.id) === String(v.agenceId));

    const selectedDirection = this.directions.find(item => String(item.id) === String(v.directionId));

    const selectedDepartment = this.departements.find(item => String(item.id) === String(v.departmentId));

    const selectedGrade = this.grades.find(item => String(item.id) === String(v.gradeId));

    const selectedCategory = this.categories.find(item => String(item.id) === String(v.categorieId));

    const selectedEchelon = this.echelons.find(item => String(item.id) === String(v.echelonId));

    const selectedRegimeSecuriteSocial = this.regimesSecuriteSocial.find(item => String(item.id) === String(v.regimeSecuriteSocialId));

    const updatePayload: Partial<Employee> = {

      fonctionId: v.fonctionId,
      emploiId: v.emploiId,
      serviceId: v.serviceId,
      agenceId: v.agenceId,
      directionId: v.directionId,
      departmentId: v.departmentId,

      gradeId: v.gradeId ? String(v.gradeId) : undefined,
      categorieId: v.categorieId ? String(v.categorieId) : undefined,
      echelonId: v.echelonId ? String(v.echelonId) : undefined,
      grilleSalarialeId: v.grilleSalarialeId ? String(v.grilleSalarialeId) : (this.selectedSalaryGrid?.id ? String(this.selectedSalaryGrid.id) : undefined),

      regimeSecuriteSocialId: v.regimeSecuriteSocialId,

      regimeSecuriteSocialCode: selectedRegimeSecuriteSocial?.code || '',

      regimeSecuriteSocialLibelle: selectedRegimeSecuriteSocial?.libelle || '',

      poste:            selectedEmploi?.libelle || selectedEmploi?.code || '',
      fonction:         selectedFonction?.libelle || selectedFonction?.code || '',
      service:          selectedService?.libelle || selectedService?.code || '',
      direction:        selectedDirection?.libelle || selectedDirection?.code || '',
      departement:      selectedDepartment?.libelle || selectedDepartment?.code || '',
      agence:           selectedAgence?.libelle || selectedAgence?.code || '',
      categoriePro:     selectedCategory?.libelle || selectedCategory?.code || '',
      echelon:          selectedEchelon?.libelle || selectedEchelon?.code || '',
      grade:            (this.associatedGrade && this.associatedGrade !== '—') ? this.associatedGrade : this.formatGradeCode(this.selectedSalaryGrid?.code || selectedGrade?.libelle || selectedGrade?.code, selectedCategory?.libelle || selectedCategory?.code, selectedEchelon?.libelle || selectedEchelon?.code),
      salaireBase:      this.selectedSalaryGrid?.montant != null ? this.selectedSalaryGrid.montant : (v.salaireBase || 0),
      surSalaire:       v.surSalaire ? Number(v.surSalaire) : 0,
      matricule:        v.matricule?.trim() || this.employee?.matricule || '',
      numeroCnss:       v.numeroCnss?.trim() || '',
      statut:           v.statut,
      dateEmbauche:     v.dateEmbauche,
      modePaiement:     v.modePaiement,
      intituleCompte:   v.intituleCompte,
      banque:           v.banque,
      iban:             v.iban,
      groupeRetraiteId: v.groupeRetraiteId,
      ...(ageRetraiteResolu !== undefined && { ageRetraite: ageRetraiteResolu })
    };

    this.employeeService.update(this.empId, updatePayload).pipe(
      switchMap(() => forkJoin({
        employee: this.employeeService.getById(this.empId),
        salaryInformation: this.employeeService.getSalaryInformation(this.empId)
      }))
    ).subscribe({
      next: ({ employee: updated, salaryInformation }) => {
        this.saving = false;
        this.employee = updated;
        this.patch(updated);
        this.patchSalaryInformation(salaryInformation);

        const persisted = this.form.getRawValue();
        const classificationPersisted =
          String(persisted.gradeId) === String(v.gradeId) &&
          String(persisted.categorieId) === String(v.categorieId) &&
          String(persisted.echelonId) === String(v.echelonId) &&
          String(persisted.grilleSalarialeId) === String(v.grilleSalarialeId);

        if (!classificationPersisted) {
          this.saveError = 'La classification enregistrée n’a pas pu être relue depuis le backend.';
          return;
        }

        if (this.isCreationMode && next) {
          this.router.navigate(['/grh/employes', this.empId, next], { queryParams: { mode: 'creation' } });
        } else {
          this.saved = true;
          this.form.disable();
          this.isEditing = false;
        }
      },
      error: err => {
        this.saving = false;
        this.saveError = err?.error?.message || err?.message || 'Impossible d’enregistrer les informations professionnelles.';
      }
    });
  }

  goToContrats(): void { this.router.navigate(['/grh/contrats']); }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }

  preventNegativeInput(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e' || event.key === 'E' || event.key === '+') {
      event.preventDefault();
    }
  }

  onSurSalaireInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && Number(input.value) < 0) {
      input.value = '0';
      this.form.get('surSalaire')?.setValue(0);
    }
  }

  triggerRecalculateNet(): void {
    const base = this.selectedSalaryGrid?.montant != null
      ? this.selectedSalaryGrid.montant
      : (Number(this.form?.get('salaireBase')?.value) || (this.employee?.salaireBase || 0));
    const rawSur = Number(this.form?.get('surSalaire')?.value) || 0;
    const sur = Math.max(0, rawSur);

    // Calcul réactif instantané (0 délai perceptible lors de la saisie)
    this.computeInstantNet(base, sur);

    // Confirmation officielle auprès du moteur de calcul du backend
    if (this.empId && !this.isCreationMode) {
      this.employeeService.simulateSalary(this.empId, base, sur).subscribe({
        next: (simulated) => {
          if (simulated && simulated.salaireNet != null) {
            this.currentNetSalary = simulated.salaireNet;
          }
        },
        error: () => {}
      });
    }
  }

  private computeInstantNet(salaireBase: number, surSalaire: number): void {
    const base = Math.max(0, Number(salaireBase) || 0);
    const sur = Math.max(0, Number(surSalaire) || 0);
    const totalIndemnites = this.salaryInformation?.totalIndemnites || 0;
    const totalExonerations = this.salaryInformation?.totalExonerations || 0;

    let primeAnciennete = 0;
    if (this.employee?.dateEmbauche) {
      try {
        const dateEmb = new Date(this.employee.dateEmbauche);
        const now = new Date();
        let years = now.getFullYear() - dateEmb.getFullYear();
        const m = now.getMonth() - dateEmb.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < dateEmb.getDate())) years--;
        if (years === 3) primeAnciennete = Math.round(base * 0.05);
        else if (years > 3) primeAnciennete = Math.round(base * (0.05 + (years - 3) * 0.01));
      } catch {}
    }

    const remunerationBrute = base + sur + totalIndemnites + primeAnciennete;
    const tauxAbattement = (this.salaryInformation?.abattementForfaitaire && this.salaryInformation?.salaireBase)
      ? (this.salaryInformation.abattementForfaitaire / this.salaryInformation.salaireBase)
      : 0.20;
    const abattementForfaitaire = Math.round(base * tauxAbattement);
    const baseImposable = Math.max(0, remunerationBrute - totalExonerations - abattementForfaitaire);

    // Retenues
    const cotisationCNSS = Math.round(remunerationBrute * 0.055);
    const crrae = Math.round((base + sur + primeAnciennete) * 0.05);

    // IUTS (barème officiel Burkina Faso)
    let iutsBrut = 0;
    if (baseImposable > 250000) iutsBrut = 39430 + (baseImposable - 250000) * 0.25;
    else if (baseImposable > 170000) iutsBrut = 24200 + (baseImposable - 170000) * 0.23;
    else if (baseImposable > 120000) iutsBrut = 13700 + (baseImposable - 120000) * 0.21;
    else if (baseImposable > 80000) iutsBrut = 6500 + (baseImposable - 80000) * 0.18;
    else if (baseImposable > 50000) iutsBrut = 2000 + (baseImposable - 50000) * 0.15;
    else if (baseImposable > 30000) iutsBrut = (baseImposable - 30000) * 0.10;
    iutsBrut = Math.round(iutsBrut);

    const charges = this.salaryInformation?.nombrePersonnesCharge || 0;
    let tauxReduction = 0;
    if (charges === 1) tauxReduction = 0.08;
    else if (charges === 2) tauxReduction = 0.10;
    else if (charges === 3) tauxReduction = 0.12;
    else if (charges >= 4) tauxReduction = 0.14;

    const reduction = Math.round(iutsBrut * tauxReduction);
    const iutsNet = Math.max(0, iutsBrut - reduction);

    const totalRetenues = cotisationCNSS + crrae + iutsNet;
    this.currentNetSalary = Math.max(0, remunerationBrute - totalRetenues);
  }
}
