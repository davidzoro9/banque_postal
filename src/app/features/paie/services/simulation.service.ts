import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SimulationIndemnitesAuto, SimulationRequest, SimulationResult } from '../models/simulation.model';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private readonly baseUrl = `${environment.apiUrl}/simulation`;

  constructor(private http: HttpClient) {}

  simuler(request: SimulationRequest): Observable<SimulationResult> {
    return this.http.post<SimulationResult>(`${this.baseUrl}/calculer`, request);
  }

  getIndemnitesAuto(request: SimulationRequest): Observable<SimulationIndemnitesAuto> {
    return this.http.post<SimulationIndemnitesAuto>(`${this.baseUrl}/indemnites-auto`, request);
  }

  getGrilles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/grillesalariale/all`);
  }

  lookupGrille(category: string, echelon: string | number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/grillesalariale/lookup`, {
      params: { category, echellon: String(echelon) }
    });
  }

  getEmplois(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/emplois`);
  }

  getFonctions(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/fonctions`);
  }
}
