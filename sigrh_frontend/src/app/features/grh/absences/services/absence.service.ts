import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface Absence {
  id?: string;
  employe: string;
  type: string;
  date: string;
  duree: string;
  motif: string;
  statut: 'Justifiée' | 'Injustifiée' | 'En attente';
}

@Injectable({ providedIn: 'root' })
export class AbsenceService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Absence[]> {
    return this.http.get<Absence[]>(`${environment.apiUrl}/absences/all`);
  }

  getById(id: string): Observable<Absence> {
    return this.http.get<Absence>(`${environment.apiUrl}/absences/${id}`);
  }

  create(absence: Omit<Absence, 'id'>): Observable<Absence> {
    return this.http.post<Absence>(`${environment.apiUrl}/absences/create`, absence);
  }

  update(id: string, absence: Partial<Absence>): Observable<Absence> {
    return this.http.put<Absence>(`${environment.apiUrl}/absences/${id}`, absence);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/absences/${id}`);
  }
}
