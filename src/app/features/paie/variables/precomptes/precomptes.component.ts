import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrecompteService, PrecompteModel, PrecompteVersementModel } from '../../services/precompte.service';
import { EmployeeService } from '../../../grh/employes/services/employee.service';
import { Employee } from '../../../grh/employes/models/employee.model';
import { environment } from '../../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-precomptes',
  templateUrl: './precomptes.component.html',
  styleUrls: ['./precomptes.component.scss'],
  standalone: false
})
export class PrecomptesComponent implements OnInit {
  precomptesList: PrecompteModel[] = [];
  filteredList: PrecompteModel[] = [];
  employeesList: Employee[] = [];
  elementsList: Array<{ id: number; name: string; code: string }> = [];

  searchQuery: string = '';
  statutFilter: string = '';
  elementFilter: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Sélection multiple
  selectedIds: Set<number> = new Set();
  selectAll: boolean = false;

  // Modal Création / Modification
  showDialog: boolean = false;
  editingPrecompte: PrecompteModel | null = null;
  formModel: PrecompteModel = this.getEmptyForm();
  isSaving: boolean = false;
  agentSearchText: string = '';
  showAgentDropdown: boolean = false;
  derniereMensualite: number = 0;

  // Modal Vue Détail / Historique (Image 2)
  showDetailModal: boolean = false;
  selectedPrecompte: PrecompteModel | null = null;
  loadingDetail: boolean = false;

  // Calculs KPI & Progression visuelle
  getProgress(p: PrecompteModel): number {
    const initial = Number(p.amount || 0);
    if (initial <= 0) return 100;
    const totalVers = (p.versements && p.versements.length > 0)
      ? p.versements.reduce((acc, v) => acc + (Number(v.montant) || 0), 0)
      : undefined;
    const rembourse = totalVers !== undefined ? totalVers : Number(p.montantRembourse !== undefined ? p.montantRembourse : Math.max(0, initial - Number(p.montantRestant || 0)));
    return Math.min(100, Math.max(0, Math.round((rembourse / initial) * 100)));
  }

  get totalEngage(): number {
    return this.filteredList.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  }

  get totalRembourse(): number {
    return this.filteredList.reduce((acc, p) => acc + (Number(p.montantRembourse) || 0), 0);
  }

  get totalRestant(): number {
    return this.filteredList.reduce((acc, p) => acc + (Number(p.montantRestant) || 0), 0);
  }

  get countEnCours(): number {
    return this.filteredList.filter(p => p.statut === 'EN_COURS').length;
  }

  get filteredEmployeesForSelect(): Employee[] {
    if (!this.agentSearchText || !this.agentSearchText.trim()) {
      return this.employeesList;
    }
    const terms = this.agentSearchText.trim().toLowerCase().split(/\s+/);
    return this.employeesList.filter(emp => {
      const full = `${emp.matricule || ''} ${emp.nom || ''} ${emp.prenom || ''} ${emp.fonction || ''}`.toLowerCase();
      return terms.every(t => full.includes(t));
    });
  }

  get hasPartialLastMonth(): boolean {
    const total = Number(this.formModel.amount || 0);
    const mensuel = Number(this.formModel.retenueMensuelle || 0);
    const echeance = Number(this.formModel.echeance || 0);
    return total > 0 && mensuel > 0 && echeance > 1 && (total % mensuel !== 0);
  }

  constructor(
    private precompteService: PrecompteService,
    private employeeService: EmployeeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadElements();
    this.loadPrecomptes();
  }

  loadEmployees(): void {
    this.employeeService.getAll().pipe(
      catchError(() => of([]))
    ).subscribe(emps => {
      this.employeesList = emps || [];
    });
  }

