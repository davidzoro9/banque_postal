import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppModule, APP_MODULES } from '../models/app-module.model';
import { MenuItem } from '../models/menu-item.model';

const FULL_REF_AND_PARAM_MENUS: MenuItem[] = [
  {
    id: 'gestion-admin',
    label: 'Gestion administrative',
    icon: 'admin_panel_settings',
    children: [
      { id: 'emploi',           label: 'Emploi',                   icon: 'work',                route: '/donnees-base/admin/emploi'           },
      { id: 'fonction',         label: 'Fonction',                 icon: 'badge',               route: '/donnees-base/admin/fonction'         },
      { id: 'agence',           label: 'Agence',                   icon: 'store',               route: '/donnees-base/admin/agence'           },
      { id: 'departement',      label: 'Département',              icon: 'domain',              route: '/donnees-base/admin/departement'      },
      { id: 'direction',        label: 'Direction',                icon: 'business',            route: '/donnees-base/admin/direction'        },
      { id: 'service',          label: 'Service',                  icon: 'group_work',          route: '/donnees-base/admin/service'          },

      { id: 'grade',            label: 'Groupe',                   icon: 'military_tech',      route: '/donnees-base/carriere/grade'         },
      { id: 'categorie',        label: 'Catégorie',                icon: 'category',           route: '/donnees-base/carriere/categorie'     },
      { id: 'echelon',          label: 'Échelon',                  icon: 'signal_cellular_alt',route: '/donnees-base/carriere/echelon'        },
      { id: 'grille-salariale', label: 'Grille salariale',         icon: 'table_chart',         route: '/donnees-base/admin/grille-salariale' },

      { id: 'type-indemnite',   label: 'Type indemnité',           icon: 'paid',                route: '/donnees-base/admin/type-indemnite'   },
      { id: 'param-indemnite',  label: 'Indemnité',                icon: 'settings_suggest',   route: '/donnees-base/admin/param-indemnite'  },
      { id: 'types-retenues',   label: 'Type retenu',              icon: 'money_off',           route: '/paie/types-retenues'                 },
      { id: 'param-paie-taux',  label: 'Retenu',                   icon: 'tune',                route: '/paie/parametrage'                    },
      { id: 'ville',            label: 'Villes',                   icon: 'location_city',        route: '/donnees-base/admin/ville'            },
      { id: 'competences',      label: 'Référentiel compétences',  icon: 'psychology',         route: '/donnees-base/carriere/competences'   },
      { id: 'type-formation',   label: 'Type de formation',        icon: 'school',             route: '/donnees-base/carriere/type-formation'},
      { id: 'type-evaluation',  label: "Type d'évaluation",        icon: 'star_rate',          route: '/donnees-base/carriere/type-evaluation'}
    ]
  },
  {
    id: 'paie-section',
    label: 'Paie',
    icon: 'payments',
    children: [
      { id: 'rubrique',         label: 'Rubrique de paie',         icon: 'receipt_long',        route: '/donnees-base/paie/rubrique'          },
      { id: 'bareme',           label: 'Barème fiscal',            icon: 'calculate',           route: '/donnees-base/paie/bareme'            },
      { id: 'mode-paiement',    label: 'Mode de paiement',         icon: 'payments',            route: '/donnees-base/paie/mode-paiement'     }
    ]
  }
];

