import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { AbsenceService, Absence } from '../services/absence.service';

@Component({
  selector: 'app-absences-list',
  templateUrl: './absences-list.component.html',
  styleUrls: ['./absences-list.component.scss'],
  standalone: false
})
export class AbsencesListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('viewDialogTpl') viewDialogTpl!: TemplateRef<any>;

  module = APP_MODULES.find(m => m.id === 'grh')!;
  displayedColumns = ['employe', 'type', 'date', 'duree', 'motif', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Absence>([]);
  searchQuery = '';
  absences: Absence[] = [];
  selectedAbsence?: Absence;

  constructor(
    private router: Router, 
    private moduleNav: ModuleNavService,
    private absenceService: AbsenceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.loadAbsences();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAbsences(): void {
    this.absenceService.getAll().subscribe({
      next: (list) => {
        this.absences = list;
        this.dataSource.data = list;
      },
      error: (err) => {
        console.error('Error loading absences:', err);
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  nouvelleAbsence(): void {
    this.router.navigate(['/grh/absences/nouveau']);
  }

  voirAbsence(absence: Absence): void {
    this.selectedAbsence = absence;
    this.dialog.open(this.viewDialogTpl, { width: '540px' });
  }

  get totalJustifiees(): number  { return this.absences.filter(a => a.statut === 'Justifiée').length; }
  get totalInjustifiees(): number { return this.absences.filter(a => a.statut === 'Injustifiée').length; }
  get totalEnAttente(): number   { return this.absences.filter(a => a.statut === 'En attente').length; }

  statutStyle(statut: string): { background: string; color: string } {
    const map: Record<string, { background: string; color: string }> = {
      'Justifiée':   { background: '#e8f5e9', color: '#2e7d32' },
      'Injustifiée': { background: '#ffebee', color: '#c62828' },
      'En attente':  { background: '#fff3e0', color: '#e65100' },
    };
    return map[statut] ?? { background: '#f1f3f4', color: '#5f6368' };
  }
}
