import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeService } from '../../services/employee.service';
import { DbRefService, RefItem } from '../../../../donnees-base/services/db-ref.service';
import { Employee, StatutEmploye } from '../../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

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

@Component({
  selector: 'app-infos-pro',
  templateUrl: './infos-pro.component.html',
  styleUrls: ['./infos-pro.component.scss'],
  standalone: false
})
export class InfosProComponent implements OnInit {
  employee?: Employee;
  form!: FormGroup;
  saving = false;
  isEditing = false;
  isCreationMode = false;
  empId = '';
  
  services$!: Observable<RefItem[]>;
  agences$!: Observable<RefItem[]>;
  fonctions$!: Observable<RefItem[]>;
  fonctionsList: RefItem[] = [];
  directionsAndDepartements$!: Observable<RefItem[]>;
  parametragesRetraite: any[] = [];
  readonly String = String; // pour usage dans le template

  readonly statuts: StatutEmploye[] = ['Actif', 'Inactif', 'Suspendu', "Période d'essai", 'Congé maladie', 'Détaché'];

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

  readonly availableEchelons = Array.from({ length: 15 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    const code = `E${num}`;
    return { code, label: code };
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id')!;
    this.isCreationMode = this.route.snapshot.queryParamMap.get('mode') === 'creation';
    this.isEditing = this.isCreationMode;

    this.services$ = this.dbRefService.getItems('service');
    this.agences$ = this.dbRefService.getItems('agence');
    this.fonctions$ = this.dbRefService.getItems('fonction');

    this.fonctions$.subscribe(list => {
      if (list && list.length > 0) {
        this.fonctionsList = list;
      }
    });

    this.directionsAndDepartements$ = combineLatest([
      this.dbRefService.getItems('direction'),
      this.dbRefService.getItems('departement')
    ]).pipe(
      map(([dirs, deps]) => [...dirs, ...deps])
    );

    // Charger les paramétrages retraite depuis le backend ou le localStorage
    this.http.get<any[]>(`${environment.apiUrl}/parametrage-retraite`).subscribe({
      next: (data) => { this.parametragesRetraite = data.filter(p => p.actif !== false); },
      error: () => {
        // Fallback localStorage
        try {
          const stored = localStorage.getItem('ref_param-retraite');
          if (stored) this.parametragesRetraite = JSON.parse(stored);
        } catch {}
      }
    });

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
      if (!this.isCreationMode) {
        this.form.disable();
      }

      this.form.get('categoriePro')?.valueChanges.subscribe(() => this.updateComputedGrade());
      this.form.get('echelon')?.valueChanges.subscribe(() => this.updateComputedGrade());
    });
  }

  private parseCat(cat: string): string {
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
    return upper;
  }

  private updateComputedGrade(): void {
    if (!this.form) return;
    const cat = this.parseCat(this.form.get('categoriePro')?.value || '');
    let ech = (this.form.get('echelon')?.value || '').trim();
    if (ech) {
      const num = parseInt(ech.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num)) ech = num < 10 ? `E0${num}` : `E${num}`;
    }
    const computedGrade = (cat && ech) ? `${cat}${ech}` : (cat || ech || '');
    this.form.get('grade')?.setValue(computedGrade, { emitEvent: false });
  }

  enableEdit(): void {
    this.isEditing = true;
    this.form.enable();
    this.form.get('grade')?.disable();
  }

  cancelEdit(): void {
    if (this.employee) {
      this.patch(this.employee);
    }
    this.form.disable();
    this.isEditing = false;
  }

  get showBancaire(): boolean {
    return this.form.get('modePaiement')?.value === 'Virement bancaire';
  }

  private buildForm(): void {
    this.form = this.fb.group({
      poste:                [''],
      fonction:             ['Agent simple'],
      customFonction:       [''],
      service:              [''],
      direction:            [''],
      departement:          [''],
      agence:               [''],
      categoriePro:         ['CL5'],
      echelon:              ['E01'],
      grade:                ['CL5E01'],
      statut:               ['Actif'],
      dateEmbauche:         [''],
      modePaiement:         ['Virement bancaire'],
      intituleCompte:       [''],
      banque:               [''],
      iban:                 [''],
      groupeRetraiteId:     [null]
    });

    // Quand le groupe retraite change → mettre à jour ageRetraite automatiquement
    this.form.get('groupeRetraiteId')?.valueChanges.subscribe(id => {
      if (!id) return;
      const groupe = this.parametragesRetraite.find(p => String(p.id) === String(id));
      if (groupe) {
        const age = groupe.ageRetraite || groupe.taux || groupe.montant || 60;
        this.employeeService.update(this.empId, { ageRetraite: Number(age), groupeRetraiteId: id }).subscribe();
      }
    });
  }

  private patch(e: Employee): void {
    let cat = this.parseCat(e.categoriePro);
    if (!cat && e.grade) {
      const g = e.grade.trim();
      const eIdx = g.indexOf('E');
      if (eIdx > 0) cat = this.parseCat(g.substring(0, eIdx));
    }
    if (!cat) cat = 'CL5';

    let ech = e.echelon || '';
    if (!ech && e.grade) {
      const g = e.grade.trim();
      const eIdx = g.indexOf('E');
      if (eIdx > 0) ech = g.substring(eIdx);
    }
    if (ech) {
      const num = parseInt(ech.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num)) ech = num < 10 ? `E0${num}` : `E${num}`;
    } else {
      ech = 'E01';
    }
    const computedGrade = `${cat}${ech}`;

    let rawFct: any = e.fonction;
    if (typeof rawFct === 'object' && rawFct !== null) {
      rawFct = rawFct.name || rawFct.libelle || rawFct.code || 'Agent simple';
    }
    let fctValue = String(rawFct || 'Agent simple').trim();
    const upperFct = fctValue.toUpperCase();

    if (!fctValue || fctValue === 'Agent' || upperFct.includes('AGENT SIMPLE')) {
      fctValue = 'Agent simple';
    }

    this.form.patchValue({
      poste:            e.poste || '',
      fonction:         fctValue,
      service:          e.service || '',
      direction:        e.direction || e.departement || '',
      departement:      e.departement || e.direction || '',
      agence:           e.agence || '',
      categoriePro:     cat,
      echelon:          ech,
      grade:            computedGrade,
      statut:           e.statut || 'Actif',
      dateEmbauche:     e.dateEmbauche || '',
      modePaiement:     e.modePaiement || 'Virement bancaire',
      intituleCompte:   e.intituleCompte || (e.nom && e.prenom ? `${e.prenom} ${e.nom}` : ''),
      banque:           e.banque || '',
      iban:             e.iban || '',
      groupeRetraiteId: e.groupeRetraiteId || null
    });
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(next?: string): void {
    if (this.form.invalid) return;
    this.saving = true;
    const v = this.form.getRawValue();

    const catCode = this.parseCat(v.categoriePro) || 'CL5';
    let echCode = (v.echelon || 'E01').trim();
    const echNum = parseInt(echCode.replace(/[^0-9]/g, ''), 10) || 1;
    echCode = echNum < 10 ? `E0${echNum}` : `E${echNum}`;
    const computedGrade = `${catCode}${echCode}`;

    let resolvedFonction = v.fonction;

    // Résoudre l'âge de retraite depuis le groupe sélectionné
    let ageRetraiteResolu: number | undefined;
    if (v.groupeRetraiteId) {
      const grp = this.parametragesRetraite.find(p => String(p.id) === String(v.groupeRetraiteId));
      if (grp) ageRetraiteResolu = Number(grp.ageRetraite || grp.taux || grp.montant || 60);
    }

    const updatePayload: Partial<Employee> = {
      poste:            v.poste,
      fonction:         resolvedFonction,
      service:          v.service,
      direction:        v.direction || v.departement,
      departement:      v.departement || v.direction,
      agence:           v.agence,
      categoriePro:     catCode,
      echelon:          echCode,
      grade:            computedGrade,
      statut:           v.statut,
      dateEmbauche:     v.dateEmbauche,
      modePaiement:     v.modePaiement,
      intituleCompte:   v.intituleCompte,
      banque:           v.banque,
      iban:             v.iban,
      groupeRetraiteId: v.groupeRetraiteId,
      ...(ageRetraiteResolu !== undefined && { ageRetraite: ageRetraiteResolu })
    };

    if (SALARY_MATRIX[catCode]) {
      const matrixInfo = SALARY_MATRIX[catCode];
      const echIdx = Math.max(0, Math.min(14, echNum - 1));
      const baseSal = matrixInfo.values[echIdx] || matrixInfo.values[0];
      updatePayload.salaireBase = baseSal;
    }

    this.employeeService.update(this.empId, updatePayload).subscribe(() => {
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

  goToContrats(): void { this.router.navigate(['/grh/contrats']); }

  goBack(): void { this.router.navigate(['/grh/employes', this.empId]); }
}
