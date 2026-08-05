import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface RefItem {
  id?: string;
  code: string;
  libelle: string;
  description: string;
  actif: boolean;
  montant?: number;
  departementId?: string;   // utilisé par Direction et Service
  directionId?:   string;   // utilisé par Service
  echelle?:       string;   // utilisé par Grille salariale
  echellon?:      string;   // utilisé par Grille salariale
  typeIndemnite?: string;   // pour Paramétrage indemnité
  typeRetenue?:   string;   // pour Paramétrage retenue (Part Agent, Part Employeur, Cotisation Sociale, etc.)
  fonction?:      string;   // pour Paramétrage indemnité
  grade?:         string;   // pour Paramétrage indemnité
  categorie?:     string;   // pour Paramétrage indemnité
  taux?:          number;   // pour Paramétrage indemnité / Retenue
  tauxAbattement?: number;  // pour Catégorie (Abattement brut pour IUTS)
  tauxExoneration?: number; // pour Paramétrage indemnité (% Exonéré)
  plafondExoneration?: number; // pour Paramétrage indemnité (Plafond FCFA d'exonération)
  categories?: string[];    // pour Groupe (Liste des codes de catégories rattachées)
  typeNomination?: string;  // pour Fonction : 'NOMMEE' ou 'NON_NOMMEE'
}

// ─── Mapping frontend type → backend segment ───────────────────────────────
const BACKEND_MAP: Record<string, {
  segment: string;
  getAllPath: string;
  toFront: (dto: any) => RefItem;
  toBack: (item: RefItem) => any;
  toBackUpdate: (item: RefItem) => any;
}> = {
  'grille-salariale': {
    segment: 'grillesalariale',
    getAllPath: '',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.category || dto.code || 'C1',
      libelle: `Cat. ${dto.category || ''} - ${dto.echellon || ''}`,
      categorie: dto.category || dto.code,
      echellon: dto.echellon,
      echelle: dto.echelle,
      montant: dto.basicSalary != null ? Number(dto.basicSalary) : 0,
      description: `Base: ${dto.basicSalary || 0} FCFA`,
      actif: true
    }),
    toBack: item => ({
      category: item.categorie || item.code,
      echellon: item.echellon,
      echelle: item.echelle,
      basicSalary: item.montant || 0
    }),
    toBackUpdate: item => ({
      id: item.id ? Number(item.id) : null,
      category: item.categorie || item.code,
      echellon: item.echellon,
      echelle: item.echelle,
      basicSalary: item.montant || 0
    })
  },
  'emploi': {
    segment: 'emplois',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code || `EMP-${dto.id}`, libelle: dto.name || dto.libelle || dto.code || 'Emploi', description: dto.description || '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle }),
  },
  'direction': {
    segment: 'directions',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: dto.description || '', actif: true,
                       departementId: dto.departmentId ? String(dto.departmentId) : undefined }),
    toBack:  item => ({ code: item.code, name: item.libelle, description: item.description,
                        departmentId: item.departementId ? Number(item.departementId) : null }),
    toBackUpdate: item => ({ id: Number(item.id), code: item.code, name: item.libelle, description: item.description,
                             departmentId: item.departementId ? Number(item.departementId) : null }),
  },
  'service': {
    segment: 'services',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: dto.description || '', actif: true,
                       directionId:   dto.directionId   ? String(dto.directionId)   : undefined,
                       departementId: dto.departmentId  ? String(dto.departmentId)  : undefined }),
    toBack:  item => ({ code: item.code, name: item.libelle, description: item.description,
                        directionId:  item.directionId   ? Number(item.directionId)   : null,
                        departmentId: item.departementId ? Number(item.departementId) : null }),
    toBackUpdate: item => ({ id: Number(item.id), code: item.code, name: item.libelle, description: item.description,
                             directionId:  item.directionId   ? Number(item.directionId)   : null,
                             departmentId: item.departementId ? Number(item.departementId) : null }),
  },
  'profil': {
    segment: 'ref-data/profil',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'ville': {
    segment: 'ref-data/ville',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'categorie': {
    segment: 'ref-data/categorie',
    getAllPath: '/all',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || '',
      tauxAbattement: dto.tauxAbattement ?? (['V', 'VI', 'VII', 'VIII'].includes(dto.code) ? 20 : 25),
      actif: dto.actif ?? true
    }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, tauxAbattement: item.tauxAbattement, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, tauxAbattement: item.tauxAbattement, actif: item.actif }),
  },
  'grade': {
    segment: 'ref-data/grade',
    getAllPath: '/all',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || '',
      actif: dto.actif ?? true
    }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'fonction': {
    segment: 'fonctions',
    getAllPath: '/all',
    toFront: dto => {
      const name = (dto.name || dto.libelle || '').toLowerCase();
      const isNommee = dto.typeNomination === 'NOMMEE' ||
        ['directeur', 'responsable', 'chef', 'caissier', 'cash point', 'chauffeur', 'assistante', 'liaison'].some(k => name.includes(k));
      return {
        id: String(dto.id),
        code: dto.code || `FCT-${dto.id}`,
        libelle: dto.name || dto.libelle || dto.code || 'Fonction',
        description: dto.description || '',
        actif: dto.actif ?? true,
        typeNomination: dto.typeNomination || (isNommee ? 'NOMMEE' : 'NON_NOMMEE')
      };
    },
    toBack:  item => ({
      code: item.code,
      name: item.libelle,
      description: item.description || '',
      typeNomination: item.typeNomination || 'NON_NOMMEE',
      actif: item.actif ?? true
    }),
    toBackUpdate: item => ({
      id: item.id,
      code: item.code,
      name: item.libelle,
      description: item.description || '',
      typeNomination: item.typeNomination || 'NON_NOMMEE',
      actif: item.actif ?? true
    }),
  },
  'type-contrat': {
    segment: 'typecontrat',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle }),
  },
  'type-indemnite': {
    segment: 'typeindemnite',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle }),
  },
  'param-indemnite': {
    segment: 'paramindemnite',
    getAllPath: '',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.code || `PI-${dto.id}`,
      libelle: dto.typeIndemnite || dto.name || 'Indemnité',
      description: `Fonction: ${dto.fonction || '-'}, Grade: ${dto.grade || '-'}, Cat: ${dto.categorie || '-'}`,
      actif: dto.actif ?? true,
      montant: dto.taux || dto.montant || 0,
      typeIndemnite: dto.typeIndemnite || dto.name || '',
      fonction: dto.fonction || '',
      grade: dto.grade || '',
      categorie: dto.categorie || '',
      taux: dto.taux || dto.montant || 0,
      tauxExoneration: dto.tauxExoneration || 0,
      plafondExoneration: dto.plafondExoneration || 0
    }),
    toBack: item => ({
      code: item.code,
      typeIndemnite: item.typeIndemnite || item.libelle,
      fonction: item.fonction,
      grade: item.grade,
      categorie: item.categorie,
      taux: item.taux || item.montant || 0,
      tauxExoneration: item.tauxExoneration || 0,
      plafondExoneration: item.plafondExoneration || 0,
      actif: item.actif
    }),
    toBackUpdate: item => ({
      id: item.id,
      code: item.code,
      typeIndemnite: item.typeIndemnite || item.libelle,
      fonction: item.fonction,
      grade: item.grade,
      categorie: item.categorie,
      taux: item.taux || item.montant || 0,
      tauxExoneration: item.tauxExoneration || 0,
      plafondExoneration: item.plafondExoneration || 0,
      actif: item.actif
    }),
  },
  'type-conge': {
    segment: 'typeabsenceconge',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle }),
  },

  'departement': {
    segment: 'departments',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: dto.directeur || '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle, directeur: item.description }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle, directeur: item.description }),
  },
  'type-retenue-employe': {
    segment: 'ref-data/retenue-employe',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif ?? true }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'type-retenue-emploi': {
    segment: 'ref-data/retenue-emploi',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, typeRetenue: dto.typeRetenue || 'Part Agent', taux: dto.taux || 0, description: dto.description || '', actif: dto.actif ?? true }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, typeRetenue: item.typeRetenue, taux: item.taux, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, typeRetenue: item.typeRetenue, taux: item.taux, description: item.description, actif: item.actif }),
  },
};

