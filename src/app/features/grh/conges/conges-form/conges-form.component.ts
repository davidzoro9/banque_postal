import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { CongeService, SoldeConge, TypeAbsenceConge, ParametrageConge } from '../services/conge.service';
import { AuthService } from '../../../../core/services/auth.service';
import { BehaviorSubject, Observable, combineLatest, startWith, map, of } from 'rxjs';
import { EmployeeService } from '../../employes/services/employee.service';
import { Employee } from '../../employes/models/employee.model';

@Component({
  selector: 'app-conges-form',
  templateUrl: './conges-form.component.html',
  styleUrls: ['./conges-form.component.scss'],
  standalone: false
})
export class CongesFormComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'conges') || APP_MODULES.find(m => m.id === 'grh')!;
  form!: FormGroup;
  saving = false;

  parametrage: ParametrageConge | null = null;
  typesConge: TypeAbsenceConge[] = [];
  joursFeries: any[] = [];
  employeesList: Employee[] = [];
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  filteredEmployees$!: Observable<Employee[]>;
  selectedEmployeeObj?: Employee;
  selectedEmployeeSolde?: SoldeConge;
  currentUserEmp: Employee | null = null;

  categoryFilter: 'ACCIDENT_MALADIE' | 'URGENCES' | 'TOUS' = 'ACCIDENT_MALADIE';
  searchTypeQuery: string = '';
  showAgentPicker = true;
  dateReprisePrevue: Date | null = null;
  dureesRapides = [1, 2, 3, 5, 7, 10, 15, 30];

  // Gestion de la pièce jointe justificative
  selectedFileName: string = '';
  selectedFileSize: string = '';
  selectedFileBase64: string = '';

  onFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        this.snackBar.open('Le fichier dépasse la taille maximale autorisée (10 Mo).', 'Fermer', { duration: 4000 });
        return;
      }
      this.selectedFileName = file.name;
      this.selectedFileSize = this.formatFileSize(file.size);

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = String(reader.result || '');
        this.form.patchValue({ justificatif: this.selectedFileBase64 });
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(): void {
    this.selectedFileName = '';
    this.selectedFileSize = '';
    this.selectedFileBase64 = '';
    this.form.patchValue({ justificatif: '' });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Ko';
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getFileIcon(filename: string): string {
    if (!filename) return 'insert_drive_file';
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'picture_as_pdf';
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image';
    if (['doc', 'docx'].includes(ext || '')) return 'description';
    return 'insert_drive_file';
  }

  get selectedTypeObj(): TypeAbsenceConge | undefined {
    const typeId = this.form?.get('typeAbsenceCongeId')?.value;
    if (!typeId) return undefined;
    return this.typesConge.find(t => String(t.id) === String(typeId));
  }

  /**
   * Filtrage strict pour le formulaire DRH :
   * Exclut formellement les congés annuels ordinaires (qui relèvent de Mon Espace).
   */
  get filteredTypesConge(): TypeAbsenceConge[] {
    const empSexe = (this.selectedEmployeeObj?.sexe || '').toUpperCase();
    const isFemme = empSexe.startsWith('F') || empSexe.includes('FEM');
    const isHomme = empSexe.startsWith('M') || empSexe.includes('HOM');

    return this.typesConge.filter(t => {
      const code = (t.code || '').toUpperCase();
      const name = (t.name || '').toLowerCase();

      // INTERDICTION FORMELLE : Aucun congé annuel ordinaire depuis ce formulaire DRH
      if (code === 'CONGE_ANNUEL' || (code.includes('ANNUEL') && !code.includes('MALADIE')) || name.includes('annuel')) {
        return false;
      }

      const req = (t.sexeRequis || '').toUpperCase();
      if (req === 'FEMININ' || code.includes('MATERNITE')) {
        return !isHomme;
      }
      if (req === 'MASCULIN' || code.includes('PATERNITE')) {
        return !isFemme;
      }
      return true;
    });
  }

  get accidentMaladieList(): TypeAbsenceConge[] {
    return this.filteredTypesConge.filter(t => {
      const code = (t.code || '').toUpperCase();
      const name = (t.name || '').toLowerCase();
      return code.includes('ACCIDENT') || code.includes('MALADIE') || name.includes('accident') || name.includes('maladie');
    });
  }

  get urgencesList(): TypeAbsenceConge[] {
    return this.filteredTypesConge.filter(t => {
      const code = (t.code || '').toUpperCase();
      const name = (t.name || '').toLowerCase();
      const isAccidentOrMaladie = code.includes('ACCIDENT') || code.includes('MALADIE') || name.includes('accident') || name.includes('maladie');
      return !isAccidentOrMaladie;
    });
  }

  get displayedTypes(): TypeAbsenceConge[] {
    let list = this.filteredTypesConge;
    if (this.categoryFilter === 'ACCIDENT_MALADIE') {
      list = this.accidentMaladieList;
    } else if (this.categoryFilter === 'URGENCES') {
      list = this.urgencesList;
    }
    if (this.searchTypeQuery && this.searchTypeQuery.trim()) {
      const q = this.searchTypeQuery.toLowerCase().trim();
      list = list.filter(t => (t.name || '').toLowerCase().includes(q) || (t.code || '').toLowerCase().includes(q));
    }
    return list;
  }

  setCategorieActive(cat: 'ACCIDENT_MALADIE' | 'URGENCES' | 'TOUS'): void {
    this.categoryFilter = cat;
    const list = this.displayedTypes;
    if (list && list.length > 0) {
      const currentId = this.form.get('typeAbsenceCongeId')?.value;
      const stillInList = list.some(t => String(t.id) === String(currentId));
      if (!stillInList) {
        this.form.patchValue({ typeAbsenceCongeId: list[0].id });
        this.onTypeChange();
      }
    }
  }

  selectType(type: TypeAbsenceConge): void {
    this.form.patchValue({ typeAbsenceCongeId: type.id });
    this.onTypeChange();
  }

  isTypeSelected(typeId: any): boolean {
    return String(this.form.get('typeAbsenceCongeId')?.value) === String(typeId);
  }

  isDureeConnue(type: TypeAbsenceConge | undefined | null): boolean {
    if (!type) return false;
    const code = (type.code || '').toUpperCase();
    const name = (type.name || '').toLowerCase();
    // Accidents et maladies sont soumis à la prescription médicale d'arrêt
    if (code.includes('ACCIDENT') || name.includes('accident')) return false;
    if (code.includes('MALADIE') || name.includes('maladie')) return false;
    if (code.includes('FORCE_MAJEURE') || name.includes('force majeure')) return false;
    if (code === 'SANS_SOLDE' || name.includes('sans solde')) return false;

    if (code.includes('MATERNITE') || name.includes('materni')) return true;
    if (code.includes('PATERNITE') || name.includes('paterni')) return true;
    if (code.includes('MARIAGE') || name.includes('mariage')) return true;
    if (code.includes('DECES') || name.includes('décès') || name.includes('deces')) return true;
    if (code.includes('NAISSANCE') || name.includes('naissance')) return true;

    return !!(type.dureeMaxLegaleJours && type.dureeMaxLegaleJours > 0 && type.dureeMaxLegaleJours <= 10);
  }

  getDureeConnue(type: TypeAbsenceConge | undefined | null): number {
    if (!type) return 1;
    const code = (type.code || '').toUpperCase();
    const name = (type.name || '').toLowerCase();
    if (code.includes('MATERNITE') || name.includes('materni')) return 98;
    if (code.includes('PATERNITE') || name.includes('paterni')) return 3;
    if (code.includes('MARIAGE') || name.includes('mariage')) return type.dureeMaxLegaleJours || 3;
    if (code.includes('DECES') || name.includes('décès') || name.includes('deces')) return type.dureeMaxLegaleJours || 5;
    if (code.includes('NAISSANCE') || name.includes('naissance')) return type.dureeMaxLegaleJours || 3;
    return type.dureeMaxLegaleJours || 1;
  }

  onTypeChange(): void {
    const t = this.selectedTypeObj;
    if (!t) return;
    if (this.isDureeConnue(t)) {
      const dFixe = this.getDureeConnue(t);
      this.form.patchValue({ dureeDemandee: dFixe }, { emitEvent: false });
      this.recalculerDepuisDuree(dFixe);
    } else {
      const cur = Number(this.form.get('dureeDemandee')?.value || 0);
      if (cur <= 0 || cur === 98) {
        this.form.patchValue({ dureeDemandee: 3 }, { emitEvent: false });
        this.recalculerDepuisDuree(3);
      } else {
        this.recalculerDepuisDuree(cur);
      }
    }
  }

  getTypeIcon(type: TypeAbsenceConge): string {
    const code = (type.code || '').toUpperCase();
    const name = (type.name || '').toLowerCase();
    if (code.includes('ACCIDENT') || name.includes('accident')) return 'personal_injury';
    if (code.includes('MALADIE') || name.includes('maladie')) return 'medical_services';
    if (code.includes('FORCE_MAJEURE') || name.includes('force majeure')) return 'emergency';
    if (code.includes('DECES') || name.includes('décès') || name.includes('deces')) return 'sentiment_very_dissatisfied';
    if (code.includes('NAISSANCE') || name.includes('naissance')) return 'child_friendly';
    if (code.includes('MARIAGE') || name.includes('mariage')) return 'favorite';
    if (code.includes('MATERNITE') || name.includes('materni')) return 'child_care';
    if (code.includes('PATERNITE') || name.includes('paterni')) return 'family_restroom';
    return 'health_and_safety';
  }

  getTypeDescription(type?: TypeAbsenceConge): string {
    if (!type) return '';
    const code = (type.code || '').toUpperCase();
    if (code.includes('ACCIDENT')) {
      return 'Accident du travail ou de trajet domicile-banque. Prise en charge CNSS et maintien bancaire selon les accords collectifs.';
    }
    if (code.includes('MALADIE')) {
      return 'Arrêt pour raison de santé ou maladie subite — Incapacité temporaire sous présentation obligatoire du certificat médical conforme.';
    }
    if (code.includes('FORCE_MAJEURE')) {
      return 'Événement imprévisible, irrésistible et extérieur empêchant l\'agent de se rendre à la banque (sinistre, urgence grave).';
    }
    if (code.includes('MATERNITE')) {
      return 'Congé légal de maternité — Arrêt pour accouchement accordé aux collaboratrices. Indemnisation CNSS avec différentiel bancaire.';
    }
    if (code.includes('PATERNITE')) {
      return 'Congé de paternité — 3 jours consécutifs accordés au collaborateur pour la venue d\'un enfant au foyer.';
    }
    if (code.includes('MARIAGE')) {
      return 'Absence exceptionnelle rémunérée — 3 jours ouvrables autorisés pour le mariage de l\'agent (sur acte d\'état civil).';
    }
    if (code.includes('DECES')) {
      return 'Absence exceptionnelle rémunérée — Décès d\'un proche parent (certificat d\'inhumation / acte de décès requis).';
    }
    if (code.includes('NAISSANCE')) {
      return 'Absence autorisée pour formalités administratives de naissance d\'un enfant au foyer.';
    }
    return (type as any).description || 'Absence exceptionnelle autorisée selon les dispositions du Code du Travail et du Règlement Intérieur BPBF.';
  }

  dateFilter = (d: Date | null): boolean => {
    if (!d) return true;
    return d.getDay() !== 0; // Dimanche exclu
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private moduleNav: ModuleNavService,
    private congeService: CongeService,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.initForm();
    this.loadParametrage();
    this.loadData();
    this.loadJoursFeries();
  }

  private loadParametrage(): void {
    this.congeService.getParametrage().subscribe({
      next: (config) => {
        this.parametrage = config;
        this.recalculerDepuisDuree();
      },
      error: (e) => console.warn('Paramétrage conges:', e)
    });
  }

  private loadJoursFeries(): void {
    this.congeService.getJoursFeries().subscribe({
      next: (list) => {
        this.joursFeries = list || [];
        this.recalculerDepuisDuree();
      },
      error: () => this.joursFeries = []
    });
  }

  private initForm(): void {
    const today = new Date();
    if (today.getDay() === 0) {
      today.setDate(today.getDate() + 1);
    }

    this.form = this.fb.group({
      employeSearch: [''],
      employeeId: ['', Validators.required],
      typeAbsenceCongeId: ['', Validators.required],
      dateDebut: [today, Validators.required],
      dureeDemandee: [3, [Validators.required, Validators.min(1)]],
      dateFin: ['', Validators.required],
      motif: [''],
      justificatif: [''],
      interimaireId: [''],
      saisieParDrh: [true]
    });

    this.form.get('dateDebut')?.valueChanges.subscribe((nouvelleDate) => {
      if (nouvelleDate) {
        const d = new Date(nouvelleDate);
        if (d.getDay() === 0) {
          d.setDate(d.getDate() + 1);
          this.snackBar.open('Un congé ne débute pas un dimanche. Ajusté au lundi.', 'OK', { duration: 3000 });
          this.form.patchValue({ dateDebut: d }, { emitEvent: false });
        }
        this.recalculerDepuisDuree();
      }
    });

    this.form.get('dureeDemandee')?.valueChanges.subscribe((duree) => {
      if (duree && duree > 0) {
        this.recalculerDepuisDuree(Number(duree));
      }
    });

    this.form.get('dateFin')?.valueChanges.subscribe(() => {
      this.recalculerDepuisDateFinManuelle();
    });

    this.form.get('typeAbsenceCongeId')?.valueChanges.subscribe(() => {
      this.onTypeChange();
    });

    this.filteredEmployees$ = combineLatest([
      this.employeesSubject.asObservable(),
      this.form.get('employeSearch')!.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([emps, term]) => {
        const t = (term || '').toLowerCase().trim();
        if (!t) return emps || [];
        return (emps || []).filter(e =>
          (e.prenom || '').toLowerCase().includes(t) ||
          (e.nom || '').toLowerCase().includes(t) ||
          (e.matricule || '').toLowerCase().includes(t) ||
          (e.poste || '').toLowerCase().includes(t) ||
          (e.departement || '').toLowerCase().includes(t) ||
          (e.direction || '').toLowerCase().includes(t)
        );
      })
    );
  }

  get availableInterimaires(): Employee[] {
    const selectedId = this.form.get('employeeId')?.value;
    return this.employeesList.filter(e => String(e.id) !== String(selectedId));
  }

  private loadData(): void {
    // 1. Types de congés & absences depuis PostgreSQL
    this.congeService.getTypes().subscribe({
      next: (types) => {
        this.typesConge = types || [];
        this.selectDefaultType();
      },
      error: () => {
        this.typesConge = [];
      }
    });

    // 2. Employés
    this.employeeService.getAll().subscribe({
      next: (emps) => {
        this.employeesList = emps || [];
        this.employeesSubject.next(this.employeesList);
        this.showAgentPicker = !this.selectedEmployeeObj;
      },
      error: () => {
        this.employeesList = [];
        this.employeesSubject.next([]);
      }
    });
  }

  private selectDefaultType(): void {
    const currentId = this.form.get('typeAbsenceCongeId')?.value;
    const exists = this.filteredTypesConge.find(t => String(t.id) === String(currentId));
    if (!exists) {
      // Priorité 1 : ACCIDENT_TRAVAIL ou tout type accident
      const def = this.accidentMaladieList.find(t => (t.code || '').toUpperCase().includes('ACCIDENT'))
               || this.accidentMaladieList.find(t => (t.code || '').toUpperCase().includes('MALADIE'))
               || this.accidentMaladieList[0]
               || this.filteredTypesConge[0];
      if (def) {
        this.form.patchValue({ typeAbsenceCongeId: def.id });
        this.onTypeChange();
      }
    }
  }

  isCurrentEmployee(emp: Employee): boolean {
    if (!this.selectedEmployeeObj) return false;
    return String(this.selectedEmployeeObj.id) === String(emp.id);
  }

  selectAgent(emp: Employee): void {
    this.form.patchValue({ employeeId: emp.id });
    this.onEmployeeSelect(emp.id);
    this.showAgentPicker = false;
  }

  toggleAgentPicker(): void {
    this.showAgentPicker = !this.showAgentPicker;
  }

  reinitialiserAgent(): void {
    this.selectedEmployeeObj = undefined;
    this.selectedEmployeeSolde = undefined;
    this.form.patchValue({ employeeId: '' });
    this.showAgentPicker = true;
  }

  onEmployeeSelect(empId: any): void {
    if (!empId) {
      this.selectedEmployeeObj = undefined;
      this.selectedEmployeeSolde = undefined;
      return;
    }
    const idNum = Number(empId);
    this.selectedEmployeeObj = this.employeesList.find(e => Number(e.id) === idNum);

    if (this.selectedEmployeeObj) {
      // Ajustement du type si incompatibilité de sexe
      this.selectDefaultType();
      this.onTypeChange();
    }

    this.congeService.getSoldeByEmployee(idNum).subscribe({
      next: (solde) => {
        this.selectedEmployeeSolde = solde;
      },
      error: () => {
        this.selectedEmployeeSolde = undefined;
      }
    });
  }

  choisirDureeRapide(jours: number): void {
    this.form.patchValue({ dureeDemandee: jours });
    this.recalculerDepuisDuree(jours);
  }

  recalculerDepuisDuree(duree?: number): void {
    const debutVal = this.form?.get('dateDebut')?.value;
    const nbJours = duree !== undefined ? duree : Number(this.form?.get('dureeDemandee')?.value || 3);
    if (!debutVal || nbJours <= 0) return;

    let cur = new Date(debutVal);
    if (cur.getDay() === 0) {
      cur.setDate(cur.getDate() + 1);
      this.form.patchValue({ dateDebut: new Date(cur) }, { emitEvent: false });
    }

    let joursComptes = 0;
    let dernierJourConge = new Date(cur);

    while (joursComptes < nbJours) {
      const dow = cur.getDay();
      const isWeekend = (dow === 0 || dow === 6);
      const isFerie = this.isJourFerie(cur);

      if (!isWeekend && !isFerie) {
        joursComptes++;
        dernierJourConge = new Date(cur);
      }

      if (joursComptes < nbJours) {
        cur.setDate(cur.getDate() + 1);
      }
    }

    let reprise = new Date(dernierJourConge);
    reprise.setDate(reprise.getDate() + 1);
    while (reprise.getDay() === 0 || reprise.getDay() === 6 || this.isJourFerie(reprise)) {
      reprise.setDate(reprise.getDate() + 1);
    }

    this.dateReprisePrevue = reprise;
    this.form.patchValue({ dateFin: dernierJourConge }, { emitEvent: false });
  }

  private recalculerDepuisDateFinManuelle(): void {
    const debut = this.form?.get('dateDebut')?.value;
    const fin = this.form?.get('dateFin')?.value;
    if (!debut || !fin) return;

    const d1 = new Date(debut);
    const d2 = new Date(fin);
    if (d2 < d1) return;

    let reprise = new Date(d2);
    reprise.setDate(reprise.getDate() + 1);
    while (reprise.getDay() === 0 || reprise.getDay() === 6 || this.isJourFerie(reprise)) {
      reprise.setDate(reprise.getDate() + 1);
    }
    this.dateReprisePrevue = reprise;

    const count = this.calculerJoursOuvrablesEntre(d1, d2);
    this.form.patchValue({ dureeDemandee: count }, { emitEvent: false });
  }

  isJourFerie(d: Date): boolean {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${day}`;
    return this.joursFeries.some(jf => jf.date === iso && jf.chomePaye !== false);
  }

  private calculerJoursOuvrablesEntre(d1: Date, d2: Date): number {
    let count = 0;
    let cur = new Date(d1);
    const mode = this.parametrage?.modeDecompte || 'OUVRABLE_5J';
    const deduireFeries = this.parametrage?.deduireJoursFeries !== false;
    while (cur <= d2) {
      const dow = cur.getDay();
      const isWeekend = mode === 'OUVRABLE_6J' ? (dow === 0) : (dow === 0 || dow === 6);
      const isFerie = deduireFeries ? this.isJourFerie(cur) : false;
      if (!isWeekend && !isFerie) {
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return Math.max(1, count);
  }

  get nbJours(): number {
    const dureeCtrl = this.form?.get('dureeDemandee')?.value;
    if (dureeCtrl && Number(dureeCtrl) > 0) {
      return Number(dureeCtrl);
    }
    const debut = this.form?.get('dateDebut')?.value;
    const fin   = this.form?.get('dateFin')?.value;
    if (!debut || !fin) return 0;
    return this.calculerJoursOuvrablesEntre(new Date(debut), new Date(fin));
  }

  get selectedTypeName(): string {
    return this.selectedTypeObj?.name || 'Absence exceptionnelle';
  }

  get isTypeMaladieOuAccident(): boolean {
    const t = this.selectedTypeObj;
    if (!t) return false;
    const code = (t.code || '').toUpperCase();
    const name = (t.name || '').toLowerCase();
    return code.includes('MALADIE') || code.includes('ACCIDENT') || name.includes('maladie') || name.includes('accident');
  }

  get isTypeTotalementDeductible(): boolean {
    // Dans ce formulaire d'urgence DRH, aucun type n'est un congé annuel standard déductible à 100%
    return false;
  }

  get isSoldeInsuffisant(): boolean {
    // Les absences d'urgence (accident, maladie, force majeure) ne sont jamais bloquées par le solde annuel
    return false;
  }

  save(): void {
    const val = this.form.value;

    if (!val.employeeId) {
      this.snackBar.open('Veuillez sélectionner le collaborateur empêché.', 'Fermer', { duration: 4000 });
      return;
    }

    if (!val.typeAbsenceCongeId) {
      this.snackBar.open('Veuillez sélectionner le motif d\'urgence (Accident, Maladie, etc.).', 'Fermer', { duration: 4000 });
      return;
    }

    if (!val.dateDebut) {
      this.snackBar.open('Veuillez renseigner la date de début de l\'absence.', 'Fermer', { duration: 4000 });
      return;
    }

    let motifFinal = (val.motif || '').trim();
    if (!motifFinal) {
      motifFinal = `Incapacité temporaire de présence à la banque — ${this.selectedTypeName} (${this.nbJours} jour(s) ouvré(s))`;
    }
    motifFinal = `[Autorisation DRH - Urgence / Empêchement] ${motifFinal}`;

    this.saving = true;
    const finalVal = this.form.value;
    const startStr = this.formatDateToIso(finalVal.dateDebut);
    const endStr   = this.formatDateToIso(finalVal.dateFin);

    const typeSelected = this.typesConge.find(t => String(t.id) === String(finalVal.typeAbsenceCongeId));
    const empName = this.selectedEmployeeObj ? 
      `${this.selectedEmployeeObj.prenom} ${this.selectedEmployeeObj.nom}` : 'Collaborateur';

    const hasInterim = !!finalVal.interimaireId;
    const statutFinal = hasInterim ? 'EN_ATTENTE_INTERIM' : 'APPROUVE';
    const todayIso = new Date().toISOString().split('T')[0];

    const payload = {
      employee: { id: Number(finalVal.employeeId) },
      employe: empName,
      typeAbsenceConge: typeSelected ? { id: typeSelected.id, code: typeSelected.code, name: typeSelected.name } : null,
      type: typeSelected ? typeSelected.name : 'Absence exceptionnelle',
      dateDebut: startStr,
      dateFin: endStr,
      nbJours: this.nbJours,
      motif: motifFinal,
      justificatif: this.selectedFileBase64 || finalVal.justificatif || (this.selectedFileName ? this.selectedFileName : null),
      justificatifNom: this.selectedFileName || null,
      interimaire: hasInterim ? { id: Number(finalVal.interimaireId) } : null,
      posteSensibleBceao: false,
      statut: statutFinal,
      dateDemande: todayIso,
      dateValidation: statutFinal === 'APPROUVE' ? todayIso : null,
      validePar: statutFinal === 'APPROUVE' ? 'Direction des Ressources Humaines (DRH)' : null
    };

    this.congeService.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('Autorisation d\'absence exceptionnelle validée et enregistrée avec succès !', 'OK', { duration: 4500 });
        this.router.navigate(['/grh/conges']);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open('Erreur lors de l\'enregistrement : ' + (err?.error?.message || err.message), 'Fermer', { duration: 6000 });
      }
    });
  }

  private formatDateToIso(rawDate: any): string {
    if (!rawDate) return '';
    if (rawDate instanceof Date) {
      const y = rawDate.getFullYear();
      const m = String(rawDate.getMonth() + 1).padStart(2, '0');
      const d = String(rawDate.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    const dObj = new Date(rawDate);
    if (!isNaN(dObj.getTime())) {
      const y = dObj.getFullYear();
      const m = String(dObj.getMonth() + 1).padStart(2, '0');
      const d = String(dObj.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return String(rawDate);
  }

  cancel(): void {
    this.router.navigate(['/grh/conges']);
  }
}
