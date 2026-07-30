export type UserRole = 'ADMIN' | 'RH_MANAGER' | 'PAIE_MANAGER' | 'MANAGER' | 'EMPLOYEE' | 'EMPLOYE' | 'RH' | 'DRH' | 'GESTIONNAIRE_PAIE' | 'VALIDATEUR' | 'CONSULTANT';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  permissions: string[];
  avatar?: string;
  poste?: string;
  department?: string;
}
