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
    color: '#163059',
    gradientFrom: '#1B3A6B',
    gradientTo: '#091628',
    route: '/grh',
    description: 'Gestion des collaborateurs, présences et recrutement',
    permissions: ['grh.view']
  },
  {
    id: 'paie',
    name: 'Gestion de la Paie',
    shortName: 'PAIE',
    icon: 'payments',
    color: '#163059',
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
    gradientFrom: '#FFB300',
    gradientTo: '#CC8800',
    route: '/donnees-base',
    description: 'Structure organisationnelle et référentiels de base',
    permissions: ['donnees-base.view']
  },
  {
    id: 'parametrage',
    name: 'Paramétrage',
    shortName: 'PARAM',
    icon: 'settings',
    color: '#0060B3',
    gradientFrom: '#0B62AC',
    gradientTo: '#1B4B9A',
    route: '/parametrage',
    description: 'Configuration des taux, grilles, indemnités et retenues',
    permissions: ['donnees-base.view']
  }
];
