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
    color: '#1e293b',
    gradientFrom: '#0f172a',
    gradientTo: '#1e293b',
    route: '/grh',
    description: 'Gestion des collaborateurs, présences et recrutement',
    permissions: ['grh.view']
  },
  {
    id: 'paie',
    name: 'Gestion de la Paie',
    shortName: 'PAIE',
    icon: 'payments',
    color: '#1e293b',
    gradientFrom: '#0f172a',
    gradientTo: '#1e293b',
    route: '/paie',
    description: 'Bulletins de paie, déclarations et cotisations',
    permissions: ['paie.view']
  },
  {
    id: 'donnees-base',
    name: 'Données de Base',
    shortName: 'DB',
    icon: 'storage',
    color: '#1e293b',
    gradientFrom: '#0f172a',
    gradientTo: '#1e293b',
    route: '/donnees-base',
    description: 'Structure organisationnelle et référentiels de base',
    permissions: ['donnees-base.view']
  },
  {
    id: 'profils',
    name: 'Profils & Habilitations',
    shortName: 'PROFIL',
    icon: 'admin_panel_settings',
    color: '#1e293b',
    gradientFrom: '#0f172a',
    gradientTo: '#1e293b',
    route: '/profils',
    description: 'Gestion des profils, rôles, droits d\'accès, utilisateurs et manuel d\'utilisation',
    permissions: ['profils.view']
  }
];

