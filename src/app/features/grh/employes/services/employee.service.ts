import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Employee, StatutEmploye } from '../models/employee.model';

const createDefaultEmployee = (partial: Partial<Employee>): Employee => {
  return {
    id: partial.id || `emp-${Date.now()}`,
    matricule: partial.matricule || 'EMP-000',
    nom: partial.nom || '',
    prenom: partial.prenom || '',
    sexe: partial.sexe || 'M',
    dateNaissance: partial.dateNaissance || '1990-01-01',
    lieuNaissance: partial.lieuNaissance || 'Ouagadougou',
    nationalite: partial.nationalite || 'Burkinabè',
    numeroCNI: partial.numeroCNI || 'B0000000',
    adresse: partial.adresse || 'Ouagadougou',
    ville: partial.ville || 'Ouagadougou',
    codePostal: partial.codePostal || '',
    pays: partial.pays || 'Burkina Faso',
    telephone: partial.telephone || '+226 70 00 00 00',
    email: partial.email || 'contact@bpbf.bf',
    contactsUrgence: partial.contactsUrgence || [],
    enfants: partial.enfants || [],
    personnesCharge: partial.personnesCharge || [],
    poste: partial.poste || 'Agent Bancaire',
    service: partial.service || 'Service Opérations',
    direction: partial.direction || 'Direction Générale (DG)',
    departement: partial.departement || 'Direction Générale',
    dateEmbauche: partial.dateEmbauche || '2020-01-01',
    statut: partial.statut || 'Actif',
    typeContrat: partial.typeContrat || 'CDI',
    categoriePro: partial.categoriePro || 'CL1',
    echelon: partial.echelon || 'E01',
    grade: (partial.grade && !partial.grade.toUpperCase().includes('GROUPE') && !partial.grade.toUpperCase().includes('GRADE'))
      ? partial.grade
      : `${partial.categoriePro || 'CL1'}${partial.echelon || 'E01'}`,
    niveau: partial.niveau || 'Niveau 1',
    primeLogement: partial.primeLogement || 0,
    primeTransport: partial.primeTransport || 0,
    primeResponsabilite: partial.primeResponsabilite || 0,
    vehiculeFourni: partial.vehiculeFourni ?? false,
    logementFourni: partial.logementFourni ?? false,
    autresIndemnites: partial.autresIndemnites || [],
    exonerationsFiscales: partial.exonerationsFiscales || [],
    exonerationsSociales: partial.exonerationsSociales || [],
    avantagesParticuliers: partial.avantagesParticuliers || [],
    salaireBase: partial.salaireBase || 150000,
    salaireBrut: partial.salaireBrut || 200000,
    modePaiement: partial.modePaiement || 'Virement bancaire',
    banque: partial.banque || 'Banque Postale du Burkina Faso (BPBF)',
    iban: partial.iban || 'BF01 01001 000000000000 00',
    documents: partial.documents || [],
    observations: partial.observations || '',
    evaluations: partial.evaluations || [],
    historiqueActions: partial.historiqueActions || []
  };
};

