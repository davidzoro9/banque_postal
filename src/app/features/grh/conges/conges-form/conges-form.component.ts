import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
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
      next: (list) => this.joursFeries = list || [],
      error: () => this.joursFeries = []
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      employeSearch: [''],
      employeeId: ['', Validators.required],
      typeAbsenceCongeId: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      motif: ['', [Validators.required, Validators.minLength(5)]],
      justificatif: ['']
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

  private loadData(): void {
    this.congeService.getTypes().subscribe({
      next: (types) => {
        this.typesConge = types || [];
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
          joursAcquis: 20,
          joursPris: 0,
          joursEnAttente: 0,
          soldeRestant: 20
        };
      }
    });
  }

  get nbJours(): number {
    const debut = this.form?.get('dateDebut')?.value;
    const fin   = this.form?.get('dateFin')?.value;
    if (!debut || !fin) return 0;
    const d1 = new Date(debut);
    const d2 = new Date(fin);
    if (d2 < d1) return 0;

    let count = 0;
    let cur = new Date(d1);
    while (cur <= d2) {
      const dayOfWeek = cur.getDay();
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6); // 0=Dimanche, 6=Samedi

      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const d = String(cur.getDate()).padStart(2, '0');
      const curIso = `${y}-${m}-${d}`;

      const isFerie = this.joursFeries.some(jf => jf.date === curIso && jf.chomePaye !== false);

      if (!isWeekend && !isFerie) {
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return Math.max(1, count);
  }

  get soldeApresPrise(): number {
    const act = this.selectedEmployeeSolde?.soldeRestant ?? 30;
    return Math.max(0, act - this.nbJours);
  }

  get isSoldeInsuffisant(): boolean {
    const act = this.selectedEmployeeSolde?.soldeRestant ?? 30;
    return this.nbJours > act;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const val = this.form.value;

    const startStr = this.formatDateToIso(val.dateDebut);
    const endStr   = this.formatDateToIso(val.dateFin);

    const typeSelected = this.typesConge.find(t => String(t.id) === String(val.typeAbsenceCongeId));
    const empName = this.selectedEmployeeObj ? 
      `${this.selectedEmployeeObj.prenom} ${this.selectedEmployeeObj.nom}` : 'Agent';

    const payload = {
      employee: { id: Number(val.employeeId) },
      employe: empName,
      typeAbsenceConge: typeSelected ? { id: typeSelected.id, code: typeSelected.code, name: typeSelected.name } : null,
      type: typeSelected ? typeSelected.name : 'Congé annuel',
      dateDebut: startStr,
      dateFin: endStr,
      nbJours: this.nbJours,
      motif: val.motif,
      justificatif: val.justificatif,
      statut: 'EN_ATTENTE',
      dateDemande: new Date().toISOString().split('T')[0]
    };

    this.congeService.create(payload).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/grh/conges']);
      },
      error: (err) => {
        this.saving = false;
        alert('Erreur lors de la soumission de la demande : ' + (err?.error?.message || err.message));
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
