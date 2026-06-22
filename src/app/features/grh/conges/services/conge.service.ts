import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface Conge {
  id?: string;
  employe: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  nbJours: number;
  statut: 'En attente' | 'Approuvé' | 'Refusé';
}

@Injectable({ providedIn: 'root' })
export class CongeService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Conge[]> {
    return this.http.get<Conge[]>(`${environment.apiUrl}/conges/all`);
  }

  getById(id: string): Observable<Conge> {
    return this.http.get<Conge>(`${environment.apiUrl}/conges/${id}`);
  }

  create(conge: Omit<Conge, 'id'>): Observable<Conge> {
    return this.http.post<Conge>(`${environment.apiUrl}/conges/create`, conge);
  }

  update(id: string, conge: Partial<Conge>): Observable<Conge> {
    return this.http.put<Conge>(`${environment.apiUrl}/conges/${id}`, conge);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/conges/${id}`);
  }
}
