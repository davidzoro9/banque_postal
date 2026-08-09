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
  regleType?: string;       // pour Paramétrage indemnité : 'ORDINAIRE', 'NOMINATION', 'SPECIFIQUE'
  indemnites?: { typeIndemnite: string; montant: number }[]; // pour Fonction Nommée
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
    segment: 'categorie',
    getAllPath: '',
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
    segment: 'grade',
    getAllPath: '',
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
  'echelon': {
    segment: 'echelon',
    getAllPath: '',
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
    toFront: dto => ({
      id: String(dto.id),
      code: dto.code || `FCT-${dto.id}`,
      libelle: dto.name || dto.libelle || dto.code || 'Fonction',
      description: dto.description || '',
      actif: dto.actif ?? true,
      typeNomination: dto.typeNomination ? dto.typeNomination : 'NON_NOMMEE',
      indemnites: dto.indemnites || []
    }),
    toBack:  item => ({
      code: item.code,
      name: item.libelle,
      description: item.description || '',
      typeNomination: item.typeNomination || 'NON_NOMMEE',
      actif: item.actif ?? true,
      indemnites: item.indemnites || []
    }),
    toBackUpdate: item => ({
      id: item.id,
      code: item.code,
      name: item.libelle,
      description: item.description || '',
      typeNomination: item.typeNomination || 'NON_NOMMEE',
      actif: item.actif ?? true,
      indemnites: item.indemnites || []
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
      plafondExoneration: dto.plafondExoneration || 0,
      regleType: dto.regleType || 'ORDINAIRE',
      typeNomination: dto.typeNomination || 'TOUTES'
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
      regleType: item.regleType || 'ORDINAIRE',
      typeNomination: item.typeNomination || 'TOUTES',
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
      regleType: item.regleType || 'ORDINAIRE',
      typeNomination: item.typeNomination || 'TOUTES',
      actif: item.actif
    }),
  },
  'param-groupe': {
    segment: 'paramgroupe',
    getAllPath: '',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.code,
      grade: dto.grade || dto.libelle,
      libelle: dto.libelle,
      categorie: dto.categorie,
      categories: dto.categorie ? dto.categorie.split(',').map((c: string) => c.trim()) : [],
      description: dto.description || '',
      actif: dto.actif ?? true
    }),
    toBack: item => ({
      code: item.code,
      grade: item.grade || item.libelle,
      libelle: item.libelle || item.grade,
      categorie: Array.isArray(item.categories) ? item.categories.join(', ') : item.categorie,
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: item => ({
      id: item.id,
      code: item.code,
      grade: item.grade || item.libelle,
      libelle: item.libelle || item.grade,
      categorie: Array.isArray(item.categories) ? item.categories.join(', ') : item.categorie,
      description: item.description,
      actif: item.actif
    }),
  },
  'param-retraite': {
    segment: 'paramretraite',
    getAllPath: '',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.code,
      grade: dto.grade || dto.libelle,
      libelle: dto.libelle || dto.grade,
      taux: dto.taux || 0,
      description: dto.description || '',
      actif: dto.actif ?? true
    }),
    toBack: item => ({
      code: item.code,
      grade: item.grade || item.libelle,
      libelle: item.libelle || item.grade,
      taux: item.taux,
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: item => ({
      id: item.id,
      code: item.code,
      grade: item.grade || item.libelle,
      libelle: item.libelle || item.grade,
      taux: item.taux,
      description: item.description,
      actif: item.actif
    }),
  },
  'param-prise-en-charge': {
    segment: 'parampriseencharge',
    getAllPath: '',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      taux: dto.taux || 0,
      description: dto.description || '',
      actif: dto.actif ?? true
    }),
    toBack: item => ({
      code: item.code,
      libelle: item.libelle,
      taux: item.taux,
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: item => ({
      id: item.id,
      code: item.code,
      libelle: item.libelle,
      taux: item.taux,
      description: item.description,
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
    segment: 'typeretenueemploye',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif ?? true }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'type-retenue-emploi': {
    segment: 'typeretenueemploi',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, typeRetenue: dto.typeRetenue || 'Part Agent', taux: dto.taux || 0, description: dto.description || '', actif: dto.actif ?? true }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, typeRetenue: item.typeRetenue, taux: item.taux, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, typeRetenue: item.typeRetenue, taux: item.taux, description: item.description, actif: item.actif }),
  },
  'agence': {
    segment: 'agences',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.codeAgence || dto.code, libelle: dto.nomAgence || dto.libelle, description: dto.ville || dto.description || '', actif: dto.actif ?? true }),
    toBack:  item => ({ codeAgence: item.code, nomAgence: item.libelle, ville: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, codeAgence: item.code, nomAgence: item.libelle, ville: item.description, actif: item.actif }),
  },
  'bareme': {
    segment: 'baremes-iuts',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.codeTranche || dto.code, libelle: dto.codeTranche || dto.libelle, description: `Taux: ${dto.tauxImposition}%`, actif: dto.actif ?? true }),
    toBack:  item => ({ codeTranche: item.code, tauxImposition: item.taux, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, codeTranche: item.code, tauxImposition: item.taux, actif: item.actif }),
  },
  'rubrique': {
    segment: 'rubriques-paie',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.codeRubrique || dto.code, libelle: dto.libelle, description: dto.formuleCalcul || dto.description || '', actif: dto.actif ?? true }),
    toBack:  item => ({ codeRubrique: item.code, libelle: item.libelle, formuleCalcul: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, codeRubrique: item.code, libelle: item.libelle, formuleCalcul: item.description, actif: item.actif }),
  },
  'mode-paiement': {
    segment: 'modes-paiement',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || dto.banqueNom || '', actif: dto.actif ?? true }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'exoneration': {
    segment: 'exonerations-fiscales',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.baseCalcul || dto.description || '', actif: dto.actif ?? true }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'retenue': {
    segment: 'retenues-salariales',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.typeRetenue || '', montant: dto.montantTotal, taux: dto.taux, actif: dto.actif ?? true }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, typeRetenue: item.typeRetenue, montantTotal: item.montant, taux: item.taux, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, typeRetenue: item.typeRetenue, montantTotal: item.montant, taux: item.taux, actif: item.actif }),
  },
  'prise-en-charge-famille': {
    segment: 'prises-en-charge-famille',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: `${dto.nomMembre || ''}_${dto.prenomMembre || ''}`, libelle: `${dto.nomMembre || ''} ${dto.prenomMembre || ''} (${dto.lienParente || ''})`, description: `Taux: ${dto.tauxPriseEnCharge}%`, actif: dto.actif ?? true }),
    toBack:  item => ({ nomMembre: item.code, prenomMembre: item.libelle, lienParente: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, nomMembre: item.code, prenomMembre: item.libelle, lienParente: item.description, actif: item.actif }),
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

