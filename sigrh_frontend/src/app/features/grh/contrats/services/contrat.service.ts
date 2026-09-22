import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface Contrat {
  id?: string;
  employe: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  service: string;
  statut: 'Actif' | 'Expiré' | 'À renouveler';
}

@Injectable({ providedIn: 'root' })
export class ContratService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${environment.apiUrl}/contrats/all`);
  }

  getById(id: string): Observable<Contrat> {
    return this.http.get<Contrat>(`${environment.apiUrl}/contrats/${id}`);
  }

  create(contrat: Omit<Contrat, 'id'>): Observable<Contrat> {
    return this.http.post<Contrat>(`${environment.apiUrl}/contrats/create`, contrat);
  }

  update(id: string, contrat: Partial<Contrat>): Observable<Contrat> {
    return this.http.put<Contrat>(`${environment.apiUrl}/contrats/${id}`, contrat);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/contrats/${id}`);
  }
}
