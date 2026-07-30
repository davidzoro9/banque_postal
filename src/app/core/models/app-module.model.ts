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
    color: '#0060B3',
    gradientFrom: '#004080',
    gradientTo: '#0060B3',
    route: '/grh',
    description: 'Gestion des collaborateurs, présences et recrutement',
    permissions: ['grh.view']
  },
  {
    id: 'paie',
    name: 'Gestion de la Paie',
    shortName: 'PAIE',
    icon: 'payments',
    color: '#008060',
    gradientFrom: '#004A38',
    gradientTo: '#008060',
    route: '/paie',
    description: 'Bulletins de paie, déclarations et cotisations',
    permissions: ['paie.view']
  },
  {
    id: 'donnees-base',
    name: 'Données de Base',
    shortName: 'DB',
    icon: 'storage',
    color: '#0060B3',
    gradientFrom: '#0A3C74',
    gradientTo: '#1D6FB8',
    route: '/donnees-base',
    description: 'Structure organisationnelle et référentiels de base',
    permissions: ['donnees-base.view']
  },
  {
    id: 'profils',
    name: 'Profils & Habilitations',
    shortName: 'PROFIL',
    icon: 'admin_panel_settings',
    color: '#4B3F72',
    gradientFrom: '#2A1F4E',
    gradientTo: '#5B488C',
    route: '/profils',
    description: 'Gestion des profils, rôles, droits d\'accès, utilisateurs et manuel d\'utilisation',
    permissions: ['profils.view']
  }
];

