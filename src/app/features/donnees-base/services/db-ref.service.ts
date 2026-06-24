import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface RefItem {
  id?: string;
  code: string;
  libelle: string;
  description: string;
  actif: boolean;
}

const INITIAL_MOCK: Record<string, RefItem[]> = {
  'emploi': [
    { code: 'EMP-001', libelle: 'Directeur Général',           description: 'Direction générale de l\'entreprise',    actif: true  },
    { code: 'EMP-002', libelle: 'Directeur RH',                description: 'Responsable ressources humaines',        actif: true  },
    { code: 'EMP-003', libelle: 'Directeur Financier',         description: 'Gestion financière et comptable',        actif: true  },
    { code: 'EMP-004', libelle: 'Ingénieur Informatique',      description: 'Développement et infrastructure IT',      actif: true  },
    { code: 'EMP-005', libelle: 'Chargé de Communication',     description: 'Communication interne et externe',       actif: false },
  ],
  'fonction': [
    { code: 'FCT-001', libelle: 'Management',    description: 'Encadrement et pilotage des équipes',   actif: true  },
    { code: 'FCT-002', libelle: 'Finance',       description: 'Gestion financière et comptabilité',    actif: true  },
    { code: 'FCT-003', libelle: 'Informatique',  description: 'Systèmes d\'information et réseaux',    actif: true  },
    { code: 'FCT-004', libelle: 'Commercial',    description: 'Vente et relation client',              actif: true  },
    { code: 'FCT-005', libelle: 'Juridique',     description: 'Conseil juridique et conformité',       actif: false },
  ],
  'departement': [
    { code: 'DEP-001', libelle: 'Ressources Humaines', description: 'Gestion du personnel',               actif: true  },
    { code: 'DEP-002', libelle: 'Finance',              description: 'Comptabilité et finances',           actif: true  },
    { code: 'DEP-003', libelle: 'Informatique',         description: 'Systèmes d\'information',           actif: true  },
    { code: 'DEP-004', libelle: 'Marketing',            description: 'Communication et marketing',        actif: true  },
    { code: 'DEP-005', libelle: 'Logistique',           description: 'Gestion des flux et stocks',        actif: true  },
  ],
  'direction': [
    { code: 'DIR-001', libelle: 'Direction Générale',    description: 'Gouvernance de l\'entreprise',      actif: true  },
    { code: 'DIR-002', libelle: 'Direction RH',          description: 'Pilotage RH et social',             actif: true  },
    { code: 'DIR-003', libelle: 'Direction Financière',  description: 'Pilotage financier',                actif: true  },
    { code: 'DIR-004', libelle: 'Direction Commerciale', description: 'Développement commercial',          actif: true  },
    { code: 'DIR-005', libelle: 'Direction Technique',   description: 'Innovation et technique',           actif: false },
  ],
  'service': [
    { code: 'SRV-001', libelle: 'Service Paie',          description: 'Traitement de la paie',             actif: true  },
    { code: 'SRV-002', libelle: 'Service Comptabilité',  description: 'Comptabilité générale',             actif: true  },
    { code: 'SRV-003', libelle: 'Service Informatique',  description: 'Support et développement IT',       actif: true  },
    { code: 'SRV-004', libelle: 'Service Juridique',     description: 'Conseils juridiques',               actif: true  },
    { code: 'SRV-005', libelle: 'Service Formation',     description: 'Plan de développement RH',          actif: true  },
  ],
  'grille-salariale': [
    { code: 'GRL-A',  libelle: 'Grille A — Cadres',       description: 'Personnel cadre direction',         actif: true  },
    { code: 'GRL-B',  libelle: 'Grille B — Maîtrise',     description: 'Personnel d\'encadrement',          actif: true  },
    { code: 'GRL-C',  libelle: 'Grille C — Exécution',    description: 'Personnel d\'exécution',            actif: true  },
    { code: 'GRL-D',  libelle: 'Grille D — Stagiaire',    description: 'Stagiaires et apprentis',           actif: true  },
    { code: 'GRL-E',  libelle: 'Grille E — Temporaire',   description: 'Personnel temporaire',              actif: false },
  ],
  'agence': [
    { code: 'AGN-001', libelle: 'Agence Centrale',   description: 'Siège social — Ouagadougou',             actif: true  },
    { code: 'AGN-002', libelle: 'Agence Nord',        description: 'Zone nord du pays',                     actif: true  },
    { code: 'AGN-003', libelle: 'Agence Sud',         description: 'Zone sud du pays',                      actif: true  },
    { code: 'AGN-004', libelle: 'Agence Est',         description: 'Zone est du pays',                      actif: true  },
    { code: 'AGN-005', libelle: 'Agence Ouest',       description: 'Zone ouest du pays',                    actif: false },
  ],
  'type-indemnite': [
    { code: 'IND-001', libelle: 'Indemnité de transport',       description: 'Prise en charge transport',    actif: true  },
    { code: 'IND-002', libelle: 'Indemnité de logement',        description: 'Allocation logement',          actif: true  },
    { code: 'IND-003', libelle: 'Indemnité de responsabilité',  description: 'Prime de responsabilité',      actif: true  },
    { code: 'IND-004', libelle: 'Indemnité de mission',         description: 'Frais de déplacement',         actif: true  },
    { code: 'IND-005', libelle: 'Indemnité de représentation',  description: 'Frais de représentation',      actif: false },
  ],
  'type-contrat': [
    { code: 'CTR-001', libelle: 'CDI',      description: 'Contrat à Durée Indéterminée',                     actif: true  },
    { code: 'CTR-002', libelle: 'CDD',      description: 'Contrat à Durée Déterminée',                       actif: true  },
    { code: 'CTR-003', libelle: 'Stage',    description: 'Convention de stage',                               actif: true  },
    { code: 'CTR-004', libelle: 'Intérim',  description: 'Mission d\'intérim',                               actif: true  },
    { code: 'CTR-005', libelle: 'Freelance',description: 'Prestation de service indépendant',                actif: false },
  ],
  'type-conge': [
    { code: 'CNG-001', libelle: 'Congé annuel',           description: 'Congé payé annuel',                  actif: true  },
    { code: 'CNG-002', libelle: 'Congé maladie',          description: 'Arrêt maladie',                      actif: true  },
    { code: 'CNG-003', libelle: 'Congé maternité',        description: 'Congé de maternité',                 actif: true  },
    { code: 'CNG-004', libelle: 'Congé paternité',        description: 'Congé de paternité',                 actif: true  },
    { code: 'CNG-005', libelle: 'Absence justifiée',      description: 'Absence avec justificatif',          actif: true  },
    { code: 'CNG-006', libelle: 'Absence injustifiée',    description: 'Absence sans justificatif',          actif: true  },
    { code: 'CNG-007', libelle: 'Congé sans solde',       description: 'Congé non rémunéré',                 actif: true  },
  ],
  'categorie': [
    { code: 'CAT-001', libelle: 'Cadre Supérieur',    description: 'Niveau hiérarchique supérieur',           actif: true  },
    { code: 'CAT-002', libelle: 'Cadre',              description: 'Personnel cadre',                         actif: true  },
    { code: 'CAT-003', libelle: 'Agent de Maîtrise',  description: 'Technicien ou agent de maîtrise',        actif: true  },
    { code: 'CAT-004', libelle: 'Employé',            description: 'Personnel d\'exécution',                 actif: true  },
    { code: 'CAT-005', libelle: 'Ouvrier',            description: 'Personnel ouvrier',                      actif: false },
  ],
  'grade': [
    { code: 'GRD-001', libelle: 'Hors Classe',  description: 'Grade le plus élevé',                          actif: true  },
    { code: 'GRD-002', libelle: 'Grade I',      description: 'Premier grade',                                actif: true  },
    { code: 'GRD-003', libelle: 'Grade II',     description: 'Deuxième grade',                               actif: true  },
    { code: 'GRD-004', libelle: 'Grade III',    description: 'Troisième grade',                              actif: true  },
    { code: 'GRD-005', libelle: 'Grade IV',     description: 'Quatrième grade',                              actif: true  },
  ],
  'echelon': [
    { code: 'ECH-01', libelle: 'Échelon 1',  description: 'Niveau débutant',                                 actif: true  },
    { code: 'ECH-02', libelle: 'Échelon 2',  description: 'Niveau junior',                                   actif: true  },
    { code: 'ECH-03', libelle: 'Échelon 3',  description: 'Niveau confirmed',                                 actif: true  },
    { code: 'ECH-04', libelle: 'Échelon 4',  description: 'Niveau senior',                                   actif: true  },
    { code: 'ECH-05', libelle: 'Échelon 5',  description: 'Niveau expert',                                   actif: true  },
  ],
  'competences': [
    { code: 'CMP-001', libelle: 'Leadership',           description: 'Capacité à diriger et motiver',         actif: true  },
    { code: 'CMP-002', libelle: 'Gestion de projet',    description: 'Planification et exécution de projets', actif: true  },
    { code: 'CMP-003', libelle: 'Communication',        description: 'Expression orale et écrite',            actif: true  },
    { code: 'CMP-004', libelle: 'Analyse de données',   description: 'Traitement et interprétation de données',actif: true  },
    { code: 'CMP-005', libelle: 'Service client',       description: 'Relation et satisfaction client',       actif: true  },
  ],
  'type-formation': [
    { code: 'FRM-001', libelle: 'Formation initiale',   description: 'Formation à l\'embauche',               actif: true  },
    { code: 'FRM-002', libelle: 'Formation continue',   description: 'Perfectionnement professionnel',        actif: true  },
    { code: 'FRM-003', libelle: 'E-learning',           description: 'Formation en ligne',                    actif: true  },
    { code: 'FRM-004', libelle: 'Séminaire',            description: 'Formation en présentiel',               actif: true  },
    { code: 'FRM-005', libelle: 'Coaching',             description: 'Accompagnement individuel',             actif: false },
  ],
  'type-evaluation': [
    { code: 'EVL-001', libelle: 'Entretien annuel',     description: 'Évaluation annuelle de performance',    actif: true  },
    { code: 'EVL-002', libelle: 'Entretien semestriel', description: 'Évaluation à mi-parcours',              actif: true  },
    { code: 'EVL-003', libelle: 'Évaluation période essai', description: 'Évaluation fin de période d\'essai',actif: true  },
    { code: 'EVL-004', libelle: '360°',                 description: 'Évaluation multi-sources',              actif: false },
  ],
  'rubrique': [
    { code: 'RUB-001', libelle: 'Salaire de base',      description: 'Rémunération de base brute',            actif: true  },
    { code: 'RUB-002', libelle: 'Heures supplémentaires',description: 'Majoration heures hors contrat',       actif: true  },
    { code: 'RUB-003', libelle: 'Prime de rendement',   description: 'Prime liée à la performance',           actif: true  },
    { code: 'RUB-004', libelle: 'Retenue CNSS',         description: 'Cotisation sociale employé',            actif: true  },
    { code: 'RUB-005', libelle: 'IUTS',                 description: 'Impôt unique sur les traitements',      actif: true  },
  ],
  'cotisation': [
    { code: 'COT-001', libelle: 'CNSS Employé',     description: 'Part salariale CNSS',                       actif: true  },
    { code: 'COT-002', libelle: 'CNSS Patronal',    description: 'Part patronale CNSS',                       actif: true  },
    { code: 'COT-003', libelle: 'CARFO',            description: 'Caisse autonome retraite fonctionnaire',    actif: true  },
    { code: 'COT-004', libelle: 'AT/MP',            description: 'Accident du travail / Maladie professionnelle', actif: true },
  ],
  'bareme': [
    { code: 'BAR-001', libelle: 'Tranche 1 — 0 %',   description: '0 à 30 000 FCFA',                          actif: true  },
    { code: 'BAR-002', libelle: 'Tranche 2 — 12 %',  description: '30 001 à 60 000 FCFA',                     actif: true  },
    { code: 'BAR-003', libelle: 'Tranche 3 — 22 %',  description: '60 001 à 150 000 FCFA',                    actif: true  },
    { code: 'BAR-004', libelle: 'Tranche 4 — 30 %',  description: 'Plus de 150 000 FCFA',                     actif: true  },
  ],
  'mode-paiement': [
    { code: 'MPY-001', libelle: 'Virement bancaire', description: 'Virement vers compte bancaire',             actif: true  },
    { code: 'MPY-002', libelle: 'Mobile Money',      description: 'Paiement par mobile money',                 actif: true  },
    { code: 'MPY-003', libelle: 'Espèces',           description: 'Paiement en espèces',                      actif: false },
    { code: 'MPY-004', libelle: 'Chèque',            description: 'Paiement par chèque bancaire',             actif: false },
  ],
  'calendrier-paie': [
    { code: 'CAL-001', libelle: 'Calendrier mensuel', description: 'Paie le 25 de chaque mois',               actif: true  },
    { code: 'CAL-002', libelle: 'Calendrier bimensuel',description: 'Paie le 15 et le 30',                    actif: false },
  ]
};

