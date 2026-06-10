import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';

const MOCK_USER: User = {
  id: '1',
  nom: 'Dupont',
  prenom: 'Marie',
  email: 'marie.dupont@entreprise.com',
  role: 'ADMIN',
  permissions: ['grh.view', 'carrieres.view', 'paie.view', 'donnees-base.view'],
  avatar: '',
  poste: 'Directrice RH',
  department: 'Ressources Humaines'
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(MOCK_USER);

  currentUser$: Observable<User | null> = this.userSubject.asObservable();

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  login(email: string, password: string): Observable<User> {
    this.userSubject.next(MOCK_USER);
    return of(MOCK_USER);
  }

  logout(): void {
    this.userSubject.next(null);
  }

  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) ?? false;
  }

  getInitials(): string {
    const user = this.currentUser;
    if (!user) return '?';
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
  }
}
