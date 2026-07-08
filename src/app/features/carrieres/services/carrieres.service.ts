import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

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

  constructor() {
    this.initData();
  }

  private initData(): void {
    // 1. Competences
    let comps = localStorage.getItem('car_competences');
    if (!comps) {
      const initialComps: Competence[] = [
        { id: '1', libelle: 'Développement Angular', categorie: 'Technique', description: 'Maîtrise du framework Angular (v17+, RxJS, State management)', niveaux: ['Débutant', 'Intermédiaire', 'Confirmé', 'Expert'] },
        { id: '2', libelle: 'Gestion de projet Agile', categorie: 'Organisationnelle', description: 'Planification, animation de sprints, méthodologie Scrum/Kanban', niveaux: ['Débutant', 'Intermédiaire', 'Praticien', 'Coach'] },
        { id: '3', libelle: 'Leadership & Team Management', categorie: 'Management', description: 'Capacité à motiver, guider et animer une équipe technique', niveaux: ['Bases', 'Opérationnel', 'Confirmé', 'Inspirant'] },
        { id: '4', libelle: 'Communication interpersonnelle', categorie: 'Soft Skills', description: 'Aisance relationnelle, écoute active et résolution de conflits', niveaux: ['Bases', 'Développé', 'Maîtrisé'] }
      ];
      localStorage.setItem('car_competences', JSON.stringify(initialComps));
      comps = JSON.stringify(initialComps);
    }
    this.competencesSubject.next(JSON.parse(comps));

    // 2. Catalogue Formations
    let cat = localStorage.getItem('car_catalogue');
    if (!cat) {
      const initialCat: FormationCatalogue[] = [
        { id: '1', titre: 'Leadership & Management', description: 'Principes de base du management et du leadership d\'équipe', duree: 24 },
        { id: '2', titre: 'Angular Avancé', description: 'RxJS, signaux, architectures complexes et optimisation de bundle', duree: 35 },
        { id: '3', titre: 'Communication efficace', description: 'Améliorer son impact personnel et son écoute dans le cadre professionnel', duree: 14 },
        { id: '4', titre: 'Gestion de projet Agile', description: 'Comprendre et appliquer Scrum et Kanban au quotidien', duree: 21 }
      ];
      localStorage.setItem('car_catalogue', JSON.stringify(initialCat));
      cat = JSON.stringify(initialCat);
    }
    this.catalogueSubject.next(JSON.parse(cat));

    // 3. Sessions Formations
    let sess = localStorage.getItem('car_sessions');
    if (!sess) {
      const initialSess: FormationSession[] = [
        { id: '1', titre: 'Leadership & Management', date: '2026-06-15', participants: 12, statut: 'Confirmée', duree: 24 },
        { id: '2', titre: 'Angular Avancé', date: '2026-06-22', participants: 8, statut: 'Confirmée', duree: 35 },
        { id: '3', titre: 'Communication efficace', date: '2026-07-05', participants: 15, statut: 'Planifiée', duree: 14 },
        { id: '4', titre: 'Gestion de projet Agile', date: '2026-07-12', participants: 10, statut: 'Planifiée', duree: 21 }
      ];
      localStorage.setItem('car_sessions', JSON.stringify(initialSess));
      sess = JSON.stringify(initialSess);
    }
    this.sessionsSubject.next(JSON.parse(sess));

    // 4. Evaluations
    let evs = localStorage.getItem('car_evaluations');
    if (!evs) {
      const initialEvs: EvaluationEntretien[] = [
        { id: '1', employeeId: '4', employeeName: 'David ZOROM', date: '2025-12-10', evaluateur: 'Marie DUPONT', note: 4, objectifs: 'Maîtriser Angular 19 et améliorer la couverture de tests.', commentaires: 'David fournit un travail de qualité. Très bon esprit technique.' },
        { id: '2', employeeId: '5', employeeName: 'Marie DUPONT', date: '2025-12-15', evaluateur: 'Directeur Général', note: 5, objectifs: 'Mettre en place la nouvelle GPEC.', commentaires: 'Excellent pilotage des ressources humaines durant la phase de transition.' }
      ];
      localStorage.setItem('car_evaluations', JSON.stringify(initialEvs));
      evs = JSON.stringify(initialEvs);
    }
    this.evaluationsSubject.next(JSON.parse(evs));

    // 5. Mobilites
    let mob = localStorage.getItem('car_mobilites');
    if (!mob) {
      const initialMob: MobiliteDemande[] = [
        { id: '1', employeeId: '4', employeeName: 'David ZOROM', typeMobility: 'Promotion', posteCible: 'Architecte Logiciel', serviceCible: 'DSI', dateDemande: '2026-05-01', commentaires: 'Souhaite évoluer vers de la conception d\'architecture.', statut: 'En attente' }
      ];
      localStorage.setItem('car_mobilites', JSON.stringify(initialMob));
      mob = JSON.stringify(initialMob);
    }
    this.mobilitesSubject.next(JSON.parse(mob));
  }

  // --- Competences ---
  addCompetence(comp: Omit<Competence, 'id'>): Observable<Competence> {
    const list = this.competencesSubject.value;
    const newComp = { ...comp, id: `comp-${Date.now()}` };
    const newList = [...list, newComp];
    localStorage.setItem('car_competences', JSON.stringify(newList));
    this.competencesSubject.next(newList);
    return of(newComp);
  }

  // --- Catalogue ---
  addCourse(course: Omit<FormationCatalogue, 'id'>): Observable<FormationCatalogue> {
    const list = this.catalogueSubject.value;
    const newCourse = { ...course, id: `course-${Date.now()}` };
    const newList = [...list, newCourse];
    localStorage.setItem('car_catalogue', JSON.stringify(newList));
    this.catalogueSubject.next(newList);
    return of(newCourse);
  }

  // --- Sessions ---
  scheduleSession(sess: Omit<FormationSession, 'id'>): Observable<FormationSession> {
    const list = this.sessionsSubject.value;
    const newSess = { ...sess, id: `sess-${Date.now()}` };
    const newList = [...list, newSess];
    localStorage.setItem('car_sessions', JSON.stringify(newList));
    this.sessionsSubject.next(newList);
    return of(newSess);
  }

  updateSessionStatus(id: string, statut: FormationSession['statut']): Observable<void> {
    const list = this.sessionsSubject.value.map(s => s.id === id ? { ...s, statut } : s);
    localStorage.setItem('car_sessions', JSON.stringify(list));
    this.sessionsSubject.next(list);
    return of(undefined);
  }

  // --- Evaluations ---
  addEvaluation(ev: Omit<EvaluationEntretien, 'id'>): Observable<EvaluationEntretien> {
    const list = this.evaluationsSubject.value;
    const newEv = { ...ev, id: `ev-${Date.now()}` };
    const newList = [newEv, ...list];
    localStorage.setItem('car_evaluations', JSON.stringify(newList));
    this.evaluationsSubject.next(newList);
    return of(newEv);
  }

  // --- Mobilites ---
  addMobility(mob: Omit<MobiliteDemande, 'id'>): Observable<MobiliteDemande> {
    const list = this.mobilitesSubject.value;
    const newMob = { ...mob, id: `mob-${Date.now()}` };
    const newList = [newMob, ...list];
    localStorage.setItem('car_mobilites', JSON.stringify(newList));
    this.mobilitesSubject.next(newList);
    return of(newMob);
  }

  updateMobilityStatus(id: string, statut: MobiliteDemande['statut']): Observable<void> {
    const list = this.mobilitesSubject.value.map(m => m.id === id ? { ...m, statut } : m);
    localStorage.setItem('car_mobilites', JSON.stringify(list));
    this.mobilitesSubject.next(list);
    return of(undefined);
  }
}
