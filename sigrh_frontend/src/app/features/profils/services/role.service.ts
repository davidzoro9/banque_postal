import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RoleItem {
  id?: number | string;
  code: string;
  libelle: string;
  description?: string;
  nbUsers?: number;
  badgeColor?: string;
  actif?: boolean;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RoleItem[]> {
    return this.http.get<RoleItem[]>(this.apiUrl);
  }

  getById(id: number): Observable<RoleItem> {
    return this.http.get<RoleItem>(`${this.apiUrl}/${id}`);
  }

  create(role: Partial<RoleItem>): Observable<RoleItem> {
    return this.http.post<RoleItem>(this.apiUrl, role);
  }

  update(id: number | string, role: Partial<RoleItem>): Observable<RoleItem> {
    return this.http.put<RoleItem>(`${this.apiUrl}/${id}`, role);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
