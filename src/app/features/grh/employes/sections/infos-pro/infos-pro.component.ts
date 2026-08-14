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

    // this.fonctions$.subscribe(list => {
    //   if (list && list.length > 0) {
    //     this.fonctionsList = list;
    //   }
    // });

    this.emplois$.subscribe(items => this.emplois = items);
    this.fonctions$.subscribe(items => {
      this.fonctions = items;
      this.fonctionsList = items;
    });
    this.directions$.subscribe(items => this.directions = items);
    this.departements$.subscribe(items => this.departements = items);
    this.services$.subscribe(items => this.services = items);
    this.agences$.subscribe(items => this.agences = items);

    this.grades$.subscribe(items => this.grades = items);
    this.categories$.subscribe(items => this.categories = items);
    this.echelons$.subscribe(items => this.echelons = items);
    this.grillesSalariales$.subscribe(items => {
      this.grillesSalariales = items;
    });

    this.regimesSecuriteSocial$.subscribe(items => this.regimesSecuriteSocial = items.filter( item => item.actif !== false ));

    this.dbRefService.getItems('param-retraite').subscribe(items => {
      this.parametragesRetraite = items.filter(item => item.actif !== false);
    });

    this.employeeService.getById(this.empId).subscribe({
      next: e => {
        this.employee = e;
        this.buildForm();
        this.patch(e);
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

  // private updateComputedGrade(): void {
  //   if (!this.form) return;
  //   const cat = this.parseCat(this.form.get('categoriePro')?.value || '');
  //   let ech = (this.form.get('echelon')?.value || '').trim();
  //   if (ech) {
  //     const num = parseInt(ech.replace(/[^0-9]/g, ''), 10);
  //     if (!isNaN(num)) ech = num < 10 ? `E0${num}` : `E${num}`;
  //   }
  //   const computedGrade = (cat && ech) ? `${cat}${ech}` : (cat || ech || '');
  //   this.form.get('grade')?.setValue(computedGrade, { emitEvent: false });
  // }

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
      serviceId: e.serviceId || null,
      agenceId: e.agenceId || null,
      directionId: e.directionId || null,
      departmentId: e.departmentId || null,
      regimeSecuriteSocialId: e.regimeSecuriteSocialId || null,

      gradeId: e.gradeId || null,
      categorieId: e.categorieId || null,
      echelonId: e.echelonId || null,
      grilleSalarialeId: e.grilleSalarialeId || null,
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
      grilleSalarialeId: grid?.id || null
    });
  }

  onGradeChange(): void {
    this.form.patchValue({
      categorieId: null,
      echelonId: null,
      grilleSalarialeId: null
    });
  }

  onCategoryChange(): void {
    this.form.patchValue({
      echelonId: null,
      grilleSalarialeId: null
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
      grade:            this.selectedSalaryGrid?.code || selectedGrade?.libelle || selectedGrade?.code || '',
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