const MOCK_DATA: Record<string, RefItem[]> = {};

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
    return [];
  }

  private saveMockItems(type: string, items: RefItem[]): void {
    this.getSubject(type).next(items);
    this.refChanges$.next({ type, action: 'update', item: items && items.length > 0 ? items[0] : undefined });
  }

  private getCurrentItems(type: string): RefItem[] {
    const subject = this.getSubject(type);
    return subject.value || [];
  }

  // ─── GET ALL ───────────────────────────────────────────────────────────────
  getItems(type: string): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];

    if (mapping) {
      const url = `${environment.apiUrl}/${mapping.segment}${mapping.getAllPath}`;
      return this.http.get<any[]>(url).pipe(
        map(dtos => (Array.isArray(dtos) && dtos.length > 0) ? dtos.map(dto => mapping.toFront(dto)) : []),
        tap(items => {
          this.getSubject(type).next(items);
        }),
        catchError(err => {
          console.warn(`[DbRefService] Backend error for "${type}":`, err.message);
          this.getSubject(type).next([]);
          return of([]);
        })
      );
    }

    const genericUrl = `${environment.apiUrl}/ref-data/${type}/all`;
    return this.http.get<any[]>(genericUrl).pipe(
      map(dtos => (Array.isArray(dtos) && dtos.length > 0) ? dtos.map(dto => ({
        id: String(dto.id),
        code: dto.code,
        libelle: dto.libelle,
        description: dto.description || '',
        actif: dto.actif ?? true
      })) : []),
      tap(items => {
        this.getSubject(type).next(items);
      }),
      catchError(err => {
        console.warn(`[DbRefService] Backend error for generic "${type}":`, err.message);
        this.getSubject(type).next([]);
        return of([]);
      })
    );
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
      const baseUrl = `${environment.apiUrl}/${mapping.segment}`;
      return this.http.post<any>(baseUrl, body).pipe(
        map(dto => mapping.toFront(dto)),
        map(newItem => addLocalState(newItem)),
        catchError(err => {
          return this.http.post<any>(`${baseUrl}/create`, body).pipe(
            map(dto => mapping.toFront(dto)),
            map(newItem => addLocalState(newItem)),
            catchError(err2 => {
              console.warn(`[DbRefService] Backend post error for ${type}:`, err2);
              const newItem: RefItem = { ...item, id: item.id || `loc_${Date.now()}` };
              return of(addLocalState(newItem));
            })
          );
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
