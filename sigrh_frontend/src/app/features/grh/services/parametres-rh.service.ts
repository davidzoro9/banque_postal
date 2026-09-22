import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ParamItem {
  id?: string;
  type: string;
  code: string;
  libelle: string;
  description?: string;
  actif: boolean;
}

@Injectable({ providedIn: 'root' })
export class ParametresRhService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<ParamItem[]> {
    return this.http.get<ParamItem[]>(`${environment.apiUrl}/parametres-rh/all`);
  }

  getByType(type: string): Observable<ParamItem[]> {
    return this.http.get<ParamItem[]>(`${environment.apiUrl}/parametres-rh/type/${type}`);
  }

  create(item: Omit<ParamItem, 'id'>): Observable<ParamItem> {
    return this.http.post<ParamItem>(`${environment.apiUrl}/parametres-rh/create`, item);
  }

  update(id: string | number, item: Partial<ParamItem>): Observable<ParamItem> {
    return this.http.put<ParamItem>(`${environment.apiUrl}/parametres-rh/${id}`, item);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/parametres-rh/${id}`);
  }
}
