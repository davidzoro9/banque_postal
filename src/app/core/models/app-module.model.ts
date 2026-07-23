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
    gradientFrom: '#1B3A6B',
    gradientTo: '#004080',
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
    gradientFrom: '#1B4B9A',
    gradientTo: '#0A2744',
    route: '/paie',
    description: 'Bulletins de paie, déclarations et cotisations',
    permissions: ['paie.view']
  },
  {
    id: 'donnees-base',
    name: 'Données de Base',
    shortName: 'DB',
    icon: 'storage',
    color: '#CC8800',
    gradientFrom: '#FFC700',
    gradientTo: '#CC8800',
    route: '/donnees-base',
    description: 'Structure organisationnelle et référentiels de base',
    permissions: ['donnees-base.view']
  },
];

