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
    name: 'Ressources Humaines',
    shortName: 'RH',
    icon: 'people',
    color: '#163059',
    gradientFrom: '#1B3A6B',
    gradientTo: '#091628',
    route: '/grh',
    description: 'Gestion des collaborateurs, présences et recrutement',
    permissions: ['grh.view']
  },
  {
    id: 'carrieres',
    name: 'Carrières & Compétences',
    shortName: 'CC',
    icon: 'trending_up',
    color: '#1565C0',
    gradientFrom: '#1976D2',
    gradientTo: '#0D47A1',
    route: '/carrieres',
    description: 'Compétences, formations et évaluations',
    permissions: ['carrieres.view']
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
    description: 'Bulletins de paie et déclarations sociales',
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
    description: 'Structure organisationnelle et paramètres',
    permissions: ['donnees-base.view']
  }
];
