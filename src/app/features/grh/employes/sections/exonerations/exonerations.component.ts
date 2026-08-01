import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Employee } from '../../models/employee.model';
import { calculateOfficialIUTS } from '../../../../../core/utils/iuts-calculator.utils';

@Component({
  selector: 'app-exonerations',
  templateUrl: './exonerations.component.html',
  styleUrls: ['./exonerations.component.scss'],
  standalone: false
})
export class ExonerationsComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  isEditing = false;
  isCreationMode = false;
  empId = '';
  newAvantage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.isCreationMode = this.route.snapshot.queryParamMap.get('mode') === 'creation';
    this.isEditing = this.isCreationMode;

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();

      this.dbRefService.getItems('param-indemnite').subscribe(paramList => {
        this.computeExonerations(e, paramList || []);
        if (!this.isCreationMode) {
          this.form.disable();
        }
      });
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
      exonerationsFiscales:  this.fb.array([]),
      exonerationsSociales:  this.fb.array([]),
      avantagesParticuliers: this.fb.array([])
    });
  }

  private patch(e: Employee): void {
    (e.exonerationsFiscales || []).forEach(x => this.fiscales.push(this.fb.group({
      libelle: [x.libelle], montant: [x.montant]
    })));
    (e.exonerationsSociales || []).forEach(x => this.sociales.push(this.fb.group({
      libelle: [x.libelle], montant: [x.montant]
    })));
    (e.avantagesParticuliers || []).forEach(av => this.avantages.push(this.fb.control(av)));
  }

  private computeExonerations(e: Employee, paramList: RefItem[]): void {
    const sBase = e.salaireBase || 304282;
    const pLog = e.primeLogement || 0;
    const pTrans = e.primeTransport || 0;
    const pResp = e.primeResponsabilite || 0;

    const indemnitesList: Array<{ libelle: string; montant: number }> = [];
    if (pLog > 0) indemnitesList.push({ libelle: 'Indemnité de logement', montant: pLog });
    if (pTrans > 0) indemnitesList.push({ libelle: 'Indemnité de transport', montant: pTrans });
    if (pResp > 0) indemnitesList.push({ libelle: 'Indemnité de fonction', montant: pResp });

    if (e.autresIndemnites && e.autresIndemnites.length > 0) {
      e.autresIndemnites.forEach(ai => {
        if (ai.montant > 0) indemnitesList.push({ libelle: ai.libelle, montant: ai.montant });
      });
    }

    const nCharges = (e.enfants?.length || 0) + (e.conjoint ? 1 : 0);

    const calc = calculateOfficialIUTS(sBase, indemnitesList, {
      vehiculeFourni: e.vehiculeFourni,
      logementFourni: e.logementFourni,
      nombreChargesFamille: nCharges
    });

    this.fiscales.clear();
    this.sociales.clear();

    if (calc.abattementForfaitaire > 0) {
      this.fiscales.push(this.fb.group({ libelle: ['Abattement forfaitaire 20% (Frais pro.)'], montant: [calc.abattementForfaitaire] }));
    }

    if (calc.exoLogement > 0) {
      this.fiscales.push(this.fb.group({ libelle: ['Exonération logement (Plafond 75 000 FCFA / 20% SB)'], montant: [calc.exoLogement] }));
      this.sociales.push(this.fb.group({ libelle: ['Exonération logement'], montant: [calc.exoLogement] }));
    }

    if (calc.exoTransport > 0) {
      this.fiscales.push(this.fb.group({ libelle: ['Exonération transport (Plafond 30 000 FCFA / 5% SB)'], montant: [calc.exoTransport] }));
      this.sociales.push(this.fb.group({ libelle: ['Exonération transport'], montant: [calc.exoTransport] }));
    }

    calc.exoFonctionsDetails.forEach((f: { libelle: string; montantServi: number; exoReelle: number }) => {
      if (f.exoReelle > 0) {
        this.fiscales.push(this.fb.group({ libelle: [`Exonération ${f.libelle} (Plafond 50 000 FCFA / 5% SB)`], montant: [f.exoReelle] }));
        this.sociales.push(this.fb.group({ libelle: [`Exonération ${f.libelle}`], montant: [f.exoReelle] }));
      }
    });

    (this.employee?.avantagesParticuliers || []).forEach(av => this.avantages.push(this.fb.control(av)));

    this.employeeService.update(this.empId, {
      exonerationsFiscales: this.fiscales.value,
      exonerationsSociales: this.sociales.value
    }).subscribe();
  }

  private computeIndemnitesHelper(e: Employee, paramList: RefItem[]): { logement: number; transport: number; responsabilite: number } {
    let logement = 0;
    let transport = 0;
    let responsabilite = 0;

    const catUpper = (e.categoriePro || '').toUpperCase();
    const gradeUpper = (e.grade || '').toUpperCase();
    const fonctionUpper = (e.fonction || (e as any).emploi || (e as any).poste || '').toUpperCase();

    if (paramList && paramList.length > 0) {
      paramList.forEach(p => {
        if (p.actif ?? true) {
          const m = p.taux || p.montant || 0;
          const lib = (p.typeIndemnite || p.libelle || '').toLowerCase();
          const pFonction = (p.fonction || '').toUpperCase();
          const pGrade = (p.grade || '').toUpperCase();
          const pCat = (p.categorie || '').toUpperCase();

          const matchesCat = !pCat || catUpper.includes(pCat) || pCat.includes(catUpper);
          const matchesGrade = !pGrade || gradeUpper.includes(pGrade) || pGrade.includes(gradeUpper);
          const matchesFonction = pFonction && (fonctionUpper.includes(pFonction) || pFonction.includes(pFonction));

          if (lib.includes('logement') && (matchesCat || matchesGrade)) {
            logement = m;
          }
          if (lib.includes('transport') && (matchesCat || matchesGrade)) {
            transport = m;
          }
          if ((lib.includes('responsabilit') || lib.includes('fonction')) && matchesFonction) {
            responsabilite = m;
          }
        }
      });
    }

    if (!logement) {
      if (gradeUpper.includes('GROUPE III') || catUpper.includes('VI') || catUpper.includes('VII') || catUpper.includes('VIII') || catUpper.includes('V')) {
        logement = 200000;
      } else if (gradeUpper.includes('GROUPE II') || catUpper.includes('I') || catUpper.includes('II') || catUpper.includes('III') || catUpper.includes('IV')) {
        logement = 150000;
      } else {
        logement = 100000;
      }
    }

    if (!transport) {
      if (gradeUpper.includes('GROUPE III') || catUpper.includes('VI') || catUpper.includes('VII') || catUpper.includes('VIII') || catUpper.includes('V')) {
        transport = 100000;
      } else if (gradeUpper.includes('GROUPE II') || catUpper.includes('I') || catUpper.includes('II') || catUpper.includes('III') || catUpper.includes('IV')) {
        transport = 75000;
      } else {
        transport = 50000;
      }
    }

    if (!responsabilite && fonctionUpper) {
      if (fonctionUpper.includes('DIRECTEUR') || fonctionUpper.includes('RESPONSABLE') || fonctionUpper.includes('CHEF DE DEPARTEMENT') || fonctionUpper.includes('CEO')) {
        responsabilite = 150000;
      } else if (fonctionUpper.includes('CHEF DE SERVICE') || fonctionUpper.includes('MANAGER') || fonctionUpper.includes('SUPERVISEUR')) {
        responsabilite = 100000;
      } else if (fonctionUpper.includes('CAISSIER') || fonctionUpper.includes('GERANT')) {
        responsabilite = 50000;
      }
    }

    return { logement, transport, responsabilite };
  }

  get fiscales(): FormArray  { return this.form.get('exonerationsFiscales') as FormArray; }
  get sociales(): FormArray  { return this.form.get('exonerationsSociales') as FormArray; }
  get avantages(): FormArray { return this.form.get('avantagesParticuliers') as FormArray; }

  get totalExonerations(): number {
    if (!this.form) return 0;
    const v = this.form.getRawValue();
    const fisc = (v.exonerationsFiscales || []).reduce((acc: number, x: any) => acc + (x.montant || 0), 0);
    const soc = (v.exonerationsSociales || []).reduce((acc: number, x: any) => acc + (x.montant || 0), 0);
    return fisc + soc;
  }

  addFiscale(): void {
    this.fiscales.push(this.fb.group({ libelle: [''], montant: [0] }));
  }
  removeFiscale(i: number): void { this.fiscales.removeAt(i); }

  addSociale(): void {
    this.sociales.push(this.fb.group({ libelle: [''], montant: [0] }));
  }
  removeSociale(i: number): void { this.sociales.removeAt(i); }

  addAvantage(): void {
    const v = this.newAvantage.trim();
    if (!v) return;
    this.avantages.push(this.fb.control(v));
    this.newAvantage = '';
  }
  removeAvantage(i: number): void { this.avantages.removeAt(i); }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(): void {
    this.saving = true;
    const v = this.form.getRawValue();
    this.employeeService.update(this.empId, {
      exonerationsFiscales:  v.exonerationsFiscales,
      exonerationsSociales:  v.exonerationsSociales,
      avantagesParticuliers: v.avantagesParticuliers
    }).subscribe(() => {
      this.saving = false;
      this.isEditing = false;
      this.form.disable();
      this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goNext(next: string): void {
    this.router.navigate(['/grh/employes', this.empId, next]);
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