const SALARY_MATRIX: Record<string, { catCode: string; groupe: string; values: number[] }> = {
  '1':     { catCode: 'C1',  groupe: 'GROUPE I',   values: [95945, 105540, 116093, 127703, 140473, 154520, 169972, 186970, 205667, 226233, 248857, 273742, 301117, 331228, 364351] },
  '2':     { catCode: 'C2',  groupe: 'GROUPE I',   values: [104474, 114921, 126414, 139055, 152960, 168256, 185082, 203590, 223949, 246344, 270979, 298077, 327884, 360673, 396740] },
  '3':     { catCode: 'C3',  groupe: 'GROUPE I',   values: [107135, 117849, 129633, 142597, 156856, 172542, 189796, 208776, 229653, 252619, 277881, 305669, 336236, 369859, 406845] },
  '4':     { catCode: 'C4',  groupe: 'GROUPE I',   values: [115558, 127114, 139825, 153808, 169188, 186107, 204718, 225190, 247709, 272480, 299728, 329700, 362671, 398938, 438831] },
  '5':     { catCode: 'C5',  groupe: 'GROUPE I',   values: [128831, 141714, 155886, 171474, 188621, 207484, 228232, 251055, 276161, 303777, 334154, 367570, 404327, 444760, 489236] },
  '6':     { catCode: 'C6',  groupe: 'GROUPE I',   values: [157940, 173734, 191107, 210218, 231240, 254364, 279800, 307780, 338558, 372414, 409656, 450621, 495683, 545252, 599777] },
  '7':     { catCode: 'C7',  groupe: 'GROUPE I',   values: [176441, 194085, 213494, 234843, 258327, 284160, 312576, 343834, 378217, 416039, 457643, 503407, 553747, 609122, 670034] },
  'I':    { catCode: 'CL1', groupe: 'GROUPE II',  values: [173090, 190399, 209439, 230383, 253421, 278763, 306639, 337303, 371034, 408137, 448951, 493846, 543231, 597554, 657309] },
  'II':   { catCode: 'CL2', groupe: 'GROUPE II',  values: [203834, 224217, 246639, 271303, 298433, 328277, 361104, 397215, 436936, 480630, 528693, 581562, 639718, 703690, 774059] },
  'III':  { catCode: 'CL3', groupe: 'GROUPE II',  values: [278697, 306567, 337223, 370946, 408040, 448844, 493729, 543102, 597412, 657153, 722868, 795155, 874671, 962138, 1058351] },
  'IV':   { catCode: 'CL4', groupe: 'GROUPE II',  values: [405758, 446334, 490967, 540064, 594070, 653477, 718825, 790708, 869778, 956756, 1052432, 1157675, 1273442, 1400787, 1540865] },
  'V':    { catCode: 'CL5', groupe: 'GROUPE III', values: [581390, 639529, 703482, 773830, 851213, 936334, 1029968, 1132965, 1246261, 1370887, 1507976, 1658774, 1824651, 2007116, 2207828] },
  'VI':   { catCode: 'CL6', groupe: 'GROUPE III', values: [599438, 659382, 725320, 797852, 877637, 965401, 1061941, 1168135, 1284949, 1413443, 1554788, 1710267, 1881293, 2069423, 2276365] },
  'VII':  { catCode: 'CL7', groupe: 'GROUPE III', values: [631454, 694599, 764059, 840465, 924512, 1016963, 1118659, 1230525, 1353578, 1488936, 1637829, 1801612, 1981773, 2179950, 2397946] },
  'VIII': { catCode: 'CL8', groupe: 'GROUPE III', values: [710386, 781425, 859567, 945524, 1040076, 1144084, 1258492, 1384341, 1522775, 1675053, 1842558, 2026814, 2229496, 2452445, 2697690] }
};

function buildOfficialGridItems(): RefItem[] {
  const items: RefItem[] = [];
  let idCounter = 1;
  for (const [code, info] of Object.entries(SALARY_MATRIX)) {
    info.values.forEach((amount, index) => {
      const echNum = index + 1;
      const echCode = echNum < 10 ? `E0${echNum}` : `E${echNum}`;
      const gradeConcat = `${info.catCode}${echCode}`;
      items.push({
        id: String(idCounter++),
        code: info.catCode,
        libelle: info.groupe,
        grade: gradeConcat,
        categorie: info.catCode,
        echelle: info.groupe,
        echellon: echCode,
        description: `${info.groupe} (${info.catCode}) - ${echCode}`,
        montant: amount,
        actif: true
      });
    });
  }
  return items;
}