  loadElements(): void {
    this.http.get<any[]>(`${environment.apiUrl}/salary-elements`).pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      const list = data || [];

      const isRetenue = (d: any): boolean => {
        const type = (d.type || '').toUpperCase().trim();
        if (type === 'PATRONALE' || type === 'GAIN') return false;
        if (type === 'RETENUE') return true;

        const code = (d.code || '').toUpperCase().trim();
        const name = (d.name || d.libelle || '').toLowerCase().trim();
        const catName = (d.categoryName || d.salaryCategory?.name || d.salaryCategory?.libelle || '').toLowerCase().trim();

        if (catName.includes('retenue') || catName.includes('precompte') || catName.includes('précompte') || catName.includes('cotis') || catName.includes('iuts')) return true;
        if (code.startsWith('PRET_') || code.startsWith('AVANCE_') || code.startsWith('RET_') || code.startsWith('SAISIE_')) return true;
        if (name.includes('retenue') || name.includes('prêt') || name.includes('pret') || name.includes('avance') || name.includes('précompte') || name.includes('precompte')) return true;

        return false;
      };

      this.elementsList = list.filter(isRetenue).map((d: any) => ({
        id: d.id,
        name: d.name || d.libelle || d.code,
        code: d.code || ''
      }));
    });
  }

  loadPrecomptes(): void {
    this.loading = true;
    this.errorMessage = '';
    this.precompteService.getAll().pipe(
      catchError(err => {
        this.errorMessage = 'Erreur lors du chargement des précomptes depuis PostgreSQL.';
        return of([]);
      })
    ).subscribe(data => {
      if (data && data.length > 0) {
        this.precomptesList = data.map((p: any) => {
          const montantInitial = Number(p.amount || 0);
          const restant = Number(p.montantRestant !== undefined ? p.montantRestant : montantInitial);
          const rembourse = p.montantRembourse !== undefined ? Number(p.montantRembourse) : Math.max(0, montantInitial - restant);
          const ech = Number(p.echeance || 12);
          const retMens = p.retenueMensuelle !== undefined ? Number(p.retenueMensuelle) : (ech > 0 ? Math.round(montantInitial / ech) : montantInitial);

          return {
            id: p.id,
            precompteId: p.id,
            numero: p.numero || p.reference || '/',
            reference: p.reference || '/',
            motif: p.motif || '-',
            motifAnnulation: p.motifAnnulation || '-',
            dateDebut: p.dateDebut,
            employeeId: p.employeeId,
            employeeName: p.employeeName || 'AGENT',
            matricule: p.matricule || 'EMP-000',
            elementSalaryId: p.salaryElementId || 1,
            elementSalaryName: p.salaryElementName || 'AVANCE SUR SALAIRE',
            elementSalaryCode: p.salaryElementCode || 'AVANCE_SAL',
            amount: montantInitial,
            montantRestant: restant,
            montantRembourse: rembourse,
            retenueMensuelle: retMens,
            echeance: ech,
            dateEcheance: p.dateEcheance,
            statut: p.statut || 'EN_COURS',
            versements: p.versements || []
          };
        });
      } else {
        this.precomptesList = [];
      }
      this.applyFilter();
      this.loading = false;
    });
  }

  applyFilter(): void {
    let list = [...this.precomptesList];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        (p.employeeName && p.employeeName.toLowerCase().includes(q)) ||
        (p.matricule && p.matricule.toLowerCase().includes(q)) ||
        (p.elementSalaryName && p.elementSalaryName.toLowerCase().includes(q)) ||
        (p.reference && p.reference.toLowerCase().includes(q))
      );
    }
    if (this.statutFilter) {
      list = list.filter(p => p.statut === this.statutFilter);
    }
    if (this.elementFilter) {
      list = list.filter(p => p.elementSalaryName === this.elementFilter);
    }
    this.filteredList = list;
  }

  // --- SELECTION MULTIPLE ---
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.filteredList.forEach(p => {
        if (p.id) this.selectedIds.add(p.id);
      });
    } else {
      this.selectedIds.clear();
    }
  }

  toggleSelect(id?: number): void {
    if (!id) return;
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.selectAll = this.filteredList.length > 0 && this.selectedIds.size === this.filteredList.length;
  }

  isSelected(id?: number): boolean {
    return !!id && this.selectedIds.has(id);
  }

  // --- DETAIL / HISTORIQUE (Image 2) ---
  openDetailModal(p: PrecompteModel): void {
    this.selectedPrecompte = p;
    this.showDetailModal = true;
    this.loadingDetail = true;

    if (p.id) {
      this.precompteService.getById(p.id).pipe(
        catchError(err => {
          console.warn('Erreur getById:', err);
          return of(p);
        })
      ).subscribe(res => {
        if (res) {
          const versements = res.versements || p.versements || [];
          let rembourse = res.montantRembourse;
          let restant = res.montantRestant;
          if (versements.length > 0) {
            const sumVers = versements.reduce((acc: number, v: any) => acc + (Number(v.montant) || 0), 0);
            rembourse = sumVers;
            restant = Math.max(0, Number(res.amount || p.amount || 0) - sumVers);
          }
          this.selectedPrecompte = {
            ...p,
            ...res,
            montantRembourse: rembourse,
            montantRestant: restant,
            versements: versements
          };
        }
        this.loadingDetail = false;
      });
    } else {
      this.loadingDetail = false;
    }
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedPrecompte = null;
  }

  getTotalVersements(): number {
    if (!this.selectedPrecompte || !this.selectedPrecompte.versements) return 0;
    return this.selectedPrecompte.versements.reduce((acc, v) => acc + (Number(v.montant) || 0), 0);
  }

  getMontantRembourseDetail(): number {
    if (!this.selectedPrecompte) return 0;
    if (this.selectedPrecompte.versements && this.selectedPrecompte.versements.length > 0) {
      return this.getTotalVersements();
    }
    return Number(this.selectedPrecompte.montantRembourse || 0);
  }

  getSoldeRestantDetail(): number {
    if (!this.selectedPrecompte) return 0;
    const initial = Number(this.selectedPrecompte.amount || 0);
    if (this.selectedPrecompte.versements && this.selectedPrecompte.versements.length > 0) {
      return Math.max(0, initial - this.getTotalVersements());
    }
    return Number(this.selectedPrecompte.montantRestant !== undefined ? this.selectedPrecompte.montantRestant : initial);
  }

  // --- CREATION / EDITION MODAL ---
  // --- CREATION / EDITION MODAL ---
  onCalculationsChange(): void {
    const total = Number(this.formModel.amount || 0);
    const mensuel = Number(this.formModel.retenueMensuelle || 0);

    if (!this.editingPrecompte || !this.editingPrecompte.montantRembourse) {
      this.formModel.montantRestant = total;
    }

    if (total > 0 && mensuel > 0) {
      // Règle métier : l'utilisateur saisit la mensualité autorisée, le système calcule le nombre d'échéances
      const nbMois = Math.ceil(total / mensuel);
      this.formModel.echeance = nbMois;

      // Calcul de la dernière mensualité (solde éventuel si montant non multiple)
      const partiel = total - (mensuel * (nbMois - 1));
      this.derniereMensualite = partiel > 0 ? partiel : mensuel;

      // Calcul de la date d'échéance à partir de dateDebut
      if (this.formModel.dateDebut) {
        try {
          let baseDate: Date;
          if (this.formModel.dateDebut instanceof Date) {
            baseDate = new Date((this.formModel.dateDebut as Date).getTime());
          } else {
            const parts = String(this.formModel.dateDebut).split('-');
            baseDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          }
          baseDate.setMonth(baseDate.getMonth() + nbMois);
          const y = baseDate.getFullYear();
          const m = String(baseDate.getMonth() + 1).padStart(2, '0');
          const day = String(baseDate.getDate()).padStart(2, '0');
          this.formModel.dateEcheance = `${y}-${m}-${day}`;
        } catch (e) {
          // ignore date parse error
        }
      }
    } else {
      this.derniereMensualite = 0;
      if (total <= 0) {
        this.formModel.echeance = 0;
      }
    }
  }

  openAddModal(): void {
    this.editingPrecompte = null;
    this.formModel = this.getEmptyForm();
    if (this.elementsList && this.elementsList.length > 0) {
      const defaultElem = this.elementsList.find(e => e.code === 'AVANCE_SAL') || this.elementsList[0];
      this.formModel.elementSalaryId = defaultElem.id;
    }
    this.agentSearchText = '';
    this.showAgentDropdown = false;

    // Référence automatique unique générée par le backend PostgreSQL
    this.precompteService.getNextReference().subscribe({
      next: res => {
        if (res && res.reference) {
          this.formModel.reference = res.reference;
        }
      },
      error: () => {
        this.formModel.reference = `PREC-${new Date().getFullYear()}-0001`;
      }
    });

    // Date début par défaut : date du jour
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.formModel.dateDebut = `${yyyy}-${mm}-${dd}`;

    this.onCalculationsChange();
    this.showDialog = true;
  }

  openEditModal(precompte: PrecompteModel): void {
    this.editingPrecompte = precompte;
    this.formModel = { ...precompte };
    this.agentSearchText = precompte.employeeName ? `${precompte.matricule || ''} - ${precompte.employeeName}` : '';
    this.showAgentDropdown = false;
    this.onCalculationsChange();
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
    this.editingPrecompte = null;
    this.isSaving = false;
    this.showAgentDropdown = false;
  }

  selectEmployee(emp: Employee): void {
    this.formModel.employeeId = emp.id;
    this.formModel.employeeName = `${emp.nom} ${emp.prenom}`;
    this.formModel.matricule = emp.matricule;
    this.agentSearchText = `${emp.matricule} - ${emp.nom} ${emp.prenom}`;
    this.showAgentDropdown = false;
  }

  clearSelectedAgent(): void {
    this.formModel.employeeId = '';
    this.formModel.employeeName = '';
    this.formModel.matricule = '';
    this.agentSearchText = '';
    this.showAgentDropdown = true;
  }

  onAgentSearchInput(): void {
    this.showAgentDropdown = true;
    if (this.formModel.employeeId) {
      const currentLabel = `${this.formModel.matricule} - ${this.formModel.employeeName}`;
      if (this.agentSearchText !== currentLabel) {
        this.formModel.employeeId = '';
      }
    }
  }

  savePrecompte(): void {
    if (!this.formModel.employeeId || !this.formModel.elementSalaryId || !this.formModel.amount || !this.formModel.retenueMensuelle) {
      alert('Veuillez renseigner tous les champs obligatoires (Agent, Élément de salaire, Montant Total et Mensualité autorisée).');
      return;
    }

    this.isSaving = true;
    const selectedEmp = this.employeesList.find(e => String(e.id) === String(this.formModel.employeeId));
    const selectedElem = this.elementsList.find(el => String(el.id) === String(this.formModel.elementSalaryId));

    let dateDebutStr = '';
    if (this.formModel.dateDebut) {
      if (this.formModel.dateDebut instanceof Date) {
        const d = this.formModel.dateDebut as Date;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        dateDebutStr = `${y}-${m}-${day}`;
      } else {
        dateDebutStr = String(this.formModel.dateDebut).split('T')[0];
      }
    } else {
      dateDebutStr = new Date().toISOString().split('T')[0];
    }

    const payload: any = {
      employeeId: Number(this.formModel.employeeId),
      salaryElementId: Number(this.formModel.elementSalaryId),
      reference: this.formModel.reference || '',
      motif: this.formModel.motif || '-',
      motifAnnulation: this.formModel.motifAnnulation || '-',
      dateDebut: dateDebutStr,
      amount: Number(this.formModel.amount),
      montantRestant: this.formModel.montantRestant !== undefined ? Number(this.formModel.montantRestant) : Number(this.formModel.amount),
      retenueMensuelle: Number(this.formModel.retenueMensuelle || 0),
      echeance: Number(this.formModel.echeance || 1),
      dateEcheance: this.formModel.dateEcheance,
      statut: this.formModel.statut || 'EN_COURS',
      employeeName: selectedEmp ? `${selectedEmp.nom} ${selectedEmp.prenom}` : this.formModel.employeeName,
      matricule: selectedEmp ? selectedEmp.matricule : this.formModel.matricule,
      elementSalaryName: selectedElem ? selectedElem.name : this.formModel.elementSalaryName,
      elementSalaryCode: selectedElem ? selectedElem.code : this.formModel.elementSalaryCode
    };

    if (this.editingPrecompte && (this.editingPrecompte.id || this.editingPrecompte.precompteId)) {
      const targetId = this.editingPrecompte.id || this.editingPrecompte.precompteId!;
      this.precompteService.update(targetId, payload).subscribe({
        next: () => {
          this.showFlash('Précompte mis à jour avec succès.');
          this.closeModal();
          this.loadPrecomptes();
        },
        error: () => {
          alert('Erreur lors de la mise à jour du précompte.');
          this.isSaving = false;
        }
      });
    } else {
      this.precompteService.create(payload).subscribe({
        next: () => {
          this.showFlash('Nouveau précompte enregistré dans PostgreSQL.');
          this.closeModal();
          this.loadPrecomptes();
        },
        error: () => {
          alert('Erreur lors de l\'enregistrement du précompte.');
          this.isSaving = false;
        }
      });
    }
  }

  deletePrecompte(precompte: PrecompteModel): void {
    if (confirm(`Confirmez-vous la suppression de ce précompte pour ${precompte.employeeName} ?`)) {
      const targetId = precompte.id || precompte.precompteId!;
      this.precompteService.delete(targetId).subscribe({
        next: () => {
          this.showFlash('Précompte supprimé avec succès.');
          this.loadPrecomptes();
        },
        error: () => alert('Erreur lors de la suppression.')
      });
    }
  }

  private showFlash(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 4000);
  }

  private getEmptyForm(): PrecompteModel {
    return {
      employeeId: '',
      elementSalaryId: 0,
      reference: '',
      motif: '',
      motifAnnulation: '-',
      amount: undefined as any,
      montantRestant: undefined as any,
      retenueMensuelle: undefined as any,
      echeance: 0,
      dateDebut: new Date(),
      dateEcheance: '',
      statut: 'EN_COURS'
    };
  }
}