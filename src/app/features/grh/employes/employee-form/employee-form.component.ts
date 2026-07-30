import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { StatutEmploye } from '../models/employee.model';
import { DbRefService, RefItem } from '../../../donnees-base/services/db-ref.service';

export const SALARY_MATRIX_MAP: Record<string, Record<number, number>> = {
  '1':    { 1: 95945,  2: 97864,  3: 99821,  4: 101818, 5: 103854, 6: 105931, 7: 108050, 8: 110211, 9: 112415, 10: 114663, 11: 116957, 12: 119296, 13: 121682, 14: 124115, 15: 126598 },
  '2':    { 1: 103130, 2: 105193, 3: 107296, 4: 109442, 5: 111631, 6: 113864, 7: 116141, 8: 118464, 9: 120833, 10: 123250, 11: 125715, 12: 128229, 13: 130794, 14: 133410, 15: 136078 },
  '3':    { 1: 114258, 2: 116543, 3: 118874, 4: 121252, 5: 123677, 6: 126150, 7: 128673, 8: 131247, 9: 133872, 10: 136549, 11: 139280, 12: 142066, 13: 144907, 14: 147805, 15: 150761 },
  '4':    { 1: 125026, 2: 127527, 3: 130077, 4: 132679, 5: 135332, 6: 138039, 7: 140800, 8: 143616, 9: 146488, 10: 149418, 11: 152406, 12: 155454, 13: 158563, 14: 161735, 15: 164969 },
  '5':    { 1: 137357, 2: 140104, 3: 142906, 4: 145764, 5: 148679, 6: 151653, 7: 154686, 8: 157780, 9: 160935, 10: 164154, 11: 167437, 12: 170786, 13: 174202, 14: 177686, 15: 181239 },
  '6':    { 1: 154388, 2: 157476, 3: 160625, 4: 163838, 5: 167115, 6: 170457, 7: 173866, 8: 177343, 9: 180890, 10: 184508, 11: 188198, 12: 191962, 13: 195801, 14: 199717, 15: 203712 },
  '7':    { 1: 171632, 2: 175065, 3: 178566, 4: 182137, 5: 185780, 6: 189496, 7: 193286, 8: 197151, 9: 201094, 10: 205116, 11: 209219, 12: 213403, 13: 217671, 14: 222025, 15: 226465 },
  'I':    { 1: 191316, 2: 195142, 3: 199045, 4: 203026, 5: 207087, 6: 211228, 7: 215453, 8: 219762, 9: 224157, 10: 228640, 11: 233213, 12: 237877, 13: 242635, 14: 247488, 15: 252437 },
  'II':   { 1: 213233, 2: 217498, 3: 221848, 4: 226285, 5: 230810, 6: 235427, 7: 240135, 8: 244938, 9: 249837, 10: 254833, 11: 259930, 12: 265129, 13: 270431, 14: 275840, 15: 281357 },
  'III':  { 1: 237890, 2: 242648, 3: 247501, 4: 252451, 5: 257500, 6: 262650, 7: 267903, 8: 273261, 9: 278726, 10: 284301, 11: 289987, 12: 295787, 13: 301702, 14: 307736, 15: 313891 },
  'IV':   { 1: 266155, 2: 271478, 3: 276908, 4: 282446, 5: 288095, 6: 293857, 7: 299734, 8: 305729, 9: 311843, 10: 318080, 11: 324442, 12: 330931, 13: 337549, 14: 344300, 15: 351186 },
  'V':    { 1: 298492, 2: 304462, 3: 310551, 4: 316762, 5: 323097, 6: 329559, 7: 336150, 8: 342873, 9: 349731, 10: 356725, 11: 363860, 12: 371137, 13: 378560, 14: 386131, 15: 393854 },
  'VI':   { 1: 335041, 2: 341742, 3: 348577, 4: 355548, 5: 362659, 6: 369912, 7: 377311, 8: 384857, 9: 392554, 10: 400405, 11: 408413, 12: 416581, 13: 424913, 14: 433411, 15: 442080 },
  'VII':  { 1: 376288, 2: 383814, 3: 391490, 4: 399320, 5: 407306, 6: 415452, 7: 423761, 8: 432237, 9: 440881, 10: 449699, 11: 458693, 12: 467867, 13: 477224, 14: 486769, 15: 496504 },
  'VIII': { 1: 423528, 2: 431999, 3: 440639, 4: 449451, 5: 458440, 6: 467609, 7: 476961, 8: 486501, 9: 496231, 10: 506155, 11: 516278, 12: 526604, 13: 537136, 14: 547879, 15: 558836 }
};

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  standalone: false
})
export class EmployeeFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;
  empId?: string;

  statuts: StatutEmploye[] = ['Actif', 'Inactif', 'Suspendu', "Période d'essai", 'Congé maladie', 'Détaché'];
  echelonsList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  emplois$!: Observable<RefItem[]>;
  fonctions$!: Observable<RefItem[]>;
  contrats$!: Observable<RefItem[]>;
  directions$!: Observable<RefItem[]>;
  departements$!: Observable<RefItem[]>;
  services$!: Observable<RefItem[]>;

  calculatedSalary = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public employeeService: EmployeeService,
    private dbRefService: DbRefService
  ) {}

  ngOnInit(): void {
    this.emplois$      = this.dbRefService.getItems('emploi');
    this.fonctions$    = this.dbRefService.getItems('fonction');
    this.contrats$     = this.dbRefService.getItems('type-contrat');
    this.directions$   = this.dbRefService.getItems('direction');
    this.departements$ = this.dbRefService.getItems('departement');
    this.services$     = this.dbRefService.getItems('service');

    this.empId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.empId;

    this.form = this.fb.group({
      nom:                    ['', Validators.required],
      prenom:                 ['', Validators.required],
      dateNaissance:          [''],
      nombrePersonnesCharge:  [0, [Validators.min(0)]],
      matricule:              ['', Validators.required],
      organismeRetraite:      ['CNSS'],
      statut:                 ['Actif'],
      fonction:               [''],
      poste:                  [''],
      categoriePro:           ['1'],
      grade:                  ['GROUPE I'],
      echelon:                ['1'],
      service:                [''],
      direction:              [''],
      departement:            [''],
      typeContrat:            ['CDI'],
      dateEmbauche:           [''],
      emailPro:               ['']
    });

    this.recalcSalary();

    if (!this.isEdit) {
      this.form.patchValue({
        matricule: this.employeeService.generateMatricule()
      });
    }

    if (this.isEdit && this.empId) {
      this.employeeService.getById(this.empId).subscribe(emp => {
        if (emp) {
          const nbCharge = (emp.personnesCharge?.length || 0) + (emp.enfants?.length || 0) + (emp.conjoint ? 1 : 0);
          this.form.patchValue({
            nom:                    emp.nom,
            prenom:                 emp.prenom,
            dateNaissance:          emp.dateNaissance || '',
            nombrePersonnesCharge:  nbCharge,
            matricule:              emp.matricule,
            organismeRetraite:      emp.organismeRetraite || 'CNSS',
            statut:                 emp.statut || 'Actif',
            fonction:               emp.fonction || '',
            poste:                  emp.poste || '',
            categoriePro:           emp.categoriePro || '1',
            grade:                  emp.grade || 'GROUPE I',
            echelon:                emp.echelon || '1',
            service:                emp.service || '',
            direction:              emp.direction || '',
            departement:            emp.departement || '',
            typeContrat:            emp.typeContrat || 'CDI',
            dateEmbauche:           emp.dateEmbauche || '',
            emailPro:               emp.email || (emp as any).emailPro || ''
          });
          this.recalcSalary();
        }
      });
    }
  }

  onCategoryChange(catCode: string): void {
    let groupe = 'GROUPE I';
    if (['I', 'II', 'III', 'IV'].includes(catCode)) {
      groupe = 'GROUPE II';
    } else if (['V', 'VI', 'VII', 'VIII'].includes(catCode)) {
      groupe = 'GROUPE III';
    }
    this.form.patchValue({ grade: groupe });
    this.recalcSalary();
  }

  recalcSalary(): void {
    const cat = this.form?.get('categoriePro')?.value || '1';
    const ech = parseInt(this.form?.get('echelon')?.value || '1', 10);
    this.calculatedSalary = SALARY_MATRIX_MAP[cat]?.[ech] || 0;
  }

  getSelectedCategoryLabel(): string {
    const cat = this.form?.get('categoriePro')?.value;
    const labels: Record<string, string> = {
      '1': '1ÈRE CATEGORIE', '2': '2ÈME CATEGORIE', '3': '3ÈME CATEGORIE',
      '4': '4ÈME CATEGORIE', '5': '5ÈME CATEGORIE', '6': '6ÈME CATEGORIE', '7': '7ÈME CATEGORIE',
      'I': 'CLASSE I', 'II': 'CLASSE II', 'III': 'CLASSE III', 'IV': 'CLASSE IV',
      'V': 'CLASSE V', 'VI': 'CLASSE VI', 'VII': 'CLASSE VII', 'VIII': 'CLASSE VIII'
    };
    return labels[cat] || cat;
  }

  formatMontant(val: number): string {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val).replace(/\s/g, ' ');
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.value;

    const data: Partial<any> = {
      nom: val.nom,
      prenom: val.prenom,
      dateNaissance: val.dateNaissance,
      matricule: val.matricule,
      organismeRetraite: val.organismeRetraite,
      statut: val.statut,
      fonction: val.fonction,
      poste: val.poste || 'Collaborateur',
      categoriePro: val.categoriePro,
      grade: val.grade,
      echelon: val.echelon,
      salaireBase: this.calculatedSalary,
      service: val.service,
      direction: val.direction,
      departement: val.departement,
      typeContrat: val.typeContrat,
      dateEmbauche: val.dateEmbauche,
      email: val.emailPro,
      emailPro: val.emailPro
    };

    if (this.isEdit && this.empId) {
      this.employeeService.update(this.empId, data).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/grh/employes', this.empId]);
        },
        error: () => this.saving = false
      });
    } else {
      this.employeeService.create(data as any).subscribe({
        next: (created) => {
          this.saving = false;
          this.router.navigate(['/grh/employes', created.id]);
        },
        error: () => this.saving = false
      });
    }
  }

  cancel(): void {
    if (this.isEdit && this.empId) {
      this.router.navigate(['/grh/employes', this.empId]);
    } else {
      this.router.navigate(['/grh/employes']);
    }
  }
}
