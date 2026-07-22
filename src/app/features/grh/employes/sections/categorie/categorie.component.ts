import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss'],
  standalone: false
})
export class CategorieComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';
  
  categories$!: Observable<RefItem[]>;
  echelons$!: Observable<RefItem[]>;
  grades$!: Observable<RefItem[]>;

  // Grille salariale pour recherche de salaire automatique
  grilleSalariale: RefItem[] = [];

  readonly niveaux = ['Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4', 'Niveau 5'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    
    this.categories$ = this.dbRefService.getItems('categorie');
    this.echelons$ = this.dbRefService.getItems('echelon');
    this.grades$ = this.dbRefService.getItems('grade');

    // Charger la grille salariale de référence
    this.dbRefService.getItems('grille-salariale').subscribe(grille => {
      this.grilleSalariale = grille;
      this.autoUpdateSalary();
    });

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);

      // Écouter les changements pour calculer le salaire automatiquement
      this.form.get('categoriePro')?.valueChanges.subscribe(() => this.autoUpdateSalary());
      this.form.get('grade')?.valueChanges.subscribe(() => this.autoUpdateSalary());
      this.form.get('echelon')?.valueChanges.subscribe(() => this.autoUpdateSalary());
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      categoriePro: [''],
      echelon:      [''],
      echelle:      [''],
      grade:        [''],
      niveau:       [''],
      salaireBase:  [0]
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      categoriePro: e.categoriePro || '',
      echelon:      e.echelon || '',
      echelle:      (e as any).echelle || '',
      grade:        e.grade || '',
      niveau:       e.niveau || '',
      salaireBase:  e.salaireBase || 0
    });

    // Seulement si le salaire n'est pas encore renseigné (> 0), on applique le calcul auto
    if (!e.salaireBase || e.salaireBase === 0) {
      this.autoUpdateSalary(false);
    }
  }

  selectedGrilleId: any = null;

  // Effectue la recherche automatique du salaire de base et de l'échelle à partir de la grille salariale
  private autoUpdateSalary(force = false): void {
    if (this.grilleSalariale.length === 0 || !this.form) return;

    const currentSal = this.form.get('salaireBase')?.value;
    if (currentSal > 0 && !force) return;

    const catVal = (this.form.get('categoriePro')?.value || '').trim().toLowerCase();
    const gradeVal = (this.form.get('grade')?.value || '').trim().toLowerCase();
    const echVal = (this.form.get('echelon')?.value || '').trim().toLowerCase();

    const match = this.grilleSalariale.find(item => {
      const gCode = (item.code || '').trim().toLowerCase();
      const gLib = (item.libelle || (item as any).category || '').trim().toLowerCase();
      const gEch = (item.echellon || '').trim().toLowerCase();

      const matchGrade = !gradeVal || gCode === gradeVal || gCode.includes(gradeVal) || gradeVal.includes(gCode);
      const matchCat = !catVal || gLib === catVal || gLib.includes(catVal) || catVal.includes(gLib);
      const cleanEch = echVal.replace('échelon', '').replace('echelon', '').trim();
      const matchEch = !echVal || gEch === echVal || gEch === cleanEch || gEch.includes(cleanEch);

      return (matchGrade || matchCat) && matchEch;
    }) || this.grilleSalariale[0];

    if (match) {
      this.onSelectGrille(match);
    }
  }

  // Restaure la valeur initiale de l'employé
  annuler(): void {
    if (this.employee) {
      this.patch(this.employee);
    } else {
      this.goBack();
    }
  }

  // Sélection directe depuis le menu Grille Salariale
  onSelectGrille(g: any): void {
    if (!g || !this.form) return;
    this.selectedGrilleId = g;

    const catTarget = (g.libelle || g.category || '').trim();
    const gradeTarget = (g.code || g.grade || '').trim();

    let echTarget = (g.echellon || g.echelon || '').trim();
    if (echTarget && !echTarget.toLowerCase().startsWith('échelon') && !echTarget.toLowerCase().startsWith('echelon')) {
      echTarget = 'Échelon ' + echTarget;
    }

    const sal = g.montant || g.salaireBase || 250000;
    const ech = g.echelle || 'Échelle A';

    this.form.patchValue({
      categoriePro: catTarget,
      grade:        gradeTarget,
      echelon:      echTarget,
      echelle:      ech,
      salaireBase:  sal
    });

    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }

  // Force la réapplication des tarifs de la grille salariale
  reinitialiserSelonGrille(): void {
    this.autoUpdateSalary(true);
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(next?: string): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;
    this.employeeService.update(this.empId, {
      categoriePro: v.categoriePro,
      echelon:      v.echelon,
      echelle:      v.echelle,
      grade:        v.grade,
      niveau:       v.niveau,
      salaireBase:  +v.salaireBase
    } as any).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
