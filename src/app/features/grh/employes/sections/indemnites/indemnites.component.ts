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
  avantageSaved = false;

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
      vehiculeFourni:     [false],
      logementFourni:     [false],
      autresIndemnites:   this.fb.array([])
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      primeLogement:      e.primeLogement || 0,
      primeTransport:     e.primeTransport || 0,
      primeResponsabilite: e.primeResponsabilite || 0,
      vehiculeFourni:     e.vehiculeFourni || false,
      logementFourni:     e.logementFourni || false
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

    const catUpper = (e.categoriePro || '').trim().toUpperCase();
    const gradeUpper = (e.grade || '').trim().toUpperCase();
    const fonctionUpper = (e.fonction || (e as any).emploi || (e as any).poste || '').trim().toUpperCase();

    const isNominated = !!fonctionUpper && !fonctionUpper.includes('AGENT SIMPLE') && !fonctionUpper.includes('SANS FONCTION');

    if (paramList && paramList.length > 0) {
      // 1. Si l'employé occupe une fonction de nomination (Directeur, Responsable, Chef de Service, Chef d'Agence, etc.)
      if (isNominated) {
        paramList.forEach(p => {
          if (p.actif ?? true) {
            const pFonction = (p.fonction || '').trim().toUpperCase();
            if (pFonction && (fonctionUpper.includes(pFonction) || pFonction.includes(fonctionUpper))) {
              const m = p.taux || p.montant || 0;
              const lib = (p.typeIndemnite || p.libelle || '').toLowerCase();
              if (lib.includes('logement')) logement = m;
              if (lib.includes('transport')) transport = m;
              if (lib.includes('fonction') || lib.includes('responsabilit')) responsabilite = m;
            }
          }
        });
      }

      // 2. Si pas d'indemnité spécifique trouvée par fonction (ou si Agent simple), recherche par Catégorie / Groupe
      if (!logement || !transport) {
        paramList.forEach(p => {
          if (p.actif ?? true) {
            const pFonction = (p.fonction || '').trim().toUpperCase();
            if (!pFonction || pFonction.includes('AGENT SIMPLE') || pFonction.includes('SANS FONCTION')) {
              const m = p.taux || p.montant || 0;
              const lib = (p.typeIndemnite || p.libelle || '').toLowerCase();
              const pGrade = (p.grade || '').trim().toUpperCase();
              const pCats = Array.isArray(p.categories) ? p.categories : (p.categorie ? p.categorie.split(',').map(c => c.trim().toUpperCase()) : []);

              const matchesCat = pCats.length > 0 ? pCats.some(c => c === catUpper) : false;
              const matchesGrade = pGrade ? (gradeUpper.includes(pGrade) || pGrade.includes(gradeUpper)) : false;

              if (!logement && lib.includes('logement') && (matchesCat || matchesGrade)) {
                logement = m;
              }
              if (!transport && lib.includes('transport') && (matchesCat || matchesGrade)) {
                transport = m;
              }
            }
          }
        });
      }
    }

    // 3. Fallbacks selon la grille BPBF si non trouvés dans paramList
    if (isNominated) {
      if (!responsabilite) {
        if (fonctionUpper.includes('DIRECTEUR DE DEPARTEMENT')) responsabilite = 150000;
        else if (fonctionUpper.includes('RESPONSABLE DE DEPARTEMENT')) responsabilite = 100000;
        else if (fonctionUpper.includes('CHEF DE SERVICE')) responsabilite = 80000;
        else if (fonctionUpper.includes("CHEF D'AGENCE") || fonctionUpper.includes('CHEF DAGENCE')) responsabilite = 75000;
      }
      if (!logement) {
        if (fonctionUpper.includes('DIRECTEUR DE DEPARTEMENT')) logement = 200000;
        else if (fonctionUpper.includes('RESPONSABLE DE DEPARTEMENT')) logement = 150000;
        else if (fonctionUpper.includes('CHEF DE SERVICE')) logement = 120000;
        else if (fonctionUpper.includes("CHEF D'AGENCE") || fonctionUpper.includes('CHEF DAGENCE')) logement = 100000;
      }
      if (!transport) {
        if (fonctionUpper.includes('DIRECTEUR DE DEPARTEMENT')) transport = 100000;
        else if (fonctionUpper.includes('RESPONSABLE DE DEPARTEMENT')) transport = 75000;
        else if (fonctionUpper.includes('CHEF DE SERVICE')) transport = 75000;
        else if (fonctionUpper.includes("CHEF D'AGENCE") || fonctionUpper.includes('CHEF DAGENCE')) transport = 75000;
      }
    }

    // Fallback Agent Simple
    if (!logement) {
      if (gradeUpper.includes('GROUPE III') || ['CL5', 'CL6', 'CL7', 'CL8'].includes(catUpper)) logement = 100000;
      else if (gradeUpper.includes('GROUPE II') || ['CL1', 'CL2', 'CL3', 'CL4'].includes(catUpper)) logement = 45000;
      else logement = 35000;
    }
    if (!transport) {
      if (gradeUpper.includes('GROUPE III') || ['CL5', 'CL6', 'CL7', 'CL8'].includes(catUpper)) transport = 75000;
      else if (gradeUpper.includes('GROUPE II') || ['CL1', 'CL2', 'CL3', 'CL4'].includes(catUpper)) transport = 45000;
      else transport = 30000;
    }

    // 4. Exonération si Véhicule / Logement fourni par la banque
    if (e.vehiculeFourni) transport = 0;
    if (e.logementFourni) logement = 0;

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
      vehiculeFourni:      v.vehiculeFourni,
      logementFourni:      v.logementFourni,
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

  toggleVehicule(): void {
    if (!this.employee) return;
    this.employee.vehiculeFourni = !this.employee.vehiculeFourni;
    this.employeeService.update(this.empId, { vehiculeFourni: this.employee.vehiculeFourni }).subscribe(() => {
      this.showAvantageSaved();
      // Recalculer les indemnités
      this.dbRefService.getItems('param-indemnite').subscribe(paramList => {
        const computed = this.computeIndemnites(this.employee!, paramList || []);
        this.form.patchValue({
          primeLogement:  computed.logement,
          primeTransport: computed.transport,
          primeResponsabilite: computed.responsabilite
        });
        this.employeeService.update(this.empId, {
          primeLogement: computed.logement,
          primeTransport: computed.transport,
          primeResponsabilite: computed.responsabilite
        }).subscribe();
      });
    });
  }

  toggleLogement(): void {
    if (!this.employee) return;
    this.employee.logementFourni = !this.employee.logementFourni;
    this.employeeService.update(this.empId, { logementFourni: this.employee.logementFourni }).subscribe(() => {
      this.showAvantageSaved();
      // Recalculer les indemnités
      this.dbRefService.getItems('param-indemnite').subscribe(paramList => {
        const computed = this.computeIndemnites(this.employee!, paramList || []);
        this.form.patchValue({
          primeLogement:  computed.logement,
          primeTransport: computed.transport,
          primeResponsabilite: computed.responsabilite
        });
        this.employeeService.update(this.empId, {
          primeLogement: computed.logement,
          primeTransport: computed.transport,
          primeResponsabilite: computed.responsabilite
        }).subscribe();
      });
    });
  }

  private showAvantageSaved(): void {
    this.avantageSaved = true;
    setTimeout(() => this.avantageSaved = false, 3000);
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
