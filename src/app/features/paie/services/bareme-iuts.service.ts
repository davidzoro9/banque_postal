import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface BaremeIuts {
  id?: number;
  code?: string;
  trancheMin: number;
  trancheMax: number;
  tauxPercent: number;
  abattementFixe?: number;
  actif?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BaremeIutsService {
  private readonly apiUrl = `${environment.apiUrl}/baremes-iuts`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BaremeIuts[]> {
    return this.http.get<BaremeIuts[]>(this.apiUrl);
  }

  getById(id: number): Observable<BaremeIuts> {
    return this.http.get<BaremeIuts>(`${this.apiUrl}/${id}`);
  }

  create(item: Partial<BaremeIuts>): Observable<BaremeIuts> {
    return this.http.post<BaremeIuts>(this.apiUrl, item);
  }

  update(id: number, item: Partial<BaremeIuts>): Observable<BaremeIuts> {
    return this.http.put<BaremeIuts>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
