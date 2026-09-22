export interface GuideSubsection {
  title: string;
  points: string[];
}

export interface GuideChapter {
  id: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  subsections: GuideSubsection[];
  workflow: string[];
  tips?: string;
}

export const GUIDE_CHAPTERS: GuideChapter[] = [
  {
    id: 'ch1-introduction',
    number: '01',
    title: 'Chapitre 1 : Introduction & Présentation Générale du SIGRH',
    category: 'Vue d\'ensemble',
    summary: 'Présentation de la solution intégrée de gestion des ressources humaines et de la paie de la Banque Postale du Burkina Faso (BPBF).',
    subsections: [
      {
        title: '1.1 Contexte & Objectifs de l\'application',
        points: [
          'Le SIGRH BPBF est une solution Full-Web de dernière génération, accessible depuis tout poste ou tablette sécurisé au sein du réseau bancaire.',
          'L\'application a été conçue pour garantir une gestion axée sur les fiches de poste, une traçabilité intégrale des mouvements de personnel et un contrôle strict des dépenses de rémunération.',
          'La sécurité et la confidentialité sont assurées à travers une architecture robuste en couches (Angular, Spring Boot 3, PostgreSQL 15) et un chiffrement renforcé des données salariales.'
        ]
      },
      {
        title: '1.2 Périmètre fonctionnel couvert',
        points: [
          'Gestion administrative et suivi 360° du collaborateur (état civil, diplômes, contrats, historique des postes).',
          'Gestion des carrières, évaluations annuelles, avancements d\'échelon et reclassements conventionnels.',
          'Moteur de paie automatisé conforme à la réglementation burkinabè (IUTS nouveau barème 2024, CNSS 5.5% / 16%, FSP, Mutuelle).',
          'Gestion prévisionnelle et exécution des congés et absences avec décompte automatique lors des sessions de paie.',
          'Portail self-service collaborateur (« Mon Espace ») pour les demandes de congés, attestations et consultation des bulletins.'
        ]
      }
    ],
    workflow: [
      'Authentification sécurisée -> Accès au tableau de bord général -> Navigation modulaire -> Exécution des processus RH / Paie -> Déconnexion sécurisée'
    ],
    tips: 'Le guide utilisateur constitue le document de référence officiel. Il est structuré à l\'image de l\'application pour une prise en main immédiate.'
  },
  {
    id: 'ch2-nouveautes',
    number: '02',
    title: 'Chapitre 2 : Nouveautés & Architecture Modulaire',
    category: 'Architecture',
    summary: 'Évolutions majeures apportées à la plateforme SIGRH, conteneurisation applicative et nouveaux modules.',
    subsections: [
      {
        title: '2.1 Plateforme Applicative & Sécurité',
        points: [
          'Authentification centralisée avec jetons JWT sécurisés et gestion de session active.',
          'Contrôle d\'accès basé sur les rôles (RBAC) avec matrice d\'habilitations granulaire par module et par action.',
          'Journalisation continue des opérations sensibles côté serveur (audit trail pour les modifications salariales et clôtures de paie).'
        ]
      },
      {
        title: '2.2 Nouveaux Modules & Fonctionnalités Clés',
        points: [
          'Gestion des Carrières & Évaluations : Saisie numérique des notes, calcul automatique des propositions d\'avancement d\'échelon.',
          'Gestion Sociale & Prises en Charge : Émission des bons de soins, facturation des prestataires médicaux et quote-part mutuelle.',
          'Suivi dynamique des Congés : Le congé est désormais constaté au fur et à mesure à chaque paie ordinaire (2.5 jours ouvrables par mois), avec gestion transparente du reliquat multi-exercices.',
          'Base média numérique : Numérisation et rattachement direct des pièces d\'identité, contrats signés et diplômes certifiés à la fiche employé.'
        ]
      }
    ],
    workflow: [
      'Connexion -> Contrôle des droits d\'accès -> Attribution des rôles -> Audit des actions'
    ],
    tips: 'Toutes les données métier proviennent directement de PostgreSQL. Aucune information sensible n\'est stockée en dur sur le poste client.'
  },
  {
    id: 'ch3-notions-base',
    number: '03',
    title: 'Chapitre 3 : Notions de Base & Ergonomie de Navigation',
    category: 'Interface & Prise en main',
    summary: 'Maîtrise des composants de l\'interface utilisateur : barres d\'outils, menus, listes dynamiques et modales.',
    subsections: [
      {
        title: '3.1 Connexion au Logiciel & Session',
        points: [
          'L\'accès s\'effectue via un navigateur web moderne (Google Chrome, Microsoft Edge, Mozilla Firefox) à l\'URL institutionnelle fournie par la DSI.',
          'Saisissez votre identifiant unique et votre mot de passe confidentiel. En cas d\'oubli, contactez l\'Administrateur Système pour réinitialisation.',
          'Après 30 minutes d\'inactivité, la session est automatiquement verrouillée pour préserver la confidentialité des données.'
        ]
      },
      {
        title: '3.2 Système de Navigation Modulaire',
        points: [
          'Barre supérieure des Modules : Permet de basculer instantanément entre Gest Admin, PAIE, CONGÉS, Paramètres généraux et PROFIL.',
          'Barre de titre & Espace utilisateur : Affiche le nom de l\'utilisateur connecté, son rôle actif, les notifications et le bouton de déconnexion.',
          'Tiroir latéral de navigation : Présente l\'arborescence détaillée des sous-menus du module sélectionné (ex : pour la Paie : Bulletins, Éléments de salaire, Déclarations, États de synthèse).',
          'Espace de travail principal : Zone centrale dédiée à l\'affichage des tableaux de données, formulaires et indicateurs graphiques.'
        ]
      },
      {
        title: '3.3 Utilisation des Tableaux de Données & Formulaires',
        points: [
          'Filtres instantanés : Utilisez les listes déroulantes de filtre (Direction, Période, Banque) et le champ de recherche textuelle pour cibler une information en temps réel.',
          'Tri et pagination : Cliquez sur les en-têtes de colonnes pour trier par ordre alphabétique ou numérique. Utilisez la barre de pagination pour naviguer entre les pages.',
          'Formulaires de mise à jour : Les champs marqués d\'un astérisque sont obligatoires. La validation en temps réel signale tout format invalide avant enregistrement.'
        ]
      }
    ],
    workflow: [
      '1. Sélectionner le module dans la barre supérieure',
      '2. Cliquer sur le sous-menu désiré dans le panneau latéral',
      '3. Appliquer les filtres pour affiner l\'affichage',
      '4. Ouvrir ou modifier l\'enregistrement via la fenêtre dédiée'
    ],
    tips: 'Pour une ergonomie optimale, les raccourcis de recherche rapide sont disponibles sur tous les tableaux principaux.'
  },
  {
    id: 'ch4-accueil-espace',
    number: '04',
    title: 'Chapitre 4 : Module Accueil & Espace Collaborateur (« Mon Espace »)',
    category: 'Portail Employé',
    summary: 'Fonctionnalités self-service du personnel : demandes de congés, ordres de mission, avances et prêts, prises en charge.',
    subsections: [
      {
        title: '4.1 Congés, Absences & Récupérations',
        points: [
          'Formulaire de demande de congé : Choix de la nature (congé annuel, congé de maternité, congé pour événement familial), date de début, date de reprise.',
          'Contrôle automatique du solde : Le système vérifie en temps réel le solde de congés acquis disponible avant de valider la soumission.',
          'Autorisations d\'absence : Saisie des absences justifiées de courte durée avec obligation de téléverser la pièce justificative (certificat médical, convocation officielle).',
          'Jours de récupération : Déclaration des heures supplémentaires ou permanences accomplies ouvrant droit à repos compensateur.'
        ]
      },
      {
        title: '4.2 Missions & Frais de Déplacement',
        points: [
          'Création de l\'ordre de mission : Objet de la mission, destination (agence régionale, siège, international), moyen de transport (véhicule de pool, transport public).',
          'Calcul automatique des perdiems : Le barème officiel de la BPBF est appliqué en fonction du Groupe de l\'employé et de la zone géographique.',
          'Circuit de validation hiérarchique : Approbation par le Chef de Département, validation budgétaire par le DAF, signature par la Direction Générale.',
          'Téléchargement de l\'ordre de mission officiel au format PDF signé pour prise en charge financière.'
        ]
      },
      {
        title: '4.3 Avances sur Salaire & Prêts au Personnel',
        points: [
          'Demande de prêt ou d\'avance : Choix du type de prêt (avance sur salaire remboursable le mois suivant, prêt scolaire, prêt équipement sur 12 à 36 mois).',
          'Simulation de l\'échéancier : Visualisation immédiate du montant de la mensualité et vérification du respect de la quotité cessible (maximum 33% du salaire net).',
          'Prévalidation DRH et approbation Direction Générale : Après validation, le plan d\'amortissement est automatiquement injecté dans les précomptes de la paie mensuelle.'
        ]
      },
      {
        title: '4.4 Prises en Charge Médicales & Mutuelle',
        points: [
          'Émission d\'un bon de prise en charge pour consultation, pharmacie, analyses de laboratoire ou hospitalisation.',
          'Sélection du bénéficiaire : Collaborateur lui-même, conjoint déclaré ou enfant à charge inscrit.',
          'Transmission au prestataire conventionné : Le prestataire applique le tiers payant et retourne la facture pour régularisation comptable.'
        ]
      }
    ],
    workflow: [
      'Dépôt de la demande en ligne -> Notification au responsable hiérarchique -> Approbation N+1 -> Validation DRH -> Intégration automatique en paie / comptabilité'
    ],
    tips: 'Chaque collaborateur peut suivre en temps réel le statut d\'avancement de ses demandes (En attente, Approuvé, Rejeté) depuis son tableau de bord personnel.'
  },
  {
    id: 'ch5-administration',
    number: '05',
    title: 'Chapitre 5 : Module Administration & Gestion Administrative du Personnel',
    category: 'Ressources Humaines',
    summary: 'Gestion du référentiel organisationnel, des fiches collaborateurs 360°, des mouvements et des carrières.',
    subsections: [
      {
        title: '5.1 Paramétrage des Référentiels Métier & Organisationnels',
        points: [
          'Entités & Organigramme : Définition de la structure hiérarchique : Directions, Départements, Services et Agences de la Banque.',
          'Référentiel des Emplois & Postes budgétés : Création des intitulés de postes, missions rattachées, compétences requises et profil de poste.',
          'Types de Contrat : CDI, CDD, Stage conventionné, Contrat d\'intérim avec règles d\'échéance et de préavis.',
          'Types d\'Absence & Congés : Nomenclature légale selon le Code du Travail burkinabè et la Convention Collective des Banques et Établissements Financiers.'
        ]
      },
      {
        title: '5.2 Fiche Collaborateur 360° (Dossier Employé)',
        points: [
          'État civil & Immatriculation : Nom, prénom, matricule bancaire unique, date et lieu de naissance, NIP/CNIB, numéro de sécurité sociale CNSS.',
          'Situation matrimoniale & Charges familiales : Déclaration du conjoint et des enfants à charge (impact direct sur le calcul de l\'abattement fiscal IUTS).',
          'Affectation professionnelle : Rattachement organisationnel (Direction / Service / Agence), Emploi occupé et Supérieur hiérarchique direct.',
          'Classification salariale : Rattachement au Groupe Salarial (Groupe I, Groupe II, Groupe III), Catégorie (1 à 7 ou I à VIII) et Échelon (1 à 15). Le salaire de base indiciaire est automatiquement déduit de la grille officielle.',
          'Coordonnées bancaires de virement : Banque domiciliataire, agence, numéro de compte et clé RIB pour le virement mensuel automatisé.',
          'GED & Pièces jointes : Archivage numérique du contrat de travail signé, CV, diplômes certifiés, attestations de visite médicale.'
        ]
      },
      {
        title: '5.3 Mouvements du Personnel & Suivi des Départs',
        points: [
          'Affectation & Mutation : Enregistrement des mutations d\'agences ou de départements avec date d\'effet et conservation de l\'historique.',
          'Nominations & Intérims : Attribution d\'une fonction supérieure avec calcul automatique de l\'indemnité de responsabilité ou d\'intérim.',
          'Cessation de service : Enregistrement des départs (démission, fin de contrat, licenciement, retraite, décès) avec blocage automatique de l\'employé pour les sessions de paie ultérieures et génération du solde de tout compte.'
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
  {
    id: 'ch6-carrieres',
    number: '06',
    title: 'Chapitre 6 : Module Carrières, Évaluations & Promotions',
    category: 'Gestion des Talents',
    summary: 'Gestion des campagnes de notation, propositions d\'avancement d\'échelon, reclassements et promotions.',
    subsections: [
      {
        title: '6.1 Campagnes Annuelles d\'Évaluation & Notation',
        points: [
          'Ouverture de la campagne de notation par la DRH pour l\'exercice de référence.',
          'Fiche d\'évaluation de la performance : Évaluation des objectifs quantitatifs, des compétences techniques et du savoir-être par le supérieur hiérarchique direct.',
          'Calcul de la note globale sur 20 ou sur 100 et enregistrement de l\'appréciation générale.'
        ]
      },
      {
        title: '6.2 Propositions d\'Avancements d\'Échelon & Promotions',
        points: [
          'Avancement à l\'ancienneté : Le système identifie automatiquement les agents ayant atteint la durée d\'ancienneté requise dans leur échelon (ex : 2 ans selon la cadence conventionnelle BPBF) et génère la liste des propositions d\'avancement (échelon n vers n+1).',
          'Avancement au mérite / choix : Promotion accélérée accordée aux agents ayant obtenu des notes d\'évaluation supérieures au seuil défini par la direction.',
          'Arbitrage & Validation : La commission paritaire ou la Direction Générale examine et valide les avancements. Dès validation, la grille salariale de chaque employé est actualisée pour la prochaine session de paie.'
        ]
      },
      {
        title: '6.3 Reclassements Professionnels',
        points: [
          'Reclassement suite à obtention d\'un nouveau diplôme homologué ou succès à un test interne de promotion.',
          'Bascule vers une nouvelle catégorie professionnelle ou un nouveau Groupe salarial avec maintien ou revalorisation du salaire brut.'
        ]
      }
    ],
    workflow: [
      'Lancement campagne d\'évaluation -> Saisie des notes hiérarchiques -> Génération des propositions d\'avancement -> Arbitrage DRH / DG -> Mise à jour automatique de la rémunération'
    ],
    tips: 'Tout avancement validé met à jour instantanément la rémunération indiciaire de base sans nécessiter de ressaisie manuelle.'
  },
  {
    id: 'ch7-formation',
    number: '07',
    title: 'Chapitre 7 : Module Formation & Développement des Compétences',
    category: 'Développement RH',
    summary: 'Plan de formation pluriannuel, gestion des sessions, suivi des prestataires et engagements budgétaires.',
    subsections: [
      {
        title: '7.1 Paramétrage & Thèmes de Formation',
        points: [
          'Catalogue des thèmes de formation : Risque de crédit, conformité bancaire AML/CFT, service client, gestion de trésorerie, sécurité informatique.',
          'Référentiel des prestataires & organismes formateurs agréés, avec taux de satisfaction et historique des interventions.',
          'Définition du budget prévisionnel annuel de formation par direction et par département.'
        ]
      },
      {
        title: '7.2 Gestion des Sessions de Formation',
        points: [
          'Création d\'une session : Titre, objectifs pédagogiques, formateur/cabinet, dates, lieu et coût total.',
          'Sélection et convocation des participants : Inscription des collaborateurs en tenant compte des besoins identifiés lors des entretiens annuels.',
          'Évaluation à chaud & à froid : Recueil des appréciations des participants et mesure de l\'impact opérationnel sur le poste de travail.',
          'Clôture de la session : Enregistrement de l\'attestation de formation dans le dossier individuel de l\'employé et imputation sur le budget consommé.'
        ]
      }
    ],
    workflow: [
      'Recensement des besoins -> Élaboration du plan annuel de formation -> Approbation budgétaire -> Déroulement des sessions -> Évaluation et clôture'
    ],
    tips: 'Le suivi rigoureux du budget de formation permet de maximiser le retour sur investissement des compétences clés de la Banque.'
  },
  {
    id: 'ch8-social',
    number: '08',
    title: 'Chapitre 8 : Module Social, Santé & Œuvres Sociales',
    category: 'Protection Sociale',
    summary: 'Gestion des prestations sociales, des conventions médicales, de la mutuelle du personnel et des secours.',
    subsections: [
      {
        title: '8.1 Prestataires de Santé & Réseau Conventionné',
        points: [
          'Enregistrement des cliniques, hôpitaux, centres de radiologie, laboratoires d\'analyses et pharmacies agréés.',
          'Plafonds de prise en charge : Définition des taux de couverture (ex : 80% pris en charge par l\'assurance/mutuelle BPBF, 20% ticket modérateur employé).'
        ]
      },
      {
        title: '8.2 Traitement des Factures & Rapprochement Mensuel',
        points: [
          'Réception et contrôle des bordereaux de facturation des prestataires médicaux.',
          'Rapprochement automatisé avec les bons de prise en charge émis par l\'application.',
          'Génération de l\'état d\'ordonnancement pour paiement bancaire des prestataires et imputation éventuelle de la quote-part collaborateur en paie.'
        ]
      }
    ],
    workflow: [
      'Émission du bon de prise en charge -> Prestation médicale -> Facturation prestataire -> Rapprochement & Ordonnancement comptable'
    ],
    tips: 'Le module social protège les collaborateurs et leurs familles tout en assurant une maîtrise stricte des coûts de santé pour la Banque.'
  },
  {
    id: 'ch9-motivation',
    number: '09',
    title: 'Chapitre 9 : Module Motivation, Classifications & Grilles Salariales',
    category: 'Politique Rémunération',
    summary: 'Structure de la classification BPBF, grille des salaires indiciaires (15 échelons), primes et indemnités obligatoires.',
    subsections: [
      {
        title: '9.1 Classification Conventionnelle de la BPBF',
        points: [
          'Groupes Salariaux : La structure salariale est organisée en trois grands groupes : Groupe I (Personnel d\'exécution), Groupe II (Personnel de maîtrise) et Groupe III (Cadres et Cadres de Direction).',
          'Catégories Professionnelles : Les catégories du Groupe I sont notées en chiffres arabes (Catégories 1 à 7). Les catégories des Groupes II et III sont notées en chiffres romains (Catégories I à VIII).',
          'Échelons de Progression : Chaque catégorie comporte 15 échelons successifs (Échelon 1 à 15), traduisant l\'ancienneté et l\'expérience acquise.'
        ]
      },
      {
        title: '9.2 Grille des Salaires de Base Indiciaires',
        points: [
          'La grille officielle associe à chaque combinaison [Groupe x Catégorie x Échelon] le montant exact en Francs CFA du salaire de base indiciaire.',
          'Toute revalorisation indiciaire globale s\'effectue au niveau de la grille salariale et se répercute automatiquement sur l\'ensemble des fiches employés associées.'
        ]
      },
      {
        title: '9.3 Grilles Indemnitaires & Primes Spécifiques',
        points: [
          'Indemnité de Logement : Taux ou montant forfaitaire défini selon le statut et le groupe de l\'employé.',
          'Indemnité de Transport : Prise en charge des déplacements domicile-travail selon le barème officiel.',
          'Prime de Sujétion / Responsabilité : Attribuée aux chefs d\'agence, chefs de département et directeurs pour compenser les contraintes managériales.',
          'Prime de Caisse : Allouée aux caissiers et gestionnaires de fonds pour couvrir le risque de maniement d\'espèces.',
          'Frais de Mission & Perdiems : Barème quotidien des indemnités de déplacement selon la zone géographique (National / International).'
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
  {
    id: 'ch10-paie',
    number: '10',
    title: 'Chapitre 10 : Module Paie & Traitements Mensuels (Cycle Intégral de A à Z)',
    category: 'Moteur de Paie',
    summary: 'Procédure exhaustive de traitement de la paie mensuelle : variables, calcul brut/net, contrôles, 12 états de synthèse et clôture.',
    subsections: [
      {
        title: '10.1 Paramétrage des Règles & Éléments de Rémunération',
        points: [
          'Éléments de Gain (Rubriques de rémunération) : Salaire de base, sursalaire, primes obligatoires (logement, transport, sujétion), primes variables (heures supplémentaires, gratification, prime de bilan). Chaque élément est typé : Imposable ou Exonéré, Soumis à cotisation ou Non soumis.',
          'Cotisations Sociales Légales : Définition des taux CNSS en vigueur au Burkina Faso : 5.5% part salariale (plafonnée à 600 000 FCFA/mois) et 16% part patronale (8% vieillesse/invalidité, 2.5% accidents du travail, 5.5% prestations familiales).',
          'Réglementation Fiscale IUTS 2024 : Application intégrale du nouveau barème progressif par tranches sur la base imposable nette après abattement pour charges de famille (conjoint et enfants déclarés).',
          'Autres Retenues Légales & Conventionnelles : FSP (Fonds de Soutien Patriotique 1%), Mutuelle de santé BPBF, Précomptes sur prêts bancaires et saisies-arrêts sur salaire.'
        ]
      },
      {
        title: '10.2 Déroulement Étape par Étape du Cycle Mensuel de Paie',
        points: [
          'Étape 1 : Ouverture de la Session de Paie : Sélection du mois et de l\'exercice comptable (ex : Septembre 2026). La session s\'ouvre à l\'état « En cours ».',
          'Étape 2 : Activation des Employés Éligibles : Vérification de la liste des collaborateurs actifs. Le système exclut automatiquement les agents en départ ou en disponibilité non rémunérée.',
          'Étape 3 : Saisie des Éléments Variables du Mois : Enregistrement des heures supplémentaires, primes exceptionnelles, rappels de salaire, retenues sur absences injustifiées et acomptes demandés.',
          'Étape 4 : Intégration Automatique des Prêts : Les mensualités des prêts en cours sont automatiquement injectées dans les précomptes.',
          'Étape 5 : Lancement du Calcul Automatique : Le moteur de paie traite l\'ensemble des fiches en quelques secondes : calcul du Brut Global, déduction des cotisations CNSS, calcul de l\'assiette IUTS, application du barème fiscal, déduction des précomptes, calcul du Net à Payer.',
          'Étape 6 : Contrôle de Paie & Mode Comparatif (M-1 vs M) : Comparaison ligne par ligne de la masse salariale du mois en cours avec le mois précédent pour détecter tout écart anormal avant validation.',
          'Étape 7 : Validation Hiérarchique de la Paie : Validation par le Gestionnaire de Paie puis par le Directeur des Ressources Humaines.',
          'Étape 8 : Édition des Bulletins de Salaire : Génération des bulletins individuels conformes avec QR code de vérification et mention des mentions légales obligatoires.'
        ]
      },
      {
        title: '10.3 Génération des 12 États de Synthèse Officiels',
        points: [
          '1. Livre de Paie Global : Synthèse complète de toutes les rubriques de gain et retenues par collaborateur.',
          '2. État Nominatif des Salaires : Liste détaillée des nets à payer pour archivage officiel.',
          '3. État des Salaires par Direction : Ventilation analytique de la masse salariale par structure.',
          '4. Bordereau de Virement Bancaire : Fichier récapitulatif par banque avec IBAN/RIB pour exécution des virements.',
          '5. Déclaration CNSS (Bordereau Nominatif) : Récapitulatif des cotisations 5.5% et 16% pour la sécurité sociale.',
          '6. Déclaration Fiscale IUTS : État des retenues à la source à verser à la Direction Générale des Impôts (DGI).',
          '7. État des Précomptes & Retenues : Liste des prélèvements sur prêts et dettes diverses.',
          '8. État FSP (Fonds de Soutien Patriotique) : Déclaration légale de la retenue patriotique de 1%.',
          '9. État de la Mutuelle Santé : Récapitulatif des cotisations d\'assurance santé.',
          '10. État des Éléments de Salaire : Détail montant par montant de chaque prime versée.',
          '11. État par Type d\'Employé : Analyse comparative Cadres, Maîtrise, Exécution.',
          '12. État de Contrôle des Bulletins : Fiche d\'audit exhaustif des anomalies éventuelles.'
        ]
      },
      {
        title: '10.4 Export Comptable & Clôture Définitive',
        points: [
          'Génération des écritures comptables : Imputation sur les comptes de classe 6 (charges de personnel) et classe 4 (tiers CNSS, impôts, banques) selon le plan comptable bancaire.',
          'Clôture Définitive de la Session : Une fois la paie validée et payée, la session est verrouillée de façon irréversible dans PostgreSQL pour interdire toute altération ultérieure.'
        ]
      }
    ],
    workflow: [
      'Ouverture session -> Activation des agents -> Saisie variables -> Moteur de calcul -> Contrôle M-1 vs M -> Validation DRH -> Bulletins -> 12 États de synthèse -> Export comptable -> Clôture définitive'
    ],
    tips: 'La clôture de la paie est une opération irréversible qui garantit l\'intégrité légale et comptable des exercices financiers.'
  },
  {
    id: 'ch11-options-securite',
    number: '11',
    title: 'Chapitre 11 : Module Profils, Sécurité, Options Système & Sauvegardes',
    category: 'Administration Système',
    summary: 'Administration des comptes utilisateurs, matrice des habilitations, clôture annuelle et sauvegardes de données.',
    subsections: [
      {
        title: '11.1 Sécurité, Profils Utilisateurs & Matrice des Habilitations',
        points: [
          'Gestion des Rôles Applicatifs : ADMIN (Super-administrateur), DRH (Direction des Ressources Humaines), GESTIONNAIRE_PAIE, GESTIONNAIRE_GRH, VALIDATEUR, CONSULTANT (Lecture seule).',
          'Matrice granulaire des Droits : Définition des permissions par écran : Lecture (Afficher), Création (Ajouter), Modification (Éditer), Suppression, Validation métier, Clôture.',
          'Authentification renforcée et traçabilité de toutes les connexions et tentatives infructueuses.'
        ]
      },
      {
        title: '11.2 Clôture Annuelle & Gestion de l\'Exercice',
        points: [
          'Ouverture de l\'exercice budgétaire suivant (N+1).',
          'Report automatique des congés acquis non consommés selon les règles conventionnelles en vigueur.',
          'Arrêté des comptes de paie et archivage légal des 12 mois écoulés.'
        ]
      },
      {
        title: '11.3 Sauvegardes & Intégrité de la Base PostgreSQL',
        points: [
          'Sauvegardes automatiques quotidiennes de la base de données PostgreSQL 15.',
          'Possibilité de déclencher un export manuel complet au format SQL sécurisé avant toute opération sensible.',
          'Procédures de restauration testées garantissant un RPO (Recovery Point Objective) inférieur à 24h et un RTO (Recovery Time Objective) de moins de 2h.'
        ]
      }
    ],
    workflow: [
      'Création profil -> Matrice des droits -> Attribution utilisateur -> Surveillance des logs -> Sauvegarde quotidienne'
    ],
    tips: 'Toujours effectuer un export de sauvegarde avant le lancement des opérations de clôture annuelle.'
  }
];
