import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface EmployeeRef {
  id: number;
  matricule?: string;
  nom?: string;
  prenom?: string;
  name?: string;
  poste?: string;
  service?: string;
  direction?: string;
}

export interface EchelonRef {
  id: number;
  code?: string;
  libelle?: string;
  description?: string;
}

export interface CategorieRef {
  id: number;
  code?: string;
  libelle?: string;
}

export interface GradeRef {
  id: number;
  code?: string;
  libelle?: string;
}

export interface CarriereNotation {
  id?: number;
  employee: any;
  exercice?: number;
  noteObjectifs?: number;
  noteCompetences?: number;
  noteComportement?: number;
  noteGlobale?: number;
  appreciation?: string;
  evaluateur?: string;
  dateEvaluation?: string;
  statut?: string;
}

export interface CarriereAvancement {
  id?: number;
  employee: any;
  exercice?: number;
  echelonActuel?: EchelonRef;
  echelonPropose?: EchelonRef;
  salaireBaseActuel?: number;
  salaireBasePropose?: number;
  ecartSalaire?: number;
  typeAvancement?: string; // 'ANCIENNETE' | 'CHOIX_MERITE'
  statut?: 'PROPOSE' | 'VALIDE' | 'REJETE';
  dateProposition?: string;
  dateValidation?: string;
  validateur?: string;
  observations?: string;
}

export interface CarriereReclassement {
  id?: number;
  employee: any;
  dateDemande?: string;
  dateEffet?: string;
  categorieAncienne?: CategorieRef;
  categorieNouvelle?: CategorieRef;
  gradeAncien?: GradeRef;
  gradeNouveau?: GradeRef;
  echelonAncien?: EchelonRef;
  echelonNouveau?: EchelonRef;
  salaireBaseAncien?: number;
  salaireBaseNouveau?: number;
  referenceActe?: string;
  motif?: string;
  statut?: 'PROPOSE' | 'VALIDE' | 'REJETE';
  dateValidation?: string;
  validateur?: string;
  observations?: string;
}

export interface DashboardCarrieresStats {
  totalEmployees: number;
  totalNotations: number;
  moyenneNotes: number;
  avancementsProposes: number;
  avancementsValides: number;
  totalReclassements: number;
}

export interface Competence {
  id: string;
  libelle: string;
  categorie: 'Technique' | 'Soft Skills' | 'Management' | 'Organisationnelle';
  description: string;
  niveaux: string[];
}

export interface FormationCatalogue {
  id: string;
  titre: string;
  description: string;
  duree: number;
}

export interface FormationSession {
  id: string;
  titre: string;
  date: string;
  participants: number;
  statut: 'Planifiée' | 'Confirmée' | 'Terminée' | 'Annulée';
  description?: string;
  duree?: number;
}

export interface EvaluationEntretien {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  evaluateur: string;
  note: number;
  objectifs: string;
  commentaires: string;
}

export interface MobiliteDemande {
  id: string;
  employeeId: string;
  employeeName: string;
  typeMobility: 'Mutation géographique' | 'Promotion' | 'Reconversion professionnelle';
  posteCible: string;
  serviceCible: string;
  dateDemande: string;
  commentaires: string;
  statut: 'En attente' | 'Validée' | 'Refusée';
}

@Injectable({ providedIn: 'root' })
export class CarrieresService {
  private notationsSubject = new BehaviorSubject<CarriereNotation[]>([]);
  private avancementsSubject = new BehaviorSubject<CarriereAvancement[]>([]);
  private reclassementsSubject = new BehaviorSubject<CarriereReclassement[]>([]);
  private competencesSubject = new BehaviorSubject<Competence[]>([]);
  private catalogueSubject = new BehaviorSubject<FormationCatalogue[]>([]);
  private sessionsSubject = new BehaviorSubject<FormationSession[]>([]);
  private evaluationsSubject = new BehaviorSubject<EvaluationEntretien[]>([]);
  private mobilitesSubject = new BehaviorSubject<MobiliteDemande[]>([]);