const BPBF_INITIAL_EMPLOYEES: Employee[] = [
  createDefaultEmployee({
    id: 'emp-001',
    matricule: 'EMP-001',
    nom: 'SAWADOGO',
    prenom: 'Abdoulaye',
    sexe: 'M',
    dateNaissance: '1975-04-12',
    lieuNaissance: 'Ouagadougou',
    nationalite: 'Burkinabè',
    numeroCNI: 'B12345678',
    adresse: 'Avenue Kwamé Nkrumpah, Zone Commerciale',
    ville: 'Ouagadougou',
    telephone: '+226 70 20 11 22',
    email: 'a.sawadogo@bpbf.bf',
    poste: 'Directeur Général',
    service: 'Direction Générale (DG)',
    direction: 'Direction Générale (DG)',
    departement: 'Direction Générale',
    dateEmbauche: '2018-01-15',
    statut: 'Actif',
    typeContrat: 'CDI',
    categoriePro: 'CLASSE VIII',
    echelon: 'Échelon 5',
    grade: 'CL8E05',
    salaireBase: 710386,
    salaireBrut: 1040386,
    primeLogement: 150000,
    primeTransport: 100000,
    primeResponsabilite: 80000,
    banque: 'Banque Postale du Burkina Faso (BPBF)',
    iban: 'BF01 01001 012345678901 45',
    observations: 'Directeur Général BPBF — Membre du Conseil d\'Administration'
  }),
  createDefaultEmployee({
    id: 'emp-002',
    matricule: 'EMP-002',
    nom: 'ZOROM',
    prenom: 'David Faïcal',
    sexe: 'M',
    dateNaissance: '1985-08-25',
    lieuNaissance: 'Koupéla',
    nationalite: 'Burkinabè',
    numeroCNI: 'B87654321',
    adresse: 'Secteur 28, Bonheur-Ville',
    ville: 'Ouagadougou',
    telephone: '+226 56 21 36 92',
    email: 'd.zorom@bpbf.bf',
    poste: 'Directeur Monétique & SI',
    service: 'Service Monétique & Cash Point',
    direction: 'Direction Monétique & SI (DMSI)',
    departement: 'Direction Monétique & SI',
    dateEmbauche: '2020-03-01',
    statut: 'Actif',
    typeContrat: 'CDI',
    categoriePro: 'CLASSE VII',
    echelon: 'Échelon 4',
    grade: 'CL7E04',
    salaireBase: 631454,
    salaireBrut: 1181454,
    primeLogement: 200000,
    primeTransport: 100000,
    primeResponsabilite: 150000,
    banque: 'Banque Postale du Burkina Faso (BPBF)',
    iban: 'BF01 01001 012345678902 50',
    observations: 'Directeur Monétique & SI — Responsable du déploiement Cash Point'
  }),
  createDefaultEmployee({
    id: 'emp-003',
    matricule: 'EMP-003',
    nom: 'OUEDRAOGO',
    prenom: 'Mariam',
    sexe: 'F',
    dateNaissance: '1988-11-05',
    lieuNaissance: 'Bobo-Dioulasso',
    nationalite: 'Burkinabè',
    numeroCNI: 'B45678912',
    adresse: 'Quartier Somgandé',
    ville: 'Ouagadougou',
    telephone: '+226 76 44 33 22',
    email: 'm.ouedraogo@bpbf.bf',
    poste: 'Responsable Monétique & Cash Point',
    service: 'Service Monétique & Cash Point',
    direction: 'Direction Monétique & SI (DMSI)',
    departement: 'Direction Monétique & SI',
    dateEmbauche: '2021-06-15',
    statut: 'Actif',
    typeContrat: 'CDI',
    categoriePro: 'CLASSE VI',
    echelon: 'Échelon 3',
    grade: 'CL6E03',
    salaireBase: 599438,
    salaireBrut: 974438,
    primeLogement: 150000,
    primeTransport: 75000,
    primeResponsabilite: 100000,
    banque: 'Banque Postale du Burkina Faso (BPBF)',
    iban: 'BF01 01001 012345678903 55',
    observations: 'Gestion et supervision des opérations Cash Point et DAB/GAB'
  }),
  createDefaultEmployee({
    id: 'emp-004',
    matricule: 'EMP-004',
    nom: 'KABORE',
    prenom: 'Yacouba',
    sexe: 'M',
    dateNaissance: '1982-02-18',
    lieuNaissance: 'Koudougou',
    nationalite: 'Burkinabè',
    numeroCNI: 'B98765432',
    adresse: 'Secteur 15, Ouaga 2000',
    ville: 'Ouagadougou',
    telephone: '+226 78 11 22 33',
    email: 'y.kabore@bpbf.bf',
    poste: 'Chef d\'Agence Centrale',
    service: 'Service Opérations de Guichet',
    direction: 'Direction des Opérations Bancaires (DOB)',
    departement: 'Direction des Opérations Bancaires',
    dateEmbauche: '2019-09-01',
    statut: 'Actif',
    typeContrat: 'CDI',
    categoriePro: 'CLASSE IV',
    echelon: 'Échelon 4',
    grade: 'CL4E04',
    salaireBase: 405758,
    salaireBrut: 655758,
    primeLogement: 100000,
    primeTransport: 75000,
    primeResponsabilite: 75000,
    banque: 'Banque Postale du Burkina Faso (BPBF)',
    iban: 'BF01 01001 012345678904 60',
    observations: 'Supervision des opérations de guichet Agence Centrale'
  }),
  createDefaultEmployee({
    id: 'emp-005',
    matricule: 'EMP-005',
    nom: 'TRAORE',
    prenom: 'Aminata',
    sexe: 'F',
    dateNaissance: '1990-07-22',
    lieuNaissance: 'Ouagadougou',
    nationalite: 'Burkinabè',
    numeroCNI: 'B32165498',
    adresse: 'Karpala, Secteur 51',
    ville: 'Ouagadougou',
    telephone: '+226 71 55 44 33',
    email: 'a.traore@bpbf.bf',
    poste: 'Chef de Service Gestion du Personnel & Paie',
    service: 'Service Gestion du Personnel & Paie',
    direction: 'Direction des Ressources Humaines (DRH)',
    departement: 'Direction des Ressources Humaines',
    dateEmbauche: '2022-02-01',
    statut: 'Actif',
    typeContrat: 'CDI',
    categoriePro: 'CLASSE V',
    echelon: 'Échelon 2',
    grade: 'CL5E02',
    salaireBase: 581390,
    salaireBrut: 856390,
    primeLogement: 120000,
    primeTransport: 75000,
    primeResponsabilite: 80000,
    banque: 'Banque Postale du Burkina Faso (BPBF)',
    iban: 'BF01 01001 012345678905 65',
    observations: 'Responsable du suivi administratif et du calcul de la paie'
  }),
  createDefaultEmployee({
    id: 'emp-006',
    matricule: 'EMP-006',
    nom: 'COMPAORE',
    prenom: 'Boureima',
    sexe: 'M',
    dateNaissance: '1992-05-30',
    lieuNaissance: 'Ouahigouya',
    nationalite: 'Burkinabè',
    numeroCNI: 'B65498732',
    adresse: 'Dassasgho, Secteur 28',
    ville: 'Ouagadougou',
    telephone: '+226 70 88 77 66',
    email: 'b.compaore@bpbf.bf',
    poste: 'Caissier Principal (Cash Point)',
    service: 'Service Opérations de Guichet',
    direction: 'Direction des Opérations Bancaires (DOB)',
    departement: 'Direction des Opérations Bancaires',
    dateEmbauche: '2022-10-15',
    statut: 'Actif',
    typeContrat: 'CDI',
    categoriePro: '7ÈME CATEGORIE',
    echelon: 'Échelon 6',
    grade: 'C7E06',
    salaireBase: 176441,
    salaireBrut: 281441,
    primeLogement: 35000,
    primeTransport: 30000,
    primeResponsabilite: 40000,
    banque: 'Banque Postale du Burkina Faso (BPBF)',
    iban: 'BF01 01001 012345678906 70',
    observations: 'Caissier Principal — Indemnité de caisse et responsabilité des coffres'
  }),
  createDefaultEmployee({
    id: 'emp-007',
    matricule: 'EMP-007',
    nom: 'SANOGO',
    prenom: 'Fatoumata',
    sexe: 'F',
    dateNaissance: '1994-09-14',
    lieuNaissance: 'Banfora',
    nationalite: 'Burkinabè',
    numeroCNI: 'B14725836',
    adresse: 'Gounghin, Secteur 8',
    ville: 'Ouagadougou',
    telephone: '+226 72 33 22 11',
    email: 'f.sanogo@bpbf.bf',
    poste: 'Assistante de Direction Générale',
    service: 'Direction Générale (DG)',
    direction: 'Direction Générale (DG)',
    departement: 'Direction Générale',
    dateEmbauche: '2023-01-10',
    statut: 'Actif',
    typeContrat: 'CDI',
    categoriePro: 'C6',
    echelon: 'E01',
    grade: 'C6E01',
    salaireBase: 157940,
    salaireBrut: 252940,
    primeLogement: 35000,
    primeTransport: 30000,
    primeResponsabilite: 30000,
    banque: 'Banque Postale du Burkina Faso (BPBF)',
    iban: 'BF01 01001 012345678907 75',
    observations: 'Secrétariat et accueil de la Direction Générale'
  })
];

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = [];
  private employeesSubject = new BehaviorSubject<Employee[]>([]);

  employees$: Observable<Employee[]> = this.employeesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initLocalEmployees();
    this.refresh();
  }

  private initLocalEmployees(): void {
    const saved = localStorage.getItem('sigrh_bpbf_employees_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.employees = parsed;
          this.employeesSubject.next(parsed);
          return;
        }
      } catch (e) {}
    }

    this.employees = [...BPBF_INITIAL_EMPLOYEES];
    this.saveToLocal();
  }

  private saveToLocal(): void {
    localStorage.setItem('sigrh_bpbf_employees_v3', JSON.stringify(this.employees));
  }

  private toBackend(emp: Partial<Employee>): any {
    const result: any = { ...emp };

    // Map JSON fields & extraData for PostgreSQL
    const extraDataObj = {
      categorie: emp.categoriePro || 'CL1',
      echelon: emp.echelon || 'E01',
      grade: emp.grade || `${emp.categoriePro || 'CL1'}${emp.echelon || 'E01'}`,
      salaireBase: emp.salaireBase || 150000,
      primeLogement: emp.primeLogement || 0,
      enfants: emp.enfants || [],
      conjoint: emp.conjoint || null
    };
    result.extraData = JSON.stringify(extraDataObj);

    if (emp.contactsUrgence) result.contactsUrgenceJson = JSON.stringify(emp.contactsUrgence);
    if (emp.conjoint) result.conjointJson = JSON.stringify(emp.conjoint);
    if (emp.enfants) result.enfantsJson = JSON.stringify(emp.enfants);
    if (emp.personnesCharge) result.personnesChargeJson = JSON.stringify(emp.personnesCharge);
    if (emp.autresIndemnites) result.autresIndemnitesJson = JSON.stringify(emp.autresIndemnites);
    if (emp.exonerationsFiscales) result.exonerationsFiscalesJson = JSON.stringify(emp.exonerationsFiscales);
    if (emp.exonerationsSociales) result.exonerationsSocialesJson = JSON.stringify(emp.exonerationsSociales);
    if (emp.avantagesParticuliers) result.avantagesParticuliersJson = JSON.stringify(emp.avantagesParticuliers);
    if (emp.documents) result.documentsJson = JSON.stringify(emp.documents);
    if (emp.evaluations) result.evaluationsJson = JSON.stringify(emp.evaluations);
    if (emp.historiqueActions) result.historiqueActionsJson = JSON.stringify(emp.historiqueActions);
    
    // Delete original array/object fields to prevent payload structure mismatch
    delete result.contactsUrgence;
    delete result.conjoint;
    delete result.enfants;
    delete result.personnesCharge;
    delete result.autresIndemnites;
    delete result.exonerationsFiscales;
    delete result.exonerationsSociales;
    delete result.avantagesParticuliers;
    delete result.documents;
    delete result.evaluations;
    delete result.historiqueActions;
    
    return result;
  }

  private toFrontend(db: any): Employee {
    const result: any = { ...db };
    
    // Parse JSON fields safely
    try { result.contactsUrgence = db.contactsUrgenceJson ? JSON.parse(db.contactsUrgenceJson) : []; } catch (e) { result.contactsUrgence = []; }
    try { result.conjoint = db.conjointJson ? JSON.parse(db.conjointJson) : undefined; } catch (e) { result.conjoint = undefined; }
    try { result.enfants = db.enfantsJson ? JSON.parse(db.enfantsJson) : []; } catch (e) { result.enfants = []; }
    try { result.personnesCharge = db.personnesChargeJson ? JSON.parse(db.personnesChargeJson) : []; } catch (e) { result.personnesCharge = []; }
    try { result.autresIndemnites = db.autresIndemnitesJson ? JSON.parse(db.autresIndemnitesJson) : []; } catch (e) { result.autresIndemnites = []; }
    try { result.exonerationsFiscales = db.exonerationsFiscalesJson ? JSON.parse(db.exonerationsFiscalesJson) : []; } catch (e) { result.exonerationsFiscales = []; }
    try { result.exonerationsSociales = db.exonerationsSocialesJson ? JSON.parse(db.exonerationsSocialesJson) : []; } catch (e) { result.exonerationsSociales = []; }
    try { result.avantagesParticuliers = db.avantagesParticuliersJson ? JSON.parse(db.avantagesParticuliersJson) : []; } catch (e) { result.avantagesParticuliers = []; }
    try { result.documents = db.documentsJson ? JSON.parse(db.documentsJson) : []; } catch (e) { result.documents = []; }
    try { result.evaluations = db.evaluationsJson ? JSON.parse(db.evaluationsJson) : []; } catch (e) { result.evaluations = []; }
    // Parse extraData JSON from backend if present
    if (db.extraData) {
      try {
        const extra = typeof db.extraData === 'string' ? JSON.parse(db.extraData) : db.extraData;
        if (extra.categorie) result.categoriePro = extra.categorie;
        if (extra.echelon) result.echelon = extra.echelon;
        if (extra.grade) result.grade = extra.grade;
        if (extra.salaireBase) result.salaireBase = Number(extra.salaireBase);
        if (extra.primeLogement) result.primeLogement = Number(extra.primeLogement);
        if (extra.enfants && Array.isArray(extra.enfants)) result.enfants = extra.enfants;
        if (extra.conjoint) result.conjoint = extra.conjoint;
      } catch (e) {}
    }
    
    return createDefaultEmployee(result);
  }

  private mergeEmployee(local: Employee | undefined, remote: Employee): Employee {
    if (!local) return remote;
    const mergedEnfants = (local.enfants && local.enfants.length > 0) ? local.enfants : (remote.enfants || []);
    const mergedConjoint = local.conjoint || remote.conjoint;
    const mergedPersonnesCharge = (local.personnesCharge && local.personnesCharge.length > 0) ? local.personnesCharge : (remote.personnesCharge || []);
    const mergedAutresIndemnites = (local.autresIndemnites && local.autresIndemnites.length > 0) ? local.autresIndemnites : (remote.autresIndemnites || []);

    return createDefaultEmployee({
      ...remote,
      ...local,
      id: local.id || remote.id,
      matricule: local.matricule || remote.matricule,
      enfants: mergedEnfants,
      conjoint: mergedConjoint,
      personnesCharge: mergedPersonnesCharge,
      autresIndemnites: mergedAutresIndemnites
    });
  }

  getEmployeesDirect(): Employee[] {
    return this.employees;
  }

  private mergeListWithLocal(remoteList: Employee[], emitSubject = true): void {
    if (!remoteList || remoteList.length === 0) return;

    remoteList.forEach(remote => {
      const local = this.employees.find(e =>
        (e.matricule && remote.matricule && e.matricule.trim().toUpperCase() === remote.matricule.trim().toUpperCase()) ||
        (e.id && remote.id && String(e.id) === String(remote.id))
      );

      const merged = this.mergeEmployee(local, remote);

      if (local) {
        this.employees = this.employees.map(e =>
          (e === local || e.matricule === local.matricule || String(e.id) === String(local.id)) ? merged : e
        );
      } else {
        this.employees.push(merged);
      }
    });

    this.saveToLocal();
    if (emitSubject) {
      this.employeesSubject.next(this.employees);
    }
  }

  refresh(): void {
    this.http.get<any[]>(`${environment.apiUrl}/employes/all`).pipe(
      map(list => list.map(item => this.toFrontend(item))),
      catchError(() => of(this.employees))
    ).subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          this.mergeListWithLocal(list, true);
        }
      }
    });
  }

  getAll(): Observable<Employee[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/employes/all`).pipe(
      map(list => list.map(item => this.toFrontend(item))),
      tap(list => {
        if (list && list.length > 0) {
          this.mergeListWithLocal(list, false);
        }
      }),
      catchError(() => {
        return of(this.employees);
      }),
      map(() => this.employees)
    );
  }

  getById(id: string): Observable<Employee> {
    const local = this.employees.find(e => String(e.id) === String(id) || e.matricule === id);
    if (local) {
      return of(local);
    }
    return this.http.get<any>(`${environment.apiUrl}/employes/${id}`).pipe(
      map(item => this.toFrontend(item)),
      tap(remote => {
        const merged = this.mergeEmployee(local, remote);
        this.employees.push(merged);
        this.saveToLocal();
        this.employeesSubject.next(this.employees);
      }),
      catchError(() => {
        return of(this.employees[0]);
      })
    );
  }

  create(data: Omit<Employee, 'id'>): Observable<Employee> {
    const newId = `emp-${Date.now()}`;
    const newEmp = createDefaultEmployee({ ...data, id: newId });
    
    this.employees = [newEmp, ...this.employees];
    this.saveToLocal();
    this.employeesSubject.next(this.employees);

    const backendData = this.toBackend(data);
    this.http.post<any>(`${environment.apiUrl}/employes/create`, backendData).pipe(
      map(item => this.toFrontend(item)),
      catchError(err => {
        console.warn('Backend post failed, using local employee creation:', err);
        return of(newEmp);
      })
    ).subscribe();

    return of(newEmp);
  }

  update(id: string, data: Partial<Employee>): Observable<Employee> {
    const existing = this.employees.find(e => String(e.id) === String(id) || e.matricule === id);
    const mergedData = createDefaultEmployee(existing ? { ...existing, ...data } : { ...data, id });

    this.employees = this.employees.map(e => (String(e.id) === String(id) || e.matricule === id) ? mergedData : e);
    this.saveToLocal();
    this.employeesSubject.next(this.employees);

    const backendData = this.toBackend(mergedData);
    this.http.put<any>(`${environment.apiUrl}/employes/${id}`, backendData).pipe(
      map(item => this.toFrontend(item)),
      catchError(err => {
        console.warn('Backend update failed, using local state update:', err);
        return of(mergedData);
      })
    ).subscribe();

    return of(mergedData);
  }

  delete(id: string): Observable<void> {
    this.employees = this.employees.filter(e => String(e.id) !== String(id));
    this.saveToLocal();
    this.employeesSubject.next(this.employees);

    this.http.delete<void>(`${environment.apiUrl}/employes/${id}`).pipe(
      catchError(err => {
        console.warn('Backend delete failed, local deletion succeeded:', err);
        return of(undefined);
      })
    ).subscribe();

    return of(undefined);
  }

  search(query: string, statut?: StatutEmploye | '', service?: string): Employee[] {
    return this.employees.filter(e => {
      const q = query.toLowerCase();
      const matchQuery = !query ||
        e.nom.toLowerCase().includes(q) ||
        e.prenom.toLowerCase().includes(q) ||
        e.matricule.toLowerCase().includes(q) ||
        (e.poste && e.poste.toLowerCase().includes(q)) ||
        (e.service && e.service.toLowerCase().includes(q));
      const matchStatut = !statut || e.statut === statut;
      const matchService = !service || e.service === service;
      return matchQuery && matchStatut && matchService;
    });
  }

  getServices(): string[] {
    return [...new Set(this.employees.map(e => e.service))].filter(s => !!s).sort();
  }

  generateMatricule(): string {
    const maxNum = this.employees.reduce((max, e) => {
      const num = parseInt(e.matricule.replace('EMP-', '')) || 0;
      return Math.max(max, num);
    }, 0);
    return `EMP-${String(maxNum + 1).padStart(3, '0')}`;
  }
}
