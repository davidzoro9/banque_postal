import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrecompteService, PrecompteModel } from '../../services/precompte.service';
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
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  showDialog: boolean = false;
  editingPrecompte: PrecompteModel | null = null;
  formModel: PrecompteModel = this.getEmptyForm();
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
      const avanceElement = list.find((d: any) => {
        const code = (d.code || '').toUpperCase().trim();
        const name = (d.name || d.libelle || '').toLowerCase().trim();
        return code === 'AVANCE_SAL' || name.includes('avance sur salaire') || (code.includes('AVANCE') && !code.includes('PAT'));
      });

      if (avanceElement) {
        this.elementsList = [{
          id: avanceElement.id,
          name: 'Avance sur Salaire',
          code: avanceElement.code || 'AVANCE_SAL'
        }];
      } else {
        this.elementsList = [
          { id: 26, name: 'Avance sur Salaire', code: 'AVANCE_SAL' }
        ];
      }
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
        this.precomptesList = data.map((p: any) => ({
          id: p.id,
          precompteId: p.id,
          employeeId: p.employeeId,
          employeeName: p.employeeName || 'AGENT',
          matricule: p.matricule || 'EMP-000',
          elementSalaryId: p.salaryElementId || p.rubriquePaieId || 1,
          elementSalaryName: p.salaryElementName || p.rubriquePaieLibelle || 'Précompte',
          elementSalaryCode: p.salaryElementCode || p.rubriquePaieCode || 'PREC',
          amount: p.amount || p.montantTotal || 0,
          montantRestant: p.montantRestant !== undefined ? p.montantRestant : (p.amount || p.montantTotal || 0),
          echeance: p.echeance || p.nbMoisTotal || 12,
          statut: p.statut || 'EN_COURS'
        }));
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
        (p.elementSalaryName && p.elementSalaryName.toLowerCase().includes(q))
      );
    }
    if (this.statutFilter) {
      list = list.filter(p => p.statut === this.statutFilter);
    }
    this.filteredList = list;
  }

  onAmountChange(): void {
    if (!this.editingPrecompte) {
      this.formModel.montantRestant = this.formModel.amount;
    }
  }

  openAddModal(): void {
    this.editingPrecompte = null;
    this.formModel = this.getEmptyForm();
    if (this.elementsList && this.elementsList.length > 0) {
      this.formModel.elementSalaryId = this.elementsList[0].id;
    }
    this.agentSearchText = '';
    this.showDialog = true;
  }

  openEditModal(precompte: PrecompteModel): void {
    this.editingPrecompte = precompte;
    this.formModel = { ...precompte };
    this.agentSearchText = precompte.employeeName || '';
    this.showDialog = true;
  }

  closeModal(): void {
    this.showDialog = false;
    this.editingPrecompte = null;
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

  savePrecompte(): void {
    if (!this.formModel.employeeId || !this.formModel.elementSalaryId || !this.formModel.amount) {
      alert('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    this.isSaving = true;
    const selectedEmp = this.employeesList.find(e => String(e.id) === String(this.formModel.employeeId));
    const selectedElem = this.elementsList.find(el => String(el.id) === String(this.formModel.elementSalaryId));

    const payload: any = {
      employeeId: Number(this.formModel.employeeId),
      salaryElementId: Number(this.formModel.elementSalaryId),
      amount: Number(this.formModel.amount),
      montantRestant: this.formModel.montantRestant ? Number(this.formModel.montantRestant) : Number(this.formModel.amount),
      echeance: Number(this.formModel.echeance || 12),
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
      amount: 0,
      montantRestant: 0,
      echeance: 12,
      statut: 'EN_COURS'
    };
  }
}