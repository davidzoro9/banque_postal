import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Employee, StatutEmploye } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = [];
  private employeesSubject = new BehaviorSubject<Employee[]>([]);

  employees$: Observable<Employee[]> = this.employeesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refresh();
  }

  private toBackend(emp: Partial<Employee>): any {
    const result: any = { ...emp };
    
    // Map JSON fields
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
    
    // Parse JSON fields
    result.contactsUrgence = db.contactsUrgenceJson ? JSON.parse(db.contactsUrgenceJson) : [];
    result.conjoint = db.conjointJson ? JSON.parse(db.conjointJson) : undefined;
    result.enfants = db.enfantsJson ? JSON.parse(db.enfantsJson) : [];
    result.personnesCharge = db.personnesChargeJson ? JSON.parse(db.personnesChargeJson) : [];
    result.autresIndemnites = db.autresIndemnitesJson ? JSON.parse(db.autresIndemnitesJson) : [];
    result.exonerationsFiscales = db.exonerationsFiscalesJson ? JSON.parse(db.exonerationsFiscalesJson) : [];
    result.exonerationsSociales = db.exonerationsSocialesJson ? JSON.parse(db.exonerationsSocialesJson) : [];
    result.avantagesParticuliers = db.avantagesParticuliersJson ? JSON.parse(db.avantagesParticuliersJson) : [];
    result.documents = db.documentsJson ? JSON.parse(db.documentsJson) : [];
    result.evaluations = db.evaluationsJson ? JSON.parse(db.evaluationsJson) : [];
    result.historiqueActions = db.historiqueActionsJson ? JSON.parse(db.historiqueActionsJson) : [];
    
    return result;
  }

  refresh(): void {
    this.http.get<any[]>(`${environment.apiUrl}/employes/all`).pipe(
      map(list => list.map(item => this.toFrontend(item)))
    ).subscribe({
      next: (list) => {
        this.employees = list;
        this.employeesSubject.next(list);
      },
      error: (err) => {
        console.error('Failed to load employees from backend:', err);
      }
    });
  }

  getAll(): Observable<Employee[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/employes/all`).pipe(
      map(list => list.map(item => this.toFrontend(item))),
      tap(list => {
        this.employees = list;
        this.employeesSubject.next(list);
      })
    );
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<any>(`${environment.apiUrl}/employes/${id}`).pipe(
      map(item => this.toFrontend(item)),
      tap(emp => {
        const exists = this.employees.some(e => String(e.id) === String(emp.id));
        if (exists) {
          this.employees = this.employees.map(e => String(e.id) === String(emp.id) ? emp : e);
        } else {
          this.employees = [...this.employees, emp];
        }
        this.employeesSubject.next(this.employees);
      })
    );
  }

  create(data: Omit<Employee, 'id'>): Observable<Employee> {
    const backendData = this.toBackend(data);
    return this.http.post<any>(`${environment.apiUrl}/employes/create`, backendData).pipe(
      map(item => this.toFrontend(item)),
      tap(newEmp => {
        this.employees = [...this.employees, newEmp];
        this.employeesSubject.next(this.employees);
      })
    );
  }

  update(id: string, data: Partial<Employee>): Observable<Employee> {
    const existing = this.employees.find(e => String(e.id) === String(id));
    const mergedData = existing ? { ...existing, ...data } : data;
    const backendData = this.toBackend(mergedData);
    return this.http.put<any>(`${environment.apiUrl}/employes/${id}`, backendData).pipe(
      map(item => this.toFrontend(item)),
      tap(updatedEmp => {
        this.employees = this.employees.map(e => String(e.id) === String(id) ? updatedEmp : e);
        this.employeesSubject.next(this.employees);
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/employes/${id}`).pipe(
      tap(() => {
        this.employees = this.employees.filter(e => e.id !== id);
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
        e.poste.toLowerCase().includes(q) ||
        e.service.toLowerCase().includes(q);
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
