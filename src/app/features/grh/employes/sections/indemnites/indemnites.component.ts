import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Observable } from 'rxjs';

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
  isEditing = false;
  isCreationMode = false;
  empId = '';
  indemnites$!: Observable<RefItem[]>;
  typesList: RefItem[] = [];

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

    this.indemnites$ = this.dbRefService.getItems('type-indemnite');
    
    this.dbRefService.getItems('type-indemnite').subscribe(list => {
      this.typesList = list;
    });

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();

      this.dbRefService.getItems('param-indemnite').subscribe(paramList => {
        const computed = this.computeIndemnites(e, paramList || []);
        
        this.form.patchValue({
          primeLogement:      computed.logement,
          primeTransport:     computed.transport,
          primeResponsabilite: computed.responsabilite
        });

        this.employeeService.update(this.empId, {
          primeLogement:      computed.logement,
          primeTransport:     computed.transport,
          primeResponsabilite: computed.responsabilite
        }).subscribe();
      });

      this.patch(e);
      if (!this.isCreationMode) {
        this.form.disable();
      }
    });
  }

  enableEdit(): void {
    this.isEditing = true;
    this.form.enable();
  }

  cancelEdit(): void {
    if (this.employee) {
      this.patch(this.employee);
    }
    this.form.disable();
    this.isEditing = false;
  }

  private buildForm(): void {
    this.form = this.fb.group({
      primeLogement:      [0, [Validators.min(0)]],
      primeTransport:     [0, [Validators.min(0)]],
      primeResponsabilite: [0, [Validators.min(0)]],
      autresIndemnites:   this.fb.array([])
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      primeLogement:      e.primeLogement || 0,
      primeTransport:     e.primeTransport || 0,
      primeResponsabilite: e.primeResponsabilite || 0
    });
    if (e.autresIndemnites && e.autresIndemnites.length > 0) {
      this.autres.clear();
      e.autresIndemnites.forEach(item => this.autres.push(this.fb.group({
        code:    [item.code || ''],
        libelle: [item.libelle || ''],
        montant: [item.montant || 0]
      })));
    }
  }

  onTypeChange(index: number, code: string): void {
    const found = this.typesList.find(t => t.code === code);
    const row = this.autres.at(index) as FormGroup;
    if (row && found) {
      row.patchValue({
        libelle: found.libelle,
        montant: found.montant || 0
      });
    }
  }

  // Calcul dynamique des indemnités : 
  // - Pour un employé simple : Logement & Transport habituels
  // - S'il a une fonction spécifique : ajout de l'indemnité associée à la fonction
  private computeIndemnites(e: Employee, paramList: RefItem[] = []): { logement: number; transport: number; responsabilite: number } {
    let logement = 0;
    let transport = 0;
    let responsabilite = 0;

    const catUpper = (e.categoriePro || '').toUpperCase();
    const gradeUpper = (e.grade || '').toUpperCase();
    const fonctionUpper = (e.fonction || (e as any).emploi || (e as any).poste || '').toUpperCase();

    // 1. Recherche prioritaire dans les Données de Base (param-indemnite)
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

    // 2. Barème par défaut pour les indemnités habituelles (Logement & Transport selon Catégorie/Groupe)
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

    // 3. Indemnité de Fonction / Responsabilité : appliquée seulement si l'employé occupe une fonction spécifique
    if (!responsabilite && fonctionUpper) {
      if (fonctionUpper.includes('DIRECTEUR') || fonctionUpper.includes('RESPONSABLE') || fonctionUpper.includes('CHEF DE DEPARTEMENT') || fonctionUpper.includes('CEO')) {
        responsabilite = 150000;
      } else if (fonctionUpper.includes('CHEF DE SERVICE') || fonctionUpper.includes('MANAGER') || fonctionUpper.includes('SUPERVISEUR')) {
        responsabilite = 100000;
      } else if (fonctionUpper.includes('CAISSIER') || fonctionUpper.includes('GERANT')) {
        responsabilite = 50000;
      } else {
        responsabilite = 0; // Simple employé : pas de prime de fonction
      }
    }

    return { logement, transport, responsabilite };
  }

  get autres(): FormArray { return this.form.get('autresIndemnites') as FormArray; }
  
  addAutre(): void {
    if (!this.isEditing) {
      this.isEditing = true;
      this.form.enable();
    }
    const newGroup = this.fb.group({
      code:    [''],
      libelle: [''],
      montant: [0]
    });
    this.autres.push(newGroup);
    newGroup.enable();
  }
  
  removeAutre(i: number): void { this.autres.removeAt(i); }

  get totalIndemnites(): number {
    if (!this.form) return 0;
    const v = this.form.value;
    const std = (v.primeLogement || 0) + (v.primeTransport || 0) + (v.primeResponsabilite || 0);
    const aut = (v.autresIndemnites || []).reduce((acc: number, item: any) => acc + (item.montant || 0), 0);
    return std + aut;
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(next?: string): void {
    this.saving = true;
    const v = this.form.getRawValue();
    this.employeeService.update(this.empId, {
      primeLogement:       v.primeLogement,
      primeTransport:      v.primeTransport,
      primeResponsabilite: v.primeResponsabilite,
      autresIndemnites:    v.autresIndemnites
    }).subscribe(() => {
      this.saving = false;
      if (this.isCreationMode && next) {
        this.router.navigate(['/grh/employes', this.empId, next], { queryParams: { mode: 'creation' } });
      } else {
        this.isEditing = false;
        this.form.disable();
        this.router.navigate(['/grh/employes', this.empId]);
      }
    });
  }

  goNext(next: string): void {
    this.router.navigate(['/grh/employes', this.empId, next]);
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
