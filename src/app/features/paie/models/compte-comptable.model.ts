export interface CompteComptable {
  id?: number;
  numeroCompte: string;
  libelle: string;
  classeCompte: string;
  sensParDefaut: string;
  typeRubriqueAssociee?: string;
  codeJournal?: string;
  description?: string;
  actif?: boolean;
}

export interface ClasseComptableOption {
  id?: number;
  code: string;
  numero?: string;
  nom?: string;
  libelle: string;
  description?: string;
  ordre?: number;
  actif?: boolean;
}

export interface SensEcritureOption {
  id?: number;
  code: string;
  libelle: string;
  description?: string;
  ordre?: number;
  actif?: boolean;
}

export interface JournalComptableOption {
  id?: number;
  code: string;
  libelle: string;
  typeJournal?: string;
  description?: string;
  ordre?: number;
  actif?: boolean;
}

export interface RubriqueOption {
  id?: number;
  code: string;
  libelle: string;
  sensSuggere?: 'DEBIT' | 'CREDIT' | string;
  classeSuggeree?: 'CLASSE_6' | 'CLASSE_4' | string;
  numeroCompteDefaut?: string;
  typeRubrique?: string;
  description?: string;
  ordre?: number;
  actif?: boolean;
}

export interface ParametresFormulaireCompte {
  classes: ClasseComptableOption[];
  sens: SensEcritureOption[];
  journaux: JournalComptableOption[];
  rubriques: RubriqueOption[];
}
