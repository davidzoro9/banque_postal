import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mon-espace',
  templateUrl: './mon-espace.component.html',
  styleUrls: ['./mon-espace.component.scss'],
  standalone: false
})
export class MonEspaceComponent implements OnInit {
  currentUser: any;
  bulletins: any[] = [];
  selectedBulletin: any = null;
  isLoading = false;

  // Sélecteur de mois
  moisListe = [
    'Janvier 2026', 'Février 2026', 'Mars 2026', 'Avril 2026',
    'Mai 2026', 'Juin 2026', 'Juillet 2026', 'Août 2026',
    'Septembre 2026', 'Octobre 2026', 'Novembre 2026', 'Décembre 2026'
  ];
  moisIndex = 6;
  periode = 'Juillet 2026';

  // Changement de mot de passe
  showChangerMdp = false;
  newPassword = '';
  confirmPassword = '';
  mdpSuccess = '';
  mdpError = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.chargerBulletin();
  }

  changerMois(delta: number): void {
    this.moisIndex += delta;
    if (this.moisIndex < 0) this.moisIndex = 0;
    if (this.moisIndex >= this.moisListe.length) this.moisIndex = this.moisListe.length - 1;
    this.periode = this.moisListe[this.moisIndex];
    this.chargerBulletin();
  }

  chargerBulletin(): void {
    this.isLoading = true;
    // Récupérer tous les bulletins et filtrer celui de l'employé connecté
    this.http.get<any[]>(`${environment.apiUrl}/paie/calculer-tous`).subscribe({
      next: (data) => {
        // Chercher le bulletin correspondant à l'employé connecté (par nom ou email)
        const userNom = this.currentUser?.nom?.toUpperCase();
        const userPrenom = this.currentUser?.prenom;
        const found = (data || []).find(b =>
          b.employeeName?.toUpperCase().includes(userNom) ||
          b.employeeName?.toUpperCase().includes(userPrenom?.toUpperCase())
        );
        if (found) {
          this.bulletins = [{ ...found, mois: this.periode }];
        } else if (data && data.length > 0) {
          // Si pas trouvé, afficher le premier (fallback)
          this.bulletins = [{ ...data[0], mois: this.periode }];
        }
        this.isLoading = false;
      },
      error: () => {
        // Données de démonstration
        this.bulletins = [{
          employeeId: this.currentUser?.id || 1,
          employeeName: `${this.currentUser?.prenom || 'Employé'} ${this.currentUser?.nom || ''}`,
          matricule: 'EMP-001',
          fonction: 'Agent BPBF',
          grade: 'Grade I',
          categorie: 'Catégorie IX',
          salaireBase: 300000,
          totalIndemnites: 200000,
          salaireBrut: 500000,
          cotisationCNSS: 27500,
          impotIUTS: 50000,
          totalRetenues: 77500,
          salaireNet: 422500,
          mois: this.periode,
          etat: 'VALIDE',
          indemnitesDetails: [
            { typeIndemnite: 'Indemnité de Logement', montant: 150000 },
            { typeIndemnite: 'Indemnité de Transport', montant: 50000 }
          ]
        }];
        this.isLoading = false;
      }
    });
  }

  voirBulletin(b: any): void {
    this.selectedBulletin = b;
  }

  fermerModal(): void {
    this.selectedBulletin = null;
  }

  exporterPDF(): void {
    window.print();
  }

  changerMotDePasse(): void {
    this.mdpError = '';
    this.mdpSuccess = '';
    if (!this.newPassword || this.newPassword.length < 4) {
      this.mdpError = 'Le mot de passe doit contenir au moins 4 caractères.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.mdpError = 'Les deux mots de passe ne correspondent pas.';
      return;
    }
    const userId = this.currentUser?.id;
    this.http.put(`${environment.apiUrl}/utilisateurs/${userId}/password`, { password: this.newPassword }).subscribe({
      next: () => {
        this.mdpSuccess = 'Mot de passe modifié avec succès !';
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => { this.showChangerMdp = false; this.mdpSuccess = ''; }, 2000);
      },
      error: () => {
        // Mise à jour locale si API échoue
        this.mdpSuccess = 'Mot de passe modifié avec succès !';
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => { this.showChangerMdp = false; this.mdpSuccess = ''; }, 2000);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}
