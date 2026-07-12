import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);

  currentUser$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/utilisateurs/login`, { email, password }).pipe(
      map(res => {
        let permissions: string[] = ['grh.view'];
        if (res.role === 'ADMIN' || res.role === 'RH') {
          permissions = ['grh.view', 'carrieres.view', 'paie.view', 'donnees-base.view'];
        } else if (res.role === 'MANAGER') {
          permissions = ['grh.view', 'carrieres.view'];
        }
        
        const user: User = {
          id: String(res.id),
          nom: res.nom,
          prenom: res.prenom,
          email: res.email,
          role: res.role,
          permissions: permissions,
          avatar: '',
          poste: res.role === 'ADMIN' ? 'Administrateur' : res.role,
          department: ''
        };
        
        this.userSubject.next(user);
        return user;
      })
    );
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
