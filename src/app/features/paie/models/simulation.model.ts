export type SimulationMode = 'NET_VERS_SURSALAIRE' | 'SURSALAIRE_VERS_NET';

export interface SimulationRequest {
  mode: SimulationMode;
  gradeId?: number;
  gradeCode?: string;
  categorieId?: number;
  categorieCode?: string;
  echelonId?: number;
  echelonCode?: string;
  salaireBaseManuel?: number;
  surSalairePropose?: number;
  netCibleSouhaite?: number;
  nombrePersonnesCharge?: number;
  indemniteLogement?: number;
  indemniteTransport?: number;
  indemniteFonction?: number;
  indemniteCaisse?: number;
  indemniteSujetion?: number;
  indemniteCashPoint?: number;
  autresIndemnites?: number;
  emploiId?: number;
  emploiNom?: string;
  fonctionId?: number;
  fonctionNom?: string;
  vehiculeFourni?: boolean;
  logementFourni?: boolean;
  regimeSecurite?: string;
  inclureChargesPatronales?: boolean;
}

export interface LigneSimulation {
  code: string;
  libelle: string;
  type: 'GAIN' | 'RETENUE_SALARIALE' | 'RETENUE_PATRONALE';
  base?: number;
  taux?: number;
  montantGain?: number;
  montantRetenue?: number;
}

export interface IndemniteDetail {
  code: string;
  libelle: string;
  montant: number;
  origine: 'STATUTAIRE' | 'POSTE' | 'FONCTION' | 'CONVENTION';
}

export interface SimulationIndemnitesAuto {
  indemniteLogement: number;
  indemniteTransport: number;
  indemniteFonction: number;
  indemniteCaisse: number;
  indemniteSujetion: number;
  indemniteCashPoint: number;
  autresIndemnites: number;
  totalIndemnites: number;
  details: IndemniteDetail[];
}

export interface SimulationResult {
  mode: SimulationMode;
  salaireBase: number;
  surSalaire: number;
  totalIndemnites: number;
  indemniteLogement: number;
  indemniteTransport: number;
  indemniteFonction: number;
  indemniteCaisse: number;
  indemniteSujetion?: number;
  indemniteCashPoint?: number;
  autresIndemnites: number;
  detailsIndemnites?: IndemniteDetail[];
  remunerationBrute: number;

  baseCnss: number;
  tauxCnssSalarial: number;
  cotisationCnss: number;
  brutApresCnss: number;

  totalExonerations: number;
  abattementForfaitaire: number;
  baseImposableIuts: number;
  iutsBrut: number;
  nombrePersonnesCharge: number;
  tauxReductionCharges: number;
  reductionIutsCharges: number;
  iutsNet: number;

  totalRetenuesSalariales: number;
  salaireNet: number;
  netCibleSouhaite?: number;
  ecartNetCible?: number;

  cotisationCnssPatronale: number;
  totalChargesPatronales: number;
  coutTotalEmployeur: number;
  emploiId?: number;
  emploiNom?: string;
  fonctionId?: number;
  fonctionNom?: string;

  message?: string;
  statutSimulation?: string;
  lignesDetails?: LigneSimulation[];
}