// ─── Données mock pour les types sans backend ────────────────────────────────
const MOCK_DATA: Record<string, RefItem[]> = {
  'type-indemnite': [
    { code: 'TI-LOG',  libelle: 'Indemnité de logement',       description: 'Indemnité destinée à couvrir les frais de logement (Taux 20%, Plafond 75 000 FCFA)', tauxExoneration: 20,  plafondExoneration: 75000, actif: true },
    { code: 'TI-TPT',  libelle: 'Indemnité de transport',       description: 'Indemnité destinée à couvrir les frais de déplacement (Taux 5%, Plafond 30 000 FCFA)', tauxExoneration: 5,   plafondExoneration: 30000, actif: true },
    { code: 'TI-FCT',  libelle: 'Indemnité de fonction',        description: 'Indemnité liée à la fonction de nomination (Taux 5%, Plafond 50 000 FCFA)',            tauxExoneration: 5,   plafondExoneration: 50000, actif: true },
    { code: 'TI-SUJ',  libelle: 'Indemnité de Sujétion',       description: 'Indemnité pour contraintes spécifiques de poste',                                      tauxExoneration: 100, plafondExoneration: 0,     actif: true },
    { code: 'TI-CMP',  libelle: 'Indemnité compensatrice',      description: 'Indemnité pour sujétions ou contraintes particulières',                                tauxExoneration: 0,   plafondExoneration: 0,     actif: true },
    { code: 'TI-CSA',  libelle: 'Indemnité de caisse',          description: 'Indemnité pour gestion de fonds (Caissiers/Cash Point)',                              tauxExoneration: 0,   plafondExoneration: 0,     actif: true },
    { code: 'TI-ASTR', libelle: "Indemnité d'astreinte",        description: 'Indemnité pour disponibilité hors horaires normaux',                                   tauxExoneration: 0,   plafondExoneration: 0,     actif: true },
    { code: 'TI-REPR', libelle: 'Indemnité de représentation',  description: 'Indemnité pour frais de représentation institutionnelle',                              tauxExoneration: 0,   plafondExoneration: 0,     actif: true },
    { code: 'TI-NOM',  libelle: 'Indemnité de nomination',      description: 'Indemnité globale pour une nomination à un poste de responsabilité',                 tauxExoneration: 0,   plafondExoneration: 0,     actif: true }
  ],
  'type-retenue-employe': [
    { code: 'TR-PATRONALE', libelle: 'Part Employeur',                     description: 'Part de cotisation patronale prise en charge directement par l\'employeur', actif: true },
    { code: 'TR-SALARIALE', libelle: 'Part Agent',                         description: 'Part de cotisation salariale prélevée à la source sur la paie de l\'agent', actif: true },
    { code: 'TR-SOCIALE',   libelle: 'Cotisation Sociale (CNSS/CARFO)',    description: 'Sécurité sociale obligatoire et régimes de retraite de base légaux', actif: true },
    { code: 'TR-RETRAITE',  libelle: 'Retraite Complémentaire (CRRAE)',    description: 'Caisse de retraite complémentaire bancaire UMOA et fonds de pension', actif: true },
    { code: 'TR-FISCALE',   libelle: 'Retenue Fiscale (IUTS/TPA)',         description: 'Impôt Unique sur Traitements & Salaires et Taxes patronales', actif: true },
    { code: 'TR-ASSURANCE', libelle: 'Assurance Groupe & Santé',           description: 'Prélèvements pour assurance maladie complémentaire groupe entreprise', actif: true },
    { code: 'TR-MUTUELLE',  libelle: 'Mutuelle Interne (MUPER)',           description: 'Cotisation mensuelle d\'entraide et de solidarité du personnel', actif: true },
    { code: 'TR-PRET',      libelle: 'Remboursement Prêt & Avance',        description: 'Remboursement des prêts équipements, avances et acomptes sur salaire', actif: true },
    { code: 'TR-SYNDICAT',  libelle: 'Cotisation Syndicale',               description: 'Cotisation mensuelle d\'adhésion syndicale du personnel', actif: true }
  ],
  'type-retenue-emploi': [
    { code: 'RET-CNSS-SAL', libelle: 'Cotisation Sociale CNSS (Part Agent)',       typeRetenue: 'Part Agent',                         taux: 5.5, description: 'Cotisation sociale obligatoire à la charge de l\'employé (5,5% du brut plafonné)', actif: true },
    { code: 'RET-CNSS-PAT', libelle: 'Cotisation Sociale CNSS (Part Employeur)',   typeRetenue: 'Part Employeur',                     taux: 16.0,description: 'Cotisation patronale obligatoire sécurité sociale (16,0% sur masse salariale)', actif: true },
    { code: 'RET-IUTS',     libelle: 'Impôt IUTS (Impôt sur Salaire)',            typeRetenue: 'Retenue Fiscale (IUTS/TPA)',         taux: 0,   description: 'Impôt Unique sur Traitements et Salaires prélevé à la source (Barème progressif)', actif: true },
    { code: 'RET-CRRAE-SAL',libelle: 'Retraite Complémentaire CRRAE (Part Agent)',  typeRetenue: 'Retraite Complémentaire (CRRAE)',    taux: 3.0, description: 'Cotisation salariale fonds de pension complémentaire bancaire UMOA', actif: true },
    { code: 'RET-CRRAE-PAT',libelle: 'Retraite Complémentaire CRRAE (Part Pat.)',  typeRetenue: 'Part Employeur',                     taux: 5.0, description: 'Contribution patronale retraite complémentaire bancaire UMOA', actif: true },
    { code: 'RET-AM-SAL',   libelle: 'Assurance Maladie Groupe (Part Agent)',     typeRetenue: 'Assurance Groupe & Santé',           taux: 2.5, description: 'Part salariale couverture médicale maladie et hospitalisation (25%)', actif: true },
    { code: 'RET-AM-PAT',   libelle: 'Assurance Maladie Groupe (Part Employeur)', typeRetenue: 'Part Employeur',                     taux: 7.5, description: 'Prise en charge patronale assurance maladie groupe (75%)', actif: true },
    { code: 'RET-MUPER',    libelle: 'Mutuelle Interne du Personnel (MUPER)',     typeRetenue: 'Mutuelle Interne (MUPER)',           taux: 1.0, description: 'Cotisation mensuelle d\'entraide et de solidarité du personnel BPBF', actif: true },
    { code: 'RET-AVANCE',   libelle: 'Avance sur Salaire / Acompte',               typeRetenue: 'Remboursement Prêt & Avance',        taux: 0,   description: 'Remboursement mensuel des avances exceptionnelles sur solde (Montant Variable)', actif: true },
    { code: 'RET-PRET-EQP', libelle: 'Prêt Équipement / Prêt interne BPBF',       typeRetenue: 'Remboursement Prêt & Avance',        taux: 0,   description: 'Échéance mensuelle pour remboursement de prêt personnel bancaire (Mensualité Fixe)', actif: true }
  ],
  'param-retraite': [
    { code: 'RET-GRP-1', grade: 'GROUPE I',   libelle: 'GROUPE I',   taux: 58, description: 'GROUPE I : Employés & Techniciens Opérationnels (58 ans)', actif: true },
    { code: 'RET-GRP-2', grade: 'GROUPE II',  libelle: 'GROUPE II',  taux: 60, description: 'GROUPE II : Agents de Maîtrise & Cadres Moyens (60 ans)', actif: true },
    { code: 'RET-GRP-3', grade: 'GROUPE III', libelle: 'GROUPE III', taux: 60, description: 'GROUPE III : Cadres & Cadres Supérieurs (60 ans)', actif: true },
    { code: 'RET-GRP-4', grade: 'GROUPE IV',  libelle: 'GROUPE IV',  taux: 63, description: 'GROUPE IV : Hors Catégorie & Médecins / Spécialistes (63 ans)', actif: true }
  ],
  'param-prise-en-charge': [
    { code: 'PEC-AGE-STD',  libelle: 'Âge Max Enfant Standard',             taux: 18, description: 'Âge limite légal pour enfant mineur à charge (strictement inférieur à 18 ans)', actif: true },
    { code: 'PEC-AGE-ETUD', libelle: 'Âge Max Enfant Étudiant / Scolarisé',  taux: 20, description: 'Âge limite pour enfant poursuivant des études (strictement inférieur à 20 ans)', actif: true },
    { code: 'PEC-CONJOINT', libelle: 'Prise en Charge Conjoint Non-Salarié', taux: 1,  description: 'Accorder +1 charge de famille si le conjoint est sans emploi / ne travaille pas', actif: true },
    { code: 'PEC-MAX-CHRG', libelle: 'Nombre de Charges Max Autorisées',    taux: 4,  description: 'Plafond maximum de charges fiscales admises pour la réduction IUTS (Burkina Faso)', actif: true }
  ],
  'type-contrat': [
    { code: 'CDI',   libelle: 'Contrat Durée Indéterminée (CDI)', description: 'Contrat de travail à durée indéterminée', actif: true },
    { code: 'CDD',   libelle: 'Contrat Durée Déterminée (CDD)',   description: 'Contrat de travail à durée déterminée', actif: true },
    { code: 'STAGE', libelle: 'Contrat de Stage',                 description: 'Stage de qualification ou perfectionnement', actif: true }
  ],
  'type-conge': [
    { code: 'CONG-PAY', libelle: 'Congé Payé Annuel',           description: 'Droit légal de 30 jours calendaires par an', actif: true },
    { code: 'CONG-MAL', libelle: 'Congé Maladie',              description: 'Absence pour raison médicale sous certificat', actif: true },
    { code: 'CONG-MAT', libelle: 'Congé Maternité / Paternité', description: 'Repos parental légal', actif: true },
    { code: 'CONG-EXC', libelle: 'Absence Exceptionnelle',     description: 'Événements familiaux ou autorisations spéciales', actif: true }
  ],
  'agence': [
    { code: 'AGN-001', libelle: 'Agence Centrale',          description: 'Siège social BPBF — Ouagadougou', actif: true  },
    { code: 'AGN-002', libelle: 'Agence Bobo-Dioulasso',     description: 'Agence Principale Zone Ouest',   actif: true  },
    { code: 'AGN-003', libelle: 'Agence Koudougou',          description: 'Agence Zone Centre-Ouest',       actif: true  },
    { code: 'AGN-004', libelle: 'Agence Ouahigouya',         description: 'Agence Zone Nord',               actif: true  },
    { code: 'AGN-005', libelle: "Agence Fada N'Gourma",      description: 'Agence Zone Est',                actif: true  },
  ],
  'direction': [
    { code: 'DIR-001', libelle: 'Direction Générale (DG)',                            description: 'Pilotage stratégique et gouvernance BPBF',                   actif: true  },
    { code: 'DIR-002', libelle: 'Direction des Opérations Bancaires (DOB)',            description: 'Exploitation bancaire et gestion du réseau d\'agences',       actif: true  },
    { code: 'DIR-003', libelle: 'Direction Monétique & SI (DMSI)',                    description: 'Systèmes d\'information, réseaux bancaires & Cash Point',   actif: true  },
    { code: 'DIR-004', libelle: 'Direction des Ressources Humaines (DRH)',             description: 'Gestion du personnel, paie et développement des compétences', actif: true  },
    { code: 'DIR-005', libelle: 'Direction Financière & Trésorerie (DFT)',             description: 'Gestion financière, comptabilité et trésorerie bancaire',    actif: true  },
  ],
  'service': [
    { code: 'SRV-001', libelle: 'Service Monétique & Cash Point',     description: 'Gestion des cartes, GAB, TPE et services Cash Point', actif: true  },
    { code: 'SRV-002', libelle: 'Service Gestion du Personnel & Paie', description: 'Administration du personnel et calcul de la paie',      actif: true  },
    { code: 'SRV-003', libelle: 'Service Comptabilité & Trésorerie',  description: 'Comptabilité générale bancaire et gestion de la caisse', actif: true },
    { code: 'SRV-004', libelle: 'Service Opérations de Guichet',       description: 'Gestion des opérations de caisse et transferts',          actif: true  },
    { code: 'SRV-005', libelle: 'Service Crédit & Engagements',        description: 'Analyse et octroi des prêts aux particuliers et pro',     actif: true  }
  ],
  'emploi': [
    { id: '1', code: 'EMP-001', libelle: 'Directeur Général', description: 'Direction et stratégie globale BPBF', actif: true },
    { id: '2', code: 'EMP-002', libelle: 'Directeur de Département', description: 'Management et pilotage départemental', actif: true },
    { id: '3', code: 'EMP-003', libelle: 'Chef de Service', description: 'Supervision opérationnelle des équipes', actif: true },
    { id: '4', code: 'EMP-004', libelle: 'Analyste Financier / Comptable', description: 'Gestion financière et comptabilité bancaire', actif: true },
    { id: '5', code: 'EMP-005', libelle: 'Ingénieur Monétique / SI', description: 'Systèmes d\'information et réseaux bancaires', actif: true },
    { id: '6', code: 'EMP-006', libelle: 'Caissier Principal', description: 'Gestion des flux de caisse et coffre', actif: true },
    { id: '7', code: 'EMP-007', libelle: 'Gestionnaire Cash Point', description: 'Gestion des points de retrait et services cash', actif: true },
    { id: '8', code: 'EMP-008', libelle: 'Chargé de Clientèle Entreprises & PME', description: 'Gestion et développement du portefeuille pro et PME BPBF', actif: true },
    { id: '9', code: 'EMP-009', libelle: 'Auditeur Interne & Contrôleur de Gestion', description: 'Évaluation des risques bancaires et contrôle de conformité', actif: true }
  ],
  'fonction': [
    // ─── FONCTIONS NON NOMMÉES (postes généraux sans acte de nomination) ───────
    { id: '1',  code: 'FCT-001', libelle: 'Agent',                          description: 'Agent d\'exécution — Poste de base non nommé',                typeNomination: 'NON_NOMMEE', actif: true },
    { id: '2',  code: 'FCT-002', libelle: 'Employé',                        description: 'Employé polyvalent — Poste standard non nommé',               typeNomination: 'NON_NOMMEE', actif: true },
    { id: '3',  code: 'FCT-003', libelle: 'Technicien Opérationnel',        description: 'Technicien d\'exploitation opérationnelle — Non nommé',       typeNomination: 'NON_NOMMEE', actif: true },
    { id: '4',  code: 'FCT-004', libelle: 'Agent de Maîtrise',              description: 'Agent de maîtrise technique — Non nommé',                     typeNomination: 'NON_NOMMEE', actif: true },
    { id: '5',  code: 'FCT-005', libelle: 'Cadre Moyen',                    description: 'Cadre de niveau intermédiaire — Non nommé',                   typeNomination: 'NON_NOMMEE', actif: true },
    { id: '6',  code: 'FCT-006', libelle: 'Cadre',                          description: 'Cadre professionnel — Non nommé',                             typeNomination: 'NON_NOMMEE', actif: true },
    { id: '7',  code: 'FCT-007', libelle: 'Cadre Supérieur',                description: 'Cadre de haut niveau — Non nommé',                           typeNomination: 'NON_NOMMEE', actif: true },
    // ─── FONCTIONS NOMMÉES (acte de nomination obligatoire) ──────────────────
    { id: '8',  code: 'FCT-008', libelle: 'Directeur de Département',       description: 'Nomination Direction / Management Département',               typeNomination: 'NOMMEE', actif: true },
    { id: '9',  code: 'FCT-009', libelle: 'Responsable de Département',     description: 'Nomination Responsable Département',                         typeNomination: 'NOMMEE', actif: true },
    { id: '10', code: 'FCT-010', libelle: 'Chef de Service',                description: 'Nomination Chef de Service opérationnel',                    typeNomination: 'NOMMEE', actif: true },
    { id: '11', code: 'FCT-011', libelle: "Chef d'Agence",                  description: 'Nomination Chef d\'Agence / Unité',                          typeNomination: 'NOMMEE', actif: true },
    { id: '12', code: 'FCT-012', libelle: 'Caissier Principal',             description: 'Nomination Caissier Principal (Coffre & Caisses)',           typeNomination: 'NOMMEE', actif: true },
    { id: '13', code: 'FCT-013', libelle: 'Gestionnaire Cash Point',        description: 'Nomination Gestionnaire Points de Retrait & Monétique',     typeNomination: 'NOMMEE', actif: true },
    { id: '14', code: 'FCT-014', libelle: 'Caissier Auxiliaire',            description: 'Nomination Caissier Auxiliaire de guichet',                  typeNomination: 'NOMMEE', actif: true },
    { id: '15', code: 'FCT-015', libelle: 'Chauffeur',                      description: 'Nomination Conducteur de véhicule de service',               typeNomination: 'NOMMEE', actif: true },
    { id: '16', code: 'FCT-016', libelle: 'Assistante de Direction',        description: 'Nomination Secrétariat / Assistante DG / Direction',        typeNomination: 'NOMMEE', actif: true },
    { id: '17', code: 'FCT-017', libelle: 'Agent de Liaison',               description: 'Nomination Courrier et Liaison institutionnelle',            typeNomination: 'NOMMEE', actif: true }
  ],
  'param-indemnite': [
    // ─── GROUPE I : AGENTS, EMPLOYES & TECHNICIENS OPERATIONNELS ───────────────
    { id: 'G1-LOG', code: 'PI-G1-LOG', libelle: 'Indemnité de Logement - Groupe I',    description: 'Logement BPBF (Groupe I - Catégories C1 à C7)', actif: true, typeIndemnite: 'Indemnité de logement',  fonction: '', grade: 'GROUPE I', categorie: 'C1, C2, C3, C4, C5, C6, C7', categories: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'], montant: 35000,  taux: 35000  },
    { id: 'G1-TPT', code: 'PI-G1-TPT', libelle: 'Indemnité de Transport - Groupe I',   description: 'Transport BPBF (Groupe I - Catégories C1 à C7)', actif: true, typeIndemnite: 'Indemnité de transport', fonction: '', grade: 'GROUPE I', categorie: 'C1, C2, C3, C4, C5, C6, C7', categories: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'], montant: 30000,  taux: 30000  },

    // ─── GROUPE II : AGENTS DE MAITRISE & CADRES MOYENS ────────────────────────
    { id: 'G2C1-LOG', code: 'PI-G2-C1-LOG', libelle: 'Indemnité de Logement - Groupe II',   description: 'Logement BPBF (Groupe II - Classes CL1 à CL4)',   actif: true, typeIndemnite: 'Indemnité de logement',  fonction: '', grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 45000, taux: 45000 },
    { id: 'G2C1-TPT', code: 'PI-G2-C1-TPT', libelle: 'Indemnité de Transport - Groupe II',  description: 'Transport BPBF (Groupe II - Classes CL1 à CL4)',  actif: true, typeIndemnite: 'Indemnité de transport', fonction: '', grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 45000, taux: 45000 },
    { id: 'G2C1-SUJ', code: 'PI-G2-C1-SUJ', libelle: 'Indemnité de Sujétion - Groupe II',   description: 'Sujétion BPBF (Groupe II - Classes CL1 à CL4)',   actif: true, typeIndemnite: 'Indemnité de Sujétion',  fonction: '', grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 30000, taux: 30000 },

    // ─── GROUPE III : CADRES & CADRES SUPERIEURS ───────────────────────────────
    { id: 'G3C5-LOG', code: 'PI-G3-C5-LOG', libelle: 'Indemnité de Logement - Groupe III',   description: 'Logement BPBF (Groupe III - Classes CL5 à CL8)',   actif: true, typeIndemnite: 'Indemnité de logement',  fonction: '', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 100000, taux: 100000 },
    { id: 'G3C5-TPT', code: 'PI-G3-C5-TPT', libelle: 'Indemnité de Transport - Groupe III',  description: 'Transport BPBF (Groupe III - Classes CL5 à CL8)',  actif: true, typeIndemnite: 'Indemnité de transport', fonction: '', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 75000,  taux: 75000  },
    { id: 'G3C5-SUJ', code: 'PI-G3-C5-SUJ', libelle: 'Indemnité de Sujétion - Groupe III',   description: 'Sujétion BPBF (Groupe III - Classes CL5 à CL8)',   actif: true, typeIndemnite: 'Indemnité de Sujétion',  fonction: '', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 60000,  taux: 60000  },

    // ─── INDEMNITÉS DE NOMINATION (POSTE / FONCTION) ──────────────────────────
    { id: 'NOM-DIR-FCT', code: 'PI-NOM-DIR-FCT', libelle: 'Ind. Fonction - Dir. Département',  description: 'Directeur Département — Indemnité de fonction',      actif: true, typeIndemnite: 'Indemnité de fonction',      fonction: 'Directeur de Département', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 150000, taux: 150000 },
    { id: 'NOM-DIR-TPT', code: 'PI-NOM-DIR-TPT', libelle: 'Ind. Transport - Dir. Département', description: 'Directeur Département — Indemnité de transport',     actif: true, typeIndemnite: 'Indemnité de transport',     fonction: 'Directeur de Département', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 100000, taux: 100000 },
    { id: 'NOM-DIR-LOG', code: 'PI-NOM-DIR-LOG', libelle: 'Ind. Logement - Dir. Département',  description: 'Directeur Département — Indemnité de logement',      actif: true, typeIndemnite: 'Indemnité de logement',      fonction: 'Directeur de Département', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 200000, taux: 200000 },
    { id: 'NOM-DIR-CMP', code: 'PI-NOM-DIR-CMP', libelle: 'Ind. Compensatrice - Dir. Dépt.',   description: 'Directeur Département — Indemnité compensatrice',    actif: true, typeIndemnite: 'Indemnité compensatrice',    fonction: 'Directeur de Département', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 100000, taux: 100000 },

    { id: 'NOM-RESP-FCT', code: 'PI-NOM-RESP-FCT', libelle: 'Ind. Fonction - Resp. Département',  description: 'Responsable Département — Indemnité de fonction',  actif: true, typeIndemnite: 'Indemnité de fonction',      fonction: 'Responsable de Département', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 100000, taux: 100000 },
    { id: 'NOM-RESP-TPT', code: 'PI-NOM-RESP-TPT', libelle: 'Ind. Transport - Resp. Département', description: 'Responsable Département — Indemnité de transport', actif: true, typeIndemnite: 'Indemnité de transport',     fonction: 'Responsable de Département', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 75000,  taux: 75000  },
    { id: 'NOM-RESP-LOG', code: 'PI-NOM-RESP-LOG', libelle: 'Ind. Logement - Resp. Département',  description: 'Responsable Département — Indemnité de logement',  actif: true, typeIndemnite: 'Indemnité de logement',      fonction: 'Responsable de Département', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 150000, taux: 150000 },
    { id: 'NOM-RESP-CMP', code: 'PI-NOM-RESP-CMP', libelle: 'Ind. Compensatrice - Resp. Dépt.',   description: 'Responsable Département — Indemnité compensatrice', actif: true, typeIndemnite: 'Indemnité compensatrice',    fonction: 'Responsable de Département', grade: 'GROUPE III', categorie: 'CL5, CL6, CL7, CL8', categories: ['CL5', 'CL6', 'CL7', 'CL8'], montant: 75000,  taux: 75000  },

    { id: 'NOM-CS-FCT', code: 'PI-NOM-CS-FCT', libelle: 'Ind. Fonction - Chef de Service',   description: 'Chef de Service — Indemnité de fonction',           actif: true, typeIndemnite: 'Indemnité de fonction',      fonction: 'Chef de Service', grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 80000,  taux: 80000  },
    { id: 'NOM-CS-TPT', code: 'PI-NOM-CS-TPT', libelle: 'Ind. Transport - Chef de Service',  description: 'Chef de Service — Indemnité de transport',          actif: true, typeIndemnite: 'Indemnité de transport',     fonction: 'Chef de Service', grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 75000,  taux: 75000  },
    { id: 'NOM-CS-LOG', code: 'PI-NOM-CS-LOG', libelle: 'Ind. Logement - Chef de Service',   description: 'Chef de Service — Indemnité de logement',           actif: true, typeIndemnite: 'Indemnité de logement',      fonction: 'Chef de Service', grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 120000, taux: 120000 },
    { id: 'NOM-CS-CMP', code: 'PI-NOM-CS-CMP', libelle: 'Ind. Compensatrice - Chef de Service',description: 'Chef de Service — Indemnité compensatrice',         actif: true, typeIndemnite: 'Indemnité compensatrice',    fonction: 'Chef de Service', grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 75000,  taux: 75000  },

    { id: 'NOM-CA-FCT', code: 'PI-NOM-CA-FCT', libelle: "Ind. Fonction - Chef d'Agence",    description: "Chef d'Agence — Indemnité de fonction",              actif: true, typeIndemnite: 'Indemnité de fonction',      fonction: "Chef d'Agence",   grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 75000,  taux: 75000  },
    { id: 'NOM-CA-TPT', code: 'PI-NOM-CA-TPT', libelle: "Ind. Transport - Chef d'Agence",   description: "Chef d'Agence — Indemnité de transport",             actif: true, typeIndemnite: 'Indemnité de transport',     fonction: "Chef d'Agence",   grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 75000,  taux: 75000  },
    { id: 'NOM-CA-LOG', code: 'PI-NOM-CA-LOG', libelle: "Ind. Logement - Chef d'Agence",    description: "Chef d'Agence — Indemnité de logement",              actif: true, typeIndemnite: 'Indemnité de logement',      fonction: "Chef d'Agence",   grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 100000, taux: 100000 },
    { id: 'NOM-CA-CMP', code: 'PI-NOM-CA-CMP', libelle: "Ind. Compensatrice - Chef d'Agence",description: "Chef d'Agence — Indemnité compensatrice",            actif: true, typeIndemnite: 'Indemnité compensatrice',    fonction: "Chef d'Agence",   grade: 'GROUPE II', categorie: 'CL1, CL2, CL3, CL4', categories: ['CL1', 'CL2', 'CL3', 'CL4'], montant: 75000,  taux: 75000  },

    // ─── INDEMNITÉS SPÉCIALES (CASH POINT, ASTREINTE, CAISSE) ─────────────────
    { id: 'SP-CPRINC',  code: 'PI-SP-CAISSE-PRINC',  libelle: 'Ind. de Caisse - Caissier Principal',      description: 'Caissier Principal — Indemnité de caisse',          actif: true, typeIndemnite: 'Indemnité de caisse',         fonction: 'Caissier Principal',         grade: 'GROUPE I', categorie: 'C1, C2, C3, C4, C5, C6, C7', categories: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'], montant: 40000, taux: 40000 },
    { id: 'SP-CGEST-A', code: 'PI-SP-GEST-ASTR',      libelle: "Ind. d'Astreinte - Gestionnaire Cash Point", description: 'Gestionnaire Cash Point — Astreinte',              actif: true, typeIndemnite: "Indemnité d'astreinte",       fonction: 'Gestionnaire Cash Point',    grade: 'GROUPE I', categorie: 'C1, C2, C3, C4, C5, C6, C7', categories: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'], montant: 50000, taux: 50000 },
    { id: 'SP-CGEST-C', code: 'PI-SP-GEST-CAISSE',    libelle: 'Ind. de Caisse - Gestionnaire Cash Point',  description: 'Gestionnaire Cash Point — Caisse',                 actif: true, typeIndemnite: 'Indemnité de caisse',         fonction: 'Gestionnaire Cash Point',    grade: 'GROUPE I', categorie: 'C1, C2, C3, C4, C5, C6, C7', categories: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'], montant: 25000, taux: 25000 },
    { id: 'SP-CAUX',    code: 'PI-SP-CAISSE-AUX',     libelle: 'Ind. de Caisse - Caissier Auxiliaire',       description: 'Caissier Auxiliaire — Indemnité de caisse',        actif: true, typeIndemnite: 'Indemnité de caisse',         fonction: 'Caissier Auxiliaire',        grade: 'GROUPE I', categorie: 'C1, C2, C3, C4, C5, C6, C7', categories: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'], montant: 25000, taux: 25000 },
    { id: 'SP-CHAUF',   code: 'PI-SP-CHAUF',           libelle: 'Ind. de Transport - Chauffeur',              description: 'Chauffeur — Indemnité de transport',               actif: true, typeIndemnite: 'Indemnité de transport',       fonction: 'Chauffeur',                  grade: 'GROUPE I', categorie: 'C1, C2, C3, C4, C5, C6, C7', categories: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'], montant: 15000, taux: 15000 },
    { id: 'SP-ASST',    code: 'PI-SP-ASST-DIR',        libelle: 'Ind. - Assistante de Direction',             description: 'Assistante de Direction — Indemnité spéciale',     actif: true, typeIndemnite: 'Indemnité de représentation', fonction: 'Assistante de Direction',    grade: 'GROUPE I', categorie: 'C1, C2, C3, C4, C5, C6, C7', categories: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'], montant: 30000, taux: 30000 },
    { id: 'SP-ALIAIS',  code: 'PI-SP-AGENT-LIAISON',   libelle: "Ind. - Agent de Liaison",                    description: "Agent de Liaison — Indemnité spéciale",           actif: true, typeIndemnite: 'Indemnité de représentation', fonction: 'Agent de Liaison',           grade: 'GROUPE I', categorie: 'C1, C2, C3, C4, C5, C6, C7', categories: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'], montant: 15000, taux: 15000 }
  ],
  'grille-salariale': buildOfficialGridItems(),
  'categorie': [
    { code: 'C1',  libelle: '1ÈRE CATEGORIE', description: 'Groupe I — Agent d\'exécution (Base 95 945 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'C2',  libelle: '2ÈME CATEGORIE', description: 'Groupe I — Agent d\'exécution (Base 104 474 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'C3',  libelle: '3ÈME CATEGORIE', description: 'Groupe I — Agent d\'exécution (Base 107 135 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'C4',  libelle: '4ÈME CATEGORIE', description: 'Groupe I — Employé qualifié (Base 115 558 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'C5',  libelle: '5ÈME CATEGORIE', description: 'Groupe I — Employé qualifié (Base 128 831 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'C6',  libelle: '6ÈME CATEGORIE', description: 'Groupe I — Employé principal (Base 157 940 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'C7',  libelle: '7ÈME CATEGORIE', description: 'Groupe I — Agent de maîtrise (Base 176 441 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'CL1', libelle: 'CLASSE I',        description: 'Groupe II — Agent de maîtrise / Technicien (Base 173 090 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'CL2', libelle: 'CLASSE II',       description: 'Groupe II — Agent de maîtrise supérieur (Base 203 834 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'CL3', libelle: 'CLASSE III',      description: 'Groupe II — Cadre moyen (Base 278 697 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'CL4', libelle: 'CLASSE IV',       description: 'Groupe II — Cadre supérieur (Base 405 758 FCFA)', tauxAbattement: 25, actif: true },
    { code: 'CL5', libelle: 'CLASSE V',        description: 'Groupe III — Cadre de direction (Base 581 390 FCFA)', tauxAbattement: 20, actif: true },
    { code: 'CL6', libelle: 'CLASSE VI',       description: 'Groupe III — Chef de Département (Base 599 438 FCFA)', tauxAbattement: 20, actif: true },
    { code: 'CL7', libelle: 'CLASSE VII',      description: 'Groupe III — Directeur (Base 631 454 FCFA)', tauxAbattement: 20, actif: true },
    { code: 'CL8', libelle: 'CLASSE VIII',     description: 'Groupe III — Directeur Général / Exécutif (Base 710 386 FCFA)', tauxAbattement: 20, actif: true }
  ],
  'grade': [
    { code: 'GROUPE I',   libelle: 'GROUPE I',   description: 'AGENTS, EMPLOYES et TECHNICIENS OPERATIONNELS', actif: true },
    { code: 'GROUPE II',  libelle: 'GROUPE II',  description: 'AGENTS DE MAITRISE et CADRES MOYENS', actif: true },
    { code: 'GROUPE III', libelle: 'GROUPE III', description: 'CADRES et CADRES SUPERIEURS', actif: true },
    { code: 'GROUPE IV',  libelle: 'GROUPE IV',  description: 'HORS CATEGORIE / Cadres Dirigeants & Spécialistes', actif: true }
  ],
  'param-groupe': [
    { code: 'PG-GRP-1', grade: 'GROUPE I',   libelle: 'GROUPE I',   categories: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'], description: 'Catégories C1 à C7 rattachées au Groupe I', actif: true },
    { code: 'PG-GRP-2', grade: 'GROUPE II',  libelle: 'GROUPE II',  categories: ['CL1', 'CL2', 'CL3', 'CL4'], description: 'Classes CL1 à CL4 rattachées au Groupe II', actif: true },
    { code: 'PG-GRP-3', grade: 'GROUPE III', libelle: 'GROUPE III', categories: ['CL5', 'CL6', 'CL7', 'CL8'], description: 'Classes CL5 à CL8 rattachées au Groupe III', actif: true },
    { code: 'PG-GRP-4', grade: 'GROUPE IV',  libelle: 'GROUPE IV',  categories: ['CL9', 'CL10'], description: 'Classes CL9 à CL10 rattachées au Groupe IV', actif: true }
  ],
  'echelon': [
    { code: 'E01', libelle: 'Échelon 1',  description: 'Échelon de base (Base 100%)', actif: true },
    { code: 'E02', libelle: 'Échelon 2',  description: 'Progression échelon 2 (+10%)', actif: true },
    { code: 'E03', libelle: 'Échelon 3',  description: 'Progression échelon 3 (+21%)', actif: true },
    { code: 'E04', libelle: 'Échelon 4',  description: 'Progression échelon 4 (+33%)', actif: true },
    { code: 'E05', libelle: 'Échelon 5',  description: 'Progression échelon 5 (+46%)', actif: true },
    { code: 'E06', libelle: 'Échelon 6',  description: 'Progression échelon 6 (+61%)', actif: true },
    { code: 'E07', libelle: 'Échelon 7',  description: 'Progression échelon 7 (+77%)', actif: true },
    { code: 'E08', libelle: 'Échelon 8',  description: 'Progression échelon 8 (+95%)', actif: true },
    { code: 'E09', libelle: 'Échelon 9',  description: 'Progression échelon 9 (+114%)', actif: true },
    { code: 'E10', libelle: 'Échelon 10', description: 'Progression échelon 10 (+135%)', actif: true },
    { code: 'E11', libelle: 'Échelon 11', description: 'Progression échelon 11 (+158%)', actif: true },
    { code: 'E12', libelle: 'Échelon 12', description: 'Progression échelon 12 (+183%)', actif: true },
    { code: 'E13', libelle: 'Échelon 13', description: 'Progression échelon 13 (+211%)', actif: true },
    { code: 'E14', libelle: 'Échelon 14', description: 'Progression échelon 14 (+241%)', actif: true },
    { code: 'E15', libelle: 'Échelon 15', description: 'Progression échelon 15 (+274%)', actif: true }
  ],
  'competences': [
    { code: 'CMP-001', libelle: 'Leadership',        description: 'Capacité à diriger',         actif: true },
    { code: 'CMP-002', libelle: 'Gestion de projet', description: 'Planification de projets',   actif: true },
    { code: 'CMP-003', libelle: 'Communication',     description: 'Expression orale et écrite', actif: true },
    { code: 'CMP-004', libelle: 'Analyse de données',description: 'Traitement de données',      actif: true },
    { code: 'CMP-005', libelle: 'Service client',    description: 'Relation client',            actif: true },
  ],
  'type-formation': [
    { code: 'FRM-001', libelle: 'Formation initiale',  description: 'Formation à l\'embauche',     actif: true  },
    { code: 'FRM-002', libelle: 'Formation continue',  description: 'Perfectionnement',            actif: true  },
    { code: 'FRM-003', libelle: 'E-learning',          description: 'Formation en ligne',          actif: true  },
    { code: 'FRM-004', libelle: 'Séminaire',           description: 'Formation en présentiel',     actif: true  },
    { code: 'FRM-005', libelle: 'Coaching',            description: 'Accompagnement individuel',   actif: false },
  ],
  'type-evaluation': [
    { code: 'EVL-001', libelle: 'Entretien annuel',        description: 'Évaluation annuelle',          actif: true  },
    { code: 'EVL-002', libelle: 'Entretien semestriel',    description: 'Évaluation à mi-parcours',     actif: true  },
    { code: 'EVL-003', libelle: 'Évaluation période essai',description: 'Fin de période d\'essai',      actif: true  },
    { code: 'EVL-004', libelle: '360°',                    description: 'Évaluation multi-sources',     actif: false },
  ],
  'rubrique': [
    { code: 'RUB-001', libelle: 'Salaire de base',        description: 'Rémunération brute',           actif: true },
    { code: 'RUB-002', libelle: 'Heures supplémentaires', description: 'Majoration heures hors contrat',actif: true },
    { code: 'RUB-003', libelle: 'Prime de rendement',     description: 'Prime de performance',         actif: true },
    { code: 'RUB-004', libelle: 'Retenue CNSS',           description: 'Cotisation sociale employé',   actif: true },
    { code: 'RUB-005', libelle: 'IUTS',                   description: 'Impôt unique traitements',     actif: true },
  ],
  'bareme': [
    { code: 'BAR-001', libelle: 'Tranche 1 — 0 %',  description: '0 à 30 000 FCFA',       actif: true },
    { code: 'BAR-002', libelle: 'Tranche 2 — 12 %', description: '30 001 à 60 000 FCFA',  actif: true },
    { code: 'BAR-003', libelle: 'Tranche 3 — 22 %', description: '60 001 à 150 000 FCFA', actif: true },
    { code: 'BAR-004', libelle: 'Tranche 4 — 30 %', description: 'Plus de 150 000 FCFA',  actif: true },
  ],
  'mode-paiement': [
    { code: 'MPY-001', libelle: 'Virement bancaire', description: 'Virement vers compte bancaire', actif: true  },
    { code: 'MPY-002', libelle: 'Mobile Money',      description: 'Paiement par mobile money',     actif: true  },
    { code: 'MPY-003', libelle: 'Espèces',           description: 'Paiement en espèces',           actif: false },
    { code: 'MPY-004', libelle: 'Chèque',            description: 'Paiement par chèque',           actif: false },
  ]
};

@Injectable({
  providedIn: 'root'
})
export class DbRefService {
  private cache: Record<string, BehaviorSubject<RefItem[]>> = {};
  public refChanges$ = new Subject<{ type: string; action: string; item?: RefItem }>();

  constructor(private http: HttpClient) {
    try {
      const stored = localStorage.getItem('ref_grille-salariale');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed) || parsed.length !== 225) {
          localStorage.removeItem('ref_grille-salariale');
        }
      }
    } catch (e) {
      localStorage.removeItem('ref_grille-salariale');
    }
  }

  private getSubject(type: string): BehaviorSubject<RefItem[]> {
    if (!this.cache[type]) {
      this.cache[type] = new BehaviorSubject<RefItem[]>([]);
    }
    return this.cache[type];
  }

  getItems$(type: string): Observable<RefItem[]> {
    this.getItems(type).subscribe();
    return this.getSubject(type).asObservable();
  }

  notifyChange(type: string, action: string, item?: RefItem): void {
    const list = this.getCurrentItems(type);
    this.getSubject(type).next(list);
    this.refChanges$.next({ type, action, item });
  }

  // ─── Vérifie si ce type a un backend réel ─────────────────────────────────
  private hasBackend(type: string): boolean {
    return !!BACKEND_MAP[type];
  }

  // ─── Charge depuis mock localStorage ──────────────────────────────────────
  private getMockItems(type: string): RefItem[] {
    if (type === 'categorie') {
      const v5Key = 'ref_categorie_v5';
      const stored = localStorage.getItem(v5Key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length === 15) {
            return parsed;
          }
        } catch (e) {}
      }
      localStorage.removeItem('ref_categorie');
      localStorage.removeItem('ref_categorie_v2');
      localStorage.removeItem('ref_categorie_v3');
      localStorage.removeItem('ref_categorie_v4');
      const initial = MOCK_DATA['categorie'];
      localStorage.setItem(v5Key, JSON.stringify(initial));
      return initial;
    }

    if (type === 'type-retenue-employe' || type === 'type-retenue-emploi') {
      const vKey = `ref_${type}_v3`;
      const stored = localStorage.getItem(vKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {}
      }
      const initial = MOCK_DATA[type] ?? [];
      localStorage.setItem(vKey, JSON.stringify(initial));
      return initial;
    }

    if (type === 'fonction') {
      const v3Key = 'ref_fonction_v3';
      const stored = localStorage.getItem(v3Key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length >= 17 && parsed.some((x: any) => x.typeNomination)) {
            return parsed;
          }
        } catch (e) {}
      }
      localStorage.removeItem('ref_fonction');
      localStorage.removeItem('ref_fonction_v2');
      const initial = MOCK_DATA['fonction'];
      localStorage.setItem(v3Key, JSON.stringify(initial));
      return initial;
    }

    if (type === 'grille-salariale') {
      const stored = localStorage.getItem('ref_grille-salariale');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (!Array.isArray(parsed) || parsed.length !== 225 || parsed.some((x: any) => x.code?.includes('CATEGORIE') || x.code?.includes('CLASSE') || x.grade?.includes('GRADE'))) {
            localStorage.removeItem('ref_grille-salariale');
          }
        } catch (e) {
          localStorage.removeItem('ref_grille-salariale');
        }
      }
    }
    if (type === 'param-indemnite') {
      const v6Key = 'ref_param-indemnite_v6';
      const stored = localStorage.getItem(v6Key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length >= 20) {
            return parsed;
          }
        } catch (e) {}
      }
      localStorage.removeItem('ref_param-indemnite');
      localStorage.removeItem('ref_param-indemnite_v2');
      localStorage.removeItem('ref_param-indemnite_v3');
      localStorage.removeItem('ref_param-indemnite_v4');
      localStorage.removeItem('ref_param-indemnite_v5');
      const initial = MOCK_DATA['param-indemnite'];
      localStorage.setItem(v6Key, JSON.stringify(initial));
      return initial;
    }
    if (type === 'grade' || type === 'echelon') {
      const stored = localStorage.getItem(`ref_${type}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (type === 'grade' && parsed.some((x: any) => x.code?.includes('GRADE') || x.libelle?.includes('GRADE') || x.code?.startsWith('GRD-'))) {
            localStorage.removeItem(`ref_${type}`);
          }
          if (type === 'echelon' && (parsed.length < 15 || parsed.some((x: any) => x.code?.startsWith('ECH-') || x.code === 'E1'))) {
            localStorage.removeItem(`ref_${type}`);
          }
        } catch (e) {
          localStorage.removeItem(`ref_${type}`);
        }
      }
    }
    const genericStored = localStorage.getItem(`ref_${type}`);
    if (genericStored) {
      try {
        const parsed = JSON.parse(genericStored);
        if (type === 'grade' && Array.isArray(parsed) && parsed.some((x: any) => x.libelle?.includes('GRADE'))) {
          localStorage.removeItem(`ref_${type}`);
          const initial = MOCK_DATA[type] ?? [];
          localStorage.setItem(`ref_${type}`, JSON.stringify(initial));
          return initial;
        }
        if (type === 'categorie' && Array.isArray(parsed) && parsed.some((x: any) => !x.code?.startsWith('C'))) {
          localStorage.removeItem(`ref_${type}`);
          const initial = MOCK_DATA[type] ?? [];
          localStorage.setItem(`ref_${type}`, JSON.stringify(initial));
          return initial;
        }
        return parsed;
      } catch (e) {
        localStorage.removeItem(`ref_${type}`);
      }
    }
    const genericInitial = MOCK_DATA[type] ?? [];
    localStorage.setItem(`ref_${type}`, JSON.stringify(genericInitial));
    return genericInitial;
  }

  private saveMockItems(type: string, items: RefItem[]): void {
    let key = `ref_${type}`;
    if (type === 'categorie') key = 'ref_categorie_v5';
    if (type === 'fonction') key = 'ref_fonction_v3';
    if (type === 'type-retenue-employe' || type === 'type-retenue-emploi') key = `ref_${type}_v3`;
    localStorage.setItem(key, JSON.stringify(items));
    this.getSubject(type).next(items);
    this.refChanges$.next({ type, action: 'update', item: items && items.length > 0 ? items[0] : undefined });
  }

  private getCurrentItems(type: string): RefItem[] {
    const subject = this.getSubject(type);
    if (subject.value && subject.value.length > 0) {
      return subject.value;
    }
    return this.getMockItems(type);
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  getItems(type: string): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];

    if (mapping) {
      const url = `${environment.apiUrl}/${mapping.segment}${mapping.getAllPath}`;
      return this.http.get<any[]>(url).pipe(
        map(dtos => (Array.isArray(dtos) && dtos.length > 0) ? dtos.map(dto => mapping.toFront(dto)) : []),
        map(items => {
          if (!items || items.length === 0) {
            return this.getMockItems(type);
          }
          if (type === 'fonction' && items.length < 15) {
            const mockList = this.getMockItems('fonction');
            const merged = [...items];
            for (const m of mockList) {
              if (!merged.some(e => e.libelle.toLowerCase().trim() === m.libelle.toLowerCase().trim())) {
                merged.push(m);
              }
            }
            return merged;
          }
          return items;
        }),
        tap(items => {
          this.getSubject(type).next(items);
          this.saveMockItems(type, items);
        }),
        catchError(err => {
          console.warn(`[DbRefService] Backend error for "${type}", using mock:`, err.message);
          const items = this.getMockItems(type);
          this.getSubject(type).next(items);
          return of(items);
        })
      );
    }

    // Type sans backend : utiliser mock persistant
    const items = this.getMockItems(type);
    this.getSubject(type).next(items);
    return of(items);
  }

  private isSameItem(a: RefItem, b: RefItem, type: string, originalCode?: string): boolean {
    if (a.id && b.id && String(a.id) === String(b.id)) return true;

    const targetCode = (originalCode || b.code || '').trim().toUpperCase();
    const aCode = (a.code || '').trim().toUpperCase();
    const bCode = (b.code || '').trim().toUpperCase();

    if (type === 'grille-salariale') {
      const aCat = (a.categorie || a.code || '').trim().toUpperCase();
      const targetCat = (b.categorie || targetCode || '').trim().toUpperCase();
      const aEch = String(a.echellon || '1').trim();
      const bEch = String(b.echellon || '1').trim();
      return (aCat === targetCat || aCode === targetCode) && (aEch === bEch);
    }

    if (type === 'param-indemnite') {
      const aTypeInd = (a.typeIndemnite || a.libelle || '').trim().toUpperCase();
      const bTypeInd = (b.typeIndemnite || b.libelle || '').trim().toUpperCase();
      return (aCode.length > 0 && (aCode === targetCode || aCode === bCode)) ||
             (aTypeInd.length > 0 && aTypeInd === bTypeInd && a.grade === b.grade && a.fonction === b.fonction && a.categorie === b.categorie);
    }

    return (aCode.length > 0 && (aCode === targetCode || aCode === bCode));
  }

  // ─── ADD ───────────────────────────────────────────────────────────────────
  addItem(type: string, item: RefItem): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];
    const currentList = this.getCurrentItems(type);

    const addLocalState = (newItem: RefItem): RefItem[] => {
      const newList = [...currentList.filter(i => !this.isSameItem(i, newItem, type)), newItem];
      this.getSubject(type).next(newList);
      this.saveMockItems(type, newList);
      return newList;
    };

    if (mapping) {
      const body = mapping.toBack(item);
      return this.http.post<any>(`${environment.apiUrl}/${mapping.segment}/create`, body).pipe(
        map(dto => mapping.toFront(dto)),
        map(newItem => addLocalState(newItem)),
        catchError(err => {
          console.warn(`[DbRefService] Backend post error for ${type}, updating local state:`, err);
          const newItem: RefItem = { ...item, id: item.id || `loc_${Date.now()}` };
          return of(addLocalState(newItem));
        })
      );
    }

    // Mock
    const newItem: RefItem = { ...item, id: item.id || `loc_${Date.now()}` };
    return of(addLocalState(newItem));
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  updateItem(type: string, originalCode: string, updatedItem: RefItem): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];
    const id = updatedItem.id;
    const currentList = this.getCurrentItems(type);

    const updateLocalState = (itemToSave: RefItem): RefItem[] => {
      let found = false;
      const newList = currentList.map(i => {
        if (this.isSameItem(i, itemToSave, type, originalCode)) {
          found = true;
          return { ...i, ...itemToSave };
        }
        return i;
      });
      const finalItems = found ? newList : [...currentList, itemToSave];
      this.getSubject(type).next(finalItems);
      this.saveMockItems(type, finalItems);
      return finalItems;
    };

    if (mapping && id && !String(id).startsWith('mock_') && !String(id).startsWith('loc_')) {
      const body = mapping.toBackUpdate(updatedItem);
      return this.http.put<any>(`${environment.apiUrl}/${mapping.segment}/${id}`, body).pipe(
        map(dto => mapping.toFront(dto)),
        map(updated => updateLocalState(updated)),
        catchError(err => {
          console.warn(`[DbRefService] Backend put error for ${type}, updating local state:`, err);
          return of(updateLocalState(updatedItem));
        })
      );
    }

    // Local / Mock update
    return of(updateLocalState(updatedItem));
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────
  deleteItem(type: string, code: string): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];
    const subject = this.getSubject(type);
    const currentList = this.getCurrentItems(type);
    const item = currentList.find(i => (i.code || '').toUpperCase() === (code || '').toUpperCase());

    const deleteLocalState = (): RefItem[] => {
      const newList = currentList.filter(i => !this.isSameItem(i, { code } as RefItem, type, code));
      subject.next(newList);
      this.saveMockItems(type, newList);
      return newList;
    };

    if (mapping && item?.id && !String(item.id).startsWith('mock_') && !String(item.id).startsWith('loc_')) {
      return this.http.delete(`${environment.apiUrl}/${mapping.segment}/${item.id}`, { responseType: 'text' }).pipe(
        map(() => deleteLocalState()),
        catchError(err => {
          console.warn(`[DbRefService] Backend delete error for ${type}, updating local state:`, err);
          return of(deleteLocalState());
        })
      );
    }

    return of(deleteLocalState());
  }

  // ─── TOGGLE STATUS ─────────────────────────────────────────────────────────
  toggleItemStatus(type: string, code: string): Observable<RefItem[]> {
    const currentList = this.getCurrentItems(type);
    const item = currentList.find(i => (i.code || '').toUpperCase() === (code || '').toUpperCase());
    if (!item) return of(currentList);

    const updatedItem: RefItem = { ...item, actif: !item.actif };
    return this.updateItem(type, code, updatedItem);
  }

  getParamPriseEnCharge(): { ageMaxStd: number; ageMaxEtud: number; maxCap: number; conjointActif: boolean } {
    const list: RefItem[] = this.getCurrentItems('param-prise-en-charge') || [];
    const stdItem = list.find((i: RefItem) => i.code === 'PEC-AGE-STD' && i.actif !== false);
    const etudItem = list.find((i: RefItem) => i.code === 'PEC-AGE-ETUD' && i.actif !== false);
    const conjItem = list.find((i: RefItem) => i.code === 'PEC-CONJOINT' && i.actif !== false);
    const capItem = list.find((i: RefItem) => i.code === 'PEC-MAX-CHRG' && i.actif !== false);

    return {
      ageMaxStd: stdItem && stdItem.taux != null ? Number(stdItem.taux) : 18,
      ageMaxEtud: etudItem && etudItem.taux != null ? Number(etudItem.taux) : 20,
      maxCap: capItem && capItem.taux != null ? Number(capItem.taux) : 4,
      conjointActif: conjItem ? (conjItem.taux !== 0 && conjItem.actif !== false) : true
    };
  }
}
