export interface IndemniteDetailInput {
  libelle: string;
  montant: number;
  type?: 'logement' | 'transport' | 'fonction' | 'autre';
}

/**
 * Calculateur du nombre de charges de famille admises pour la réduction IUTS.
 * - Conjoint : +1 charge si le conjoint est coché comme sans emploi (!conjoint.travail).
 * - Enfants : +1 charge par enfant si âge < 18 ans (ou < 20 ans si scolarisé/études, ou invalide).
 * - Personnes à charge : +1 charge par personne enregistrée.
 * - Plafond max : 4 charges max (CGI Burkina Faso).
 */
export function computeEmployeeFamilyCharges(
  emp: any,
  optionsOrAgeMaxStd?: { ageMaxStd?: number; ageMaxEtud?: number; maxCap?: number; conjointActif?: boolean } | number,
  ageMaxEtudParam = 20,
  maxCapParam = 4,
  membres?: Array<{ estCharge?: boolean }>
): number {
  if (!emp) return 0;

  let ageMaxStd = 18;
  let ageMaxEtud = ageMaxEtudParam;
  let maxCap = maxCapParam;
  let conjointActif = true;

  if (typeof optionsOrAgeMaxStd === 'object' && optionsOrAgeMaxStd !== null) {
    if (optionsOrAgeMaxStd.ageMaxStd != null) ageMaxStd = optionsOrAgeMaxStd.ageMaxStd;
    if (optionsOrAgeMaxStd.ageMaxEtud != null) ageMaxEtud = optionsOrAgeMaxStd.ageMaxEtud;
    if (optionsOrAgeMaxStd.maxCap != null) maxCap = optionsOrAgeMaxStd.maxCap;
    if (optionsOrAgeMaxStd.conjointActif != null) conjointActif = optionsOrAgeMaxStd.conjointActif;
  } else if (typeof optionsOrAgeMaxStd === 'number') {
    ageMaxStd = optionsOrAgeMaxStd;
  }

  if (membres) {
    return Math.min(maxCap, membres.filter(membre => membre.estCharge).length);
  }

  // 1. Conjoint non-salarié
  let conjointCharge = 0;
  if (conjointActif && emp.conjoint && (emp.conjoint.nom || emp.conjoint.prenom || emp.conjoint.telephone)) {
    if (!emp.conjoint.travail) {
      conjointCharge = 1;
    }
  }

  // 2. Enfants
  let enfantsCharges = 0;
  const now = new Date();

  (emp.enfants || []).forEach((enf: any) => {
    let age = 0;
    if (enf.dateNaissance) {
      const birth = new Date(enf.dateNaissance);
      if (!isNaN(birth.getTime())) {
        age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
          age--;
        }
      }
    }

    const st = (enf.status || '').toLowerCase();
    let maxAge = ageMaxStd;
    let isInvalide = st.includes('invalide');

    if (st.includes('etude') || st.includes('scolaris') || st.includes('20') || st.includes('25')) {
      maxAge = ageMaxEtud;
    }

    if (isInvalide || (age < maxAge)) {
      enfantsCharges++;
    }
  });

  // 3. Autres personnes à charge
  const autres = (emp.personnesCharge?.length || 0);

  const rawTotal = conjointCharge + enfantsCharges + autres;
  return Math.min(maxCap, rawTotal);
}

export interface OfficialPayrollCalculation {
  salaireBase: number;
  totalIndemnites: number;
  remunerationTotale: number; // Brut à ordonnancer
  cotisationCNSS: number;      // 5.5% de la rémunération totale
  fondsSoutienPat: number;     // 1% du brut (FSP Burkina Faso)
  crrae: number;               // Retraite complémentaire bancaire (ex: 5% du salaire de base)
  salaireBrut: number;         // Remunération totale - CNSS
  