@Injectable({
  providedIn: 'root'
})
export class DbRefService {
  private cache: Record<string, BehaviorSubject<RefItem[]>> = {};

  constructor(private http: HttpClient) {}

  private getSubject(type: string): BehaviorSubject<RefItem[]> {
    if (!this.cache[type]) {
      this.cache[type] = new BehaviorSubject<RefItem[]>([]);
    }
    return this.cache[type];
  }

  getItems(type: string): Observable<RefItem[]> {
    if (type === 'emploi' || type === 'fonction') {
      const urlSegment = type === 'emploi' ? 'emplois' : 'fonctions';
      return this.http.get<any[]>(`${environment.apiUrl}/${urlSegment}/all`).pipe(
        map(dtos => dtos.map(dto => ({
          id: dto.id,
          code: dto.code,
          libelle: dto.name,
          description: '',
          actif: true
        }))),
        tap(items => {
          this.getSubject(type).next(items);
        })
      );
    }

    return this.http.get<any[]>(`${environment.apiUrl}/ref-data/${type}/all`).pipe(
      map(dtos => dtos.map(dto => ({
        id: dto.id,
        code: dto.code,
        libelle: dto.libelle,
        description: dto.description || '',
        actif: dto.actif
      }))),
      tap(items => {
        this.getSubject(type).next(items);
      })
    );
  }

