export type Sexe = 'M' | 'F';
export type StatutEmploye = 'Actif' | 'Inactif' | 'Suspendu' | "Période d'essai" | 'Congé maladie' | 'Détaché';
export type TypeContrat = 'CDI' | 'CDD' | 'Stage' | 'Prestation' | 'Apprentissage';
export type ModePaiement = 'Virement bancaire' | 'Espèces' | 'Chèque';

export interface ContactUrgence {
  nom: string;
  prenom: string;
  lien: string;
  telephone: string;
}

export interface Enfant {
  nom: string;
  prenom?: string;
  numActe?: string;
  sexe: Sexe | string;
  status?: string;
  dateNaissance: string;
}

export interface PersonneCharge {
  nom: string;
  prenom: string;
  lien: string;
}

export interface IndemniteItem {
  code?: string;
  libelle: string;
  montant: number;
}

export interface ExonerationItem {
  libelle: string;
  montant: number;
}

export type LienParente = 'CONJOINT' | 'ENFANT' | 'PERE' | 'MERE' | 'FRERE' | 'SOEUR' | 'AUTRE';

export interface EmployeeFamily {
  id?: number | string;
  employeeId: number | string;
  nom: string;
  prenom: string;
  dateNaissance: string | null;
  lienParente: LienParente;
  estCharge: boolean;
  statut: string;
}

export interface EmployeeSalaryInformation {
  id?: number | string;
  employeeId: number | string;
  modePaiement: ModePaiement;
  banque: string;
  iban: string;
  intituleCompte: string;
  salaireBase: number;
  surSalaire?: number;
  indemnites: EmployeeIndemnity[];
  totalIndemnites: number;
  remunerationBrute: number;
  totalExonerations: number;
  abattementForfaitaire: number;
  baseImposable: number;
  retenuesAgent: EmployeeSalaryDeduction[];
  totalRetenuesAgent: number;
  retenuesEmployeur: EmployeeSalaryDeduction[];
  totalRetenuesEmployeur: number;
  nombrePersonnesCharge: number;
  iutsSansCharge: number;
  tauxReductionCharge: number;
  reductionIutsCharge: number;
  iutsAvecCharge: number;
  totalDeduitEmploye: number;
  salaireNet: number;
}

export interface EmployeeSalaryDeduction {
  id: number | string;
  retenueId: number | string;
  code: string;
  libelle: string;
  typeRetenueCode: string;
  baseCalcul: 'SALAIRE_BASE' | 'REMUNERATION_BRUTE' | 'BASE_IMPOSABLE';
  montantBase: number;
  taux: number;
  montantCalcule: number;
}

export interface EmployeeSalarySituation {
  id?: number | string;
  employeeId: number | string;
  grilleSalarialeId?: number | string;
  categorieId?: number | string;
  categorieLibelle?: string;
  echelonId?: number | string;
  echelonLibelle?: string;
  gradeId?: number | string;
  gradeLibelle?: string;
  salaireBase: number;
  surSalaire?: number;
  totalIndemnites: number;
  salaireBrut: number;
}

export interface EmployeeIndemnity {
  id: number | string;
  typeIndemniteId: number | string;
  typeIndemniteCode?: string;
  libelle: string;
  employeeId: number | string;
  parametrageIndemniteId?: number | string;
  montant: number;
  actif: boolean;
}

export interface EmployeeExemption {
  id: number | string;
  typeIndemniteId: number | string;
  typeIndemniteCode?: string;
  libelle: string;
  employeeId: number | string;
  indemniteEmployeId: number | string;
  montant: number;
  tauxExonere: number;
  plafondExonere: number;
}

export interface DocumentRH {
  id: string;
  libelle: string;
  categorie?: string;
  dateAjout: string;
  url?: string;
}

export interface Evaluation {
  date: string;
  periode: string;
  note: number;
  commentaire: string;
  evaluateur: string;
}

export interface ActionRH {
  date: string;
  type: string;
  description: string;
  auteur: string;
}

export interface Employee {
  id: string;
  matricule: string;

  // État civil
  nom: string;
  prenom: string;
  nomJeuneFille?: string;
  sexe: Sexe;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  numeroCNI: string;
  numeroCnss?: string;
  situationMatrimoniale?: string;
  situationFamiliale?: string;
  anciennete?: number;

  // Éducation
  dernierDiplome?: string;
  diplomeRecrutement?: string;
  brancheEtude?: string;
  ecoleUniversite?: string;

  // Retraite
  ageRetraite?: number;
  dateRetraite?: string;
  groupeRetraiteId?: number | string | null;

  // Coordonnées
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;

  // Contacts d'urgence
  contactUrgenceNom?: string;
  contactUrgenceTelephone?: string;
  contactUrgenceLien?: string;
  contactsUrgence: ContactUrgence[];

  // Photo
  photo?: string;

  // Famille
  conjoint?: {
    nom: string;
    prenom: string;
    dateNaissance?: string;
    profession?: string;
  };
  enfants: Enfant[];
  personnesCharge: PersonneCharge[];

  // Informations professionnelles
  poste: string;
  fonction?: string;
  service: string;
  direction: string;
  departement?: string;
  agence?: string;
  dateEmbauche: string;
  statut: StatutEmploye;
  typeContrat: TypeContrat;
  emailPro?: string;
  numeroPoste?: string;
  directeurHierarchique?: string;
  organismeRetraite?: string;
  fonctionId?: string;
  emploiId?: string;
  departmentId?: string;
  directionId?: string;
  serviceId?: string;
  agenceId?: string;

  // Catégorie
  categoriePro: string;
  echelon: string;
  grade: string;
  niveau: string;
  echelle?: string;
  gradeId?: string | number;
  categorieId?: string | number;
  echelonId?: string | number;
  grilleSalarialeId?: string | number;

  // Indemnités
  primeLogement: number;
  primeTransport: number;
  primeResponsabilite: number;
  vehiculeFourni?: boolean;
  logementFourni?: boolean;
  autresIndemnites: IndemniteItem[];

  // Exonérations
  exonerationsFiscales: ExonerationItem[];
  exonerationsSociales: ExonerationItem[];
  avantagesParticuliers: string[];

  // Salaire
  salaireBase: number;
  surSalaire?: number;
  salaireBrut: number;
  modePaiement: ModePaiement;
  banque?: string;
  iban?: string;
  intituleCompte?: string;

  // Dossier individuel
  documents: DocumentRH[];

  // Notes RH
  observations: string;
  evaluations: Evaluation[];
  historiqueActions: ActionRH[];

  regimeSecuriteSocialId?: string;
  regimeSecuriteSocialCode?: string;
  regimeSecuriteSocialLibelle?: string;
}

export const STATUT_COLORS: Record<StatutEmploye, { background: string; color: string }> = {
  'Actif':          { background: '#e6f4ea', color: '#1e8e3e' },
  'Inactif':        { background: '#f1f3f4', color: '#5f6368' },
  'Suspendu':       { background: '#fce8e6', color: '#d93025' },
  "Période d'essai": { background: '#fff3e0', color: '#e65100' },
  'Congé maladie':  { background: '#e8f0fe', color: '#1a73e8' },
  'Détaché':        { background: '#f3e8fd', color: '#7b1fa2' }
};
