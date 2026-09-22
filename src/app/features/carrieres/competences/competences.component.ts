import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrieresService, CarriereReclassement, Competence } from '../services/carrieres.service';
import { EmployeeService } from '../../grh/employes/services/employee.service';
import { DbRefService, RefItem } from '../../donnees-base/services/db-ref.service';
import { Employee } from '../../grh/employes/models/employee.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-competences',
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.scss'],
  standalone: false
})
export class CompetencesComponent implements OnInit {
  activeTab: 'reclassements' | 'referentiel' = 'reclassements';

  // Reclassements
  reclassements$!: Observable<CarriereReclassement[]>;
  employees: Employee[] = [];
  categories: RefItem[] = [];
  grades: RefItem[] = [];
  echelons: RefItem[] = [];

  showReclassementForm = false;
  savingReclassement = false;
  selectedEmpForReclass: Employee | null = null;
  messageFeedback = '';

  newReclassement = {
    employeeId: null as any,
    dateDemande: new Date().toISOString().split('T')[0],
    dateEffet: new Date().toISOString().split('T')[0],
    categorieNouvelleId: null as any,
    gradeNouveauId: null as any,
    echelonNouveauId: null as any,
    salaireBaseNouveau: null as number | null,
    referenceActe: '',
    motif: 'Diplôme ITB / Master',
    observations: ''
  };

  readonly motifsList = [
    'Diplôme ITB / Master',
    'Promotion interne',
    'Concours professionnel',
    'Titularisation',
    'Régularisation administrative',
    'Changement de filière'
  ];

  // Compétences Référentiel
  competences$!: Observable<Competence[]>;
  showCompForm = false;
  savingComp = false;
  newComp = {
    libelle: '',
    categorie: 'Technique' as Competence['categorie'],
    description: '',
    niveauxRaw: 'Débutant, Intermédiaire, Confirmé, Expert'
  };

  constructor(
    private carrieresService: CarrieresService,
    private employeeService: EmployeeService,
    private dbRefService: DbRefService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reclassements$ = this.carrieresService.reclassements$;
    this.competences$ = this.carrieresService.competences$;
    this.carrieresService.fetchReclassements().subscribe();
    this.carrieresService.fetchCompetences().subscribe();
    this.loadData();
  }

  loadData(): void {
    this.employeeService.getAll().subscribe({
      next: (list) => {
        this.employees = (list || []).filter(e => e.statut !== 'Inactif');
      }
    });

    this.dbRefService.getItems('categorie').subscribe(cats => this.categories = cats || []);
    this.dbRefService.getItems('grade').subscribe(grs => this.grades = grs || []);
    this.dbRefService.getItems('echelon').subscribe(echs => this.echelons = echs || []);
  }

  onSelectEmployee(empId: any): void {
    this.selectedEmpForReclass = this.employees.find(e => String(e.id) === String(empId)) || null;
  }

  saveReclassement(): void {
    if (!this.newReclassement.employeeId || !this.selectedEmpForReclass) return;

    this.savingReclassement = true;
    this.messageFeedback = '';

    const emp = this.selectedEmpForReclass;
    const catNouv = this.categories.find(c => String(c.id) === String(this.newReclassement.categorieNouvelleId));
    const gradeNouv = this.grades.find(g => String(g.id) === String(this.newReclassement.gradeNouveauId));
    const echNouv = this.echelons.find(e => String(e.id) === String(this.newReclassement.echelonNouveauId));

    const payload: CarriereReclassement = {
      employee: { id: Number(emp.id) },
      dateDemande: this.newReclassement.dateDemande,
      dateEffet: this.newReclassement.dateEffet,
      categorieAncienne: emp.categorieId ? { id: Number(emp.categorieId) } : undefined,
      categorieNouvelle: catNouv ? { id: Number(catNouv.id) } : undefined,
      gradeAncien: emp.gradeId ? { id: Number(emp.gradeId) } : undefined,
      gradeNouveau: gradeNouv ? { id: Number(gradeNouv.id) } : undefined,
      echelonAncien: emp.echelonId ? { id: Number(emp.echelonId) } : undefined,
      echelonNouveau: echNouv ? { id: Number(echNouv.id) } : undefined,
      salaireBaseAncien: emp.salaireBase || 0,
      salaireBaseNouveau: this.newReclassement.salaireBaseNouveau ? Number(this.newReclassement.salaireBaseNouveau) : undefined,
      referenceActe: this.newReclassement.referenceActe.trim() || 'Décision DRH',
      motif: this.newReclassement.motif,
      statut: 'VALIDE',
      observations: this.newReclassement.observations.trim()
    };

    this.carrieresService.saveReclassement(payload).subscribe({
      next: () => {
        this.savingReclassement = false;
        this.showReclassementForm = false;
        this.messageFeedback = 'Reclassement enregistré et appliqué avec succès dans PostgreSQL !';
        this.carrieresService.fetchReclassements().subscribe();
        this.resetReclassementForm();
      },
      error: () => {
        this.savingReclassement = false;
        this.messageFeedback = 'Erreur lors de l\'enregistrement du reclassement.';
      }
    });
  }

  resetReclassementForm(): void {
    this.newReclassement = {
      employeeId: null,
      dateDemande: new Date().toISOString().split('T')[0],
      dateEffet: new Date().toISOString().split('T')[0],
      categorieNouvelleId: null,
      gradeNouveauId: null,
      echelonNouveauId: null,
      salaireBaseNouveau: null,
      referenceActe: '',
      motif: 'Diplôme ITB / Master',
      observations: ''
    };
    this.selectedEmpForReclass = null;
  }

  addComp(): void {
    if (!this.newComp.libelle.trim()) return;
    this.savingComp = true;

    const levels = this.newComp.niveauxRaw.split(',').map(l => l.trim()).filter(l => !!l);
    this.carrieresService.addCompetence({
      libelle: this.newComp.libelle.trim(),
      categorie: this.newComp.categorie,
      description: this.newComp.description.trim(),
      niveaux: levels
    }).subscribe({
      next: () => {
        this.savingComp = false;
        this.showCompForm = false;
        this.newComp = {
          libelle: '',
          categorie: 'Technique',
          description: '',
          niveauxRaw: 'Débutant, Intermédiaire, Confirmé, Expert'
        };
      },
      error: () => {
        this.savingComp = false;
      }
    });
  }

  deleteComp(id: string): void {
    if (confirm('Supprimer cette compétence du référentiel ?')) {
      this.carrieresService.deleteCompetence(id).subscribe();
    }
  }

  goBack(): void {
    this.router.navigate(['/carrieres']);
  }
}
