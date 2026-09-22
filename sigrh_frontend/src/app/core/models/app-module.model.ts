export interface AppModule {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  route: string;
  description: string;
  permissions: string[];
}

export const APP_MODULES: AppModule[] = [
  {
    id: 'grh',
    name: 'Gestion Administrative',
    shortName: 'Gest Admin',
    icon: 'people',
    color: '#0060B3',
    gradientFrom: '#0060B3',
    gradientTo: '#004885',
    route: '/grh',
    description: 'Gestion des collaborateurs, présences et recrutement',
    permissions: ['grh.view']
  },
  {
    id: 'paie',
    name: 'Gestion de la Paie',
    shortName: 'PAIE',
    icon: 'payments',
    color: '#0060B3',
    gradientFrom: '#0060B3',
    gradientTo: '#004885',
    route: '/paie',
    description: 'Bulletins de paie, déclarations et cotisations',
    permissions: ['paie.view']
  },
  {
    id: 'conges',
    name: 'Congés & Absences',
    shortName: 'CONGÉS',
    icon: 'beach_access',
    color: '#0060B3',
    gradientFrom: '#0060B3',
    gradientTo: '#004885',
    route: '/grh/conges',
    description: 'Demandes de congés, soldes, planning des départs et jours fériés légaux',
    permissions: ['conges.view']
  },
  {
    id: 'donnees-base',
    name: 'Paramètres Généraux',
    shortName: 'Paramètres généraux',
    icon: 'storage',
    color: '#0060B3',
    gradientFrom: '#0060B3',
    gradientTo: '#004885',
    route: '/donnees-base',
    description: 'Structure organisationnelle et référentiels de base',
    permissions: ['donnees-base.view']
  },
  {
    id: 'profils',
    name: 'Profils & Habilitations',
    shortName: 'PROFIL',
    icon: 'admin_panel_settings',
    color: '#0060B3',
    gradientFrom: '#0060B3',
    gradientTo: '#004885',
    route: '/profils',
    description: 'Gestion des profils, rôles, droits d\'accès, utilisateurs et manuel d\'utilisation',
    permissions: ['profils.view']
  }
];
