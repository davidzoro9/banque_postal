export interface GuideField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface GuideSubsection {
  title: string;
  accessPath?: string;
  description?: string;
  points?: string[];
  fields?: GuideField[];
  steps?: string[];
  systemBehavior?: string;
  controls?: string[];
}

export interface GuideChapter {
  id: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  accessPath: string;
  subsections: GuideSubsection[];
  workflow: string[];
  tips?: string;
}

export const GUIDE_CHAPTERS: GuideChapter[] = [
  // =========================================================================
  // CHAPITRE 1 : INTRODUCTION & PRÉSENTATION DU SYSTÈME SIGRH
  // =========================================================================
  {
    id: 'ch1-introduction',
    number: '01',
    title: 'Chapitre 1 : Introduction & Présentation Générale du SIGRH',
    category: 'Vue d\'ensemble',
    summary: 'Présentation de la solution intégrée de gestion des ressources humaines et de la paie de la Banque Postale du Burkina Faso (BPBF).',
    accessPath: 'Accueil Général > Tableau de Bord Principal',
    subsections: [
      {
        title: '1.1 Contexte, Objectifs & Architecture',
        accessPath: 'Barre de navigation principale',
        description: 'Le SIGRH BPBF est une plateforme Full-Web hautement sécurisée qui unifie l\'ensemble des processus RH et paie.',
        points: [
          'Solution Full-Web moderne accessible via intranet bancaire sécurisé sur tout navigateur moderne sans installation locale.',
          'Architecture en 3 tiers étanche : Frontend Angular 17+ réactif, API REST Spring Boot 3.2 avec contrôles stricts de sécurité, et Base de données relationnelle PostgreSQL 15.',
          'Conformité réglementaire totale : Intègre le Code du Travail burkinabè, la Convention Collective des Banques et Établissements Financiers, et les nouvelles directives fiscales (barème progressif IUTS 2024, cotisations CNSS 5.5% et 16%, FSP 1%).'
        ]
      },
      {
        title: '1.2 Principes directeurs d\'utilisation',
        points: [
          'Gestion axée sur les Fiches de Poste : Chaque employé est rattaché à un emploi-repère et à un poste budgété dans l\'organigramme.',
          'Traçabilité et Audit Intégral : Toute modification de salaire, création d\'employé, validation de congé ou clôture de paie est tracée avec horodatage et identifiant de l\'auteur.',
          'Interdiction absolue des données hardcodées : Toutes les données de paie, classifications et référentiels proviennent directement et exclusivement de PostgreSQL via Spring Boot.'
        ]
      }
    ],
    workflow: [
      '1. Authentification sécurisée par identifiant et mot de passe chiffré',
      '2. Contrôle automatique du profil et chargement des habilitations autorisées',
      '3. Accès au tableau de bord centralisé et sélection du module de travail',
      '4. Exécution des opérations avec validation métier côté serveur',
      '5. Déconnexion explicite ou verrouillage automatique après inactivité'
    ],
    tips: 'Le guide utilisateur constitue le document de référence officiel. Il est structuré à l\'image exacte de l\'application pour une prise en main immédiate par tous les agents.'
  },

  // =========================================================================
  // CHAPITRE 2 : NOUVEAUTÉS & ARCHITECTURE MODULAIRE
  // =========================================================================
  {
    id: 'ch2-nouveautes',
    number: '02',
    title: 'Chapitre 2 : Nouveautés & Architecture Modulaire',
    category: 'Architecture',
    summary: 'Évolutions majeures apportées à la plateforme SIGRH, conteneurisation applicative et nouveaux modules.',
    accessPath: 'Système & Plateforme',
    subsections: [
      {
        title: '2.1 Plateforme Applicative & Sécurité',
        points: [
          'Authentification centralisée avec jetons JWT (JSON Web Tokens) hautement sécurisés et gestion de session active.',
          'Contrôle d\'accès basé sur les rôles (RBAC) avec matrice d\'habilitations granulaire par écran et par action (Lecture, Création, Modification, Suppression, Validation, Clôture).',
          'Journalisation continue des opérations sensibles côté serveur (audit trail pour les modifications salariales et clôtures de paie).'
        ]
      },
      {
        title: '2.2 Nouveaux Modules & Fonctionnalités Clés',
        points: [
          'Gestion des Carrières & Évaluations : Saisie numérique des notes de performance, calcul automatisé des propositions d\'avancement d\'échelon (1 à 15).',
          'Gestion Sociale & Prises en Charge Médicales : Émission des bons de soins, facturation des prestataires médicaux et quote-part mutuelle.',
          'Suivi dynamique des Congés : Le congé est désormais constaté au fur et à mesure à chaque paie ordinaire (2.5 jours ouvrables par mois), avec gestion transparente du reliquat multi-exercices.',
          'Base média numérique : Numérisation et rattachement direct des pièces d\'identité, contrats signés et diplômes certifiés à la fiche collaborateur.'
        ]
      }
    ],
    workflow: [
      'Connexion -> Contrôle des droits d\'accès -> Attribution des rôles -> Audit des actions'
    ],
    tips: 'Toutes les données métier proviennent directement de PostgreSQL. Aucune information sensible n\'est stockée en dur sur le poste client.'
  },

  // =========================================================================
  // CHAPITRE 3 : NOTIONS DE BASE & ERGONOMIE DE NAVIGATION
  // =========================================================================
  {
    id: 'ch3-notions-base',
    number: '03',
    title: 'Chapitre 3 : Notions de Base & Ergonomie de Navigation',
    category: 'Interface & Prise en main',
    summary: 'Maîtrise complète des composants de l\'interface utilisateur : barres d\'outils, menus, listes dynamiques, filtres et modales.',
    accessPath: 'Tous les écrans de l\'application',
    subsections: [
      {
        title: '3.1 Connexion au Logiciel & Gestion de Session',
        accessPath: 'Écran de Connexion (/login)',
        description: 'Procédure d\'authentification initiale et sécurisation du poste de travail.',
        points: [
          'L\'accès s\'effectue via un navigateur web moderne à l\'adresse intranet officielle : http://45.14.194.123:8090 (ou nom de domaine interne de la banque).',
          'Saisissez votre identifiant unique (ex: matricule ou login DSI) et votre mot de passe.',
          'Après 3 tentatives infructueuses, le compte est temporairement bloqué pendant 15 minutes pour prévenir les attaques par force brute.',
          'Déconnexion : Toujours cliquer sur le bouton de déconnexion dans le coin supérieur droit avant de quitter votre poste.'
        ],
        steps: [
          '1. Ouvrir le navigateur et entrer l\'URL du SIGRH',
          '2. Renseigner l\'identifiant dans le champ « Identifiant / Matricule »',
          '3. Saisir le mot de passe dans le champ sécurisé',
          '4. Cliquer sur le bouton « Se Connecter »',
          '5. Le système charge votre profil et vous redirige vers votre tableau de bord selon vos habilitations'
        ]
      },
      {
        title: '3.2 Système de Navigation Modulaire',
        points: [
          'Barre supérieure des Modules : Permet de basculer instantanément entre Gest Admin, PAIE, CONGÉS, Paramètres généraux et PROFIL.',
          'Barre de titre & Espace utilisateur : Affiche le nom de l\'utilisateur connecté, son rôle actif, les alertes et le bouton de profil.',
          'Tiroir latéral de navigation : Présente l\'arborescence détaillée des sous-menus du module sélectionné (ex : pour la Paie : Bulletins, Éléments de salaire, Déclarations, États de synthèse).',
          'Espace de travail principal : Zone centrale dédiée à l\'affichage des tableaux de données, formulaires et indicateurs graphiques.'
        ]
      },
      {
        title: '3.3 Utilisation des Tableaux de Données, Recherche & Filtres',
        points: [
          'Recherche instantanée : Saisissez un mot-clé (nom, matricule, libellé) dans le champ de recherche pour filtrer le tableau en temps réel sans rechargement de page.',
          'Filtres déroulants : Utilisez les listes de filtre (Direction, Période de paie, Banque, Statut) pour isoler les enregistrements ciblés.',
          'Tri des colonnes : Cliquez sur l\'en-tête de n\'importe quelle colonne pour trier par ordre alphabétique croissant ou décroissant.',
          'Pagination : Choisissez le nombre de lignes par page (10, 25, 50, 100) et utilisez les flèches de navigation pour parcourir les résultats.'
        ],
        steps: [
          '1. Cliquer dans la boîte « Recherche rapide » et taper au moins 2 lettres',
          '2. Sélectionner une Direction ou une Session dans les listes déroulantes de filtre',
          '3. Cliquer sur l\'en-tête de colonne « Matricule » ou « Nom » pour ordonner la liste',
          '4. Naviguer entre les pages via les boutons Précédent / Suivant en bas de tableau'
        ]
      }
    ],
    workflow: [
      '1. Sélectionner le module dans la barre supérieure',
      '2. Cliquer sur le sous-menu désiré dans le panneau latéral gauche',
      '3. Appliquer les filtres pour affiner l\'affichage',
      '4. Effectuer les opérations de consultation, création, modification ou export'
    ],
    tips: 'Le design de l\'application a été épuré pour supprimer les icônes superflues à l\'intérieur des pages, garantissant une lisibilité maximale des données financières et administratives.'
  },

  // =========================================================================
  // CHAPITRE 4 : MODULE ACCUEIL & ESPACE COLLABORATEUR (« MON ESPACE »)
  // =========================================================================
  {
    id: 'ch4-accueil-espace',
    number: '04',
    title: 'Chapitre 4 : Module Accueil & Espace Collaborateur (« Mon Espace »)',
    category: 'Portail Employé',
    summary: 'Procédures détaillées pour les demandes self-service : congés, autorisations d\'absence, ordres de mission, avances et prêts, prises en charge de santé.',
    accessPath: 'Barre Supérieure > Mon Espace (ou Module CONGÉS)',
    subsections: [
      {
        title: '4.1 Gestion des Demandes de Congé & Absences',
        accessPath: 'Mon Espace > Mes Congés & Absences > Bouton « Nouvelle Demande »',
        description: 'Procédure de soumission d\'une demande de congé annuel, congé de maternité ou permission exceptionnelle.',
        fields: [
          { name: 'Type de congé', type: 'Sélection', required: true, description: 'Congé annuel, Permission exceptionnelle, Maternité/Paternité, Maladie' },
          { name: 'Date de début', type: 'Date', required: true, description: 'Premier jour chômé de l\'absence' },
          { name: 'Date de reprise', type: 'Date', required: true, description: 'Jour effectif du retour au poste de travail' },
          { name: 'Motif / Justificatif', type: 'Texte / Fichier PDF', required: false, description: 'Motif et téléversement du justificatif en cas de permission légale' }
        ],
        steps: [
          '1. Se connecter à son compte employé et cliquer sur « Mon Espace » dans la barre supérieure',
          '2. Accéder à l\'onglet « Congés & Absences » et vérifier son solde de congés acquis affiché en haut de page',
          '3. Cliquer sur le bouton « Nouvelle Demande »',
          '4. Choisir la nature du congé dans le menu déroulant',
          '5. Sélectionner la date de début et la date de reprise dans le calendrier interactif. Le système calcule automatiquement le nombre de jours ouvrables décomptés',
          '6. Joindre un document justificatif si nécessaire (ex : certificat médical ou acte d\'état civil)',
          '7. Cliquer sur « Soumettre pour validation »'
        ],
        systemBehavior: 'Le système bloque la soumission si le nombre de jours demandés excède le solde disponible. Une notification automatique est envoyée au supérieur hiérarchique direct (N+1) pour avis.',
        controls: [
          'Vérifier que le solde de congés acquis est supérieur ou égal au nombre de jours sollicités.',
          'Respecter le délai de prévenance légal d\'au moins 15 jours avant la date de départ souhaitée.'
        ]
      },
      {
        title: '4.2 Gestion des Ordres de Mission & Déplacements',
        accessPath: 'Mon Espace > Mes Missions > Bouton « Créer une Mission »',
        description: 'Émission d\'une demande d\'ordre de mission avec calcul des frais de déplacement.',
        fields: [
          { name: 'Objet de la mission', type: 'Texte', required: true, description: 'Motif précis du déplacement professionnel' },
          { name: 'Destination / Zone', type: 'Sélection', required: true, description: 'Zone A (National), Zone B (Sous-région UEMOA), Zone C (International)' },
          { name: 'Date de départ & retour', type: 'Date', required: true, description: 'Période exacte de la mission' },
          { name: 'Moyen de transport', type: 'Sélection', required: true, description: 'Véhicule de pool BPBF, Véhicule personnel, Avion, Transport en commun' }
        ],
        steps: [
          '1. Ouvrir le formulaire de mission en cliquant sur « Créer une Mission »',
          '2. Renseigner l\'objet précis (ex : « Audit trimestriel Agence Bobo-Dioulasso »)',
          '3. Sélectionner la zone géographique de destination',
          '4. Renseigner les dates de début et de fin. Le système calcule le nombre de nuitées et de perdiems applicables',
          '5. Cliquer sur « Enregistrer et Transmettre pour Approbation »',
          '6. Dès signature électronique par la Direction Générale, cliquer sur « Télécharger l\'Ordre de Mission (PDF) »'
        ],
        systemBehavior: 'Le système applique automatiquement le barème d\'indemnités journalières (perdiems) selon le Groupe salarial (Groupe I, II, III) et la zone.'
      },
      {
        title: '4.3 Demandes d\'Avances & Prêts au Personnel',
        accessPath: 'Mon Espace > Avances & Prêts > Bouton « Simuler un Prêt »',
        description: 'Demande d\'avance de quinzaine ou de prêt avec vérification de la quotité cessible.',
        fields: [
          { name: 'Type d\'aide', type: 'Sélection', required: true, description: 'Avance sur salaire (1 mois), Prêt équipement (12-24 mois), Prêt scolaire' },
          { name: 'Montant demandé', type: 'Numérique (FCFA)', required: true, description: 'Montant total souhaité' },
          { name: 'Durée de remboursement', type: 'Entier (Mois)', required: true, description: 'Nombre d\'échéances mensuelles' }
        ],
        steps: [
          '1. Cliquer sur « Simuler un Prêt »',
          '2. Sélectionner le type de financement et entrer le montant souhaité',
          '3. Choisir le nombre d\'échéances de remboursement',
          '4. Consulter la simulation : le système calcule le montant de la mensualité et le taux d\'endettement',
          '5. Vérifier que la mensualité ne dépasse pas 33% du salaire net moyen',
          '6. Cliquer sur « Soumettre la Demande »'
        ],
        systemBehavior: 'Si la mensualité dépasse la quotité cessible légale de 33%, le système affiche une alerte rouge bloquante. Dès approbation DRH/DG, le calendrier d\'échéances est injecté dans les précomptes de la paie mensuelle.'
      },
      {
        title: '4.4 Prises en Charge Médicales & Mutuelle de Santé',
        accessPath: 'Mon Espace > Prises en Charge > Bouton « Nouveau Bon de Soins »',
        description: 'Délivrance d\'un bon de prise en charge auprès du réseau médical conventionné.',
        fields: [
          { name: 'Bénéficiaire', type: 'Sélection', required: true, description: 'Agent, Conjoint déclaré, Enfant à charge' },
          { name: 'Prestataire conventionné', type: 'Sélection', required: true, description: 'Clinique, Hôpital, Pharmacie, Laboratoire agréé' },
          { name: 'Nature des soins', type: 'Sélection', required: true, description: 'Consultation, Analyses médicales, Pharmacie, Hospitalisation' }
        ],
        steps: [
          '1. Cliquer sur « Nouveau Bon de Soins »',
          '2. Sélectionner le bénéficiaire (collaborateur ou ayant droit)',
          '3. Choisir l\'établissement de santé conventionné dans la liste déroulante',
          '4. Indiquer la nature de l\'acte médical',
          '5. Valider et télécharger le bon de prise en charge au format PDF pour le présenter au centre de soins'
        ]
      }
    ],
    workflow: [
      'Dépôt de la demande en ligne -> Notification au responsable hiérarchique -> Approbation N+1 -> Validation DRH -> Intégration automatique en paie / comptabilité'
    ],
    tips: 'Chaque collaborateur peut suivre en temps réel le statut d\'avancement de ses demandes (En attente, Approuvé, Rejeté) depuis son tableau de bord personnel.'
  },

  // =========================================================================
  // CHAPITRE 5 : MODULE ADMINISTRATION & GESTION ADMINISTRATIVE DU PERSONNEL
  // =========================================================================
  {
    id: 'ch5-administration',
    number: '05',
    title: 'Chapitre 5 : Module Administration & Gestion Administrative du Personnel',
    category: 'Ressources Humaines',
    summary: 'Procédures complètes pour la création et mise à jour des fiches collaborateurs 360°, affectations, mutations, gestion des contrats et départs.',
    accessPath: 'Barre Supérieure > Gest Admin > Sous-menu Employés',
    subsections: [
      {
        title: '5.1 Création d\'une Nouvelle Fiche Collaborateur (Étape par Étape)',
        accessPath: 'Gest Admin > Employés > Bouton « Nouvel Employé »',
        description: 'Enregistrement complet d\'un nouvel agent dans la base de données PostgreSQL.',
        fields: [
          { name: 'Matricule', type: 'Texte unique (ex: BP0042)', required: true, description: 'Identifiant bancaire unique et immuable' },
          { name: 'Nom & Prénom', type: 'Texte', required: true, description: 'Identité officielle conforme à la CNIB' },
          { name: 'Date & Lieu de naissance', type: 'Date & Texte', required: true, description: 'État civil complet' },
          { name: 'N° CNSS', type: 'Texte', required: true, description: 'Numéro d\'affiliation à la Caisse Nationale de Sécurité Sociale' },
          { name: 'NIP / CNIB', type: 'Texte', required: true, description: 'Numéro de la carte nationale d\'identité ou passeport' },
          { name: 'Situation matrimoniale', type: 'Sélection', required: true, description: 'Célibataire, Marié(e), Divorcé(e), Veuf(ve)' },
          { name: 'Nombre d\'enfants à charge', type: 'Entier (0 à 10)', required: true, description: 'Nombre d\'enfants déclarés pour déductions fiscales IUTS' },
          { name: 'Direction & Service', type: 'Sélection', required: true, description: 'Rattachement organisationnel dans l\'organigramme' },
          { name: 'Poste / Emploi', type: 'Sélection', required: true, description: 'Intitulé du poste occupé' },
          { name: 'Groupe Salarial', type: 'Sélection', required: true, description: 'Groupe I (Exécution), Groupe II (Maîtrise), Groupe III (Cadres)' },
          { name: 'Catégorie Professionnelle', type: 'Sélection', required: true, description: '1 à 7 (Groupe I) ou I à VIII (Groupes II et III)' },
          { name: 'Échelon', type: 'Sélection (1 à 15)', required: true, description: 'Niveau d\'avancement indiciaire' },
          { name: 'Banque & Compte RIB', type: 'Texte / Sélecteur', required: true, description: 'Code Banque, Code Guichet, N° Compte, Clé RIB' }
        ],
        steps: [
          '1. Ouvrir le menu « Gest Admin » puis cliquer sur le sous-menu « Employés »',
          '2. Cliquer sur le bouton « Nouvel Employé » pour ouvrir la fenêtre de saisie',
          '3. Onglet 1 - État Civil : Renseigner le matricule, nom, prénom, sexe, date de naissance, NIP et numéro CNSS',
          '4. Onglet 2 - Situation Familiale : Sélectionner le statut matrimonial et saisir le nombre d\'enfants à charge',
          '5. Onglet 3 - Affectation : Sélectionner la Direction, le Département, le Service ou l\'Agence bancaire d\'affectation',
          '6. Onglet 4 - Classification Salariale : Choisir le Groupe (I, II ou III), la Catégorie et l\'Échelon (1 à 15). Le salaire de base indiciaire est automatiquement affiché',
          '7. Onglet 5 - Domiciliation Bancaire : Sélectionner la banque de virement et renseigner le RIB complet',
          '8. Onglet 6 - GED & Pièces jointes : Téléverser la copie de la CNIB, le contrat de travail signé et le CV',
          '9. Cliquer sur « Enregistrer l\'Employé ». Le système persiste les données dans PostgreSQL et génère la fiche individuelle'
        ],
        systemBehavior: 'Le système contrôle l\'unicité du matricule et du numéro CNSS. Tout doublon entraîne un rejet immédiat avec message d\'erreur explicite.',
        controls: [
          'Vérifier que le format du RIB bancaire comporte l\'ensemble des chiffres réglementaires.',
          'S\'assurer que les enfants déclarés sont âgés de moins de 21 ans (ou justifient d\'un certificat de scolarité valide).'
        ]
      },
      {
        title: '5.2 Gestion des Mouvements : Affectation, Mutation & Promotion',
        accessPath: 'Gest Admin > Mouvements du Personnel > Bouton « Nouveau Mouvement »',
        description: 'Enregistrement d\'un changement de service, de poste ou d\'agence bancaire.',
        steps: [
          '1. Sélectionner l\'employé concerné dans le tableau de recherche',
          '2. Cliquer sur le bouton « Enregistrer un Mouvement »',
          '3. Choisir la nature du mouvement : Mutation géographique, Nomination à un poste de responsabilité, ou Intérim',
          '4. Sélectionner la nouvelle structure de rattachement et la nouvelle fonction',
          '5. Indiquer la date de prise d\'effet officielle et joindre la décision ou note de service de nomination',
          '6. Valider l\'opération : la fiche employé est mise à jour avec conservation de l\'historique chronologique complet'
        ]
      },
      {
        title: '5.3 Cessation de Service, Départs & Solde de Tout Compte',
        accessPath: 'Gest Admin > Départs & Radiations > Bouton « Clôturer Dossier »',
        description: 'Gestion administrative d\'une fin de contrat, démission, retraite ou licenciement.',
        steps: [
          '1. Rechercher l\'employé concerné dans la liste active',
          '2. Cliquer sur « Déclarer un Départ »',
          '3. Choisir le motif : Démission, Fin de CDD, Retraite, Licenciement, Décès',
          '4. Saisir la date de fin effective de contrat et la date de remise du matériel bancaire',
          '5. Le système calcule automatiquement l\'indemnité de départ, le prorata du 13ème mois et l\'indemnité compensatrice de congés payés non consommés',
          '6. Valider le départ : l\'employé passe au statut « Inactif » et ne sera plus intégré dans les sessions de paie ultérieures'
        ]
      }
    ],
    workflow: [
      '1. Ouvrir le menu « Gestion Administrative » -> « Employés »',
      '2. Cliquer sur « Nouvel Employé » et renseigner l\'état civil et le matricule',
      '3. Assigner l\'affectation organisationnelle (Direction, Service, Poste)',
      '4. Sélectionner la Classification (Groupe, Catégorie, Échelon) -> Contrôler le salaire de base',
      '5. Renseigner les charges de famille et le compte bancaire RIB',
      '6. Enregistrer dans PostgreSQL'
    ],
    tips: 'Le matricule employé est unique et immuable. Il garantit la traçabilité complète de l\'historique de paie et de carrière.'
  },

  // =========================================================================
  // CHAPITRE 6 : MODULE CARRIÈRES, ÉVALUATIONS & PROMOTIONS
  // =========================================================================
  {
    id: 'ch6-carrieres',
    number: '06',
    title: 'Chapitre 6 : Module Carrières, Évaluations & Promotions',
    category: 'Gestion des Talents',
    summary: 'Procédures de saisie des évaluations annuelles, calcul automatique des propositions d\'avancement d\'échelon et validation des reclassements.',
    accessPath: 'Barre Supérieure > CARRIÈRES > Sous-menu Gestion des Carrières',
    subsections: [
      {
        title: '6.1 Saisie des Notations & Campagne d\'Évaluation Annuelle',
        accessPath: 'Carrières > Notations & Évaluations > Bouton « Nouvelle Évaluation »',
        description: 'Enregistrement des notations annuelles chiffrées selon les 3 axes réglementaires de la Banque Postale (/20).',
        fields: [
          { name: 'Collaborateur', type: 'Sélection', required: true, description: 'Agent évalué' },
          { name: 'Exercice d\'évaluation', type: 'Nombre', required: true, description: 'Année de notation (ex: 2026)' },
          { name: 'Atteinte des Objectifs (40%)', type: 'Note / 20', required: true, description: 'Performance opérationnelle et résultats mesurables' },
          { name: 'Compétences & Rigueur (40%)', type: 'Note / 20', required: true, description: 'Expertise technique bancaire, conformité et respect des procédures' },
          { name: 'Comportement & Éthique (20%)', type: 'Note / 20', required: true, description: 'Ponctualité, relation client et esprit d\'équipe' },
          { name: 'Note Globale', type: 'Calculée', required: false, description: 'Moyenne pondérée automatique sur 20' },
          { name: 'Appréciation générale', type: 'Texte', required: false, description: 'Mention automatique (Excellent, Très Bien, Bien, Passable, Insuffisant) et recommandations' }
        ],
        steps: [
          '1. Ouvrir le module « CARRIÈRES » et cliquer sur le sous-menu « Notations & Évaluations »',
          '2. Cliquer sur le bouton « Nouvelle Évaluation »',
          '3. Sélectionner le collaborateur à évaluer parmi les agents de la banque',
          '4. Renseigner l\'exercice (ex: 2026) et les 3 notes (/20)',
          '5. Constater le calcul en temps réel de la Note Globale et de l\'Appréciation suggérée',
          '6. Ajuster les observations managériales puis cliquer sur « Enregistrer & Valider la Notation »',
          '7. La note est sauvegardée dans PostgreSQL et historisée dans le tableau des performances'
        ]
      },
      {
        title: '6.2 Moteur d\'Avancements d\'Échelon Automatique (E01 à E15)',
        accessPath: 'Carrières > Avancements d\'Échelon > Bouton « Générer les Propositions d\'Avancement »',
        description: 'Moteur de promotion automatique identifiant les agents ayant 2 ans d\'ancienneté dans leur échelon et calculant le passage à l\'échelon n+1.',
        steps: [
          '1. Accéder au sous-menu « Avancements d\'Échelon »',
          '2. Cliquer sur le bouton « Générer les Propositions d\'Avancement »',
          '3. Le système analyse les agents actifs dans PostgreSQL, extrait leur échelon actuel (E01 à E14) et calcule l\'échelon supérieur (n+1)',
          '4. Le comparatif affiche : Matricule, Nom, Fonction, Échelon Actuel vs Proposé, Salaire de Base Actuel, Nouveau Salaire de Base et Gain Mensuel Brut (+ FCFA)',
          '5. Cliquer sur le bouton « Valider » en regard de chaque agent proposé',
          '6. Le système met à jour instantanément dans PostgreSQL le profil de l\'employé, son échelon, sa grille indiciaire et sa fiche salariale',
          '7. Les prochains bulletins de paie calculés intègrent immédiatement le nouveau salaire de base sans ressaisie'
        ],
        systemBehavior: 'Mise à jour transactionnelle directe dans PostgreSQL : Employee.echelonObj, SituationSalariale et recalcul immédiat du salaire net via InformationSalarialeCalculService.'
      },
      {
        title: '6.3 Reclassements Professionnels & Changement de Catégorie',
        accessPath: 'Carrières > Reclassements & Qualifications > Bouton « Nouveau Reclassement »',
        description: 'Changement de classe, catégorie et grade suite à obtention de diplôme homologué (ITB/Master) ou concours interne.',
        steps: [
          '1. Accéder au sous-menu « Reclassements & Qualifications »',
          '2. Cliquer sur « Nouveau Reclassement »',
          '3. Sélectionner le collaborateur : sa situation actuelle (catégorie, grade, échelon, salaire base) s\'affiche automatiquement',
          '4. Renseigner la Référence de l\'Acte Décisionnel (ex: Décision N° 2026/012/DG/DRH) et le motif',
          '5. Choisir la nouvelle catégorie, le nouveau grade et le nouvel échelon',
          '6. Cliquer sur « Valider & Appliquer le Reclassement » : les données sont actées et appliquées en base'
        ]
      },
      {
        title: '6.4 Plan & Catalogue de Formations Continues',
        accessPath: 'Carrières > Plan de Formation > Bouton « Planifier une Session »',
        description: 'Gestion du catalogue des modules d\'apprentissage bancaire et suivi des sessions présentielles / e-learning.',
        steps: [
          '1. Consulter les modules dans l\'onglet « Catalogue des Modules » ou en créer de nouveaux',
          '2. Dans l\'onglet « Sessions Planifiées », cliquer sur « Planifier une Session »',
          '3. Choisir le thème, la date de session et le nombre de participants prévus',
          '4. Confirmer, clôturer ou annuler les sessions selon leur déroulement'
        ]
      }
    ],
    workflow: [
      'Campagne annuelle d\'évaluation (/20) -> Génération automatique des propositions d\'échelons (E01-E15) -> Validation DRH/DG -> Prise en compte instantanée en paie sans ressaisie -> Suivi des reclassements et formations'
    ],
    tips: 'Le module est 100% interconnecté avec PostgreSQL : valider un avancement met automatiquement à jour la paie et les cotisations CNSS/IUTS.'
  },

  // =========================================================================
  // CHAPITRE 7 : MODULE FORMATION & DÉVELOPPEMENT DES COMPÉTENCES
  // =========================================================================
  {
    id: 'ch7-formation',
    number: '07',
    title: 'Chapitre 7 : Module Formation & Développement des Compétences',
    category: 'Développement RH',
    summary: 'Plan de formation pluriannuel, gestion des sessions, suivi des prestataires et engagements budgétaires.',
    accessPath: 'Barre Supérieure > Gest Admin > Sous-menu Formation',
    subsections: [
      {
        title: '7.1 Paramétrage des Thèmes & Organismes de Formation',
        accessPath: 'Formation > Paramètres > Thèmes & Prestataires',
        description: 'Gestion du catalogue des thèmes de formation et des prestataires agréés.',
        steps: [
          '1. Cliquer sur « Thèmes de Formation » puis sur « Nouveau Thème »',
          '2. Renseigner le domaine de compétence (Conformité bancaire, Risque de crédit, Audit, Informatique, Accueil client)',
          '3. Indiquer les prérequis et objectifs pédagogiques visés',
          '4. Enregistrer dans la base de données',
          '5. Déclarer les cabinets et organismes formateurs agréés dans le sous-menu « Prestataires de Formation »'
        ]
      },
      {
        title: '7.2 Organisation d\'une Session de Formation & Inscription des Participants',
        accessPath: 'Formation > Sessions > Bouton « Nouvelle Session »',
        description: 'Planification d\'une session de formation collective ou individuelle.',
        steps: [
          '1. Cliquer sur « Nouvelle Session de Formation »',
          '2. Sélectionner le thème et l\'organisme formateur',
          '3. Renseigner les dates de début, de fin, le lieu et le coût total hors taxes',
          '4. Ajouter les agents participants depuis la liste des employés actifs',
          '5. Vérifier la disponibilité des agents sur la période (contrôle des congés posés)',
          '6. Valider l\'inscription et générer les convocations individuelles de stage',
          '7. À l\'issue de la formation, enregistrer la clôture de la session et téléverser les attestations délivrées'
        ]
      }
    ],
    workflow: [
      'Recensement des besoins -> Élaboration du plan annuel de formation -> Approbation budgétaire -> Déroulement des sessions -> Évaluation et clôture'
    ],
    tips: 'Le suivi rigoureux du budget de formation permet de maximiser le retour sur investissement des compétences clés de la Banque.'
  },

  // =========================================================================
  // CHAPITRE 8 : MODULE SOCIAL, SANTÉ & ŒUVRES SOCIALES
  // =========================================================================
  {
    id: 'ch8-social',
    number: '08',
    title: 'Chapitre 8 : Module Social, Santé & Œuvres Sociales',
    category: 'Protection Sociale',
    summary: 'Gestion des prestations sociales, des conventions médicales, de la mutuelle du personnel et des secours.',
    accessPath: 'Barre Supérieure > Gest Admin > Sous-menu Social',
    subsections: [
      {
        title: '8.1 Réseau de Soins Conventionné & Barèmes de Prise en Charge',
        points: [
          'Enregistrement des cliniques, hôpitaux, centres d\'imagerie médicale, laboratoires et officines pharmaceutiques partenaires de la BPBF.',
          'Plafonds de prise en charge : Définition des taux de couverture (ex : 80% pris en charge par l\'assurance/mutuelle BPBF, 20% ticket modérateur employé).'
        ]
      },
      {
        title: '8.2 Traitement des Factures Médicales & Retenues en Paie',
        accessPath: 'Social > Traitements Mensuels Factures',
        description: 'Rapprochement des factures envoyées par les cliniques et pharmacies partenaires.',
        steps: [
          '1. Ouvrir l\'écran « Factures Médicales » et cliquer sur « Nouveau Bordereau Prestataire »',
          '2. Sélectionner le prestataire de santé et saisir le numéro de facture ainsi que la période',
          '3. Renseigner les montants totaux facturés',
          '4. Associer chaque ligne de facture au bon de prise en charge émis initialement dans l\'application',
          '5. Le système calcule la part revenant à la Banque et la quote-part restant à la charge de l\'employé',
          '6. Valider l\'ordonnancement : la part employé est automatiquement injectée dans les précomptes de la paie du mois sous la rubrique « OD Frais Médicaux »'
        ]
      }
    ],
    workflow: [
      'Émission du bon de prise en charge -> Prestation médicale -> Facturation prestataire -> Rapprochement & Ordonnancement comptable'
    ],
    tips: 'Le module social protège les collaborateurs et leurs familles tout en assurant une maîtrise stricte des coûts de santé pour la Banque.'
  },

  // =========================================================================
  // CHAPITRE 9 : MODULE MOTIVATION, CLASSIFICATIONS & GRILLES SALARIALES
  // =========================================================================
  {
    id: 'ch9-motivation',
    number: '09',
    title: 'Chapitre 9 : Module Motivation, Classifications & Grilles Salariales',
    category: 'Politique Rémunération',
    summary: 'Structure de la classification BPBF, grille des salaires indiciaires (15 échelons), primes et indemnités obligatoires.',
    accessPath: 'Barre Supérieure > Paramètres généraux (ou PAIE > Grille Salariale)',
    subsections: [
      {
        title: '9.1 Classification Conventionnelle BPBF',
        points: [
          'Groupes Salariaux : La structure salariale est organisée en trois grands groupes : Groupe I (Personnel d\'exécution), Groupe II (Personnel de maîtrise) et Groupe III (Cadres et Cadres de Direction).',
          'Catégories Professionnelles : Les catégories du Groupe I sont notées en chiffres arabes (Catégories 1 à 7). Les catégories des Groupes II et III sont notées en chiffres romains (Catégories I à VIII).',
          'Échelons de Progression : Chaque catégorie comporte 15 échelons successifs (Échelon 1 à 15), traduisant l\'ancienneté et l\'expérience acquise.'
        ]
      },
      {
        title: '9.2 Configuration de la Grille des Salaires de Base Indiciaires',
        accessPath: 'Paramètres généraux > Grilles Salariales > Bouton « Modifier la Grille »',
        description: 'Mise à jour des valeurs officielles des salaires de base indiciaires.',
        fields: [
          { name: 'Groupe', type: 'Sélection', required: true, description: 'Groupe I, Groupe II ou Groupe III' },
          { name: 'Catégorie', type: 'Sélection', required: true, description: '1 à 7 ou I à VIII' },
          { name: 'Échelon', type: 'Entier (1 à 15)', required: true, description: 'Niveau indiciaire' },
          { name: 'Salaire de Base', type: 'Numérique (FCFA)', required: true, description: 'Montant mensuel garanti' }
        ],
        steps: [
          '1. Ouvrir le tableau de la Grille Salariale',
          '2. Filtrer par Groupe et Catégorie pour afficher les 15 échelons correspondants',
          '3. Pour ajuster un montant, cliquer sur la ligne ou sur le bouton « Modifier »',
          '4. Renseigner la nouvelle valeur en FCFA du salaire de base',
          '5. Cliquer sur « Enregistrer dans PostgreSQL »',
          '6. Le nouveau montant s\'appliquera automatiquement à tous les collaborateurs rattachés à cette classification lors du prochain calcul de paie'
        ]
      },
      {
        title: '9.3 Grilles Indemnitaires & Primes Réglementaires',
        accessPath: 'PAIE > Éléments de Salaire > Rubriques Indemnitaires',
        description: 'Paramétrage des primes catégorielles obligatoires.',
        points: [
          'Indemnité de Logement : Taux en pourcentage du salaire de base ou montant forfaitaire selon le Groupe salarial.',
          'Indemnité de Transport : Montant mensuel alloué pour couvrir les trajets domicile-lieu de travail.',
          'Prime de Sujétion / Responsabilité : Attribuée aux chefs d\'agence, chefs de département et directeurs.',
          'Prime de Caisse : Allouée aux caissiers et gestionnaires de coffre pour couvrir le risque financier de manipulation d\'espèces.'
        ]
      }
    ],
    workflow: [
      '1. Vérifier la classification conventionnelle (Groupes I, II, III et Catégories)',
      '2. Paramétrer la Grille Salariale indiciaire (15 échelons par catégorie)',
      '3. Configurer les barèmes d\'indemnités (Logement, Transport, Sujétion)',
      '4. Affecter la classification à la fiche de chaque collaborateur'
    ],
    tips: 'La conformité stricte de la grille salariale avec les accords d\'entreprise garantit l\'équité interne et la paix sociale au sein de l\'institution.'
  },

  // =========================================================================
  // CHAPITRE 10 : MODULE PAIE & TRAITEMENTS MENSUELS (CYCLE INTÉGRAL DE A À Z)
  // =========================================================================
  {
    id: 'ch10-paie',
    number: '10',
    title: 'Chapitre 10 : Module Paie & Traitements Mensuels (Cycle Intégral de A à Z)',
    category: 'Moteur de Paie',
    summary: 'Guide opérationnel complet du cycle de paie mensuel : ouverture, variables, calcul automatique, contrôles M-1 vs M, validation, 12 états officiels, export comptable et clôture.',
    accessPath: 'Barre Supérieure > Module PAIE',
    subsections: [
      {
        title: '10.1 Étape 1 : Ouverture de la Session de Paie Mensuelle',
        accessPath: 'PAIE > Sessions de Paie > Bouton « Nouvelle Session »',
        description: 'Création de la session comptable du mois en cours.',
        fields: [
          { name: 'Mois & Année', type: 'Sélection', required: true, description: 'Période de paie (ex: 09/2026)' },
          { name: 'Type de session', type: 'Sélection', required: true, description: 'Ordinaire (mensuelle normale), Extraordinaire (gratification, 13ème mois)' },
          { name: 'Date de début & fin', type: 'Date', required: true, description: 'Période calendaire de décompte' },
          { name: 'Date de paiement prévue', type: 'Date', required: true, description: 'Date de valeur du virement bancaire' }
        ],
        steps: [
          '1. Cliquer sur le module « PAIE » dans la barre supérieure',
          '2. Accéder à « Sessions de Paie » et cliquer sur « Nouvelle Session »',
          '3. Sélectionner le mois et l\'année comptable',
          '4. Choisir « Session Ordinaire » pour la paie mensuelle standard',
          '5. Confirmer les dates de début, fin et date d\'exigibilité',
          '6. Cliquer sur « Ouvrir la Session ». La session apparaît à l\'état « Ouverte / En Cours »'
        ]
      },
      {
        title: '10.2 Étape 2 : Activation des Employés & Saisie des Variables',
        accessPath: 'PAIE > Variables de Paie (Avoirs & Précomptes)',
        description: 'Vérification de la liste des agents éligibles et saisie des éléments variables du mois.',
        fields: [
          { name: 'Heures supplémentaires', type: 'Numérique (Heures)', required: false, description: 'Heures majorées à 15%, 50% ou 100%' },
          { name: 'Primes exceptionnelles', type: 'Numérique (FCFA)', required: false, description: 'Prime de rendement, prime de bilan' },
          { name: 'Absences déductibles', type: 'Nombre de jours', required: false, description: 'Absences injustifiées entraînant une retenue sur salaire' },
          { name: 'Acomptes sur salaire', type: 'Numérique (FCFA)', required: false, description: 'Avances accordées au cours du mois à déduire du net' }
        ],
        steps: [
          '1. Cliquer sur « Variables de Paie »',
          '2. Sélectionner la session active en cours',
          '3. Pour saisir une prime ou rappel : cliquer sur « Ajouter un Avoir », sélectionner le collaborateur, le code de prime et le montant',
          '4. Pour saisir une retenue ou acompte : cliquer sur « Ajouter un Précompte » et renseigner le montant à prélever',
          '5. Les mensualités de prêts en cours sont automatiquement importées par le système sans ressaisie manuelle'
        ]
      },
      {
        title: '10.3 Étape 3 : Lancement du Calcul Automatique de la Paie',
        accessPath: 'PAIE > Bulletins > Bouton « Générer la Paie du Mois »',
        description: 'Exécution du moteur de paie Spring Boot en temps réel pour l\'ensemble des agents.',
        steps: [
          '1. Accéder au menu « Bulletins »',
          '2. Cliquer sur le bouton principal « Générer la Paie du Mois »',
          '3. Le système exécute en arrière-plan la chaîne de traitement :',
          '   a. Détermination du Salaire de Base indiciaire selon le Groupe, la Catégorie et l\'Échelon',
          '   b. Calcul des indemnités fixes (Logement, Transport, Sujétion, Représentation)',
          '   c. Intégration des éléments variables (primes, heures sup, rappels)',
          '   d. Détermination du Salaire Brut Global',
          '   e. Calcul des cotisations sociales CNSS : part ouvrière 5.5% (plafonnée à 600 000 FCFA)',
          '   f. Détermination de la base imposable fiscale nette après abattement professionnel',
          '   g. Calcul de l\'IUTS selon le barème progressif par tranches 2024 avec réduction pour charges de famille',
          '   h. Retenue légale FSP (Fonds de Soutien Patriotique 1%) et cotisation Mutuelle',
          '   i. Déduction des précomptes de prêt et acomptes',
          '   j. Détermination du Salaire Net à Payer',
          '   k. Calcul des charges patronales (CNSS 16%, Taxe Patronale d\'Apprentissage TPA)',
          '4. Une boîte de dialogue confirme le succès du calcul et affiche le nombre de bulletins générés avec la masse salariale globale'
        ],
        systemBehavior: 'Si un collaborateur actif n\'a pas de RIB bancaire renseigné, le système génère un avertissement de contrôle sans bloquer les autres agents.'
      },
      {
        title: '10.4 Étape 4 : Contrôle de Paie, Mode Comparatif (M-1 vs M) & Audit',
        accessPath: 'PAIE > Bulletins > Commutateur « Mode Comparatif »',
        description: 'Analyse comparative des écarts de rémunération entre le mois précédent et le mois actuel.',
        steps: [
          '1. Sur l\'écran des bulletins, activer le commutateur « Mode Comparatif (M-1 vs M) »',
          '2. Le tableau affiche pour chaque agent : Salaire Brut M-1, Salaire Brut M, Écart Brut, Net M-1, Net M, Écart Net',
          '3. Identifier immédiatement les écarts significatifs (mis en évidence par des indicateurs visuels)',
          '4. Cliquer sur un agent pour afficher le détail de son bulletin individuel et vérifier les rubriques modifiées',
          '5. Si une correction est requise : ajuster la variable erronée et recliquer sur « Recalculer le Bulletin » pour cet employé'
        ]
      },
      {
        title: '10.5 Étape 5 : Validation Hiérarchique de la Paie',
        accessPath: 'PAIE > Sessions de Paie > Bouton « Valider la Paie »',
        description: 'Validation formelle par le Responsable Paie puis par le Directeur des Ressources Humaines.',
        steps: [
          '1. Après vérification complète des totaux de paie et du mode comparatif, cliquer sur « Valider la Paie »',
          '2. Renseigner son mot de passe de confirmation pour signature électronique',
          '3. La session passe à l\'état « Validée DRH »',
          '4. Dès validation, les bulletins individuels deviennent consultables par les employés sur leur espace personnel'
        ]
      },
      {
        title: '10.6 Étape 6 : Édition & Téléchargement des 12 États de Synthèse Officiels',
        accessPath: 'PAIE > États de Synthèse (Sous-menu dédié)',
        description: 'Génération instantanée des bordereaux officiels au format Excel ou PDF signé.',
        points: [
          '1. Livre de Paie Global : Synthèse complète de toutes les rubriques de gain et retenues pour chaque employé.',
          '2. État Nominatif des Salaires : Liste officielle des salaires nets pour archivage administratif.',
          '3. État des Salaires par Direction : Répartition analytique de la masse salariale par direction et département.',
          '4. Bordereau de Virement Bancaire : Fichier consolidé par banque avec codes RIB pour émission des virements interbancaires.',
          '5. Déclaration CNSS : Bordereau nominatif officiel des cotisations salariales (5.5%) et patronales (16%).',
          '6. Déclaration Fiscale IUTS : État des retenues à la source à transmettre à la Direction Générale des Impôts (DGI).',
          '7. État des Précomptes & Retenues : Récapitulatif des retenues sur prêts bancaires et dettes diverses.',
          '8. État FSP : Bordereau de versement de la contribution patriotique de 1%.',
          '9. État de la Mutuelle Santé : Récapitulatif des cotisations d\'assurance maladie.',
          '10. État des Éléments de Salaire : Répartition montant par montant de chaque prime ou indemnité.',
          '11. État par Type d\'Employé : Analyse comparative Cadres, Maîtrise, Exécution.',
          '12. État de Contrôle des Bulletins : Fiche d\'audit exhaustif des anomalies et totaux de contrôle.'
        ],
        steps: [
          '1. Ouvrir le sous-menu de l\'état souhaité dans le tiroir de gauche',
          '2. Sélectionner la session de paie dans le filtre de période',
          '3. Cliquer sur « Exporter Excel » pour obtenir la version tableur avec BOM UTF-8',
          '4. Cliquer sur « Télécharger PDF » pour obtenir le bordereau officiel prêt pour visa et signature'
        ]
      },
      {
        title: '10.7 Étape 7 : Export Comptable & Clôture Définitive de la Session',
        accessPath: 'PAIE > Sessions de Paie > Bouton « Clôturer Définitivement »',
        description: 'Génération du fichier d\'écritures comptables et verrouillage irréversible de la session.',
        steps: [
          '1. Cliquer sur le bouton « Export Comptable »',
          '2. Sélectionner le format d\'export (Grand Livre / Écritures de paie OD)',
          '3. Télécharger le fichier texte ou CSV compatible avec le progiciel comptable bancaire',
          '4. Vérifier que toutes les impressions et virements ont été exécutés',
          '5. Cliquer sur le bouton « Clôturer Définitivement la Session »',
          '6. Confirmer le message d\'avertissement : la session passe à l\'état « Clôturée » et est verrouillée de manière irréversible dans PostgreSQL pour interdire toute modification ultérieure'
        ],
        systemBehavior: 'La clôture de la paie archive les bulletins de manière immuable, met à jour les compteurs cumulés annuels et ouvre la possibilité de créer la session du mois suivant.'
      }
    ],
    workflow: [
      'Ouverture session -> Activation des agents -> Saisie variables -> Moteur de calcul -> Contrôle M-1 vs M -> Validation DRH -> Bulletins -> 12 États de synthèse -> Export comptable -> Clôture définitive'
    ],
    tips: 'La clôture de la paie est une opération irréversible qui garantit l\'intégrité légale et comptable des exercices financiers.'
  },

  // =========================================================================
  // CHAPITRE 11 : MODULE PROFILS, SÉCURITÉ, OPTIONS SYSTÈME & SAUVEGARDES
  // =========================================================================
  {
    id: 'ch11-options-securite',
    number: '11',
    title: 'Chapitre 11 : Module Profils, Sécurité, Options Système & Sauvegardes',
    category: 'Administration Système',
    summary: 'Administration des comptes utilisateurs, matrice des habilitations par module, clôture annuelle et sauvegardes de données PostgreSQL.',
    accessPath: 'Barre Supérieure > PROFIL (ou Paramètres Généraux)',
    subsections: [
      {
        title: '11.1 Gestion des Profils de Sécurité & Matrice des Habilitations',
        accessPath: 'PROFIL > Sécurité & Droits > Matrice des Habilitations',
        description: 'Attribution granulaire des privilèges d\'accès par écran et par type d\'action.',
        fields: [
          { name: 'Rôle Applicatif', type: 'Sélection', required: true, description: 'ADMIN, DRH, GESTIONNAIRE_PAIE, GESTIONNAIRE_GRH, VALIDATEUR, CONSULTANT' },
          { name: 'Permissions Écran', type: 'Cases à cocher', required: true, description: 'Lecture (Afficher), Création (Nouveau), Modification (Éditer), Suppression, Validation, Clôture' }
        ],
        steps: [
          '1. Ouvrir le menu « PROFIL » puis cliquer sur « Matrice des Habilitations »',
          '2. Sélectionner le rôle utilisateur à configurer dans la liste déroulante',
          '3. Dans la matrice, cocher ou décocher les autorisations pour chaque module (ex : interdire la modification de la grille salariale aux gestionnaires de paie)',
          '4. Cliquer sur « Enregistrer les Droits »',
          '5. Les nouvelles permissions prennent effet immédiatement pour toutes les sessions ouvertes'
        ]
      },
      {
        title: '11.2 Gestion des Comptes Utilisateurs & Réinitialisation',
        accessPath: 'PROFIL > Utilisateurs > Bouton « Nouvel Utilisateur »',
        description: 'Création d\'un compte applicatif et assignation de profil.',
        steps: [
          '1. Cliquer sur « Nouvel Utilisateur »',
          '2. Saisir le nom, l\'adresse e-mail professionnelle BPBF et le matricule',
          '3. Assigner le profil de sécurité requis',
          '4. Définir un mot de passe temporaire à changer obligatoirement à la première connexion',
          '5. Pour débloquer un compte ou réinitialiser un mot de passe oublié : rechercher l\'utilisateur et cliquer sur « Réinitialiser le mot de passe »'
        ]
      },
      {
        title: '11.3 Gestion de l\'Exercice & Clôture Annuelle',
        accessPath: 'Paramètres généraux > Exercices > Bouton « Bascule Annuelle »',
        description: 'Opérations de fin d\'année financière et ouverture du nouvel exercice budgétaire.',
        steps: [
          '1. Vérifier que les 12 sessions mensuelles de l\'année écoulée sont toutes à l\'état « Clôturée »',
          '2. Cliquer sur « Ouvrir le Nouvel Exercice (N+1) »',
          '3. Le système procède au report automatique des soldes de congés acquis non consommés selon les règles conventionnelles',
          '4. Réinitialisation des compteurs périodiques tout en conservant l\'historique intégral',
          '5. Déclaration de l\'exercice N+1 comme exercice actif de travail'
        ]
      },
      {
        title: '11.4 Sauvegardes & Restauration de la Base de Données PostgreSQL',
        accessPath: 'Paramètres généraux > Sauvegardes > Bouton « Sauvegarder Maintenant »',
        description: 'Sauvegarde physique et logique des données pour prévenir tout sinistre.',
        steps: [
          '1. Accéder à l\'écran « Sauvegardes de la Base de Données »',
          '2. Cliquer sur « Déclencher une Sauvegarde Complète (Dump SQL) »',
          '3. Le système exécute la commande pg_dump en arrière-plan avec compression gzip',
          '4. Télécharger le fichier d\'archive de sauvegarde généré pour stockage sur le serveur de secours ou NAS externe sécurisé',
          '5. En cas de sinistre : la procédure de restauration s\'exécute via la commande pg_restore fournie dans la documentation technique'
        ]
      }
    ],
    workflow: [
      'Création profil -> Matrice des droits -> Attribution utilisateur -> Surveillance des logs -> Sauvegarde quotidienne'
    ],
    tips: 'Toujours effectuer un export de sauvegarde complet avant le lancement des opérations de clôture annuelle ou de modification globale de la grille salariale.'
  }
];
