import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
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
  saved = false;
  saveError = '';
  isEditing = false;
  empId = '';
  villes: RefItem[] = [];
  fonctions$!: Observable<RefItem[]>;
  services$!: Observable<RefItem[]>;
  directions$!: Observable<RefItem[]>;
  departements$!: Observable<RefItem[]>;

  readonly sexes = [{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }];

  readonly situationsFamiliales = [
    { value: 'Célibataire', label: 'Célibataire' },
    { value: 'Marié(e)', label: 'Marié(e)' },
    { value: 'Divorcé(e)', label: 'Divorcé(e)' },
    { value: 'Veuf(ve)', label: 'Veuf(ve)' }
  ];

  paramRetraite: RefItem[] = [];

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
    this.services$ = this.dbRefService.getItems('service');
    this.directions$ = this.dbRefService.getItems('direction');
    this.departements$ = this.dbRefService.getItems('departement');
    this.dbRefService.getItems('param-retraite').subscribe(list => {
      this.paramRetraite = list || [];
      if (this.form) {
        this.calculateRetraite();
      }
    });

    this.employeeService.getById(this.empId).subscribe(e => {
      if (!e) { this.router.navigate(['/grh/employes']); return; }
      this.employee = e;
      this.buildForm();
      this.patch(e);
      this.form.disable();
    });
    this.loadVilles();
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
      nom:                    [''],
      prenom:                 [''],
      nomJeuneFille:          [''],
      sexe:                   ['M'],
      situationFamiliale:     ['Célibataire'],
      dateNaissance:          [''],
      lieuNaissance:          [''],
      nationalite:            [''],
      numeroCNI:              [''],
      // Éducation
      dernierDiplome:         [''],
      diplomeRecrutement:     [''],
      brancheEtude:           [''],
      ecoleUniversite:        [''],
      // Retraite
      ageRetraite:            [60],
      dateRetraite:           [''],
      // Coordonnées
      adresse:                [''],
      ville:                  [''],
      codePostal:             [''],
      pays:                   ['Burkina Faso'],
      telephone:              [''],
      email:                  ['', [Validators.email]],
      // Contact d'urgence
      contactUrgenceNom:      [''],
      contactUrgenceTelephone:[''],
      contactUrgenceLien:     ['']
    });

    this.form.get('dateNaissance')?.valueChanges.subscribe(() => this.calculateRetraite());
    this.form.get('ageRetraite')?.valueChanges.subscribe(() => this.calculateRetraite());
  }

  private calculateRetraite(): void {
    const dob = this.form.get('dateNaissance')?.value;
    const cat = (this.employee?.categoriePro || '').toUpperCase();
    const fonction = (this.employee?.fonction || this.employee?.poste || '').toLowerCase();

    let groupe = 'GROUPE I';
    if (cat.startsWith('CL5') || cat.startsWith('CL6') || cat.startsWith('CL7') || cat.startsWith('CL8') || cat.includes('CADRE SUP')) {
      groupe = 'GROUPE III';
    } else if (cat.startsWith('CL1') || cat.startsWith('CL2') || cat.startsWith('CL3') || cat.startsWith('CL4') || cat.includes('CLASSE')) {
      groupe = 'GROUPE II';
    } else if (cat.startsWith('C')) {
      groupe = 'GROUPE I';
    } else if (fonction.includes('directeur') || fonction.includes('responsable')) {
      groupe = 'GROUPE III';
    }

    let age = 60;
    const param = (this.paramRetraite || []).find((p: any) =>
      (p.libelle && p.libelle.includes(groupe)) ||
      (p.grade && p.grade.includes(groupe)) ||
      (p.code && p.code.includes(groupe))
    );
    if (param && (param.taux || param.montant)) {
      age = Number(param.taux || param.montant);
    } else {
      age = groupe === 'GROUPE III' ? 65 : 60;
    }

    this.form.get('ageRetraite')?.setValue(age, { emitEvent: false });

    if (dob) {
      const d = new Date(dob);
      if (!isNaN(d.getTime())) {
        d.setFullYear(d.getFullYear() + age);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        this.form.get('dateRetraite')?.setValue(`${yyyy}-${mm}-${dd}`, { emitEvent: false });
      }
    }
  }

  private patch(e: Employee): void {
    this.form.patchValue({
      nom: e.nom, prenom: e.prenom, nomJeuneFille: e.nomJeuneFille || '',
      sexe: e.sexe,
      situationFamiliale: e.situationFamiliale || e.situationMatrimoniale || 'Célibataire',
      dateNaissance: e.dateNaissance, lieuNaissance: e.lieuNaissance,
      nationalite: e.nationalite, numeroCNI: e.numeroCNI,
      dernierDiplome: e.dernierDiplome || '', diplomeRecrutement: e.diplomeRecrutement || '',
      brancheEtude: e.brancheEtude || '', ecoleUniversite: e.ecoleUniversite || '',
      ageRetraite: e.ageRetraite || 60, dateRetraite: e.dateRetraite || '',
      adresse: e.adresse, ville: e.ville, codePostal: e.codePostal,
      pays: e.pays || 'Burkina Faso', telephone: e.telephone, email: e.email,
      contactUrgenceNom: e.contactUrgenceNom || (e.contactsUrgence?.[0]?.nom ? `${e.contactsUrgence[0].prenom || ''} ${e.contactsUrgence[0].nom}`.trim() : ''),
      contactUrgenceTelephone: e.contactUrgenceTelephone || e.contactsUrgence?.[0]?.telephone || '',
      contactUrgenceLien: e.contactUrgenceLien || e.contactsUrgence?.[0]?.lien || ''
    });
    this.calculateRetraite();
  }

  get initials(): string {
    if (!this.employee) return '';
    return `${(this.employee.prenom?.[0] || '')}${(this.employee.nom?.[0] || '')}`.toUpperCase() || '??';
  }

  save(next?: string): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.saved = false;
    this.saveError = '';
    const v = this.form.getRawValue();
    
    let dob = v.dateNaissance;
    if (dob instanceof Date) {
      const year = dob.getFullYear();
      const month = String(dob.getMonth() + 1).padStart(2, '0');
      const day = String(dob.getDate()).padStart(2, '0');
      dob = `${year}-${month}-${day}`;
    }

    this.employeeService.update(this.empId, {
      nom: v.nom, prenom: v.prenom, nomJeuneFille: v.nomJeuneFille,
      sexe: v.sexe,
      situationFamiliale: v.situationFamiliale || 'Célibataire',
      situationMatrimoniale: v.situationFamiliale || 'Célibataire',
      dateNaissance: dob, lieuNaissance: v.lieuNaissance,
      nationalite: v.nationalite, numeroCNI: v.numeroCNI,
      dernierDiplome: v.dernierDiplome, diplomeRecrutement: v.diplomeRecrutement,
      brancheEtude: v.brancheEtude, ecoleUniversite: v.ecoleUniversite,
      ageRetraite: v.ageRetraite, dateRetraite: v.dateRetraite,
      adresse: v.adresse, ville: v.ville, codePostal: v.codePostal,
      pays: v.pays, telephone: v.telephone, email: v.email,
      contactUrgenceNom: v.contactUrgenceNom,
      contactUrgenceTelephone: v.contactUrgenceTelephone,
      contactUrgenceLien: v.contactUrgenceLien
    }).subscribe({
      next: updated => {
        this.saving = false;
        this.employee = updated;
        this.saved = true;
        if (next) {
          this.router.navigate(['/grh/employes', this.empId, next]);
        } else {
          this.form.disable();
          this.isEditing = false;
        }
      },
      error: err => {
        this.saving = false;
        this.saveError = err?.error?.message || err?.message || 'Impossible d’enregistrer les informations personnelles.';
      }
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
