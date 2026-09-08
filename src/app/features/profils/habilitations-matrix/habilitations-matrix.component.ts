import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ActionPermission, HabilitationService } from '../services/habilitation.service';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-habilitations-matrix',
  templateUrl: './habilitations-matrix.component.html',
  styleUrls: ['./habilitations-matrix.component.scss'],
  standalone: false
})
export class HabilitationsMatrixComponent implements OnInit {
  roles: Array<{ code: string; label: string; color: string }> = [
    { code: 'ADMIN', label: 'Administrateur', color: '#c62828' },
    { code: 'DRH', label: 'Directeur RH', color: '#1565c0' },
    { code: 'GESTIONNAIRE_PAIE', label: 'Gestionnaire Paie', color: '#2e7d32' },
    { code: 'VALIDATEUR', label: 'Validateur', color: '#ef6c00' },
    { code: 'CONSULTANT', label: 'Consultant', color: '#6a1b9a' },
    { code: 'EMPLOYE', label: 'Collaborateur', color: '#0d9488' }
  ];

  matrix: ActionPermission[] = [];
  loading = false;
  savedNotification = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private habilitationService: HabilitationService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.loading = true;
    this.errorMessage = '';

    // 1. Charger les rôles depuis PostgreSQL
    this.roleService.getAll().subscribe({
      next: (roleList) => {
        if (roleList && roleList.length > 0) {
          this.roles = roleList.map(r => ({
            code: r.code,
            label: r.libelle,
            color: r.badgeColor || '#0060B3'
          }));
        }
      },
      error: (err) => console.error('Erreur chargement rôles:', err)
    });

    // 2. Charger la matrice des habilitations depuis PostgreSQL
    this.habilitationService.getAll().subscribe({
      next: (data) => {
        this.matrix = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement habilitations:', err);
        this.errorMessage = 'Impossible de charger la matrice des habilitations depuis PostgreSQL.';
        this.loading = false;
      }
    });
  }

  toggleAccess(item: ActionPermission, roleCode: string): void {
    if (!item.rolesAccess) {
      item.rolesAccess = {};
    }
    item.rolesAccess[roleCode] = !item.rolesAccess[roleCode];
  }

  savePermissions(): void {
    this.habilitationService.saveMatrix(this.matrix).subscribe({
      next: (updatedMatrix) => {
        this.matrix = updatedMatrix;
        this.authService.refreshUserPermissions();
        this.savedNotification = true;
        setTimeout(() => {
          this.savedNotification = false;
        }, 3500);
      },
      error: (err) => {
        console.error('Erreur sauvegarde habilitations:', err);
        alert('Erreur lors de l\'enregistrement des habilitations dans PostgreSQL.');
      }
    });
  }
}
