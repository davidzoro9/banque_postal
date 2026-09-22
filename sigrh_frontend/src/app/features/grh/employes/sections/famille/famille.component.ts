import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EmployeeFamily, LienParente } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-famille',
  templateUrl: './famille.component.html',
  styleUrls: ['./famille.component.scss'],
  standalone: false
})
export class FamilleComponent implements OnInit {
  employee?: Employee;
  membres: EmployeeFamily[] = [];
  form!: FormGroup;
  empId = '';
  editingMember?: EmployeeFamily;
  showForm = false;
  saving = false;
  message = '';
  error = '';
  maxBirthDate = new Date();

  readonly liens: { value: LienParente; label: string }[] = [
    { value: 'CONJOINT', label: 'Conjoint(e)' },
    { value: 'ENFANT', label: 'Enfant' },
    { value: 'PERE', label: 'Père' },
    { value: 'MERE', label: 'Mère' },
    { value: 'FRERE', label: 'Frère' },
    { value: 'SOEUR', label: 'Sœur' },
    { value: 'AUTRE', label: 'Autre' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.buildForm();
    this.employeeService.getById(this.empId).subscribe({
      next: employee => {
        this.employee = employee;
        this.loadMembers();
      },
      error: () => this.router.navigate(['/grh/employes'])
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: [null],
      lienParente: [null, Validators.required],
      estCharge: [false],
      statut: ['']
    });
  }

  private loadMembers(): void {
    this.employeeService.getFamily(this.empId).subscribe({
      next: membres => this.membres = membres || [],
      error: err => this.error = err?.error?.message || 'Impossible de charger la famille.'
    });
  }

  openCreate(): void {
    this.editingMember = undefined;
    this.form.reset({ nom: '', prenom: '', dateNaissance: null, lienParente: null, estCharge: false, statut: '' });
    this.message = '';
    this.error = '';
    this.showForm = true;
  }

  openEdit(member: EmployeeFamily): void {
    this.editingMember = member;
    this.form.reset({
      ...member,
      dateNaissance: member.dateNaissance ? new Date(`${member.dateNaissance}T00:00:00`) : null
    });
    this.message = '';
    this.error = '';
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingMember = undefined;
  }

  save(): void {
    if (this.form.invalid || !this.employee) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    const formValue = this.form.getRawValue();
    const selectedDate: Date | null = formValue.dateNaissance;
    const payload: EmployeeFamily = {
      ...formValue,
      dateNaissance: selectedDate
        ? [
            selectedDate.getFullYear(),
            String(selectedDate.getMonth() + 1).padStart(2, '0'),
            String(selectedDate.getDate()).padStart(2, '0')
          ].join('-')
        : null,
      id: this.editingMember?.id,
      employeeId: this.employee.id
    };
    const request = this.editingMember?.id
      ? this.employeeService.updateFamilyMember(this.empId, this.editingMember.id, payload)
      : this.employeeService.createFamilyMember(this.empId, payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingMember = undefined;
        this.message = 'Membre de famille enregistré.';
        this.loadMembers();
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.message || 'Impossible d’enregistrer le membre de famille.';
      }
    });
  }

  deleteMember(member: EmployeeFamily): void {
    if (!member.id || !confirm(`Supprimer ${member.prenom} ${member.nom} ?`)) return;
    this.employeeService.deleteFamilyMember(this.empId, member.id).subscribe({
      next: () => {
        this.message = 'Membre de famille supprimé.';
        this.loadMembers();
      },
      error: err => this.error = err?.error?.message || 'Impossible de supprimer le membre de famille.'
    });
  }

  lienLabel(value: LienParente): string {
    return this.liens.find(item => item.value === value)?.label || value;
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${this.employee.prenom?.[0] || ''}${this.employee.nom?.[0] || ''}`.toUpperCase() || '??';
  }

  goToInfosPerso(): void { this.router.navigate(['/grh/employes', this.empId, 'infos-personnelles']); }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