  // Abattements et Exonérations (Loi MINEFID Burkina Faso)
  abattementForfaitaire: number; // 20% du salaire de base
  exoLogement: number;           // MIN(logementServi, 20% * SB, 75 000)
  exoTransport: number;          // MIN(transportServi, 5% * SB, 30 000)
  exoFonctionsDetails: Array<{ libelle: string; montantServi: number; exoReelle: number }>;
  exoFonctionsTotal: number;     // SUM( MIN(fonctionServi, 5% * SB, 50 000) )
  totalExonerations: number;     // Abattement + ExoLogement + ExoTransport + ExoFonctionsTotal

  // Fiscalité IUTS
  baseImposableRaw: number;      // SalaireBrut - TotalExonerations
  baseImposable: number;         // TRUNC(baseImposableRaw, -2) (arrondi centaine inférieure)
  iutsBrut: number;              // Impôt brut selon le barème progressif officiel à 7 tranches
  nombreChargesFamille: number;  // Nombre d'enfants / personnes à charge
  tauxReductionFamille: number;  // Taux de réduction (0%, 8%, 10%, 12%, 14%)
  reductionFamilleMontant: number; // iutsBrut * tauxReductionFamille
  iutsNet: number;               // iutsBrut - reductionFamilleMontant

  // Totaux & Net
  totalRetenues: number;         // CNSS + iutsNet + fondsSoutienPat + crrae
  salaireNet: number;            // RemunérationTotale - totalRetenues
}

/**
 * Calculateur Officiel IUTS & Paie Burkina Faso
 * Conforme à la loi N°058-2017/AN, N°051-2019/AN et à la circulaire MINEFID N°2020-0432.
 */
