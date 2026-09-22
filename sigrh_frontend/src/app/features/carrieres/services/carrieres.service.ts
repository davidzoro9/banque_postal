import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

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
  duree: number; // in hours
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
  note: number; // 1 to 5
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
  private competencesSubject = new BehaviorSubject<Competence[]>([]);
  private catalogueSubject = new BehaviorSubject<FormationCatalogue[]>([]);
  private sessionsSubject = new BehaviorSubject<FormationSession[]>([]);
  private evaluationsSubject = new BehaviorSubject<EvaluationEntretien[]>([]);
  private mobilitesSubject = new BehaviorSubject<MobiliteDemande[]>([]);

  competences$ = this.competencesSubject.asObservable();
  catalogue$ = this.catalogueSubject.asObservable();
  sessions$ = this.sessionsSubject.asObservable();
  evaluations$ = this.evaluationsSubject.asObservable();
  mobilites$ = this.mobilitesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshAll();
  }

  refreshAll(): void {
    this.fetchCompetences().subscribe();
    this.fetchCatalogue().subscribe();
    this.fetchSessions().subscribe();
    this.fetchEvaluations().subscribe();
    this.fetchMobilites().subscribe();
  }

  // --- Competences ---
  fetchCompetences(): Observable<Competence[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/carrieres/competences`).pipe(
      map(list => list.map(c => this.toFrontendCompetence(c))),
      tap(list => this.competencesSubject.next(list))
    );
  }

  addCompetence(comp: Omit<Competence, 'id'>): Observable<Competence> {
    const backendPayload = this.toBackendCompetence(comp);
    return this.http.post<any>(`${environment.apiUrl}/carrieres/competences`, backendPayload).pipe(
      map(c => this.toFrontendCompetence(c)),
      tap(newComp => {
        const list = this.competencesSubject.value;
        this.competencesSubject.next([...list, newComp]);
      })
    );
  }

  deleteCompetence(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/carrieres/competences/${id}`).pipe(
      tap(() => {
        const list = this.competencesSubject.value.filter(c => c.id !== id);
        this.competencesSubject.next(list);
      })
    );
  }

  // --- Catalogue ---
  fetchCatalogue(): Observable<FormationCatalogue[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/carrieres/catalogue`).pipe(
      map(list => list.map(item => ({
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
        const list = this.catalogueSubject.value;
        this.catalogueSubject.next([...list, newCourse]);
      })
    );
  }

  // --- Sessions ---
  fetchSessions(): Observable<FormationSession[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/carrieres/sessions`).pipe(
      map(list => list.map(item => ({
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
        const list = this.sessionsSubject.value;
        this.sessionsSubject.next([...list, newSess]);
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

  // --- Evaluations ---
  fetchEvaluations(): Observable<EvaluationEntretien[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/carrieres/evaluations`).pipe(
      map(list => list.map(item => ({
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

  addEvaluation(ev: Omit<EvaluationEntretien, 'id'>): Observable<EvaluationEntretien> {
    const payload = {
      ...ev,
      employeeId: Number(ev.employeeId)
    };
    return this.http.post<any>(`${environment.apiUrl}/carrieres/evaluations`, payload).pipe(
      map(item => ({
        id: String(item.id),
        employeeId: String(item.employeeId),
        employeeName: item.employeeName,
        date: item.date,
        evaluateur: item.evaluateur,
        note: item.note,
        objectifs: item.objectifs,
        commentaires: item.commentaires
      })),
      tap(newEv => {
        const list = this.evaluationsSubject.value;
        this.evaluationsSubject.next([newEv, ...list]);
      })
    );
  }

  // --- Mobilites ---
  fetchMobilites(): Observable<MobiliteDemande[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/carrieres/mobilites`).pipe(
      map(list => list.map(item => ({
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

  addMobility(mob: Omit<MobiliteDemande, 'id'>): Observable<MobiliteDemande> {
    const payload = {
      ...mob,
      employeeId: Number(mob.employeeId)
    };
    return this.http.post<any>(`${environment.apiUrl}/carrieres/mobilites`, payload).pipe(
      map(item => ({
        id: String(item.id),
        employeeId: String(item.employeeId),
        employeeName: item.employeeName,
        typeMobility: item.typeMobility,
        posteCible: item.posteCible,
        serviceCible: item.serviceCible,
        dateDemande: item.dateDemande,
        commentaires: item.commentaires,
        statut: item.statut
      })),
      tap(newMob => {
        const list = this.mobilitesSubject.value;
        this.mobilitesSubject.next([newMob, ...list]);
      })
    );
  }

  updateMobilityStatus(id: string, statut: MobiliteDemande['statut']): Observable<void> {
    return this.http.patch<any>(`${environment.apiUrl}/carrieres/mobilites/${id}?statut=${statut}`, {}).pipe(
      map(() => {
        const list = this.mobilitesSubject.value.map(m => m.id === id ? { ...m, statut } : m);
        this.mobilitesSubject.next(list);
      })
    );
  }

  // Helper converters
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
