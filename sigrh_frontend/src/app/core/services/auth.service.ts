import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);

  currentUser$: Observable<User | null> = this.userSubject.asObservable();

  private permissionsMatrix: any[] = [];

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        this.userSubject.next(JSON.parse(saved));
      } catch (e) {}
    }
    this.loadHabilitations();
  }

  public loadHabilitations(): void {
    this.http.get<any[]>(`${environment.apiUrl}/habilitations`).subscribe({
      next: (matrix) => {
        if (matrix && matrix.length > 0) {
          this.permissionsMatrix = matrix;
          this.refreshUserPermissions();
        }
      },
      error: () => {}
    });
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  public isAgentRole(role?: string | null): boolean {
    if (!role) return false;
    const r = role.trim().toUpperCase();
    return r === 'AGENT' || r === 'EMPLOYE' || r === 'EMPLOYEE' || r === 'COLLABORATEUR' || r.includes('AGENT') || r.includes('EMPLOYE');
  }

  getPermissionsForRole(role: string): string[] {
    const matrix = this.permissionsMatrix;
    if (Array.isArray(matrix) && matrix.length > 0) {
      const perms = new Set<string>();
      matrix.forEach((item: any) => {
        if (item.rolesAccess && item.rolesAccess[role] === true && item.actionCode) {
          perms.add(item.actionCode);
          if (item.actionCode === 'DB_VIEW') perms.add('donnees-base.view');
          if (item.actionCode === 'EMP_VIEW') { perms.add('grh.view'); perms.add('carrieres.view'); }
          if (item.actionCode === 'PAIE_VIEW') perms.add('paie.view');
          if (item.actionCode === 'CONGE_VIEW') perms.add('conges.view');
          if (item.actionCode === 'MON_ESPACE_VIEW') perms.add('mon-espace.view');
          if (item.actionCode === 'PROFIL_EDIT' || item.actionCode === 'USER_MANAGE') perms.add('profils.view');
        }
      });
      return Array.from(perms);
    }

    // Fallback par défaut si la matrice n'a pas encore été sauvegardée dans localStorage
    const perms = new Set<string>();
    if (role === 'ADMIN' || role === 'RH' || role === 'DRH') {
      ['DB_VIEW', 'DB_GRILLE_EDIT', 'DB_INDEMNITE_EDIT', 'DB_REF_EDIT', 'EMP_VIEW', 'EMP_CREATE', 'EMP_EDIT', 'EMP_DELETE', 'PAIE_VIEW', 'PAIE_VARIABLES', 'PAIE_GENERATE', 'PAIE_VALIDATE', 'PAIE_CLOTURE', 'PAIE_EXPORT', 'CONGE_VIEW', 'CONGE_DEMANDE', 'CONGE_VALIDATE', 'MON_ESPACE_VIEW', 'MON_ESPACE_BULLETINS', 'PROFIL_EDIT', 'USER_MANAGE', 'MANUAL_VIEW', 'donnees-base.view', 'grh.view', 'carrieres.view', 'paie.view', 'conges.view', 'mon-espace.view', 'profils.view'].forEach(p => perms.add(p));
    } else if (role === 'GESTIONNAIRE_PAIE') {
      ['DB_VIEW', 'DB_INDEMNITE_EDIT', 'EMP_VIEW', 'EMP_EDIT', 'PAIE_VIEW', 'PAIE_VARIABLES', 'PAIE_GENERATE', 'PAIE_EXPORT', 'CONGE_VIEW', 'CONGE_DEMANDE', 'MON_ESPACE_VIEW', 'MON_ESPACE_BULLETINS', 'MANUAL_VIEW', 'donnees-base.view', 'grh.view', 'paie.view', 'conges.view', 'mon-espace.view'].forEach(p => perms.add(p));
    } else if (role === 'VALIDATEUR') {
      ['DB_VIEW', 'EMP_VIEW', 'PAIE_VIEW', 'PAIE_VALIDATE', 'PAIE_EXPORT', 'CONGE_VIEW', 'CONGE_DEMANDE', 'CONGE_VALIDATE', 'MON_ESPACE_VIEW', 'MON_ESPACE_BULLETINS', 'MANUAL_VIEW', 'paie.view', 'conges.view', 'mon-espace.view'].forEach(p => perms.add(p));
    } else if (role === 'CONSULTANT') {
      ['DB_VIEW', 'EMP_VIEW', 'PAIE_VIEW', 'PAIE_EXPORT', 'CONGE_VIEW', 'MON_ESPACE_VIEW', 'MANUAL_VIEW', 'paie.view', 'conges.view'].forEach(p => perms.add(p));
    } else {
      ['mon-espace.view', 'MON_ESPACE_VIEW', 'MON_ESPACE_BULLETINS', 'CONGE_VIEW', 'CONGE_DEMANDE', 'MANUAL_VIEW'].forEach(p => perms.add(p));
    }
    return Array.from(perms);
  }

  public refreshUserPermissions(): void {
    if (this.currentUser) {
      const updatedUser = {
        ...this.currentUser,
        permissions: this.getPermissionsForRole(this.currentUser.role)
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.userSubject.next(updatedUser);
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/utilisateurs/login`, { email, password }).pipe(
      timeout(4000),
      map(res => {
        const role = res.role || 'EMPLOYE';
        const permissions = this.getPermissionsForRole(role);
        const user: User = {
          id: String(res.id),
          nom: res.nom,
          prenom: res.prenom,
          email: res.email,
          username: res.username || res.email,
          matricule: res.username,
          role: role as UserRole,
          permissions: permissions,
          avatar: '',
          poste: role === 'ADMIN' ? 'Administrateur' : (this.isAgentRole(role) ? 'Collaborateur Salarié' : role),
          department: ''
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }),
      catchError(err => {
        if (err.status === 401 || err.status === 403 || (err.error && (err.error.message || err.error.error))) {
          const msg = err.error?.message || err.error?.error || 'Identifiant ou mot de passe incorrect.';
          return throwError(() => new Error(msg));
        }

        console.error('[AuthService] Erreur de connexion au backend Spring Boot:', err);
        return throwError(() => new Error("Impossible de joindre le serveur d'authentification. Veuillez vous assurer que le backend Spring Boot est actif."));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }

  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    const role = this.currentUser.role;
    const perms = this.getPermissionsForRole(role);
    return perms.includes(permission);
  }

  getInitials(): string {
    const user = this.currentUser;
    if (!user) return '?';
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
  }
}
