import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AvoirVersementModel {
  bulletinId?: number;
  fichePaie: string;
  periode: string;
  datePaiement?: string;
  montant: number;
  soldeApres?: number;
}

export interface AvoirModel {
  id?: number;
  avoirId?: number;
  numero?: string;
  reference?: string;
  motif?: string;
  motifAnnulation?: string;
  employeeId: string | number;
  employeeName?: string;
  matricule?: string;
  salaryElementId: number;
  salaryElementName?: string;
  salaryElementCode?: string;
  amount: number;
  montantRestant?: number;
  montantVerse?: number;
  versementMensuel?: number;
  echeance?: number;
  dateDebut?: string | Date;
  dateEcheance?: string | Date;
  statut: string;
  versements?: AvoirVersementModel[];
}

@Injectable({
  providedIn: 'root'
})
export class AvoirService {
  private readonly apiUrl = `${environment.apiUrl}/avoirs`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AvoirModel[]> {
    return this.http.get<AvoirModel[]>(this.apiUrl);
  }

  getById(id: number | string): Observable<AvoirModel> {
    return this.http.get<AvoirModel>(`${this.apiUrl}/${id}`);
  }

  getByEmployee(employeeId: number | string): Observable<AvoirModel[]> {
    return this.http.get<AvoirModel[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  getNextReference(): Observable<{ reference: string }> {
    return this.http.get<{ reference: string }>(`${this.apiUrl}/next-reference`);
  }

  create(payload: any): Observable<AvoirModel> {
    return this.http.post<AvoirModel>(this.apiUrl, payload);
  }

  update(id: number, payload: any): Observable<AvoirModel> {
    return this.http.put<AvoirModel>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}