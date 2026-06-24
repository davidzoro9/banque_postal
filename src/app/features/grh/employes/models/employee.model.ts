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
  prenom: string;
  dateNaissance: string;
  sexe: Sexe;
}

export interface Employee {
  // …déjà existants…
  salaireBase: number;
  salaireBrut: number;
  modePaiement: ModePaiement;
  // 👉 nouveau champ
  bonusAnnuel?: number;            // valeur optionnelle
}

export interface PersonneCharge {
  nom: string;
  prenom: string;
  lien: string;
}

export interface IndemniteItem {
  libelle: string;
  montant: number;
}

export interface ExonerationItem {
  libelle: string;
  montant: number;
}

export interface DocumentRH {
  id: string;
  libelle: string;
  categorie: 'Contrat' | 'Diplôme' | 'Pièce administrative' | 'Document numérisé';
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

  // Coordonnées
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;

  // Contacts d'urgence
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
  service: string;
  direction: string;
  dateEmbauche: string;
  statut: StatutEmploye;
  typeContrat: TypeContrat;

  // Catégorie
  categoriePro: string;
  echelon: string;
  grade: string;
  niveau: string;

  // Indemnités
  primeLogement: number;
  primeTransport: number;
  primeResponsabilite: number;
  autresIndemnites: IndemniteItem[];

  // Exonérations
  exonerationsFiscales: ExonerationItem[];
  exonerationsSociales: ExonerationItem[];
  avantagesParticuliers: string[];

  // Salaire
  salaireBase: number;
  salaireBrut: number;
  classe?: string;
  categorie?: string;
  echelle?: string;
  echellon?: string;
  banque?: string;
  iban?: string;

  // Dossier individuel
  documents: DocumentRH[];

  // Notes RH
  observations: string;
  evaluations: Evaluation[];
  historiqueActions: ActionRH[];
}

export const STATUT_COLORS: Record<StatutEmploye, { background: string; color: string }> = {
  'Actif': { background: '#e6f4ea', color: '#1e8e3e' },
  'Inactif': { background: '#f1f3f4', color: '#5f6368' },
  'Suspendu': { background: '#fce8e6', color: '#d93025' },
  "Période d'essai": { background: '#fff3e0', color: '#e65100' },
  'Congé maladie': { background: '#e8f0fe', color: '#1a73e8' },
  'Détaché': { background: '#f3e8fd', color: '#7b1fa2' }
};
