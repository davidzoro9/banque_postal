import { Component, OnInit } from '@angular/core';
import { RoleItem, RoleService } from '../services/role.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
  standalone: false
})
export class RolesListComponent implements OnInit {
  rolesList: RoleItem[] = [];
  loading: boolean = false;
  errorMsg: string = '';

  showDialog = false;
  editingRole: RoleItem | null = null;
  formModel: Partial<RoleItem> = {
    code: '',
    libelle: '',
    description: '',
    badgeColor: '#0060B3',
    actif: true
  };

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.chargerRoles();
  }

  chargerRoles(): void {
    this.loading = true;
    this.errorMsg = '';
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.rolesList = roles || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement rôles API:', err);
        this.errorMsg = 'Impossible de charger les rôles depuis PostgreSQL.';
        this.loading = false;
      }
    });
  }

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

    if (this.editingRole && this.editingRole.id) {
      this.roleService.update(this.editingRole.id, this.formModel).subscribe({
        next: () => {
          this.closeModal();
          this.chargerRoles();
        },
        error: (err) => {
          console.error('Erreur update rôle:', err);
          alert('Erreur lors de la mise à jour du rôle.');
        }
      });
    } else {
      const payload: Partial<RoleItem> = {
        code: (this.formModel.code || '').toUpperCase().trim(),
        libelle: this.formModel.libelle || '',
        description: this.formModel.description || '',
        badgeColor: this.formModel.badgeColor || '#0060B3',
        actif: this.formModel.actif ?? true,
        permissions: ['LECTURE_SEULE']
      };

      this.roleService.create(payload).subscribe({
        next: () => {
          this.closeModal();
          this.chargerRoles();
        },
        error: (err) => {
          console.error('Erreur création rôle:', err);
          alert('Erreur lors de la création du rôle.');
        }
      });
    }
  }

  toggleStatus(role: RoleItem): void {
    if (!role.id) return;
    const updated = { ...role, actif: !role.actif };
    this.roleService.update(role.id, updated).subscribe({
      next: () => this.chargerRoles(),
      error: (err) => console.error('Erreur toggle statut rôle:', err)
    });
  }

  deleteRole(role: RoleItem): void {
    if (!role.id) return;
    if (confirm(`Voulez-vous vraiment supprimer le profil ${role.libelle} ?`)) {
      this.roleService.delete(role.id).subscribe({
        next: () => this.chargerRoles(),
        error: (err) => {
          console.error('Erreur delete rôle:', err);
          alert('Erreur lors de la suppression du rôle.');
        }
      });
    }
  }
}
