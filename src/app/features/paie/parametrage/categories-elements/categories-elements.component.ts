import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface SalaryCategoryModel {
  id: number;
  code: string;
  name: string;
}

const STORAGE_KEY = 'bpbf_salary_categories_storage';

export const DEFAULT_BANK_CATEGORIES: SalaryCategoryModel[] = [];

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get<any[]>(`${environment.apiUrl}/salary-categories`).pipe(
      catchError(() => of(null))
    ).subscribe(data => {
      if (data && data.length > 0) {
        this.categoriesList = data.map(item => ({
          id: item.id,
          code: item.code || '',
          name: item.name || item.libelle || ''
        }));
        this.saveToStorage();
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
    const payload = {
      code: this.formModel.code.trim().toUpperCase(),
      name: this.formModel.name.trim()
    };

    if (this.editingCategory && this.editingCategory.id) {
      const idx = this.categoriesList.findIndex(c => c.id === this.editingCategory!.id);
      if (idx !== -1) {
        this.categoriesList[idx] = { ...this.editingCategory, ...payload };
        this.saveToStorage();
      }

      this.http.put(`${environment.apiUrl}/salary-categories/${this.editingCategory.id}`, payload).pipe(
        catchError(() => of(null))
      ).subscribe(() => {
        this.isSaving = false;
        this.applyFilter();
        this.closeModal();
      });
    } else {
      const newId = Date.now();
      const newItem: SalaryCategoryModel = { id: newId, ...payload };
      this.categoriesList.unshift(newItem);
      this.saveToStorage();

      this.http.post(`${environment.apiUrl}/salary-categories`, payload).pipe(
        catchError(() => of(null))
      ).subscribe(() => {
        this.isSaving = false;
        this.applyFilter();
        this.closeModal();
      });
    }
  }

  deleteCategory(cat: SalaryCategoryModel): void {
    if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
      this.categoriesList = this.categoriesList.filter(c => c.id !== cat.id);
      this.saveToStorage();
      this.applyFilter();

      this.http.delete(`${environment.apiUrl}/salary-categories/${cat.id}`).pipe(
        catchError(() => of(null))
      ).subscribe();
    }
  }

  reinitialiserDonneesTest(): void {
    this.loadCategories();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.categoriesList));
    } catch (e) {}
  }

  private getFromStorage(): SalaryCategoryModel[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  private getEmptyForm(): SalaryCategoryModel {
    return {
      id: 0,
      code: '',
      name: ''
    };
  }
}
