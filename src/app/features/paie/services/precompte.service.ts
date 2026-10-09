import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PrecompteVersementModel {
  bulletinId?: number;
  fichePaie: string;
  periode: string;
  datePaiement?: string;
  montant: number;
  soldeApres?: number;
}

export interface PrecompteModel {
  id?: number;
  precompteId?: number;
  numero?: string;
  reference?: string;
  motif?: string;
  motifAnnulation?: string;
  employeeId: string | number;
  employeeName?: string;
  matricule?: string;
  elementSalaryId: number;
  elementSalaryName?: string;
  salaryElementName?: string;
  elementSalaryCode?: string;
  amount: number;
  montantRestant: number;
  montantRembourse?: number;
  retenueMensuelle?: number;
  echeance: number;
  dateDebut?: string | Date;
  dateEcheance?: string | Date;
  statut: string;
  justificatif?: string;
  motifSuspension?: string;
  dateSuspension?: string | Date;
  dateSolde?: string | Date;
  versements?: PrecompteVersementModel[];
}

@Injectable({
  providedIn: 'root'
})
export class PrecompteService {
  private readonly apiUrl = `${environment.apiUrl}/precomptes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PrecompteModel[]> {
    return this.http.get<PrecompteModel[]>(this.apiUrl);
  }

  getById(id: number | string): Observable<PrecompteModel> {
    return this.http.get<PrecompteModel>(`${this.apiUrl}/${id}`);
  }

  getByEmployee(employeeId: number | string): Observable<PrecompteModel[]> {
    return this.http.get<PrecompteModel[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  getNextReference(): Observable<{ reference: string }> {
    return this.http.get<{ reference: string }>(`${this.apiUrl}/next-reference`);
  }

  create(payload: any): Observable<PrecompteModel> {
    return this.http.post<PrecompteModel>(this.apiUrl, payload);
  }

  update(id: number, payload: any): Observable<PrecompteModel> {
    return this.http.put<PrecompteModel>(`${this.apiUrl}/${id}`, payload);
  }

  solder(id: number, justificatif?: string, motif?: string): Observable<PrecompteModel> {
    return this.http.put<PrecompteModel>(`${this.apiUrl}/${id}/solder`, { justificatif, motif });
  }

  suspendre(id: number, motifSuspension: string): Observable<PrecompteModel> {
    return this.http.put<PrecompteModel>(`${this.apiUrl}/${id}/suspendre`, { motifSuspension });
  }

  reprendre(id: number): Observable<PrecompteModel> {
    return this.http.put<PrecompteModel>(`${this.apiUrl}/${id}/reprendre`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}