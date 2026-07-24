import { Component, OnInit } from '@angular/core';

export interface UserAccount {
  id: string;
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
  usersList: UserAccount[] = [
    {
      id: '1',
      username: 'davidzorom',
      nom: 'ZOROM',
      prenom: 'David',
      email: 'davidzorom9@gmail.com',
      role: 'ADMIN',
      actif: true,
      dateCreation: '2026-01-10',
      dernierAcces: 'Aujourd\'hui 09:25',
      avatarColor: '#0060B3'
    },
    {
      id: '2',
      username: 'marie.dupont',
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@entreprise.com',
      role: 'DRH',
      actif: true,
      dateCreation: '2026-02-01',
      dernierAcces: 'Aujourd\'hui 08:40',
      avatarColor: '#1565c0'
    },
    {
      id: '3',
      username: 'jean.martin',
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@entreprise.com',
      role: 'GESTIONNAIRE_PAIE',
      actif: true,
      dateCreation: '2026-02-15',
      dernierAcces: 'Hier 16:15',
      avatarColor: '#2e7d32'
    },
    {
      id: '4',
      username: 'sophie.bernard',
      nom: 'Bernard',
      prenom: 'Sophie',
      email: 'sophie.bernard@entreprise.com',
      role: 'VALIDATEUR',
      actif: true,
      dateCreation: '2026-03-01',
      dernierAcces: 'Hier 11:30',
      avatarColor: '#ef6c00'
    },
    {
      id: '5',
      username: 'paul.kaboro',
      nom: 'Kaboré',
      prenom: 'Paul',
      email: 'paul.kabore@entreprise.com',
      role: 'CONSULTANT',
      actif: false,
      dateCreation: '2026-03-10',
      dernierAcces: '14/07/2026',
      avatarColor: '#757575'
    }
  ];

  filteredUsers: UserAccount[] = [];
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

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let list = [...this.usersList];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(u =>
        u.nom.toLowerCase().includes(q) ||
        u.prenom.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
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

    if (this.editingUser) {
      Object.assign(this.editingUser, this.formModel);
    } else {
      const newUser: UserAccount = {
        id: String(Date.now()),
        username: this.formModel.username,
        nom: this.formModel.nom,
        prenom: this.formModel.prenom,
        email: this.formModel.email,
        role: this.formModel.role,
        actif: this.formModel.actif ?? true,
        dateCreation: new Date().toISOString().split('T')[0],
        dernierAcces: 'Jamais',
        avatarColor: '#0060B3'
      };
      this.usersList.push(newUser);
    }
    this.applyFilter();
    this.closeModal();
  }

  toggleStatus(user: UserAccount): void {
    user.actif = !user.actif;
    this.applyFilter();
  }

  resetPassword(user: UserAccount): void {
    alert(`Le mot de passe de ${user.prenom} ${user.nom} a été réinitialisé à "MotDePasse2026!"`);
  }

  deleteUser(user: UserAccount): void {
    if (confirm(`Voulez-vous supprimer le compte utilisateur ${user.username} ?`)) {
      this.usersList = this.usersList.filter(u => u.id !== user.id);
      this.applyFilter();
    }
  }
}
