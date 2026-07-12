import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { ModuleNavService } from '../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../core/models/app-module.model';
import { DbRefService, RefItem } from '../../donnees-base/services/db-ref.service';
import { ParametresRhService, ParamItem } from '../services/parametres-rh.service';
import { UtilisateurService, Utilisateur } from '../services/utilisateur.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-parametres-rh',
  templateUrl: './parametres-rh.component.html',
  styleUrls: ['./parametres-rh.component.scss'],
  standalone: false
})
export class ParametresRhComponent implements OnInit {
  module = APP_MODULES.find(m => m.id === 'grh')!;

  typesContrats: ParamItem[] = [];
  statutsEmployes: ParamItem[] = [];
  motifsSortie: ParamItem[] = [];
  paramsSpecifiques: ParamItem[] = [];
  utilisateurs: Utilisateur[] = [];
  profils: RefItem[] = [];

  addForm!: FormGroup;
  userForm!: FormGroup;
  showAddForm: { [key: string]: boolean } = {};
  showAddUserForm = false;
  editingUser: Utilisateur | null = null;
  activeTab = 0;

  readonly tabs = ['typesContrats', 'statutsEmployes', 'motifsSortie', 'paramsSpecifiques', 'utilisateurs'];
  readonly tabLabels = ['Types de contrats', 'Statuts employés', 'Motifs de sortie', 'Paramètres spécifiques', 'Comptes Utilisateurs'];
  readonly tabIcons = ['article', 'toggle_on', 'logout', 'tune', 'people_alt'];

  constructor(
    private fb: FormBuilder,
    private moduleNav: ModuleNavService,
    private router: Router,
    private dbRefService: DbRefService,
    private paramsService: ParametresRhService,
    private utilisateurService: UtilisateurService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUser?.role !== 'ADMIN') {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.moduleNav.selectModule(this.module);
    this.buildAddForm();
    this.buildUserForm();
    this.loadAllParams();
    this.loadUtilisateurs();
    this.loadProfils();
  }

  private buildAddForm(): void {
    this.addForm = this.fb.group({
      libelle: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      actif: [true]
    });
  }

  private loadAllParams(): void {
    // 1. typesContrats via DbRefService
    this.dbRefService.getItems('type-contrat').subscribe({
      next: (items) => {
        this.typesContrats = items.map(i => ({
          id: i.id || '',
          type: 'typesContrats',
          code: i.code,
          libelle: i.libelle,
          description: i.description,
          actif: i.actif
        }));
      }
    });

    // 2. Other tabs via ParametresRhService
    this.paramsService.getByType('statutsEmployes').subscribe({
      next: (items) => {
        this.statutsEmployes = items;
        if (items.length === 0) {
          this.initDefaultStatuts();
        }
      }
    });

    this.paramsService.getByType('motifsSortie').subscribe({
      next: (items) => {
        this.motifsSortie = items;
        if (items.length === 0) {
          this.initDefaultMotifs();
        }
      }
    });

    this.paramsService.getByType('paramsSpecifiques').subscribe({
      next: (items) => {
        this.paramsSpecifiques = items;
        if (items.length === 0) {
          this.initDefaultParamsSpec();
        }
      }
    });
  }

  private initDefaultStatuts(): void {
    const defaults: Omit<ParamItem, 'id'>[] = [
      { type: 'statutsEmployes', libelle: 'Actif', code: 'ACTIF', description: 'Employé en activité', actif: true },
      { type: 'statutsEmployes', libelle: 'Inactif', code: 'INACTIF', description: 'Employé sans activité', actif: true },
      { type: 'statutsEmployes', libelle: 'Suspendu', code: 'SUSP', description: 'Contrat suspendu', actif: true },
      { type: 'statutsEmployes', libelle: "Période d'essai", code: 'ESSAI', description: "En cours de période d'essai", actif: true },
      { type: 'statutsEmployes', libelle: 'Congé maladie', code: 'MALADIE', description: 'En arrêt maladie', actif: true },
      { type: 'statutsEmployes', libelle: 'Détaché', code: 'DETACHE', description: 'Détachement temporaire', actif: true }
    ];
    const calls = defaults.map(d => this.paramsService.create(d));
    forkJoin(calls).subscribe({
      next: (res) => {
        this.statutsEmployes = res;
      }
    });
  }

