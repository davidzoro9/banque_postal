import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface RefItem {
  id?: string;
  code: string;
  libelle: string;
  description: string;
  actif: boolean;
  montant?: number;
  departementId?: string;   // utilisé par Direction et Service
  directionId?:   string;   // utilisé par Service
  echelle?:       string;   // utilisé par Grille salariale
  echellon?:      string;   // utilisé par Grille salariale
  typeIndemnite?: string;   // pour Paramétrage indemnité
  fonction?:      string;   // pour Paramétrage indemnité
  grade?:         string;   // pour Paramétrage indemnité
  categorie?:     string;   // pour Paramétrage indemnité
  taux?:          number;   // pour Paramétrage indemnité
}

// ─── Mapping frontend type → backend segment ───────────────────────────────
const BACKEND_MAP: Record<string, {
  segment: string;
  getAllPath: string;
  toFront: (dto: any) => RefItem;
  toBack: (item: RefItem) => any;
  toBackUpdate: (item: RefItem) => any;
}> = {
  'emploi': {
    segment: 'emplois',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle }),
  },
  'direction': {
    segment: 'directions',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: dto.description || '', actif: true,
                       departementId: dto.departmentId ? String(dto.departmentId) : undefined }),
    toBack:  item => ({ code: item.code, name: item.libelle, description: item.description,
                        departmentId: item.departementId ? Number(item.departementId) : null }),
    toBackUpdate: item => ({ id: Number(item.id), code: item.code, name: item.libelle, description: item.description,
                             departmentId: item.departementId ? Number(item.departementId) : null }),
  },
  'service': {
    segment: 'services',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: dto.description || '', actif: true,
                       directionId:   dto.directionId   ? String(dto.directionId)   : undefined,
                       departementId: dto.departmentId  ? String(dto.departmentId)  : undefined }),
    toBack:  item => ({ code: item.code, name: item.libelle, description: item.description,
                        directionId:  item.directionId   ? Number(item.directionId)   : null,
                        departmentId: item.departementId ? Number(item.departementId) : null }),
    toBackUpdate: item => ({ id: Number(item.id), code: item.code, name: item.libelle, description: item.description,
                             directionId:  item.directionId   ? Number(item.directionId)   : null,
                             departmentId: item.departementId ? Number(item.departementId) : null }),
  },
  'profil': {
    segment: 'ref-data/profil',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'ville': {
    segment: 'ref-data/ville',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'fonction': {
    segment: 'fonctions',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle }),
  },
  'type-contrat': {
    segment: 'typecontrat',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle }),
  },
  'type-indemnite': {
    segment: 'typeindemnite',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle }),
  },
  'param-indemnite': {
    segment: 'paramindemnite',
    getAllPath: '',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.code || `PI-${dto.id}`,
      libelle: dto.typeIndemnite || dto.name || 'Indemnité',
      description: `Fonction: ${dto.fonction || '-'}, Grade: ${dto.grade || '-'}, Cat: ${dto.categorie || '-'}`,
      actif: dto.actif ?? true,
      montant: dto.taux || dto.montant || 0,
      typeIndemnite: dto.typeIndemnite || dto.name || '',
      fonction: dto.fonction || '',
      grade: dto.grade || '',
      categorie: dto.categorie || '',
      taux: dto.taux || dto.montant || 0
    }),
    toBack: item => ({
      code: item.code,
      typeIndemnite: item.typeIndemnite || item.libelle,
      fonction: item.fonction,
      grade: item.grade,
      categorie: item.categorie,
      taux: item.taux || item.montant || 0,
      actif: item.actif
    }),
    toBackUpdate: item => ({
      id: item.id,
      code: item.code,
      typeIndemnite: item.typeIndemnite || item.libelle,
      fonction: item.fonction,
      grade: item.grade,
      categorie: item.categorie,
      taux: item.taux || item.montant || 0,
      actif: item.actif
    }),
  },
  'type-conge': {
    segment: 'typeabsenceconge',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle }),
  },
  'grille-salariale': {
    segment: 'grillesalariale',
    getAllPath: '',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.classe || '',
      libelle: dto.category || '',
      description: `${dto.echelle || ''} - ${dto.echellon || ''}`.trim(),
      actif: true,
      montant: dto.basicSalary || 0,
      echelle: dto.echelle || '',
      echellon: dto.echellon || ''
    }),
    toBack:  item => ({
      classe: item.code,
      category: item.libelle,
      basicSalary: item.montant || 0,
      echelle: item.echelle || '',
      echellon: item.echellon || ''
    }),
    toBackUpdate: item => ({
      id: Number(item.id),
      classe: item.code,
      category: item.libelle,
      basicSalary: item.montant || 0,
      echelle: item.echelle || '',
      echellon: item.echellon || ''
    }),
  },
  'departement': {
    segment: 'departments',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: dto.directeur || '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle, directeur: item.description }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle, directeur: item.description }),
  },
  'type-retenue-employe': {
    segment: 'ref-data/retenue-employe',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'type-retenue-emploi': {
    segment: 'ref-data/retenue-emploi',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
};

// ─── Données mock pour les types sans backend ────────────────────────────────
const MOCK_DATA: Record<string, RefItem[]> = {
  'agence': [
    { code: 'AGN-001', libelle: 'Agence Centrale',   description: 'Siège social — Ouagadougou', actif: true  },
    { code: 'AGN-002', libelle: 'Agence Nord',        description: 'Zone nord du pays',          actif: true  },
    { code: 'AGN-003', libelle: 'Agence Sud',         description: 'Zone sud du pays',           actif: true  },
    { code: 'AGN-004', libelle: 'Agence Est',         description: 'Zone est du pays',           actif: true  },
    { code: 'AGN-005', libelle: 'Agence Ouest',       description: 'Zone ouest du pays',         actif: false },
  ],
  'direction': [
    { code: 'DIR-001', libelle: 'Direction Générale',      description: 'Direction principale',             actif: true  },
    { code: 'DIR-002', libelle: 'Direction Administrative', description: 'Administration et ressources',     actif: true  },
    { code: 'DIR-003', libelle: 'Direction Financière',     description: 'Finances et comptabilité',         actif: true  },
    { code: 'DIR-004', libelle: 'Direction Technique',      description: 'Services techniques',              actif: true  },
    { code: 'DIR-005', libelle: 'Direction Commerciale',    description: 'Ventes et marketing',              actif: false },
  ],
  'service': [
    { code: 'SRV-001', libelle: 'Service Informatique',     description: 'Systèmes d\'information',          actif: true  },
    { code: 'SRV-002', libelle: 'Service RH',               description: 'Ressources humaines',              actif: true  },
    { code: 'SRV-003', libelle: 'Service Comptabilité',     description: 'Comptabilité et finances',         actif: true  },
    { code: 'SRV-004', libelle: 'Service Logistique',       description: 'Approvisionnement et logistique',  actif: true  },
    { code: 'SRV-005', libelle: 'Service Juridique',        description: 'Affaires juridiques',              actif: false },
  ],
  'param-indemnite': [
    { id: '1', code: 'PI-001', libelle: 'Indemnité de Logement', description: 'Dir. Général - Grade I', actif: true, typeIndemnite: 'Indemnité de Logement', fonction: 'Directeur Général', grade: 'Grade I', categorie: 'Catégorie IX', montant: 150000, taux: 150000 },
    { id: '2', code: 'PI-002', libelle: 'Indemnité de Transport', description: 'Chef de Département - Grade II', actif: true, typeIndemnite: 'Indemnité de Transport', fonction: 'Chef de Département', grade: 'Grade II', categorie: 'Catégorie VII', montant: 50000, taux: 50000 },
    { id: '3', code: 'PI-003', libelle: 'Indemnité de Responsabilité', description: 'Directeur Financier - Grade I', actif: true, typeIndemnite: 'Indemnité de Responsabilité', fonction: 'Directeur Financier', grade: 'Grade I', categorie: 'Catégorie VIII', montant: 100000, taux: 100000 }
  ],
  'categorie': [
    { code: 'CAT-001', libelle: 'Cadre Supérieur',   description: 'Niveau hiérarchique supérieur', actif: true  },
    { code: 'CAT-002', libelle: 'Cadre',              description: 'Personnel cadre',              actif: true  },
    { code: 'CAT-003', libelle: 'Agent de Maîtrise',  description: 'Technicien ou agent',         actif: true  },
    { code: 'CAT-004', libelle: 'Employé',            description: 'Personnel d\'exécution',      actif: true  },
    { code: 'CAT-005', libelle: 'Ouvrier',            description: 'Personnel ouvrier',           actif: false },
  ],
  'grade': [
    { code: 'GRD-001', libelle: 'Hors Classe', description: 'Grade le plus élevé', actif: true  },
    { code: 'GRD-002', libelle: 'Grade I',     description: 'Premier grade',       actif: true  },
    { code: 'GRD-003', libelle: 'Grade II',    description: 'Deuxième grade',      actif: true  },
    { code: 'GRD-004', libelle: 'Grade III',   description: 'Troisième grade',     actif: true  },
    { code: 'GRD-005', libelle: 'Grade IV',    description: 'Quatrième grade',     actif: true  },
  ],
  'echelon': [
    { code: 'ECH-01', libelle: 'Échelon 1', description: 'Niveau débutant',   actif: true },
    { code: 'ECH-02', libelle: 'Échelon 2', description: 'Niveau junior',     actif: true },
    { code: 'ECH-03', libelle: 'Échelon 3', description: 'Niveau confirmé',   actif: true },
    { code: 'ECH-04', libelle: 'Échelon 4', description: 'Niveau senior',     actif: true },
    { code: 'ECH-05', libelle: 'Échelon 5', description: 'Niveau expert',     actif: true },
  ],
  'competences': [
    { code: 'CMP-001', libelle: 'Leadership',        description: 'Capacité à diriger',         actif: true },
    { code: 'CMP-002', libelle: 'Gestion de projet', description: 'Planification de projets',   actif: true },
    { code: 'CMP-003', libelle: 'Communication',     description: 'Expression orale et écrite', actif: true },
    { code: 'CMP-004', libelle: 'Analyse de données',description: 'Traitement de données',      actif: true },
    { code: 'CMP-005', libelle: 'Service client',    description: 'Relation client',            actif: true },
  ],
  'type-formation': [
    { code: 'FRM-001', libelle: 'Formation initiale',  description: 'Formation à l\'embauche',     actif: true  },
    { code: 'FRM-002', libelle: 'Formation continue',  description: 'Perfectionnement',            actif: true  },
    { code: 'FRM-003', libelle: 'E-learning',          description: 'Formation en ligne',          actif: true  },
    { code: 'FRM-004', libelle: 'Séminaire',           description: 'Formation en présentiel',     actif: true  },
    { code: 'FRM-005', libelle: 'Coaching',            description: 'Accompagnement individuel',   actif: false },
  ],
  'type-evaluation': [
    { code: 'EVL-001', libelle: 'Entretien annuel',        description: 'Évaluation annuelle',          actif: true  },
    { code: 'EVL-002', libelle: 'Entretien semestriel',    description: 'Évaluation à mi-parcours',     actif: true  },
    { code: 'EVL-003', libelle: 'Évaluation période essai',description: 'Fin de période d\'essai',      actif: true  },
    { code: 'EVL-004', libelle: '360°',                    description: 'Évaluation multi-sources',     actif: false },
  ],
  'rubrique': [
    { code: 'RUB-001', libelle: 'Salaire de base',        description: 'Rémunération brute',           actif: true },
    { code: 'RUB-002', libelle: 'Heures supplémentaires', description: 'Majoration heures hors contrat',actif: true },
    { code: 'RUB-003', libelle: 'Prime de rendement',     description: 'Prime de performance',         actif: true },
    { code: 'RUB-004', libelle: 'Retenue CNSS',           description: 'Cotisation sociale employé',   actif: true },
    { code: 'RUB-005', libelle: 'IUTS',                   description: 'Impôt unique traitements',     actif: true },
  ],
  'cotisation': [
    { code: 'COT-001', libelle: 'CNSS Employé',  description: 'Part salariale CNSS',    actif: true },
    { code: 'COT-002', libelle: 'CNSS Patronal', description: 'Part patronale CNSS',    actif: true },
    { code: 'COT-003', libelle: 'CARFO',         description: 'Caisse autonome retraite',actif: true },
    { code: 'COT-004', libelle: 'AT/MP',         description: 'Accident travail/Maladie',actif: true },
  ],
  'bareme': [
    { code: 'BAR-001', libelle: 'Tranche 1 — 0 %',  description: '0 à 30 000 FCFA',       actif: true },
    { code: 'BAR-002', libelle: 'Tranche 2 — 12 %', description: '30 001 à 60 000 FCFA',  actif: true },
    { code: 'BAR-003', libelle: 'Tranche 3 — 22 %', description: '60 001 à 150 000 FCFA', actif: true },
    { code: 'BAR-004', libelle: 'Tranche 4 — 30 %', description: 'Plus de 150 000 FCFA',  actif: true },
  ],
  'mode-paiement': [
    { code: 'MPY-001', libelle: 'Virement bancaire', description: 'Virement vers compte bancaire', actif: true  },
    { code: 'MPY-002', libelle: 'Mobile Money',      description: 'Paiement par mobile money',     actif: true  },
    { code: 'MPY-003', libelle: 'Espèces',           description: 'Paiement en espèces',           actif: false },
    { code: 'MPY-004', libelle: 'Chèque',            description: 'Paiement par chèque',           actif: false },
  ],
  'calendrier-paie': [
    { code: 'CAL-001', libelle: 'Calendrier mensuel',   description: 'Paie le 25 de chaque mois', actif: true  },
    { code: 'CAL-002', libelle: 'Calendrier bimensuel', description: 'Paie le 15 et le 30',        actif: false },
  ],
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

  // ─── Vérifie si ce type a un backend réel ─────────────────────────────────
  private hasBackend(type: string): boolean {
    return !!BACKEND_MAP[type];
  }

  // ─── Charge depuis mock localStorage ──────────────────────────────────────
  private getMockItems(type: string): RefItem[] {
    const stored = localStorage.getItem(`ref_${type}`);
    if (stored) return JSON.parse(stored);
    const initial = MOCK_DATA[type] ?? [];
    localStorage.setItem(`ref_${type}`, JSON.stringify(initial));
    return initial;
  }

  private saveMockItems(type: string, items: RefItem[]): void {
    localStorage.setItem(`ref_${type}`, JSON.stringify(items));
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  getItems(type: string): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];

    if (mapping) {
      const url = `${environment.apiUrl}/${mapping.segment}${mapping.getAllPath}`;
      return this.http.get<any[]>(url).pipe(
        map(dtos => dtos.map(dto => mapping.toFront(dto))),
        tap(items => this.getSubject(type).next(items)),
        catchError(err => {
          console.warn(`[DbRefService] Backend error for "${type}", using mock:`, err.message);
          const items = this.getMockItems(type);
          this.getSubject(type).next(items);
          return of(items);
        })
      );
    }

    // Type sans backend : utiliser mock persistant
    const items = this.getMockItems(type);
    this.getSubject(type).next(items);
    return of(items);
  }

  // ─── ADD ───────────────────────────────────────────────────────────────────
  addItem(type: string, item: RefItem): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];

    if (mapping) {
      const body = mapping.toBack(item);
      return this.http.post<any>(`${environment.apiUrl}/${mapping.segment}/create`, body).pipe(
        map(dto => mapping.toFront(dto)),
        map(newItem => {
          const subject = this.getSubject(type);
          const newList = [...subject.value.filter(i => i.code !== newItem.code), newItem];
          subject.next(newList);
          this.saveMockItems(type, newList);
          return newList;
        }),
        catchError(err => {
          console.warn(`[DbRefService] Backend post error for ${type}, updating local state:`, err);
          const subject = this.getSubject(type);
          const newItem: RefItem = { ...item, id: Date.now().toString() };
          const newList = [...subject.value.filter(i => i.code !== newItem.code), newItem];
          subject.next(newList);
          this.saveMockItems(type, newList);
          return of(newList);
        })
      );
    }

    // Mock
    const subject = this.getSubject(type);
    const newItem: RefItem = { ...item, id: Date.now().toString() };
    const newList = [...subject.value.filter(i => i.code !== newItem.code), newItem];
    subject.next(newList);
    this.saveMockItems(type, newList);
    return of(newList);
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  updateItem(type: string, originalCode: string, updatedItem: RefItem): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];
    const id = updatedItem.id;

    if (mapping && id) {
      const body = mapping.toBackUpdate(updatedItem);
      return this.http.put<any>(`${environment.apiUrl}/${mapping.segment}/${id}`, body).pipe(
        map(dto => mapping.toFront(dto)),
        map(updated => {
          const subject = this.getSubject(type);
          const newList = subject.value.map(i => (i.id === id || i.code === originalCode) ? updated : i);
          subject.next(newList);
          this.saveMockItems(type, newList);
          return newList;
        }),
        catchError(err => {
          console.warn(`[DbRefService] Backend put error for ${type}, updating local state:`, err);
          const subject = this.getSubject(type);
          const newList = subject.value.map(i => (i.id === id || i.code === originalCode) ? { ...updatedItem } : i);
          subject.next(newList);
          this.saveMockItems(type, newList);
          return of(newList);
        })
      );
    }

    // Mock
    const subject = this.getSubject(type);
    const newList = subject.value.map(i =>
      i.code === originalCode ? { ...updatedItem } : i
    );
    subject.next(newList);
    this.saveMockItems(type, newList);
    return of(newList);
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────
  deleteItem(type: string, code: string): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];
    const subject = this.getSubject(type);
    const item = subject.value.find(i => i.code === code);

    if (mapping && item?.id) {
      return this.http.delete(`${environment.apiUrl}/${mapping.segment}/${item.id}`, { responseType: 'text' }).pipe(
        map(() => {
          const newList = subject.value.filter(i => i.code !== code);
          subject.next(newList);
          this.saveMockItems(type, newList);
          return newList;
        }),
        catchError(err => {
          console.warn(`[DbRefService] Backend delete error for ${type}, updating local state:`, err);
          const newList = subject.value.filter(i => i.code !== code);
          subject.next(newList);
          this.saveMockItems(type, newList);
          return of(newList);
        })
      );
    }

    // Mock
    const newList = subject.value.filter(i => i.code !== code);
    subject.next(newList);
    this.saveMockItems(type, newList);
    return of(newList);
  }

  // ─── TOGGLE STATUS ─────────────────────────────────────────────────────────
  toggleItemStatus(type: string, code: string): Observable<RefItem[]> {
    const subject = this.getSubject(type);
    const item = subject.value.find(i => i.code === code);
    if (!item) return of(subject.value);

    const updatedItem: RefItem = { ...item, actif: !item.actif };

    if (this.hasBackend(type) && item.id) {
      return this.updateItem(type, code, updatedItem);
    }

    // Mock
    const newList = subject.value.map(i => i.code === code ? updatedItem : i);
    subject.next(newList);
    this.saveMockItems(type, newList);
    return of(newList);
  }
}
