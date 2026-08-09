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

const BPBF_INITIAL_EMPLOYEES: Employee[] = [];

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
    this.employees = [];
    this.employeesSubject.next([]);
  }

  private saveToLocal(): void {
    // Local storage persistence disabled in favor of strict backend API
  }

  private toBackend(emp: Partial<Employee>): any {
    const result: any = { ...emp };

    // Map JSON fields & extraData for PostgreSQL safely without forced defaults
    const extraDataObj: any = {};
    if (emp.categoriePro) {
      extraDataObj.categorie = emp.categoriePro;
      extraDataObj.categoriePro = emp.categoriePro;
    }
    if (emp.echelon) extraDataObj.echelon = emp.echelon;
    if (emp.grade) extraDataObj.grade = emp.grade;
    if (emp.salaireBase !== undefined) extraDataObj.salaireBase = emp.salaireBase;
    if (emp.primeLogement !== undefined) extraDataObj.primeLogement = emp.primeLogement;
    if (emp.enfants) extraDataObj.enfants = emp.enfants;
    if (emp.conjoint) extraDataObj.conjoint = emp.conjoint;

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
        if (extra.categoriePro || extra.categorie) result.categoriePro = extra.categoriePro || extra.categorie;
        if (extra.echelon) result.echelon = extra.echelon;
        if (extra.grade) result.grade = extra.grade;
        if (extra.salaireBase) result.salaireBase = Number(extra.salaireBase);
        if (extra.primeLogement) result.primeLogement = Number(extra.primeLogement);
        if (extra.enfants && Array.isArray(extra.enfants)) result.enfants = extra.enfants;
        if (extra.conjoint) result.conjoint = extra.conjoint;
      } catch (e) {}
    }

    if (result.grade && (!result.categoriePro || result.categoriePro === 'CL1')) {
      const g = String(result.grade).trim();
      const eIdx = g.indexOf('E');
      if (eIdx > 0) {
        result.categoriePro = g.substring(0, eIdx);
        result.echelon = g.substring(eIdx);
      }
    }
    
    return createDefaultEmployee(result);
  }

  getEmployeesDirect(): Employee[] {
    return this.employees;
  }

  refresh(): void {
    this.http.get<any[]>(`${environment.apiUrl}/employes/all`).pipe(
      map(list => list.map(item => this.toFrontend(item))),
      catchError(() => of([]))
    ).subscribe({
      next: (list) => {
        this.employees = list;
        this.employeesSubject.next(this.employees);
      }
    });
  }

  getAll(): Observable<Employee[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/employes/all`).pipe(
      map(list => list.map(item => this.toFrontend(item))),
      tap(list => {
        this.employees = list;
        this.employeesSubject.next(this.employees);
      }),
      catchError(() => {
        this.employees = [];
        this.employeesSubject.next([]);
        return of([]);
      })
    );
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<any>(`${environment.apiUrl}/employes/${id}`).pipe(
      map(item => this.toFrontend(item)),
      catchError(() => {
        return of({} as Employee);
      })
    );
  }

  create(data: Omit<Employee, 'id'>): Observable<Employee> {
    const backendData = this.toBackend(data);
    return this.http.post<any>(`${environment.apiUrl}/employes/create`, backendData).pipe(
      map(item => {
        const emp = this.toFrontend(item);
        this.employees.unshift(emp);
        this.employeesSubject.next(this.employees);
        return emp;
      })
    );
  }

  update(id: string, data: Partial<Employee>): Observable<Employee> {
    const backendData = this.toBackend(data);
    return this.http.put<any>(`${environment.apiUrl}/employes/${id}`, backendData).pipe(
      map(item => {
        const updated = this.toFrontend(item);
        this.employees = this.employees.map(e => String(e.id) === String(id) ? updated : e);
        this.employeesSubject.next(this.employees);
        return updated;
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/employes/${id}`).pipe(
      tap(() => {
        this.employees = this.employees.filter(e => String(e.id) !== String(id));
        this.employeesSubject.next(this.employees);
      })
    );
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
