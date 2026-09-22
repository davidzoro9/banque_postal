import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarrieresService, CarriereAvancement } from '../services/carrieres.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mobilite',
  templateUrl: './mobilite.component.html',
  styleUrls: ['./mobilite.component.scss'],
  standalone: false
})
export class MobiliteComponent implements OnInit {
  avancements$!: Observable<CarriereAvancement[]>;
  allAvancements: CarriereAvancement[] = [];
  filteredAvancements: CarriereAvancement[] = [];

  selectedExercice: number = new Date().getFullYear();
  searchQuery: string = '';
  statutFilter: string = '';

  generating = false;
  processingId: number | null = null;
  messageFeedback: string = '';

  constructor(
    private carrieresService: CarrieresService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.avancements$ = this.carrieresService.avancements$;
    this.loadAvancements();
  }

  loadAvancements(): void {
    this.carrieresService.fetchAvancements(this.selectedExercice).subscribe({
      next: (list) => {
        this.allAvancements = list || [];
        this.applyFilter();
      },
      error: () => {
        this.allAvancements = [];
        this.filteredAvancements = [];
      }
    });
  }

  genererPropositions(): void {
    this.generating = true;
    this.messageFeedback = '';
    this.carrieresService.genererAvancements(this.selectedExercice).subscribe({
      next: (list) => {
        this.generating = false;
        this.allAvancements = list || [];
        this.applyFilter();
        this.messageFeedback = `Propositions d'avancement pour l'exercice ${this.selectedExercice} générées avec succès (${this.allAvancements.length} agents).`;
      },
      error: (err) => {
        this.generating = false;
        this.messageFeedback = 'Erreur lors de la génération des propositions.';
      }
    });
  }

  validerAvancement(id?: number): void {
    if (!id) return;
    this.processingId = id;
    this.carrieresService.validerAvancement(id, 'Commission de Carrière BPBF').subscribe({
      next: () => {
        this.processingId = null;
        this.loadAvancements();
        this.messageFeedback = 'Avancement validé avec succès ! L\'échelon et le salaire de base de l\'agent ont été mis à jour dans PostgreSQL.';
      },
      error: () => {
        this.processingId = null;
        this.messageFeedback = 'Erreur lors de la validation de l\'avancement.';
      }
    });
  }

  rejeterAvancement(id?: number): void {
    if (!id) return;
    const motif = prompt('Veuillez préciser le motif de rejet / ajournement :', 'Avis défavorable de la commission');
    if (!motif) return;

    this.processingId = id;
    this.carrieresService.rejeterAvancement(id, motif).subscribe({
      next: () => {
        this.processingId = null;
        this.loadAvancements();
      },
      error: () => {
        this.processingId = null;
      }
    });
  }

  applyFilter(): void {
    const q = (this.searchQuery || '').trim().toLowerCase();
    this.filteredAvancements = this.allAvancements.filter(a => {
      const matricule = (a.employee?.matricule || '').toLowerCase();
      const nom = (a.employee?.nom || '').toLowerCase();
      const prenom = (a.employee?.prenom || '').toLowerCase();
      const matchText = !q || matricule.includes(q) || nom.includes(q) || prenom.includes(q);
      const matchStatut = !this.statutFilter || a.statut === this.statutFilter;
      return matchText && matchStatut;
    });
  }

  get totalImpactMasseSalariale(): number {
    return this.allAvancements
      .filter(a => a.statut === 'VALIDE' || a.statut === 'PROPOSE')
      .reduce((sum, a) => sum + (a.ecartSalaire || 0), 0);
  }

  get countProposes(): number {
    return this.allAvancements.filter(a => a.statut === 'PROPOSE').length;
  }

  get countValides(): number {
    return this.allAvancements.filter(a => a.statut === 'VALIDE').length;
  }

  goBack(): void {
    this.router.navigate(['/carrieres']);
  }
}
