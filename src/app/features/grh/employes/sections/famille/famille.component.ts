import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { DbRefService } from '../../../../donnees-base/services/db-ref.service';

@Component({
  selector: 'app-famille',
  templateUrl: './famille.component.html',
  styleUrls: ['./famille.component.scss'],
  standalone: false
})
export class FamilleComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  isEditing = false;
  empId = '';

  readonly statusOptions = [
    'Standard (Age max: 18 ans)',
    'Etude / Scolarisé (Age max: 20 ans)',
    'Invalide (Sans limite d\'âge)',
    'Autre personne à charge'
  ];

  readonly sexeOptions = [
    'Féminin',
    'Masculin'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
      this.form.disable();
    });
  }

  enableEdit(): void {
    this.isEditing = true;
    this.form.enable();
  }

  cancelEdit(): void {
    if (this.employee) {
      this.buildForm();
      this.patch(this.employee);
    }
    this.form.disable();
    this.isEditing = false;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      conjointNom:           [''],
      conjointPrenom:        [''],
      conjointDateNaissance: [''],
      conjointTravail:       [false],
      conjointTelephone:     [''],
      conjointMail:          [''],
      enfants:               this.fb.array([])
    });
  }

  private patch(e: Employee): void {
    const c = (e.conjoint || {}) as any;
    this.form.patchValue({
      conjointNom:           c.nom || '',
      conjointPrenom:        c.prenom || '',
      conjointDateNaissance: c.dateNaissance || '',
      conjointTravail:       c.travail || false,
      conjointTelephone:     c.telephone || '',
      conjointMail:          c.mail || ''
    });

    this.enfants.clear();
    if (e.enfants && e.enfants.length > 0) {
      e.enfants.forEach(enf => {
        this.addEnfant(enf);
      });
    }
  }

  get enfants(): FormArray {
    return this.form.get('enfants') as FormArray;
  }

  addEnfant(data?: any): void {
    this.enfants.push(this.fb.group({
      nom:           [data?.nom || ''],
      numActe:       [data?.numActe || ''],
      sexe:          [data?.sexe || 'Féminin'],
      status:        [data?.status || 'Etude / Scolarisé (Age max: 20 ans)'],
      dateNaissance: [data?.dateNaissance || '']
    }));
  }

  removeEnfant(i: number): void {
    this.enfants.removeAt(i);
  }

  computeAge(dateStr: any, statusStr?: string): { text: string; ageYears: number; isOverLimit: boolean; isEnCharge: boolean; maxAge: number } {
    if (!dateStr) return { text: '—', ageYears: 0, isOverLimit: false, isEnCharge: false, maxAge: 18 };
    const birth = new Date(dateStr);
    if (isNaN(birth.getTime())) return { text: '—', ageYears: 0, isOverLimit: false, isEnCharge: false, maxAge: 18 };

    const params = this.dbRefService ? this.dbRefService.getParamPriseEnCharge() : { ageMaxStd: 18, ageMaxEtud: 20 };

    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const text = `${years} an(s), ${months} m`;
    const st = (statusStr || '').toLowerCase();

    let maxAge = params.ageMaxStd;
    let isInvalide = st.includes('invalide');

    if (st.includes('etude') || st.includes('scolaris') || st.includes('20') || st.includes('25')) {
      maxAge = params.ageMaxEtud;
    }

    const isEnCharge = isInvalide || (years < maxAge);
    const isOverLimit = !isInvalide && (years >= maxAge);

    return { text, ageYears: years, isOverLimit, isEnCharge, maxAge };
  }

  get calculatedChargesSummary(): { total: number; details: string; conjointCharge: boolean; validEnfants: number } {
    const raw = this.form ? this.form.getRawValue() : {};
    const params = this.dbRefService ? this.dbRefService.getParamPriseEnCharge() : { ageMaxStd: 18, ageMaxEtud: 20, maxCap: 4, conjointActif: true };

    const hasConjoint = !!(raw.conjointNom || raw.conjointTelephone || raw.conjointMail);
    const conjointCharge = params.conjointActif && hasConjoint && !raw.conjointTravail;

    let validEnfants = 0;
    (raw.enfants || []).forEach((enf: any) => {
      const res = this.computeAge(enf.dateNaissance, enf.status);
      if (res.isEnCharge) validEnfants++;
    });

    const totalRaw = (conjointCharge ? 1 : 0) + validEnfants;
    const total = Math.min(params.maxCap, totalRaw);

    let details = `${validEnfants} enfant(s) à charge (< ${params.ageMaxStd}/${params.ageMaxEtud} ans)`;
    if (conjointCharge) details += ` + 1 conjoint non-salarié`;
    else if (hasConjoint) details += ` (conjoint salarié = 0 charge)`;

    if (totalRaw > params.maxCap) details += ` [Plafonné à ${params.maxCap} charges max]`;

    return { total, details, conjointCharge, validEnfants };
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.getRawValue();

    const conjoint = (v.conjointNom || v.conjointTelephone || v.conjointMail) ? {
      nom:           v.conjointNom,
      prenom:        v.conjointPrenom,
      dateNaissance: v.conjointDateNaissance,
      travail:       v.conjointTravail,
      telephone:     v.conjointTelephone,
      mail:          v.conjointMail
    } : undefined;

    const enfants = (v.enfants || []).map((enf: any) => ({
      nom:           enf.nom,
      numActe:       enf.numActe,
      sexe:          enf.sexe,
      status:        enf.status,
      dateNaissance: enf.dateNaissance
    }));

    this.employeeService.update(this.empId, {
      conjoint,
      enfants
    }).subscribe(() => {
      this.saving = false;
      this.isEditing = false;
      this.form.disable();
      this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
