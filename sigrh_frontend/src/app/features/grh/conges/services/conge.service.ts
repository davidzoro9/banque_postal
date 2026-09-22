import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface Conge {
  id?: number | string;
  employee?: any;
  employe?: string;
  typeAbsenceConge?: any;
  type?: string;
  dateDebut: string;
  dateFin: string;
  nbJours: number;
  motif?: string;
  justificatif?: string;
  dateDemande?: string;
  dateValidation?: string;
  validePar?: string;
  motifRefus?: string;
  soldeAvantDemande?: number;
  soldeApresDemande?: number;
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REJETE' | 'ANNULE' | 'En attente' | 'Approuvé' | 'Refusé' | string;
}

export interface SoldeConge {
  employeeId: number;
  matricule: string;
  nomComplet: string;
  departement: string;
  poste: string;
  droitAnnuel: number;
  joursAcquis: number;
  joursPris: number;
  joursEnAttente: number;
  soldeRestant: number;
  dateDernierConge?: string;
}

export interface TypeAbsenceConge {
  id?: number;
  code: string;
  name: string;
}

export interface JourFerie {
  id?: number;
  libelle: string;
  date: string; // YYYY-MM-DD
  type?: string;
  chomePaye?: boolean;
  description?: string;
}

export interface ParametrageConge {
  id?: number;
  droitAnnuelDefaut: number; // ex: 30
  joursAcquisParMois: number; // ex: 2.5
  modeDecompte: 'OUVRABLE_5J' | 'OUVRABLE_6J' | 'CALENDAIRE';
  deduireJoursFeries: boolean;
  plafondReportJours: number;
  bloquerSiSoldeInsuffisant: boolean;
}

@Injectable({ providedIn: 'root' })
export class CongeService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Conge[]> {
    return this.http.get<Conge[]>(`${environment.apiUrl}/conges/all`);
  }

  getById(id: number | string): Observable<Conge> {
    return this.http.get<Conge>(`${environment.apiUrl}/conges/${id}`);
  }

  getByEmployee(employeeId: number | string): Observable<Conge[]> {
    return this.http.get<Conge[]>(`${environment.apiUrl}/conges/employe/${employeeId}`);
  }

  create(conge: any): Observable<Conge> {
    return this.http.post<Conge>(`${environment.apiUrl}/conges/create`, conge);
  }

  approuver(id: number | string, validePar?: string): Observable<Conge> {
    return this.http.put<Conge>(`${environment.apiUrl}/conges/${id}/approuver`, { validePar: validePar || 'DRH / Direction' });
  }

  rejeter(id: number | string, motifRefus: string, rejetePar?: string): Observable<Conge> {
    return this.http.put<Conge>(`${environment.apiUrl}/conges/${id}/rejeter`, {
      motifRefus: motifRefus || 'Non conforme aux nécessités de service',
      rejetePar: rejetePar || 'DRH / Direction'
    });
  }

  annuler(id: number | string): Observable<Conge> {
    return this.http.put<Conge>(`${environment.apiUrl}/conges/${id}/annuler`, {});
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/conges/${id}`);
  }

  getAllSoldes(): Observable<SoldeConge[]> {
    return this.http.get<SoldeConge[]>(`${environment.apiUrl}/conges/soldes`);
  }

  getSoldeByEmployee(employeeId: number | string): Observable<SoldeConge> {
    return this.http.get<SoldeConge>(`${environment.apiUrl}/conges/soldes/${employeeId}`);
  }

  getTypes(): Observable<TypeAbsenceConge[]> {
    return this.http.get<TypeAbsenceConge[]>(`${environment.apiUrl}/typeabsenceconge/all`);
  }

  // --- JOURS FÉRIÉS (11.3 des spécifications) ---
  getJoursFeries(): Observable<JourFerie[]> {
    return this.http.get<JourFerie[]>(`${environment.apiUrl}/jours-feries`);
  }

  createJourFerie(jourFerie: JourFerie): Observable<JourFerie> {
    return this.http.post<JourFerie>(`${environment.apiUrl}/jours-feries`, jourFerie);
  }

  updateJourFerie(id: number, jourFerie: JourFerie): Observable<JourFerie> {
    return this.http.put<JourFerie>(`${environment.apiUrl}/jours-feries/${id}`, jourFerie);
  }

  deleteJourFerie(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/jours-feries/${id}`);
  }

  // --- PARAMÉTRAGE DES RÈGLES DE CONGÉS ---
  getParametrage(): Observable<ParametrageConge> {
    return this.http.get<ParametrageConge>(`${environment.apiUrl}/conges/parametrage`);
  }

  saveParametrage(config: ParametrageConge): Observable<ParametrageConge> {
    return this.http.put<ParametrageConge>(`${environment.apiUrl}/conges/parametrage`, config);
  }
}

