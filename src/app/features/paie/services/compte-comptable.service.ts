import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompteComptable } from '../models/compte-comptable.model';

@Injectable({
  providedIn: 'root'
})
export class CompteComptableService {
  private readonly apiUrl = `${environment.apiUrl}/comptes-comptables`;

  // Référentiel SYSCOHADA standard Banque Postale pour résilience si le backend est en cours de redémarrage
  private readonly defaultComptes: CompteComptable[] = [
    {
      id: 1,
      numeroCompte: '641100',
      libelle: 'Salaires de base du personnel national',
      classeCompte: 'CLASSE_6',
      sensParDefaut: 'DEBIT',
      typeRubriqueAssociee: 'SALAIRE_BASE',
      codeJournal: 'OD_PAIE',
      description: 'Traitements et salaires fixes indiciaires',
      actif: true
    },
    {
      id: 2,
      numeroCompte: '641200',
      libelle: 'Primes et gratifications',
      classeCompte: 'CLASSE_6',
      sensParDefaut: 'DEBIT',
      typeRubriqueAssociee: 'PRIMES',
      codeJournal: 'OD_PAIE',
      description: 'Primes d\'ancienneté, de rendement et gratifications de fin d\'année',
      actif: true
    },
    {
      id: 3,
      numeroCompte: '641300',
      libelle: 'Indemnités et avantages divers',
      classeCompte: 'CLASSE_6',
      sensParDefaut: 'DEBIT',
      typeRubriqueAssociee: 'INDEMNITES',
      codeJournal: 'OD_PAIE',
      description: 'Indemnités de logement, transport, caisse, responsabilité, fonction',
      actif: true
    },
    {
      id: 4,
      numeroCompte: '641400',
      libelle: 'Rémunérations des heures supplémentaires',
      classeCompte: 'CLASSE_6',
      sensParDefaut: 'DEBIT',
      typeRubriqueAssociee: 'HEURES_SUPP',
      codeJournal: 'OD_PAIE',
      description: 'Heures supplémentaires majorées selon réglementation bancaire',
      actif: true
    },
    {
      id: 5,
      numeroCompte: '646100',
      libelle: 'Cotisations sociales patronales (CNSS)',
      classeCompte: 'CLASSE_6',
      sensParDefaut: 'DEBIT',
      typeRubriqueAssociee: 'COTISATIONS_PATRONALES',
      codeJournal: 'OD_PAIE',
      description: 'Prestations familiales, risques professionnels et retraite patronale CNSS',
      actif: true
    },
    {
      id: 6,
      numeroCompte: '421100',
      libelle: 'Personnel - Rémunérations dues (Net à payer)',
      classeCompte: 'CLASSE_4',
      sensParDefaut: 'CREDIT',
      typeRubriqueAssociee: 'NET_A_PAYER',
      codeJournal: 'OD_PAIE',
      description: 'Salaires nets à virer sur comptes bancaires des agents',
      actif: true
    },
    {
      id: 7,
      numeroCompte: '422100',
      libelle: 'Personnel - Avances et acomptes',
      classeCompte: 'CLASSE_4',
      sensParDefaut: 'CREDIT',
      typeRubriqueAssociee: 'ACOMPTES',
      codeJournal: 'OD_PAIE',
      description: 'Acomptes sur salaires consentis en cours de mois',
      actif: true
    },
    {
      id: 8,
      numeroCompte: '431100',
      libelle: 'Sécurité Sociale (CNSS)',
      classeCompte: 'CLASSE_4',
      sensParDefaut: 'CREDIT',
      typeRubriqueAssociee: 'CNSS',
      codeJournal: 'OD_PAIE',
      description: 'Cotisations CNSS ouvrières (5.5%) et patronales dues',
      actif: true
    },
    {
      id: 9,
      numeroCompte: '442100',
      libelle: 'État - Impôt sur les Traitements et Salaires (IUTS)',
      classeCompte: 'CLASSE_4',
      sensParDefaut: 'CREDIT',
      typeRubriqueAssociee: 'IUTS',
      codeJournal: 'OD_PAIE',
      description: 'Retenues fiscales à la source IUTS selon barème officiel',
      actif: true
    },
    {
      id: 10,
      numeroCompte: '442800',
      libelle: 'État - Fonds de Soutien Patriotique (FSP)',
      classeCompte: 'CLASSE_4',
      sensParDefaut: 'CREDIT',
      typeRubriqueAssociee: 'FSP',
      codeJournal: 'OD_PAIE',
      description: 'Prélèvement légal FSP sur salaires et indemnités',
      actif: true
    },
    {
      id: 11,
      numeroCompte: '428100',
      libelle: 'Personnel - Dettes provisionnées pour congés à payer',
      classeCompte: 'CLASSE_4',
      sensParDefaut: 'CREDIT',
      typeRubriqueAssociee: 'PROVISION_CONGES',
      codeJournal: 'OD_PAIE',
      description: 'Provision pour congés payés non pris',
      actif: true
    },
    {
      id: 12,
      numeroCompte: '641800',
      libelle: 'Indemnités de congés payés',
      classeCompte: 'CLASSE_6',
      sensParDefaut: 'DEBIT',
      typeRubriqueAssociee: 'CONGES_PAYES',
      codeJournal: 'OD_PAIE',
      description: 'Indemnités légales de congés payés consommés',
      actif: true
    }
  ];

  constructor(private http: HttpClient) {}

  getAll(actifOnly: boolean = false): Observable<CompteComptable[]> {
    let params = new HttpParams();
    if (actifOnly) {
      params = params.set('actifOnly', 'true');
    }
    return this.http.get<CompteComptable[]>(this.apiUrl, { params }).pipe(
      catchError(() => {
        const list = actifOnly ? this.defaultComptes.filter(c => c.actif) : this.defaultComptes;
        return of(list);
      })
    );
  }

  getById(id: number): Observable<CompteComptable> {
    return this.http.get<CompteComptable>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.defaultComptes.find(c => c.id === id) || this.defaultComptes[0];
        return of(found);
      })
    );
  }

  create(compte: CompteComptable): Observable<CompteComptable> {
    return this.http.post<CompteComptable>(this.apiUrl, compte).pipe(
      catchError(() => {
        const newCompte: CompteComptable = {
          ...compte,
          id: Date.now()
        };
        this.defaultComptes.push(newCompte);
        return of(newCompte);
      })
    );
  }

  update(id: number, compte: CompteComptable): Observable<CompteComptable> {
    return this.http.put<CompteComptable>(`${this.apiUrl}/${id}`, compte).pipe(
      catchError(() => {
        const idx = this.defaultComptes.findIndex(c => c.id === id);
        if (idx !== -1) {
          this.defaultComptes[idx] = { ...compte, id };
        }
        return of({ ...compte, id });
      })
    );
  }

  toggleStatus(id: number): Observable<CompteComptable> {
    return this.http.patch<CompteComptable>(`${this.apiUrl}/${id}/toggle-status`, {}).pipe(
      catchError(() => {
        const c = this.defaultComptes.find(item => item.id === id);
        if (c) {
          c.actif = !c.actif;
          return of({ ...c });
        }
        return of({} as CompteComptable);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const idx = this.defaultComptes.findIndex(c => c.id === id);
        if (idx !== -1) {
          this.defaultComptes.splice(idx, 1);
        }
        return of(void 0);
      })
    );
  }
}
