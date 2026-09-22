import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrieresService, CarriereNotation } from '../services/carrieres.service';
import { EmployeeService } from '../../grh/employes/services/employee.service';
import { Employee } from '../../grh/employes/models/employee.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.scss'],
  standalone: false
})
export class EvaluationsComponent implements OnInit {
  notations$!: Observable<CarriereNotation[]>;
  employees: Employee[] = [];

  showAddForm = false;
  saving = false;
  selectedExercice: number = new Date().getFullYear();
  searchQuery: string = '';

  newNotation: {
    employeeId: any;
    exercice: number;
    noteObjectifs: number;
    noteCompetences: number;
    noteComportement: number;
    evaluateur: string;
    appreciation: string;
    dateEvaluation: string;
  } = {
    employeeId: null,
    exercice: new Date().getFullYear(),
    noteObjectifs: 15,
    noteCompetences: 15,
    noteComportement: 16,
    evaluateur: 'DRH / Superviseur',
    appreciation: '',
    dateEvaluation: new Date().toISOString().split('T')[0]
  };

  constructor(
    private carrieresService: CarrieresService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notations$ = this.carrieresService.notations$;
    this.carrieresService.fetchNotations().subscribe();
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (list) => {
        this.employees = (list || []).filter(e => e.statut !== 'Inactif');
      },
      error: () => {
        this.employees = [];
      }
    });
  }

  get computedNoteGlobale(): number {
    const o = Number(this.newNotation.noteObjectifs) || 0;
    const c = Number(this.newNotation.noteCompetences) || 0;
    const b = Number(this.newNotation.noteComportement) || 0;
    const g = (o * 0.4) + (c * 0.4) + (b * 0.2);
    return Math.round(g * 100) / 100;
  }

  get autoAppreciation(): string {
    const g = this.computedNoteGlobale;
    if (g >= 18) return 'Excellent — Éligible à un avancement accéléré';
    if (g >= 15) return 'Très Bien — Avancement normal recommandé';
    if (g >= 12) return 'Bien — Performance satisfaisante';
    if (g >= 10) return 'Passable — Conforme aux exigences';
    return 'Insuffisant — Plan de formation et accompagnement requis';
  }

  onFilterExercice(): void {
    this.carrieresService.fetchNotations(this.selectedExercice).subscribe();
  }

  saveNotation(): void {
    if (!this.newNotation.employeeId) return;

    this.saving = true;
    const emp = this.employees.find(e => String(e.id) === String(this.newNotation.employeeId));

    const payload: CarriereNotation = {
      employee: { id: Number(this.newNotation.employeeId) },
      exercice: Number(this.newNotation.exercice),
      noteObjectifs: Number(this.newNotation.noteObjectifs),
      noteCompetences: Number(this.newNotation.noteCompetences),
      noteComportement: Number(this.newNotation.noteComportement),
      noteGlobale: this.computedNoteGlobale,
      appreciation: this.newNotation.appreciation.trim() || this.autoAppreciation,
      evaluateur: this.newNotation.evaluateur.trim(),
      dateEvaluation: this.newNotation.dateEvaluation,
      statut: 'VALIDE'
    };

    this.carrieresService.saveNotation(payload).subscribe({
      next: () => {
        this.saving = false;
        this.showAddForm = false;
        this.resetForm();
        this.carrieresService.fetchNotations().subscribe();
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  deleteNotation(id: number | undefined): void {
    if (!id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) {
      this.carrieresService.deleteNotation(id).subscribe({
        next: () => {
          this.carrieresService.fetchNotations().subscribe();
        }
      });
    }
  }

  resetForm(): void {
    this.newNotation = {
      employeeId: null,
      exercice: new Date().getFullYear(),
      noteObjectifs: 15,
      noteCompetences: 15,
      noteComportement: 16,
      evaluateur: 'DRH / Superviseur',
      appreciation: '',
      dateEvaluation: new Date().toISOString().split('T')[0]
    };
  }

  goBack(): void {
    this.router.navigate(['/carrieres']);
  }
}
