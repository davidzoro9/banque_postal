import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Observable } from 'rxjs';

export interface ApplicableIndemnite {
  id?: string;
  code: string;
  typeIndemnite: string;
  fonction: string;
  grade: string;
  categorie: string;
  taux: number;
  applied: boolean;
  description?: string;
}

@Component({
  selector: 'app-indemnites',
  templateUrl: './indemnites.component.html',
  styleUrls: ['./indemnites.component.scss'],
  standalone: false
})
export class IndemnitesComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';

  allParams: RefItem[] = [];
  fonctions$!: Observable<RefItem[]>;

  gradesList = ['GROUPE I', 'GROUPE II', 'GROUPE III'];
  categoriesList = ['1', '2', '3', '4', '5', '6', '7', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  applicableIndemnites: ApplicableIndemnite[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.fonctions$ = this.dbRefService.getItems('fonction');

    this.form = this.fb.group({
      grade:        ['GROUPE I'],
      categoriePro: ['1'],
      fonction:     ['']
    });

    // 1. Charge les règles de paramétrage d'indemnité depuis Données de base
    this.dbRefService.getItems('param-indemnite').subscribe(params => {
      this.allParams = params || [];

      // 2. Charge l'employé
      this.employeeService.getById(this.empId).subscribe(e => {
        if (!e) { this.router.navigate(['/grh/employes']); return; }
        this.employee = e;

        let initialGrade = e.grade || 'GROUPE I';
        let initialCat   = e.categoriePro || '1';

        if (['1','2','3','4','5','6','7'].includes(initialCat)) initialGrade = 'GROUPE I';
        else if (['I','II','III','IV'].includes(initialCat)) initialGrade = 'GROUPE II';
        else if (['V','VI','VII','VIII'].includes(initialCat)) initialGrade = 'GROUPE III';

        this.form.patchValue({
          grade: initialGrade,
          categoriePro: initialCat,
          fonction: e.fonction || ''
        });

        this.recalculateIndemnites();
      });
    });

    // Écoute des modifs sur les paramètres de calcul
    this.form.valueChanges.subscribe(() => {
      this.recalculateIndemnites();
    });
  }

  onCategoryChange(cat: string): void {
    let groupe = 'GROUPE I';
    if (['I', 'II', 'III', 'IV'].includes(cat)) {
      groupe = 'GROUPE II';
    } else if (['V', 'VI', 'VII', 'VIII'].includes(cat)) {
      groupe = 'GROUPE III';
    }
    this.form.patchValue({ grade: groupe }, { emitEvent: true });
  }

  recalculateIndemnites(): void {
    const grade = this.form?.get('grade')?.value || 'GROUPE I';
    const cat   = (this.form?.get('categoriePro')?.value || '1').trim().toUpperCase();
    const fct   = (this.form?.get('fonction')?.value || '').trim().toLowerCase();

    this.applicableIndemnites = [];

    this.allParams.forEach(p => {
      if (p.actif === false) return;

      const pGrade = (p.grade || '').trim().toUpperCase();
      const pCat   = (p.categorie || '').trim().toUpperCase();
      const pFct   = (p.fonction || '').trim().toLowerCase();

      const matchGrade = !pGrade || pGrade === grade.trim().toUpperCase();

      let matchCat = false;
      if (!pCat) {
        matchCat = true;
      } else if (pCat === '1 À 7' || pCat === '1 A 7' || pCat === '1-7') {
        matchCat = ['1','2','3','4','5','6','7'].includes(cat);
      } else {
        matchCat = pCat === cat;
      }

      let matchFct = false;
      if (!pFct) {
        matchFct = true;
      } else if (fct && (pFct.includes(fct) || fct.includes(pFct))) {
        matchFct = true;
      }

      if (matchGrade && matchCat && matchFct) {
        this.applicableIndemnites.push({
          id: p.id,
          code: p.code || 'PI-REF',
          typeIndemnite: p.typeIndemnite || p.libelle || 'Indemnité',
          fonction: p.fonction || '-',
          grade: p.grade || grade,
          categorie: p.categorie || cat,
          taux: p.taux || p.montant || 0,
          applied: true,
          description: p.description
        });
      }
    });
  }

  toggleApplied(item: ApplicableIndemnite): void {
    item.applied = !item.applied;
  }

  get totalIndemnites(): number {
    return this.applicableIndemnites
      .filter(i => i.applied)
      .reduce((sum, i) => sum + i.taux, 0);
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(): void {
    if (!this.employee) return;
    this.saving = true;

    const appliedList = this.applicableIndemnites.filter(i => i.applied);

    let log = 0;
    let tpt = 0;
    let resp = 0;
    const autres: any[] = [];

    appliedList.forEach(item => {
      const type = item.typeIndemnite.toLowerCase();
      if (type.includes('logement')) log += item.taux;
      else if (type.includes('transport')) tpt += item.taux;
      else if (type.includes('responsabilit') || type.includes('sujét') || type.includes('fonction')) resp += item.taux;
      else autres.push({ code: item.code, libelle: item.typeIndemnite, montant: item.taux });
    });

    const updateData: Partial<Employee> = {
      grade: this.form.get('grade')?.value,
      categoriePro: this.form.get('categoriePro')?.value,
      fonction: this.form.get('fonction')?.value,
      primeLogement: log,
      primeTransport: tpt,
      primeResponsabilite: resp,
      autresIndemnites: autres
    };

    this.employeeService.update(this.empId, updateData).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/grh/employes', this.empId]);
      },
      error: () => this.saving = false
    });
  }

  goBack(): void {
    this.router.navigate(['/grh/employes', this.empId]);
  }

  formatMontant(val: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val).replace(/\s/g, ' ');
  }
}