  addItem(type: string, item: RefItem): Observable<RefItem[]> {
    if (type === 'emploi' || type === 'fonction') {
      const urlSegment = type === 'emploi' ? 'emplois' : 'fonctions';
      const body = {
        code: item.code,
        name: item.libelle
      };
      return this.http.post<any>(`${environment.apiUrl}/${urlSegment}/create`, body).pipe(
        map(dto => ({
          id: dto.id,
          code: dto.code,
          libelle: dto.name,
          description: '',
          actif: true
        })),
        map(newItem => {
          const subject = this.getSubject(type);
          const newList = [...subject.value, newItem];
          subject.next(newList);
          return newList;
        })
      );
    }

    const body = {
      code: item.code,
      libelle: item.libelle,
      description: item.description,
      actif: item.actif
    };

    return this.http.post<any>(`${environment.apiUrl}/ref-data/${type}/create`, body).pipe(
      map(dto => ({
        id: dto.id,
        code: dto.code,
        libelle: dto.libelle,
        description: dto.description || '',
        actif: dto.actif
      })),
      map(newItem => {
        const subject = this.getSubject(type);
        const newList = [...subject.value, newItem];
        subject.next(newList);
        return newList;
      })
    );
  }

  updateItem(type: string, originalCode: string, updatedItem: RefItem): Observable<RefItem[]> {
    if (type === 'emploi' || type === 'fonction') {
      const urlSegment = type === 'emploi' ? 'emplois' : 'fonctions';
      const id = updatedItem.id;
      if (!id) {
        return of(this.getSubject(type).value);
      }
      const body = {
        id: id,
        code: updatedItem.code,
        name: updatedItem.libelle
      };
      return this.http.put<any>(`${environment.apiUrl}/${urlSegment}/${id}`, body).pipe(
        map(dto => ({
          id: dto.id,
          code: dto.code,
          libelle: dto.name,
          description: '',
          actif: true
        })),
        map(newItem => {
          const subject = this.getSubject(type);
          const newList = subject.value.map(item => item.id === id ? newItem : item);
          subject.next(newList);
          return newList;
        })
      );
    }

    const id = updatedItem.id;
    if (!id) {
      return of(this.getSubject(type).value);
    }

    const body = {
      id: id,
      code: updatedItem.code,
      libelle: updatedItem.libelle,
      description: updatedItem.description,
      actif: updatedItem.actif
    };

    return this.http.put<any>(`${environment.apiUrl}/ref-data/${type}/${id}`, body).pipe(
      map(dto => ({
        id: dto.id,
        code: dto.code,
        libelle: dto.libelle,
        description: dto.description || '',
        actif: dto.actif
      })),
      map(newItem => {
        const subject = this.getSubject(type);
        const newList = subject.value.map(item => item.id === id ? newItem : item);
        subject.next(newList);
        return newList;
      })
    );
  }

