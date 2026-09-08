import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AvoirService, AvoirModel } from '../../services/avoir.service';
import { EmployeeService } from '../../../grh/employes/services/employee.service';
import { Employee } from '../../../grh/employes/models/employee.model';
import { environment } from '../../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  showDialog: boolean = false;
  editingAvoir: AvoirModel | null = null;
  formModel: AvoirModel = this.getEmptyForm();
  isSaving: boolean = false;
  agentSearchText: string = '';

  get filteredEmployeesForSelect(): Employee[] {
    if (!this.agentSearchText || !this.agentSearchText.trim()) {
      return this.employeesList;
    }
    const term = this.agentSearchText.trim().toLowerCase();
    return this.employeesList.filter(emp =>
      (emp.matricule && emp.matricule.toLowerCase().includes(term)) ||
      (emp.nom && emp.nom.toLowerCase().includes(term)) ||
      (emp.prenom && emp.prenom.toLowerCase().includes(term)) ||
      (emp.fonction && emp.fonction.toLowerCase().includes(term))
    );
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
    this.http.get<any[]>(`${environment.apiUrl}/salary-elements`).pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      const list = data || [];
      const filtered = list.filter((d: any) => {
        const code = (d.code || '').toUpperCase().trim();
        const name = (d.name || d.libelle || '').toLowerCase().trim();
        return code === 'HEURE_SUP' || name.includes('heure suppl') ||
               code === 'SURSALAIRE' || name.includes('sursalaire') ||
               code === 'RAPPEL_SALAIRE' || code === 'RAPPEL' || name.includes('rappel');
      }).map((d: any) => ({
        id: d.id,
        name: d.name || d.libelle || '',
        code: d.code || d.codeRubrique || ''
      }));

      // Ordonner strictement : 1. Heure supplémentaire, 2. Sursalaire, 3. Rappel salaire
      filtered.sort((a: any, b: any) => {
        const getIdx = (item: any) => {
          const c = (item.code || '').toUpperCase();
          const n = (item.name || '').toLowerCase();
          if (c.includes('HEURE') || n.includes('heure')) return 0;
          if (c.includes('SURSALAIRE') || n.includes('sursalaire')) return 1;
          if (c.includes('RAPPEL') || n.includes('rappel')) return 2;
          return 99;
        };
        return getIdx(a) - getIdx(b);
      });

      if (filtered.length > 0) {
        this.elementsList = filtered;
      } else {
        // Fallback avec les libellés et identifiants standards
        this.elementsList = [
          { id: 3, name: 'Heure supplémentaire', code: 'HEURE_SUP' },
          { id: 4, name: 'Sursalaire', code: 'SURSALAIRE' },
          { id: 5, name: 'Rappel salaire', code: 'RAPPEL_SALAIRE' }
        ];
      }
    });
  }

  loadAvoirs(): void {
    this.loading = true;
    this.errorMessage = '';
    this.avoirService.getAll().pipe(
      catchError(err => {
        this.errorMessage = 'Erreur lors du chargement des avoirs depuis PostgreSQL.';
        return of([]);
      })
    ).subscribe(data => {
      if (data && data.length > 0) {
        this.avoirsList = data.map((a: any) => ({
          id: a.id,
          avoirId: a.id,
          employeeId: a.employeeId,
          employeeName: a.employeeName || 'AGENT',
          matricule: a.matricule || 'EMP-000',
          salaryElementId: a.salaryElementId || a.rubriquePaieId || 1,
          salaryElementName: a.salaryElementName || a.rubriquePaieLibelle || 'Gain / Prime',
          salaryElementCode: a.salaryElementCode || a.rubriquePaieCode || 'AVOIR',
          amount: a.amount || a.montant || 0,
          montantRestant: a.montantRestant !== undefined ? a.montantRestant : (a.amount || a.montant || 0),
          echeance: a.echeance || 1,
          statut: a.statut || 'ACTIF'
        }));
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
        (a.salaryElementName && a.salaryElementName.toLowerCase().includes(q))
      );
    }
    if (this.statutFilter) {
      list = list.filter(a => a.statut === this.statutFilter);
    }
    this.filteredList = list;
  }

  openAddModal(): void {
    this.editingAvoir = null;
    this.formModel = this.getEmptyForm();
    this.agentSearchText = '';
    this.showDialog = true;
  }

  openEditModal(avoir: AvoirModel): void {
    this.editingAvoir = avoir;
    this.formModel = { ...avoir };
    this.agentSearchText = avoir.employeeName || '';
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
    this.editingAvoir = null;
    this.isSaving = false;
  }

  onEmployeeSelect(): void {
    const selected = this.employeesList.find(e => String(e.id) === String(this.formModel.employeeId));
    if (selected) {
      this.formModel.employeeName = `${selected.nom} ${selected.prenom}`;
      this.formModel.matricule = selected.matricule;
      this.agentSearchText = `${selected.matricule} - ${selected.nom} ${selected.prenom}`;
    }
  }

  saveAvoir(): void {
    if (!this.formModel.employeeId || !this.formModel.salaryElementId || !this.formModel.amount) {
      alert('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    this.isSaving = true;
    const selectedEmp = this.employeesList.find(e => String(e.id) === String(this.formModel.employeeId));
    const selectedElem = this.elementsList.find(el => String(el.id) === String(this.formModel.salaryElementId));

    const payload: any = {
      employeeId: Number(this.formModel.employeeId),
      salaryElementId: Number(this.formModel.salaryElementId),
      amount: Number(this.formModel.amount),
      montantRestant: this.formModel.montantRestant ? Number(this.formModel.montantRestant) : Number(this.formModel.amount),
      echeance: 1,
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
          this.showFlash('Avoir mis à jour avec succès.');
          this.closeModal();
          this.loadAvoirs();
        },
        error: () => {
          alert('Erreur lors de la mise à jour de l\'avoir.');
          this.isSaving = false;
        }
      });
    } else {
      this.avoirService.create(payload).subscribe({
        next: () => {
          this.showFlash('Nouvel avoir enregistré dans PostgreSQL.');
          this.closeModal();
          this.loadAvoirs();
        },
        error: () => {
          alert('Erreur lors de l\'enregistrement de l\'avoir.');
          this.isSaving = false;
        }
      });
    }
  }

  deleteAvoir(avoir: AvoirModel): void {
    if (confirm(`Supprimer cet avoir pour ${avoir.employeeName} ?`)) {
      const targetId = avoir.id || avoir.avoirId!;
      this.avoirService.delete(targetId).subscribe({
        next: () => {
          this.showFlash('Avoir supprimé avec succès.');
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
      amount: 0,
      montantRestant: 0,
      echeance: 1,
      statut: 'ACTIF'
    };
  }
}