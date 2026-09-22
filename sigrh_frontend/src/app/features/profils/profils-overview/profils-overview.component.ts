import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardStatsService } from '../../../core/services/dashboard-stats.service';
import { ProfilsDashboardStats } from '../../../core/models/dashboard-stats.model';

@Component({
  selector: 'app-profils-overview',
  templateUrl: './profils-overview.component.html',
  styleUrls: ['./profils-overview.component.scss'],
  standalone: false
})
export class ProfilsOverviewComponent implements OnInit {
  stats: ProfilsDashboardStats | null = null;
  isLoading = true;
  hasError = false;

  sections = [
    {
      title: 'Profils & Rôles',
      icon: 'badge',
      color: '#0060B3',
      route: '/profils/roles',
      description: 'Définition et paramétrage des profils utilisateurs (ADMIN, DRH, Gestionnaire Paie, Validateur, Consultant).',
      badge: 'Profils configurés'
    },
    {
      title: 'Matrice des Habilitations',
      icon: 'rule',
      color: '#0060B3',
      route: '/profils/habilitations',
      description: 'Gestion fine des accès aux menus et des actions autorisées (Consulter, Créer, Modifier, Supprimer, Valider Paie, Clôturer).',
      badge: 'Droits gérés'
    },
    {
      title: 'Gestion des Utilisateurs',
      icon: 'manage_accounts',
      color: '#0060B3',
      route: '/profils/utilisateurs',
      description: 'Création des comptes utilisateurs, réinitialisation de mot de passe, affectation des rôles et contrôle des statuts.',
      badge: 'Comptes actifs'
    },
    {
      title: "Manuel d'Utilisation & Guides",
      icon: 'auto_stories',
      color: '#0060B3',
      route: '/profils/manuel',
      description: 'Documentation complète, guides pas à pas par module, diagrammes de procédures et fiches téléchargeables.',
      badge: 'Guides complets'
    }
  ];

  constructor(
    private router: Router,
    private statsService: DashboardStatsService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.hasError = false;
    this.statsService.getProfilsStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.isLoading = false;
        this.sections[0].badge = `${res.rolesCount} profils configurés`;
        this.sections[1].badge = `${res.permissionsCount} droits gérés`;
        this.sections[2].badge = `${res.activeUsers} comptes actifs`;
        this.sections[3].badge = `${res.manualsCount} guides complets`;
      },
      error: (err) => {
        console.error('Erreur chargement statistiques Profils:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
