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
      categoriePro: e.categoriePro,
      echelon:      e.echelon,
      echelle:      (e as any).echelle || '',
      grade:        e.grade || '',
      niveau:       e.niveau || '',
      salaireBase:  e.salaireBase
    });
  }

  // Effectue la recherche automatique du salaire de base et de l'échelle
  private autoUpdateSalary(): void {
    if (this.grilleSalariale.length === 0 || !this.form) return;

    const catVal = this.form.get('categoriePro')?.value;
    const echVal = this.form.get('echelon')?.value;

    if (!catVal || !echVal) return;

    // Normalisation de la catégorie (ex: "Catégorie I" ou "I" -> "I", "Hors Catégorie" -> "HORS CATEGORIE")
    let cleanCat = String(catVal).trim().toUpperCase();
    if (cleanCat.startsWith('CATÉGORIE')) {
      cleanCat = cleanCat.replace('CATÉGORIE', '').trim();
    } else if (cleanCat.startsWith('CAT')) {
      cleanCat = cleanCat.replace('CAT', '').trim();
    } else if (cleanCat === 'HORS CATÉGORIE' || cleanCat === 'HORS CATEGORIE' || cleanCat === 'HC') {
      cleanCat = 'HORS CATÉGORIE';
    }

    // Normalisation de l'échelon (ex: "Échelon 1" ou "1" -> "1")
    let cleanEch = String(echVal).trim().toUpperCase();
    if (cleanEch.startsWith('ÉCHELON')) {
      cleanEch = cleanEch.replace('ÉCHELON', '').trim();
    } else if (cleanEch.startsWith('ÉCH')) {
      cleanEch = cleanEch.replace('ÉCH', '').trim();
    }

    // Recherche de correspondance dans la grille salariale
    const match = this.grilleSalariale.find(item => {
      let itemCat = (item.libelle || '').trim().toUpperCase();
      if (itemCat === 'HORS CATEGORIE' || itemCat === 'HORS CATÉGORIE' || itemCat === 'HC') {
        itemCat = 'HORS CATÉGORIE';
      }
      
      const itemEch = (item.echellon || '').trim().toUpperCase();
      return itemCat === cleanCat && itemEch === cleanEch;
    });

    if (match) {
      this.form.patchValue({
        salaireBase: match.montant,
        echelle: match.echelle || ''
      }, { emitEvent: false }); // Empêcher les boucles d'événements
    }
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
