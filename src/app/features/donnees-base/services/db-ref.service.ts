import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
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
  fonction?:      string;   // pour Paramétrage indemnité
  grade?:         string;   // pour Paramétrage indemnité
  categorie?:     string;   // pour Paramétrage indemnité
  taux?:          number;   // pour Paramétrage indemnité
}

// ─── Mapping frontend type → backend segment ───────────────────────────────
const BACKEND_MAP: Record<string, {
  segment: string;
  getAllPath: string;
  toFront: (dto: any) => RefItem;
  toBack: (item: RefItem) => any;
  toBackUpdate: (item: RefItem) => any;
}> = {
  'emploi': {
    segment: 'emplois',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: true }),
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
  'fonction': {
    segment: 'fonctions',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: true }),
    toBack:  item => ({ code: item.code, name: item.libelle }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle }),
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
      taux: dto.taux || dto.montant || 0
    }),
    toBack: item => ({
      code: item.code,
      typeIndemnite: item.typeIndemnite || item.libelle,
      fonction: item.fonction,
      grade: item.grade,
      categorie: item.categorie,
      taux: item.taux || item.montant || 0,
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
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'type-retenue-emploi': {
    segment: 'ref-data/retenue-emploi',
    getAllPath: '/all',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
};

const SALARY_MATRIX: Record<string, { groupe: string; values: number[] }> = {
  '1ÈRE CATEGORIE':  { groupe: 'GROUPE I', values: [95945, 105540, 116093, 127703, 140473, 154520, 169972, 186970, 205667, 226233, 248857, 273742, 301117, 331228, 364351] },
  '2ÈME CATEGORIE':  { groupe: 'GROUPE I', values: [104474, 114921, 126414, 139055, 152960, 168256, 185082, 203590, 223949, 246344, 270979, 298077, 327884, 360673, 396740] },
  '3ÈME CATEGORIE':  { groupe: 'GROUPE I', values: [107135, 117849, 129633, 142597, 156856, 172542, 189796, 208776, 229653, 252619, 277881, 305669, 336236, 369859, 406845] },
  '4ÈME CATEGORIE':  { groupe: 'GROUPE I', values: [115558, 127114, 139825, 153808, 169188, 186107, 204718, 225190, 247709, 272480, 299728, 329700, 362671, 398938, 438831] },
  '5ÈME CATEGORIE':  { groupe: 'GROUPE I', values: [128831, 141714, 155886, 171474, 188621, 207484, 228232, 251055, 276161, 303777, 334154, 367570, 404327, 444760, 489236] },
  '6ÈME CATEGORIE':  { groupe: 'GROUPE I', values: [157940, 173734, 191107, 210218, 231240, 254364, 279800, 307780, 338558, 372414, 409656, 450621, 495683, 545252, 599777] },
  '7ÈME CATEGORIE':  { groupe: 'GROUPE I', values: [176441, 194085, 213494, 234843, 258327, 284160, 312576, 343834, 378217, 416039, 457643, 503407, 553747, 609122, 670034] },

  'CLASSE I':   { groupe: 'GROUPE II', values: [173090, 190399, 209439, 230383, 253421, 278763, 306639, 337303, 371034, 408137, 448951, 493846, 543231, 597554, 657309] },
  'CLASSE II':  { groupe: 'GROUPE II', values: [203834, 224217, 246639, 271303, 298433, 328277, 361104, 397215, 436936, 480630, 528693, 581562, 639718, 703690, 774059] },
  'CLASSE III': { groupe: 'GROUPE II', values: [278697, 306567, 337223, 370946, 408040, 448844, 493729, 543102, 597412, 657153, 722868, 795155, 874671, 962138, 1058351] },
  'CLASSE IV':  { groupe: 'GROUPE II', values: [405758, 446334, 490967, 540064, 594070, 653477, 718825, 790708, 869778, 956756, 1052432, 1157675, 1273442, 1400787, 1540865] },

  'CLASSE V':    { groupe: 'GROUPE III', values: [581390, 639529, 703482, 773830, 851213, 936334, 1029968, 1132965, 1246261, 1370887, 1507976, 1658774, 1824651, 2007116, 2207828] },
  'CLASSE VI':   { groupe: 'GROUPE III', values: [599438, 659382, 725320, 797852, 877637, 965401, 1061941, 1168135, 1284949, 1413443, 1554788, 1710267, 1881293, 2069423, 2276365] },
  'CLASSE VII':  { groupe: 'GROUPE III', values: [631454, 694599, 764059, 840465, 924512, 1016963, 1118659, 1230525, 1353578, 1488936, 1637829, 1801612, 1981773, 2179950, 2397946] },
  'CLASSE VIII': { groupe: 'GROUPE III', values: [710386, 781425, 859567, 945524, 1040076, 1144084, 1258492, 1384341, 1522775, 1675053, 1842558, 2026814, 2229496, 2452445, 2697690] }
};

function buildOfficialGridItems(): RefItem[] {
  const items: RefItem[] = [];
  let idCounter = 1;
  for (const [code, info] of Object.entries(SALARY_MATRIX)) {
    info.values.forEach((amount, index) => {
      const ech = String(index + 1);
      items.push({
        id: String(idCounter++),
        code: code,
        libelle: info.groupe,
        grade: info.groupe,
        categorie: code,
        echelle: info.groupe,
        echellon: ech,
        description: `${info.groupe} (${code}) - Échelon ${ech}`,
        montant: amount,
        actif: true
      });
    });
  }
  return items;
}

// ─── Données mock pour les types sans backend ────────────────────────────────
const MOCK_DATA: Record<string, RefItem[]> = {
  'agence': [
    { code: 'AGN-001', libelle: 'Agence Centrale',   description: 'Siège social — Ouagadougou', actif: true  },
    { code: 'AGN-002', libelle: 'Agence Nord',        description: 'Zone nord du pays',          actif: true  },
    { code: 'AGN-003', libelle: 'Agence Sud',         description: 'Zone sud du pays',           actif: true  },
    { code: 'AGN-004', libelle: 'Agence Est',         description: 'Zone est du pays',           actif: true  },
    { code: 'AGN-005', libelle: 'Agence Ouest',       description: 'Zone ouest du pays',         actif: false },
  ],
  'direction': [
    { code: 'DIR-001', libelle: 'Direction Générale',      description: 'Direction principale',             actif: true  },
    { code: 'DIR-002', libelle: 'Direction Administrative', description: 'Administration et ressources',     actif: true  },
    { code: 'DIR-003', libelle: 'Direction Financière',     description: 'Finances et comptabilité',         actif: true  },
    { code: 'DIR-004', libelle: 'Direction Technique',      description: 'Services techniques',              actif: true  },
    { code: 'DIR-005', libelle: 'Direction Commerciale',    description: 'Ventes et marketing',              actif: false },
  ],
  'service': [
    { code: 'SRV-001', libelle: 'Service Informatique',     description: 'Systèmes d\'information',          actif: true  },
    { code: 'SRV-002', libelle: 'Service RH',               description: 'Ressources humaines',              actif: true  },
    { code: 'SRV-003', libelle: 'Service Comptabilité',     description: 'Comptabilité et finances',         actif: true  },
    { code: 'SRV-004', libelle: 'Service Logistique',       description: 'Approvisionnement et logistique',  actif: true  },
    { code: 'SRV-005', libelle: 'Service Juridique',        description: 'Affaires juridiques',              actif: false }
  ],
  'param-indemnite': [
    // GROUPE I: Agents, Employés & Techniciens
    { id: '1',  code: 'PI-G1',  libelle: 'Indemnités Groupe I',           description: 'Logement 35 000 FCFA + Transport 30 000 FCFA', actif: true, typeIndemnite: 'Indemnités de Base (Groupe I)', fonction: 'Agents & Employés', grade: 'Groupe I', categorie: '1ère à 7ème Catégorie', montant: 65000, taux: 65000 },
    
    // GROUPE II: Agents de Maîtrise et Cadres Moyens
    { id: '2',  code: 'PI-G2-C1', libelle: 'Indemnités Classe I',         description: 'Logement 45k + Transport 45k + Sujétion 20k',   actif: true, typeIndemnite: 'Indemnités (Classe I)',        fonction: 'Agent de Maîtrise',   grade: 'Groupe II', categorie: 'Classe I',   montant: 110000, taux: 110000 },
    { id: '3',  code: 'PI-G2-C2', libelle: 'Indemnités Classe II',        description: 'Logement 45k + Transport 45k + Sujétion 30k',   actif: true, typeIndemnite: 'Indemnités (Classe II)',       fonction: 'Chef de section',     grade: 'Groupe II', categorie: 'Classe II',  montant: 120000, taux: 120000 },
    { id: '4',  code: 'PI-G2-C3', libelle: 'Indemnités Classe III',       description: 'Logement 50k + Transport 50k + Sujétion 40k',   actif: true, typeIndemnite: 'Indemnités (Classe III)',      fonction: 'Cadre moyen',         grade: 'Groupe II', categorie: 'Classe III', montant: 140000, taux: 140000 },
    { id: '5',  code: 'PI-G2-C4', libelle: 'Indemnités Classe IV',        description: 'Logement 60k + Transport 50k + Sujétion 50k',   actif: true, typeIndemnite: 'Indemnités (Classe IV)',       fonction: 'Cadre confirmé',      grade: 'Groupe II', categorie: 'Classe IV',  montant: 160000, taux: 160000 },

    // GROUPE III: Cadres & Cadres Supérieurs
    { id: '6',  code: 'PI-G3-C5', libelle: 'Indemnités Classe V',         description: 'Logement 90k + Transport 60k + Sujétion 60k',   actif: true, typeIndemnite: 'Indemnités (Classe V)',        fonction: 'Chef de service',     grade: 'Groupe III', categorie: 'Classe V',   montant: 210000, taux: 210000 },
    { id: '7',  code: 'PI-G3-C6', libelle: 'Indemnités Classe VI',        description: 'Logement 100k + Transport 75k + Sujétion 60k',  actif: true, typeIndemnite: 'Indemnités (Classe VI)',       fonction: 'Resp. Département',   grade: 'Groupe III', categorie: 'Classe VI',  montant: 235000, taux: 235000 },
    { id: '8',  code: 'PI-G3-C7', libelle: 'Indemnités Classe VII',       description: 'Logement 110k + Transport 80k + Sujétion 70k',  actif: true, typeIndemnite: 'Indemnités (Classe VII)',      fonction: 'Dir. Département',    grade: 'Groupe III', categorie: 'Classe VII', montant: 260000, taux: 260000 },
    { id: '9',  code: 'PI-G3-C8', libelle: 'Indemnités Classe VIII',      description: 'Logement 150k + Transport 100k + Sujétion 80k', actif: true, typeIndemnite: 'Indemnités (Classe VIII)',     fonction: 'Directeur Général',   grade: 'Groupe III', categorie: 'Classe VIII',montant: 330000, taux: 330000 },

    // INDEMNITÉS DE NOMINATION (FONCTION / POSTE)
    { id: '10', code: 'PI-NOM-DIR', libelle: 'Indemnité Dir. Département',description: 'Fonction 150k + Transport 100k + Logement 200k + Comp. 100k', actif: true, typeIndemnite: 'Indemnité de Nomination', fonction: 'Directeur Département', grade: 'Direction', categorie: 'Nomination', montant: 550000, taux: 550000 },
    { id: '11', code: 'PI-NOM-RESP',libelle: 'Indemnité Resp. Département',description: 'Fonction 100k + Transport 75k + Logement 150k + Comp. 75k',  actif: true, typeIndemnite: 'Indemnité de Nomination', fonction: 'Responsable Département', grade: 'Direction', categorie: 'Nomination', montant: 400000, taux: 400000 },
    { id: '12', code: 'PI-NOM-CS',  libelle: 'Indemnité Chef de Service', description: 'Fonction 80k + Transport 75k + Logement 120k + Comp. 75k',   actif: true, typeIndemnite: 'Indemnité de Nomination', fonction: 'Chef de Service',       grade: 'Service',   categorie: 'Nomination', montant: 350000, taux: 350000 },
    { id: '13', code: 'PI-NOM-CA',  libelle: 'Indemnité Chef d\'Agence',  description: 'Fonction 75k + Transport 75k + Logement 100k + Comp. 75k',   actif: true, typeIndemnite: 'Indemnité de Nomination', fonction: 'Chef d\'Agence',        grade: 'Agence',    categorie: 'Nomination', montant: 325000, taux: 325000 }
  ],
  'grille-salariale': buildOfficialGridItems(),
  'categorie': [
    { code: '1ÈRE CATEGORIE', libelle: '1ÈRE CATEGORIE', description: 'Grade I — Agent d\'exécution (Base 95 945 FCFA)', actif: true },
    { code: '2ÈME CATEGORIE', libelle: '2ÈME CATEGORIE', description: 'Grade I — Agent d\'exécution (Base 104 474 FCFA)', actif: true },
    { code: '3ÈME CATEGORIE', libelle: '3ÈME CATEGORIE', description: 'Grade I — Agent d\'exécution (Base 107 135 FCFA)', actif: true },
    { code: '4ÈME CATEGORIE', libelle: '4ÈME CATEGORIE', description: 'Grade I — Employé qualifié (Base 115 558 FCFA)', actif: true },
    { code: '5ÈME CATEGORIE', libelle: '5ÈME CATEGORIE', description: 'Grade I — Employé qualifié (Base 128 831 FCFA)', actif: true },
    { code: '6ÈME CATEGORIE', libelle: '6ÈME CATEGORIE', description: 'Grade I — Employé principal (Base 157 940 FCFA)', actif: true },
    { code: '7ÈME CATEGORIE', libelle: '7ÈME CATEGORIE', description: 'Grade I — Agent de maîtrise (Base 176 441 FCFA)', actif: true },
    { code: 'CLASSE I',        libelle: 'CLASSE I',        description: 'Grade II — Agent de maîtrise / Technicien (Base 173 090 FCFA)', actif: true },
    { code: 'CLASSE II',       libelle: 'CLASSE II',       description: 'Grade II — Agent de maîtrise supérieur (Base 203 834 FCFA)', actif: true },
    { code: 'CLASSE III',      libelle: 'CLASSE III',      description: 'Grade II — Cadre moyen (Base 278 697 FCFA)', actif: true },
    { code: 'CLASSE IV',       libelle: 'CLASSE IV',       description: 'Grade II — Cadre supérieur (Base 405 758 FCFA)', actif: true },
    { code: 'CLASSE V',        libelle: 'CLASSE V',        description: 'Grade III — Cadre de direction (Base 581 390 FCFA)', actif: true },
    { code: 'CLASSE VI',       libelle: 'CLASSE VI',       description: 'Grade III — Chef de Département (Base 599 438 FCFA)', actif: true },
    { code: 'CLASSE VII',      libelle: 'CLASSE VII',      description: 'Grade III — Directeur (Base 631 454 FCFA)', actif: true },
    { code: 'CLASSE VIII',     libelle: 'CLASSE VIII',     description: 'Grade III — Directeur Général / Exécutif (Base 710 386 FCFA)', actif: true }
  ],
  'grade': [
    { code: 'GRADE I',   libelle: 'GRADE I',   description: 'Agents et Employés (1ère à 7ème Catégorie)', actif: true },
    { code: 'GRADE II',  libelle: 'GRADE II',  description: 'Classes I à IV (Agents de Maîtrise et Cadres moyens)', actif: true },
    { code: 'GRADE III', libelle: 'GRADE III', description: 'Classes V à VIII (Cadres et Cadres Supérieurs)', actif: true }
  ],
  'echelon': [
    { code: 'ECH-01', libelle: 'Échelon 1',  description: 'Échelon de base (Base 100%)', actif: true },
    { code: 'ECH-02', libelle: 'Échelon 2',  description: 'Progression échelon 2 (+10%)', actif: true },
    { code: 'ECH-03', libelle: 'Échelon 3',  description: 'Progression échelon 3 (+21%)', actif: true },
    { code: 'ECH-04', libelle: 'Échelon 4',  description: 'Progression échelon 4 (+33%)', actif: true },
    { code: 'ECH-05', libelle: 'Échelon 5',  description: 'Progression échelon 5 (+46%)', actif: true },
    { code: 'ECH-06', libelle: 'Échelon 6',  description: 'Progression échelon 6 (+61%)', actif: true },
    { code: 'ECH-07', libelle: 'Échelon 7',  description: 'Progression échelon 7 (+77%)', actif: true },
    { code: 'ECH-08', libelle: 'Échelon 8',  description: 'Progression échelon 8 (+95%)', actif: true },
    { code: 'ECH-09', libelle: 'Échelon 9',  description: 'Progression échelon 9 (+114%)', actif: true },
    { code: 'ECH-10', libelle: 'Échelon 10', description: 'Progression échelon 10 (+135%)', actif: true },
    { code: 'ECH-11', libelle: 'Échelon 11', description: 'Progression échelon 11 (+158%)', actif: true },
    { code: 'ECH-12', libelle: 'Échelon 12', description: 'Progression échelon 12 (+183%)', actif: true },
    { code: 'ECH-13', libelle: 'Échelon 13', description: 'Progression échelon 13 (+211%)', actif: true },
    { code: 'ECH-14', libelle: 'Échelon 14', description: 'Progression échelon 14 (+241%)', actif: true },
    { code: 'ECH-15', libelle: 'Échelon 15', description: 'Progression échelon 15 (+274%)', actif: true }
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
  'cotisation': [
    { code: 'COT-001', libelle: 'CNSS Employé',  description: 'Part salariale CNSS',    actif: true },
    { code: 'COT-002', libelle: 'CNSS Patronal', description: 'Part patronale CNSS',    actif: true },
    { code: 'COT-003', libelle: 'CARFO',         description: 'Caisse autonome retraite',actif: true },
    { code: 'COT-004', libelle: 'AT/MP',         description: 'Accident travail/Maladie',actif: true },
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
  ],
  'calendrier-paie': [
    { code: 'CAL-001', libelle: 'Calendrier mensuel',   description: 'Paie le 25 de chaque mois', actif: true  },
    { code: 'CAL-002', libelle: 'Calendrier bimensuel', description: 'Paie le 15 et le 30',        actif: false },
  ],
};

@Injectable({
  providedIn: 'root'
})
export class DbRefService {
  private cache: Record<string, BehaviorSubject<RefItem[]>> = {};

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

  // ─── Vérifie si ce type a un backend réel ─────────────────────────────────
  private hasBackend(type: string): boolean {
    return !!BACKEND_MAP[type];
  }

  // ─── Charge depuis mock localStorage ──────────────────────────────────────
  private getMockItems(type: string): RefItem[] {
    if (type === 'grille-salariale' || type === 'param-indemnite') {
      const stored = localStorage.getItem(`ref_${type}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.length !== 225 || (type === 'grille-salariale' && (parsed[0]?.code?.includes('Grade') || parsed[0]?.code?.includes('GS-')))) {
            localStorage.removeItem(`ref_${type}`);
          }
        } catch (e) {
          localStorage.removeItem(`ref_${type}`);
        }
      }
    }
    if (type === 'categorie' || type === 'grade' || type === 'echelon') {
      const stored = localStorage.getItem(`ref_${type}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (type === 'categorie' && parsed.some((x: any) => x.code?.startsWith('CAT-') || x.libelle === 'Cadre Supérieur')) {
            localStorage.removeItem(`ref_${type}`);
          }
          if (type === 'grade' && parsed.some((x: any) => x.code?.startsWith('GRD-') || x.libelle === 'Hors Classe')) {
            localStorage.removeItem(`ref_${type}`);
          }
          if (type === 'echelon' && parsed.length < 15) {
            localStorage.removeItem(`ref_${type}`);
          }
        } catch (e) {
          localStorage.removeItem(`ref_${type}`);
        }
      }
    }
    const stored = localStorage.getItem(`ref_${type}`);
    if (stored) return JSON.parse(stored);
    const initial = MOCK_DATA[type] ?? [];
    localStorage.setItem(`ref_${type}`, JSON.stringify(initial));
    return initial;
  }

  private saveMockItems(type: string, items: RefItem[]): void {
    localStorage.setItem(`ref_${type}`, JSON.stringify(items));
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
        map(dtos => dtos.map(dto => mapping.toFront(dto))),
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

  private isSameItem(a: RefItem, b: RefItem, type: string): boolean {
    if (a.id && b.id && a.id === b.id) return true;
    if (type === 'grille-salariale') {
      return (a.code?.toUpperCase() === b.code?.toUpperCase()) &&
             (String(a.echellon) === String(b.echellon));
    }
    return a.code === b.code;
  }

  // ─── ADD ───────────────────────────────────────────────────────────────────
  addItem(type: string, item: RefItem): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];
    const currentList = this.getCurrentItems(type);

    if (mapping) {
      const body = mapping.toBack(item);
      return this.http.post<any>(`${environment.apiUrl}/${mapping.segment}/create`, body).pipe(
        map(dto => mapping.toFront(dto)),
        map(newItem => {
          const subject = this.getSubject(type);
          const newList = [...currentList.filter(i => !this.isSameItem(i, newItem, type)), newItem];
          subject.next(newList);
          this.saveMockItems(type, newList);
          return newList;
        }),
        catchError(err => {
          console.warn(`[DbRefService] Backend post error for ${type}, updating local state:`, err);
          const subject = this.getSubject(type);
          const newItem: RefItem = { ...item, id: Date.now().toString() };
          const newList = [...currentList.filter(i => !this.isSameItem(i, newItem, type)), newItem];
          subject.next(newList);
          this.saveMockItems(type, newList);
          return of(newList);
        })
      );
    }

    // Mock
    const subject = this.getSubject(type);
    const newItem: RefItem = { ...item, id: Date.now().toString() };
    const newList = [...currentList.filter(i => !this.isSameItem(i, newItem, type)), newItem];
    subject.next(newList);
    this.saveMockItems(type, newList);
    return of(newList);
  }

  // ─── UPDATE ────────────────────────────────────────────────────────────────
  updateItem(type: string, originalCode: string, updatedItem: RefItem): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];
    const id = updatedItem.id;
    const currentList = this.getCurrentItems(type);

    if (mapping && id && !id.startsWith('mock_')) {
      const body = mapping.toBackUpdate(updatedItem);
      return this.http.put<any>(`${environment.apiUrl}/${mapping.segment}/${id}`, body).pipe(
        map(dto => mapping.toFront(dto)),
        map(updated => {
          const subject = this.getSubject(type);
          const newList = currentList.map(i => this.isSameItem(i, updatedItem, type) ? { ...i, ...updated } : i);
          subject.next(newList);
          this.saveMockItems(type, newList);
          return newList;
        }),
        catchError(err => {
          console.warn(`[DbRefService] Backend put error for ${type}, updating local state:`, err);
          const subject = this.getSubject(type);
          const newList = currentList.map(i => this.isSameItem(i, updatedItem, type) ? { ...i, ...updatedItem } : i);
          subject.next(newList);
          this.saveMockItems(type, newList);
          return of(newList);
        })
      );
    }

    // Mock
    const subject = this.getSubject(type);
    const newList = currentList.map(i =>
      this.isSameItem(i, updatedItem, type) ? { ...i, ...updatedItem } : i
    );
    subject.next(newList);
    this.saveMockItems(type, newList);
    return of(newList);
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────
  deleteItem(type: string, code: string): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];
    const subject = this.getSubject(type);
    const currentList = this.getCurrentItems(type);
    const item = currentList.find(i => i.code === code);

    if (mapping && item?.id) {
      return this.http.delete(`${environment.apiUrl}/${mapping.segment}/${item.id}`, { responseType: 'text' }).pipe(
        map(() => {
          const newList = currentList.filter(i => i.code !== code && i.id !== item.id);
          subject.next(newList);
          this.saveMockItems(type, newList);
          return newList;
        }),
        catchError(err => {
          console.warn(`[DbRefService] Backend delete error for ${type}, updating local state:`, err);
          const newList = currentList.filter(i => i.code !== code && i.id !== item.id);
          subject.next(newList);
          this.saveMockItems(type, newList);
          return of(newList);
        })
      );
    }

    // Mock
    const newList = currentList.filter(i => i.code !== code);
    subject.next(newList);
    this.saveMockItems(type, newList);
    return of(newList);
  }

  // ─── TOGGLE STATUS ─────────────────────────────────────────────────────────
  toggleItemStatus(type: string, code: string): Observable<RefItem[]> {
    const currentList = this.getCurrentItems(type);
    const item = currentList.find(i => i.code === code);
    if (!item) return of(currentList);

    const updatedItem: RefItem = { ...item, actif: !item.actif };
    return this.updateItem(type, code, updatedItem);
  }
}
