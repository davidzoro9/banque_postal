import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CompteComptable,
  ClasseComptableOption,
  SensEcritureOption,
  JournalComptableOption,
  RubriqueOption,
  ParametresFormulaireCompte
} from '../models/compte-comptable.model';

@Injectable({
  providedIn: 'root'
})
export class CompteComptableService {
  private readonly apiUrl = `${environment.apiUrl}/comptes-comptables`;

  constructor(private http: HttpClient) {}

  getAll(actifOnly: boolean = false): Observable<CompteComptable[]> {
    let params = new HttpParams();
    if (actifOnly) {
      params = params.set('actifOnly', 'true');
    }
    return this.http.get<CompteComptable[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<CompteComptable> {
    return this.http.get<CompteComptable>(`${this.apiUrl}/${id}`);
  }

  create(compte: CompteComptable): Observable<CompteComptable> {
    return this.http.post<CompteComptable>(this.apiUrl, compte);
  }

  update(id: number, compte: CompteComptable): Observable<CompteComptable> {
    return this.http.put<CompteComptable>(`${this.apiUrl}/${id}`, compte);
  }

  toggleStatus(id: number): Observable<CompteComptable> {
    return this.http.patch<CompteComptable>(`${this.apiUrl}/${id}/toggle-status`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // =========================================================================
  // PARAMÉTRAGES DU FORMULAIRE COMPTABLE (Appel dynamique depuis PostgreSQL)
  // =========================================================================

  getParametresFormulaire(): Observable<ParametresFormulaireCompte> {
    return this.http.get<ParametresFormulaireCompte>(`${this.apiUrl}/parametres-formulaire`);
  }

  getClasses(actifOnly: boolean = true): Observable<ClasseComptableOption[]> {
    const params = new HttpParams().set('actifOnly', String(actifOnly));
    return this.http.get<ClasseComptableOption[]>(`${this.apiUrl}/classes`, { params });
  }

  getSens(actifOnly: boolean = true): Observable<SensEcritureOption[]> {
    const params = new HttpParams().set('actifOnly', String(actifOnly));
    return this.http.get<SensEcritureOption[]>(`${this.apiUrl}/sens`, { params });
  }

  getJournaux(actifOnly: boolean = true): Observable<JournalComptableOption[]> {
    const params = new HttpParams().set('actifOnly', String(actifOnly));
    return this.http.get<JournalComptableOption[]>(`${this.apiUrl}/journaux`, { params });
  }

  getRubriquesOptions(actifOnly: boolean = true): Observable<RubriqueOption[]> {
    const params = new HttpParams().set('actifOnly', String(actifOnly));
    return this.http.get<RubriqueOption[]>(`${this.apiUrl}/rubriques-options`, { params });
  }

  // --- Gestion Classes ---
  saveClasse(classe: ClasseComptableOption): Observable<ClasseComptableOption> {
    return this.http.post<ClasseComptableOption>(`${this.apiUrl}/classes`, classe);
  }

  deleteClasse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/classes/${id}`);
  }

  toggleClasseStatus(id: number): Observable<ClasseComptableOption> {
    return this.http.patch<ClasseComptableOption>(`${this.apiUrl}/classes/${id}/toggle-status`, {});
  }

  // --- Gestion Sens ---
  saveSens(sens: SensEcritureOption): Observable<SensEcritureOption> {
    return this.http.post<SensEcritureOption>(`${this.apiUrl}/sens`, sens);
  }

  deleteSens(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sens/${id}`);
  }

  toggleSensStatus(id: number): Observable<SensEcritureOption> {
    return this.http.patch<SensEcritureOption>(`${this.apiUrl}/sens/${id}/toggle-status`, {});
  }

  // --- Gestion Journaux ---
  saveJournal(journal: JournalComptableOption): Observable<JournalComptableOption> {
    return this.http.post<JournalComptableOption>(`${this.apiUrl}/journaux`, journal);
  }

  deleteJournal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/journaux/${id}`);
  }

  toggleJournalStatus(id: number): Observable<JournalComptableOption> {
    return this.http.patch<JournalComptableOption>(`${this.apiUrl}/journaux/${id}/toggle-status`, {});
  }

  // --- Gestion Rubriques ---
  saveRubrique(rubrique: RubriqueOption): Observable<RubriqueOption> {
    return this.http.post<RubriqueOption>(`${this.apiUrl}/rubriques-options`, rubrique);
  }

  deleteRubrique(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rubriques-options/${id}`);
  }

  toggleRubriqueStatus(id: number): Observable<RubriqueOption> {
    return this.http.patch<RubriqueOption>(`${this.apiUrl}/rubriques-options/${id}/toggle-status`, {});
  }
}
