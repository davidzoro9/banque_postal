import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';

@Component({
  selector: 'app-infos-personnelles',
  templateUrl: './infos-personnelles.component.html',
  styleUrls: ['./infos-personnelles.component.scss'],
  standalone: false
})
export class InfosPersonnellesComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  empId = '';
  villes: RefItem[] = [];

  readonly sexes = [{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }];

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
    });
    this.loadVilles();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nom:           [''],
      prenom:        [''],
      nomJeuneFille: [''],
      sexe:          ['M'],
      dateNaissance: [''],
      lieuNaissance: [''],
      nationalite:   [''],
      numeroCNI:     [''],
      adresse:       [''],
      ville:         [''],
      codePostal:    [''],
      pays:          [''],
      telephone:     [''],
      email:         ['', [Validators.email]]
    });
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      nom: e.nom, prenom: e.prenom, nomJeuneFille: e.nomJeuneFille || '',
      sexe: e.sexe, dateNaissance: e.dateNaissance, lieuNaissance: e.lieuNaissance,
      nationalite: e.nationalite, numeroCNI: e.numeroCNI,
      adresse: e.adresse, ville: e.ville, codePostal: e.codePostal,
      pays: e.pays, telephone: e.telephone, email: e.email
    });
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(next?: string): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;
    
    let dob = v.dateNaissance;
    if (dob instanceof Date) {
      // Use local timezone formatting to avoid date shift
      const year = dob.getFullYear();
      const month = String(dob.getMonth() + 1).padStart(2, '0');
      const day = String(dob.getDate()).padStart(2, '0');
      dob = `${year}-${month}-${day}`;
    }

    this.employeeService.update(this.empId, {
      nom: v.nom, prenom: v.prenom, nomJeuneFille: v.nomJeuneFille,
      sexe: v.sexe, dateNaissance: dob, lieuNaissance: v.lieuNaissance,
      nationalite: v.nationalite, numeroCNI: v.numeroCNI,
      adresse: v.adresse, ville: v.ville, codePostal: v.codePostal,
      pays: v.pays, telephone: v.telephone, email: v.email
    }).subscribe(() => {
      this.saving = false;
      if (next) this.router.navigate(['/grh/employes', this.empId, next]);
      else this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  loadVilles(): void {
    this.dbRefService.getItems('ville').subscribe({
      next: (items) => {
        this.villes = items;
        if (items.length === 0) {
          this.initDefaultVilles();
        }
      }
    });
  }

  private initDefaultVilles(): void {
    const defaults = [
      { code: 'OUAGA', libelle: 'Ouagadougou', description: 'Capitale politique', actif: true },
      { code: 'BOBO', libelle: 'Bobo-Dioulasso', description: 'Capitale économique', actif: true },
      { code: 'KOUDOU', libelle: 'Koudougou', description: 'Région du Centre-Ouest', actif: true },
      { code: 'OUAHI', libelle: 'Ouahigouya', description: 'Région du Nord', actif: true },
      { code: 'BANF', libelle: 'Banfora', description: 'Région des Cascades', actif: true },
      { code: 'KAYA', libelle: 'Kaya', description: 'Région du Centre-Nord', actif: true },
      { code: 'TENKO', libelle: 'Tenkodogo', description: 'Région du Centre-Est', actif: true },
      { code: 'FADA', libelle: 'Fada N\'gourma', description: 'Région de l\'Est', actif: true },
      { code: 'DEDOU', libelle: 'Dédougou', description: 'Région de la Boucle du Mouhoun', actif: true },
      { code: 'MANGA', libelle: 'Manga', description: 'Région du Centre-Sud', actif: true }
    ];
    const calls = defaults.map(d => this.dbRefService.addItem('ville', d));
    forkJoin(calls).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.villes = res[res.length - 1];
        }
      }
    });
  }

  goToFamille(): void { this.router.navigate(['/grh/employes', this.empId, 'famille']); }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
