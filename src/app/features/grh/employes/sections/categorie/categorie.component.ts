import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Employee } from '../../models/employee.model';

const SALARY_MATRIX: Record<string, { groupe: string; values: number[] }> = {
  'C1':   { groupe: 'GROUPE I',   values: [95945, 105540, 116093, 127703, 140473, 154520, 169972, 186970, 205667, 226233, 248857, 273742, 301117, 331228, 364351] },
  'C2':   { groupe: 'GROUPE I',   values: [104474, 114921, 126414, 139055, 152960, 168256, 185082, 203590, 223949, 246344, 270979, 298077, 327884, 360673, 396740] },
  'C3':   { groupe: 'GROUPE I',   values: [107135, 117849, 129633, 142597, 156856, 172542, 189796, 208776, 229653, 252619, 277881, 305669, 336236, 369859, 406845] },
  'C4':   { groupe: 'GROUPE I',   values: [115558, 127114, 139825, 153808, 169188, 186107, 204718, 225190, 247709, 272480, 299728, 329700, 362671, 398938, 438831] },
  'C5':   { groupe: 'GROUPE I',   values: [128831, 141714, 155886, 171474, 188621, 207484, 228232, 251055, 276161, 303777, 334154, 367570, 404327, 444760, 489236] },
  'C6':   { groupe: 'GROUPE I',   values: [157940, 173734, 191107, 210218, 231240, 254364, 279800, 307780, 338558, 372414, 409656, 450621, 495683, 545252, 599777] },
  'C7':   { groupe: 'GROUPE I',   values: [176441, 194085, 213494, 234843, 258327, 284160, 312576, 343834, 378217, 416039, 457643, 503407, 553747, 609122, 670034] },
  'CL1':  { groupe: 'GROUPE II',  values: [173090, 190399, 209439, 230383, 253421, 278763, 306639, 337303, 371034, 408137, 448951, 493846, 543231, 597554, 657309] },
  'CL2':  { groupe: 'GROUPE II',  values: [203834, 224217, 246639, 271303, 298433, 328277, 361104, 397215, 436936, 480630, 528693, 581562, 639718, 703690, 774059] },
  'CL3':  { groupe: 'GROUPE II',  values: [278697, 306567, 337223, 370946, 408040, 448844, 493729, 543102, 597412, 657153, 722868, 795155, 874671, 962138, 1058351] },
  'CL4':  { groupe: 'GROUPE II',  values: [405758, 446334, 490967, 540064, 594070, 653477, 718825, 790708, 869778, 956756, 1052432, 1157675, 1273442, 1400787, 1540865] },
  'CL5':  { groupe: 'GROUPE III', values: [581390, 639529, 703482, 773830, 851213, 936334, 1029968, 1132965, 1246261, 1370887, 1507976, 1658774, 1824651, 2007116, 2207828] },
  'CL6':  { groupe: 'GROUPE III', values: [599438, 659382, 725320, 797852, 877637, 965401, 1061941, 1168135, 1284949, 1413443, 1554788, 1710267, 1881293, 2069423, 2276365] },
  'CL7':  { groupe: 'GROUPE III', values: [631454, 694599, 764059, 840465, 924512, 1016963, 1118659, 1230525, 1353578, 1488936, 1637829, 1801612, 1981773, 2179950, 2397946] },
  'CL8':  { groupe: 'GROUPE III', values: [710386, 781425, 859567, 945524, 1040076, 1144084, 1258492, 1384341, 1522775, 1675053, 1842558, 2026814, 2229496, 2452445, 2697690] }
};

function parseCategoryCode(cat: string): string {
  if (!cat) return '';
  const upper = cat.toUpperCase().trim();
  if (upper.includes('CL8') || upper.includes('VIII')) return 'CL8';
  if (upper.includes('CL7') || upper.includes('VII')) return 'CL7';
  if (upper.includes('CL6') || upper.includes('VI')) return 'CL6';
  if (upper.includes('CL5') || upper.includes('V')) return 'CL5';
  if (upper.includes('CL4') || upper.includes('IV')) return 'CL4';
  if (upper.includes('CL3') || upper.includes('III')) return 'CL3';
  if (upper.includes('CL2') || upper.includes('II')) return 'CL2';
  if (upper.includes('CL1') || upper.includes('CLASSE I')) return 'CL1';
  if (upper.includes('C7') || upper.includes('7')) return 'C7';
  if (upper.includes('C6') || upper.includes('6')) return 'C6';
  if (upper.includes('C5') || upper.includes('5')) return 'C5';
  if (upper.includes('C4') || upper.includes('4')) return 'C4';
  if (upper.includes('C3') || upper.includes('3')) return 'C3';
  if (upper.includes('C2') || upper.includes('2')) return 'C2';
  if (upper.includes('C1') || upper.includes('1')) return 'C1';
  return '';
}