export function calculateOfficialIUTS(
  salaireBase: number,
  indemnites: IndemniteDetailInput[],
  options: {
    vehiculeFourni?: boolean;
    logementFourni?: boolean;
    nombreChargesFamille?: number;
    tauxAbattementBase?: number; // Défaut 20% (Article 111 CGI Burkina)
    inclureFSP?: boolean;        // Fond de Soutien Patriotique (1% du brut)
    inclureCRRAE?: boolean;      // Retraite complémentaire (5% du salaire de base)
    tauxCrrae?: number;
  } = {}
): OfficialPayrollCalculation {
  const sBase = Math.max(0, salaireBase || 0);

  // 1. Traitement des avantages en nature (Exonération transport / logement si fourni par la banque)
  const processedIndemnites = indemnites.map(ind => {
    let m = Math.max(0, ind.montant || 0);
    const upper = (ind.libelle || '').toUpperCase();

    if (options.vehiculeFourni && (upper.includes('TRANSPORT') || upper.includes('DEPLACEMENT'))) {
      m = 0;
    }
    if (options.logementFourni && upper.includes('LOGEMENT')) {
      m = 0;
    }
    return { ...ind, montant: m };
  });

  const totalIndemnites = processedIndemnites.reduce((sum, item) => sum + item.montant, 0);
  const remunerationTotale = sBase + totalIndemnites; // Rémunération globale à ordonnancer

  // 2. Cotisation sociale CNSS (5.5%)
  const cotisationCNSS = Math.round(remunerationTotale * 0.055);

  // Retenues additionnelles (FSP & CRRAE)
  const fondsSoutienPat = options.inclureFSP ? Math.round(remunerationTotale * 0.01) : 0;
  const crrae = options.inclureCRRAE ? Math.round(sBase * (options.tauxCrrae || 0.05)) : 0;

  // 3. Salaire Brut (SB = Rémunération Totale - CNSS)
  const salaireBrut = Math.max(0, remunerationTotale - cotisationCNSS);

  // 4. Abattement Forfaitaire pour Frais Professionnels (20% du salaire de base)
  const tauxAbat = (options.tauxAbattementBase !== undefined) ? options.tauxAbattementBase : 0.20;
  const abattementForfaitaire = Math.round(sBase * tauxAbat);

  // 5. Exonérations des indemnités (Circulaire N°2020-0432/MINEFID Burkina Faso)
  let exoLogement = 0;
  let exoTransport = 0;
  const exoFonctionsDetails: Array<{ libelle: string; montantServi: number; exoReelle: number }> = [];
  let exoFonctionsTotal = 0;

  processedIndemnites.forEach(ind => {
    const upper = (ind.libelle || '').toUpperCase();
    const m = ind.montant;

    if (upper.includes('LOGEMENT')) {
      // 20% du salaire brut, max 75 000 par mois
      const limit20 = Math.round(salaireBrut * 0.20);
      exoLogement = Math.min(m, limit20, 75000);
    } else if (upper.includes('TRANSPORT') || upper.includes('DEPLACEMENT')) {
      // 5% du salaire brut, max 30 000 par mois
      const limit5 = Math.round(salaireBrut * 0.05);
      exoTransport = Math.min(m, limit5, 30000);
    } else if (m > 0) {
      // Indemnités de fonction / spécifiques (Astreinte, Technicité, Responsabilité, Caisse, Sujétion, etc.)
      // 5% du salaire brut, max 50 000 par mois par indemnité (sans cumul)
      const limit5 = Math.round(salaireBrut * 0.05);
      const exoReelle = Math.min(m, limit5, 50000);
      exoFonctionsDetails.push({
        libelle: ind.libelle,
        montantServi: m,
        exoReelle
      });
      exoFonctionsTotal += exoReelle;
    }
  });

  const totalExonerations = abattementForfaitaire + exoLogement + exoTransport + exoFonctionsTotal;

  // 6. Base Imposable IUTS (SNI) - TRUNC à la centaine inférieure
  const baseImposableRaw = Math.max(0, salaireBrut - totalExonerations);
  const baseImposable = Math.floor(baseImposableRaw / 100) * 100;

  // 7. Calcul du Barème Progressif IUTS (7 tranches légales Burkina Faso)
  let iutsBrut = 0;
  if (baseImposable > 250000) {
    iutsBrut = 39430 + (baseImposable - 250000) * 0.25;
  } else if (baseImposable > 170000) {
    iutsBrut = 24200 + (baseImposable - 170000) * 0.23;
  } else if (baseImposable > 120000) {
    iutsBrut = 13700 + (baseImposable - 120000) * 0.21;
  } else if (baseImposable > 80000) {
    iutsBrut = 6500 + (baseImposable - 80000) * 0.18;
  } else if (baseImposable > 50000) {
    iutsBrut = 2000 + (baseImposable - 50000) * 0.15;
  } else if (baseImposable > 30000) {
    iutsBrut = (baseImposable - 30000) * 0.10;
  } else {
    iutsBrut = 0;
  }
  iutsBrut = Math.round(iutsBrut);

  // 8. Charges de Famille (Abattement IUTS pour charges familiales)
  const nCharges = options.nombreChargesFamille || 0;
  let tauxReductionFamille = 0;
  if (nCharges === 1) tauxReductionFamille = 0.08;
  else if (nCharges === 2) tauxReductionFamille = 0.10;
  else if (nCharges === 3) tauxReductionFamille = 0.12;
  else if (nCharges >= 4) tauxReductionFamille = 0.14;

  const reductionFamilleMontant = Math.round(iutsBrut * tauxReductionFamille);
  const iutsNet = Math.max(0, iutsBrut - reductionFamilleMontant);

  // 9. Totaux et Net à payer
  const totalRetenues = cotisationCNSS + iutsNet + fondsSoutienPat + crrae;
  const salaireNet = Math.max(0, remunerationTotale - totalRetenues);

  return {
    salaireBase: sBase,
    totalIndemnites,
    remunerationTotale,
    cotisationCNSS,
    fondsSoutienPat,
    crrae,
    salaireBrut,
    abattementForfaitaire,
    exoLogement,
    exoTransport,
    exoFonctionsDetails,
    exoFonctionsTotal,
    totalExonerations,
    baseImposableRaw,
    baseImposable,
    iutsBrut,
    nombreChargesFamille: nCharges,
    tauxReductionFamille,
    reductionFamilleMontant,
    iutsNet,
    totalRetenues,
    salaireNet
  };
}
