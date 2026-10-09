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
import { CongeService, Conge, SoldeConge, JourFerie, ParametrageConge, TypeAbsenceConge } from '../services/conge.service';
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
  @ViewChild('interimDialogTpl') interimDialogTpl!: TemplateRef<any>;
  @ViewChild('visaN1DialogTpl') visaN1DialogTpl!: TemplateRef<any>;
  @ViewChild('drhDialogTpl') drhDialogTpl!: TemplateRef<any>;

  workflowTargetConge?: Conge;
  workflowCommentaire = '';
  workflowDirectionQuorum: any = null;
  loadingQuorum = false;

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

  // --- CATALOGUE DES AUTRES CONGÉS & ABSENCES ---
  typesAbsenceList: TypeAbsenceConge[] = [];
  editingTypeAbsence: TypeAbsenceConge | null = null;
  typeAbsenceFormModel: TypeAbsenceConge = { code: '', name: '', categorie: 'CONGE', dureeMaxLegaleJours: 30, deductibleDuSolde: true, sexeRequis: 'TOUS' };
  savingTypeAbsence = false;
  showTypeModal = false;
  selectedSoldeType: string = 'CONGE_ANNUEL';

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
    this.loadTypesAbsence();

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

  // --- VÉRIFICATION DES RÔLES & PERMISSIONS PAR ÉTAPE ---
  get currentUserRole(): string {
    return (this.authService.currentUser?.role || '').toUpperCase();
  }

  get isDrhOrAdmin(): boolean {
    const r = this.currentUserRole;
    return r === 'DRH' || r === 'ADMIN' || r === 'RESPONSABLE_RH';
  }

  get isValidateurOrAbove(): boolean {
    const r = this.currentUserRole;
    return r === 'VALIDATEUR' || this.isDrhOrAdmin || this.authService.hasPermission('CONGE_VALIDATE');
  }

  get isDsiOrAdmin(): boolean {
    const r = this.currentUserRole;
    return r === 'ADMIN' || r === 'DSI' || r === 'IT';
  }

  isInterimaireFor(conge: Conge): boolean {
    const curEmpId = this.authService.currentUser?.id;
    if (!curEmpId) return false;
    return String(conge.interimaire?.id) === String(curEmpId) || this.isDrhOrAdmin;
  }

  get canValidate(): boolean {
    return this.isValidateurOrAbove;
  }

  // ── ÉTAPE 2 : AVIS INTÉRIMAIRE (COLLÈGUE PRESSENTI) ──
  ouvrirModalInterim(conge: Conge): void {
    this.workflowTargetConge = conge;
    this.workflowCommentaire = '';
    this.dialog.open(this.interimDialogTpl, { width: '480px' });
  }

  confirmerAvisInterim(accord: boolean): void {
    if (!this.workflowTargetConge?.id) return;
    this.isProcessing = true;
    const user = this.authService.currentUser;
    const nom = user ? `${user.prenom} ${user.nom}` : 'Collègue intérimaire';

    this.congeService.avisInterim(this.workflowTargetConge.id, accord, this.workflowCommentaire, nom).subscribe({
      next: () => {
        this.isProcessing = false;
        this.dialog.closeAll();
        this.snackBar.open(
          accord ? "Avis intérim favorable enregistré avec succès." : "Intérim décliné. La demande a été rejetée.",
          'Fermer', { duration: 3500 }
        );
        this.loadConges();
      },
      error: (err) => {
        this.isProcessing = false;
        alert("Erreur lors de l'enregistrement de l'avis : " + (err?.error?.message || err.message));
      }
    });
  }

  // ── ÉTAPE 3 : VISA HIÉRARCHIQUE N+1 (DIRECTEUR / CHEF DE PÔLE) ──
  ouvrirModalVisaN1(conge: Conge): void {
    this.workflowTargetConge = conge;
    this.workflowCommentaire = '';
    this.workflowDirectionQuorum = null;
    this.loadingQuorum = true;

    const dirId = conge.employee?.direction?.id || conge.employee?.directionId;
    if (dirId) {
      this.congeService.getQuorumDirection(dirId).subscribe({
        next: (q) => {
          this.workflowDirectionQuorum = q;
          this.loadingQuorum = false;
        },
        error: () => this.loadingQuorum = false
      });
    } else {
      this.loadingQuorum = false;
    }

    this.dialog.open(this.visaN1DialogTpl, { width: '520px' });
  }

  confirmerVisaN1(accord: boolean): void {
    if (!this.workflowTargetConge?.id) return;
    this.isProcessing = true;
    const user = this.authService.currentUser;
    const role = user?.role || 'VALIDATEUR';
    const nom = user ? `${user.prenom} ${user.nom} (${role})` : 'Directeur N+1';

    this.congeService.visaN1(this.workflowTargetConge.id, accord, this.workflowCommentaire, nom).subscribe({
      next: () => {
        this.isProcessing = false;
        this.dialog.closeAll();
        this.snackBar.open(
          accord ? "Visa N+1 favorable accordé. Demande transmise à la DRH." : "Visa N+1 refusé.",
          'Fermer', { duration: 3500 }
        );
        this.loadConges();
      },
      error: (err) => {
        this.isProcessing = false;
        alert("Erreur visa N+1 : " + (err?.error?.message || err.message));
      }
    });
  }

  // ── ÉTAPE 4 : CONTRÔLE ET DÉLIVRANCE TITRE DE CONGÉ DRH ──
  ouvrirModalValidationDrh(conge: Conge): void {
    this.workflowTargetConge = conge;
    this.workflowCommentaire = '';
    this.dialog.open(this.drhDialogTpl, { width: '520px' });
  }

  confirmerValidationDrh(accord: boolean): void {
    if (!this.workflowTargetConge?.id) return;
    this.isProcessing = true;
    const user = this.authService.currentUser;
    const nom = user ? `${user.prenom} ${user.nom} (DRH)` : 'DRH';

    this.congeService.validationDrh(this.workflowTargetConge.id, accord, this.workflowCommentaire, nom).subscribe({
      next: (updated) => {
        this.isProcessing = false;
        this.dialog.closeAll();
        const numTitre = updated.numeroTitreConge || 'délivré';
        this.snackBar.open(
          accord ? `Demande approuvée avec succès ! Titre de congé N° ${numTitre}.` : "Demande rejetée par la DRH.",
          'Fermer', { duration: 4000 }
        );
        this.loadConges();
        this.loadSoldes();
      },
      error: (err) => {
        this.isProcessing = false;
        alert("Erreur validation DRH : " + (err?.error?.message || err.message));
      }
    });
  }

  // ── ÉTAPE 5 : ACTION SÉCURITÉ SI (RÈGLE PRUDENTIELLE BCEAO) ──
  toggleSecuriteSi(conge: Conge): void {
    if (!conge.id) return;
    const newStatut = conge.statutSi === 'ACCES_SUSPENDU' ? 'ACCES_RESTAURE' : 'ACCES_SUSPENDU';
    const actionLabel = newStatut === 'ACCES_SUSPENDU' ? 'suspendre temporairement' : 'restaurer';
    if (!confirm(`Confirmer l'action de sécurité SI : ${actionLabel} les accès informatiques de ${conge.employe} ?`)) return;

    this.congeService.securiteSi(conge.id, newStatut, this.authService.currentUser ? `${this.authService.currentUser.prenom} ${this.authService.currentUser.nom}` : 'DSI').subscribe({
      next: (upd) => {
        conge.statutSi = upd.statutSi;
        this.snackBar.open(`Statut sécurité SI mis à jour : ${newStatut}.`, 'Fermer', { duration: 3000 });
      },
      error: (err) => alert("Erreur sécurité SI : " + (err?.error?.message || err.message))
    });
  }

  // --- ACTIONS WORKFLOW COMPATIBILITÉ ---
  approuver(conge: Conge): void {
    if (!conge.id) return;
    this.ouvrirModalValidationDrh(conge);
  }

  ouvrirModalRejet(conge: Conge): void {
    this.congeToReject = conge;
    this.motifRefusSaisi = '';
    this.dialog.open(this.rejectDialogTpl, { width: '480px' });
  }

  confirmerRejet(): void {
    if (!this.congeToReject || !this.congeToReject.id) return;
    if (!this.canValidate) {
      alert("Votre profil utilisateur n'a pas les droits nécessaires pour refuser cette demande.");
      return;
    }
    if (!this.motifRefusSaisi.trim()) {
      alert('Veuillez préciser le motif du refus.');
      return;
    }

    this.isProcessing = true;
    const user = this.authService.currentUser;
    const role = user?.role || 'VALIDATEUR';
    const currentUserNom = user ? `${user.prenom} ${user.nom} (${role})` : 'DRH';

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
    return this.conges.filter(c => c.statut && (c.statut.toUpperCase().includes('EN_ATTENTE') || c.statut === 'SOUMIS')).length;
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
      case 'EN_ATTENTE_INTERIM':
        return { background: '#fef3c7', color: '#b45309', icon: 'person', label: '1. Avis Intérim' };
      case 'EN_ATTENTE_N1':
        return { background: '#ffedd5', color: '#c2410c', icon: 'verified_user', label: '2. Visa Directeur N+1' };
      case 'EN_ATTENTE_DRH':
        return { background: '#e0f2fe', color: '#0369a1', icon: 'policy', label: '3. Contrôle DRH' };
      case 'APPROUVE':
      case 'Approuvé':
      case 'VALIDE':
        return { background: '#ecfdf5', color: '#047857', icon: 'check_circle', label: 'Titre délivré' };
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
        return { background: '#f8fafc', color: '#475569', icon: 'info', label: statut || 'Inconnu' };
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

  // --- GESTION DU CATALOGUE DES AUTRES TYPES DE CONGÉS ---
  savingAllTypes: boolean = false;

  loadTypesAbsence(): void {
    this.congeService.getTypes().subscribe({
      next: (types) => {
        this.typesAbsenceList = (types || []).map(t => ({
          ...t,
          remunere: t.remunere !== undefined ? t.remunere : true,
          tauxRemuneration: t.tauxRemuneration !== undefined ? t.tauxRemuneration : 100,
          justificatifRequis: t.justificatifRequis !== undefined ? t.justificatifRequis : false,
          typeJustificatif: t.typeJustificatif || '',
          deductibleDuSolde: !!t.deductibleDuSolde,
          actif: t.actif !== undefined ? t.actif : true,
          dureeMaxLegaleJours: t.dureeMaxLegaleJours !== undefined ? t.dureeMaxLegaleJours : 3
        }));
      },
      error: () => this.typesAbsenceList = []
    });
  }

  saveAllTypesAbsence(): void {
    this.savingAllTypes = true;
    this.congeService.batchUpdateTypes(this.typesAbsenceList).subscribe({
      next: () => {
        this.savingAllTypes = false;
        this.snackBar.open('Paramétrage des Autres Types de Congés & Absences enregistré avec succès.', 'Fermer', { duration: 3500 });
        this.loadTypesAbsence();
      },
      error: () => {
        this.savingAllTypes = false;
        this.snackBar.open('Erreur lors de l\'enregistrement des types de congés.', 'Fermer', { duration: 3500 });
      }
    });
  }

  addTypeRow(): void {
    const idx = this.typesAbsenceList.length + 1;
    const newType: TypeAbsenceConge = {
      code: 'TYPE_' + idx,
      name: 'Nouveau Type ' + idx,
      categorie: 'PERMISSION',
      dureeMaxLegaleJours: 3,
      deductibleDuSolde: false,
      sexeRequis: 'TOUS',
      remunere: true,
      tauxRemuneration: 100,
      justificatifRequis: false,
      typeJustificatif: 'Justificatif requis',
      actif: true
    };
    this.typesAbsenceList.push(newType);
  }

  deleteTypeRow(index: number, t: TypeAbsenceConge): void {
    if (t.id) {
      if (confirm(`Confirmez-vous la suppression du type "${t.name}" ?`)) {
        this.congeService.deleteType(t.id).subscribe({
          next: () => {
            this.snackBar.open('Type de congé supprimé.', 'Fermer', { duration: 3000 });
            this.loadTypesAbsence();
          },
          error: () => this.loadTypesAbsence()
        });
      }
    } else {
      this.typesAbsenceList.splice(index, 1);
    }
  }

  openAddTypeModal(): void {
    this.addTypeRow();
  }

  openEditTypeModal(t: TypeAbsenceConge): void {
    this.editingTypeAbsence = t;
    this.typeAbsenceFormModel = { ...t };
    this.showTypeModal = true;
  }

  closeTypeModal(): void {
    this.showTypeModal = false;
    this.editingTypeAbsence = null;
    this.savingTypeAbsence = false;
  }

  saveTypeAbsence(): void {
    if (!this.typeAbsenceFormModel.name || !this.typeAbsenceFormModel.name.trim()) {
      alert('Veuillez renseigner le libellé du type de congé.');
      return;
    }
    if (!this.typeAbsenceFormModel.code) {
      this.typeAbsenceFormModel.code = this.typeAbsenceFormModel.name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
    }
    this.savingTypeAbsence = true;
    if (this.editingTypeAbsence && this.editingTypeAbsence.id) {
      this.congeService.updateType(this.editingTypeAbsence.id, this.typeAbsenceFormModel).subscribe({
        next: () => {
          this.snackBar.open('Type de congé mis à jour.', 'Fermer', { duration: 3000 });
          this.closeTypeModal();
          this.loadTypesAbsence();
        },
        error: () => {
          alert('Erreur lors de la mise à jour.');
          this.savingTypeAbsence = false;
        }
      });
    } else {
      this.congeService.createType(this.typeAbsenceFormModel).subscribe({
        next: () => {
          this.snackBar.open('Nouveau type de congé enregistré dans PostgreSQL.', 'Fermer', { duration: 3000 });
          this.closeTypeModal();
          this.loadTypesAbsence();
        },
        error: () => {
          alert('Erreur lors de l\'enregistrement.');
          this.savingTypeAbsence = false;
        }
      });
    }
  }

  deleteTypeAbsence(t: TypeAbsenceConge): void {
    this.deleteTypeRow(0, t);
  }

  getAgentLeavesDetail(empId: number): Array<{ typeName: string; joursPris: number; quotaMax?: number; deductible: boolean }> {
    const agentConges = this.conges.filter(c => {
      const eId = c.employee?.id || (c as any).employeeId;
      return String(eId) === String(empId) && (c.statut === 'APPROUVE' || c.statut === 'VALIDE');
    });

    return this.typesAbsenceList.map(t => {
      const pris = agentConges
        .filter(c => (c.typeAbsenceConge?.id && c.typeAbsenceConge.id === t.id) || (c.type && c.type.toLowerCase().includes(t.name.toLowerCase())))
        .reduce((sum, c) => sum + (c.nbJours || 0), 0);
      return {
        typeName: t.name,
        joursPris: pris,
        quotaMax: t.dureeMaxLegaleJours,
        deductible: !!t.deductibleDuSolde
      };
    });
  }

  isDataUrl(val?: string): boolean {
    return !!val && val.startsWith('data:');
  }

  downloadJustificatif(conge: Conge): void {
    if (!conge || !conge.justificatif) return;
    const link = document.createElement('a');
    link.href = conge.justificatif;
    link.download = conge.justificatifNom || `justificatif_absence_${conge.id || 'doc'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

