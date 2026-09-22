import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AvoirService, AvoirModel, AvoirVersementModel } from '../../services/avoir.service';
import { EmployeeService } from '../../../grh/employes/services/employee.service';
import { Employee } from '../../../grh/employes/models/employee.model';
import { environment } from '../../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-avoirs',
  templateUrl: './avoirs.component.html',
  styleUrls: ['./avoirs.component.scss'],
  standalone: false
})
export class AvoirsComponent implements OnInit {
  avoirsList: AvoirModel[] = [];
  filteredList: AvoirModel[] = [];
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
  editingAvoir: AvoirModel | null = null;
  formModel: AvoirModel = this.getEmptyForm();
  isSaving: boolean = false;
  agentSearchText: string = '';
  showAgentDropdown: boolean = false;

  // Modal Vue Détail / Historique (Image 2)
  showDetailModal: boolean = false;
  selectedAvoir: AvoirModel | null = null;
  loadingDetail: boolean = false;

  // Calculs KPI
  get totalEngage(): number {
    return this.filteredList.reduce((acc, a) => acc + (Number(a.amount) || 0), 0);
  }

  get countActifs(): number {
    return this.filteredList.filter(a => a.statut === 'ACTIF').length;
  }

  get countBeneficiaires(): number {
    const set = new Set(this.filteredList.map(a => a.employeeId).filter(id => !!id));
    return set.size;
  }

  get montantMoyen(): number {
    if (this.filteredList.length === 0) return 0;
    return Math.round(this.totalEngage / this.filteredList.length);
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

  constructor(
    private avoirService: AvoirService,
    private employeeService: EmployeeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadElements();
    this.loadAvoirs();
  }

  loadEmployees(): void {
    this.employeeService.getAll().pipe(
      catchError(() => of([]))
    ).subscribe(emps => {
      this.employeesList = emps || [];
    });
  }

  loadElements(): void {
    forkJoin({
      categories: this.http.get<any[]>(`${environment.apiUrl}/salary-categories`).pipe(catchError(() => of([]))),
      elements: this.http.get<any[]>(`${environment.apiUrl}/salary-elements`).pipe(catchError(() => of([])))
    }).subscribe(({ categories, elements }) => {
      const catList = categories || [];
      const elList = elements || [];

      // Identifie les catégories parentes "AVOIR"
      const avoirCatIds = new Set(
        catList
          .filter(c => {
            const name = (c.name || '').toUpperCase().trim();
            const code = (c.code || '').toUpperCase().trim();
            return name.includes('AVOIR') || code.includes('AVOIR');
          })
          .map(c => Number(c.id))
      );

      // Ne retenir STRICTEMENT que les éléments de salaire paramétrés avec la catégorie parente AVOIR
      const filtered = elList.filter(d => {
        const type = (d.type || '').toUpperCase().trim();
        if (type === 'RETENUE' || type === 'PATRONALE') return false;

        const catId = Number(d.categoryId != null ? d.categoryId : d.salaryCategoryId);
        if (catId && avoirCatIds.has(catId)) return true;

        const catName = (d.categoryName || d.salaryCategory?.name || '').toUpperCase().trim();
        const catCode = (d.categoryCode || d.salaryCategory?.code || '').toUpperCase().trim();
        if (catName.includes('AVOIR') || catCode.includes('AVOIR')) return true;

        return false;
      }).map((d: any) => ({
        id: d.id,
        name: d.name || d.libelle || '',
        code: d.code || d.codeRubrique || ''
      }));

      // Tri : Salaire de base en premier, puis Sursalaire, puis tri alphabétique
      filtered.sort((a, b) => {
        const getIdx = (item: any) => {
          const c = (item.code || '').toUpperCase();
          const n = (item.name || '').toLowerCase();
          if (c.includes('SAL_BASE') || (n.includes('salaire') && n.includes('base'))) return 0;
          if (c.includes('SURSALAIRE') || n.includes('sursalaire')) return 1;
          return 10;
        };
        const diff = getIdx(a) - getIdx(b);
        if (diff !== 0) return diff;
        return (a.name || '').localeCompare(b.name || '');
      });

      this.elementsList = filtered;
    });
  }

  loadAvoirs(): void {
    this.loading = true;
    this.errorMessage = '';
    this.avoirService.getAll().pipe(
      catchError(err => {
        this.errorMessage = 'Erreur lors du chargement des rappels depuis PostgreSQL.';
        return of([]);
      })
    ).subscribe(data => {
      if (data && data.length > 0) {
        this.avoirsList = data.map((a: any) => {
          const montantTotal = Number(a.amount || a.montant || 0);
          const restant = Number(a.montantRestant !== undefined ? a.montantRestant : montantTotal);
          const verse = a.montantVerse !== undefined ? Number(a.montantVerse) : Math.max(0, montantTotal - restant);
          const ech = Number(a.echeance || 1);
          const versMens = a.versementMensuel !== undefined ? Number(a.versementMensuel) : (ech > 0 ? Math.round(montantTotal / ech) : montantTotal);

          return {
            id: a.id,
            avoirId: a.id,
            numero: a.numero || a.reference || '/',
            reference: a.reference || '/',
            motif: a.motif || '-',
            motifAnnulation: a.motifAnnulation || '-',
            dateDebut: a.dateDebut,
            employeeId: a.employeeId,
            employeeName: a.employeeName || 'AGENT',
            matricule: a.matricule || 'EMP-000',
            salaryElementId: a.salaryElementId || a.rubriquePaieId || 1,
            salaryElementName: a.salaryElementName || a.rubriquePaieLibelle || 'RAPPEL DE SALAIRE',
            salaryElementCode: a.salaryElementCode || a.rubriquePaieCode || 'RAPPEL_SALAIRE',
            amount: montantTotal,
            montantRestant: restant,
            montantVerse: verse,
            versementMensuel: versMens,
            echeance: ech,
            dateEcheance: a.dateEcheance,
            statut: a.statut || 'ACTIF',
            versements: a.versements || []
          };
        });
      } else {
        this.avoirsList = [];
      }
      this.applyFilter();
      this.loading = false;
    });
  }

  applyFilter(): void {
    let list = [...this.avoirsList];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(a =>
        (a.employeeName && a.employeeName.toLowerCase().includes(q)) ||
        (a.matricule && a.matricule.toLowerCase().includes(q)) ||
        (a.salaryElementName && a.salaryElementName.toLowerCase().includes(q)) ||
        (a.reference && a.reference.toLowerCase().includes(q)) ||
        (a.motif && a.motif.toLowerCase().includes(q))
      );
    }
    if (this.statutFilter) {
      list = list.filter(a => a.statut === this.statutFilter);
    }
    if (this.elementFilter) {
      list = list.filter(a => a.salaryElementName === this.elementFilter);
    }
    this.filteredList = list;
  }

