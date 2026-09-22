import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TypeRetenue {
  id?: number;
  code: string;
  libelle: string;
  description?: string;
  actif?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TypeRetenueService {
  private readonly apiUrl = `${environment.apiUrl}/type-retenue`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeRetenue[]> {
    return this.http.get<TypeRetenue[]>(this.apiUrl);
  }

  getById(id: number): Observable<TypeRetenue> {
    return this.http.get<TypeRetenue>(`${this.apiUrl}/${id}`);
  }

  create(item: Partial<TypeRetenue>): Observable<TypeRetenue> {
    return this.http.post<TypeRetenue>(this.apiUrl, item);
  }

  update(id: number, item: Partial<TypeRetenue>): Observable<TypeRetenue> {
    return this.http.put<TypeRetenue>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
