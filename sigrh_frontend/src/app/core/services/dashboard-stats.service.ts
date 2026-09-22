import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GrhDashboardStats,
  DonneesBaseDashboardStats,
  ProfilsDashboardStats,
  PaieDashboardStats,
  GlobalDashboardStats
} from '../models/dashboard-stats.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardStatsService {
  private readonly baseUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  getGrhStats(): Observable<GrhDashboardStats> {
    return this.http.get<GrhDashboardStats>(`${this.baseUrl}/grh`);
  }

  getDonneesBaseStats(): Observable<DonneesBaseDashboardStats> {
    return this.http.get<DonneesBaseDashboardStats>(`${this.baseUrl}/donnees-base`);
  }

  getProfilsStats(): Observable<ProfilsDashboardStats> {
    return this.http.get<ProfilsDashboardStats>(`${this.baseUrl}/profils`);
  }

  getPaieStats(): Observable<PaieDashboardStats> {
    return this.http.get<PaieDashboardStats>(`${this.baseUrl}/paie`);
  }

  getGlobalStats(): Observable<GlobalDashboardStats> {
    return this.http.get<GlobalDashboardStats>(`${this.baseUrl}/global`);
  }
}
