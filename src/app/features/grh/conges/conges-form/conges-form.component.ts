import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { CongeService, SoldeConge, TypeAbsenceConge } from '../services/conge.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable, combineLatest, startWith, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  typesConge: TypeAbsenceConge[] = [];
  joursFeries: any[] = [];
  employeesList: Employee[] = [];
  filteredEmployees$!: Observable<Employee[]>;
  selectedEmployeeObj?: Employee;
  selectedEmployeeSolde?: SoldeConge;

  // Calcul intelligent des congés
  dateReprisePrevue: Date | null = null;
  dureesRapides = [5, 10, 15, 20, 25, 30];

  /**
   * Règle absolue BPBF / Code du travail :
   * On ne commence JAMAIS un congé un DIMANCHE.
   */
  dateFilter = (d: Date | null): boolean => {
    if (!d) return true;
    return d.getDay() !== 0; // 0 = Dimanche interdit
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
    this.loadData();
    this.loadJoursFeries();
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
    const dateInitiale = this.getProchainJourOuvrable(new Date());

    this.form = this.fb.group({
      employeSearch: [''],
      employeeId: ['', Validators.required],
      typeAbsenceCongeId: ['', Validators.required],
      dateDebut: [dateInitiale, Validators.required],
      dureeDemandee: [15, [Validators.required, Validators.min(1)]],
      dateFin: ['', Validators.required],
      motif: [''],
      justificatif: [''],
      interimaireId: [''],
      saisieParDrh: [false],
      posteSensibleBceao: [false]
    });

    // Écoute des changements de date de début pour recalculer automatiquement
    this.form.get('dateDebut')?.valueChanges.subscribe((nouvelleDate) => {
      if (nouvelleDate) {
        const d = new Date(nouvelleDate);
        if (d.getDay() === 0) {
          // Dimanche détecté : avance immédiatement au lundi
          d.setDate(d.getDate() + 1);
          this.snackBar.open('Un congé ne débute pas un dimanche. La date a été ajustée au lundi.', 'OK', { duration: 3500 });
          this.form.patchValue({ dateDebut: d }, { emitEvent: false });
        }
        this.recalculerDepuisDuree();
      }
    });

    // Écoute de la saisie manuelle de durée
    this.form.get('dureeDemandee')?.valueChanges.subscribe((duree) => {
      if (duree && duree > 0) {
        this.recalculerDepuisDuree(Number(duree));
      }
    });

    // Écoute si l'utilisateur ajuste la date de fin manuellement
    this.form.get('dateFin')?.valueChanges.subscribe((finVal) => {
      // Synchronise la date de reprise et le nombre de jours
      this.recalculerDepuisDateFinManuelle();
    });

    this.filteredEmployees$ = combineLatest([
      this.employeeService.getAll().pipe(catchError(() => of([]))),
      this.form.get('employeSearch')!.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([emps, term]) => {
        this.employeesList = emps || [];
        const t = (term || '').toLowerCase().trim();
        if (!t) return emps || [];
        return (emps || []).filter(e =>
          (e.prenom || '').toLowerCase().includes(t) ||
          (e.nom || '').toLowerCase().includes(t) ||
          (e.matricule || '').toLowerCase().includes(t)
        );
      })
    );
  }

  get availableInterimaires(): Employee[] {
    const selectedId = this.form.get('employeeId')?.value;
    return this.employeesList.filter(e => String(e.id) !== String(selectedId));
  }

  get preavisJours(): number {
    const start = this.form.get('dateDebut')?.value;
    if (!start) return 99;
    const startDate = new Date(start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = startDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get isPreavisInsuffisant(): boolean {
    return this.preavisJours < 15;
  }

  private loadData(): void {
    this.congeService.getTypes().subscribe({
      next: (types) => {
        this.typesConge = types || [];
        // Sélection par défaut du congé annuel ordinaire
        if (this.typesConge.length > 0 && !this.form.get('typeAbsenceCongeId')?.value) {
          const annuel = this.typesConge.find(t => (t.code || '').toUpperCase().includes('ANNUEL') || (t.name || '').toLowerCase().includes('annuel'));
          const defId = annuel ? annuel.id : this.typesConge[0].id;
          this.form.patchValue({ typeAbsenceCongeId: defId });
        }
        this.recalculerDepuisDuree();
      },
      error: () => {
        this.typesConge = [];
      }
    });
  }

  onEmployeeSelect(empId: any): void {
    if (!empId) {
      this.selectedEmployeeObj = undefined;
      this.selectedEmployeeSolde = undefined;
      return;
    }
    const idNum = Number(empId);
    this.selectedEmployeeObj = this.employeesList.find(e => Number(e.id) === idNum);

    // Détection automatique de poste sensible BCEAO
    if (this.selectedEmployeeObj) {
      const fn = (this.selectedEmployeeObj.poste || '') + ' ' + (this.selectedEmployeeObj.fonction || '');
      const fnLower = fn.toLowerCase();
      const isSensible = fnLower.includes('caisse') || fnLower.includes('caissier') || 
                         fnLower.includes('trésor') || fnLower.includes('trader') ||
                         fnLower.includes('gestionnaire de compte') || fnLower.includes('opérations') ||
                         fnLower.includes('monétique');
      this.form.patchValue({ posteSensibleBceao: isSensible });
    }

    this.congeService.getSoldeByEmployee(idNum).subscribe({
      next: (solde) => {
        this.selectedEmployeeSolde = solde;
      },
      error: () => {
        this.selectedEmployeeSolde = {
          employeeId: idNum,
          matricule: this.selectedEmployeeObj?.matricule || '',
          nomComplet: `${this.selectedEmployeeObj?.prenom || ''} ${this.selectedEmployeeObj?.nom || ''}`,
          departement: 'Direction',
          poste: 'Agent',
          droitAnnuel: 30,
          joursAcquis: 22.5,
          joursPris: 0,
          joursEnAttente: 0,
          soldeRestant: 22.5
        };
      }
    });
  }

  /**
   * Bouton rapide de durée (5j, 10j, 15j, 20j, 30j)
   */
  choisirDureeRapide(jours: number): void {
    this.form.patchValue({ dureeDemandee: jours });
    this.recalculerDepuisDuree(jours);
  }

  /**
   * Calcul automatique du départ, de la date de fin et de la date de reprise
   * en excluant les dimanches, samedis (régime 5j bancaire) et jours fériés légaux.
   */
  recalculerDepuisDuree(duree?: number): void {
    const debutVal = this.form?.get('dateDebut')?.value;
    const nbJours = duree !== undefined ? duree : Number(this.form?.get('dureeDemandee')?.value || 15);
    if (!debutVal || nbJours <= 0) return;

    let cur = new Date(debutVal);
    // Si la date choisie est un dimanche, décaler au lundi
    if (cur.getDay() === 0) {
      cur.setDate(cur.getDate() + 1);
      this.form.patchValue({ dateDebut: new Date(cur) }, { emitEvent: false });
    }

    let joursComptes = 0;
    let dernierJourConge = new Date(cur);

    while (joursComptes < nbJours) {
      const dow = cur.getDay();
      const isWeekend = (dow === 0 || dow === 6); // Dimanche ou Samedi
      const isFerie = this.isJourFerie(cur);

      if (!isWeekend && !isFerie) {
        joursComptes++;
        dernierJourConge = new Date(cur);
      }

      if (joursComptes < nbJours) {
        cur.setDate(cur.getDate() + 1);
      }
    }

    // Calcul de la date de reprise effective du service au bureau
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

  private getProchainJourOuvrable(base: Date): Date {
    let d = new Date(base);
    d.setHours(0, 0, 0, 0);
    // Au moins le lendemain si en cours de journée
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6 || this.isJourFerie(d)) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  }

  private calculerJoursOuvrablesEntre(d1: Date, d2: Date): number {
    let count = 0;
    let cur = new Date(d1);
    while (cur <= d2) {
      const dow = cur.getDay();
      const isWeekend = (dow === 0 || dow === 6);
      const isFerie = this.isJourFerie(cur);
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

  get selectedTypeObj(): TypeAbsenceConge | undefined {
    const typeId = this.form?.get('typeAbsenceCongeId')?.value;
    if (!typeId) return undefined;
    return this.typesConge.find(t => String(t.id) === String(typeId));
  }

  get selectedTypeName(): string {
    return this.selectedTypeObj?.name || 'Congé';
  }

  get isTypeTotalementDeductible(): boolean {
    const t = this.selectedTypeObj;
    if (!t) return true;
    if (t.deductibleDuSolde !== undefined && t.deductibleDuSolde !== null) {
      return t.deductibleDuSolde;
    }
    const code = (t.code || '').toUpperCase();
    const name = (t.name || '').toLowerCase();
    return code.includes('ANNUEL') || code === 'CONGE_ANNUEL' || code === 'PAYE' || name.includes('annuel') || name.includes('payé');
  }

  get isTypeMaladie(): boolean {
    const t = this.selectedTypeObj;
    if (!t) return false;
    const code = (t.code || '').toUpperCase();
    const name = (t.name || '').toLowerCase();
    return code.includes('MALADIE') || name.includes('maladie');
  }

  get plafondNonDeductible(): number {
    const t = this.selectedTypeObj;
    if (!t) return 0;
    if (this.isTypeMaladie) return this.nbJours;
    if (t.dureeMaxLegaleJours !== undefined && t.dureeMaxLegaleJours !== null) {
      return t.dureeMaxLegaleJours;
    }
    const code = (t.code || '').toUpperCase();
    if (code.includes('MATERNITE')) return 98;
    if (code.includes('PATERNITE')) return 3;
    if (code.includes('MARIAGE')) return 3;
    if (code.includes('DECES')) return 5;
    if (code.includes('NAISSANCE')) return 3;
    return 0;
  }

  get joursExcedentairesDeductibles(): number {
    if (this.isTypeTotalementDeductible) {
      return this.nbJours;
    }
    const plafond = this.plafondNonDeductible;
    return Math.max(0, this.nbJours - plafond);
  }

  get soldeApresPrise(): number {
    const act = this.selectedEmployeeSolde?.soldeRestant ?? 22.5;
    return Math.max(0, act - this.joursExcedentairesDeductibles);
  }

  get isSoldeInsuffisant(): boolean {
    const act = this.selectedEmployeeSolde?.soldeRestant ?? 22.5;
    return this.joursExcedentairesDeductibles > act;
  }

  get hasDepassementQuota(): boolean {
    return !this.isTypeTotalementDeductible && this.joursExcedentairesDeductibles > 0;
  }

  save(): void {
    const val = this.form.value;

    // 1. Validation de l'agent
    if (!val.employeeId) {
      this.snackBar.open('Veuillez sélectionner l\'agent concerné.', 'Fermer', { duration: 4000 });
      return;
    }

    // 2. Validation du type de congé (sélection par défaut si non choisi)
    if (!val.typeAbsenceCongeId && this.typesConge.length > 0) {
      const defType = this.typesConge[0];
      this.form.patchValue({ typeAbsenceCongeId: defType.id });
    }

    // 3. Validation de la date de début
    if (!val.dateDebut) {
      const defDebut = this.getProchainJourOuvrable(new Date());
      this.form.patchValue({ dateDebut: defDebut });
      this.recalculerDepuisDuree();
    }

    // 4. Motif par défaut s'il est vide
    let motifFinal = (val.motif || '').trim();
    if (!motifFinal) {
      motifFinal = `Demande de ${this.selectedTypeName} (${this.nbJours} jours ouvrables)`;
    }
    if (val.saisieParDrh) {
      motifFinal = `[Saisie par délégation DRH] ${motifFinal}`;
    }

    this.saving = true;
    const finalVal = this.form.value;
    const startStr = this.formatDateToIso(finalVal.dateDebut);
    const endStr   = this.formatDateToIso(finalVal.dateFin);

    const typeSelected = this.typesConge.find(t => String(t.id) === String(finalVal.typeAbsenceCongeId));
    const empName = this.selectedEmployeeObj ? 
      `${this.selectedEmployeeObj.prenom} ${this.selectedEmployeeObj.nom}` : 'Agent';

    const payload = {
      employee: { id: Number(finalVal.employeeId) },
      employe: empName,
      typeAbsenceConge: typeSelected ? { id: typeSelected.id, code: typeSelected.code, name: typeSelected.name } : null,
      type: typeSelected ? typeSelected.name : 'Congé annuel',
      dateDebut: startStr,
      dateFin: endStr,
      nbJours: this.nbJours,
      motif: motifFinal,
      justificatif: finalVal.justificatif,
      interimaire: finalVal.interimaireId ? { id: Number(finalVal.interimaireId) } : null,
      posteSensibleBceao: !!finalVal.posteSensibleBceao,
      statut: finalVal.interimaireId ? 'EN_ATTENTE_INTERIM' : 'EN_ATTENTE_N1',
      dateDemande: new Date().toISOString().split('T')[0]
    };

    this.congeService.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('Demande de congé enregistrée avec succès !', 'OK', { duration: 4000 });
        this.router.navigate(['/grh/conges']);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open('Erreur lors de la soumission : ' + (err?.error?.message || err.message), 'Fermer', { duration: 6000 });
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
