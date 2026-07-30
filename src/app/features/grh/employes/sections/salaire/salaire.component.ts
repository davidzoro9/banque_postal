import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { SALARY_MATRIX_MAP } from '../../employee-form/employee-form.component';

@Component({
  selector: 'app-salaire',
  templateUrl: './salaire.component.html',
  styleUrls: ['./salaire.component.scss'],
  standalone: false
})
export class SalaireComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';

  echelonsList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  calculatedSalaireBase = 0;
  totalPrimes = 0;
  calculatedSalaireBrut = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.buildForm();

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.patch(e);
      this.recalculate();
    });

    this.form.valueChanges.subscribe(() => {
      this.recalculate();
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      categoriePro: ['1'],
      grade:        ['GROUPE I'],
      echelon:      ['1'],
      modePaiement: ['Virement bancaire'],
      banque:       ['Banque Postale du Burkina Faso (BPBF)'],
      iban:         ['']
    });
  }

  private patch(e: Employee): void {
    let groupe = e.grade || 'GROUPE I';
    const cat = e.categoriePro || '1';
    if (['1','2','3','4','5','6','7'].includes(cat)) groupe = 'GROUPE I';
    else if (['I','II','III','IV'].includes(cat)) groupe = 'GROUPE II';
    else if (['V','VI','VII','VIII'].includes(cat)) groupe = 'GROUPE III';

    this.form.patchValue({
      categoriePro: cat,
      grade:        groupe,
      echelon:      e.echelon || '1',
      modePaiement: e.modePaiement || 'Virement bancaire',
      banque:       e.banque || 'Banque Postale du Burkina Faso (BPBF)',
      iban:         e.iban || ''
    }, { emitEvent: false });
  }

  onCategoryChange(catCode: string): void {
    let groupe = 'GROUPE I';
    if (['I', 'II', 'III', 'IV'].includes(catCode)) {
      groupe = 'GROUPE II';
    } else if (['V', 'VI', 'VII', 'VIII'].includes(catCode)) {
      groupe = 'GROUPE III';
    }
    this.form.patchValue({ grade: groupe }, { emitEvent: true });
  }

  recalculate(): void {
    if (!this.employee) return;

    const cat = this.form.get('categoriePro')?.value || '1';
    const ech = parseInt(this.form.get('echelon')?.value || '1', 10);

    // 1. Calcul du salaire de base d'après la Grille Salariale
    this.calculatedSalaireBase = SALARY_MATRIX_MAP[cat]?.[ech] || this.employee.salaireBase || 0;

    // 2. Cumul des primes & indemnités existantes sur la fiche
    const log = this.employee.primeLogement || 0;
    const tpt = this.employee.primeTransport || 0;
    const resp = this.employee.primeResponsabilite || 0;
    const autres = (this.employee.autresIndemnites || []).reduce((sum, item) => sum + (item.montant || 0), 0);

    this.totalPrimes = log + tpt + resp + autres;

    // 3. Calcul du salaire brut total
    this.calculatedSalaireBrut = this.calculatedSalaireBase + this.totalPrimes;
  }

  get showBancaire(): boolean {
    return this.form.get('modePaiement')?.value === 'Virement bancaire';
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  formatMontant(val: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val).replace(/\s/g, ' ');
  }

  save(next?: string): void {
    if (this.form.invalid || !this.employee) return;
    this.saving = true;
    const v = this.form.value;

    this.employeeService.update(this.empId, {
      categoriePro: v.categoriePro,
      grade:        v.grade,
      echelon:      v.echelon,
      salaireBase:  this.calculatedSalaireBase,
      salaireBrut:  this.calculatedSalaireBrut,
      modePaiement: v.modePaiement,
      banque:       v.banque,
      iban:         v.iban
    }).subscribe({
      next: () => {
        this.saving = false;
        if (next) this.router.navigate(['/grh/employes', this.empId, next]);
        else this.router.navigate(['/grh/employes', this.empId]);
      },
      error: () => this.saving = false
    });
  }

  goBack(): void {
    this.router.navigate(['/grh/employes', this.empId]);
  }
}
