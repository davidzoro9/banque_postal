export interface CompteComptable {
  id?: number;
  numeroCompte: string;
  libelle: string;
  classeCompte: 'CLASSE_6' | 'CLASSE_4' | string;
  sensParDefaut: 'DEBIT' | 'CREDIT' | string;
  typeRubriqueAssociee?: string;
  codeJournal?: string;
  description?: string;
  actif?: boolean;
}

export interface RubriqueOption {
  code: string;
  libelle: string;
  sensSuggere: 'DEBIT' | 'CREDIT';
  classeSuggeree: 'CLASSE_6' | 'CLASSE_4';
}

export const RUBRIQUES_PAIE_OPTIONS: RubriqueOption[] = [
  { code: 'SALAIRE_BASE', libelle: 'Salaire de base', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'SUR_SALAIRE', libelle: 'Sur-salaire du personnel', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'PRIMES', libelle: 'Primes & Gratifications', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'INDEMNITES', libelle: 'Indemnités & Avantages divers', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'RAPPELS', libelle: 'Rappels sur salaires antérieurs (Avoirs accordés)', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'HEURES_SUPP', libelle: 'Heures supplémentaires', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'COTISATIONS_PATRONALES', libelle: 'Cotisations patronales CNSS', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'CRRAE_PATRONALE', libelle: 'Cotisations patronales régimes complémentaires (CRRAE)', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'TPA', libelle: 'Taxe Patronale d\'Apprentissage (TPA - Charge)', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'CONGES_PAYES', libelle: 'Indemnités congés payés', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'NET_A_PAYER', libelle: 'Rémunérations dues (Net à payer)', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'ACOMPTES', libelle: 'Avances & Acomptes', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'PRECOMPTES', libelle: 'Personnel - Prêts et précomptes apurés', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'TROP_PERCUS', libelle: 'Personnel - Trop-perçus régularisés', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'CNSS', libelle: 'Sécurité Sociale (CNSS salariale & patronale)', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'CRRAE', libelle: 'Organismes de Prévoyance (CRRAE globale)', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'IUTS', libelle: 'Impôt sur salaires (IUTS)', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'FSP', libelle: 'Fonds de Soutien Patriotique (FSP)', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'TPA_DETTE', libelle: 'État - Taxe Patronale d\'Apprentissage à reverser (TPA)', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'PROVISION_CONGES', libelle: 'Dettes provisionnées congés payés', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'ARRONDI_CREDIT', libelle: 'Personnel - Arrondis / Régularisations (Crédit)', sensSuggere: 'CREDIT', classeSuggeree: 'CLASSE_4' },
  { code: 'ARRONDI_DEBIT', libelle: 'Charges de personnel - Ajustement d\'arrondis (Débit)', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' },
  { code: 'AUTRE', libelle: 'Autre écriture de paie', sensSuggere: 'DEBIT', classeSuggeree: 'CLASSE_6' }
];
