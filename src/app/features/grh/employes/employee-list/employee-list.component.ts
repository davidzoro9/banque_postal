import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Employee, StatutEmploye, STATUT_COLORS } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: false
})
export class EmployeeListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  module = APP_MODULES.find(m => m.id === 'grh')!;

  displayedColumns = ['avatar', 'matricule', 'nom', 'poste', 'service', 'statut', 'dateEmbauche', 'dateRetraite', 'actions'];
  dataSource = new MatTableDataSource<Employee>();

  searchQuery = '';
  selectedStatut: StatutEmploye | '' = '';
  selectedService = '';

  readonly statuts: (StatutEmploye | '')[] = ['', 'Actif', 'Inactif', 'Suspendu', "Période d'essai", 'Congé maladie', 'Détaché'];
  services: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private moduleNav: ModuleNavService,
    private router: Router
  ) {}

  get totalEmployes(): number {
    return this.dataSource.data.length;
  }

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.services = this.employeeService.getServices();
    this.employeeService.employees$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.applyFilters();
    });
    this.applyFilters();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    const results = this.employeeService.search(this.searchQuery, this.selectedStatut, this.selectedService);
    this.dataSource.data = results;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatut = '';
    this.selectedService = '';
    this.applyFilters();
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/grh/employes', id]);
  }

  editEmployee(id: string): void {
    this.router.navigate(['/grh/employes', id]);
  }

  deleteEmployee(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Supprimer cet employé ?')) {
      this.employeeService.delete(id).subscribe();
    }
  }

  newEmployee(): void {
    this.router.navigate(['/grh/employes/nouveau']);
  }

  getInitials(emp: Employee): string {
    const p = emp.prenom?.charAt(0) || '';
    const n = emp.nom?.charAt(0) || '';
    return `${p}${n}`.toUpperCase() || '??';
  }

  getAvatarColor(emp: Employee): string {
    const colors = ['#0060B3', '#0060B3', '#1B3A6B', '#FFC700', '#004080', '#004080', '#1B4B9A', '#CC8800'];
    if (!emp.nom || !emp.prenom) return '#0060B3';
    const idx = (emp.nom.charCodeAt(0) + emp.prenom.charCodeAt(0)) % colors.length;
    return colors[idx];
  }

  getDateRetraite(emp: Employee): { dateStr: string; yearsLeft: number | null } {
    let birthDate: Date | null = null;
    if (emp.dateNaissance) {
      birthDate = new Date(emp.dateNaissance);
    }

    const fonction = (emp.fonction || emp.poste || '').toLowerCase();
    const cat = (emp.categoriePro || '').toUpperCase();

    // 1. Détermination du Groupe de l'employé via le Paramétrage Groupe (catégories rattachées)
    let groupe = '';
    try {
      const storedParamGroupes = localStorage.getItem('ref_param-groupe') || localStorage.getItem('ref_grade');
      if (storedParamGroupes) {
        const pgList = JSON.parse(storedParamGroupes);
        const match = pgList.find((g: any) => Array.isArray(g.categories) && g.categories.includes(cat));
        if (match) {
          groupe = match.grade || match.libelle || match.code || '';
        }
      }
    } catch (e) {}

    if (!groupe) {
      if (cat.startsWith('CL5') || cat.startsWith('CL6') || cat.startsWith('CL7') || cat.startsWith('CL8')) {
        groupe = 'GROUPE III';
      } else if (cat.startsWith('CL1') || cat.startsWith('CL2') || cat.startsWith('CL3') || cat.startsWith('CL4')) {
        groupe = 'GROUPE II';
      } else if (cat.startsWith('C')) {
        groupe = 'GROUPE I';
      } else {
        groupe = 'GROUPE I';
      }
    }

    // 2. Récupération de l'âge de retraite paramétré dans les données de base pour ce Groupe
    let ageRetraite = 60;
    try {
      const storedParams = localStorage.getItem('ref_param-retraite');
      if (storedParams) {
        const list = JSON.parse(storedParams);
        const param = list.find((p: any) => (p.libelle && p.libelle.includes(groupe)) || (p.grade && p.grade.includes(groupe)) || (p.code && p.code.includes(groupe)));
        if (param && (param.taux || param.montant)) {
          ageRetraite = Number(param.taux || param.montant);
        }
      } else {
        ageRetraite = groupe === 'GROUPE III' ? 65 : 60;
      }
    } catch (e) {
      ageRetraite = groupe === 'GROUPE III' ? 65 : 60;
    }

    if (!birthDate || isNaN(birthDate.getTime())) {
      if (emp.dateEmbauche) {
        const emb = new Date(emp.dateEmbauche);
        if (!isNaN(emb.getTime())) {
          const retYear = emb.getFullYear() + 35;
          const retDate = new Date(retYear, emb.getMonth(), emb.getDate());
          const now = new Date();
          const yearsLeft = retYear - now.getFullYear();
          return {
            dateStr: retDate.toLocaleDateString('fr-FR'),
            yearsLeft
          };
        }
      }
      return { dateStr: '—', yearsLeft: null };
    }

    const retYear = birthDate.getFullYear() + ageRetraite;
    const retDate = new Date(retYear, birthDate.getMonth(), birthDate.getDate());
    const now = new Date();
    const yearsLeft = Math.ceil((retDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

    return {
      dateStr: retDate.toLocaleDateString('fr-FR'),
      yearsLeft: Math.max(0, yearsLeft)
    };
  }

  getStatutStyle(statut: StatutEmploye) {
    return STATUT_COLORS[statut] || { color: '#0060B3', background: '#e0f2fe' };
  }
}
