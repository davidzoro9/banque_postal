import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrieresService, EvaluationEntretien } from '../services/carrieres.service';
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
  evaluations$!: Observable<EvaluationEntretien[]>;
  employees$!: Observable<Employee[]>;

  showAddForm = false;
  saving = false;

  newEval = {
    employeeId: '',
    date: null as Date | null,
    evaluateur: '',
    note: 4,
    objectifs: '',
    commentaires: ''
  };

  constructor(
    private carrieresService: CarrieresService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.evaluations$ = this.carrieresService.evaluations$;
    this.employees$ = this.employeeService.getAll();
  }

  addEval(employees: Employee[]): void {
    const selectedEmp = employees.find(e => e.id === this.newEval.employeeId);
    if (!selectedEmp || !this.newEval.date) return;

    this.saving = true;

    // Convert Date to YYYY-MM-DD
    const dt = this.newEval.date;
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const name = `${selectedEmp.prenom} ${selectedEmp.nom}`;

    this.carrieresService.addEvaluation({
      employeeId: selectedEmp.id,
      employeeName: name,
      date: formattedDate,
      evaluateur: this.newEval.evaluateur.trim(),
      note: this.newEval.note,
      objectifs: this.newEval.objectifs.trim(),
      commentaires: this.newEval.commentaires.trim()
    }).subscribe(() => {
      this.saving = false;
      this.newEval = {
        employeeId: '',
        date: null,
        evaluateur: '',
        note: 4,
        objectifs: '',
        commentaires: ''
      };
      this.showAddForm = false;
    });
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  goBack(): void {
    this.router.navigate(['/carrieres']);
  }
}
