export type UserRole = 'ADMIN' | 'RH_MANAGER' | 'PAIE_MANAGER' | 'MANAGER' | 'EMPLOYEE' | 'EMPLOYE' | 'AGENT' | 'RH' | 'DRH' | 'GESTIONNAIRE_PAIE' | 'VALIDATEUR' | 'CONSULTANT' | string;

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  username?: string;
  matricule?: string;
  role: UserRole;
  permissions: string[];
  avatar?: string;
  poste?: string;
  department?: string;
}
