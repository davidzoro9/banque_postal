import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profils-overview',
  templateUrl: './profils-overview.component.html',
  styleUrls: ['./profils-overview.component.scss'],
  standalone: false
})
export class ProfilsOverviewComponent implements OnInit {
  stats = {
    rolesCount: 5,
    usersCount: 12,
    activeUsers: 11,
    modulesCount: 4,
    permissionsCount: 28,
    manualsCount: 6
  };

  sections = [
    {
      title: 'Profils & Rôles',
      icon: 'badge',
      color: '#0060B3',
      route: '/profils/roles',
      description: 'Définition et paramétrage des profils utilisateurs (ADMIN, DRH, Gestionnaire Paie, Validateur, Consultant).',
      badge: '5 profils configurés'
    },
    {
      title: 'Matrice des Habilitations',
      icon: 'rule',
      color: '#0060B3',
      route: '/profils/habilitations',
      description: 'Gestion fine des accès aux menus et des actions autorisées (Consulter, Créer, Modifier, Supprimer, Valider Paie, Clôturer).',
      badge: '28 droits gérés'
    },
    {
      title: 'Gestion des Utilisateurs',
      icon: 'manage_accounts',
      color: '#0060B3',
      route: '/profils/utilisateurs',
      description: 'Création des comptes utilisateurs, réinitialisation de mot de passe, affectation des rôles et contrôle des statuts.',
      badge: '12 comptes actifs'
    },
    {
      title: "Manuel d'Utilisation & Guides",
      icon: 'auto_stories',
      color: '#0060B3',
      route: '/profils/manuel',
      description: 'Documentation complète, guides pas à pas par module, diagrammes de procédures et fiches téléchargeables.',
      badge: '6 guides complets'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
