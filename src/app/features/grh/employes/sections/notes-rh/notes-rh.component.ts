import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-notes-rh',
  templateUrl: './notes-rh.component.html',
  styleUrls: ['./notes-rh.component.scss'],
  standalone: false
})
export class NotesRhComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      observations: [''],
      evaluations:  this.fb.array([])
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({ observations: e.observations });
    e.evaluations.forEach(ev => this.evaluations.push(this.fb.group({
      date:        [ev.date],
      periode:     [ev.periode],
      note:        [ev.note, [Validators.min(0), Validators.max(20)]],
      commentaire: [ev.commentaire],
      evaluateur:  [ev.evaluateur]
    })));
  }

  get evaluations(): FormArray { return this.form.get('evaluations') as FormArray; }
  addEvaluation(): void {
    this.evaluations.push(this.fb.group({
      date:        [new Date().toISOString().slice(0, 10)],
      periode:     [''],
      note:        [0, [Validators.min(0), Validators.max(20)]],
      commentaire: [''],
      evaluateur:  ['']
    }));
  }
  removeEvaluation(i: number): void { this.evaluations.removeAt(i); }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(navigateToHub = false): void {
    this.saving = true;
    const v = this.form.value;

    const formattedEvaluations = (v.evaluations || []).map((ev: any) => {
      let d = ev.date;
      if (d instanceof Date) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        d = `${year}-${month}-${day}`;
      }
      return { ...ev, date: d };
    });

    this.employeeService.update(this.empId, {
      observations: v.observations,
      evaluations:  formattedEvaluations
    }).subscribe(() => {
      this.saving = false;
      this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
