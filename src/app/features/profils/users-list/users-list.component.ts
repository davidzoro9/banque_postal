import { Component, OnInit } from '@angular/core';
import { UtilisateurService, Utilisateur } from '../../grh/services/utilisateur.service';
import { RoleService, RoleItem } from '../services/role.service';

export interface UserAccount {
  id: string;
  idNum?: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
  dateCreation: string;
  dernierAcces?: string;
  avatarColor: string;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: false
})
export class UsersListComponent implements OnInit {
  usersList: UserAccount[] = [];
  filteredUsers: UserAccount[] = [];
  availableRoles: RoleItem[] = [];
  searchQuery = '';
  roleFilter = '';
  statusFilter = '';

  showDialog = false;
  editingUser: UserAccount | null = null;
  formModel: any = {
    username: '',
    nom: '',
    prenom: '',
    email: '',
    role: 'GESTIONNAIRE_PAIE',
    password: '',
    actif: true
  };

  constructor(
    private utilisateurService: UtilisateurService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (roles) => {
        if (roles && roles.length > 0) {
          this.availableRoles = roles;
        } else {
          this.availableRoles = this.getDefaultRoles();
        }
      },
      error: () => {
        this.availableRoles = this.getDefaultRoles();
      }
    });
  }

  getDefaultRoles(): RoleItem[] {
    return [
      { code: 'ADMIN', libelle: 'Administrateur Système' },
      { code: 'DRH', libelle: 'Directeur des Ressources Humaines' },
      { code: 'RESPONSABLE_RH', libelle: 'Responsable Administration RH' },
      { code: 'GESTIONNAIRE_PAIE', libelle: 'Gestionnaire de Paie' },
      { code: 'COMPTABLE_PAIE', libelle: 'Comptable Paie & Trésorerie' },
      { code: 'VALIDATEUR', libelle: 'Validateur Hiérarchique' },
      { code: 'CONSULTANT', libelle: 'Consultant / Auditeur' },
      { code: 'EMPLOYE', libelle: 'Collaborateur Salarié' },
      { code: 'AGENT', libelle: 'Agent Salarié' }
    ];
  }

  getRoleLabel(code: string): string {
    if (!code) return '-';
    const found = this.availableRoles.find(r => r.code === code);
    if (found) return found.libelle;
    const def = this.getDefaultRoles().find(r => r.code === code);
    return def ? def.libelle : code;
  }

  loadUsers(): void {
    this.utilisateurService.getAll().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const colors = ['#0060B3', '#1565c0', '#2e7d32', '#ef6c00', '#6a1b9a', '#0284c7', '#0d9488'];
          this.usersList = data.map((u, idx) => ({
            id: String(u.id || idx + 1),
            idNum: u.id,
            username: u.username || u.email || 'user',
            nom: u.nom || '',
            prenom: u.prenom || '',
            email: u.email || '',
            role: u.role || 'EMPLOYE',
            actif: u.actif !== false,
            dateCreation: 'Enregistré en Base',
            dernierAcces: 'Actif',
            avatarColor: colors[idx % colors.length]
          }));
        } else {
          this.usersList = [];
        }
        this.applyFilter();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs depuis PostgreSQL/Spring Boot:', err);
        this.usersList = [];
        this.applyFilter();
      }
    });
  }

  applyFilter(): void {
    let list = [...this.usersList];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(u =>
        (u.nom || '').toLowerCase().includes(q) ||
        (u.prenom || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      );
    }

    if (this.roleFilter) {
      list = list.filter(u => u.role === this.roleFilter);
    }

    if (this.statusFilter === 'active') {
      list = list.filter(u => u.actif);
    } else if (this.statusFilter === 'inactive') {
      list = list.filter(u => !u.actif);
    }

    this.filteredUsers = list;
  }

  openAddModal(): void {
    this.editingUser = null;
    this.formModel = {
      username: '',
      nom: '',
      prenom: '',
      email: '',
      role: 'GESTIONNAIRE_PAIE',
      password: '',
      actif: true
    };
    this.showDialog = true;
  }

  openEditModal(user: UserAccount): void {
    this.editingUser = user;
    this.formModel = { ...user, password: '' };
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
  }

  saveUser(): void {
    if (!this.formModel.username || !this.formModel.email || !this.formModel.nom) return;

    if (this.editingUser && this.editingUser.idNum) {
      const payload: Partial<Utilisateur> = {
        username: this.formModel.username,
        nom: this.formModel.nom,
        prenom: this.formModel.prenom,
        email: this.formModel.email,
        role: this.formModel.role,
        actif: this.formModel.actif ?? true
      };
      if (this.formModel.password) {
        payload.password = this.formModel.password;
      }

      this.utilisateurService.update(this.editingUser.idNum, payload).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la modification de l utilisateur:', err);
          alert("Erreur lors de l'enregistrement de l'utilisateur sur le serveur.");
        }
      });
    } else {
      const newUser: Omit<Utilisateur, 'id'> = {
        username: this.formModel.username,
        nom: this.formModel.nom,
        prenom: this.formModel.prenom,
        email: this.formModel.email,
        role: this.formModel.role,
        password: this.formModel.password || '1234',
        actif: this.formModel.actif ?? true
      };

      this.utilisateurService.create(newUser).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la création de l utilisateur:', err);
          alert("Erreur lors de la création de l'utilisateur sur le serveur.");
        }
      });
    }
  }

  toggleStatus(user: UserAccount): void {
    const newStatus = !user.actif;
    if (user.idNum) {
      this.utilisateurService.update(user.idNum, { actif: newStatus }).subscribe({
        next: () => this.loadUsers(),
        error: (err) => {
          console.error('Erreur lors de la modification du statut utilisateur:', err);
          alert("Impossible de modifier le statut sur le serveur.");
        }
      });
    }
  }

  resetPassword(user: UserAccount): void {
    const newPwd = prompt(`Nouveau mot de passe pour ${user.prenom} ${user.nom} :`, '1234');
    if (newPwd && user.idNum) {
      this.utilisateurService.updatePassword(user.idNum, newPwd).subscribe({
        next: () => alert(`Le mot de passe de ${user.prenom} ${user.nom} a été mis à jour avec succès.`),
        error: (err) => {
          console.error('Erreur mise à jour mot de passe:', err);
          alert(`Erreur lors de la mise à jour du mot de passe sur le serveur.`);
        }
      });
    }
  }

  deleteUser(user: UserAccount): void {
    if (confirm(`Voulez-vous supprimer le compte utilisateur ${user.username} ?`)) {
      if (user.idNum) {
        this.utilisateurService.delete(user.idNum).subscribe({
          next: () => this.loadUsers(),
          error: (err) => {
            console.error('Erreur lors de la suppression de l utilisateur:', err);
            alert("Erreur lors de la suppression de l'utilisateur sur le serveur.");
          }
        });
      }
    }
  }
}
