import { Component, OnInit } from '@angular/core';

export interface GuideSection {
  id: string;
  title: string;
  icon: string;
  summary: string;
  content: string[];
  workflow: string[];
}

@Component({
  selector: 'app-manuel-utilisateur',
  templateUrl: './manuel-utilisateur.component.html',
  styleUrls: ['./manuel-utilisateur.component.scss'],
  standalone: false
})
export class ManuelUtilisateurComponent implements OnInit {
  searchQuery = '';
  selectedTab = 'donnees-base';

  guides: GuideSection[] = [
    {
      id: 'donnees-base',
      title: '1. Données de Base & Paramétrage Général',
      icon: 'storage',
      summary: 'Configuration des catégories (1..7 et I..VIII), des groupes (GROUPE I, II, III), de la grille salariale et des indemnités.',
      content: [
        'Accédez au menu "Données de Base" depuis la barre supérieure ou la barre latérale.',
        'Catégories Professionnelles : Les catégories du Groupe I sont notées par les chiffres 1 à 7. Les catégories des Groupes II et III sont notées par les chiffres romains I à VIII.',
        'Groupes Salariaux : Tous les anciens grades sont renommés en Groupe I, Groupe II et Groupe III.',
        'Grille Salariale : Chaque ligne associe un Groupe, une Catégorie (1..7 / I..VIII) et un Échelon (1 à 15) au montant du salaire de base officiel.',
        'Paramétrage des Indemnités : Définition des taux et montants par poste ou par groupe (Logement, Transport, Sujétion, Représentation).'
      ],
      workflow: [
        'Étape 1 : Créer ou vérifier les Catégories (1..7, I..VIII)',
        'Étape 2 : Vérifier la Grille Salariale (15 échelons par catégorie)',
        'Étape 3 : Configurer les indemnités obligatoires et spécifiques'
      ]
    },
    {
      id: 'grh-employes',
      title: '2. Gestion Administrative & Fiches Employés',
      icon: 'badge',
      summary: 'Création des fiches collaborateurs, affectation organisationnelle, historique de carrière et gestion des contrats.',
      content: [
        'Pour inscrire un nouveau collaborateur, naviguez vers "Gestion Administrative" -> "Employés" et cliquez sur "Nouveau".',
        'Fiche Personnelle : Saisissez l\'état civil, le matricule, l\'adresse et les pièces d\'identité.',
        'Informations professionnelles : Rattaché l\'employé à une Direction, un Département, un Service et un Emploi.',
        'Carrière & Rémunération : Sélectionnez le Groupe (I, II, III), la Catégorie (1..7 ou I..VIII) et l\'Échelon (1..15). Le salaire de base et les indemnités seront automatiquement calculés.',
        'Documents & Contrat : Joignez les contrats numérisés et définissez les dates d\'embauche et d\'essai.'
      ],
      workflow: [
        'Saisie des informations d\'état civil -> Affectation au service -> Sélection Groupe/Catégorie/Échelon -> Validation de la fiche'
      ]
    },
    {
      id: 'paie-bulletins',
      title: '3. Gestion de la Paie & Bulletins de Salaire',
      icon: 'payments',
      summary: 'Cycle de paie mensuel, saisie des variables, calcul brut/net, validation, prévisualisation et clôture.',
      content: [
        'Naviguez vers le module "Gestion de la Paie".',
        'Génération des Bulletins : Cliquez sur "Générer la paie du mois". Le système applique la grille salariale et les indemnités enregistrées.',
        'Calcul Automatique : Calcul automatique du Salaire Brut, des retenues (CNSS, IUTS) et du Net à Payer.',
        'Mode Comparatif (M-1 vs M) : Activez le commutateur comparatif pour faire ressortir les variations de salaire brut/net entre le mois précédent et le mois courant.',
        'Validation & Clôture : Chaque bulletin peut être validé individuellement ou globalement. Une fois validée, la session est fermée avec verrouillage de la modification.'
      ],
      workflow: [
        'Mois N-1 -> Saisie éléments variables -> Génération -> Vérification des écarts M-1/M -> Validation DRH -> Clôture & Impression'
      ]
    },
    {
      id: 'profils-securite',
      title: '4. Sécurité, Profils & Matrice des Habilitations',
      icon: 'admin_panel_settings',
      summary: 'Gestion des rôles utilisateurs, attribution des droits d\'accès et contrôle des privilèges d\'exécution.',
      content: [
        'Profils & Rôles : Consultation et création des rôles applicatifs (ADMIN, DRH, GESTIONNAIRE_PAIE, VALIDATEUR, CONSULTANT).',
        'Matrice des Habilitations : Cochez/décocher les permissions pour accorder ou restreindre les actions (Création, Modification, Suppression, Validation, Clôture).',
        'Comptes Utilisateurs : Gestion des identifiants, réinitialisation de mots de passe et suspension des accès.'
      ],
      workflow: [
        'Création du Rôle -> Ajustement dans la Matrice d\'Habilitations -> Affectation de l\'Utilisateur -> Attribution des identifiants'
      ]
    }
  ];

  filteredGuides: GuideSection[] = [];

  ngOnInit(): void {
    this.filteredGuides = [...this.guides];
  }

  applySearch(): void {
    if (!this.searchQuery) {
      this.filteredGuides = [...this.guides];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredGuides = this.guides.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.summary.toLowerCase().includes(q) ||
      g.content.some(c => c.toLowerCase().includes(q))
    );
  }

  downloadManual(type: string): void {
    alert(`Téléchargement de la documentation [${type}] lancé au format PDF.`);
  }
}