export const MODULE_MENUS: Record<string, MenuItem[]> = {
  grh: [
    {
      id: 'employes',
      label: 'Employés',
      icon: 'badge',
      children: [
        { id: 'liste-employes',     label: 'Liste des employés',      icon: 'list_alt',              route: '/grh/employes'           },
        { id: 'fiche-infos-perso',  label: 'Infos personnelles',      icon: 'person',                route: '__emp__/infos-personnelles' },
        { id: 'fiche-infos-pro',    label: 'Poste & Structure',       icon: 'work',                  route: '__emp__/infos-pro'       },
        { id: 'fiche-famille',      label: 'Famille',                 icon: 'family_restroom',        route: '__emp__/famille'         },
        { id: 'fiche-categorie',    label: 'Catégorie',               icon: 'military_tech',          route: '__emp__/categorie'       },
        { id: 'fiche-indemnites',   label: 'Indemnités',              icon: 'paid',                   route: '__emp__/indemnites'      },
        { id: 'fiche-exonerations', label: 'Exonérations',            icon: 'receipt_long',           route: '__emp__/exonerations'    },
        { id: 'fiche-salaire',      label: 'Info. sur le salaire',    icon: 'account_balance_wallet', route: '__emp__/salaire'         },
        { id: 'fiche-dossier',      label: 'Dossier individuel',      icon: 'folder_open',            route: '__emp__/dossier'         },
        { id: 'fiche-notes-rh',     label: 'Notes RH',                icon: 'note_alt',               route: '__emp__/notes-rh'        },
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
      id: 'bulletins',
      label: 'Bulletins de paie',
      icon: 'receipt_long',
      children: [
        { id: 'generer', label: 'Générer les bulletins', icon: 'add_circle_outline', route: '/paie/bulletins/generer' },
        { id: 'historique', label: 'Historique', icon: 'history', route: '/paie/bulletins/historique' }
      ]
    },
    {
      id: 'elements',
      label: 'Éléments de paie',
      icon: 'calculate',
      children: [
        { id: 'rubriques', label: 'Rubriques de paie', icon: 'list', route: '/paie/elements/rubriques' },
        { id: 'cotisations', label: 'Cotisations', icon: 'percent', route: '/paie/elements/cotisations' }
      ]
    },
    {
      id: 'retenues-group',
      label: 'Retenues sur Salaire',
      icon: 'money_off',
      children: [
        { id: 'types-retenues',   label: 'Type de retenue',      icon: 'money_off', route: '/paie/types-retenues' },
        { id: 'parametrage-paie', label: 'Paramétrage retenue',   icon: 'tune',      route: '/paie/parametrage' }
      ]
    },
    {
      id: 'declarations',
      label: 'Déclarations sociales',
      icon: 'send',
      children: [
        { id: 'dsn', label: 'DSN', icon: 'description', route: '/paie/declarations/dsn' },
        { id: 'urssaf', label: 'URSSAF', icon: 'account_balance', route: '/paie/declarations/urssaf' }
      ]
    }
  ],
  'donnees-base': FULL_REF_AND_PARAM_MENUS,
  'profils': [
    {
      id: 'securite-droits',
      label: 'Sécurité & Droits',
      icon: 'admin_panel_settings',
      children: [
        { id: 'profils-roles',   label: 'Profils & Rôles',          icon: 'badge',            route: '/profils/roles' },
        { id: 'profil-ref',      label: 'Référentiel Profil / Rôle',icon: 'admin_panel_settings', route: '/donnees-base/admin/profil' },
        { id: 'habilitations',   label: 'Matrice des Habilitations',icon: 'rule',             route: '/profils/habilitations' },
        { id: 'utilisateurs',    label: 'Gestion des Utilisateurs', icon: 'manage_accounts',  route: '/profils/utilisateurs' }
      ]
    },
    {
      id: 'documentation',
      label: 'Documentation & Aide',
      icon: 'menu_book',
      children: [
        { id: 'manuel-utilisateur', label: "Manuel d'utilisation",  icon: 'auto_stories',    route: '/profils/manuel' }
      ]
    }
  ]
};

export interface QuickLink {
  label: string;
  icon: string;
  route: string;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class ModuleNavService {
  readonly modules: AppModule[] = APP_MODULES;
  private activeModuleSubject = new BehaviorSubject<AppModule | null>(null);
  private drawerOpenSubject = new BehaviorSubject<boolean>(true);
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);

  activeModule$: Observable<AppModule | null> = this.activeModuleSubject.asObservable();
  drawerOpen$: Observable<boolean> = this.drawerOpenSubject.asObservable();
  sidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

  get activeModule(): AppModule | null {
    return this.activeModuleSubject.value;
  }

  readonly quickLinks: QuickLink[] = [
    { label: 'Employés',    icon: 'badge',         route: '/grh/employes',             color: '#0060B3' },
    { label: 'Données Base',icon: 'storage',       route: '/donnees-base',             color: '#CC8800' },
    { label: 'Bulletins',   icon: 'receipt_long',  route: '/paie/bulletins/historique', color: '#1B3A6B' },
    { label: 'Organigramme',icon: 'account_tree',  route: '/grh/organigramme',         color: '#004080' }
  ];

  constructor() {
    this.selectModule(APP_MODULES[0]);
  }

  selectModule(module: AppModule): void {
    this.activeModuleSubject.next(module);
  }

  clearModule(): void {
    this.activeModuleSubject.next(null);
  }

  getMenuItemsForModule(moduleId: string): MenuItem[] {
    return MODULE_MENUS[moduleId] || [];
  }

  getMenuForActiveModule(): MenuItem[] {
    const active = this.activeModule;
    return active ? this.getMenuItemsForModule(active.id) : [];
  }

  toggleDrawer(): void {
    this.drawerOpenSubject.next(!this.drawerOpenSubject.value);
  }

  setDrawerOpen(open: boolean): void {
    this.drawerOpenSubject.next(open);
  }

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpenSubject.next(open);
  }
}

