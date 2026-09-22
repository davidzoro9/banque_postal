import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export type BaseCalculRetenue = 'SALAIRE_BASE' | 'SALAIRE_BASE_SUR_SALAIRE' | 'REMUNERATION_BRUTE' | 'BASE_IMPOSABLE';

export interface RefItem {
  id?: string;
  code: string;
  libelle: string;
  name?: string;
  description: string;
  ordre?: number;
  actif: boolean;
  montant?: number;
  agenceId?: string;
  agenceLibelle?: string;
  departementId?: string;   // utilisé par Direction et Service
  departementLibelle?: string;
  departmentLibelle?: string;
  directionId?:   string;   // utilisé par Service et Departement
  directionLibelle?: string;
  parentDirectionId?: string; // pour Direction rattachée à DGA ou DG
  parentDirectionLibelle?: string;
  directeurId?: string;
  directeurLibelle?: string;
  categorieId?:   string;   // utilisé par Grille salariale
  categorieLibelle?: string;
  echelonId?:     string;   // utilisé par Grille salariale
  gradeId?:       string;   // utilisé par Grille salariale
  gradeLibelle?: string;
  echelle?:       string;   // utilisé par Grille salariale
  echellon?:      string;   // utilisé par Grille salariale
  typeIndemnite?: string;   // pour Paramétrage indemnité
  typeIndemniteId?: string;
  typeIndemniteLibelle?: string;
  typeRetenue?:   string;   // pour Paramétrage retenue (Part Agent, Part Employeur, Cotisation Sociale, etc.)
  typeRetenueId?: string;
  typeRetenueLibelle?: string;
  regimeSecuriteSocialId?: string;
  regimeSecuriteSocialCode?: string;
  regimeSecuriteSocialLibelle?: string;
  fonction?:      string;   // pour Paramétrage indemnité
  fonctionId?: string;
  fonctionLibelle?: string;
  emploi?:        string;   // pour Paramétrage indemnité (Primes Spécifiques)
  emploiId?: string;
  emploiLibelle?: string;
  grade?:         string;   // pour Paramétrage indemnité
  categorie?:     string;   // pour Paramétrage indemnité
  taux?:          number;   // pour Paramétrage indemnité / Retenue
  baseCalcul?: BaseCalculRetenue;
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
  'banque': {
    segment: 'banques',
    getAllPath: '/all',

    toFront: dto => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || '',
      actif: dto.actif ?? true
    }),

    toBack: item => ({
      code: item.code,
      libelle: item.libelle,
      description: item.description,
      actif: item.actif
    }),

    toBackUpdate: item => ({
      id: item.id ? Number(item.id) : null,
      code: item.code,
      libelle: item.libelle,
      description: item.description,
      actif: item.actif
    })
  },
  'regime-securite-social': {
    segment: 'regime-securite-social',
    getAllPath: '',

    toFront: dto => ({
      id: String(dto.id),
      code: dto.code,
      libelle: dto.libelle,
      description: dto.description || '',
      actif: dto.actif ?? true
    }),

    toBack: item => ({
      code: item.code,
      libelle: item.libelle,
      description: item.description,
      actif: item.actif
    }),

    toBackUpdate: item => ({
      id: item.id ? Number(item.id) : null,
      code: item.code,
      libelle: item.libelle,
      description: item.description,
      actif: item.actif
    })
  },
  'grille-salariale': {
    segment: 'grillesalariale',
    getAllPath: '',
    toFront: dto => {
      const catCode = dto.categorieCode || dto.categorieLibelle || '';
      const echCode = dto.echelonCode || dto.echelonLibelle || '';
      const gradeCode = dto.gradeCode || (catCode && echCode ? `${catCode}${echCode}` : dto.gradeLibelle || '');
      return {
        id: String(dto.id),
        code: gradeCode,
        libelle: dto.gradeLibelle || gradeCode,
        categorie: catCode,
        echellon: echCode,
        grade: gradeCode,
        categorieId: dto.categorieId ? String(dto.categorieId) : undefined,
        categorieCode: dto.categorieCode || '',
        categorieLibelle: dto.categorieLibelle || '',
        echelonId: dto.echelonId ? String(dto.echelonId) : undefined,
        echelonCode: dto.echelonCode || '',
        echelonLibelle: dto.echelonLibelle || '',
        gradeId: dto.gradeId ? String(dto.gradeId) : undefined,
        gradeCode: dto.gradeCode || '',
        gradeLibelle: dto.gradeLibelle || '',
        montant: dto.basicSalary != null ? Number(dto.basicSalary) : (dto.salaireBase != null ? Number(dto.salaireBase) : 0),
        description: `Base: ${dto.basicSalary || dto.salaireBase || 0}`,
        actif: true
      };
    },
    toBack: item => ({
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      echelonId: item.echelonId ? Number(item.echelonId) : null,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      basicSalary: item.montant || 0
    }),
    toBackUpdate: item => ({
      id: item.id ? Number(item.id) : null,
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      echelonId: item.echelonId ? Number(item.echelonId) : null,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      basicSalary: item.montant || 0
    })
  },
  'emploi': {
    segment: 'emplois',
    getAllPath: '/all',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.code || `EMP-${dto.id}`,
      libelle: dto.name || dto.libelle || dto.code || 'Emploi',
      description: dto.description || '',
      ordre: dto.ordre != null ? Number(dto.ordre) : undefined,
      actif: true
    }),
    toBack:  item => ({ code: item.code, name: item.libelle, description: item.description, ordre: item.ordre }),
    toBackUpdate: item => ({ id: item.id ? Number(item.id) : null, code: item.code, name: item.libelle, description: item.description, ordre: item.ordre }),
  },
  'direction': {
    segment: 'directions',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: dto.description || '', actif: true,
                       parentDirectionId: dto.parentDirectionId ? String(dto.parentDirectionId) : undefined,
                       parentDirectionLibelle: dto.parentDirectionLibelle || '',
                       departementId: dto.departmentId ? String(dto.departmentId) : undefined,
                       departementLibelle: dto.departmentLibelle || '',
                       departmentLibelle: dto.departmentLibelle || '' ,
                       agenceId: dto.agenceId ? String(dto.agenceId) : undefined,
                       agenceLibelle: dto.agenceLibelle || ''
                     }),
    toBack:  item => ({ code: item.code, name: item.libelle, description: item.description,
                        parentDirectionId: item.parentDirectionId ? Number(item.parentDirectionId) : null,
                        departmentId: item.departementId ? Number(item.departementId) : null, agenceId: item.agenceId ? Number(item.agenceId) : null }),
    toBackUpdate: item => ({ id: Number(item.id), code: item.code, name: item.libelle, description: item.description,
                             parentDirectionId: item.parentDirectionId ? Number(item.parentDirectionId) : null,
                             departmentId: item.departementId ? Number(item.departementId) : null, agenceId: item.agenceId ? Number(item.agenceId) : null }),
  },
  'service': {
    segment: 'services',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: dto.description || '', actif: true,
                       directionId:   dto.directionId   ? String(dto.directionId)   : undefined,
                       directionLibelle: dto.directionLibelle || '',
                       departementId: dto.departmentId  ? String(dto.departmentId)  : undefined,
                       departementLibelle: dto.departmentLibelle || '',
                       departmentLibelle: dto.departmentLibelle || '' }),
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
      ordre: dto.ordre != null ? Number(dto.ordre) : undefined,
      indemnites: dto.indemnites || []
    }),
    toBack:  item => ({
      code: item.code,
      name: item.libelle,
      description: item.description || '',
      typeNomination: item.typeNomination || 'NON_NOMMEE',
      ordre: item.ordre,
      actif: item.actif ?? true,
      indemnites: item.indemnites || []
    }),
    toBackUpdate: item => ({
      id: item.id ? Number(item.id) : null,
      code: item.code,
      name: item.libelle,
      description: item.description || '',
      typeNomination: item.typeNomination || 'NON_NOMMEE',
      ordre: item.ordre,
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
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: '', actif: dto.actif ?? true,
                       tauxExoneration: dto.tauxExoneration ?? 0, plafondExoneration: dto.plafondExoneration ?? 0 }),
    toBack:  item => ({ code: item.code, name: item.libelle, tauxExoneration: item.tauxExoneration ?? 0,
                        plafondExoneration: item.plafondExoneration ?? 0, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, name: item.libelle,
                             tauxExoneration: item.tauxExoneration ?? 0,
                             plafondExoneration: item.plafondExoneration ?? 0, actif: item.actif }),
  },
  'param-indemnite': {
    segment: 'paramindemnite',
    getAllPath: '',
    toFront: dto => ({
      id: String(dto.id),
      code: dto.code || `PI-${dto.id}`,
      libelle: dto.typeIndemniteLibelle || dto.typeIndemnite || dto.name || 'Indemnité',
      description: `Fonction: ${dto.fonctionLibelle || '-'}, Grade: ${dto.gradeLibelle || '-'}, Cat: ${dto.categorieLibelle || '-'}`,
      actif: dto.actif ?? true,
      montant: dto.taux || dto.montant || 0,
      typeIndemniteId: dto.typeIndemniteId ? String(dto.typeIndemniteId) : undefined,
      typeIndemniteLibelle: dto.typeIndemniteLibelle || dto.typeIndemnite || dto.name || '',
      typeIndemnite: dto.typeIndemniteLibelle || dto.typeIndemnite || dto.name || '',
      fonctionId: dto.fonctionId ? String(dto.fonctionId) : undefined,
      fonctionLibelle: dto.fonctionLibelle || dto.fonction || '',
      fonction: dto.fonctionLibelle || dto.fonction || '',
      gradeId: dto.gradeId ? String(dto.gradeId) : undefined,
      gradeLibelle: dto.gradeLibelle || dto.grade || '',
      grade: dto.gradeLibelle || dto.grade || '',
      categorieId: dto.categorieId ? String(dto.categorieId) : undefined,
      categorieLibelle: dto.categorieLibelle || dto.categorie || '',
      categorie: dto.categorieLibelle || dto.categorie || '',
      emploiId: dto.emploiId ? String(dto.emploiId) : undefined,
      emploiLibelle: dto.emploiLibelle || dto.emploi || '',
      emploi: dto.emploiLibelle || dto.emploi || '',
      taux: dto.taux ?? dto.montant ?? 0,
      tauxExoneration: dto.tauxExoneration ?? 0,
      plafondExoneration: dto.plafondExoneration ?? 0,
      regleType: dto.regleType || 'ORDINAIRE',
      typeNomination: dto.typeNomination || 'TOUTES'
    }),
    toBack: item => ({
      code: item.code,
      typeIndemniteId: item.typeIndemniteId ? Number(item.typeIndemniteId) : null,
      fonctionId: item.fonctionId ? Number(item.fonctionId) : null,
      emploiId: item.emploiId ? Number(item.emploiId) : null,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      taux: item.taux ?? item.montant ?? 0,
      tauxExoneration: item.tauxExoneration ?? 0,
      plafondExoneration: item.plafondExoneration ?? 0,
      regleType: item.regleType || 'ORDINAIRE',
      typeNomination: item.typeNomination || 'TOUTES',
      actif: item.actif
    }),
    toBackUpdate: item => ({
      id: item.id,
      code: item.code,
      typeIndemniteId: item.typeIndemniteId ? Number(item.typeIndemniteId) : null,
      fonctionId: item.fonctionId ? Number(item.fonctionId) : null,
      emploiId: item.emploiId ? Number(item.emploiId) : null,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      taux: item.taux ?? item.montant ?? 0,
      tauxExoneration: item.tauxExoneration ?? 0,
      plafondExoneration: item.plafondExoneration ?? 0,
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
      gradeId: dto.gradeId ? String(dto.gradeId) : undefined,
      gradeLibelle: dto.gradeLibelle || '',
      grade: dto.gradeLibelle || '',
      libelle: dto.gradeLibelle || dto.libelle || '',
      categorieId: dto.categorieId ? String(dto.categorieId) : undefined,
      categorieLibelle: dto.categorieLibelle || '',
      categorie: dto.categorieLibelle || '',
      description: dto.description || '',
      actif: dto.actif ?? true
    }),
    toBack: item => ({
      code: item.code,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      libelle: item.libelle || item.gradeLibelle || item.grade || '',
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: item => ({
      id: item.id,
      code: item.code,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      categorieId: item.categorieId ? Number(item.categorieId) : null,
      libelle: item.libelle || item.gradeLibelle || item.grade || '',
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
      gradeId: dto.gradeId ? String(dto.gradeId) : undefined,
      gradeLibelle: dto.gradeLibelle || '',
      grade: dto.gradeLibelle || '',
      libelle: dto.gradeLibelle || dto.libelle || '',
      taux: dto.taux || 0,
      description: dto.description || '',
      actif: dto.actif ?? true
    }),
    toBack: item => ({
      code: item.code,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      libelle: item.libelle || item.gradeLibelle || item.grade || '',
      taux: item.taux,
      description: item.description,
      actif: item.actif
    }),
    toBackUpdate: item => ({
      id: item.id,
      code: item.code,
      gradeId: item.gradeId ? Number(item.gradeId) : null,
      libelle: item.libelle || item.gradeLibelle || item.grade || '',
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
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.name, description: dto.description || '', actif: true,
                       directionId: dto.directionId ? String(dto.directionId) : undefined,
                       directionLibelle: dto.directionLibelle || '',
                       directeurId: dto.directeurId ? String(dto.directeurId) : undefined,
                       directeurLibelle: dto.directeurLibelle || '' }),
    toBack:  item => ({ code: item.code, name: item.libelle, description: item.description,
                        directionId: item.directionId ? Number(item.directionId) : null,
                        directeurId: item.directeurId ? Number(item.directeurId) : null }),
    toBackUpdate: item => ({ id: Number(item.id), code: item.code, name: item.libelle, description: item.description,
                             directionId: item.directionId ? Number(item.directionId) : null,
                             directeurId: item.directeurId ? Number(item.directeurId) : null }),
  },
  'type-retenue-employe': {
    segment: 'type-retenue',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle, description: dto.description || '', actif: dto.actif ?? true }),
    toBack:  item => ({ code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle, description: item.description, actif: item.actif }),
  },
  'type-retenue-emploi': {
    segment: 'type-retenue-emploi',
    getAllPath: '',
    toFront: dto => ({ id: String(dto.id), code: dto.code, libelle: dto.libelle,
                       typeRetenueId: dto.typeRetenueId ? String(dto.typeRetenueId) : undefined,
                       typeRetenueLibelle: dto.typeRetenueLibelle || dto.typeRetenue || '',
                       typeRetenue: dto.typeRetenueLibelle || dto.typeRetenue || '',
                       regimeSecuriteSocialId: dto.regimeSecuriteSocialId ? String(dto.regimeSecuriteSocialId) : undefined,
                       regimeSecuriteSocialCode: dto.regimeSecuriteSocialCode || '',
                       regimeSecuriteSocialLibelle: dto.regimeSecuriteSocialLibelle || '', taux: dto.taux ?? 0,
                       baseCalcul: dto.baseCalcul || 'REMUNERATION_BRUTE',
                       description: dto.description || '', actif: dto.actif ?? true }),
    toBack:  item => ({ code: item.code, libelle: item.libelle,
                         typeRetenueId: item.typeRetenueId ? Number(item.typeRetenueId) : null,
                         regimeSecuriteSocialId: item.regimeSecuriteSocialId ? Number(item.regimeSecuriteSocialId) : null,
                          taux: item.taux, baseCalcul: item.baseCalcul || 'REMUNERATION_BRUTE',
                          description: item.description, actif: item.actif }),
    toBackUpdate: item => ({ id: item.id, code: item.code, libelle: item.libelle,
                              typeRetenueId: item.typeRetenueId ? Number(item.typeRetenueId) : null,
                              regimeSecuriteSocialId: item.regimeSecuriteSocialId ? Number(item.regimeSecuriteSocialId) : null,
                               taux: item.taux, baseCalcul: item.baseCalcul || 'REMUNERATION_BRUTE',
                               description: item.description, actif: item.actif }),
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



@Injectable({
  providedIn: 'root'
})
export class DbRefService {
  private cache: Record<string, BehaviorSubject<RefItem[]>> = {};
  public refChanges$ = new Subject<{ type: string; action: string; item?: RefItem }>();

  constructor(private http: HttpClient) {}

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

  private notifyItemsUpdated(type: string, items: RefItem[]): void {
    this.getSubject(type).next(items);
    this.refChanges$.next({ type, action: 'update', item: items && items.length > 0 ? items[0] : undefined });
  }

  private getCurrentItems(type: string): RefItem[] {
    const subject = this.getSubject(type);
    return subject.value || [];
  }

  private mutationError(err: any, fallback: string): Error {
    const backendMessage = typeof err?.error === 'string'
      ? err.error
      : err?.error?.message || err?.message;
    return new Error(backendMessage || fallback);
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
      this.notifyItemsUpdated(type, newList);
      return newList;
    };

    if (mapping) {
      const body = mapping.toBack(item);
      const baseUrl = `${environment.apiUrl}/${mapping.segment}`;
      return this.http.post<any>(baseUrl, body).pipe(
        map(dto => mapping.toFront(dto)),
        map(newItem => addLocalState(newItem)),
        catchError(err => {
          if (err.status !== 404 && err.status !== 405) {
            console.error(`[DbRefService] Backend post error for ${type}:`, err);
            return throwError(() => this.mutationError(err, `Impossible d'enregistrer ${type} dans la base de données.`));
          }
          return this.http.post<any>(`${baseUrl}/create`, body).pipe(
            map(dto => mapping.toFront(dto)),
            map(newItem => addLocalState(newItem)),
            catchError(err2 => {
              console.error(`[DbRefService] Backend post error for ${type}:`, err2);
              return throwError(() => this.mutationError(err2, `Impossible d'enregistrer ${type} dans la base de données.`));
            })
          );
        })
      );
    }

    // Generic type saved to PostgreSQL via /api/ref-data/{type}
    const genericBody = {
      code: item.code,
      libelle: item.libelle,
      description: item.description || '',
      grade: item.grade || null,
      categorie: item.categorie || null,
      taux: item.taux != null ? Number(item.taux) : null,
      typeRetenue: item.typeRetenue || null,
      actif: item.actif ?? true
    };
    return this.http.post<any>(`${environment.apiUrl}/ref-data/${type}`, genericBody).pipe(
      map(dto => ({
        id: String(dto.id),
        code: dto.code,
        libelle: dto.libelle,
        description: dto.description || '',
        grade: dto.grade,
        categorie: dto.categorie,
        taux: dto.taux,
        typeRetenue: dto.typeRetenue,
        actif: dto.actif ?? true
      })),
      map(newItem => addLocalState(newItem)),
      catchError(err => {
        console.error(`[DbRefService] Backend generic save error for ${type}:`, err);
        return throwError(() => this.mutationError(err, `Impossible d'enregistrer ${type} dans la base de données.`));
      })
    );
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
      this.notifyItemsUpdated(type, finalItems);
      return finalItems;
    };

    if (mapping && id) {
      const body = mapping.toBackUpdate(updatedItem);
      return this.http.put<any>(`${environment.apiUrl}/${mapping.segment}/${id}`, body).pipe(
        map(dto => mapping.toFront(dto)),
        map(updated => updateLocalState(updated)),
        catchError(err => {
          console.error(`[DbRefService] Backend update error for ${type}:`, err);
          return throwError(() => this.mutationError(err, `Impossible de modifier ${type} dans la base de données.`));
        })
      );
    }

    if (id) {
      const genericBody = {
        code: updatedItem.code,
        libelle: updatedItem.libelle,
        description: updatedItem.description || '',
        grade: updatedItem.grade || null,
        categorie: updatedItem.categorie || null,
        taux: updatedItem.taux != null ? Number(updatedItem.taux) : null,
        typeRetenue: updatedItem.typeRetenue || null,
        actif: updatedItem.actif ?? true
      };
      return this.http.put<any>(`${environment.apiUrl}/ref-data/${type}/${id}`, genericBody).pipe(
        map(dto => ({
          id: String(dto.id),
          code: dto.code,
          libelle: dto.libelle,
          description: dto.description || '',
          grade: dto.grade,
          categorie: dto.categorie,
          taux: dto.taux,
          typeRetenue: dto.typeRetenue,
          actif: dto.actif ?? true
        })),
        map(updated => updateLocalState(updated)),
        catchError(err => {
          console.error(`[DbRefService] Backend generic update error for ${type}:`, err);
          return throwError(() => this.mutationError(err, `Impossible de modifier ${type} dans la base de données.`));
        })
      );
    }

    return throwError(() => new Error(`Impossible de modifier ${type} : identifiant manquant.`));
  }

  // ─── DELETE ────────────────────────────────────────────────────────────────
  deleteItem(type: string, item: Pick<RefItem, 'id' | 'code'>): Observable<RefItem[]> {
    const mapping = BACKEND_MAP[type];
    const subject = this.getSubject(type);
    const currentList = this.getCurrentItems(type);

    const deleteLocalState = (): RefItem[] => {
      const newList = currentList.filter(i => !this.isSameItem(i, item as RefItem, type, item.code));
      this.notifyItemsUpdated(type, newList);
      return newList;
    };

    if (mapping && item.id) {
      return this.http.delete(
        `${environment.apiUrl}/${mapping.segment}/${item.id}`,
        { responseType: 'text' }
      ).pipe(
        map(() => deleteLocalState()),
        catchError(err => {
          console.error(`[DbRefService] Backend delete error for ${type}:`, err);
          return throwError(() => this.mutationError(err, `Impossible de supprimer ${type} de la base de données.`));
        })
      );
    }

    if (item.id) {
      return this.http.delete(
        `${environment.apiUrl}/ref-data/${type}/${item.id}`,
        { responseType: 'text' }
      ).pipe(
        map(() => deleteLocalState()),
        catchError(err => {
          console.error(`[DbRefService] Backend generic delete error for ${type}:`, err);
          return throwError(() => this.mutationError(err, `Impossible de supprimer ${type} de la base de données.`));
        })
      );
    }

    return throwError(() => new Error(`Impossible de supprimer ${type} : identifiant manquant.`));
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
