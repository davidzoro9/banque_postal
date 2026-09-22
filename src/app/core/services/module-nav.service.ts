import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppModule, APP_MODULES } from '../models/app-module.model';
import { MenuItem } from '../models/menu-item.model';

export const DONNEES_BASE_MENUS: MenuItem[] = [
  {
    id: 'donnees-base-dashboard',
    label: 'Tableau de bord Paramètres Généraux',
    icon: 'dashboard',
    route: '/donnees-base'
  },
  {
    id: 'donnees-base',
    label: 'Paramètres généraux',
    icon: 'storage',
    children: [
      { id: 'emploi',           label: 'Poste / Emploi',           icon: 'work',                route: '/donnees-base/admin/emploi'           },
      { id: 'fonction',         label: 'Fonction',                 icon: 'badge',               route: '/donnees-base/admin/fonction'         },
      { id: 'banque',           label: 'Banque',                   icon: 'money_on',            route: '/donnees-base/admin/banque'            },
      { id: 'agence',           label: 'Agence',                   icon: 'store',               route: '/donnees-base/admin/agence'           },
      { id: 'direction',        label: 'Directions',               icon: 'business',            route: '/donnees-base/admin/direction'        },
      { id: 'departement',      label: 'Départements',             icon: 'domain',              route: '/donnees-base/admin/departement'      },
      { id: 'service',          label: 'Services',                 icon: 'group_work',          route: '/donnees-base/admin/service'          },
      { id: 'grade',            label: 'Groupe',                   icon: 'military_tech',      route: '/donnees-base/carriere/grade'         },
      { id: 'categorie',        label: 'Catégorie / Classe',       icon: 'category',           route: '/donnees-base/carriere/categorie'     },
      { id: 'echelon',          label: 'Échelon',                  icon: 'signal_cellular_alt',route: '/donnees-base/carriere/echelon'        },
      { id: 'grille-salariale', label: 'Grille salariale',         icon: 'table_chart',         route: '/donnees-base/admin/grille-salariale' },
      { id: 'type-indemnite',   label: 'Liste des indemnités',     icon: 'paid',                route: '/donnees-base/admin/type-indemnite'   },
      { id: 'regime-securite-social', label: 'Régimes de sécurité sociale', icon: 'health_and_safety', route: '/donnees-base/admin/regimes-securite-sociale' },
      { id: 'types-retenues',   label: 'Types de retenues',        icon: 'money_off',           route: '/donnees-base/admin/type-retenue-employe' },
      { id: 'type-contrat',     label: 'Type contrat',             icon: 'article',             route: '/donnees-base/admin/type-contrat'     },
      { id: 'type-conge',       label: 'Type congé/absence',       icon: 'beach_access',        route: '/donnees-base/admin/type-conge'       },
      { id: 'param-groupe',     label: 'Paramétrage Groupe',       icon: 'tune',                route: '/donnees-base/carriere/param-groupe'   },
      { id: 'param-indemnite',  label: 'Grille indemnitaire',      icon: 'settings_suggest',   route: '/donnees-base/admin/param-indemnite'  },
      { id: 'param-paie-taux',  label: 'Paramétrage Retenues',     icon: 'tune',                route: '/donnees-base/admin/type-retenue-emploi' },
      { id: 'param-retraite',   label: 'Paramétrage retraite',     icon: 'event_repeat',        route: '/donnees-base/admin/param-retraite'   },
    ]
  },
  {
    id: 'donnees-base-param-paie',
    label: 'Paramétrage de la Paie',
    icon: 'tune',
    children: [
      { id: 'categories-elements', label: "Catégories d'Éléments de Salaire", icon: 'category', route: '/paie/parametrage/categories' },
      { id: 'elements-salaire', label: 'Éléments de Salaire', icon: 'format_list_numbered', route: '/paie/parametrage/elements' }
    ]
  }
];

