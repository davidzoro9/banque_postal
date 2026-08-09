import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppModule, APP_MODULES } from '../models/app-module.model';
import { MenuItem } from '../models/menu-item.model';

export const DONNEES_BASE_MENUS: MenuItem[] = [
  {
    id: 'donnees-base-dashboard',
    label: 'Tableau de bord DB',
    icon: 'dashboard',
    route: '/donnees-base'
  },
  {
    id: 'donnees-base',
    label: 'Données de base',
    icon: 'storage',
    children: [
      { id: 'emploi',           label: 'Poste / Emploi',           icon: 'work',                route: '/donnees-base/admin/emploi'           },
      { id: 'fonction',         label: 'Fonction',                 icon: 'badge',               route: '/donnees-base/admin/fonction'         },
      { id: 'departement',      label: 'Département',              icon: 'domain',              route: '/donnees-base/admin/departement'      },
      { id: 'direction',        label: 'Direction',                icon: 'business',            route: '/donnees-base/admin/direction'        },
      { id: 'service',          label: 'Service',                  icon: 'group_work',          route: '/donnees-base/admin/service'          },

      { id: 'categorie',        label: 'Catégorie',                icon: 'category',           route: '/donnees-base/carriere/categorie'     },
      { id: 'grade',            label: 'Groupe',                   icon: 'military_tech',      route: '/donnees-base/carriere/grade'         },
      { id: 'param-groupe',     label: 'Paramétrage Groupe',       icon: 'tune',                route: '/donnees-base/carriere/param-groupe'   },
      { id: 'echelon',          label: 'Échelon',                  icon: 'signal_cellular_alt',route: '/donnees-base/carriere/echelon'        },
      { id: 'grille-salariale', label: 'Grille salariale',         icon: 'table_chart',         route: '/donnees-base/admin/grille-salariale' },

      { id: 'type-indemnite',   label: 'Liste des indemnités',     icon: 'paid',                route: '/donnees-base/admin/type-indemnite'   },
      { id: 'param-indemnite',  label: 'Indemnités',               icon: 'settings_suggest',   route: '/donnees-base/admin/param-indemnite'  },
      { id: 'param-retraite',   label: 'Paramétrage retraite',     icon: 'event_repeat',        route: '/donnees-base/admin/param-retraite'   },
      { id: 'param-prise-en-charge', label: 'Prise en charge famille', icon: 'family_restroom', route: '/donnees-base/admin/param-prise-en-charge' },
      { id: 'types-retenues',   label: 'Liste des retenues',       icon: 'money_off',           route: '/donnees-base/admin/type-retenue-employe' },
      { id: 'param-paie-taux',  label: 'Retenues par emploi',      icon: 'tune',                route: '/donnees-base/admin/type-retenue-emploi' },

      { id: 'agence',           label: 'Agence',                   icon: 'store',               route: '/donnees-base/admin/agence'           },
      { id: 'type-contrat',     label: 'Type contrat',             icon: 'article',             route: '/donnees-base/admin/type-contrat'     },
      { id: 'type-conge',       label: 'Type congé/absence',       icon: 'beach_access',        route: '/donnees-base/admin/type-conge'       },
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
      id: 'grh-dashboard',
      label: 'Tableau de bord GA',
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
        { id: 'fiche-infos-pro',    label: 'Informations professionnelles', icon: 'work',          route: '__emp__/infos-pro'       }
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
      id: 'paie-bulletins',
      label: 'Gestion de la Paie',
      icon: 'payments',
      children: [
        { id: 'bulletins', label: 'Bulletins de paie', icon: 'receipt', route: '/paie/bulletins/generer' },
        { id: 'generer',   label: 'Générer la paie',   icon: 'autorenew', route: '/paie/bulletins/generer' },
        { id: 'valider',   label: 'Valider la paie',   icon: 'verified', route: '/paie/bulletins/generer' },
        { id: 'cloture',   label: 'Clôture de paie',   icon: 'lock',     route: '/paie/bulletins/generer' },
        { id: 'historique',label: 'Historique',        icon: 'history',  route: '/paie/bulletins/historique' }
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
    { label: 'Tableau de bord', route: '/dashboard', icon: 'dashboard', color: '#1e293b' },
    { label: 'Employés', route: '/grh/employes', icon: 'badge', color: '#1e293b' },
    { label: 'Bulletins', route: '/paie/bulletins', icon: 'receipt', color: '#1e293b' },
    { label: 'Profils', route: '/profils/utilisateurs', icon: 'manage_accounts', color: '#1e293b' }
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
