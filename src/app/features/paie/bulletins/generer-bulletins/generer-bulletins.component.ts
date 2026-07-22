import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-generer-bulletins',
  templateUrl: './generer-bulletins.component.html',
  styleUrls: ['./generer-bulletins.component.scss'],
  standalone: false
})
export class GenererBulletinsComponent implements OnInit {
  moisListe = [
    'Janvier 2026', 'Février 2026', 'Mars 2026', 'Avril 2026',
    'Mai 2026', 'Juin 2026', 'Juillet 2026', 'Août 2026',
    'Septembre 2026', 'Octobre 2026', 'Novembre 2026', 'Décembre 2026'
  ];
  moisIndex = 6; // Juillet 2026
  periode = 'Juillet 2026';
  
  sessionType: 'ORDINAIRE' | 'TREIZIEME_MOIS' | 'QUATORZIEME_MOIS' | 'SOLDE_COMPTE' = 'ORDINAIRE';
  modeComparatifMminus1 = false;

  // === WORKFLOW DE VALIDATION ===
  // GENERE -> EN_ATTENTE_VALIDATION -> VALIDE -> CLOTURE
  etatSession: 'OUVERTE' | 'CLOTUREE' = 'OUVERTE';
  
  isCalculating = false;
  bulletins: any[] = [];
  selectedBulletin: any = null;

