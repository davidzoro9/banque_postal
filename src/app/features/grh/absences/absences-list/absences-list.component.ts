import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';

interface Absence {
  id: string;
  employe: string;
  type: string;
  date: string;
  duree: string;
  motif: string;
  statut: 'Justifiée' | 'Injustifiée' | 'En attente';
}

const MOCK_ABSENCES: Absence[] = [
  { id: '1', employe: 'Sophie Martin',  type: 'Maladie',            date: '2026-06-05', duree: '2 jours',  motif: 'Grippe',            statut: 'Justifiée' },
  { id: '2', employe: 'Thomas Bernard', type: 'Absence injustifiée', date: '2026-06-03', duree: '1 jour',   motif: '-',                 statut: 'Injustifiée' },
  { id: '3', employe: 'Marc Leroy',     type: 'Retard',             date: '2026-06-07', duree: '3 heures', motif: 'Embouteillages',    statut: 'Justifiée' },
  { id: '4', employe: 'Alice Traoré',   type: 'Absence justifiée',  date: '2026-06-08', duree: '1 jour',   motif: 'Démarche admin.',   statut: 'En attente' },
  { id: '5', employe: 'Claire Dubois',  type: 'Accident de travail',date: '2026-05-28', duree: '5 jours',  motif: 'Accident bureau',   statut: 'Justifiée' },
];

@Component({
  selector: 'app-absences-list',
  templateUrl: './absences-list.component.html',
  styleUrls: ['./absences-list.component.scss'],
  standalone: false
})
export class AbsencesListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  module = APP_MODULES.find(m => m.id === 'grh')!;
  displayedColumns = ['employe', 'type', 'date', 'duree', 'motif', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Absence>(MOCK_ABSENCES);
  searchQuery = '';

  constructor(private router: Router, private moduleNav: ModuleNavService) {}

  ngOnInit(): void { this.moduleNav.selectModule(this.module); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(): void { this.dataSource.filter = this.searchQuery.trim().toLowerCase(); }

  nouvelleAbsence(): void { this.router.navigate(['/grh/absences/nouveau']); }

  get totalJustifiees(): number  { return MOCK_ABSENCES.filter(a => a.statut === 'Justifiée').length; }
  get totalInjustifiees(): number { return MOCK_ABSENCES.filter(a => a.statut === 'Injustifiée').length; }
  get totalEnAttente(): number   { return MOCK_ABSENCES.filter(a => a.statut === 'En attente').length; }

  statutStyle(statut: string): { background: string; color: string } {
    const map: Record<string, { background: string; color: string }> = {
      'Justifiée':   { background: '#e8f5e9', color: '#2e7d32' },
      'Injustifiée': { background: '#ffebee', color: '#c62828' },
      'En attente':  { background: '#fff3e0', color: '#e65100' },
    };
    return map[statut] ?? { background: '#f1f3f4', color: '#5f6368' };
  }
}