export interface EchelonOption {
  code: string;
  label: string;
  baseSalary: number;
}

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
  isEditing = false;
  isCreationMode = false;
  empId = '';
  
  categories$!: Observable<RefItem[]>;
  echelons$!: Observable<RefItem[]>;

  readonly availableCategories = [
    { code: 'C1',  label: 'C1' },
    { code: 'C2',  label: 'C2' },
    { code: 'C3',  label: 'C3' },
    { code: 'C4',  label: 'C4' },
    { code: 'C5',  label: 'C5' },
    { code: 'C6',  label: 'C6' },
    { code: 'C7',  label: 'C7' },
    { code: 'CL1', label: 'CL1' },
    { code: 'CL2', label: 'CL2' },
    { code: 'CL3', label: 'CL3' },
    { code: 'CL4', label: 'CL4' },
    { code: 'CL5', label: 'CL5' },
    { code: 'CL6', label: 'CL6' },
    { code: 'CL7', label: 'CL7' },
    { code: 'CL8', label: 'CL8' }
  ];

  availableEchelons: EchelonOption[] = [];

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
    
    this.categories$ = this.dbRefService.getItems('categorie');
    this.echelons$ = this.dbRefService.getItems('echelon');

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
      if (!this.isCreationMode) {
        this.form.disable();
      }

      this.form.get('categoriePro')?.valueChanges.subscribe(cat => this.onCategoryChange(cat));
      this.form.get('echelon')?.valueChanges.subscribe(() => this.autoUpdateSalary());
    });
  }

  enableEdit(): void {
    this.isEditing = true;
    this.form.enable();
    const cat = this.form.get('categoriePro')?.value;
    if (!cat) {
      this.form.get('echelon')?.disable();
    }
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
      categoriePro: [''],
      echelon:      [''],
      salaireBase:  [0],
      salaireBrut:  [0]
    });
  }

  private patch(e: Employee): void {
    const rawCat = parseCategoryCode(e.categoriePro || '') || e.categoriePro || '';
    const rawEch = e.echelon || 'E01';

    this.form.patchValue({
      categoriePro: rawCat,
      echelon:      rawEch,
      salaireBase:  e.salaireBase || 0,
      salaireBrut:  e.salaireBrut || 0
    });

    this.onCategoryChange(rawCat);
  }

  onCategoryChange(catVal: string): void {
    const catCode = parseCategoryCode(catVal);
    if (!catCode || !SALARY_MATRIX[catCode]) {
      this.availableEchelons = [];
      this.form.get('echelon')?.disable();
      this.form.patchValue({ echelon: '', salaireBase: 0, salaireBrut: 0 }, { emitEvent: false });
      return;
    }

    const matrixInfo = SALARY_MATRIX[catCode];
    this.availableEchelons = matrixInfo.values.map((val, idx) => {
      const num = (idx + 1).toString().padStart(2, '0');
      const code = `E${num}`;
      return {
        code,
        label: `${code} — ${val.toLocaleString('fr-FR')} FCFA`,
        baseSalary: val
      };
    });

    if (this.isEditing) {
      this.form.get('echelon')?.enable();
    }

    const currentEch = this.form.get('echelon')?.value;
    if (currentEch && !this.availableEchelons.some(e => e.code === currentEch)) {
      this.form.patchValue({ echelon: 'E01' }, { emitEvent: true });
    } else {
      this.autoUpdateSalary();
    }
  }

  private autoUpdateSalary(): void {
    if (!this.form) return;

    const rawCat = (this.form.get('categoriePro')?.value || '').trim();
    const rawEch = (this.form.get('echelon')?.value || '').trim();

    const catCode = parseCategoryCode(rawCat);
    if (!catCode || !SALARY_MATRIX[catCode]) return;

    const matrixInfo = SALARY_MATRIX[catCode];
    
    const echNum = parseInt(rawEch.replace(/[^0-9]/g, ''), 10) || 1;
    const echIdx = Math.max(0, Math.min(14, echNum - 1));

    const baseSal = matrixInfo.values[echIdx] || matrixInfo.values[0];
    const groupe = matrixInfo.groupe;

    let logement = 100000;
    let transport = 50000;
    if (groupe.includes('GROUPE III') || catCode.startsWith('CL') || catCode === 'C6' || catCode === 'C7') {
      logement = 200000;
      transport = 100000;
    } else if (groupe.includes('GROUPE II') || catCode === 'C4' || catCode === 'C5') {
      logement = 150000;
      transport = 75000;
    }

    const brut = baseSal + logement + transport;

    this.form.patchValue({
      salaireBase: baseSal,
      salaireBrut: brut
    }, { emitEvent: false });
  }

  reinitialiserSelonGrille(): void {
    this.autoUpdateSalary();
  }

  annuler(): void {
    this.cancelEdit();
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.getRawValue();

    const rawCat = (v.categoriePro || '').trim();
    const catCode = parseCategoryCode(rawCat);
    const matrixInfo = catCode ? SALARY_MATRIX[catCode] : null;
    const groupe = matrixInfo ? matrixInfo.groupe : '';

    this.employeeService.update(this.empId, {
      categoriePro: catCode || v.categoriePro,
      echelon:      v.echelon,
      echelle:      groupe,
      grade:        groupe,
      salaireBase:  +v.salaireBase || +v.salaireBrut,
      salaireBrut:  +v.salaireBrut
    } as any).subscribe(() => {
      this.saving = false;
      this.isEditing = false;
      this.form.disable();
      this.router.navigate(['/grh/employes', this.empId]);
    });
  }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
