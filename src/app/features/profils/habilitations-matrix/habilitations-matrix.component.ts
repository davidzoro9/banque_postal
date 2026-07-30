import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

export interface ActionPermission {
  id: string;
  moduleName: string;
  actionName: string;
  actionCode: string;
  rolesAccess: Record<string, boolean>; // roleCode -> boolean
}

@Component({
  selector: 'app-habilitations-matrix',
  templateUrl: './habilitations-matrix.component.html',
  styleUrls: ['./habilitations-matrix.component.scss'],
  standalone: false
})
export class HabilitationsMatrixComponent implements OnInit {
  roles = [
    { code: 'ADMIN', label: 'Administrateur', color: '#c62828' },
    { code: 'DRH', label: 'Directeur RH', color: '#1565c0' },
    { code: 'GESTIONNAIRE_PAIE', label: 'Gestionnaire Paie', color: '#2e7d32' },
    { code: 'VALIDATEUR', label: 'Validateur', color: '#ef6c00' },
    { code: 'CONSULTANT', label: 'Consultant', color: '#6a1b9a' }
  ];

  matrix: ActionPermission[] = [
    // ── Module Données de Base
    { id: '1', moduleName: 'Données de Base', actionName: 'Accès au menu Données de Base', actionCode: 'DB_VIEW', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: true, VALIDATEUR: true, CONSULTANT: true } },
    { id: '2', moduleName: 'Données de Base', actionName: 'Modifier Grille Salariale', actionCode: 'DB_GRILLE_EDIT', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: false, VALIDATEUR: false, CONSULTANT: false } },
    { id: '3', moduleName: 'Données de Base', actionName: 'Modifier Paramétrage Indemnités', actionCode: 'DB_INDEMNITE_EDIT', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: true, VALIDATEUR: false, CONSULTANT: false } },
    { id: '4', moduleName: 'Données de Base', actionName: 'Créer/Editer Référentiels (Direction, Service)', actionCode: 'DB_REF_EDIT', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: false, VALIDATEUR: false, CONSULTANT: false } },

    // ── Module GRH & Employés
    { id: '5', moduleName: 'GRH & Employés', actionName: 'Accès au menu Liste Employés', actionCode: 'EMP_VIEW', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: true, VALIDATEUR: true, CONSULTANT: true } },
    { id: '6', moduleName: 'GRH & Employés', actionName: 'Créer / Recruter un Employé', actionCode: 'EMP_CREATE', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: false, VALIDATEUR: false, CONSULTANT: false } },
    { id: '7', moduleName: 'GRH & Employés', actionName: 'Modifier Fiche Employé & Contrat', actionCode: 'EMP_EDIT', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: true, VALIDATEUR: false, CONSULTANT: false } },
    { id: '8', moduleName: 'GRH & Employés', actionName: 'Supprimer / Archiver un Employé', actionCode: 'EMP_DELETE', rolesAccess: { ADMIN: true, DRH: false, GESTIONNAIRE_PAIE: false, VALIDATEUR: false, CONSULTANT: false } },

    // ── Module Paie
    { id: '9', moduleName: 'Gestion Paie', actionName: 'Accès au module Paie & Bulletins', actionCode: 'PAIE_VIEW', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: true, VALIDATEUR: true, CONSULTANT: true } },
    { id: '10', moduleName: 'Gestion Paie', actionName: 'Lancer Calcul & Génération de Paie', actionCode: 'PAIE_GENERATE', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: true, VALIDATEUR: false, CONSULTANT: false } },
    { id: '11', moduleName: 'Gestion Paie', actionName: 'Valider les Bulletins de Paie', actionCode: 'PAIE_VALIDATE', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: false, VALIDATEUR: true, CONSULTANT: false } },
    { id: '12', moduleName: 'Gestion Paie', actionName: 'Clôturer la Session de Paie', actionCode: 'PAIE_CLOTURE', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: false, VALIDATEUR: false, CONSULTANT: false } },
    { id: '13', moduleName: 'Gestion Paie', actionName: 'Exporter les Bulletins (PDF / Excel)', actionCode: 'PAIE_EXPORT', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: true, VALIDATEUR: true, CONSULTANT: true } },

    // ── Module Sécurité & Habilitations
    { id: '14', moduleName: 'Profils & Sécurité', actionName: 'Gestion des Profils & Matrice', actionCode: 'PROFIL_EDIT', rolesAccess: { ADMIN: true, DRH: false, GESTIONNAIRE_PAIE: false, VALIDATEUR: false, CONSULTANT: false } },
    { id: '15', moduleName: 'Profils & Sécurité', actionName: 'Gestion des Comptes Utilisateurs', actionCode: 'USER_MANAGE', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: false, VALIDATEUR: false, CONSULTANT: false } },
    { id: '16', moduleName: 'Documentation', actionName: 'Accès au Manuel d\'Utilisation', actionCode: 'MANUAL_VIEW', rolesAccess: { ADMIN: true, DRH: true, GESTIONNAIRE_PAIE: true, VALIDATEUR: true, CONSULTANT: true } }
  ];

  savedNotification = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('bpbf_habilitations_matrix');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((item: ActionPermission) => {
            const found = this.matrix.find(m => m.actionCode === item.actionCode || m.id === item.id);
            if (found && item.rolesAccess) {
              found.rolesAccess = { ...item.rolesAccess };
            }
          });
        }
      } catch (e) {}
    }
  }

  toggleAccess(item: ActionPermission, roleCode: string): void {
    item.rolesAccess[roleCode] = !item.rolesAccess[roleCode];
  }

  savePermissions(): void {
    localStorage.setItem('bpbf_habilitations_matrix', JSON.stringify(this.matrix));
    this.authService.refreshUserPermissions();
    this.savedNotification = true;
    setTimeout(() => {
      this.savedNotification = false;
    }, 3000);
  }
}
