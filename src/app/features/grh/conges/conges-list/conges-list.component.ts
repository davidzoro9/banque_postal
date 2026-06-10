import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';

interface Conge {
  id: string;
  employe: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  nbJours: number;
  statut: 'En attente' | 'Approuvé' | 'Refusé';
}

const MOCK_CONGES: Conge[] = [
  { id: '1', employe: 'Sophie Martin',   type: 'Congé annuel',   dateDebut: '2026-06-15', dateFin: '2026-06-28', nbJours: 14, statut: 'En attente' },
  { id: '2', employe: 'Thomas Bernard',  type: 'Congé maladie',  dateDebut: '2026-06-10', dateFin: '2026-06-12', nbJours: 3,  statut: 'Approuvé' },
  { id: '3', employe: 'Claire Dubois',   type: 'Congé annuel',   dateDebut: '2026-07-01', dateFin: '2026-07-20', nbJours: 20, statut: 'En attente' },
  { id: '4', employe: 'Marc Leroy',      type: 'Congé paternité',dateDebut: '2026-06-20', dateFin: '2026-06-30', nbJours: 11, statut: 'Approuvé' },
  { id: '5', employe: 'Alice Traoré',    type: 'Congé sans solde',dateDebut: '2026-08-01', dateFin: '2026-08-15', nbJours: 15, statut: 'Refusé' },
];

@Component({
  selector: 'app-conges-list',
  templateUrl: './conges-list.component.html',
  styleUrls: ['./conges-list.component.scss'],
  standalone: false
})
export class CongesListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  module = APP_MODULES.find(m => m.id === 'grh')!;
  displayedColumns = ['employe', 'type', 'dateDebut', 'dateFin', 'nbJours', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Conge>(MOCK_CONGES);
  searchQuery = '';

  constructor(private router: Router, private moduleNav: ModuleNavService) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  nouveauConge(): void { this.router.navigate(['/grh/conges/nouveau']); }

  get totalEnAttente(): number { return MOCK_CONGES.filter(c => c.statut === 'En attente').length; }
  get totalApprouves(): number { return MOCK_CONGES.filter(c => c.statut === 'Approuvé').length; }
  get totalRefuses(): number   { return MOCK_CONGES.filter(c => c.statut === 'Refusé').length; }

  statutStyle(statut: string): { background: string; color: string } {
    const map: Record<string, { background: string; color: string }> = {
      'En attente': { background: '#fff3e0', color: '#e65100' },
      'Approuvé':   { background: '#e8f5e9', color: '#2e7d32' },
      'Refusé':     { background: '#ffebee', color: '#c62828' },
    };
    return map[statut] ?? { background: '#f1f3f4', color: '#5f6368' };
  }
}
