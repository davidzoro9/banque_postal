import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
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
  private readonly CACHE_TTL_MS = 30000; // 30 secondes de cache en mémoire

  private cache: { [key: string]: { data: any; timestamp: number } } = {};

  constructor(private http: HttpClient) {}

  private getCachedOrFetch<T>(key: string, url: string, forceRefresh = false): Observable<T> {
    const now = Date.now();
    const entry = this.cache[key];
    if (!forceRefresh && entry && (now - entry.timestamp < this.CACHE_TTL_MS)) {
      return of(entry.data as T);
    }
    return this.http.get<T>(url).pipe(
      tap(data => {
        this.cache[key] = { data, timestamp: Date.now() };
      }),
      shareReplay(1)
    );
  }

  getGrhStats(forceRefresh = false): Observable<GrhDashboardStats> {
    return this.getCachedOrFetch<GrhDashboardStats>('grh', `${this.baseUrl}/grh`, forceRefresh);
  }

  getDonneesBaseStats(forceRefresh = false): Observable<DonneesBaseDashboardStats> {
    return this.getCachedOrFetch<DonneesBaseDashboardStats>('donnees-base', `${this.baseUrl}/donnees-base`, forceRefresh);
  }

  getProfilsStats(forceRefresh = false): Observable<ProfilsDashboardStats> {
    return this.getCachedOrFetch<ProfilsDashboardStats>('profils', `${this.baseUrl}/profils`, forceRefresh);
  }

  getPaieStats(forceRefresh = false): Observable<PaieDashboardStats> {
    return this.getCachedOrFetch<PaieDashboardStats>('paie', `${this.baseUrl}/paie`, forceRefresh);
  }

  getGlobalStats(forceRefresh = false): Observable<GlobalDashboardStats> {
    return this.getCachedOrFetch<GlobalDashboardStats>('global', `${this.baseUrl}/global`, forceRefresh);
  }

  clearCache(): void {
    this.cache = {};
  }
}
