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
  justificatifNom?: string;
  dateDemande?: string;
  dateValidation?: string;
  validePar?: string;
  motifRefus?: string;
  soldeAvantDemande?: number;
  soldeApresDemande?: number;
  statut: 'EN_ATTENTE_INTERIM' | 'EN_ATTENTE_N1' | 'EN_ATTENTE_DRH' | 'APPROUVE' | 'REJETE' | 'ANNULE' | 'EN_ATTENTE' | string;

  // ── ÉTAPE 2 : AVIS DU COLLÈGUE PRESSENTI (INTÉRIMAIRE) ──
  interimaire?: any;
  interimaireId?: number | string;
  statutInterim?: 'EN_ATTENTE_INTERIM' | 'ACCEPTE' | 'REFUSE' | 'NON_REQUIS' | string;
  dateAvisInterim?: string;
  commentaireInterim?: string;

  // ── ÉTAPE 3 : VISA HIÉRARCHIQUE N+1 (DIRECTEUR / CHEF DE PÔLE) ──
  visaN1Par?: string;
  dateVisaN1?: string;
  commentaireN1?: string;

  // ── ÉTAPE 4 : CONTRÔLE ET TITRE DE CONGÉ DRH ──
  visaDrhPar?: string;
  dateVisaDrh?: string;
  numeroTitreConge?: string;

  // ── ÉTAPE 5 : RÈGLE PRUDENTIELLE BCEAO (SUSPENSION ACCÈS SI) ──
  posteSensibleBceao?: boolean;
  statutSi?: 'NON_REQUIS' | 'A_SUSPENDRE' | 'ACCES_SUSPENDU' | 'ACCES_RESTAURE' | string;
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
  deductibleDuSolde?: boolean;
  dureeMaxLegaleJours?: number;
  categorie?: 'CONGE' | 'ABSENCE' | 'PERMISSION' | string;
  sexeRequis?: 'FEMININ' | 'MASCULIN' | 'TOUS' | string;
  remunere?: boolean;
  tauxRemuneration?: number;
  justificatifRequis?: boolean;
  typeJustificatif?: string;
  actif?: boolean;
  delaiJustificationJours?: number;
  description?: string;
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
  modeDecompte: 'OUVRABLE_5J' | 'OUVRABLE_6J' | 'CALENDAIRE' | string;
  deduireJoursFeries: boolean;
  plafondReportJours: number;
  bloquerSiSoldeInsuffisant: boolean;
  preavisJoursMin?: number;
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

  getByInterimaire(interimaireId: number | string): Observable<Conge[]> {
    return this.http.get<Conge[]>(`${environment.apiUrl}/conges/interimaire/${interimaireId}`);
  }

  create(conge: any): Observable<Conge> {
    return this.http.post<Conge>(`${environment.apiUrl}/conges/create`, conge);
  }

  // ── ÉTAPE 2 : AVIS INTÉRIMAIRE ──
  avisInterim(id: number | string, accord: boolean, commentaire?: string, interimaireNom?: string): Observable<Conge> {
    return this.http.put<Conge>(`${environment.apiUrl}/conges/${id}/avis-interim`, {
      accord,
      commentaire: commentaire || '',
      interimaireNom: interimaireNom || ''
    });
  }

  // ── ÉTAPE 3 : VISA HIÉRARCHIQUE N+1 ──
  visaN1(id: number | string, accord: boolean, commentaire?: string, validePar?: string): Observable<Conge> {
    return this.http.put<Conge>(`${environment.apiUrl}/conges/${id}/visa-n1`, {
      accord,
      commentaire: commentaire || '',
      validePar: validePar || 'Directeur N+1'
    });
  }

  // ── ÉTAPE 4 : CONTRÔLE ET DÉLIVRANCE TITRE DE CONGÉ DRH ──
  validationDrh(id: number | string, accord: boolean, motifRefus?: string, validePar?: string): Observable<Conge> {
    return this.http.put<Conge>(`${environment.apiUrl}/conges/${id}/validation-drh`, {
      accord,
      motifRefus: motifRefus || '',
      validePar: validePar || undefined
    });
  }

  // ── ÉTAPE 5 : ACTION SÉCURITÉ SI (BCEAO) ──
  securiteSi(id: number | string, statutSi: string, operateurSi?: string): Observable<Conge> {
    return this.http.put<Conge>(`${environment.apiUrl}/conges/${id}/securite-si`, {
      statutSi,
      operateurSi: operateurSi || undefined
    });
  }

  // ── VÉRIFICATION QUORUM DIRECTION (RÈGLE MAX 30% ABSENTS) ──
  getQuorumDirection(directionId: number | string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/conges/quorum/${directionId}`);
  }

  // Méthodes directes (compatibilité)
  approuver(id: number | string, validePar?: string): Observable<Conge> {
    return this.validationDrh(id, true, undefined, validePar);
  }

  rejeter(id: number | string, motifRefus: string, rejetePar?: string): Observable<Conge> {
    return this.validationDrh(id, false, motifRefus, rejetePar);
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

  createType(type: TypeAbsenceConge): Observable<TypeAbsenceConge> {
    return this.http.post<TypeAbsenceConge>(`${environment.apiUrl}/typeabsenceconge/create`, type);
  }

  updateType(id: number, type: TypeAbsenceConge): Observable<TypeAbsenceConge> {
    return this.http.put<TypeAbsenceConge>(`${environment.apiUrl}/typeabsenceconge/${id}`, type);
  }

  deleteType(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/typeabsenceconge/${id}`, { responseType: 'text' as 'json' });
  }

  batchUpdateTypes(types: TypeAbsenceConge[]): Observable<TypeAbsenceConge[]> {
    return this.http.put<TypeAbsenceConge[]>(`${environment.apiUrl}/typeabsenceconge/batch`, types);
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