  deleteItem(type: string, code: string): Observable<RefItem[]> {
    if (type === 'emploi' || type === 'fonction') {
      const subject = this.getSubject(type);
      const item = subject.value.find(i => i.code === code);
      if (!item || !item.id) return of(subject.value);
      const urlSegment = type === 'emploi' ? 'emplois' : 'fonctions';
      return this.http.delete<void>(`${environment.apiUrl}/${urlSegment}/${item.id}`).pipe(
        map(() => {
          const newList = subject.value.filter(i => i.code !== code);
          subject.next(newList);
          return newList;
        })
      );
    }

    const subject = this.getSubject(type);
    const item = subject.value.find(i => i.code === code);
    if (!item || !item.id) return of(subject.value);

    return this.http.delete<void>(`${environment.apiUrl}/ref-data/${type}/${item.id}`).pipe(
      map(() => {
        const newList = subject.value.filter(i => i.code !== code);
        subject.next(newList);
        return newList;
      })
    );
  }

  toggleItemStatus(type: string, code: string): Observable<RefItem[]> {
    const subject = this.getSubject(type);
    const item = subject.value.find(i => i.code === code);
    if (!item) return of(subject.value);

    if (type === 'emploi' || type === 'fonction') {
      // Emploi & Fonction do not support active status toggling in their schema/backend
      const newList = subject.value.map(i => i.code === code ? { ...i, actif: !i.actif } : i);
      subject.next(newList);
      return of(newList);
    }

    const updatedItem: RefItem = {
      ...item,
      actif: !item.actif
    };

    return this.updateItem(type, code, updatedItem);
  }
}
