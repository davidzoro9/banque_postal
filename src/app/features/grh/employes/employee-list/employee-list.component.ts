import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class EmployeeListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  module = APP_MODULES.find(m => m.id === 'grh')!;

  displayedColumns = ['avatar', 'matricule', 'nom', 'poste', 'service', 'statut', 'dateEmbauche', 'actions'];
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
    this.router.navigate(['/grh/employes', id, 'modifier']);
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
    return `${emp.prenom.charAt(0)}${emp.nom.charAt(0)}`.toUpperCase();
  }

  getAvatarColor(emp: Employee): string {
    const colors = ['#163059', '#1565C0', '#1B3A6B', '#FFB300', '#0D47A1', '#091628', '#1B4B9A', '#CC8800'];
    const idx = (emp.nom.charCodeAt(0) + emp.prenom.charCodeAt(0)) % colors.length;
    return colors[idx];
  }

  getStatutStyle(statut: StatutEmploye): { background: string; color: string } {
    return STATUT_COLORS[statut] || { background: '#f1f3f4', color: '#5f6368' };
  }

  get totalEmployes(): number { return this.employeeService['employees'].length; }
  get totalActifs(): number { return this.employeeService['employees'].filter((e: Employee) => e.statut === 'Actif').length; }
  get totalEssai(): number { return this.employeeService['employees'].filter((e: Employee) => e.statut === "Période d'essai").length; }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