  // --- SELECTION MULTIPLE ---
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.filteredList.forEach(a => {
        if (a.id) this.selectedIds.add(a.id);
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
  openDetailModal(a: AvoirModel): void {
    this.selectedAvoir = a;
    this.showDetailModal = true;
    this.loadingDetail = true;

    if (a.id) {
      this.avoirService.getById(a.id).pipe(
        catchError(err => {
          console.warn('Erreur getById:', err);
          return of(a);
        })
      ).subscribe(res => {
        if (res) {
          const versements = res.versements || a.versements || [];
          let verse = res.montantVerse;
          let restant = res.montantRestant;
          if (versements.length > 0) {
            const sumVers = versements.reduce((acc: number, v: any) => acc + (Number(v.montant) || 0), 0);
            verse = sumVers;
            restant = Math.max(0, Number(res.amount || a.amount || 0) - sumVers);
          }
          this.selectedAvoir = {
            ...a,
            ...res,
            montantVerse: verse,
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
    this.selectedAvoir = null;
  }

  getTotalVersements(): number {
    if (!this.selectedAvoir || !this.selectedAvoir.versements) return 0;
    return this.selectedAvoir.versements.reduce((acc, v) => acc + (Number(v.montant) || 0), 0);
  }

  getMontantVerseDetail(): number {
    if (!this.selectedAvoir) return 0;
    if (this.selectedAvoir.versements && this.selectedAvoir.versements.length > 0) {
      return this.getTotalVersements();
    }
    return Number(this.selectedAvoir.montantVerse || 0);
  }

  getSoldeRestantDetail(): number {
    if (!this.selectedAvoir) return 0;
    const initial = Number(this.selectedAvoir.amount || 0);
    if (this.selectedAvoir.versements && this.selectedAvoir.versements.length > 0) {
      return Math.max(0, initial - this.getTotalVersements());
    }
    return Number(this.selectedAvoir.montantRestant !== undefined ? this.selectedAvoir.montantRestant : initial);
  }

  // --- CREATION / EDITION MODAL ---
  openAddModal(): void {
    this.editingAvoir = null;
    this.formModel = this.getEmptyForm();
    if (this.elementsList && this.elementsList.length > 0) {
      const defaultElem = this.elementsList.find(e => e.code?.includes('RAPPEL')) || this.elementsList[0];
      this.formModel.salaryElementId = defaultElem.id;
    }
    this.agentSearchText = '';
    this.showAgentDropdown = false;

    // Référence automatique pour les rappels / avoirs
    this.avoirService.getNextReference().subscribe({
      next: res => {
        if (res && res.reference) {
          this.formModel.reference = res.reference;
        }
      },
      error: () => {
        this.formModel.reference = `AVR-${new Date().getFullYear()}-0001`;
      }
    });

    this.showDialog = true;
  }

  openEditModal(avoir: AvoirModel): void {
    this.editingAvoir = avoir;
    this.formModel = {
      ...avoir,
      employeeId: avoir.employeeId,
      salaryElementId: avoir.salaryElementId,
      reference: avoir.reference || '',
      motif: avoir.motif || '',
      dateDebut: avoir.dateDebut,
      amount: avoir.amount,
      montantRestant: avoir.montantRestant,
      echeance: 1, // Rappel ponctuel
      dateEcheance: avoir.dateEcheance,
      statut: avoir.statut || 'ACTIF'
    };
    this.agentSearchText = avoir.employeeName ? `${avoir.matricule || ''} - ${avoir.employeeName}` : '';
    this.showAgentDropdown = false;
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
    this.editingAvoir = null;
    this.isSaving = false;
    this.showAgentDropdown = false;
  }

  selectEmployeeById(empId: any): void {
    const emp = this.employeesList.find(e => String(e.id) === String(empId));
    if (emp) {
      this.formModel.employeeId = emp.id;
      this.formModel.employeeName = `${emp.nom} ${emp.prenom}`;
      this.formModel.matricule = emp.matricule;
    }
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

  saveAvoir(): void {
    if (!this.formModel.employeeId || !this.formModel.salaryElementId || !this.formModel.amount) {
      alert('Veuillez renseigner tous les champs obligatoires (Agent, Élément de salaire, Montant du rappel).');
      return;
    }

    this.isSaving = true;
    const selectedEmp = this.employeesList.find(e => String(e.id) === String(this.formModel.employeeId));
    const selectedElem = this.elementsList.find(el => String(el.id) === String(this.formModel.salaryElementId));

    const totalAmount = Number(this.formModel.amount);

    // Formatage de la date sélectionnée via MatDatepicker (Date ou chaîne) en YYYY-MM-DD
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
      salaryElementId: Number(this.formModel.salaryElementId),
      reference: this.formModel.reference ? this.formModel.reference.trim() : '',
      motif: this.formModel.motif ? this.formModel.motif.trim() : 'Rappel ou régularisation de gain',
      dateDebut: dateDebutStr,
      amount: totalAmount,
      montantRestant: totalAmount,
      echeance: 1, // Règle métier : pas d'échéancier pour un rappel, versé en 1 seule fois
      dateEcheance: dateDebutStr,
      statut: this.formModel.statut || 'ACTIF',
      employeeName: selectedEmp ? `${selectedEmp.nom} ${selectedEmp.prenom}` : this.formModel.employeeName,
      matricule: selectedEmp ? selectedEmp.matricule : this.formModel.matricule,
      salaryElementName: selectedElem ? selectedElem.name : this.formModel.salaryElementName,
      salaryElementCode: selectedElem ? selectedElem.code : this.formModel.salaryElementCode
    };

    if (this.editingAvoir && (this.editingAvoir.id || this.editingAvoir.avoirId)) {
      const targetId = this.editingAvoir.id || this.editingAvoir.avoirId!;
      this.avoirService.update(targetId, payload).subscribe({
        next: () => {
          this.showFlash('Rappel mis à jour avec succès.');
          this.closeModal();
          this.loadAvoirs();
        },
        error: () => {
          alert('Erreur lors de la mise à jour du rappel.');
          this.isSaving = false;
        }
      });
    } else {
      this.avoirService.create(payload).subscribe({
        next: () => {
          this.showFlash('Nouveau rappel enregistré dans PostgreSQL.');
          this.closeModal();
          this.loadAvoirs();
        },
        error: () => {
          alert('Erreur lors de l\'enregistrement du rappel.');
          this.isSaving = false;
        }
      });
    }
  }

  deleteAvoir(avoir: AvoirModel): void {
    if (confirm(`Supprimer ce rappel pour ${avoir.employeeName} ?`)) {
      const targetId = avoir.id || avoir.avoirId!;
      this.avoirService.delete(targetId).subscribe({
        next: () => {
          this.showFlash('Rappel supprimé avec succès.');
          this.loadAvoirs();
        },
        error: () => alert('Erreur lors de la suppression.')
      });
    }
  }

  private showFlash(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 4000);
  }

  private getEmptyForm(): AvoirModel {
    return {
      employeeId: '',
      salaryElementId: 0,
      reference: '',
      motif: '',
      dateDebut: new Date(),
      amount: undefined as any,
      montantRestant: undefined as any,
      echeance: 1,
      statut: 'ACTIF'
    };
  }
}