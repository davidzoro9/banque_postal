import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RetenueDto {
  id?: number;
  code: string;
  libelle: string;
  typeRetenueId?: number;
  typeRetenueLibelle?: string;
  regimeSecuriteSocialId?: number;
  regimeSecuriteSocialCode?: string;
  regimeSecuriteSocialLibelle?: string;
  taux?: number;
  baseCalcul?: string;
  description?: string;
  actif?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RetenueService {
  private readonly apiUrl = `${environment.apiUrl}/retenue`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RetenueDto[]> {
    return this.http.get<RetenueDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<RetenueDto> {
    return this.http.get<RetenueDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: Partial<RetenueDto>): Observable<RetenueDto> {
    return this.http.post<RetenueDto>(this.apiUrl, dto);
  }

  update(id: number, dto: Partial<RetenueDto>): Observable<RetenueDto> {
    return this.http.put<RetenueDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
