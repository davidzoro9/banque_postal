import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, switchMap } from 'rxjs';
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
    if (!cat) return '';
    const upper = cat.toUpperCase().trim();
    if (upper.includes('CL8') || upper.includes('VIII')) return 'CL8';
    if (upper.includes('CL7') || upper.includes('VII')) return 'CL7';
    if (upper.includes('CL6') || upper.includes('VI')) return 'CL6';
    if (upper.includes('CL5') || upper.includes('V')) return 'CL5';
    if (upper.includes('CL4') || upper.includes('IV')) return 'CL4';
    if (upper.includes('CL3') || upper.includes('III')) return 'CL3';
    if (upper.includes('CL2') || upper.includes('II')) return 'CL2';
    if (upper.includes('CL1') || upper.includes('CLASSE I')) return 'CL1';
    if (upper.includes('C7') || upper.includes('7')) return 'C7';
    if (upper.includes('C6') || upper.includes('6')) return 'C6';
    if (upper.includes('C5') || upper.includes('5')) return 'C5';
    if (upper.includes('C4') || upper.includes('4')) return 'C4';
    if (upper.includes('C3') || upper.includes('3')) return 'C3';
    if (upper.includes('C2') || upper.includes('2')) return 'C2';
    if (upper.includes('C1') || upper.includes('1')) return 'C1';
    return upper;
  }

  formatGradeCode(rawGrade?: string, rawCat?: string, rawEch?: string): string {
    if (rawGrade && /^(C|CL|HC)\d*(E\d+|EX)$/i.test(rawGrade.trim())) {
      return rawGrade.trim().toUpperCase();
    }

    let g = (rawGrade || '').trim();
    let c = (rawCat || '').trim();
    let e = (rawEch || '').trim();

    if (g.includes('Échelon') || g.includes('Echelon') || g.includes('ECHELON') || g.includes('echelon')) {
      const parts = g.split(/(?=Échelon|Echelon|ECHELON|echelon)/i);
      if (parts.length >= 2) {
        if (!c) c = parts[0].trim();
        if (!e) e = parts[1].trim();
      }
    }

    let catCode = '';
    const cUpper = (c || g).toUpperCase();
    if (cUpper.includes('HORS') || cUpper.startsWith('HC')) {
      catCode = 'HC';
    } else if (cUpper.includes('CLASSE') || cUpper.startsWith('CL')) {
      const m = cUpper.match(/\d+|I{1,3}|IV|V|VI{1,3}|VIII/);
      if (m) {
        const romanToNum: Record<string, string> = { 'I': '1', 'II': '2', 'III': '3', 'IV': '4', 'V': '5', 'VI': '6', 'VII': '7', 'VIII': '8' };
        const num = romanToNum[m[0]] || m[0];
        catCode = `CL${num}`;
      } else {
        catCode = 'CL1';
      }
    } else {
      const num = cUpper.replace(/[^0-9]/g, '');
      catCode = num ? `C${num}` : 'C1';
    }

    let echCode = '';
    const eUpper = (e || g).toUpperCase();
    if (eUpper.includes('EXCEPT') || eUpper.endsWith('EX')) {
      echCode = 'EX';
    } else {
      const m = eUpper.replace(/[^0-9]/g, '');
      if (m) {
        const num = parseInt(m, 10);
        echCode = num < 10 ? `E0${num}` : `E${num}`;
      } else {
        echCode = 'E01';
      }
    }

    return `${catCode}${echCode}`;
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
    const gradeLabel = (gradeObj?.libelle || gradeObj?.code || this.employee?.grade || '').toUpperCase();

    const catId = this.form?.get('categorieId')?.value || this.employee?.categorieId;
    const catObj = this.categories.find(c => String(c.id) === String(catId));
    const catLabel = (catObj?.libelle || catObj?.code || this.employee?.categoriePro || '').toUpperCase();

    let groupe = 'GROUPE I';
    if (gradeLabel.includes('GROUPE III') || gradeLabel.includes('III') || catLabel.startsWith('CL5') || catLabel.startsWith('CL6') || catLabel.startsWith('CL7') || catLabel.startsWith('CL8')) {
      groupe = 'GROUPE III';
    } else if (gradeLabel.includes('GROUPE II') || gradeLabel.includes('II') || catLabel.startsWith('CL1') || catLabel.startsWith('CL2') || catLabel.startsWith('CL3') || catLabel.startsWith('CL4')) {
      groupe = 'GROUPE II';
    }

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
      groupeRetraiteId:     [null]
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

    let resolvedGradeId = e.gradeId || null;
    let resolvedCatId = e.categorieId || null;
    let resolvedEchId = e.echelonId || null;
    let resolvedGridId = e.grilleSalarialeId || null;

    // Auto-détection si les identifiants ne sont pas renseignés
    if (!resolvedCatId && (e.categoriePro || cat)) {
      const catCode = this.getCatCodeDisplay(e.categoriePro || cat);
      const foundCat = this.categories.find(c => this.getCatCodeDisplay(c.code || c.libelle || '') === catCode);
      if (foundCat) resolvedCatId = foundCat.id || null;
    }

    if (!resolvedEchId && (e.echelon || ech)) {
      const echCode = this.getEchelonCodeDisplay(e.echelon || ech);
      const foundEch = this.echelons.find(ec => this.getEchelonCodeDisplay(ec.code || ec.libelle || '') === echCode);
      if (foundEch) resolvedEchId = foundEch.id || null;
    }

    if (resolvedCatId && resolvedEchId && (!resolvedGradeId || !resolvedGridId)) {
      const foundGrid = this.grillesSalariales.find(g =>
        String(g.categorieId) === String(resolvedCatId) && String(g.echelonId) === String(resolvedEchId)
      );
      if (foundGrid) {
        if (!resolvedGridId) resolvedGridId = foundGrid.id || null;
        if (!resolvedGradeId && foundGrid.gradeId) resolvedGradeId = foundGrid.gradeId || null;
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
    const values: Record<string, string> = {};
    if (information.modePaiement) values['modePaiement'] = information.modePaiement;
    if (information.intituleCompte) values['intituleCompte'] = information.intituleCompte;
    if (information.banque) values['banque'] = information.banque;
    if (information.iban) values['iban'] = information.iban;
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

  get availableSalaryCategories(): RefItem[] {
    const gradeId = this.form.get('gradeId')?.value;

    if (!gradeId) {
      return this.categories;
    }

    const allowedCategoryIds = new Set(
      this.grillesSalariales
        .filter(grid =>
          String(grid.gradeId) === String(gradeId)
        )
        .map(grid => String(grid.categorieId))
    );

    return this.categories.filter(category =>
      allowedCategoryIds.has(String(category.id))
    );
  }

  get availableSalaryEchelons(): RefItem[] {
    const gradeId = this.form.get('gradeId')?.value;
    const categorieId = this.form.get('categorieId')?.value;

    if (!gradeId || !categorieId) {
      return [];
    }

    const allowedEchelonIds = new Set(
      this.grillesSalariales
        .filter(grid =>
          String(grid.gradeId) === String(gradeId) &&
          String(grid.categorieId) === String(categorieId)
        )
        .map(grid => String(grid.echelonId))
    );

    return this.echelons.filter(echelon =>
      allowedEchelonIds.has(String(echelon.id))
    );
  }

  getCatCodeDisplay(str: string): string {
    if (!str) return '';
    const upper = str.toUpperCase().trim();
    if (upper.includes('1ERE') || upper.includes('1ÈRE') || upper.includes('1RE') || upper.includes('CATEGORIE 1') || upper.includes('CAT 1')) return 'C1';
    if (upper.includes('2EME') || upper.includes('2ÈME') || upper.includes('2E') || upper.includes('CATEGORIE 2') || upper.includes('CAT 2')) return 'C2';
    if (upper.includes('3EME') || upper.includes('3ÈME') || upper.includes('3E') || upper.includes('CATEGORIE 3') || upper.includes('CAT 3')) return 'C3';
    if (upper.includes('4EME') || upper.includes('4ÈME') || upper.includes('4E') || upper.includes('CATEGORIE 4') || upper.includes('CAT 4')) return 'C4';
    if (upper.includes('5EME') || upper.includes('5ÈME') || upper.includes('5E') || upper.includes('CATEGORIE 5') || upper.includes('CAT 5')) return 'C5';
    if (upper.includes('6EME') || upper.includes('6ÈME') || upper.includes('6E') || upper.includes('CATEGORIE 6') || upper.includes('CAT 6')) return 'C6';
    if (upper.includes('7EME') || upper.includes('7ÈME') || upper.includes('7E') || upper.includes('CATEGORIE 7') || upper.includes('CAT 7')) return 'C7';
    if (upper.includes('CLASSE 1') || upper.includes('CL1') || upper.includes('CLASSE I') || upper.includes('CL I')) return 'CL1';
    if (upper.includes('CLASSE 2') || upper.includes('CL2') || upper.includes('CLASSE II') || upper.includes('CL II')) return 'CL2';
    if (upper.includes('CLASSE 3') || upper.includes('CL3') || upper.includes('CLASSE III') || upper.includes('CL III')) return 'CL3';
    if (upper.includes('CLASSE 4') || upper.includes('CL4') || upper.includes('CLASSE IV') || upper.includes('CL IV')) return 'CL4';
    if (upper.includes('CLASSE 5') || upper.includes('CL5') || upper.includes('CLASSE V') || upper.includes('CL V')) return 'CL5';
    if (upper.includes('CLASSE 6') || upper.includes('CL6') || upper.includes('CLASSE VI') || upper.includes('CL VI')) return 'CL6';
    if (upper.includes('CLASSE 7') || upper.includes('CL7') || upper.includes('CLASSE VII') || upper.includes('CL VII')) return 'CL7';
    if (upper.includes('CLASSE 8') || upper.includes('CL8') || upper.includes('CLASSE VIII') || upper.includes('CL VIII')) return 'CL8';
    return str;
  }

  getEchelonCodeDisplay(str: string): string {
    if (!str) return '';
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
      return `${catCode}${echCode}`;
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

    const grid = this.grillesSalariales.find(item =>
      String(item.gradeId) === String(gradeId) &&
      String(item.categorieId) === String(categorieId) &&
      String(item.echelonId) === String(echelonId)
    );

    this.form.patchValue({
      grilleSalarialeId: grid?.id || null,
      grade: this.associatedGrade !== '—' ? this.associatedGrade : ''
    });
  }

  onGradeChange(): void {
    this.form.patchValue({
      categorieId: null,
      echelonId: null,
      grilleSalarialeId: null,
      grade: ''
    });
  }

  onCategoryChange(): void {
    this.form.patchValue({
      echelonId: null,
      grilleSalarialeId: null,
      grade: ''
    });
  }

  get selectedSalaryGrid(): RefItem | undefined {
    const id = this.form.get('grilleSalarialeId')?.value;

    return this.grillesSalariales.find(
      item => String(item.id) === String(id)
    );
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

      gradeId: v.gradeId,
      categorieId: v.categorieId,
      echelonId: v.echelonId,
      grilleSalarialeId: v.grilleSalarialeId,

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
      grade:            this.formatGradeCode(this.selectedSalaryGrid?.code || selectedGrade?.libelle || selectedGrade?.code, selectedCategory?.libelle || selectedCategory?.code, selectedEchelon?.libelle || selectedEchelon?.code),
      salaireBase:      this.selectedSalaryGrid?.montant || 0,
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
}
