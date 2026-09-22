import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TropPercuModel {
  id?: number;
  employeeId: number;
  employeeName?: string;
  matricule?: string;
  salaryElementId?: number;
  salaryElementName?: string;
  salaryElementCode?: string;
  moisOrigine?: string; // ex: "01/2026"
  moisApplication: string; // ex: "02/2026"
  amount: number;
  motif?: string;
  statut?: 'EN_ATTENTE' | 'APPLIQUE' | 'ANNULE' | string;
  dateCreation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TropPercuService {
  private readonly apiUrl = `${environment.apiUrl}/trop-percus`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TropPercuModel[]> {
    return this.http.get<TropPercuModel[]>(this.apiUrl);
  }

  getByEmployee(employeeId: number): Observable<TropPercuModel[]> {
    return this.http.get<TropPercuModel[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  getByMois(mois: string): Observable<TropPercuModel[]> {
    return this.http.get<TropPercuModel[]>(`${this.apiUrl}/mois/${mois}`);
  }

  getById(id: number): Observable<TropPercuModel> {
    return this.http.get<TropPercuModel>(`${this.apiUrl}/${id}`);
  }

  create(item: Partial<TropPercuModel>): Observable<TropPercuModel> {
    return this.http.post<TropPercuModel>(this.apiUrl, item);
  }

  update(id: number, item: Partial<TropPercuModel>): Observable<TropPercuModel> {
    return this.http.put<TropPercuModel>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changerStatut(id: number, statut: string): Observable<TropPercuModel> {
    return this.http.patch<TropPercuModel>(`${this.apiUrl}/${id}/statut`, { statut });
  }
}