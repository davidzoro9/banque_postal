import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';

interface Contrat {
  id: string;
  employe: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  service: string;
  statut: 'Actif' | 'Expiré' | 'À renouveler';
}

const MOCK_CONTRATS: Contrat[] = [
  { id: '1', employe: 'Sophie Martin',   type: 'CDI', dateDebut: '2023-01-15', dateFin: '-',          service: 'Finance',  statut: 'Actif' },
  { id: '2', employe: 'Thomas Bernard',  type: 'CDI', dateDebut: '2022-06-01', dateFin: '-',          service: 'IT',       statut: 'Actif' },
  { id: '3', employe: 'Claire Dubois',   type: 'CDD', dateDebut: '2025-03-01', dateFin: '2026-06-30', service: 'RH',       statut: 'À renouveler' },
  { id: '4', employe: 'Marc Leroy',      type: 'CDI', dateDebut: '2021-09-01', dateFin: '-',          service: 'Ventes',   statut: 'Actif' },
  { id: '5', employe: 'Alice Traoré',    type: 'CDD', dateDebut: '2025-01-01', dateFin: '2026-07-15', service: 'Comptab.', statut: 'À renouveler' },
  { id: '6', employe: 'Didier Ouédraogo',type: 'CDD', dateDebut: '2024-01-01', dateFin: '2025-12-31', service: 'Logist.',  statut: 'Expiré' },
];

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
  dataSource = new MatTableDataSource<Contrat>(MOCK_CONTRATS);
  searchQuery = '';

  constructor(private router: Router, private moduleNav: ModuleNavService) {}

  ngOnInit(): void { this.moduleNav.selectModule(this.module); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(): void { this.dataSource.filter = this.searchQuery.trim().toLowerCase(); }

  get totalActifs(): number       { return MOCK_CONTRATS.filter(c => c.statut === 'Actif').length; }
  get totalARenouveler(): number  { return MOCK_CONTRATS.filter(c => c.statut === 'À renouveler').length; }
  get totalExpires(): number      { return MOCK_CONTRATS.filter(c => c.statut === 'Expiré').length; }

  statutStyle(statut: string): { background: string; color: string } {
    const map: Record<string, { background: string; color: string }> = {
      'Actif':         { background: '#e8f5e9', color: '#2e7d32' },
      'À renouveler':  { background: '#fff3e0', color: '#e65100' },
      'Expiré':        { background: '#ffebee', color: '#c62828' },
    };
    return map[statut] ?? { background: '#f1f3f4', color: '#5f6368' };
  }
}
