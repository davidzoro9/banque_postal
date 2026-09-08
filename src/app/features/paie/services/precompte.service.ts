import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PrecompteModel {
  id?: number;
  precompteId?: number;
  employeeId: string | number;
  employeeName?: string;
  matricule?: string;
  elementSalaryId: number;
  elementSalaryName?: string;
  salaryElementName?: string;
  elementSalaryCode?: string;
  amount: number;
  montantRestant: number;
  echeance: number;
  statut: string;
  dateEcheance?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrecompteService {
  private readonly apiUrl = `${environment.apiUrl}/precomptes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getByEmployee(employeeId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  create(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }

  update(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}