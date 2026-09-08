import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

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

  readonly sexes = [
    { value: 'M', label: 'Masculin' },
    { value: 'F', label: 'Féminin' }
  ];

  readonly villes = [
    'Ouagadougou',
    'Bobo-Dioulasso',
    'Koudougou',
    'Banfora',
    'Manga',
    'Fada N\'Gourma',
    'Ouahigouya',
    'Dédougou',
    'Kaya',
    'Tenkodogo',
    'Autre...'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.empId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.empId;

    this.form = this.fb.group({
      nom:                    ['', Validators.required],
      prenom:                 ['', Validators.required],
      nomJeuneFille:          [''],
      sexe:                   ['M'],
      dateNaissance:          [''],
      lieuNaissance:          ['Ouagadougou'],
      nationalite:            ['Burkinabè'],
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
      ville:                  ['Ouagadougou'],
      codePostal:             [''],
      pays:                   ['Burkina Faso'],
      telephone:              [''],
      // Contact d'urgence
      contactUrgenceNom:      [''],
      contactUrgenceTelephone:[''],
      contactUrgenceLien:     ['']
    });

    this.form.get('dateNaissance')?.valueChanges.subscribe(() => this.calculateRetraite());
    this.form.get('ageRetraite')?.valueChanges.subscribe(() => this.calculateRetraite());

    if (this.isEdit && this.empId) {
      this.employeeService.getById(this.empId).subscribe(emp => {
        if (emp) {
          this.form.patchValue({
            nom:                    emp.nom,
            prenom:                 emp.prenom,
            nomJeuneFille:          emp.nomJeuneFille || '',
            sexe:                   emp.sexe || 'M',
            dateNaissance:          emp.dateNaissance || '',
            lieuNaissance:          emp.lieuNaissance || '',
            nationalite:            emp.nationalite || 'Burkinabè',
            numeroCNI:              emp.numeroCNI || '',
            dernierDiplome:         emp.dernierDiplome || '',
            diplomeRecrutement:     emp.diplomeRecrutement || '',
            brancheEtude:           emp.brancheEtude || '',
            ecoleUniversite:        emp.ecoleUniversite || '',
            ageRetraite:            emp.ageRetraite || 60,
            dateRetraite:           emp.dateRetraite || '',
            adresse:                emp.adresse || '',
            ville:                  emp.ville || 'Ouagadougou',
            codePostal:             emp.codePostal || '',
            pays:                   emp.pays || 'Burkina Faso',
            telephone:              emp.telephone || '',
            contactUrgenceNom:      emp.contactUrgenceNom || '',
            contactUrgenceTelephone:emp.contactUrgenceTelephone || '',
            contactUrgenceLien:     emp.contactUrgenceLien || ''
          });
          this.calculateRetraite();
        }
      });
    }
  }

  private calculateRetraite(): void {
    const dob = this.form.get('dateNaissance')?.value;
    const age = Number(this.form.get('ageRetraite')?.value) || 60;
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

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.value;

    let dob = val.dateNaissance;
    if (dob instanceof Date) {
      const year = dob.getFullYear();
      const month = String(dob.getMonth() + 1).padStart(2, '0');
      const day = String(dob.getDate()).padStart(2, '0');
      dob = `${year}-${month}-${day}`;
    }

    if (this.isEdit && this.empId) {
      this.employeeService.update(this.empId, {
        nom:                    val.nom,
        prenom:                 val.prenom,
        nomJeuneFille:          val.nomJeuneFille,
        sexe:                   val.sexe,
        dateNaissance:          dob,
        lieuNaissance:          val.lieuNaissance,
        nationalite:            val.nationalite,
        numeroCNI:              val.numeroCNI,
        dernierDiplome:         val.dernierDiplome,
        diplomeRecrutement:     val.diplomeRecrutement,
        brancheEtude:           val.brancheEtude,
        ecoleUniversite:        val.ecoleUniversite,
        ageRetraite:            val.ageRetraite,
        dateRetraite:           val.dateRetraite,
        adresse:                val.adresse,
        ville:                  val.ville,
        codePostal:             val.codePostal,
        pays:                   val.pays,
        telephone:              val.telephone,
        contactUrgenceNom:      val.contactUrgenceNom,
        contactUrgenceTelephone:val.contactUrgenceTelephone,
        contactUrgenceLien:     val.contactUrgenceLien
      }).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/grh/employes', this.empId, 'infos-pro']);
        },
        error: () => this.saving = false
      });
    } else {
      const newMatricule = this.employeeService.generateMatricule();
      const emailGenerated = `${(val.prenom || '').toLowerCase().trim().replace(/\s+/g, '.')}.${(val.nom || '').toLowerCase().trim().replace(/\s+/g, '.')}@bpbf.bf`;
      
      const data: Partial<Employee> = {
        matricule: newMatricule,
        nom: val.nom,
        prenom: val.prenom,
        nomJeuneFille: val.nomJeuneFille,
        sexe: val.sexe || 'M',
        dateNaissance: dob || '',
        lieuNaissance: val.lieuNaissance || '',
        nationalite: val.nationalite || 'Burkinabè',
        numeroCNI: val.numeroCNI || '',
        dernierDiplome: val.dernierDiplome || '',
        diplomeRecrutement: val.diplomeRecrutement || '',
        brancheEtude: val.brancheEtude || '',
        ecoleUniversite: val.ecoleUniversite || '',
        ageRetraite: val.ageRetraite || 60,
        dateRetraite: val.dateRetraite || '',
        adresse: val.adresse || '',
        ville: val.ville || 'Ouagadougou',
        codePostal: val.codePostal || '',
        pays: val.pays || 'Burkina Faso',
        telephone: val.telephone || '',
        contactUrgenceNom: val.contactUrgenceNom || '',
        contactUrgenceTelephone: val.contactUrgenceTelephone || '',
        contactUrgenceLien: val.contactUrgenceLien || '',
        email: emailGenerated,
        emailPro: emailGenerated,
        poste: '',
        service: '',
        direction: '',
        statut: 'Actif',
        typeContrat: 'CDI',
        categoriePro: 'C1',
        grade: 'GROUPE I',
        echelon: 'E1',
        salaireBase: 0,
        primeLogement: 0,
        primeTransport: 0,
        autresIndemnites: [],
        documents: [],
        evaluations: [],
        enfants: [],
        personnesCharge: [],
        dateEmbauche: new Date().toISOString().split('T')[0]
      };

      this.employeeService.create(data as any).subscribe({
        next: (created) => {
          this.saving = false;
          // Redirection vers le formulaire Informations professionnelles en mode création
          this.router.navigate(['/grh/employes', created.id, 'infos-pro'], { queryParams: { mode: 'creation' } });
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
