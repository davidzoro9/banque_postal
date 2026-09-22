import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface SalaryCategoryDto {
  id?: number;
  code: string;
  name: string;
  type: 'GAIN' | 'RETENUE' | 'PATRONALE';
}

export interface SalaryElementDto {
  id?: number;
  code: string;
  name: string;
  categoryId?: number;
  salaryCategoryId?: number;
  categoryName?: string;
  categoryCode?: string;
  rate?: number;
  isCotisable?: boolean;
  isImposable?: boolean;
  methodCalcul?: string;
  formule?: string;
  formula?: string;
  ordre?: number;
  statut?: string | boolean;
  type?: 'GAIN' | 'RETENUE' | 'PATRONALE';
}

@Injectable({
  providedIn: 'root'
})
export class SalaryParametrageService {
  private readonly categoriesUrl = `${environment.apiUrl}/salary-categories`;
  private readonly elementsUrl = `${environment.apiUrl}/salary-elements`;

  constructor(private http: HttpClient) {}

  // --- CATEGORIES ---
  getAllCategories(): Observable<SalaryCategoryDto[]> {
    return this.http.get<SalaryCategoryDto[]>(this.categoriesUrl);
  }

  getCategoryById(id: number): Observable<SalaryCategoryDto> {
    return this.http.get<SalaryCategoryDto>(`${this.categoriesUrl}/${id}`);
  }

  createCategory(payload: SalaryCategoryDto): Observable<SalaryCategoryDto> {
    return this.http.post<SalaryCategoryDto>(this.categoriesUrl, payload);
  }

  updateCategory(id: number, payload: SalaryCategoryDto): Observable<SalaryCategoryDto> {
    return this.http.put<SalaryCategoryDto>(`${this.categoriesUrl}/${id}`, payload);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriesUrl}/${id}`);
  }

  // --- ELEMENTS ---
  getAllElements(): Observable<SalaryElementDto[]> {
    return this.http.get<SalaryElementDto[]>(this.elementsUrl);
  }

  getElementById(id: number): Observable<SalaryElementDto> {
    return this.http.get<SalaryElementDto>(`${this.elementsUrl}/${id}`);
  }

  createElement(payload: SalaryElementDto): Observable<SalaryElementDto> {
    return this.http.post<SalaryElementDto>(this.elementsUrl, payload);
  }

  updateElement(id: number, payload: SalaryElementDto): Observable<SalaryElementDto> {
    return this.http.put<SalaryElementDto>(`${this.elementsUrl}/${id}`, payload);
  }

  deleteElement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.elementsUrl}/${id}`);
  }
}
