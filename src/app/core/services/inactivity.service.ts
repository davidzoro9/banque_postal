import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  // Délai d'inactivité avant déconnexion automatique (15 minutes en millisecondes)
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; 
  private timer: any;
  private isListening = false;

  private readonly userEvents = [
    'mousemove', 'keydown', 'click', 'scroll', 'touchstart'
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {
    this.initInactivityTracker();
  }

  public initInactivityTracker(): void {
    if (this.isListening) return;
    this.isListening = true;

    // Écouter les événements utilisateurs en dehors de la zone Angular pour des performances optimales
    this.ngZone.runOutsideAngular(() => {
      this.userEvents.forEach(event => {
        window.addEventListener(event, () => this.resetTimer(), { passive: true });
      });
    });

    // Démarrer le premier chrono si l'utilisateur est déjà connecté
    this.resetTimer();

    // Réinitialiser automatiquement le timer en cas de reconnexion
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.resetTimer();
      } else {
        this.clearTimer();
      }
    });
  }

  private resetTimer(): void {
    this.clearTimer();

    if (!this.authService.isAuthenticated()) return;

    this.ngZone.runOutsideAngular(() => {
      this.timer = setTimeout(() => {
        this.ngZone.run(() => {
          this.handleInactivityLogout();
        });
      }, this.INACTIVITY_TIMEOUT);
    });
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private handleInactivityLogout(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
      this.snackBar.open(
        'Session expirée après 15 minutes d\'inactivité. Veuillez vous reconnecter.',
        'Fermer',
        {
          duration: 7000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['warn-snackbar']
        }
      );
      this.router.navigate(['/auth/login'], {
        queryParams: { sessionExpired: 'inactivity' }
      });
    }
  }
}
