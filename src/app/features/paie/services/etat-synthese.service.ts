import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EtatSyntheseConfig {
  id?: number;
  code: string;
  libelle: string;
  categorie: string;
  description?: string;
  icon?: string;
  ordre?: number;
  actif: boolean;
  isSystem?: boolean;
  filtreType?: string;
  typeElementCode?: string;
  colonnesJson?: string;
}

export interface EtatSyntheseFilter {
  typeEtat?: string;
  sessionPaieId?: number | null;
  bulletinLotId?: number | null;
  directionId?: number | null;
  banque?: string | null;
}

export interface EtatSyntheseWrapper {
  typeEtat: string;
  titreEtat: string;
  codeSession: string;
  periode: string;
  annee: number;
  mois: string;
  typeSession: string;
  nombreBulletins: number;
  totalBrut: number;
  totalNet: number;
  totalRetenues: number;
  totalCotisationsPatronales: number;
  totalMasseSalariale: number;
  donnees: any[];
  totaux?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EtatSyntheseService {
  private readonly baseUrl = `${environment.apiUrl}/paie/etats-synthese`;

  constructor(private http: HttpClient) {}

  // ─── GESTION DES CONFIGURATIONS D'ÉTATS (POSTGRESQL) ────────────────────
  getConfigs(onlyActive = false): Observable<EtatSyntheseConfig[]> {
    const params = new HttpParams().set('onlyActive', onlyActive.toString());
    return this.http.get<EtatSyntheseConfig[]>(`${this.baseUrl}/configs`, { params });
  }

  createConfig(config: EtatSyntheseConfig): Observable<EtatSyntheseConfig> {
    return this.http.post<EtatSyntheseConfig>(`${this.baseUrl}/configs`, config);
  }

  updateConfig(id: number, config: EtatSyntheseConfig): Observable<EtatSyntheseConfig> {
    return this.http.put<EtatSyntheseConfig>(`${this.baseUrl}/configs/${id}`, config);
  }

  toggleConfig(id: number): Observable<EtatSyntheseConfig> {
    return this.http.patch<EtatSyntheseConfig>(`${this.baseUrl}/configs/${id}/toggle`, {});
  }

  deleteConfig(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/configs/${id}`);
  }

  // ─── CALCUL ET RAPPORT DE L'ÉTAT DE SYNTHÈSE ────────────────────────────
  getEtatSynthese(filters: EtatSyntheseFilter): Observable<EtatSyntheseWrapper> {
    let params = new HttpParams();
    if (filters.typeEtat) params = params.set('typeEtat', filters.typeEtat);
    if (filters.sessionPaieId) params = params.set('sessionPaieId', filters.sessionPaieId.toString());
    if (filters.bulletinLotId) params = params.set('bulletinLotId', filters.bulletinLotId.toString());
    if (filters.directionId) params = params.set('directionId', filters.directionId.toString());
    if (filters.banque && filters.banque !== 'TOUTES') params = params.set('banque', filters.banque);

    return this.http.get<EtatSyntheseWrapper>(this.baseUrl, { params });
  }

  downloadPdf(filters: EtatSyntheseFilter): Observable<Blob> {
    let params = new HttpParams();
    if (filters.typeEtat) params = params.set('typeEtat', filters.typeEtat);
    if (filters.sessionPaieId) params = params.set('sessionPaieId', filters.sessionPaieId.toString());
    if (filters.bulletinLotId) params = params.set('bulletinLotId', filters.bulletinLotId.toString());
    if (filters.directionId) params = params.set('directionId', filters.directionId.toString());
    if (filters.banque && filters.banque !== 'TOUTES') params = params.set('banque', filters.banque);

    return this.http.get(`${this.baseUrl}/pdf`, { params, responseType: 'blob' });
  }

  downloadExcel(filters: EtatSyntheseFilter): Observable<Blob> {
    let params = new HttpParams();
    if (filters.typeEtat) params = params.set('typeEtat', filters.typeEtat);
    if (filters.sessionPaieId) params = params.set('sessionPaieId', filters.sessionPaieId.toString());
    if (filters.bulletinLotId) params = params.set('bulletinLotId', filters.bulletinLotId.toString());
    if (filters.directionId) params = params.set('directionId', filters.directionId.toString());
    if (filters.banque && filters.banque !== 'TOUTES') params = params.set('banque', filters.banque);

    return this.http.get(`${this.baseUrl}/excel`, { params, responseType: 'blob' });
  }
}
