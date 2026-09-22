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
        { id: 'precomptes', label: 'Précomptes', icon: 'credit_card_off', route: '/paie/variables/precomptes' }
      ]
    },
    {
      id: 'etats-synthese',
      label: 'États de synthèse',
      icon: 'assessment',
      children: [
        { id: 'etat-livre-paie', label: 'Livre de Paie', icon: 'menu_book', route: '/paie/etats-synthese/livre-paie' },
        { id: 'etat-nominatif', label: 'État nominatif de paie', icon: 'badge', route: '/paie/etats-synthese/nominatif' },
        { id: 'etat-direction', label: 'État salaire par direction', icon: 'payments', route: '/paie/etats-synthese/direction' },
        { id: 'etat-banque', label: 'État par banque (Virements)', icon: 'account_balance', route: '/paie/etats-synthese/banque' },
        { id: 'etat-cnss', label: 'État Cotisation CNSS', icon: 'security', route: '/paie/etats-synthese/cnss' },
        { id: 'etat-iuts', label: 'État IUTS', icon: 'receipt_long', route: '/paie/etats-synthese/iuts' },
        { id: 'etat-precompte', label: 'État Précompte', icon: 'credit_card_off', route: '/paie/etats-synthese/precompte' },
        { id: 'etat-fsp', label: 'État FSP (Soutien Patriotique)', icon: 'shield', route: '/paie/etats-synthese/fsp' },
        { id: 'etat-mutuelle', label: 'État Mutuelle', icon: 'health_and_safety', route: '/paie/etats-synthese/mutuelle' },
        { id: 'etat-type-employe', label: 'État élément type employé', icon: 'people', route: '/paie/etats-synthese/type-employe' },
        { id: 'etat-elements-salaire', label: 'État Éléments De Salaire', icon: 'pie_chart', route: '/paie/etats-synthese/elements-salaire' },
        { id: 'etat-bulletin', label: 'État Bulletin (Contrôle exhaustif)', icon: 'rule', route: '/paie/etats-synthese/bulletin' }
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
      label: 'GPEC & Compétences',
      icon: 'trending_up',
      children: [
        { id: 'competences', label: 'Référentiel Compétences', icon: 'psychology', route: '/carrieres/competences' },
        { id: 'evaluations', label: 'Évaluations & Entretiens', icon: 'star', route: '/carrieres/evaluations' },
        { id: 'mobilite', label: 'Mobilité & Promotions', icon: 'alt_route', route: '/carrieres/mobilite' },
        { id: 'formations', label: 'Plan de Formation', icon: 'school', route: '/carrieres/formations' }
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

  private menuUpdatedSubject = new BehaviorSubject<void>(undefined);
  menuUpdated$: Observable<void> = this.menuUpdatedSubject.asObservable();

  getMenuForActiveModule(): MenuItem[] {
    const mod = this.activeModule;
    if (!mod) return [];
    return MODULE_MENUS[mod.id] || [];
  }

  updateEtatsSyntheseSubmenus(configs: Array<{ code: string; libelle: string; icon?: string; actif?: boolean }>): void {
    const paieMenus = MODULE_MENUS['paie'];
    if (!paieMenus) return;
    const etatsGroup = paieMenus.find(m => m.id === 'etats-synthese');
    if (etatsGroup) {
      etatsGroup.children = configs
        .filter(c => c.actif !== false)
        .map(c => ({
          id: `etat-${c.code.toLowerCase().replace(/_/g, '-')}`,
          label: c.libelle,
          icon: c.icon || 'assessment',
          route: `/paie/etats-synthese/${this.slugifyCode(c.code)}`
        }));
      this.menuUpdatedSubject.next();
    }
  }

  private slugifyCode(code: string): string {
    const CODE_TO_SLUG: Record<string, string> = {
      'LIVRE_PAIE': 'livre-paie',
      'ETAT_NOMINATIF': 'nominatif',
      'ETAT_SALAIRE': 'direction',
      'ETAT_BANQUE': 'banque',
      'ETAT_CNSS': 'cnss',
      'ETAT_IUTS': 'iuts',
      'ETAT_PRECOMPTE': 'precompte',
      'ETAT_FSP': 'fsp',
      'ETAT_MUTUELLE': 'mutuelle',
      'ETAT_TYPE_EMPLOYE': 'type-employe',
      'ETAT_ELEMENT_SALAIRE': 'elements-salaire',
      'ETAT_ELEMENTS_SALAIRE': 'elements-salaire',
      'ETAT_BULLETIN': 'bulletin'
    };
    return CODE_TO_SLUG[code] || code.toLowerCase().replace(/_/g, '-');
  }
}
