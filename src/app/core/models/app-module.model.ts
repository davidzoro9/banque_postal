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
    shortName: 'GA',
    icon: 'people',
    color: '#0284c7',
    gradientFrom: '#0284c7',
    gradientTo: '#0369a1',
    route: '/grh',
    description: 'Gestion des collaborateurs, présences et recrutement',
    permissions: ['grh.view']
  },
  {
    id: 'paie',
    name: 'Gestion de la Paie',
    shortName: 'PAIE',
    icon: 'payments',
    color: '#059669',
    gradientFrom: '#059669',
    gradientTo: '#047857',
    route: '/paie',
    description: 'Bulletins de paie, déclarations et cotisations',
    permissions: ['paie.view']
  },
  {
    id: 'conges',
    name: 'Congés & Absences',
    shortName: 'CONGÉS',
    icon: 'beach_access',
    color: '#d97706',
    gradientFrom: '#d97706',
    gradientTo: '#b45309',
    route: '/grh/conges',
    description: 'Demandes de congés, soldes, planning des départs et jours fériés légaux',
    permissions: ['conges.view']
  },
  {
    id: 'donnees-base',
    name: 'Données de Base',
    shortName: 'DB',
    icon: 'storage',
    color: '#4f46e5',
    gradientFrom: '#4f46e5',
    gradientTo: '#4338ca',
    route: '/donnees-base',
    description: 'Structure organisationnelle et référentiels de base',
    permissions: ['donnees-base.view']
  },
  {
    id: 'profils',
    name: 'Profils & Habilitations',
    shortName: 'PROFIL',
    icon: 'admin_panel_settings',
    color: '#7c3aed',
    gradientFrom: '#7c3aed',
    gradientTo: '#6d28d9',
    route: '/profils',
    description: 'Gestion des profils, rôles, droits d\'accès, utilisateurs et manuel d\'utilisation',
    permissions: ['profils.view']
  }
];
