import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const url = state.url;
    const role = this.authService.currentUser?.role;

    // Si profil AGENT ou EMPLOYE et essaie d'accéder aux modules d'administration
    if (this.authService.isAgentRole(role) && !url.includes('/mon-espace')) {
      this.router.navigate(['/mon-espace']);
      return false;
    }

    // Vérification des permissions par module d'après la Matrice des Habilitations
    if (url.startsWith('/donnees-base') && !this.authService.hasPermission('DB_VIEW') && !this.authService.hasPermission('donnees-base.view')) {
      this.denyAccess('Données de Base');
      return false;
    }

    if (url.startsWith('/paie') && !this.authService.hasPermission('PAIE_VIEW') && !this.authService.hasPermission('paie.view')) {
      this.denyAccess('Gestion de la Paie');
      return false;
    }

    if (url.startsWith('/grh') && !this.authService.hasPermission('EMP_VIEW') && !this.authService.hasPermission('grh.view')) {
      this.denyAccess('GRH & Employés');
      return false;
    }

    if (url.startsWith('/profils') && !this.authService.hasPermission('PROFIL_EDIT') && !this.authService.hasPermission('USER_MANAGE') && !this.authService.hasPermission('profils.view')) {
      this.denyAccess('Profils & Habilitations');
      return false;
    }

    return true;
  }

  private denyAccess(moduleName: string): void {
    this.snackBar.open(
      `Accès refusé : votre rôle ne possède pas les habilitations pour le module ${moduleName}.`,
      'Fermer',
      { duration: 5000, horizontalPosition: 'center', verticalPosition: 'top' }
    );
    this.router.navigate(['/dashboard']);
  }
}