export const MODULE_MENUS: Record<string, MenuItem[]> = {
  grh: [
    {
      id: 'grh-dashboard',
      label: 'Tableau de bord Gest Admin',
      icon: 'dashboard',
      route: '/grh'
    },
    {
      id: 'employes',
      label: 'Employés',
      icon: 'badge',
      children: [
        { id: 'liste-employes',     label: 'Liste des employés',      icon: 'list_alt',              route: '/grh/employes'           },
        { id: 'fiche-infos-perso',  label: 'Infos personnelles',      icon: 'person',                route: '__emp__/infos-personnelles' },
        { id: 'fiche-infos-pro',    label: 'Infos professionnelles',  icon: 'work',                  route: '__emp__/infos-pro'       }
      ]
    },
    {
      id: 'presence',
      label: 'Présence & Absences',
      icon: 'event_available',
      children: [
        { id: 'conges', label: 'Congés', icon: 'beach_access', route: '/grh/conges', badge: 5 },
        { id: 'absences', label: 'Absences', icon: 'event_busy', route: '/grh/absences' }
      ]
    },
    {
      id: 'contrats',
      label: 'Contrats',
      icon: 'article',
      children: [
        { id: 'liste-contrats', label: 'Liste des contrats', icon: 'list_alt', route: '/grh/contrats' },
        { id: 'renouvellements', label: 'Renouvellements', icon: 'autorenew', route: '/grh/contrats/renouvellements', badge: 3 }
      ]
    }
  ],
  paie: [
    {
      id: 'paie-dashboard',
      label: 'Tableau de bord Paie',
      icon: 'dashboard',
      route: '/paie'
    },
    {
      id: 'paie-gestion',
      label: 'Gestion de la Paie',
      icon: 'payments',
      children: [
        { id: 'bulletin-lot', label: 'Génération de bulletin', icon: 'layers', route: '/paie/lots' },
        { id: 'avoirs', label: 'Rappels', icon: 'history_edu', route: '/paie/variables/avoirs' },
        { id: 'trop-percus', label: 'Trop-perçus', icon: 'history_toggle_drop_down', route: '/paie/variables/trop-percus' },
        { id: 'precomptes', label: 'Précomptes', icon: 'credit_card_off', route: '/paie/variables/precomptes' },
        { id: 'etats-synthese', label: 'États de synthèse', icon: 'assessment', route: '/paie/etats-synthese' }
      ]
    }
  ],
  conges: [
    {
      id: 'conges-dashboard',
      label: 'Tableau de bord Congés',
      icon: 'dashboard',
      route: '/grh/conges'
    },
    {
      id: 'conges-gestion',
      label: 'Gestion des Congés & Absences',
      icon: 'beach_access',
      children: [
        { id: 'liste-demandes', label: 'Demandes de Congés', icon: 'list_alt', route: '/grh/conges' },
        { id: 'nouvelle-demande', label: 'Nouvelle Demande', icon: 'add_circle', route: '/grh/conges/nouveau' },
        { id: 'soldes-agents', label: 'Soldes des Agents', icon: 'account_balance_wallet', route: '/grh/conges/soldes' },
        { id: 'planning-departs', label: 'Planning des Départs', icon: 'calendar_month', route: '/grh/conges/planning' },
        { id: 'jours-feries', label: 'Jours Fériés Légaux', icon: 'event_available', route: '/grh/conges/feries' }
      ]
    }
  ],
  carrieres: [
    {
      id: 'carrieres-dashboard',
      label: 'Tableau de bord GPEC',
      icon: 'dashboard',
      route: '/carrieres'
    },
    {
      id: 'carrieres-gpec',
      label: 'GPEC & Formations',
      icon: 'trending_up',
      children: [
        { id: 'evaluations', label: 'Évaluations', icon: 'star', route: '/carrieres/evaluations' },
        { id: 'mobilite', label: 'Mobilité & Promotions', icon: 'alt_route', route: '/carrieres/mobilite' },
        { id: 'formations', label: 'Plan de formation', icon: 'school', route: '/carrieres/formations' }
      ]
    }
  ],
  'donnees-base': DONNEES_BASE_MENUS,
  profils: [
    {
      id: 'profils-dashboard',
      label: 'Tableau de bord Profils',
      icon: 'dashboard',
      route: '/profils'
    },
    {
      id: 'securite-droits',
      label: 'Sécurité & Droits',
      icon: 'admin_panel_settings',
      children: [
        { id: 'utilisateurs',   label: 'Gestion Utilisateurs',   icon: 'manage_accounts', route: '/profils/utilisateurs' },
        { id: 'profils-roles',  label: 'Profils / Rôles',        icon: 'groups',          route: '/profils/roles' },
        { id: 'habilitations',  label: 'Matrice Habilitations',  icon: 'rule',            route: '/profils/habilitations' }
      ]
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class ModuleNavService {
  modules = APP_MODULES;

  private activeModuleSubject = new BehaviorSubject<AppModule | null>(APP_MODULES[0]);
  activeModule$: Observable<AppModule | null> = this.activeModuleSubject.asObservable();

  private drawerOpenSubject = new BehaviorSubject<boolean>(true);
  drawerOpen$: Observable<boolean> = this.drawerOpenSubject.asObservable();
  sidebarOpen$: Observable<boolean> = this.drawerOpenSubject.asObservable();

  quickLinks = [
    { label: 'Tableau de bord', route: '/dashboard', icon: 'dashboard', color: '#0060B3' },
    { label: 'Employés', route: '/grh/employes', icon: 'badge', color: '#0060B3' },
    { label: 'Génération bulletins', route: '/paie/lots', icon: 'receipt', color: '#0060B3' },
    { label: 'Profils', route: '/profils/utilisateurs', icon: 'manage_accounts', color: '#0060B3' }
  ];

  get activeModule(): AppModule | null {
    return this.activeModuleSubject.getValue();
  }

  get drawerOpen(): boolean {
    return this.drawerOpenSubject.getValue();
  }

  selectModule(module: AppModule): void {
    this.activeModuleSubject.next(module);
  }

  clearModule(): void {
    this.activeModuleSubject.next(null);
  }

  toggleDrawer(): void {
    this.drawerOpenSubject.next(!this.drawerOpen);
  }

  toggleSidebar(): void {
    this.toggleDrawer();
  }

  getMenuForActiveModule(): MenuItem[] {
    const mod = this.activeModule;
    if (!mod) return [];
    return MODULE_MENUS[mod.id] || [];
  }
}