  private initDefaultMotifs(): void {
    const defaults: Omit<ParamItem, 'id'>[] = [
      { type: 'motifsSortie', libelle: 'Démission', code: 'DEM', description: 'Départ volontaire', actif: true },
      { type: 'motifsSortie', libelle: 'Licenciement', code: 'LIC', description: 'Licenciement employeur', actif: true },
      { type: 'motifsSortie', libelle: 'Retraite', code: 'RET', description: 'Départ à la retraite', actif: true },
      { type: 'motifsSortie', libelle: 'Fin de contrat', code: 'FIN', description: 'Échéance du contrat CDD', actif: true },
      { type: 'motifsSortie', libelle: 'Décès', code: 'DEC', description: 'Décès du collaborateur', actif: true },
      { type: 'motifsSortie', libelle: 'Mutation', code: 'MUT', description: 'Mutation vers une autre structure', actif: true }
    ];
    const calls = defaults.map(d => this.paramsService.create(d));
    forkJoin(calls).subscribe({
      next: (res) => {
        this.motifsSortie = res;
      }
    });
  }

  private initDefaultParamsSpec(): void {
    const defaults: Omit<ParamItem, 'id'>[] = [
      { type: 'paramsSpecifiques', libelle: 'Durée période essai (CDI)', code: 'ESSAI_CDI', description: '3 mois renouvelable 1 fois', actif: true },
      { type: 'paramsSpecifiques', libelle: 'Durée période essai (CDD)', code: 'ESSAI_CDD', description: '1 mois', actif: true },
      { type: 'paramsSpecifiques', libelle: 'Préavis démission', code: 'PREAVIS_DEM', description: '1 mois pour non-cadres, 3 mois pour cadres', actif: true },
      { type: 'paramsSpecifiques', libelle: 'Congés annuels', code: 'CONGE_ANNUEL', description: '2,5 jours par mois travaillé', actif: true }
    ];
    const calls = defaults.map(d => this.paramsService.create(d));
    forkJoin(calls).subscribe({
      next: (res) => {
        this.paramsSpecifiques = res;
      }
    });
  }

  getItems(tab: string): ParamItem[] {
    return (this as any)[tab] as ParamItem[];
  }

  toggleAdd(tab: string): void {
    this.showAddForm[tab] = !this.showAddForm[tab];
    if (this.showAddForm[tab]) this.addForm.reset({ actif: true });
  }

  addItem(tab: string): void {
    if (this.addForm.invalid) return;
    const v = this.addForm.value;

    if (tab === 'typesContrats') {
      const item = {
        code: v.code,
        libelle: v.libelle,
        description: v.description || '',
        actif: v.actif ?? true
      };
      this.dbRefService.addItem('type-contrat', item).subscribe({
        next: (items) => {
          this.typesContrats = items.map(i => ({
            id: i.id || '',
            type: 'typesContrats',
            code: i.code,
            libelle: i.libelle,
            description: i.description,
            actif: i.actif
          }));
          this.toggleAdd(tab);
        }
      });
    } else {
      const item: Omit<ParamItem, 'id'> = {
        type: tab,
        code: v.code,
        libelle: v.libelle,
        description: v.description || '',
        actif: v.actif ?? true
      };
      this.paramsService.create(item).subscribe({
        next: (newItem) => {
          const list = this.getItems(tab);
          list.push(newItem);
          this.toggleAdd(tab);
        }
      });
    }
  }

