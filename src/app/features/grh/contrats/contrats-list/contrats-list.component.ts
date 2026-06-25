import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { ContratService, Contrat } from '../services/contrat.service';

@Component({
  selector: 'app-contrats-list',
  templateUrl: './contrats-list.component.html',
  styleUrls: ['./contrats-list.component.scss'],
  standalone: false
})
export class ContratsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  module = APP_MODULES.find(m => m.id === 'grh')!;
  displayedColumns = ['employe', 'type', 'service', 'dateDebut', 'dateFin', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Contrat>([]);
  searchQuery = '';
  contrats: Contrat[] = [];

  constructor(
    private router: Router, 
    private moduleNav: ModuleNavService,
    private contratService: ContratService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.loadContrats();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadContrats(): void {
    this.contratService.getAll().subscribe({
      next: (list) => {
        this.contrats = list;
        this.dataSource.data = list;
      },
      error: (err) => {
        console.error('Error loading contrats:', err);
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  get totalActifs(): number       { return this.contrats.filter(c => c.statut === 'Actif').length; }
  get totalARenouveler(): number  { return this.contrats.filter(c => c.statut === 'À renouveler').length; }
  get totalExpires(): number      { return this.contrats.filter(c => c.statut === 'Expiré').length; }

  statutStyle(statut: string): { background: string; color: string } {
    const map: Record<string, { background: string; color: string }> = {
      'Actif':         { background: '#e8f5e9', color: '#2e7d32' },
      'À renouveler':  { background: '#fff3e0', color: '#e65100' },
      'Expiré':        { background: '#ffebee', color: '#c62828' },
    };
    return map[statut] ?? { background: '#f1f3f4', color: '#5f6368' };
  }
}
