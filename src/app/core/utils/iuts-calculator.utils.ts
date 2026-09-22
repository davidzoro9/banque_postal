/**
 * RÈGLE D'OR AGENTS.MD :
 * Toutes les données et règles de calcul de paie sont strictement gérées
 * côté backend Spring Boot (BulletinService / InformationSalarialeCalculService)
 * avec persistance PostgreSQL.
 *
 * Aucune formule, barème ou règle fiscale n'est hardcodée dans le frontend Angular.
 */

export interface IndemniteDetailInput {
  libelle: string;
  montant: number;
  type?: 'logement' | 'transport' | 'fonction' | 'autre';
}

export interface OfficialPayrollCalculation {
  salaireBase: number;
  totalIndemnites: number;
  remunerationTotale: number;
  cotisationCNSS: number;
  fondsSoutienPat: number;
  crrae: number;
  salaireBrut: number;
  abattementForfaitaire: number;
  exoLogement: number;
  exoTransport: number;
  exoFonctionsDetails: Array<{ libelle: string; montantServi: number; exoReelle: number }>;
  exoFonctionsTotal: number;
  totalExonerations: number;
  baseImposableRaw: number;
  baseImposable: number;
  iutsBrut: number;
  nombreChargesFamille: number;
  tauxReductionFamille: number;
  reductionFamilleMontant: number;
  iutsNet: number;
  totalRetenues: number;
  salaireNet: number;
}
