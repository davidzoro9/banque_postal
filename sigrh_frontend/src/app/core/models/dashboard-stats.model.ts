export interface GrhDashboardStats {
  agentsActifs: number;
  totalAgents: number;
  demandesCongeEnAttente: number;
  totalConges: number;
  absencesSignalees: number;
  contratsActifs: number;
  contratsARenouveler: number;
}

export interface DonneesBaseDashboardStats {
  emploisCount: number;
  directionsCount: number;
  departmentsCount: number;
  directionsEtDeptsCount: number;
  grillesCount: number;
  echelonsCount: number;
  indemnitesCount: number;
  typesContratsCount: number;
}

export interface ProfilsDashboardStats {
  rolesCount: number;
  usersCount: number;
  activeUsers: number;
  permissionsCount: number;
  manualsCount: number;
}

export interface PaieDashboardStats {
  bulletinsTraites: number;
  bulletinsATraiter: number;
  totalAgents: number;
  rubriquesCount: number;
  sessionsCount: number;
}

export interface GlobalDashboardStats {
  grh: GrhDashboardStats;
  donneesBase: DonneesBaseDashboardStats;
  profils: ProfilsDashboardStats;
  paie: PaieDashboardStats;
}
