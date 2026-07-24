import { Component, OnInit } from '@angular/core';

export interface RoleItem {
  id: string;
  code: string;
  libelle: string;
  description: string;
  nbUsers: number;
  badgeColor: string;
  actif: boolean;
  permissions: string[];
}

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
  standalone: false
})
export class RolesListComponent implements OnInit {
  rolesList: RoleItem[] = [
    {
      id: '1',
      code: 'ADMIN',
      libelle: 'Administrateur Système',
      description: 'Accès complet sans restriction à l\'ensemble des modules, configurations et données de l\'application.',
      nbUsers: 2,
      badgeColor: '#c62828',
      actif: true,
      permissions: ['TOUS_LES_ACCES', 'GESTION_UTILISATEURS', 'CLOTURE_PAIE', 'DONNEES_BASE_EDIT']
    },
    {
      id: '2',
      code: 'DRH',
      libelle: 'Directeur des Ressources Humaines',
      description: 'Supervision de la gestion du personnel, validation de la paie, accès aux bilans et rapports analytiques.',
      nbUsers: 1,
      badgeColor: '#1565c0',
      actif: true,
      permissions: ['GRH_FULL', 'PAIE_VALIDATION', 'RAPPORTS_GLOBAL', 'DOCUMENTATION_VIEW']
    },
    {
      id: '3',
      code: 'GESTIONNAIRE_PAIE',
      libelle: 'Gestionnaire de Paie',
      description: 'Calcul des salaires, gestion des indemnités, saisie des variables et génération des bulletins.',
      nbUsers: 4,
      badgeColor: '#2e7d32',
      actif: true,
      permissions: ['PAIE_CALCUL', 'PAIE_BULLETINS', 'VARIABLES_EDIT', 'INDEMNITES_MANAGE']
    },
    {
      id: '4',
      code: 'VALIDATEUR',
      libelle: 'Validateur / Chef de Département',
      description: 'Validation hiérarchique des absences, contrats, demandes de mobilité et aperçu des fiches de paie.',
      nbUsers: 3,
      badgeColor: '#ef6c00',
      actif: true,
      permissions: ['VALIDATION_CONGES', 'APERCU_BULLETINS', 'EMPLOYE_VIEW']
    },
    {
      id: '5',
      code: 'CONSULTANT',
      libelle: 'Auditeur / Consultant',
      description: 'Accès en lecture seule aux rapports, enregistrements et données pour besoins d\'audit.',
      nbUsers: 2,
      badgeColor: '#6a1b9a',
      actif: true,
      permissions: ['LECTURE_SEULE', 'EXPORT_RAPPORTS']
    }
  ];

  showDialog = false;
  editingRole: RoleItem | null = null;
  formModel: Partial<RoleItem> = {
    code: '',
    libelle: '',
    description: '',
    badgeColor: '#0060B3',
    actif: true
  };

  ngOnInit(): void {}

  openAddModal(): void {
    this.editingRole = null;
    this.formModel = {
      code: '',
      libelle: '',
      description: '',
      badgeColor: '#0060B3',
      actif: true
    };
    this.showDialog = true;
  }

  openEditModal(role: RoleItem): void {
    this.editingRole = role;
    this.formModel = { ...role };
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
  }

  saveRole(): void {
    if (!this.formModel.code || !this.formModel.libelle) return;

    if (this.editingRole) {
      Object.assign(this.editingRole, this.formModel);
    } else {
      const newRole: RoleItem = {
        id: String(Date.now()),
        code: (this.formModel.code || '').toUpperCase(),
        libelle: this.formModel.libelle || '',
        description: this.formModel.description || '',
        nbUsers: 0,
        badgeColor: this.formModel.badgeColor || '#0060B3',
        actif: this.formModel.actif ?? true,
        permissions: ['LECTURE_SEULE']
      };
      this.rolesList.push(newRole);
    }
    this.closeModal();
  }

  toggleStatus(role: RoleItem): void {
    role.actif = !role.actif;
  }

  deleteRole(role: RoleItem): void {
    if (confirm(`Voulez-vous vraiment supprimer le profil ${role.libelle} ?`)) {
      this.rolesList = this.rolesList.filter(r => r.id !== role.id);
    }
  }
}