  notations$ = this.notationsSubject.asObservable();
  avancements$ = this.avancementsSubject.asObservable();
  reclassements$ = this.reclassementsSubject.asObservable();
  competences$ = this.competencesSubject.asObservable();
  catalogue$ = this.catalogueSubject.asObservable();
  sessions$ = this.sessionsSubject.asObservable();
  evaluations$ = this.evaluationsSubject.asObservable();
  mobilites$ = this.mobilitesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshAll();
  }

  refreshAll(): void {
    this.fetchNotations().subscribe();
    this.fetchAvancements().subscribe();
    this.fetchReclassements().subscribe();
    this.fetchCompetences().subscribe();
    this.fetchCatalogue().subscribe();
    this.fetchSessions().subscribe();
    this.fetchEvaluations().subscribe();
    this.fetchMobilites().subscribe();
  }

  // --- Dashboard Stats ---
  getDashboardStats(): Observable<DashboardCarrieresStats> {
    return this.http.get<DashboardCarrieresStats>(`${environment.apiUrl}/carrieres/dashboard`);
  }

  // --- Notations & Évaluations de Performance ---
  fetchNotations(exercice?: number): Observable<CarriereNotation[]> {
    const url = exercice ? `${environment.apiUrl}/carrieres/notations?exercice=${exercice}` : `${environment.apiUrl}/carrieres/notations`;
    return this.http.get<CarriereNotation[]>(url).pipe(
      tap(list => this.notationsSubject.next(list || []))
    );
  }

  saveNotation(notation: CarriereNotation): Observable<CarriereNotation> {
    return this.http.post<CarriereNotation>(`${environment.apiUrl}/carrieres/notations`, notation).pipe(
      tap(saved => {
        const list = this.notationsSubject.value;
        const index = list.findIndex(n => n.id === saved.id);
        if (index >= 0) {
          list[index] = saved;
          this.notationsSubject.next([...list]);
        } else {
          this.notationsSubject.next([saved, ...list]);
        }
      })
    );
  }

  deleteNotation(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/carrieres/notations/${id}`).pipe(
      tap(() => {
        this.notationsSubject.next(this.notationsSubject.value.filter(n => n.id !== id));
      })
    );
  }

  // --- Avancements d'Échelon ---
  fetchAvancements(exercice?: number): Observable<CarriereAvancement[]> {
    const url = exercice ? `${environment.apiUrl}/carrieres/avancements?exercice=${exercice}` : `${environment.apiUrl}/carrieres/avancements`;
    return this.http.get<CarriereAvancement[]>(url).pipe(
      tap(list => this.avancementsSubject.next(list || []))
    );
  }

  genererAvancements(exercice?: number): Observable<CarriereAvancement[]> {
    const url = exercice ? `${environment.apiUrl}/carrieres/avancements/generer?exercice=${exercice}` : `${environment.apiUrl}/carrieres/avancements/generer`;
    return this.http.post<CarriereAvancement[]>(url, {}).pipe(
      tap(list => this.avancementsSubject.next(list || []))
    );
  }

  validerAvancement(id: number, validateur?: string): Observable<CarriereAvancement> {
    const v = validateur ? `?validateur=${encodeURIComponent(validateur)}` : '';
    return this.http.post<CarriereAvancement>(`${environment.apiUrl}/carrieres/avancements/${id}/valider${v}`, {}).pipe(
      tap(updated => {
        const list = this.avancementsSubject.value.map(a => a.id === id ? updated : a);
        this.avancementsSubject.next(list);
      })
    );
  }

  rejeterAvancement(id: number, motif?: string): Observable<CarriereAvancement> {
    const m = motif ? `?motif=${encodeURIComponent(motif)}` : '';
    return this.http.post<CarriereAvancement>(`${environment.apiUrl}/carrieres/avancements/${id}/rejeter${m}`, {}).pipe(
      tap(updated => {
        const list = this.avancementsSubject.value.map(a => a.id === id ? updated : a);
        this.avancementsSubject.next(list);
      })
    );
  }

  // --- Reclassements Professionnels ---
  fetchReclassements(): Observable<CarriereReclassement[]> {
    return this.http.get<CarriereReclassement[]>(`${environment.apiUrl}/carrieres/reclassements`).pipe(
      tap(list => this.reclassementsSubject.next(list || []))
    );
  }

  saveReclassement(reclassement: CarriereReclassement): Observable<CarriereReclassement> {
    return this.http.post<CarriereReclassement>(`${environment.apiUrl}/carrieres/reclassements`, reclassement).pipe(
      tap(saved => {
        this.reclassementsSubject.next([saved, ...this.reclassementsSubject.value]);
      })
    );
  }

  validerReclassement(id: number, validateur?: string): Observable<CarriereReclassement> {
    const v = validateur ? `?validateur=${encodeURIComponent(validateur)}` : '';
    return this.http.post<CarriereReclassement>(`${environment.apiUrl}/carrieres/reclassements/${id}/valider${v}`, {}).pipe(
      tap(updated => {
        const list = this.reclassementsSubject.value.map(r => r.id === id ? updated : r);
        this.reclassementsSubject.next(list);
      })
    );
  }

  // --- Competences ---
  fetchCompetences(): Observable<Competence[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/carrieres/competences`).pipe(
      map(list => (list || []).map(c => this.toFrontendCompetence(c))),
      tap(list => this.competencesSubject.next(list))
    );
  }

  addCompetence(comp: Omit<Competence, 'id'>): Observable<Competence> {
    const backendPayload = this.toBackendCompetence(comp);
    return this.http.post<any>(`${environment.apiUrl}/carrieres/competences`, backendPayload).pipe(
      map(c => this.toFrontendCompetence(c)),
      tap(newComp => {
        this.competencesSubject.next([...this.competencesSubject.value, newComp]);
      })
    );
  }

  deleteCompetence(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/carrieres/competences/${id}`).pipe(
      tap(() => {
        this.competencesSubject.next(this.competencesSubject.value.filter(c => c.id !== id));
      })
    );
  }

  // --- Catalogue ---
  fetchCatalogue(): Observable<FormationCatalogue[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/carrieres/catalogue`).pipe(
      map(list => (list || []).map(item => ({
        id: String(item.id),
        titre: item.titre,
        description: item.description,
        duree: item.duree
      }))),
      tap(list => this.catalogueSubject.next(list))
    );
  }

  addCourse(course: Omit<FormationCatalogue, 'id'>): Observable<FormationCatalogue> {
    return this.http.post<any>(`${environment.apiUrl}/carrieres/catalogue`, course).pipe(
      map(item => ({
        id: String(item.id),
        titre: item.titre,
        description: item.description,
        duree: item.duree
      })),
      tap(newCourse => {
        this.catalogueSubject.next([...this.catalogueSubject.value, newCourse]);
      })
    );
  }

  // --- Sessions ---
  fetchSessions(): Observable<FormationSession[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/carrieres/sessions`).pipe(
      map(list => (list || []).map(item => ({
        id: String(item.id),
        titre: item.titre,
        date: item.date,
        participants: item.participants,
        statut: item.statut,
        description: item.description,
        duree: item.duree
      }))),
      tap(list => this.sessionsSubject.next(list))
    );
  }

  scheduleSession(sess: Omit<FormationSession, 'id'>): Observable<FormationSession> {
    return this.http.post<any>(`${environment.apiUrl}/carrieres/sessions`, sess).pipe(
      map(item => ({
        id: String(item.id),
        titre: item.titre,
        date: item.date,
        participants: item.participants,
        statut: item.statut,
        description: item.description,
        duree: item.duree
      })),
      tap(newSess => {
        this.sessionsSubject.next([...this.sessionsSubject.value, newSess]);
      })
    );
  }

  updateSessionStatus(id: string, statut: FormationSession['statut']): Observable<void> {
    return this.http.patch<any>(`${environment.apiUrl}/carrieres/sessions/${id}?statut=${statut}`, {}).pipe(
      map(() => {
        const list = this.sessionsSubject.value.map(s => s.id === id ? { ...s, statut } : s);
        this.sessionsSubject.next(list);
      })
    );
  }

  // --- Evaluations & Mobilites (Compat) ---
  fetchEvaluations(): Observable<EvaluationEntretien[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/carrieres/evaluations`).pipe(
      map(list => (list || []).map(item => ({
        id: String(item.id),
        employeeId: String(item.employeeId),
        employeeName: item.employeeName,
        date: item.date,
        evaluateur: item.evaluateur,
        note: item.note,
        objectifs: item.objectifs,
        commentaires: item.commentaires
      }))),
      tap(list => this.evaluationsSubject.next(list))
    );
  }

  fetchMobilites(): Observable<MobiliteDemande[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/carrieres/mobilites`).pipe(
      map(list => (list || []).map(item => ({
        id: String(item.id),
        employeeId: String(item.employeeId),
        employeeName: item.employeeName,
        typeMobility: item.typeMobility,
        posteCible: item.posteCible,
        serviceCible: item.serviceCible,
        dateDemande: item.dateDemande,
        commentaires: item.commentaires,
        statut: item.statut
      }))),
      tap(list => this.mobilitesSubject.next(list))
    );
  }

  private toFrontendCompetence(c: any): Competence {
    return {
      id: String(c.id),
      libelle: c.libelle,
      categorie: c.categorie,
      description: c.description,
      niveaux: c.niveauxRaw ? c.niveauxRaw.split(',').map((s: string) => s.trim()) : []
    };
  }

  private toBackendCompetence(c: Omit<Competence, 'id'> & { id?: string }): any {
    return {
      id: c.id ? Number(c.id) : undefined,
      libelle: c.libelle,
      categorie: c.categorie,
      description: c.description,
      niveauxRaw: c.niveaux ? c.niveaux.join(', ') : ''
    };
  }
}
