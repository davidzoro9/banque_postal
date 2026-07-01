import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../core/models/app-module.model';
import { DbRefService, RefItem } from '../services/db-ref.service';

@Component({
  selector: 'app-db-ref-list',
  templateUrl: './db-ref-list.component.html',
  styleUrls: ['./db-ref-list.component.scss'],
  standalone: false
})
export class DbRefListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogTpl') dialogTpl!: TemplateRef<any>;

  module = APP_MODULES.find(m => m.id === 'donnees-base')!;
  title  = '';
  icon   = 'list';
  type   = '';

  displayedColumns = ['code', 'libelle', 'description', 'actif', 'actions'];
  dataSource = new MatTableDataSource<RefItem>([]);
  searchQuery = '';

  formGroup!: FormGroup;
  dialogRef: any;
  isEditing = false;
  editingItem: RefItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private moduleNav: ModuleNavService,
    private dbRefService: DbRefService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      code:        ['', [Validators.required, Validators.maxLength(20)]],
      libelle:     ['', [Validators.required, Validators.maxLength(150)]],
      description: [''],
      actif:       [true],
      montant:     [0, [Validators.min(0)]]  // champ pour grille salariale
    });
  }

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.route.data.subscribe(data => {
      this.title  = data['title']  ?? '';
      this.icon   = data['icon']   ?? 'list';
      this.type   = data['type']   ?? '';
      // Afficher la colonne Montant uniquement pour la grille salariale
      if (this.type === 'grille-salariale') {
        this.displayedColumns = ['code', 'libelle', 'description', 'actif', 'montant', 'actions'];
      } else {
        this.displayedColumns = ['code', 'libelle', 'description', 'actif', 'actions'];
      }
      this.searchQuery = '';
      this.loadData();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(): void {
    this.dbRefService.getItems(this.type).subscribe({
      next: (items) => {
        this.dataSource.data = items;
      },
      error: (err) => {
        console.error('Error loading data for', this.type, err);
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  openAddDialog(): void {
    this.isEditing = false;
    this.editingItem = null;
    this.formGroup.reset({ code: '', libelle: '', description: '', actif: true, montant: 0 });
    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '500px' });
  }

  openEditDialog(item: RefItem): void {
    this.isEditing = true;
    this.editingItem = item;
    this.formGroup.reset({
      code:        item.code,
      libelle:     item.libelle,
      description: item.description,
      actif:       item.actif,
      montant:     item.montant ?? 0
    });
    this.formGroup.get('code')?.enable();
    this.dialogRef = this.dialog.open(this.dialogTpl, { width: '500px' });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;

    const rawValue = this.formGroup.getRawValue();
    const item: RefItem = {
      id:          this.editingItem?.id,
      code:        rawValue.code,
      libelle:     rawValue.libelle,
      description: rawValue.description || '',
      actif:       rawValue.actif ?? true,
      montant:     rawValue.montant ?? 0
    };

    if (this.isEditing && this.editingItem) {
      this.dbRefService.updateItem(this.type, this.editingItem.code, item).subscribe({
        next: (items) => {
          this.dataSource.data = items;
          this.dialogRef.close();
        },
        error: (err) => {
          alert(err.message || 'Une erreur est survenue lors de la modification.');
        }
      });
    } else {
      this.dbRefService.addItem(this.type, item).subscribe({
        next: (items) => {
          this.dataSource.data = items;
          this.dialogRef.close();
        },
        error: (err) => {
          alert(err.message || 'Une erreur est survenue lors de la création.');
        }
      });
    }
  }

  deleteItem(item: RefItem, event: Event): void {
    event.stopPropagation();
    if (confirm(`Voulez-vous vraiment supprimer l'élément "${item.libelle}" ?`)) {
      this.dbRefService.deleteItem(this.type, item.code).subscribe({
        next: (items) => {
          this.dataSource.data = items;
        },
        error: (err) => {
          alert(err.message || 'Une erreur est survenue lors de la suppression.');
        }
      });
    }
  }

  toggleStatus(item: RefItem, event: Event): void {
    event.stopPropagation();
    this.dbRefService.toggleItemStatus(this.type, item.code).subscribe({
      next: (items) => {
        this.dataSource.data = items;
      }
    });
  }

  get totalActifs(): number   { return this.dataSource.data.filter(r => r.actif).length; }
  get totalInactifs(): number { return this.dataSource.data.filter(r => !r.actif).length; }
}
