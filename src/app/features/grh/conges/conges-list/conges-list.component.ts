import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleNavService } from '../../../../core/services/module-nav.service';
import { APP_MODULES } from '../../../../core/models/app-module.model';
import { CongeService, Conge, SoldeConge, JourFerie, ParametrageConge } from '../services/conge.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-conges-list',
  templateUrl: './conges-list.component.html',
  styleUrls: ['./conges-list.component.scss'],
  standalone: false
})
export class CongesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('viewDialogTpl') viewDialogTpl!: TemplateRef<any>;
  @ViewChild('rejectDialogTpl') rejectDialogTpl!: TemplateRef<any>;
  @ViewChild('ferieDialogTpl') ferieDialogTpl!: TemplateRef<any>;

  module = APP_MODULES.find(m => m.id === 'conges') || APP_MODULES.find(m => m.id === 'grh')!;
  activeTab: 'DEMANDES' | 'SOLDES' | 'PLANNING' | 'JOURS_FERIES' | 'PARAMETRAGE' = 'DEMANDES';

  // --- PARAMÉTRAGE RÈGLES DE CONGÉS ---
  configModel: ParametrageConge = {
    droitAnnuelDefaut: 30,
    joursAcquisParMois: 2.5,
    modeDecompte: 'OUVRABLE_5J',
    deduireJoursFeries: true,
    plafondReportJours: 15,
    bloquerSiSoldeInsuffisant: false
  };
  savingConfig = false;

  // --- JOURS FÉRIÉS ---
  joursFeries: JourFerie[] = [];
  joursFeriesDataSource = new MatTableDataSource<JourFerie>([]);
  joursFeriesColumns = ['date', 'libelle', 'type', 'chomePaye', 'description', 'actions'];
  ferieYear = new Date().getFullYear();
  editingFerie: JourFerie | null = null;
  ferieFormModel: JourFerie = { libelle: '', date: '', type: 'FIXE', chomePaye: true, description: '' };

  // --- DEMANDES ---
  displayedColumns = ['employe', 'type', 'periode', 'nbJours', 'dateDemande', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Conge>([]);
  conges: Conge[] = [];
  filteredConges: Conge[] = [];
  selectedConge?: Conge;
  searchQuery = '';
  statutFilter = 'TOUS';
  typeFilter = 'TOUS';
  typesDisponibles: string[] = [];

  // --- SOLDES ---
  soldes: SoldeConge[] = [];
  filteredSoldes: SoldeConge[] = [];
  soldesSearchQuery = '';
  soldesDisplayedColumns = ['employe', 'departement', 'droitAnnuel', 'joursAcquis', 'joursPris', 'joursEnAttente', 'soldeRestant', 'dernierConge'];
  soldesDataSource = new MatTableDataSource<SoldeConge>([]);

  // --- PLANNING ---
  moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  planningYear = new Date().getFullYear();
  planningMonth = new Date().getMonth(); // 0-11
  planningConges: Array<{ conge: Conge; empNom: string; type: string; startDay: number; endDay: number; duration: number }> = [];

  // --- REJET MODAL ---
  congeToReject?: Conge;
  motifRefusSaisi = '';
  isProcessing = false;

  constructor(
    private router: Router,
    private moduleNav: ModuleNavService,
    private congeService: CongeService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.moduleNav.selectModule(this.module);
    this.syncTabWithUrl(this.router.url);
    this.loadConges();
    this.loadSoldes();
    this.loadJoursFeries();
    this.loadParametrage();

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((e: any) => {
      this.syncTabWithUrl(e.urlAfterRedirects || e.url);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  syncTabWithUrl(url: string): void {
    if (!url) return;
    if (url.includes('/conges/soldes')) {
      this.activeTab = 'SOLDES';
    } else if (url.includes('/conges/planning')) {
      this.activeTab = 'PLANNING';
    } else if (url.includes('/conges/feries')) {
      this.activeTab = 'JOURS_FERIES';
    } else if (url.includes('/conges/parametrage')) {
      this.activeTab = 'PARAMETRAGE';
    } else if (url.endsWith('/conges') || url.includes('/conges?')) {
      this.activeTab = 'DEMANDES';
    }
  }

  setTab(tab: 'DEMANDES' | 'SOLDES' | 'PLANNING' | 'JOURS_FERIES' | 'PARAMETRAGE'): void {
    this.activeTab = tab;
    let target = '/grh/conges';
    if (tab === 'SOLDES') target = '/grh/conges/soldes';
    else if (tab === 'PLANNING') target = '/grh/conges/planning';
    else if (tab === 'JOURS_FERIES') target = '/grh/conges/feries';
    else if (tab === 'PARAMETRAGE') target = '/grh/conges/parametrage';

    if (this.router.url !== target) {
      this.router.navigateByUrl(target);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadConges(): void {
    this.congeService.getAll().subscribe({
      next: (list) => {
        this.conges = (list || []).map(c => this.normalizeConge(c));
        this.extractTypes();
        this.applyFilter();
        this.updatePlanningData();
      },
      error: (err) => {
        console.error('Erreur chargement congés:', err);
        this.conges = [];
        this.applyFilter();
      }
    });
  }

  loadSoldes(): void {
    this.congeService.getAllSoldes().subscribe({
      next: (data) => {
        this.soldes = data || [];
        this.soldesDataSource.data = this.soldes;
        this.filteredSoldes = this.soldes;
      },
      error: (err) => {
        console.error('Erreur chargement soldes:', err);
        this.soldes = [];
      }
    });
  }

  private normalizeConge(c: any): Conge {
    let empName = c.employe;
    if (!empName && c.employee) {
      empName = ((c.employee.prenom || '') + ' ' + (c.employee.nom || '')).trim();
      if (!empName && c.employee.name) empName = c.employee.name;
    }
    if (!empName) empName = 'Agent non spécifié';

    let typeStr = c.type;
    if (!typeStr && c.typeAbsenceConge) {
      typeStr = c.typeAbsenceConge.name || c.typeAbsenceConge.code;
    }
    if (!typeStr) typeStr = 'Congé annuel payé';

    let st = c.statut || 'EN_ATTENTE';
    if (st === 'En attente') st = 'EN_ATTENTE';
    if (st === 'Approuvé' || st === 'Validé') st = 'APPROUVE';
    if (st === 'Refusé') st = 'REJETE';

    return {
      ...c,
      employe: empName,
      type: typeStr,
      statut: st,
      dateDemande: c.dateDemande || c.dateDebut
    };
  }

  private extractTypes(): void {
    const set = new Set<string>();
    this.conges.forEach(c => {
      if (c.type) set.add(c.type);
    });
    this.typesDisponibles = Array.from(set);
  }

  applyFilter(): void {
    let res = [...this.conges];

    if (this.statutFilter !== 'TOUS') {
      res = res.filter(c => c.statut === this.statutFilter);
    }

    if (this.typeFilter !== 'TOUS') {
      res = res.filter(c => c.type === this.typeFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      res = res.filter(c =>
        (c.employe && c.employe.toLowerCase().includes(q)) ||
        (c.type && c.type.toLowerCase().includes(q)) ||
        (c.motif && c.motif.toLowerCase().includes(q)) ||
        (c.statut && c.statut.toLowerCase().includes(q))
      );
    }

    this.filteredConges = res;
    this.dataSource.data = res;
  }

  applySoldesFilter(): void {
    let res = [...this.soldes];
    if (this.soldesSearchQuery.trim()) {
      const q = this.soldesSearchQuery.toLowerCase().trim();
      res = res.filter(s =>
        (s.nomComplet && s.nomComplet.toLowerCase().includes(q)) ||
        (s.matricule && s.matricule.toLowerCase().includes(q)) ||
        (s.departement && s.departement.toLowerCase().includes(q)) ||
        (s.poste && s.poste.toLowerCase().includes(q))
      );
    }
    this.filteredSoldes = res;
    this.soldesDataSource.data = res;
  }

  // --- ACTIONS WORKFLOW ---
  approuver(conge: Conge): void {
    if (!conge.id) return;
    if (!confirm(`Approuver la demande de ${conge.nbJours} jour(s) de congé pour ${conge.employe} ?`)) return;

    this.isProcessing = true;
    const currentUserNom = this.authService.currentUser ? 
      `${this.authService.currentUser.prenom} ${this.authService.currentUser.nom}` : 'DRH';

    this.congeService.approuver(conge.id, currentUserNom).subscribe({
      next: (updated) => {
        this.isProcessing = false;
        conge.statut = 'APPROUVE';
        conge.validePar = currentUserNom;
        conge.dateValidation = new Date().toISOString().split('T')[0];
        this.loadConges();
        this.loadSoldes();
      },
      error: (err) => {
        this.isProcessing = false;
        alert('Erreur lors de l’approbation : ' + (err?.error?.message || err.message));
      }
    });
  }

  ouvrirModalRejet(conge: Conge): void {
    this.congeToReject = conge;
    this.motifRefusSaisi = '';
    this.dialog.open(this.rejectDialogTpl, { width: '480px' });
  }

  confirmerRejet(): void {
    if (!this.congeToReject || !this.congeToReject.id) return;
    if (!this.motifRefusSaisi.trim()) {
      alert('Veuillez préciser le motif du refus.');
      return;
    }

    this.isProcessing = true;
    const currentUserNom = this.authService.currentUser ? 
      `${this.authService.currentUser.prenom} ${this.authService.currentUser.nom}` : 'DRH';

    this.congeService.rejeter(this.congeToReject.id, this.motifRefusSaisi.trim(), currentUserNom).subscribe({
      next: () => {
        this.isProcessing = false;
        this.dialog.closeAll();
        this.loadConges();
        this.loadSoldes();
      },
      error: (err) => {
        this.isProcessing = false;
        alert('Erreur lors du rejet : ' + (err?.error?.message || err.message));
      }
    });
  }

  annulerDemande(conge: Conge): void {
    if (!conge.id) return;
    if (!confirm(`Annuler définitivement cette demande de congé ?`)) return;

    this.isProcessing = true;
    this.congeService.annuler(conge.id).subscribe({
      next: () => {
        this.isProcessing = false;
        this.loadConges();
        this.loadSoldes();
      },
      error: (err) => {
        this.isProcessing = false;
        alert('Erreur : ' + (err?.error?.message || err.message));
      }
    });
  }

  imprimerAttestation(conge: Conge): void {
    window.print();
  }

  nouveauConge(): void {
    this.router.navigate(['/grh/conges/nouveau']);
  }

  voirConge(conge: Conge): void {
    this.selectedConge = conge;
    this.dialog.open(this.viewDialogTpl, { width: '600px' });
  }

  // --- PLANNING NAVIGATION ---
  changerMoisPlanning(delta: number): void {
    let newM = this.planningMonth + delta;
    if (newM < 0) {
      newM = 11;
      this.planningYear--;
    } else if (newM > 11) {
      newM = 0;
      this.planningYear++;
    }
    this.planningMonth = newM;
    this.updatePlanningData();
  }

  get planningPeriodLabel(): string {
    return `${this.moisNoms[this.planningMonth]} ${this.planningYear}`;
  }

  get daysInPlanningMonth(): number[] {
    const daysCount = new Date(this.planningYear, this.planningMonth + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }

  private updatePlanningData(): void {
    const list: typeof this.planningConges = [];
    const curYear = this.planningYear;
    const curMonth = this.planningMonth; // 0-indexed

    this.conges.forEach(c => {
      if (!c.dateDebut || !c.dateFin) return;
      if (c.statut === 'REJETE' || c.statut === 'ANNULE') return;

      try {
        const dStart = new Date(c.dateDebut);
        const dEnd = new Date(c.dateFin);

        // Check if overlaps with current planning month
        const monthStart = new Date(curYear, curMonth, 1);
        const monthEnd = new Date(curYear, curMonth + 1, 0);

        if (dEnd >= monthStart && dStart <= monthEnd) {
          const sDay = dStart.getMonth() === curMonth && dStart.getFullYear() === curYear ? dStart.getDate() : 1;
          const eDay = dEnd.getMonth() === curMonth && dEnd.getFullYear() === curYear ? dEnd.getDate() : monthEnd.getDate();

          list.push({
            conge: c,
            empNom: c.employe || 'Agent',
            type: c.type || 'Congé',
            startDay: sDay,
            endDay: eDay,
            duration: eDay - sDay + 1
          });
        }
      } catch (e) {}
    });

    this.planningConges = list;
  }

  isAgentOnLeaveOnDay(item: typeof this.planningConges[0], day: number): boolean {
    return day >= item.startDay && day <= item.endDay;
  }

  // --- STATS KPI ---
  get totalEnAttente(): number {
    return this.conges.filter(c => c.statut === 'EN_ATTENTE' || c.statut === 'En attente').length;
  }

  get totalEnCongeCeMois(): number {
    return this.planningConges.filter(p => p.conge.statut === 'APPROUVE').length;
  }

  get totalJoursPrisAnnee(): number {
    return this.conges
      .filter(c => c.statut === 'APPROUVE')
      .reduce((sum, c) => sum + (c.nbJours || 0), 0);
  }

  get tauxPresencePrevisionnel(): number {
    if (this.soldes.length === 0) return 100;
    const absents = this.totalEnCongeCeMois;
    const pct = Math.max(0, 100 - (absents / this.soldes.length) * 100);
    return Math.round(pct * 10) / 10;
  }

  statutStyle(statut: string): { background: string; color: string; icon: string; label: string } {
    switch (statut) {
      case 'APPROUVE':
      case 'Approuvé':
      case 'VALIDE':
        return { background: '#ecfdf5', color: '#047857', icon: 'check_circle', label: 'Approuvé' };
      case 'EN_ATTENTE':
      case 'En attente':
      case 'SOUMIS':
        return { background: '#fffbeb', color: '#b45309', icon: 'hourglass_empty', label: 'En attente' };
      case 'REJETE':
      case 'Refusé':
        return { background: '#fef2f2', color: '#b91c1c', icon: 'cancel', label: 'Rejeté' };
      case 'ANNULE':
        return { background: '#f1f5f9', color: '#64748b', icon: 'block', label: 'Annulé' };
      default:
        return { background: '#f8fafc', color: '#475569', icon: 'info', label: statut };
    }
  }

  soldeBadgeColor(solde: number, droit: number): string {
    if (solde >= 15) return '#059669'; // Green
    if (solde >= 5) return '#d97706';  // Orange
    return '#dc2626'; // Red
  }

  // --- JOURS FÉRIÉS (11.3 des spécifications) ---
  loadJoursFeries(): void {
    this.congeService.getJoursFeries().subscribe({
      next: (list) => {
        this.joursFeries = list || [];
        this.filterJoursFeriesByYear();
      },
      error: () => {
        this.joursFeries = [];
        this.joursFeriesDataSource.data = [];
      }
    });
  }

  filterJoursFeriesByYear(): void {
    const yStr = String(this.ferieYear);
    const filtered = this.joursFeries.filter(jf => jf.date && jf.date.startsWith(yStr));
    this.joursFeriesDataSource.data = filtered.length > 0 ? filtered : this.joursFeries;
  }

  changerAnneeFeries(delta: number): void {
    this.ferieYear += delta;
    this.filterJoursFeriesByYear();
  }

  openAddFerieModal(): void {
    this.editingFerie = null;
    this.ferieFormModel = {
      libelle: '',
      date: `${this.ferieYear}-01-01`,
      type: 'FIXE',
      chomePaye: true,
      description: ''
    };
    this.dialog.open(this.ferieDialogTpl, { width: '500px' });
  }

  openEditFerieModal(jf: JourFerie): void {
    this.editingFerie = jf;
    this.ferieFormModel = { ...jf };
    this.dialog.open(this.ferieDialogTpl, { width: '500px' });
  }

  saveFerie(): void {
    if (!this.ferieFormModel.libelle || !this.ferieFormModel.date) {
      alert('Veuillez renseigner le libellé et la date du jour férié.');
      return;
    }

    if (this.editingFerie && this.editingFerie.id) {
      this.congeService.updateJourFerie(this.editingFerie.id, this.ferieFormModel).subscribe({
        next: () => {
          this.dialog.closeAll();
          this.loadJoursFeries();
        },
        error: () => {
          this.dialog.closeAll();
          this.loadJoursFeries();
        }
      });
    } else {
      this.congeService.createJourFerie(this.ferieFormModel).subscribe({
        next: () => {
          this.dialog.closeAll();
          this.loadJoursFeries();
        },
        error: () => {
          this.dialog.closeAll();
          this.loadJoursFeries();
        }
      });
    }
  }

  deleteFerie(jf: JourFerie): void {
    if (confirm(`Supprimer le jour férié "${jf.libelle}" (${jf.date}) ?`)) {
      if (jf.id) {
        this.congeService.deleteJourFerie(jf.id).subscribe({
          next: () => this.loadJoursFeries(),
          error: () => this.loadJoursFeries()
        });
      }
    }
  }

  // --- GESTION DES RÈGLES & PARAMÈTRES DE CONGÉS ---
  loadParametrage(): void {
    this.congeService.getParametrage().subscribe({
      next: (cfg) => {
        if (cfg) this.configModel = cfg;
      },
      error: (err) => console.error('Erreur chargement paramétrage:', err)
    });
  }

  saveParametrage(): void {
    this.savingConfig = true;
    this.congeService.saveParametrage(this.configModel).subscribe({
      next: (saved) => {
        this.configModel = saved;
        this.savingConfig = false;
        this.snackBar.open('Règles de congés enregistrées avec succès', 'Fermer', { duration: 3000 });
        this.loadSoldes();
      },
      error: () => {
        this.savingConfig = false;
        this.snackBar.open('Erreur lors de l\'enregistrement des règles', 'Fermer', { duration: 3000 });
      }
    });
  }
}