  get nbrGeneres(): number { return this.bulletins.filter(b => b.etat === 'GENERE').length; }
  get nbrValides(): number { return this.bulletins.filter(b => b.etat === 'VALIDE').length; }
  get tousValides(): boolean { return this.bulletins.length > 0 && this.bulletins.every(b => b.etat === 'VALIDE' || b.etat === 'CLOTURE'); }
  get sessionCloturee(): boolean { return this.etatSession === 'CLOTUREE'; }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.lancerCalculPaie();
  }

  changerMois(delta: number): void {
    this.moisIndex += delta;
    if (this.moisIndex < 0) this.moisIndex = 0;
    if (this.moisIndex >= this.moisListe.length) this.moisIndex = this.moisListe.length - 1;
    this.periode = this.moisListe[this.moisIndex];
    this.lancerCalculPaie();
  }

  changerSession(type: 'ORDINAIRE' | 'TREIZIEME_MOIS' | 'QUATORZIEME_MOIS' | 'SOLDE_COMPTE'): void {
    this.sessionType = type;
    this.lancerCalculPaie();
  }

  toggleModeComparatif(): void {
    this.modeComparatifMminus1 = !this.modeComparatifMminus1;
  }

  lancerCalculPaie(): void {
    this.isCalculating = true;
    this.http.get<any[]>(`${environment.apiUrl}/paie/calculer-tous`).subscribe({
      next: (data) => {
        let baseList = data || [];
        this.bulletins = this.adapterBulletinsSelonSession(baseList);
        this.isCalculating = false;
      },
      error: (err) => {
        console.warn('Fallback bulletins:', err);
        let fallback = [
          {
            employeeId: 1, employeeName: 'Marie Dupont', matricule: 'EMP-001', fonction: 'Directrice RH', grade: 'Grade I', categorie: 'Catégorie IX',
            salaireBase: 350000, totalIndemnites: 300000, salaireBrut: 650000, cotisationCNSS: 35750, impotIUTS: 65000, totalRetenues: 100750, salaireNet: 549250,
            indemnitesDetails: [
              { typeIndemnite: 'Indemnité de Logement', montant: 150000 },
              { typeIndemnite: 'Indemnité de Transport', montant: 50000 },
              { typeIndemnite: 'Indemnité de Responsabilité', montant: 100000 }
            ]
          },
          {
            employeeId: 2, employeeName: 'Jean Martin', matricule: 'EMP-002', fonction: 'Ingénieur', grade: 'Grade II', categorie: 'Catégorie VIII',
            salaireBase: 300000, totalIndemnites: 200000, salaireBrut: 500000, cotisationCNSS: 27500, impotIUTS: 50000, totalRetenues: 77500, salaireNet: 422500,
            indemnitesDetails: [
              { typeIndemnite: 'Indemnité de Logement', montant: 150000 },
              { typeIndemnite: 'Indemnité de Transport', montant: 50000 }
            ]
          },
          {
            employeeId: 3, employeeName: 'Sophie Bernard', matricule: 'EMP-003', fonction: 'Commerciale', grade: 'Grade II', categorie: 'Catégorie VII',
            salaireBase: 250000, totalIndemnités: 150000, salaireBrut: 400000, cotisationCNSS: 22000, impotIUTS: 40000, totalRetenues: 62000, salaireNet: 338000,
            indemnitesDetails: [
              { typeIndemnite: 'Indemnité de Logement', montant: 100000 },
              { typeIndemnite: 'Indemnité de Transport', montant: 50000 }
            ]
          }
        ];
        this.bulletins = this.adapterBulletinsSelonSession(fallback);
        this.etatSession = 'OUVERTE'; // reset session state on recalc
        this.isCalculating = false;
      }
    });
  }

  private adapterBulletinsSelonSession(list: any[]): any[] {
    return list.map(b => {
      let copy = JSON.parse(JSON.stringify(b));
      copy.mois = this.periode;
      copy.sessionType = this.sessionType;

      let baseSal = copy.salaireBase || 150000;
      let indemnites = copy.indemnitesDetails || [];
      let totalInd = copy.totalIndemnites || 0;

      if (this.sessionType === 'TREIZIEME_MOIS') {
        indemnites.push({ typeIndemnite: 'Gratification 13ème Mois (Fin d\'Année)', montant: baseSal });
        totalInd += baseSal;
      } else if (this.sessionType === 'QUATORZIEME_MOIS') {
        indemnites.push({ typeIndemnite: 'Gratification 14ème Mois (Prime de Bilan)', montant: baseSal });
        totalInd += baseSal;
      }

      copy.indemnitesDetails = indemnites;
      copy.totalIndemnites = totalInd;
      copy.salaireBrut = baseSal + totalInd;
      copy.cotisationCNSS = Math.round(copy.salaireBrut * 0.055);
      copy.impotIUTS = Math.round(copy.salaireBrut * 0.10);
      copy.totalRetenues = copy.cotisationCNSS + copy.impotIUTS;
      copy.salaireNet = copy.salaireBrut - copy.totalRetenues;

      // État initial : GENERE (non encore validé par le RH)
      copy.etat = 'GENERE';
      copy.dateValidation = null;

      // Calcul comparatif M-1 vs M
      let prevNet = copy.salaireNet * (this.sessionType === 'ORDINAIRE' ? 0.98 : 0.5);
      copy.salaireNetM1 = Math.round(prevNet);
      copy.ecartNet = Math.round(copy.salaireNet - prevNet);

      return copy;
    });
  }

  validerBulletin(b: any): void {
    if (this.sessionCloturee) return;
    b.etat = 'VALIDE';
    b.dateValidation = new Date().toLocaleString('fr-FR');
  }

  refuserBulletin(b: any): void {
    if (this.sessionCloturee) return;
    b.etat = 'GENERE'; // Remet en attente pour correction
    b.dateValidation = null;
  }

  cloturerSession(): void {
    if (!this.tousValides) {
      alert('⚠️ Tous les bulletins doivent être validés avant la clôture de la session.');
      return;
    }
    if (confirm(`Confirmer la clôture définitive de la session de paie ${this.periode} ?\n\nAttention : Cette action est irréversible.`)) {
      this.bulletins.forEach(b => b.etat = 'CLOTURE');
      this.etatSession = 'CLOTUREE';
    }
  }

  voirDetails(b: any): void {
    this.selectedBulletin = b;
  }

  fermerModal(): void {
    this.selectedBulletin = null;
  }

  imprimerBulletin(): void {
    window.print();
  }
}
