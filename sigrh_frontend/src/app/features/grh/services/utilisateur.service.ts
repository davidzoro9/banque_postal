import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Utilisateur {
  id?: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: string;
  actif: boolean;
}

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${environment.apiUrl}/utilisateurs/all`);
  }

  create(user: Omit<Utilisateur, 'id'>): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${environment.apiUrl}/utilisateurs/create`, user);
  }

  update(id: number, user: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${environment.apiUrl}/utilisateurs/${id}`, user);
  }

  updatePassword(id: number, password: string): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${environment.apiUrl}/utilisateurs/${id}/password`, { password });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/utilisateurs/${id}`);
  }
}
