import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { CongeService, Conge } from '../services/conge.service';

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
  dataSource = new MatTableDataSource<Conge>([]);
  searchQuery = '';
  conges: Conge[] = [];

  constructor(
    private router: Router, 
    private moduleNav: ModuleNavService,
    private congeService: CongeService
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.loadConges();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadConges(): void {
    this.congeService.getAll().subscribe({
      next: (list) => {
        this.conges = list;
        this.dataSource.data = list;
      },
      error: (err) => {
        console.error('Error loading conges:', err);
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  nouveauConge(): void {
    this.router.navigate(['/grh/conges/nouveau']);
  }

  get totalEnAttente(): number { return this.conges.filter(c => c.statut === 'En attente').length; }
  get totalApprouves(): number { return this.conges.filter(c => c.statut === 'Approuvé').length; }
  get totalRefuses(): number   { return this.conges.filter(c => c.statut === 'Refusé').length; }

  statutStyle(statut: string): { background: string; color: string } {
    const map: Record<string, { background: string; color: string }> = {
      'En attente': { background: '#fff3e0', color: '#e65100' },
      'Approuvé':   { background: '#e8f5e9', color: '#2e7d32' },
      'Refusé':     { background: '#ffebee', color: '#c62828' },
    };
    return map[statut] ?? { background: '#f1f3f4', color: '#5f6368' };
  }
}
