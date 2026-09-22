import { Component, OnInit } from '@angular/core';
import { SalaryParametrageService, SalaryCategoryDto } from '../../services/salary-parametrage.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface SalaryCategoryModel {
  id: number;
  code: string;
  name: string;
  type: 'GAIN' | 'RETENUE' | 'PATRONALE';
}

@Component({
  selector: 'app-categories-elements',
  templateUrl: './categories-elements.component.html',
  styleUrls: ['./categories-elements.component.scss'],
  standalone: false
})
export class CategoriesElementsComponent implements OnInit {
  categoriesList: SalaryCategoryModel[] = [];
  filteredList: SalaryCategoryModel[] = [];
  searchQuery: string = '';

  showDialog: boolean = false;
  editingCategory: SalaryCategoryModel | null = null;
  formModel: SalaryCategoryModel = this.getEmptyForm();
  isSaving: boolean = false;

  constructor(private parametrageService: SalaryParametrageService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.parametrageService.getAllCategories().pipe(
      catchError(err => {
        console.error('Erreur chargement catégories:', err);
        return of([]);
      })
    ).subscribe(data => {
      if (data && data.length > 0) {
        this.categoriesList = data.map(item => ({
          id: Number(item.id),
          code: item.code || '',
          name: item.name || '',
          type: (item.type || 'GAIN') as 'GAIN' | 'RETENUE' | 'PATRONALE'
        }));
      } else {
        this.categoriesList = [];
      }
      this.applyFilter();
    });
  }

  applyFilter(): void {
    let list = [...this.categoriesList];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.code && c.code.toLowerCase().includes(q))
      );
    }
    this.filteredList = list;
  }

  openAddModal(): void {
    this.editingCategory = null;
    this.formModel = this.getEmptyForm();
    this.showDialog = true;
  }

  openEditModal(cat: SalaryCategoryModel): void {
    this.editingCategory = cat;
    this.formModel = { ...cat };
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
    this.editingCategory = null;
    this.isSaving = false;
  }

  saveCategory(): void {
    if (!this.formModel.code || !this.formModel.name) return;

    this.isSaving = true;
    const payload: SalaryCategoryDto = {
      code: this.formModel.code.trim().toUpperCase(),
      name: this.formModel.name.trim(),
      type: this.formModel.type || 'GAIN'
    };

    if (this.editingCategory && this.editingCategory.id) {
      this.parametrageService.updateCategory(this.editingCategory.id, payload).pipe(
        catchError(err => {
          console.error('Erreur mise à jour catégorie:', err);
          return of(null);
        })
      ).subscribe(() => {
        this.isSaving = false;
        this.closeModal();
        this.loadCategories();
      });
    } else {
      this.parametrageService.createCategory(payload).pipe(
        catchError(err => {
          console.error('Erreur création catégorie:', err);
          return of(null);
        })
      ).subscribe(() => {
        this.isSaving = false;
        this.closeModal();
        this.loadCategories();
      });
    }
  }

  deleteCategory(cat: SalaryCategoryModel): void {
    if (confirm(`Confirmez-vous la suppression de la catégorie "${cat.name}" (${cat.code}) ?`)) {
      this.parametrageService.deleteCategory(cat.id).pipe(
        catchError(err => {
          console.error('Erreur suppression catégorie:', err);
          return of(null);
        })
      ).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  reinitialiserDonneesTest(): void {
    this.loadCategories();
  }

  private getEmptyForm(): SalaryCategoryModel {
    return {
      id: 0,
      code: '',
      name: '',
      type: 'GAIN'
    };
  }
}