  deleteItem(tab: string, id?: string): void {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer cet élément ?')) {
      if (tab === 'typesContrats') {
        const item = this.typesContrats.find(i => i.id === id);
        if (item) {
          this.dbRefService.deleteItem('type-contrat', item.code).subscribe({
            next: (items) => {
              this.typesContrats = items.map(i => ({
                id: i.id || '',
                type: 'typesContrats',
                code: i.code,
                libelle: i.libelle,
                description: i.description,
                actif: i.actif
              }));
            }
          });
        }
      } else {
        this.paramsService.delete(id).subscribe({
          next: () => {
            const arr = this.getItems(tab);
            const idx = arr.findIndex(i => i.id === id);
            if (idx !== -1) arr.splice(idx, 1);
          }
        });
      }
    }
  }

  toggleActif(item: ParamItem): void {
    const tab = this.tabs[this.activeTab];
    if (tab === 'typesContrats') {
      this.dbRefService.toggleItemStatus('type-contrat', item.code).subscribe({
        next: (items) => {
          this.typesContrats = items.map(i => ({
            id: i.id || '',
            type: 'typesContrats',
            code: i.code,
            libelle: i.libelle,
            description: i.description,
            actif: i.actif
          }));
        }
      });
    } else {
      const updated = { ...item, actif: !item.actif };
      if (item.id) {
        this.paramsService.update(item.id, updated).subscribe({
          next: (res) => {
            item.actif = res.actif;
          }
        });
      }
    }
  }

  private buildUserForm(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['ADMIN', Validators.required],
      actif: [true]
    });
  }

  loadUtilisateurs(): void {
    this.utilisateurService.getAll().subscribe({
      next: (res) => this.utilisateurs = res,
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  loadProfils(): void {
    this.dbRefService.getItems('profil').subscribe({
      next: (items) => {
        this.profils = items;
        if (items.length === 0) {
          this.initDefaultProfils();
        }
      }
    });
  }

  private initDefaultProfils(): void {
    const defaults = [
      { code: 'ADMIN', libelle: 'Administrateur', description: 'Accès complet', actif: true },
      { code: 'RH', libelle: 'Responsable RH', description: 'Gestion des ressources humaines', actif: true },
      { code: 'MANAGER', libelle: 'Manager', description: 'Gestion d\'équipe', actif: true },
      { code: 'EMPLOYE', libelle: 'Employé', description: 'Accès collaborateur', actif: true }
    ];
    const calls = defaults.map(d => this.dbRefService.addItem('profil', d));
    forkJoin(calls).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.profils = res[res.length - 1];
        }
      }
    });
  }

  toggleUserAdd(): void {
    this.showAddUserForm = !this.showAddUserForm;
    this.editingUser = null;
    this.userForm.reset({ role: 'ADMIN', actif: true });
  }

  editUser(u: Utilisateur): void {
    this.editingUser = u;
    this.showAddUserForm = true;
    this.userForm.patchValue({
      username: u.username,
      nom: u.nom,
      prenom: u.prenom,
      email: u.email,
      password: '',
      role: u.role,
      actif: u.actif
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) return;
    const v = this.userForm.value;

    if (this.editingUser && this.editingUser.id) {
      this.utilisateurService.update(this.editingUser.id, v).subscribe({
        next: () => {
          this.loadUtilisateurs();
          this.showAddUserForm = false;
          this.editingUser = null;
        },
        error: (err) => alert(err.message || 'Erreur lors de la mise à jour.')
      });
    } else {
      this.utilisateurService.create(v).subscribe({
        next: () => {
          this.loadUtilisateurs();
          this.showAddUserForm = false;
        },
        error: (err) => alert(err.message || 'Erreur lors de la création.')
      });
    }
  }

  deleteUser(id?: number): void {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.utilisateurService.delete(id).subscribe({
        next: () => this.loadUtilisateurs(),
        error: (err) => alert(err.message || 'Erreur lors de la suppression.')
      });
    }
  }

  toggleUserActif(u: Utilisateur): void {
    if (!u.id) return;
    const updated = { ...u, actif: !u.actif };
    this.utilisateurService.update(u.id, updated).subscribe({
      next: (res) => u.actif = res.actif,
      error: (err) => alert(err.message || 'Erreur lors du changement de statut.')
    });
  }

  changeUserPassword(u: Utilisateur): void {
    const newPass = prompt('Saisissez le nouveau mot de passe pour ' + u.prenom + ' ' + u.nom + ' :');
    if (newPass && newPass.trim()) {
      this.utilisateurService.updatePassword(u.id!, newPass.trim()).subscribe({
        next: () => alert('Mot de passe mis à jour avec succès.'),
        error: (err) => alert(err.message || 'Erreur lors du changement de mot de passe.')
      });
    }
  }
}
